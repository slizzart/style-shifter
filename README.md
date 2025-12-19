# StyleShifter

A lean, powerful TypeScript library for dynamic CSS theming with expression-based style overrides.

## 🚀 <a href="https://bournazosharry.github.io/StyleShifter/" target="_blank"><strong>Live Interactive Demo</strong></a>

Experience StyleShifter in action! Switch between 6 different themes and see real-time CSS transformations.

## Features

- 🎨 **Dynamic Theming**: Apply and switch themes at runtime
- 🔧 **Expression-Based Overrides**: Use special CSS comments to inject theme values
- 🎯 **Type-Safe**: Full TypeScript support
- 🔌 **Extensible API**: Add your own custom functions
- 📦 **Lightweight**: No dependencies
- 🌊 **Theme Cascading**: Inherit properties from base themes

## Installation

```bash
npm install style-shifter
```

## Quick Start

### 1. Create a Theme

```typescript
import { Theme, CSSProcessor } from 'style-shifter';

const darkTheme = new Theme({
  namespace: 'myapp',
  name: 'dark',
  data: {
    primaryColor: '#1a1a1a',
    textColor: '#ffffff',
    accentColor: '#3b82f6',
    fontSize: 16
  }
});
```

### 2. Add Theme Expressions to Your CSS

In your CSS/SCSS files, use the special `/*![expression]*/` syntax:

```css
.button {
  /*![myapp.primaryColor]*/
  background-color: #000000;
  
  /*![myapp.textColor]*/
  color: #fff;
  
  /*![toPx(myapp.fontSize)]*/
  font-size: 16px;
}

.accent {
  /*![opacify(myapp.accentColor, 0.8)]*/
  background-color: rgba(59, 130, 246, 0.8);
}
```

### 3. Process and Apply the Theme

```typescript
const processor = new CSSProcessor({ namespace: 'myapp' });
processor.addTheme(darkTheme);

// Apply theme to an element (adds class name)
darkTheme.applyTo(document.body);

// Remove theme
darkTheme.removeFrom(document.body);
```

## How It Works

StyleShifter scans your loaded CSS files for special comments in the format `/*![expression]*/`. When a theme is added:

1. It parses these expressions
2. Evaluates them using theme data and built-in functions
3. Generates CSS overrides scoped to your theme class
4. Injects the overrides into the document `<head>`

The theme is applied by simply adding a CSS class (e.g., `.myapp-dark`) to an element.

## Built-in API Functions

### `url(string)`
Wraps a URL in `url()` for CSS.

```css
/*![url(myapp.backgroundImage)]*/
background-image: url(image.png);
```

### `toPx(value)`
Converts a unitless value to pixels.

```css
/*![toPx(myapp.spacing)]*/
padding: 16px;
```

### `toRem(size, base?, initialBase?)`
Converts px to rem or rebases rem values.

```css
/*![toRem(myapp.fontSize, 16)]*/
font-size: 1rem;
```

### `opacify(color, opacity)`
Adds opacity to a color (hex or rgb).

```css
/*![opacify(myapp.primaryColor, 0.5)]*/
background-color: rgba(26, 26, 26, 0.5);
```

### `tint(baseColor, tintColor, amount)`
Tints a color by mixing with another color.

```css
/*![tint(myapp.backgroundColor, #ffffff, 0.1)]*/
background-color: rgba(30, 30, 30, 1);
```

### `invert(color)`
Inverts a color (255 - RGB).

```css
/*![invert(myapp.primaryColor)]*/
color: rgba(235, 235, 235, 1);
```

### `printf(format, ...args)`
String formatting with placeholders.

```css
/*![printf(%1 %2px solid %3, 2, myapp.borderWidth, myapp.borderColor)]*/
border: 2px solid #ccc;
```

### `local(varName, value?)`
Get or set a local variable (scoped to this processor instance).

```css
/*![local(computed, tint(myapp.primary, #fff, 0.2))]*/
/*![local(computed)]*/
background: ...;
```

### `global(varName, value?)`
Get or set a global variable (shared across all processors).

### `setRuleScope(selector, position?)`
Modify where the theme class is attached in the selector.

## Custom API Functions

You can extend the API with your own functions:

```typescript
import { CSSProcessor, APIFunction } from 'style-shifter';

const processor = new CSSProcessor({ namespace: 'myapp' });

// Custom function to darken colors
const darken: APIFunction = (expression, theme, src, parserPos, args) => {
  const color = args[0];
  const amount = parseFloat(args[1] || '0.1');
  
  // Your color manipulation logic here
  return `rgba(...)`;
};

processor.registerFunction('darken', darken);
```

Then use it in CSS:

```css
.element {
  /*![darken(myapp.primaryColor, 0.2)]*/
  background-color: #000;
}
```

## Theme Cascading

Use `ThemeRegistry` to set up inheritance:

```typescript
import { ThemeRegistry } from 'style-shifter';

// Register base defaults
ThemeRegistry.registerCascade('myapp', {
  fontSize: 14,
  fontFamily: 'sans-serif',
  spacing: 8
});

// Create theme - it will inherit these defaults
const theme = new Theme({
  namespace: 'myapp',
  name: 'custom',
  data: {
    primaryColor: '#ff0000'
    // fontSize, fontFamily, spacing are inherited
  }
});

// Apply cascades
ThemeRegistry.applyCascade('myapp', theme.data);
```

## Advanced Features

### Preprocessors and Postprocessors

Transform override values before injection:

```typescript
const processor = new CSSProcessor({
  namespace: 'myapp',
  preprocessors: [
    (theme, override) => {
      // Modify override.value before applying
      return override.value;
    }
  ],
  postprocessors: [
    (theme, override) => {
      // Final transformations
      return override.value;
    }
  ]
});
```

### Font Loading

Themes can include custom fonts:

```typescript
const theme = new Theme({
  namespace: 'myapp',
  name: 'custom',
  data: { /* ... */ },
  fonts: new Map([
    ['title-font', 'https://example.com/fonts/title.woff2'],
    ['body-font', 'https://example.com/fonts/body.woff2']
  ])
});
```

### Image Preloading

Ensure images are loaded before theme is ready:

```typescript
const theme = new Theme({
  namespace: 'myapp',
  name: 'custom',
  data: { /* ... */ },
  preloadImages: [
    'https://example.com/bg.jpg',
    'https://example.com/logo.png'
  ]
});

theme.onComplete(() => {
  console.log('Theme ready with all assets loaded!');
});
```

## TypeScript Support

Full type definitions are included:

```typescript
import type { ThemeData, ThemeOptions, APIFunction } from 'style-shifter';

const myThemeData: ThemeData = {
  color: '#fff',
  size: 16
};
```

## Browser Support

StyleShifter works in all modern browsers that support:
- ES2020
- DOM manipulation
- CSS injection

## License

MIT

## Contributing

Contributions are welcome! This library is designed to be extensible - feel free to add new API functions or features.
