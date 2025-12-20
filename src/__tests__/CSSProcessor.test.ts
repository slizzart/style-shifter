import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CSSProcessor } from '../CSSProcessor';
import { Theme } from '../Theme';
import { APIFunction } from '../types';

describe('CSSProcessor', () => {
  let processor: CSSProcessor;

  beforeEach(() => {
    processor = new CSSProcessor({ namespace: 'test' });
    
    // Clear any existing style tags
    const existingStyles = document.querySelectorAll('style[id^="style-shifter-"]');
    existingStyles.forEach(el => el.remove());
  });

  afterEach(() => {
    // Clean up
    const styles = document.querySelectorAll('style[id^="style-shifter-"]');
    styles.forEach(el => el.remove());
  });

  describe('constructor', () => {
    it('should create processor with namespace', () => {
      expect(processor).toBeDefined();
      expect((processor as any).namespace).toBe('test');
    });

    it('should register built-in functions', () => {
      expect((processor as any).apiFunctions.has('url')).toBe(true);
      expect((processor as any).apiFunctions.has('toPx')).toBe(true);
      expect((processor as any).apiFunctions.has('toRem')).toBe(true);
      expect((processor as any).apiFunctions.has('opacify')).toBe(true);
      expect((processor as any).apiFunctions.has('tint')).toBe(true);
      expect((processor as any).apiFunctions.has('invert')).toBe(true);
      expect((processor as any).apiFunctions.has('printf')).toBe(true);
    });

    it('should accept preprocessors and postprocessors', () => {
      const pre = vi.fn();
      const post = vi.fn();
      
      const proc = new CSSProcessor({
        namespace: 'test',
        preprocessors: [pre],
        postprocessors: [post]
      });

      expect((proc as any).preprocessors.length).toBe(1);
      expect((proc as any).postprocessors.length).toBe(1);
    });
  });

  describe('registerFunction', () => {
    it('should register custom function', () => {
      const customFn: APIFunction = () => 'custom-result';
      processor.registerFunction('custom', customFn);

      expect((processor as any).apiFunctions.has('custom')).toBe(true);
    });

    it('should allow overriding built-in functions', () => {
      const customUrl: APIFunction = () => 'custom-url';
      processor.registerFunction('url', customUrl);

      expect((processor as any).apiFunctions.get('url')).toBe(customUrl);
    });
  });

  describe('evaluateExpression', () => {
    it('should evaluate property access', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: { color: '#ff0000' }
      });

      const result = (processor as any).evaluateExpression('test.color', theme, '', 0);
      expect(result).toBe('#ff0000');
    });

    it('should evaluate nested property access', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: { 
          colors: { 
            primary: '#ff0000' 
          } 
        }
      });

      const result = (processor as any).evaluateExpression('test.colors.primary', theme, '', 0);
      expect(result).toBe('#ff0000');
    });

    it('should evaluate function calls', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: { size: 16 }
      });

      const result = (processor as any).evaluateExpression('toPx(test.size)', theme, '', 0);
      expect(result).toBe('16px');
    });

    it('should return null for undefined properties', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: {}
      });

      const result = (processor as any).evaluateExpression('test.undefined', theme, '', 0);
      expect(result).toBeNull();
    });
  });

  describe('getFuncInfo', () => {
    it('should parse function name and arguments', () => {
      const result = (processor as any).getFuncInfo('toPx(16)');
      
      expect(result).toBeDefined();
      expect(result.name).toBe('toPx');
      expect(result.args).toEqual(['16']);
    });

    it('should parse multiple arguments', () => {
      const result = (processor as any).getFuncInfo('printf(%1 %2, hello, world)');
      
      expect(result.name).toBe('printf');
      expect(result.args.length).toBeGreaterThan(1);
    });

    it('should return null for non-function expressions', () => {
      const result = (processor as any).getFuncInfo('test.color');
      expect(result).toBeNull();
    });

    it('should handle nested parentheses', () => {
      const result = (processor as any).getFuncInfo('outer(inner(value))');
      
      expect(result).toBeDefined();
      expect(result.name).toBe('outer');
    });
  });

  describe('parseArgsList', () => {
    it('should parse comma-separated arguments', () => {
      const result = (processor as any).parseArgsList('arg1, arg2, arg3');
      expect(result).toEqual(['arg1', 'arg2', 'arg3']);
    });

    it('should handle nested parentheses', () => {
      const result = (processor as any).parseArgsList('outer, inner(a, b), last');
      expect(result).toHaveLength(3);
      expect(result[1]).toContain('inner(a, b)');
    });

    it('should trim whitespace', () => {
      const result = (processor as any).parseArgsList('  arg1  ,  arg2  ');
      expect(result).toEqual(['arg1', 'arg2']);
    });

    it('should handle empty string', () => {
      const result = (processor as any).parseArgsList('');
      expect(result).toEqual([]);
    });
  });

  describe('formatRuleSelector', () => {
    it('should add theme class to selector', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'dark',
        data: {}
      });

      const result = (processor as any).formatRuleSelector('.button', theme);
      expect(result).toBe('.dark .button');
    });

    it('should handle multiple selectors', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'dark',
        data: {}
      });

      const result = (processor as any).formatRuleSelector('.button, .link', theme);
      expect(result).toContain('.dark .button');
      expect(result).toContain('.dark .link');
    });

    it('should handle media queries', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'dark',
        data: {}
      });

      const result = (processor as any).formatRuleSelector('@media screen { .button', theme);
      expect(result).toContain('@media');
      expect(result).toContain('.dark');
    });
  });

  describe('extractRuleName', () => {
    const css = `
.button { color: red; }
.link { color: blue; }
@media screen {
  .responsive { font-size: 16px; }
}`;

    it('should extract simple rule name', () => {
      const idx = css.indexOf('color: red');
      const result = (processor as any).extractRuleName(css, idx, false);
      expect(result).toBe('.button');
    });

    it('should extract rule with multiple selectors', () => {
      const css2 = '.button, .link { color: red; }';
      const idx = css2.indexOf('color');
      const result = (processor as any).extractRuleName(css2, idx, false);
      expect(result).toContain('.button');
      expect(result).toContain('.link');
    });

    it('should handle media queries', () => {
      const idx = css.indexOf('font-size');
      const result = (processor as any).extractRuleName(css, idx, true);
      expect(result).toContain('@media');
    });
  });

  describe('removeWhiteSpace', () => {
    it('should remove all whitespace', () => {
      const result = (processor as any).removeWhiteSpace('  hello  world  ');
      expect(result).toBe('helloworld');
    });

    it('should remove tabs and newlines', () => {
      const result = (processor as any).removeWhiteSpace('hello\t\n\rworld');
      expect(result).toBe('helloworld');
    });
  });

  describe('local and global variables', () => {
    it('should set and get local variables', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: {}
      });

      // Set variable
      (processor as any).local('', theme, '', 0, ['myVar', 'myValue']);
      
      // Get variable
      const result = (processor as any).local('', theme, '', 0, ['myVar']);
      expect(result).toBe('myValue');
    });

    it('should set and get global variables', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: {}
      });

      // Set variable
      (processor as any).global('', theme, '', 0, ['globalVar', 'globalValue']);
      
      // Get variable
      const result = (processor as any).global('', theme, '', 0, ['globalVar']);
      expect(result).toBe('globalValue');
    });

    it('should not override reserved "value" variable', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: {}
      });

      (processor as any).local('', theme, '', 0, ['value', 'shouldNotSet']);
      
      // Should not be set
      const result = (processor as any).defines.get('value');
      expect(result).toBeUndefined();
    });

    it('should return empty string for undefined variables', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: {}
      });

      const result = (processor as any).local('', theme, '', 0, ['undefined']);
      expect(result).toBe('');
    });
  });

  describe('addTheme', () => {
    it('should not process same theme twice', () => {
      const theme = new Theme({
        namespace: 'test',
        name: 'theme',
        data: { color: '#000' }
      });

      processor.addTheme(theme);
      processor.addTheme(theme);

      expect((processor as any).themeCached.has(theme.name)).toBe(true);
      expect((processor as any).themeCached.size).toBe(1);
    });
  });

  describe('injectStyle', () => {
    it('should inject style tag into document', () => {
      const css = '.test { color: red; }';
      (processor as any).injectStyle(css);

      const styleEl = document.getElementById('style-shifter-test');
      expect(styleEl).toBeDefined();
      expect(styleEl?.innerHTML).toBe(css);
    });

    it('should update existing style tag', () => {
      const css1 = '.test { color: red; }';
      const css2 = '.test { color: blue; }';

      (processor as any).injectStyle(css1);
      (processor as any).injectStyle(css2);

      const styleEl = document.getElementById('style-shifter-test');
      expect(styleEl?.innerHTML).toBe(css2);
    });
  });

  describe('integration', () => {
    it('should process theme with mock CSS', () => {
      // Create a mock stylesheet in the document
      const style = document.createElement('style');
      style.innerHTML = `
        .button {
          /*![test.primaryColor]*/
          background-color: #000000;
        }
      `;
      document.head.appendChild(style);

      const theme = new Theme({
        namespace: 'test',
        name: 'custom',
        data: { primaryColor: '#ff0000' }
      });

      processor.addTheme(theme);

      // Check if style was injected
      const injectedStyle = document.getElementById('style-shifter-test');
      expect(injectedStyle).toBeDefined();

      // Clean up
      style.remove();
    });

    it('should handle minified CSS without trailing semicolons', () => {
      const style = document.createElement('style');
      style.innerHTML = `
        .button{background-color:/*![test.primaryColor]*/#000;color:#fff}
      `;
      document.head.appendChild(style);

      const theme = new Theme({
        namespace: 'test',
        name: 'minified',
        data: { primaryColor: '#ff0000' }
      });

      processor.addTheme(theme);

      // Check if style was injected
      const injectedStyle = document.getElementById('style-shifter-test');
      expect(injectedStyle).toBeDefined();
      expect(injectedStyle?.textContent).toContain('background-color: #ff0000');

      // Clean up
      style.remove();
    });

    it('should handle minified CSS with multiple declarations ending with closing brace', () => {
      const style = document.createElement('style');
      style.innerHTML = `
        .card{border:1px solid /*![test.borderColor]*/#ccc;border-radius:/*![test.radius]*/4px}
      `;
      document.head.appendChild(style);

      const theme = new Theme({
        namespace: 'test',
        name: 'minified-multi',
        data: { borderColor: '#ff6b6b', radius: '8px' }
      });

      processor.addTheme(theme);

      // Check if style was injected
      const injectedStyle = document.getElementById('style-shifter-test');
      expect(injectedStyle).toBeDefined();
      expect(injectedStyle?.textContent).toContain('border: 1px solid #ff6b6b');
      expect(injectedStyle?.textContent).toContain('border-radius: 8px');

      // Clean up
      style.remove();
    });
  });
});
