/**
 * Core Theme class
 */

import { ThemeData, ThemeOptions } from './types.js';

export class Theme {
  public namespace: string;
  public name: string;
  public data: ThemeData;
  public source: any;
  
  private fonts: Map<string, string> | null;
  private pendingDependencies: number;
  private completedCallbacks: Array<() => void>;
  private isCompleted: boolean;

  constructor(options: ThemeOptions) {
    this.namespace = options.namespace;
    this.name = options.name;
    this.data = options.data;
    this.source = options.data;
    this.fonts = options.fonts || null;
    this.pendingDependencies = 0;
    this.completedCallbacks = [];
    this.isCompleted = false;

    // Auto-dispatch complete event if no dependencies
    setTimeout(() => {
      if (this.pendingDependencies === 0) {
        this.dispatchComplete();
      }
    }, 10);

    // Preload images if provided
    if (options.preloadImages) {
      this.preloadImages(options.preloadImages);
    }
  }

  /**
   * Apply theme to a DOM element
   */
  public applyTo(element: HTMLElement): void {
    if (!element.classList.contains(this.name)) {
      element.classList.add(this.name);
    }
  }

  /**
   * Remove theme from a DOM element
   */
  public removeFrom(element: HTMLElement): void {
    element.classList.remove(this.name);
  }

  /**
   * Get fonts associated with this theme
   */
  public getFonts(): Map<string, string> | null {
    return this.fonts;
  }

  /**
   * Preload image dependencies
   */
  public preloadImages(urls: string[]): void {
    for (const url of urls) {
      if (url) {
        const img = new Image();
        img.src = url;
        img.onload = () => this.dependencyLoaded();
        img.onerror = () => this.dependencyLoaded();
        this.pendingDependencies++;
      }
    }

    if (this.pendingDependencies === 0) {
      setTimeout(() => this.dispatchComplete(), 1);
    }
  }

  /**
   * Register a callback to be called when theme is ready
   */
  public onComplete(callback: () => void): void {
    if (this.isCompleted) {
      callback();
    } else {
      this.completedCallbacks.push(callback);
    }
  }

  private dependencyLoaded(): void {
    this.pendingDependencies--;
    if (this.pendingDependencies === 0) {
      this.dispatchComplete();
    }
  }

  private dispatchComplete(): void {
    if (!this.isCompleted) {
      this.isCompleted = true;
      this.completedCallbacks.forEach(cb => cb());
      this.completedCallbacks = [];
    }
  }

  /**
   * Get a property value from the theme data
   */
  public getValue(key: string): any {
    return this.data[key];
  }

  /**
   * Set a property value in the theme data
   */
  public setValue(key: string, value: any): void {
    this.data[key] = value;
  }
}
