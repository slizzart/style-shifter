/**
 * CSSProcessor - Parses CSS for theme expressions and generates overrides
 */

import { Theme } from './Theme.js';
import { APIFunction, RuleOverride, RuleInfo, FunctionInfo, OverrideProcessor, CSSProcessorOptions } from './types.js';
import * as builtInFunctions from './functions/index.js';

export class CSSProcessor {
  private namespace: string;
  private overrides: Map<string, RuleOverride[]>;
  private themeCached: Set<string>;
  private ruleNameOverrides: Map<string, Map<string, string>>;
  private preprocessors: OverrideProcessor[];
  private postprocessors: OverrideProcessor[];
  private defines: Map<string, any>;
  private apiFunctions: Map<string, APIFunction>;
  
  public static globalDefines: Map<string, any> = new Map();

  constructor(options: CSSProcessorOptions) {
    this.namespace = options.namespace;
    this.overrides = new Map();
    this.themeCached = new Set();
    this.ruleNameOverrides = new Map();
    this.preprocessors = options.preprocessors || [];
    this.postprocessors = options.postprocessors || [];
    this.defines = new Map();
    this.apiFunctions = new Map();
    
    // Register built-in functions
    this.registerFunction('url', builtInFunctions.url);
    this.registerFunction('toPx', builtInFunctions.toPx);
    this.registerFunction('toRem', builtInFunctions.toRem);
    this.registerFunction('opacify', builtInFunctions.opacify);
    this.registerFunction('tint', builtInFunctions.tint);
    this.registerFunction('invert', builtInFunctions.invert);
    this.registerFunction('printf', builtInFunctions.printf);
    this.registerFunction('mapSvgColors', builtInFunctions.mapSvgColors);
    
    // Register variable accessors
    this.registerFunction('local', this.local.bind(this));
    this.registerFunction('global', this.global.bind(this));
    this.registerFunction('setRuleScope', this.setRuleScope.bind(this));
  }

  /**
   * Register a custom API function
   */
  public registerFunction(name: string, fn: APIFunction): void {
    this.apiFunctions.set(name, fn);
  }

  /**
   * Add a theme and process its CSS overrides
   */
  public addTheme(theme: Theme): void {
    if (this.themeCached.has(theme.name)) {
      return;
    }

    // Get all stylesheets
    const styleSheets = document.styleSheets;
    
    for (let i = 0; i < styleSheets.length; i++) {
      const sheet = styleSheets[i];
      
      if (sheet.href) {
        try {
          this.parseStyleSheetFromUrlForTheme(sheet.href, theme);
        } catch (e) {
          // Silently ignore CORS errors or other issues
        }
      }
    }

    if (this.overrides.size > 0) {
      this.injectOverridesForTheme(theme);
    }

    this.themeCached.add(theme.name);
  }

