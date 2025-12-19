/**
 * Built-in API functions for CSS expression evaluation
 */
import { ColorUtils } from '../utils.js';
import { mapSvgColors } from './mapSvgColors.js';
/**
 * Wrap a URL inside a 'url()' string to provide a valid CSS value
 */
export const url = (expression, theme, src, parserPos, args) => {
    if (args[0] == null)
        return null;
    return `url(${args[0]})`;
};
/**
 * Convert unitless values to px
 */
export const toPx = (expression, theme, src, parserPos, args) => {
    if (args[0] == null)
        return null;
    let value = String(args[0]);
    if (value.length < 3 || !value.endsWith('px')) {
        value = parseFloat(value) + 'px';
    }
    return value;
};
/**
 * Get unit from a value string
 */
function getUnit(val) {
    if (val.startsWith('.')) {
        val = '0' + val;
    }
    const num = parseFloat(val);
    return val.split(String(num)).pop()?.split(' ')[0] || '';
}
/**
 * Convert px to rem, or rebase rem values to a new base font size
 */
export const toRem = (expression, theme, src, parserPos, args) => {
    if (args[0] == null)
        return null;
    let size = parseFloat(args[0]);
    const unit = getUnit(args[0]);
    const base = args.length >= 2 ? parseFloat(args[1]) : 16;
    const initialBase = args.length >= 3 ? parseFloat(args[2]) : 16;
    if (base > 0) {
        if (unit === 'rem') {
            size = size * initialBase;
        }
        return (size * ((base / 16) / 16)) + 'rem';
    }
    return null;
};
/**
 * Convert a hex or rgb color to rgba using a specific amount of opacity
 */
export const opacify = (expression, theme, src, parserPos, args) => {
    if (args[0] == null)
        return null;
    const color = args[0];
    let amount = parseFloat(args[1]);
    amount = Math.max(Math.min(amount, 1), 0);
    if (color.startsWith('#')) {
        // HEX
        let str = color.substring(1);
        // Expand shorthand
        if (str.length === 4) {
            str = str.substring(0, 3);
        }
        else if (str.length === 8) {
            str = str.substring(0, 6);
        }
        const alpha = Math.round(amount * 255).toString(16).padStart(2, '0');
        if (str.length === 3) {
            return `#${str}${alpha}`;
        }
        else if (str.length === 6) {
            return `#${str}${alpha}`;
        }
    }
    else if (color.startsWith('rgb')) {
        // RGB/RGBA
        const regex = /\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/;
        const match = regex.exec(color);
        if (match) {
            return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${amount})`;
        }
    }
    return null;
};
/**
 * Tint a color for a specific percentage
 */
export const tint = (expression, theme, src, parserPos, args) => {
    if (args[0] == null || args[1] == null)
        return null;
    const base = ColorUtils.cssColorToRGBA(args[0]);
    const tintColor = ColorUtils.cssColorToRGBA(args[1]);
    const amountStr = String(args[2] || '0.5');
    let amount = amountStr.endsWith('%')
        ? parseFloat(amountStr.substring(0, amountStr.length - 1)) / 100
        : parseFloat(amountStr);
    amount = Math.max(Math.min(amount, 1), 0);
    const baseAlpha = base[3] / 255;
    const tintAlpha = tintColor[3] / 255;
    amount *= tintAlpha;
    const dr = (tintColor[0] - base[0]) * amount;
    const dg = (tintColor[1] - base[1]) * amount;
    const db = (tintColor[2] - base[2]) * amount;
    const r = Math.round(Math.min(Math.max(base[0] + dr, 0), 255));
    const g = Math.round(Math.min(Math.max(base[1] + dg, 0), 255));
    const b = Math.round(Math.min(Math.max(base[2] + db, 0), 255));
    return `rgba(${r}, ${g}, ${b}, ${baseAlpha})`;
};
/**
 * Invert a color (R: 255-R, G: 255-G, B: 255-B)
 */
export const invert = (expression, theme, src, parserPos, args) => {
    if (args[0] == null)
        return null;
    const color = ColorUtils.cssColorToRGBA(args[0]);
    const r = 255 - color[0];
    const g = 255 - color[1];
    const b = 255 - color[2];
    return `rgba(${r}, ${g}, ${b}, ${color[3] / 255})`;
};
/**
 * Print after string replacements (e.g., printf(%1 %2!, Hello, World) => "Hello World!")
 */
export const printf = (expression, theme, src, parserPos, args) => {
    if (args[0] == null)
        return null;
    let result = String(args[0]);
    const regex = /%([0-9]+)/g;
    result = result.replace(regex, (match, index) => {
        const i = parseInt(index);
        return args[i] != null ? String(args[i]) : match;
    });
    return result;
};
// Export all functions
export { mapSvgColors };
