import type { APIFunction } from '../types.js';
/**
 * Maps SVG colors to theme colors and returns a base64 data URI.
 *
 * Replaces colors in an inline SVG string and converts to base64 data URI.
 * For best results, preload SVG content as a string or use inline SVG.
 *
 * @param svgContent - The SVG content as a string
 * @param originalColors - Pipe-delimited string of hex colors to replace (e.g., "#FF0000|#00FF00|#0000FF")
 * @param ...themeColors - Theme values or hex colors to use as replacements
 * @returns Data URI string for use in url()
 *
 * @example
 * // In CSS with embedded SVG:
 * .icon {
 *   /*![mapSvgColors('<svg>...</svg>', '#FF0000|#00FF00', theme.primaryColor, theme.secondaryColor)]* /
 *   background-image: url('data:image/svg+xml,...');
 * }
 */
export declare const mapSvgColors: APIFunction;
