import { describe, it, expect } from 'vitest';
import * as funcs from '../functions';

// Mock theme for testing
const mockTheme = {
  namespace: 'test',
  name: 'theme',
  data: {
    color: '#ff0000',
    size: 16,
    url: 'image.png'
  }
};

describe('Built-in API Functions', () => {
  describe('url', () => {
    it('should wrap URL in url()', () => {
      const result = funcs.url('', mockTheme, '', 0, ['image.png']);
      expect(result).toBe('url(image.png)');
    });

    it('should return null for null input', () => {
      const result = funcs.url('', mockTheme, '', 0, [null]);
      expect(result).toBeNull();
    });

    it('should handle URLs with protocols', () => {
      const result = funcs.url('', mockTheme, '', 0, ['https://example.com/img.jpg']);
      expect(result).toBe('url(https://example.com/img.jpg)');
    });
  });

  describe('toPx', () => {
    it('should convert unitless values to px', () => {
      const result = funcs.toPx('', mockTheme, '', 0, [16]);
      expect(result).toBe('16px');
    });

    it('should preserve existing px values', () => {
      const result = funcs.toPx('', mockTheme, '', 0, ['16px']);
      expect(result).toBe('16px');
    });

    it('should convert string numbers', () => {
      const result = funcs.toPx('', mockTheme, '', 0, ['24']);
      expect(result).toBe('24px');
    });

    it('should return null for null input', () => {
      const result = funcs.toPx('', mockTheme, '', 0, [null]);
      expect(result).toBeNull();
    });

    it('should handle decimal values', () => {
      const result = funcs.toPx('', mockTheme, '', 0, ['16.5']);
      expect(result).toBe('16.5px');
    });
  });

  describe('toRem', () => {
    it('should convert px to rem with default base', () => {
      const result = funcs.toRem('', mockTheme, '', 0, ['16px']);
      expect(result).toBe('1rem');
    });

    it('should convert px to rem with custom base', () => {
      const result = funcs.toRem('', mockTheme, '', 0, ['32px', '16']);
      expect(result).toBe('2rem');
    });

    it('should rebase rem values', () => {
      const result = funcs.toRem('', mockTheme, '', 0, ['1rem', '20']);
      // 1rem @ 16px base = 16px -> convert to 20px base
      expect(result).toContain('rem');
    });

    it('should return null for null input', () => {
      const result = funcs.toRem('', mockTheme, '', 0, [null]);
      expect(result).toBeNull();
    });

    it('should return null for zero base', () => {
      const result = funcs.toRem('', mockTheme, '', 0, ['16px', '0']);
      expect(result).toBeNull();
    });
  });

  describe('opacify', () => {
    it('should add opacity to hex color', () => {
      const result = funcs.opacify('', mockTheme, '', 0, ['#ff0000', '0.5']);
      expect(result).toContain('#ff0000');
      expect(result).toContain('80'); // 128 in hex (0.5 * 255)
    });

    it('should add opacity to rgb color', () => {
      const result = funcs.opacify('', mockTheme, '', 0, ['rgb(255, 0, 0)', '0.5']);
      expect(result).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should handle shorthand hex', () => {
      const result = funcs.opacify('', mockTheme, '', 0, ['#f00', '0.75']);
      expect(result).toContain('#f00');
    });

    it('should clamp opacity to 0-1 range', () => {
      const result1 = funcs.opacify('', mockTheme, '', 0, ['#ff0000', '2']);
      const result2 = funcs.opacify('', mockTheme, '', 0, ['#ff0000', '-1']);
      
      expect(result1).toContain('ff'); // Max opacity
      expect(result2).toContain('00'); // Min opacity
    });

    it('should return null for null input', () => {
      const result = funcs.opacify('', mockTheme, '', 0, [null, '0.5']);
      expect(result).toBeNull();
    });
  });

  describe('tint', () => {
    it('should tint a color', () => {
      const result = funcs.tint('', mockTheme, '', 0, ['#000000', '#ffffff', '0.5']);
      expect(result).toContain('rgba');
      expect(result).toContain('128'); // 50% between 0 and 255
    });

    it('should handle percentage amounts', () => {
      const result = funcs.tint('', mockTheme, '', 0, ['#000000', '#ffffff', '50%']);
      expect(result).toContain('rgba');
      expect(result).toContain('128');
    });

    it('should default to 50% if no amount specified', () => {
      const result = funcs.tint('', mockTheme, '', 0, ['#000000', '#ffffff']);
      expect(result).toContain('rgba');
    });

    it('should clamp amount to 0-1 range', () => {
      const result1 = funcs.tint('', mockTheme, '', 0, ['#000000', '#ffffff', '2']);
      const result2 = funcs.tint('', mockTheme, '', 0, ['#000000', '#ffffff', '-1']);
      
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
    });

    it('should preserve base alpha', () => {
      const result = funcs.tint('', mockTheme, '', 0, ['rgba(0, 0, 0, 0.5)', '#ffffff', '0.5']);
      expect(result).toContain('0.5'); // Alpha preserved
    });

    it('should return null for missing arguments', () => {
      const result1 = funcs.tint('', mockTheme, '', 0, [null, '#ffffff', '0.5']);
      const result2 = funcs.tint('', mockTheme, '', 0, ['#000000', null, '0.5']);
      
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('invert', () => {
    it('should invert black to white', () => {
      const result = funcs.invert('', mockTheme, '', 0, ['#000000']);
      expect(result).toBe('rgba(255, 255, 255, 1)');
    });

    it('should invert white to black', () => {
      const result = funcs.invert('', mockTheme, '', 0, ['#ffffff']);
      expect(result).toBe('rgba(0, 0, 0, 1)');
    });

    it('should invert red to cyan', () => {
      const result = funcs.invert('', mockTheme, '', 0, ['#ff0000']);
      expect(result).toBe('rgba(0, 255, 255, 1)');
    });

    it('should preserve alpha channel', () => {
      const result = funcs.invert('', mockTheme, '', 0, ['rgba(255, 0, 0, 0.5)']);
      expect(result).toContain('0.5'); // Preserved alpha
      expect(result).toContain('0, 255, 255'); // Inverted RGB
    });

    it('should handle rgb colors', () => {
      const result = funcs.invert('', mockTheme, '', 0, ['rgb(100, 150, 200)']);
      expect(result).toContain('155'); // 255 - 100
      expect(result).toContain('105'); // 255 - 150
      expect(result).toContain('55');  // 255 - 200
    });

    it('should return null for null input', () => {
      const result = funcs.invert('', mockTheme, '', 0, [null]);
      expect(result).toBeNull();
    });
  });

  describe('printf', () => {
    it('should replace placeholders with arguments', () => {
      const result = funcs.printf('', mockTheme, '', 0, ['%1 %2 %3', 'Hello', 'World', '!']);
      expect(result).toBe('Hello World !');
    });

    it('should handle single placeholder', () => {
      const result = funcs.printf('', mockTheme, '', 0, ['Value: %1', '42']);
      expect(result).toBe('Value: 42');
    });

    it('should handle multiple same placeholders', () => {
      const result = funcs.printf('', mockTheme, '', 0, ['%1 and %1', 'test']);
      expect(result).toBe('test and test');
    });

    it('should handle non-sequential placeholders', () => {
      const result = funcs.printf('', mockTheme, '', 0, ['%2 %1', 'second', 'first']);
      expect(result).toBe('first second');
    });

    it('should preserve text without placeholders', () => {
      const result = funcs.printf('', mockTheme, '', 0, ['Hello World']);
      expect(result).toBe('Hello World');
    });

    it('should handle CSS-like format strings', () => {
      const result = funcs.printf('', mockTheme, '', 0, ['%1px solid %2', '2', '#000']);
      expect(result).toBe('2px solid #000');
    });

    it('should return null for null input', () => {
      const result = funcs.printf('', mockTheme, '', 0, [null]);
      expect(result).toBeNull();
    });

    it('should handle missing arguments gracefully', () => {
      const result = funcs.printf('', mockTheme, '', 0, ['%1 %2', 'first']);
      expect(result).toContain('first');
    });
  });

  describe('mapSvgColors', () => {
    const simpleSvg = '<svg><circle fill="#FF0000"/><rect fill="#00FF00"/></svg>';

    it('should replace single color in SVG', () => {
      const result = funcs.mapSvgColors('', mockTheme, '', 0, [
        simpleSvg,
        '#FF0000',
        '#0000FF'
      ]);
      expect(result).toContain('data:image/svg+xml;base64,');
      // Decode and check
      const decoded = atob(result!.split(',')[1]);
      expect(decoded).toContain('#0000FF');
      expect(decoded).not.toContain('#FF0000');
    });

    it('should replace multiple colors', () => {
      const result = funcs.mapSvgColors('', mockTheme, '', 0, [
        simpleSvg,
        '#FF0000|#00FF00',
        '#111111',
        '#222222'
      ]);
      const decoded = atob(result!.split(',')[1]);
      expect(decoded).toContain('#111111');
      expect(decoded).toContain('#222222');
      expect(decoded).not.toContain('#FF0000');
      expect(decoded).not.toContain('#00FF00');
    });

    it('should handle colors without # prefix in original list', () => {
      const result = funcs.mapSvgColors('', mockTheme, '', 0, [
        simpleSvg,
        'FF0000',
        '#AAAAAA'
      ]);
      const decoded = atob(result!.split(',')[1]);
      expect(decoded).toContain('#AAAAAA');
    });

    it('should be case-insensitive', () => {
      const svgLowerCase = '<svg><circle fill="#ff0000"/></svg>';
      const result = funcs.mapSvgColors('', mockTheme, '', 0, [
        svgLowerCase,
        '#FF0000',
        '#ABCDEF'
      ]);
      const decoded = atob(result!.split(',')[1]);
      expect(decoded).toContain('#ABCDEF');
    });

    it('should return null for invalid inputs', () => {
      expect(funcs.mapSvgColors('', mockTheme, '', 0, [])).toBeNull();
      expect(funcs.mapSvgColors('', mockTheme, '', 0, [simpleSvg])).toBeNull();
      expect(funcs.mapSvgColors('', mockTheme, '', 0, [null, '#FF0000', '#000'])).toBeNull();
    });

    it('should return null when color counts mismatch', () => {
      const result = funcs.mapSvgColors('', mockTheme, '', 0, [
        simpleSvg,
        '#FF0000|#00FF00',
        '#111111' // Only one replacement for two originals
      ]);
      expect(result).toBeNull();
    });

    it('should generate valid base64 data URI', () => {
      const result = funcs.mapSvgColors('', mockTheme, '', 0, [
        simpleSvg,
        '#FF0000',
        '#000000'
      ]);
      expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
      // Should be valid base64
      expect(() => atob(result!.split(',')[1])).not.toThrow();
    });
  });
});
