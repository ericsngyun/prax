# PRAX — iPhone 17 Staff-First Booking Mockups

A polished five-screen concept for a minimal PRAX mobile booking experience. The set uses the current `ericsngyun/prax` roster, current repository portraits, exact PRAX logo assets, and prices verified against each artist’s public Squire profile on August 19, 2026.

The direction is intentionally restrained: optic white, deep black, monochrome staff photography, large readable type, and one clear action per screen. It is designed to look credible inside premium iPhone 17 mockups rather than like campaign artwork pasted into a phone.

## Screens

1. `01-home` — focused booking entry with Jack Louii and studio-level starting prices
2. `02-artists` — all current staff, portrait, role, haircut price, and haircut-plus-beard price
3. `03-artist-jack` — Jack’s complete six-service Squire price menu
4. `04-booking` — selected artist/service, date and time selection, summary, and sticky review action
5. `05-confirmed` — compact confirmation with artist, service, price, date, time, and address

Every screen is supplied as:

- PNG: `1206 × 2622 px`, lossless and ready for UltraMock
- WebP: `1206 × 2622 px`, compact preview
- SVG: editable `402 × 874 pt` master with embedded photography and type

## Included assets

- `brand/` — exact current-repository PRAX wordmark, mark, and lockups, plus derived black treatments
- `source-photography/staff/` — the six exact portraits selected by the current team page
- `data/staff-pricing.json` — structured roster, services, prices, durations, booking URLs, and provenance
- `STAFF-AND-PRICING.md` — human-readable rate sheet
- `MOBILE-UI-NOTES.md` — implementation and accessibility guidance
- `ULTRAMOCK-GUIDE.md` — recommended device, scene, and export settings
- `SOURCE-MANIFEST.md` — repository, image, Squire, and device-source audit trail

## Accuracy boundaries

- Artist names and roles follow the current PRAX team page.
- Portraits are exact assets from the current PRAX asset manifest; no synthetic or substituted people are used.
- Displayed prices and service durations were verified on public Squire pages on August 19, 2026.
- Brandon Latung is shown as an intern artist with “Not booking” because the repository supplies no public booking URL for him.
- The dates and times on screens 4–5 are static concept states, not live availability. A production implementation must read current availability and checkout terms from Squire.

## iPhone chrome

The exports include the Dynamic Island, 9:41 time, cellular and Wi-Fi indicators, `82%` battery, and home indicator. The canvas matches Apple’s iPhone 17 display resolution of `1206 × 2622 px`. Do not add a second status-bar overlay in UltraMock.
