/**
 * ThemeRegistry - Manages theme cascading and inheritance
 */
export class ThemeRegistry {
    /**
     * Register a cascade object for a namespace
     * Cascade objects provide default values that themes can inherit
     */
    static registerCascade(namespace, data, atIndex) {
        if (!this.cascades.has(namespace)) {
            this.cascades.set(namespace, []);
        }
        const cascadeList = this.cascades.get(namespace);
        if (atIndex === undefined) {
            cascadeList.push(data);
        }
        else {
            cascadeList.splice(atIndex, 0, data);
        }
    }
    /**
     * Apply cascade values to a theme data object
     * Properties from cascade objects are applied to the theme if not already set
     */
    static applyCascade(namespace, themeData) {
        const cascadeList = this.cascades.get(namespace);
        if (!cascadeList) {
            return themeData;
        }
        // Apply cascades in order
        for (const cascadeData of cascadeList) {
            for (const field in cascadeData) {
                const value = cascadeData[field];
                if (value !== null && value !== undefined) {
                    // Skip if field already has a value in theme (except 'name' which is special)
                    if (field === 'name') {
                        // Only apply name if not already set
                        if (themeData.name === undefined) {
                            // If it's a name field and doesn't start with namespace, prepend it
                            if (typeof value === 'string' && !value.startsWith(`${namespace}-`)) {
                                themeData[field] = `${namespace}-${value}`;
                            }
                            else {
                                themeData[field] = value;
                            }
                        }
                    }
                    else {
                        // For other fields, only apply if not already set
                        if (themeData[field] === undefined) {
                            themeData[field] = value;
                        }
                    }
                }
            }
        }
        return themeData;
    }
    /**
     * Get all cascades for a namespace
     */
    static getCascades(namespace) {
        return this.cascades.get(namespace);
    }
    /**
     * Clear all cascades for a namespace
     */
    static clearCascades(namespace) {
        if (namespace) {
            this.cascades.delete(namespace);
        }
        else {
            this.cascades.clear();
        }
    }
    /**
     * Sanitize a name to be used as a CSS class
     */
    static sanitizeName(namespace, name) {
        const fullName = `${namespace}-${name}`;
        return fullName.replace(/[^a-zA-Z0-9-_]/g, '-');
    }
}
ThemeRegistry.cascades = new Map();
