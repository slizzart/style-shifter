/**
 * Utility functions for color manipulation
 */
export declare class ColorUtils {
    /**
     * Convert CSS color (hex or rgb/rgba) to RGBA array [r, g, b, a]
     */
    static cssColorToRGBA(color: string): [number, number, number, number];
    private static hexToRGBA;
    private static rgbStringToRGBA;
    /**
     * Convert RGBA to hex string
     */
    static rgbaToHex(r: number, g: number, b: number, a?: number): string;
}
