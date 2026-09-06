import assert from 'node:assert/strict';
import test from 'node:test';

import { isAllowedEvent, isCustomEvent, isServerForwarded, sanitizeCustomData, validateTrackRequest } from './events';
import { isValidEventId, newEventId } from './eventId';
import { deriveFbc, hashIdentifier, readCookie, getClientIp } from './identity';
import { __resetRateLimit, checkRateLimit } from './rateLimit';

const NOW = 1_760_000_000;
const base = {
  event_name: 'BookNowClick',
  event_id: 'a1b2c3d4-0000-4000-8000-000000000000',
  event_time: NOW,
  event_source_url: 'https://www.prax.studio/team',
  consent: 'granted',
  custom_data: { content_type: 'booking' },
};

/* ── Event contract ──────────────────────────────────────────────────────── */

// Squire runs its own Conversions API connection on this dataset reporting
// COMPLETED appointments. Emitting Schedule here would double-count real
// bookings against that feed, undeduplicatably, since Squire's events do not
// carry our event_id. We report intent; Squire reports outcome.
test('Schedule is never an allowed event — Squire is the authoritative source', () => {
  assert.equal(isAllowedEvent('Schedule'), false);
  const res = validateTrackRequest({ ...base, event_name: 'Schedule' }, NOW);
  assert.equal(res.ok, false);
});

test('Lead is not allowed until a real lead surface exists', () => {
  assert.equal(isAllowedEvent('Lead'), false);
});

test('BookNowClick is a custom event, PageView is standard', () => {
  assert.equal(isCustomEvent('BookNowClick'), true);
  assert.equal(isCustomEvent('PageView' as never), false);
});

test('PageView is not forwarded to the server (duplicate-risk control)', () => {
  assert.equal(isServerForwarded('PageView'), false);
  assert.equal(isServerForwarded('BookNowClick'), true);
  assert.equal(isServerForwarded('Contact'), true);
  assert.equal(isServerForwarded('ViewContent'), true);
});

/* ── Payload validation ──────────────────────────────────────────────────── */

test('accepts a well-formed event', () => {
  const res = validateTrackRequest(base, NOW);
  assert.equal(res.ok, true);
  if (res.ok) assert.equal(res.value.event_name, 'BookNowClick');
});

test('rejects an unknown event name', () => {
  assert.equal(validateTrackRequest({ ...base, event_name: 'Purchase' }, NOW).ok, false);
});

test('rejects a source URL on a host we do not control', () => {
  const res = validateTrackRequest({ ...base, event_source_url: 'https://evil.example/x' }, NOW);
  assert.equal(res.ok, false);
  if (!res.ok) assert.equal(res.reason, 'source_url_untrusted_host');
});

test('rejects stale and future event times', () => {
  assert.equal(validateTrackRequest({ ...base, event_time: NOW - 8 * 24 * 3600 }, NOW).ok, false);
  assert.equal(validateTrackRequest({ ...base, event_time: NOW + 3600 }, NOW).ok, false);
});

test('rejects malformed event ids', () => {
  assert.equal(validateTrackRequest({ ...base, event_id: 'has spaces' }, NOW).ok, false);
  assert.equal(validateTrackRequest({ ...base, event_id: 'x'.repeat(65) }, NOW).ok, false);
});

test('denied consent survives validation so the route can drop it', () => {
  const res = validateTrackRequest({ ...base, consent: 'denied' }, NOW);
  assert.equal(res.ok, true);
  if (res.ok) assert.equal(res.value.consent, 'denied');
});

test('anything not explicitly consented is treated as denied', () => {
  const res = validateTrackRequest({ ...base, consent: 'maybe' }, NOW);
  if (res.ok) assert.equal(res.value.consent, 'denied');
});

/* ── Custom data ─────────────────────────────────────────────────────────── */

test('drops unknown custom_data keys instead of forwarding them', () => {
  const out = sanitizeCustomData({ content_type: 'booking', email: 'a@b.com', value: 500 });
  assert.deepEqual(out, { content_type: 'booking' });
  assert.equal('email' in out, false);
});

test('clamps long strings and caps content_ids', () => {
  const out = sanitizeCustomData({
    content_name: 'x'.repeat(500),
    content_ids: Array.from({ length: 50 }, (_, i) => `id-${i}`),
  });
  assert.equal((out.content_name as string).length, 200);
  assert.equal((out.content_ids as string[]).length, 10);
});

/* ── Event ids ───────────────────────────────────────────────────────────── */

test('generated event ids are valid, unique, and namespaced to this property', () => {
  const ids = new Set(Array.from({ length: 500 }, () => newEventId()));
  assert.equal(ids.size, 500);
  for (const id of ids) {
    assert.equal(isValidEventId(id), true);
    // PRAX Academy shares this dataset and prefixes with acad_.
    assert.ok(id.startsWith('studio_'), 'event id must be namespaced');
    assert.ok(id.length <= 64, 'prefix must not push the id past the length cap');
  }
});

/* ── Identity ────────────────────────────────────────────────────────────── */

test('hashes match Meta normalization rules', () => {
  // Same identity, different formatting, must produce the same hash.
  assert.equal(hashIdentifier('email', '  Test@Example.COM '), hashIdentifier('email', 'test@example.com'));
  assert.equal(hashIdentifier('phone', '+1 (626) 555-0142'), hashIdentifier('phone', '16265550142'));
  assert.equal(hashIdentifier('first_name', ' Jack  '), hashIdentifier('first_name', 'jack'));
});

test('hashing produces hex sha256 and ignores empty input', () => {
  const hash = hashIdentifier('email', 'test@example.com');
  assert.match(hash!, /^[0-9a-f]{64}$/);
  assert.equal(hashIdentifier('email', '   '), undefined);
});

test('client ip prefers the first x-forwarded-for hop', () => {
  const h = new Headers({ 'x-forwarded-for': '203.0.113.5, 70.41.3.18' });
  assert.equal(getClientIp(h), '203.0.113.5');
  assert.equal(getClientIp(new Headers({ 'x-real-ip': '198.51.100.7' })), '198.51.100.7');
  assert.equal(getClientIp(new Headers()), undefined);
});

test('reads only the requested cookie', () => {
  const header = '_fbp=fb.1.123.456; other=zzz; _fbc=fb.1.999.abc';
  assert.equal(readCookie(header, '_fbp'), 'fb.1.123.456');
  assert.equal(readCookie(header, '_fbc'), 'fb.1.999.abc');
  assert.equal(readCookie(header, 'missing'), undefined);
  assert.equal(readCookie(null, '_fbp'), undefined);
});

test('derives fbc in the format Meta expects', () => {
  assert.equal(deriveFbc('AbCd123', 1700000000000), 'fb.1.1700000000000.AbCd123');
});

/* ── Rate limiting ───────────────────────────────────────────────────────── */

test('rate limit allows a burst then blocks, and resets after the window', () => {
  __resetRateLimit();
  const now = Date.now();
  for (let i = 0; i < 60; i++) assert.equal(checkRateLimit('1.2.3.4', now), true);
  assert.equal(checkRateLimit('1.2.3.4', now), false);
  assert.equal(checkRateLimit('5.6.7.8', now), true, 'other clients unaffected');
  assert.equal(checkRateLimit('1.2.3.4', now + 61_000), true, 'window resets');
});
