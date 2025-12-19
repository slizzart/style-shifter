/**
 * Core types for StyleShifter
 */
export interface ThemeData {
    [key: string]: any;
}
export interface ThemeOptions {
    namespace: string;
    name: string;
    data: ThemeData;
    fonts?: Map<string, string>;
    preloadImages?: string[];
}
export interface RuleInfo {
    name: string;
    prop: string;
    important: boolean;
}
export interface RuleOverride {
    name: string;
    prop: string;
    value: string;
    key: string;
    important: boolean;
}
export interface FunctionInfo {
    name: string;
    args: any[];
    expression: string;
}
export type APIFunction = (expression: string, theme: any, src: string, parserPos: number, args: any[]) => string | null;
export type OverrideProcessor = (theme: any, override: RuleOverride) => string | null;
export interface CSSProcessorOptions {
    namespace: string;
    preprocessors?: OverrideProcessor[];
    postprocessors?: OverrideProcessor[];
}
