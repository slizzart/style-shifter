/**
 * ThemeRegistry - Manages theme cascading and inheritance
 */

import { ThemeData } from './types.js';

export class ThemeRegistry {
  private static cascades: Map<string, Array<ThemeData>> = new Map();

  /**
   * Register a cascade object for a namespace
   * Cascade objects provide default values that themes can inherit
   */
  public static registerCascade(
    namespace: string,
    data: ThemeData,
    atIndex?: number
  ): void {
    if (!this.cascades.has(namespace)) {
      this.cascades.set(namespace, []);
    }

    const cascadeList = this.cascades.get(namespace)!;
    
    if (atIndex === undefined) {
      cascadeList.push(data);
    } else {
      cascadeList.splice(atIndex, 0, data);
    }
  }

  /**
   * Apply cascade values to a theme data object
   * Properties from cascade objects are applied to the theme if not already set
   */
  public static applyCascade(namespace: string, themeData: ThemeData): ThemeData {
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
              } else {
                themeData[field] = value;
              }
            }
          } else {
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
  public static getCascades(namespace: string): Array<ThemeData> | undefined {
    return this.cascades.get(namespace);
  }

  /**
   * Clear all cascades for a namespace
   */
  public static clearCascades(namespace?: string): void {
    if (namespace) {
      this.cascades.delete(namespace);
    } else {
      this.cascades.clear();
    }
  }

  /**
   * Sanitize a name to be used as a CSS class
   */
  public static sanitizeName(namespace: string, name: string): string {
    const fullName = `${namespace}-${name}`;
    return fullName.replace(/[^a-zA-Z0-9-_]/g, '-');
  }
}
