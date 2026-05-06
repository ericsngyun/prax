/**
 * Placeholder image generator
 *
 * Generates inline SVG data URIs that show a description of which asset
 * belongs in a given slot. Used until real assets are uploaded via
 * `pnpm add-asset --key <name> --force <file>`.
 *
 * Design: dark Ink & Bone palette, dashed border, centered label + context,
 * tiny footer hint. Aspect-ratio-flexible — SVG scales to fit the
 * consuming Image component's width/height.
 */

interface PlaceholderSpec {
  label: string;
  context: string;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function makeImagePlaceholder(spec: PlaceholderSpec): string {
  const label = escapeXml(spec.label);
  const context = escapeXml(spec.context);

  // 1200x900 (4:3) intrinsic. preserveAspectRatio="xMidYMid meet" keeps
  // text readable at any consuming aspect ratio (letterboxes if needed).
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid meet"><rect width="1200" height="900" fill="#0d0d0d"/><rect x="40" y="40" width="1120" height="820" fill="none" stroke="#2d2d2d" stroke-width="2" stroke-dasharray="12 8"/><text x="600" y="430" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, system-ui, sans-serif" font-size="44" font-weight="500" fill="#ede9e3" letter-spacing="-0.02em">${label}</text><text x="600" y="490" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, system-ui, sans-serif" font-size="22" font-weight="400" fill="#a3a3a3" letter-spacing="0.01em">${context}</text><text x="600" y="820" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, system-ui, sans-serif" font-size="13" font-weight="500" fill="#444" letter-spacing="0.2em" text-transform="uppercase">PLACEHOLDER · pnpm add-asset --key X --force &lt;file&gt;</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
