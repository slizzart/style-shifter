/**
 * Utility functions for color manipulation
 */
export class ColorUtils {
    /**
     * Convert CSS color (hex or rgb/rgba) to RGBA array [r, g, b, a]
     */
    static cssColorToRGBA(color) {
        if (color.startsWith('#')) {
            return this.hexToRGBA(color);
        }
        else if (color.startsWith('rgb')) {
            return this.rgbStringToRGBA(color);
        }
        // Default fallback
        return [0, 0, 0, 255];
    }
    static hexToRGBA(hex) {
        let str = hex.substring(1);
        // Expand shorthand (e.g., #RGB to #RRGGBB)
        if (str.length === 3) {
            str = str.split('').map(c => c + c).join('');
        }
        else if (str.length === 4) {
            str = str.split('').map(c => c + c).join('');
        }
        const r = parseInt(str.substring(0, 2), 16);
        const g = parseInt(str.substring(2, 4), 16);
        const b = parseInt(str.substring(4, 6), 16);
        const a = str.length === 8 ? parseInt(str.substring(6, 8), 16) : 255;
        return [r, g, b, a];
    }
    static rgbStringToRGBA(rgb) {
        const regex = /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([\d.]+))?\)/;
        const match = regex.exec(rgb);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            const a = match[4] ? Math.round(parseFloat(match[4]) * 255) : 255;
            return [r, g, b, a];
        }
        return [0, 0, 0, 255];
    }
    /**
     * Convert RGBA to hex string
     */
    static rgbaToHex(r, g, b, a = 255) {
        const toHex = (n) => {
            const hex = Math.round(n).toString(16).padStart(2, '0');
            return hex;
        };
        if (a === 255) {
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        }
        else {
            return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
        }
    }
}
