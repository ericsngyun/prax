/**
 * Blur Placeholder Utilities
 * Generates optimized blur placeholders for images
 */

/**
 * Generates a solid color blur placeholder
 * @param color - Hex color (e.g., '#1a1a1a')
 * @returns base64 encoded SVG blur placeholder
 */
export function getColorBlurPlaceholder(color: string = '#1a1a1a'): string {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="400" height="533" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="533" fill="${color}"/></svg>`
  ).toString('base64')}`;
}

/**
 * Generates a gradient blur placeholder
 * @param topColor - Top gradient color
 * @param bottomColor - Bottom gradient color
 * @returns base64 encoded SVG blur placeholder
 */
export function getGradientBlurPlaceholder(
  topColor: string = '#1a1a1a',
  bottomColor: string = '#0d0d0d'
): string {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="400" height="533" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${topColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${bottomColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="533" fill="url(#grad)"/>
    </svg>`
  ).toString('base64')}`;
}

/**
 * Predefined blur placeholders for common use cases
 */
export const blurPlaceholders = {
  // Dark solid placeholders
  charcoal: getColorBlurPlaceholder('#1a1a1a'),
  ink: getColorBlurPlaceholder('#0d0d0d'),
  black: getColorBlurPlaceholder('#000000'),
  graphite: getColorBlurPlaceholder('#2a2a2a'),

  // Gradient placeholders
  darkGradient: getGradientBlurPlaceholder('#1a1a1a', '#0d0d0d'),
  subtleGradient: getGradientBlurPlaceholder('#2a2a2a', '#1a1a1a'),

  // Portrait-specific (slightly warmer)
  portrait: getColorBlurPlaceholder('#1c1917'),

  // Generic fallback
  default: getColorBlurPlaceholder('#1a1a1a'),
};

/**
 * Generates a shimmer effect placeholder (for skeleton loading)
 */
export function getShimmerPlaceholder(): string {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="400" height="533" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#2a2a2a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="533" fill="url(#shimmer)">
        <animate attributeName="x" from="-400" to="400" dur="1.5s" repeatCount="indefinite"/>
      </rect>
    </svg>`
  ).toString('base64')}`;
}
