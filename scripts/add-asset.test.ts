import { test } from 'node:test';
import { strict as assert } from 'node:assert';

import { toCamelCaseKey, detectMediaType, parseAddAssetArgs } from './add-asset';

// Sanity test
test('test harness works', () => {
  assert.equal(1 + 1, 2);
});

// ---------- toCamelCaseKey ----------

test('toCamelCaseKey: simple kebab', () => {
  assert.equal(toCamelCaseKey('jack-new-cut.jpg'), 'jackNewCut');
});

test('toCamelCaseKey: with underscores', () => {
  assert.equal(toCamelCaseKey('hero_video_v2.mp4'), 'heroVideoV2');
});

test('toCamelCaseKey: with spaces (treated like separators)', () => {
  assert.equal(toCamelCaseKey('Studio Walkthrough.mp4'), 'studioWalkthrough');
});

test('toCamelCaseKey: mixed separators', () => {
  assert.equal(toCamelCaseKey('Portfolio - 08 - Final.jpg'), 'portfolio08Final');
});

test('toCamelCaseKey: ignores extension', () => {
  assert.equal(toCamelCaseKey('logo.png'), 'logo');
  assert.equal(toCamelCaseKey('logo.jpeg'), 'logo');
});

test('toCamelCaseKey: full path is OK', () => {
  assert.equal(toCamelCaseKey('/home/user/Pictures/jack-new.jpg'), 'jackNew');
});

test('toCamelCaseKey: numbers are kept', () => {
  assert.equal(toCamelCaseKey('image-01.jpg'), 'image01');
});

test('toCamelCaseKey: throws on empty result', () => {
  assert.throws(() => toCamelCaseKey('.jpg'));
  assert.throws(() => toCamelCaseKey('___.jpg'));
});

test('toCamelCaseKey: starts with letter (not number)', () => {
  assert.equal(toCamelCaseKey('123-team.jpg'), 'asset123Team');
});

// ---------- detectMediaType ----------

test('detectMediaType: image extensions', () => {
  assert.equal(detectMediaType('photo.jpg'), 'image');
  assert.equal(detectMediaType('photo.JPEG'), 'image');
  assert.equal(detectMediaType('photo.png'), 'image');
  assert.equal(detectMediaType('photo.webp'), 'image');
  assert.equal(detectMediaType('photo.heic'), 'image');
});

test('detectMediaType: video extensions', () => {
  assert.equal(detectMediaType('video.mp4'), 'video');
  assert.equal(detectMediaType('video.MOV'), 'video');
  assert.equal(detectMediaType('video.webm'), 'video');
});

test('detectMediaType: throws on unknown', () => {
  assert.throws(() => detectMediaType('document.pdf'));
  assert.throws(() => detectMediaType('archive.zip'));
  assert.throws(() => detectMediaType('noext'));
});

// ---------- parseAddAssetArgs ----------

test('parseAddAssetArgs: single positional', () => {
  const result = parseAddAssetArgs(['./photo.jpg']);
  assert.deepEqual(result, {
    filePath: './photo.jpg',
    key: undefined,
    type: undefined,
    force: false,
    dryRun: false,
  });
});

test('parseAddAssetArgs: with --key', () => {
  const result = parseAddAssetArgs(['./photo.jpg', '--key', 'teamJack2']);
  assert.equal(result.key, 'teamJack2');
});

test('parseAddAssetArgs: with --type', () => {
  const result = parseAddAssetArgs(['./video.mp4', '--type', 'video']);
  assert.equal(result.type, 'video');
});

test('parseAddAssetArgs: --type validates value', () => {
  assert.throws(() => parseAddAssetArgs(['./x.jpg', '--type', 'audio']));
});

test('parseAddAssetArgs: --force and --dry-run', () => {
  const result = parseAddAssetArgs(['./x.jpg', '--force', '--dry-run']);
  assert.equal(result.force, true);
  assert.equal(result.dryRun, true);
});

test('parseAddAssetArgs: throws on missing file', () => {
  assert.throws(() => parseAddAssetArgs([]));
  assert.throws(() => parseAddAssetArgs(['--key', 'foo']));
});
