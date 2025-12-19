/**
 * CSSProcessor - Parses CSS for theme expressions and generates overrides
 */
import { Theme } from './Theme.js';
import { APIFunction, CSSProcessorOptions } from './types.js';
export declare class CSSProcessor {
    private namespace;
    private overrides;
    private themeCached;
    private ruleNameOverrides;
    private preprocessors;
    private postprocessors;
    private defines;
    private apiFunctions;
    static globalDefines: Map<string, any>;
    constructor(options: CSSProcessorOptions);
    /**
     * Register a custom API function
     */
    registerFunction(name: string, fn: APIFunction): void;
    /**
     * Add a theme and process its CSS overrides
     */
    addTheme(theme: Theme): void;
    /**
     * Parse CSS from URL and extract theme overrides
     */
    private parseStyleSheetFromUrlForTheme;
    /**
     * Evaluate an expression from CSS comment
     */
    private evaluateExpression;
    /**
     * Extract rule information from CSS
     */
    private getRuleInfo;
    /**
     * Extract rule name/selector from CSS
     */
    private extractRuleName;
    /**
     * Format rule selector to include theme class
     */
    private formatRuleSelector;
    /**
     * Parse function info from expression
     */
    private getFuncInfo;
    /**
     * Parse comma-separated arguments
     */
    private parseArgsList;
    /**
     * Parse and resolve arguments
     */
    private parseArgs;
    /**
     * Extract the original value from CSS
     */
    private extractValue;
    /**
     * Inject generated CSS overrides into document head
     */
    private injectOverridesForTheme;
    /**
     * Inject CSS into document head
     */
    private injectStyle;
    private removeWhiteSpace;
    private local;
    private global;
    private setRuleScope;
}