  /**
   * Parse CSS from URL and extract theme overrides
   */
  private parseStyleSheetFromUrlForTheme(url: string, theme: Theme): void {
    // Fetch CSS content
    let src: string;
    
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, false); // Synchronous for simplicity
      xhr.send();
      src = xhr.responseText;
    } catch (e) {
      return;
    }

    if (!src || src.length === 0) {
      return;
    }

    // Parse expressions in format /*![expression]*/
    let idx1 = src.indexOf('/*![');
    let idx2: number;
    let val: string | null;
    let key: string;

    while (idx1 !== -1) {
      idx2 = src.indexOf(']', idx1);
      const expression = src.substring(idx1 + 4, idx2);
      val = this.evaluateExpression(expression, theme, src, idx1);
      key = expression.split('.').pop() || '';

      if (val !== null) {
        const ruleInfo = this.getRuleInfo(src, idx1, theme);
        
        if (ruleInfo.prop && ruleInfo.name) {
          let ruleName = this.ruleNameOverrides.get(theme.name)?.get(ruleInfo.name) 
            || this.formatRuleSelector(ruleInfo.name, theme);
          
          const override: RuleOverride = {
            name: ruleName,
            prop: ruleInfo.prop,
            value: val,
            key: key,
            important: ruleInfo.important
          };

          // Apply preprocessors
          for (const processor of this.preprocessors) {
            const result = processor(theme, override);
            if (result !== null) {
              override.value = result;
            }
          }

          // Apply postprocessors
          for (const processor of this.postprocessors) {
            const result = processor(theme, override);
            if (result !== null) {
              override.value = result;
            }
          }

          if (!this.overrides.has(ruleName)) {
            this.overrides.set(ruleName, []);
          }
          
          this.overrides.get(ruleName)!.push(override);
        }
      }

      idx1 = src.indexOf('/*![', idx2 + 1);
    }
  }

  /**
   * Evaluate an expression from CSS comment
   */
  private evaluateExpression(expression: string, theme: Theme, src: string, parserPos: number): string | null {
    let result: string | null = null;
    const funcInfo = this.getFuncInfo(expression);

    if (!funcInfo) {
      // Direct property access
      const propArr = expression.split('.');
      
      if (propArr[0] === theme.namespace) {
        propArr.shift();
        let value: any = theme.data;
        
        for (const prop of propArr) {
          value = value?.[prop];
        }
        
        if (value !== undefined && value !== null) {
          result = String(value);
        }
      }
    } else {
      // Function call
      try {
        const fn = this.apiFunctions.get(funcInfo.name);
        if (fn) {
          this.parseArgs(theme, src, parserPos, funcInfo.args);
          result = fn(funcInfo.expression, theme, src, parserPos, funcInfo.args);
        }
      } catch (e) {
        console.error(`Error evaluating function ${funcInfo.name}:`, e);
      }
    }

    return result;
  }

  /**
   * Extract rule information from CSS
   */
  private getRuleInfo(src: string, index: number, theme: Theme): RuleInfo {
    const result: RuleInfo = {
      prop: '',
      name: '',
      important: false
    };

    const propStart = src.indexOf(']*/', index) + 3;
    const propEnd = src.indexOf(':', propStart);

    result.prop = this.removeWhiteSpace(src.substring(propStart, propEnd));

    const valRegex = /:(.+?)(;|\})/;
    const match = valRegex.exec(src.substr(propEnd, 100));
    result.important = match ? match[1].indexOf('!important') !== -1 : false;

    let i = propStart;

    if (result.prop) {
      i = src.lastIndexOf('{', i);
      const nameEnd = i;
      const delims = ['}', '/', '@'];
      
      while (!result.name && i >= 0) {
        const c = src.charAt(i);
        
        if (delims.includes(c)) {
          if (c === '@') {
            result.name = this.extractRuleName(src, nameEnd, true);
          } else {
            result.name = this.extractRuleName(src, nameEnd, false);
          }
          break;
        }
        
        i--;
      }
      
      if (!result.name) {
        result.name = this.extractRuleName(src, nameEnd, false);
      }
    }

    return result;
  }

  /**
   * Extract rule name/selector from CSS
   */
  private extractRuleName(src: string, index: number, isMediaQuery: boolean = false): string {
    const end = src.lastIndexOf('{', index);
    const start = isMediaQuery 
      ? src.lastIndexOf('@', end) - 1 
      : src.lastIndexOf('}', end);
    const isFirstRule = src.indexOf('{') === end;

    const startPos = (start === -1 && !isFirstRule) ? 0 : start + 1;
    let rule = src.substring(startPos, end);
    
    rule = rule.replace(/  +/g, ' ');
    const arr = rule.split(',');
    const white = [' ', '\t', '\n', '\r'];

    for (let i = 0; i < arr.length; i++) {
      while (white.includes(arr[i].charAt(0))) {
        arr[i] = arr[i].substring(1);
      }
      
      while (white.includes(arr[i].charAt(arr[i].length - 1))) {
        arr[i] = arr[i].substring(0, arr[i].length - 1);
      }
    }

    return arr.join(',');
  }

  /**
   * Format rule selector to include theme class
   */
  private formatRuleSelector(str: string, theme: Theme): string {
    const white = ['', '\t', '\n', '\r'];
    let arr: string[];
    let mediaQ = '';

    if (str.charAt(0) === '@') {
      const parts = str.split('{');
      mediaQ = parts.shift() + ' { ';
      str = parts.join('{');
    }

    arr = str.split(' ').filter(item => !white.includes(item));
    str = arr.join(' ');
    
    // Split by comma, trim each selector, and add theme class
    const selectors = str.split(',').map(s => s.trim());
    str = mediaQ + selectors.map(s => '.' + theme.name + ' ' + s).join(', ');

    return str;
  }

  /**
   * Parse function info from expression
   */
  private getFuncInfo(expression: string): FunctionInfo | null {
    const idx = expression.indexOf('(');
    
    if (idx === -1) {
      return null;
    }

    const name = expression.substring(0, idx);
    const idx2 = expression.lastIndexOf(')');
    
    if (idx2 === -1) {
      return null;
    }

    const argsStr = expression.substring(idx + 1, idx2);
    const args = this.parseArgsList(argsStr);

    return {
      name,
      args,
      expression
    };
  }

  /**
   * Parse comma-separated arguments
   */
  private parseArgsList(argsStr: string): any[] {
    const args: any[] = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i];
      
      if (char === '(' || char === '[' || char === '{') {
        depth++;
        current += char;
      } else if (char === ')' || char === ']' || char === '}') {
        depth--;
        current += char;
      } else if (char === ',' && depth === 0) {
        args.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      args.push(current.trim());
    }

    return args;
  }

  /**
   * Parse and resolve arguments
   */
  private parseArgs(theme: Theme, src: string, parserPos: number, args: any[]): void {
    const varRegex = /^%([^%]+)%$/;

    for (let i = 0; i < args.length; i++) {
      let val = args[i];
      const funcInfo = this.getFuncInfo(val);
      
      if (funcInfo) {
        const fn = this.apiFunctions.get(funcInfo.name);
        if (fn) {
          this.parseArgs(theme, src, parserPos, funcInfo.args);
          val = fn(funcInfo.expression, theme, src, parserPos, funcInfo.args);
          args[i] = val;
        }
      }

      // Check for variable references %varname%
      if (typeof val === 'string' && !isNaN(parseFloat(val)) === false) {
        const varMatch = varRegex.exec(val);
        
        if (varMatch) {
          const varName = varMatch[1];
          
          // Check local defines first
          if (this.defines.has(varName)) {
            args[i] = this.defines.get(varName);
          } else if (CSSProcessor.globalDefines.has(varName)) {
            args[i] = CSSProcessor.globalDefines.get(varName);
          } else if (varName === 'value') {
            // Special case: 'value' refers to the original CSS value
            args[i] = this.extractValue(src, parserPos);
          }
        } else {
          // Property access like theme.namespace.property
          const propArr = val.split('.');
          
          if (propArr.length > 1 && propArr[0] === theme.namespace) {
            propArr.shift();
            let value: any = theme.data;
            
            for (const prop of propArr) {
              value = value?.[prop];
            }
            
            if (value !== undefined && value !== null) {
              args[i] = value;
            }
          }
        }
      }
    }
  }

  /**
   * Extract the original value from CSS
   */
  private extractValue(src: string, parserPos: number): string | null {
    const substr = src.substring(parserPos, src.indexOf('}', parserPos));
    const regex = /:(.*?)(;|\/|\}|$)/;
    const match = regex.exec(substr);

    if (match) {
      return match[1].trim();
    }

    return null;
  }

  /**
   * Inject generated CSS overrides into document head
   */
  private injectOverridesForTheme(theme: Theme): void {
    let css = '';
    const added = new Set<string>();

    for (const [ruleName, overrides] of this.overrides) {
      css += ruleName + ' {';
      
      for (const override of overrides) {
        const key = ruleName + override.prop;
        
        if (!added.has(key)) {
          css += `${override.prop}: ${override.value}${override.important ? ' !important' : ''};`;
          added.add(key);
        }
      }

      // Add extra closing brace for media queries
      if (ruleName.startsWith('@media')) {
        css += '}';
      }

      css += '}\n';
    }

    // Add font-face rules
    const fontMap = theme.getFonts();
    if (fontMap) {
      for (const [name, url] of fontMap) {
        css += `@font-face { font-family: ${name}; src: url('${url}'); }\n`;
      }
    }

    // Inject into head
    this.injectStyle(css);
  }

  /**
   * Inject CSS into document head
   */
  private injectStyle(css: string): void {
    const existingStyle = document.getElementById(`style-shifter-${this.namespace}`);
    
    if (existingStyle) {
      existingStyle.innerHTML = css;
    } else {
      const style = document.createElement('style');
      style.id = `style-shifter-${this.namespace}`;
      style.innerHTML = css;
      document.head.appendChild(style);
    }
  }

  private removeWhiteSpace(src: string): string {
    return src.replace(/[\s\t\n\r]/g, '');
  }

  // API Functions

  private local: APIFunction = (expression, theme, src, parserPos, args) => {
    if (args.length === 1) {
      return this.defines.has(args[0]) ? this.defines.get(args[0]) : '';
    } else if (args.length === 2 && args[0] !== 'value') {
      this.defines.set(args[0], args[1]);
    }
    return null;
  };

  private global: APIFunction = (expression, theme, src, parserPos, args) => {
    if (args.length === 1) {
      return CSSProcessor.globalDefines.has(args[0]) 
        ? CSSProcessor.globalDefines.get(args[0]) 
        : '';
    } else if (args.length === 2 && args[0] !== 'value') {
      CSSProcessor.globalDefines.set(args[0], args[1]);
    }
    return null;
  };

  private setRuleScope: APIFunction = (expression, theme, src, parserPos, args) => {
    const ruleName = this.extractRuleName(src, parserPos);
    let overrideName: string | null = null;

    if (args.length === 1) {
      overrideName = ruleName.replace(args[0], `${args[0]}.${theme.name}`);
    } else if (args[1] === 'before') {
      overrideName = ruleName.replace(args[0], `.${theme.name} ${args[0]}`);
    } else if (args[1] === 'after') {
      overrideName = ruleName.replace(args[0], `${args[0]} .${theme.name}`);
    }

    if (overrideName) {
      if (!this.ruleNameOverrides.has(theme.name)) {
        this.ruleNameOverrides.set(theme.name, new Map());
      }
      this.ruleNameOverrides.get(theme.name)!.set(ruleName, overrideName);
    }

    return null;
  };
}
