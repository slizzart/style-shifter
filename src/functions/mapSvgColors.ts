import type { APIFunction } from '../types';

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
export const mapSvgColors: APIFunction = (
  expression: string,
  theme: any,
  src: string,
  parserPos: number,
  args: any[]
): string | null => {
  // Args: [svgContent, originalColors, ...replacementColors]
  if (args.length < 3 || !args[0] || !args[1]) {
    console.error('mapSvgColors requires: svgContent, originalColors, and at least one replacement color');
    return null;
  }

  const svgContent = String(args[0]);
  const originalColors = String(args[1]);
  const themeColors = args.slice(2);

  // Parse original colors
  const originals = originalColors.split('|').map(c => c.trim());
  
  if (originals.length !== themeColors.length) {
    console.error(`Number of original colors (${originals.length}) must match replacement colors (${themeColors.length})`);
    return null;
  }

  try {
    let modifiedSvg = svgContent;

    // Replace each color
    originals.forEach((originalColor, index) => {
      let replacement = String(themeColors[index]);
      
      // Ensure colors have # prefix if they don't already
      const original = originalColor.startsWith('#') ? originalColor : `#${originalColor}`;
      if (!replacement.startsWith('#') && /^[0-9A-Fa-f]{6}$/.test(replacement)) {
        replacement = `#${replacement}`;
      }
      
      // Create case-insensitive regex for the color (with or without #)
      const colorWithoutHash = original.substring(1);
      const regex = new RegExp(`#?${colorWithoutHash}`, 'gi');
      
      modifiedSvg = modifiedSvg.replace(regex, replacement);
    });

    // Convert to base64 data URI
    const base64 = btoa(unescape(encodeURIComponent(modifiedSvg)));
    return `data:image/svg+xml;base64,${base64}`;
    
  } catch (error) {
    console.error('mapSvgColors error:', error);
    return null;
  }
};
