/**
 * ThemeRegistry - Manages theme cascading and inheritance
 */
import { ThemeData } from './types.js';
export declare class ThemeRegistry {
    private static cascades;
    /**
     * Register a cascade object for a namespace
     * Cascade objects provide default values that themes can inherit
     */
    static registerCascade(namespace: string, data: ThemeData, atIndex?: number): void;
    /**
     * Apply cascade values to a theme data object
     * Properties from cascade objects are applied to the theme if not already set
     */
    static applyCascade(namespace: string, themeData: ThemeData): ThemeData;
    /**
     * Get all cascades for a namespace
     */
    static getCascades(namespace: string): Array<ThemeData> | undefined;
    /**
     * Clear all cascades for a namespace
     */
    static clearCascades(namespace?: string): void;
    /**
     * Sanitize a name to be used as a CSS class
     */
    static sanitizeName(namespace: string, name: string): string;
}
