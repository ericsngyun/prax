import { NextRequest, NextResponse } from 'next/server';

const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="#0d0d0d">
  <title>PRAX — Site Maintenance</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; }
    body {
      background: #0d0d0d;
      color: #ede9e3;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "Helvetica Neue", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.25rem;
      letter-spacing: 0.005em;
    }
    .container {
      width: 100%;
      max-width: 36rem;
      text-align: center;
    }
    .wordmark {
      font-size: 0.75rem;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: #6e6e6e;
      margin-bottom: 2.5rem;
      font-weight: 500;
    }
    h1 {
      font-size: clamp(1.875rem, 5vw, 2.875rem);
      font-weight: 400;
      letter-spacing: -0.02em;
      line-height: 1.15;
      margin-bottom: 1.25rem;
      color: #fafafa;
    }
    .lede {
      font-size: 1rem;
      line-height: 1.65;
      color: #a3a3a3;
      margin: 0 auto 2.5rem;
      max-width: 28rem;
    }

    /* Update card — mirrors the hero relocation card */
    .update {
      position: relative;
      border: 1px solid rgba(237, 233, 227, 0.15);
      background: rgba(8, 8, 8, 0.4);
      padding: 1.5rem 1.5rem 1.25rem;
      text-align: center;
      margin: 0 auto 2.5rem;
    }
    @media (min-width: 600px) {
      .update { padding: 2rem 2.25rem 1.75rem; }
    }
    .update::before, .update::after,
    .update > .tick-bl, .update > .tick-br {
      content: "";
      position: absolute;
      width: 0.625rem;
      height: 0.625rem;
      pointer-events: none;
    }
    .update::before { top: -1px; left: -1px; border-top: 1px solid rgba(237,233,227,0.7); border-left: 1px solid rgba(237,233,227,0.7); }
    .update::after  { top: -1px; right: -1px; border-top: 1px solid rgba(237,233,227,0.7); border-right: 1px solid rgba(237,233,227,0.7); }
    .update .tick-bl { bottom: -1px; left: -1px; border-bottom: 1px solid rgba(237,233,227,0.7); border-left: 1px solid rgba(237,233,227,0.7); }
    .update .tick-br { bottom: -1px; right: -1px; border-bottom: 1px solid rgba(237,233,227,0.7); border-right: 1px solid rgba(237,233,227,0.7); }

    .update-label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.875rem;
      font-size: 0.6875rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: rgba(237, 233, 227, 0.75);
      margin-bottom: 1.25rem;
    }
    .update-label::before, .update-label::after {
      content: "";
      display: inline-block;
      width: 1.75rem;
      height: 1px;
      background: rgba(237, 233, 227, 0.3);
    }
    .timeline p {
      font-size: 0.9375rem;
      line-height: 1.65;
      color: rgba(163, 163, 163, 0.85);
      font-weight: 300;
      margin-bottom: 0.625rem;
    }
    .timeline p:last-child { margin-bottom: 0; }
    .timeline strong {
      color: #ede9e3;
      font-weight: 400;
    }

    .divider {
      height: 1px;
      background: rgba(237, 233, 227, 0.1);
      margin: 1.25rem 0 1rem;
    }

    .address-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    @media (min-width: 600px) {
      .address-block {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        text-align: left;
      }
    }
    .address {
      display: flex;
      gap: 0.625rem;
      align-items: flex-start;
      text-align: center;
    }
    @media (min-width: 600px) {
      .address { text-align: left; }
    }
    .address svg {
      flex-shrink: 0;
      margin-top: 3px;
      color: rgba(237, 233, 227, 0.65);
    }
    .address .label {
      font-size: 0.625rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(237, 233, 227, 0.45);
      margin-bottom: 0.125rem;
    }
    .address address {
      font-style: normal;
      font-size: 0.875rem;
      color: #ede9e3;
      line-height: 1.4;
    }
    .address address span {
      display: block;
      color: #a3a3a3;
    }
    .directions {
      font-size: 0.6875rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(237, 233, 227, 0.8);
      text-decoration: none;
      border-bottom: 1px solid rgba(237, 233, 227, 0.3);
      padding-bottom: 2px;
      transition: color 0.2s ease, border-color 0.2s ease;
      white-space: nowrap;
    }
    .directions:hover, .directions:focus-visible {
      color: #ede9e3;
      border-bottom-color: #ede9e3;
      outline: none;
    }

    .footer {
      font-size: 0.8125rem;
      color: #6e6e6e;
    }
    .footer a {
      color: #a3a3a3;
      text-decoration: none;
      border-bottom: 1px solid #2d2d2d;
      padding-bottom: 1px;
      margin: 0 0.5rem;
      transition: color 0.2s ease, border-color 0.2s ease;
    }
    .footer a:hover, .footer a:focus-visible {
      color: #ede9e3;
      border-bottom-color: #6e6e6e;
      outline: none;
    }
    @media (prefers-reduced-motion: reduce) {
      * { transition: none !important; animation: none !important; }
    }
  </style>
</head>
<body>
  <main class="container">
    <div class="wordmark">PRAX</div>
    <h1>We're refreshing the site.</h1>
    <p class="lede">The studio is mid-relocation. Thanks for your patience while we tune things up — bookings resume soon at our new Arcadia location.</p>

    <section class="update" aria-label="Important update">
      <span class="tick-bl" aria-hidden="true"></span>
      <span class="tick-br" aria-hidden="true"></span>

      <div class="update-label">Important Update</div>

      <div class="timeline">
        <p>Starting <strong>April 20th</strong>, bookings at our West Adams studio are closed as we transition to our new space.</p>
        <p>We are pausing all bookings from <strong>April 20th through May 5th</strong> while we finalize the shop and prepare for opening.</p>
        <p>Our soft opening at the new <strong>Prax Arcadia</strong> location begins <strong>May 6th</strong>, and bookings will resume starting that date.</p>
      </div>

      <div class="divider"></div>

      <div class="address-block">
        <div class="address">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1.5c-2.8 0-5 2.2-5 5 0 3.75 5 8 5 8s5-4.25 5-8c0-2.8-2.2-5-5-5z" stroke="currentColor" stroke-width="1"/>
            <circle cx="8" cy="6.5" r="1.4" stroke="currentColor" stroke-width="1"/>
          </svg>
          <div>
            <p class="label">New Location</p>
            <address>142 E Huntington Drive<span>Arcadia, CA 91006</span></address>
          </div>
        </div>
        <a class="directions" href="https://www.google.com/maps/search/?api=1&amp;query=142+E+Huntington+Drive+Arcadia+CA+91006" target="_blank" rel="noopener noreferrer">Get Directions →</a>
      </div>
    </section>

    <div class="footer">
      <a href="https://www.instagram.com/praxhair/" rel="noopener" target="_blank">Instagram</a>
      <a href="https://www.tiktok.com/@praxhair" rel="noopener" target="_blank">TikTok</a>
    </div>
  </main>
</body>
</html>`;

export function middleware(_request: NextRequest) {
  return new NextResponse(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '3600',
      'Cache-Control': 'no-store, must-revalidate',
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|icon-192\\.png|icon-512\\.png|apple-touch-icon\\.png|og-image\\.jpg|manifest\\.json|sw\\.js|offline\\.html|robots\\.txt|sitemap\\.xml).*)',
  ],
};
