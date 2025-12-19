/**
 * StyleShifter - Dynamic CSS theming system with expression-based style overrides
 *
 * @example
 * ```typescript
 * import { Theme, CSSProcessor, ThemeRegistry } from 'style-shifter';
 *
 * // Create a theme
 * const theme = new Theme({
 *   namespace: 'myapp',
 *   name: 'dark-theme',
 *   data: {
 *     primaryColor: '#1a1a1a',
 *     textColor: '#ffffff',
 *     fontSize: 16
 *   }
 * });
 *
 * // Create CSS processor
 * const processor = new CSSProcessor({ namespace: 'myapp' });
 *
 * // Process theme
 * processor.addTheme(theme);
 *
 * // Apply theme to element
 * theme.applyTo(document.body);
 * ```
 */
export { Theme } from './Theme.js';
export { ThemeRegistry } from './ThemeRegistry.js';
export { CSSProcessor } from './CSSProcessor.js';
export { ColorUtils } from './utils.js';
export type { ThemeData, ThemeOptions, RuleInfo, RuleOverride, FunctionInfo, APIFunction, OverrideProcessor, CSSProcessorOptions } from './types';
export * as builtInFunctions from './functions/index.js';
