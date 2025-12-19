/**
 * Built-in API functions for CSS expression evaluation
 */
import { APIFunction } from '../types.js';
import { mapSvgColors } from './mapSvgColors.js';
/**
 * Wrap a URL inside a 'url()' string to provide a valid CSS value
 */
export declare const url: APIFunction;
/**
 * Convert unitless values to px
 */
export declare const toPx: APIFunction;
/**
 * Convert px to rem, or rebase rem values to a new base font size
 */
export declare const toRem: APIFunction;
/**
 * Convert a hex or rgb color to rgba using a specific amount of opacity
 */
export declare const opacify: APIFunction;
/**
 * Tint a color for a specific percentage
 */
export declare const tint: APIFunction;
/**
 * Invert a color (R: 255-R, G: 255-G, B: 255-B)
 */
export declare const invert: APIFunction;
/**
 * Print after string replacements (e.g., printf(%1 %2!, Hello, World) => "Hello World!")
 */
export declare const printf: APIFunction;
export { mapSvgColors };
