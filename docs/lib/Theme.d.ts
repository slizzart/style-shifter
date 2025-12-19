/**
 * Core Theme class
 */
import { ThemeData, ThemeOptions } from './types.js';
export declare class Theme {
    namespace: string;
    name: string;
    data: ThemeData;
    source: any;
    private fonts;
    private pendingDependencies;
    private completedCallbacks;
    private isCompleted;
    constructor(options: ThemeOptions);
    /**
     * Apply theme to a DOM element
     */
    applyTo(element: HTMLElement): void;
    /**
     * Remove theme from a DOM element
     */
    removeFrom(element: HTMLElement): void;
    /**
     * Get fonts associated with this theme
     */
    getFonts(): Map<string, string> | null;
    /**
     * Preload image dependencies
     */
    preloadImages(urls: string[]): void;
    /**
     * Register a callback to be called when theme is ready
     */
    onComplete(callback: () => void): void;
    private dependencyLoaded;
    private dispatchComplete;
    /**
     * Get a property value from the theme data
     */
    getValue(key: string): any;
    /**
     * Set a property value in the theme data
     */
    setValue(key: string, value: any): void;
}
