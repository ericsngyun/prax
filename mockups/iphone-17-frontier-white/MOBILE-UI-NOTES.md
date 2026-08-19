# Mobile UI Notes

## Information architecture

The five screens use a short, predictable task flow:

`Home → Artists → Artist & Service → Time → Confirmation`

Home and Artists are top-level destinations and retain the tab bar. Artist, Booking, and Confirmation are focused task states with back or completion controls instead of a competing global tab bar.

## Layout system

- Logical canvas: `402 × 874 pt`; export scale: `3×`
- Output: `1206 × 2622 px`, matching iPhone 17
- Horizontal content margin: `20 pt`
- Spacing rhythm: `4 / 8 / 12 / 16 / 20 / 24 / 32 pt`
- Primary controls: `54 pt` high
- Smallest interactive rows/chips: at least `44 pt` high
- Top and bottom content stay outside the Dynamic Island, status bar, and home-indicator zones
- Images always use aspect-fill crops; they are never stretched

## Interaction hierarchy

- One dominant black primary action per screen
- Prices appear before a booking commitment
- The selected service, day, and time have explicit high-contrast states
- Deeper screens retain context through the artist portrait, service, duration, and price
- Static teaser availability is disclosed; production availability must come from Squire
- Bookable and non-bookable staff are visibly distinct without hiding current team members

## Accessibility and implementation

- Keep tap targets at least `44 × 44 pt`.
- Preserve the source font hierarchy with Dynamic Type equivalents; never render body copy below `11 pt`.
- Maintain black/optic-white contrast and test muted labels at WCAG AA contrast for their rendered size.
- Give icons text labels in accessible names; do not rely on chevrons or color alone.
- In SwiftUI, place content inside safe areas and use semantic `Button`, `NavigationStack`, `TabView`, and accessibility labels.
- In React Native, use safe-area insets, `Pressable` hit slop only as a supplement to visible target size, and explicit accessibility roles/labels.
- Load remote portraits with placeholders, fixed aspect ratios, caching, and failure states to prevent layout shift.
- Treat price, duration, availability, cancellation rules, taxes, and checkout fees as remote data. Do not hard-code them in a production build.
- Format price with locale-aware currency APIs and time with the user’s locale/time-zone settings.
- Announce validation errors next to the affected control and preserve the user’s selection when moving backward.

Apple’s current design guidance recommends controls of at least `44 × 44 pt`, legible text, strong contrast, high-resolution image assets, and undistorted aspect ratios. The mockups use those constraints as the baseline, not as decoration.
