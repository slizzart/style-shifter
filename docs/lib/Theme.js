/**
 * Core Theme class
 */
export class Theme {
    constructor(options) {
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
    applyTo(element) {
        if (!element.classList.contains(this.name)) {
            element.classList.add(this.name);
        }
    }
    /**
     * Remove theme from a DOM element
     */
    removeFrom(element) {
        element.classList.remove(this.name);
    }
    /**
     * Get fonts associated with this theme
     */
    getFonts() {
        return this.fonts;
    }
    /**
     * Preload image dependencies
     */
    preloadImages(urls) {
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
    onComplete(callback) {
        if (this.isCompleted) {
            callback();
        }
        else {
            this.completedCallbacks.push(callback);
        }
    }
    dependencyLoaded() {
        this.pendingDependencies--;
        if (this.pendingDependencies === 0) {
            this.dispatchComplete();
        }
    }
    dispatchComplete() {
        if (!this.isCompleted) {
            this.isCompleted = true;
            this.completedCallbacks.forEach(cb => cb());
            this.completedCallbacks = [];
        }
    }
    /**
     * Get a property value from the theme data
     */
    getValue(key) {
        return this.data[key];
    }
    /**
     * Set a property value in the theme data
     */
    setValue(key, value) {
        this.data[key] = value;
    }
}
