# StyleShifter Agent Guide (Autonomous Integration)

This guide is the single source of truth for integrating `@slizzart/style-shifter` into another project with minimal guesswork.

It is based on the current codebase behavior (`src/*`) and demo patterns (`docs/demo.js`, `docs/demo.css`).

---

## 1) What StyleShifter does

StyleShifter scans runtime CSS for theme expressions in comments, evaluates them against a `Theme`, and injects scoped override CSS into a generated `<style>` tag.

- Expression marker: `/*![expression]*/`
- Typical expression: `demo.primaryButton` or `toPx(demo.size)`
- Output scope: selectors are rewritten as `.THEME_NAME <original-selector>`

When you apply a theme, StyleShifter works by class name. If the theme name is `dark`, your element must have class `dark`.

---

## 2) Install

```bash
npm install @slizzart/style-shifter
```

---

## 3) Canonical integration (copy/paste)

### JavaScript/TypeScript

```ts
import { Theme, CSSProcessor } from '@slizzart/style-shifter';

// 1) Create processor once per namespace
const processor = new CSSProcessor({ namespace: 'demo' });

// 2) Define theme data
const darkTheme = new Theme({
  namespace: 'demo',
  name: 'dark',
  data: {
    primary: '#111827',
    text: '#f9fafb',
    baseSize: 16
  }
});

// 3) Parse existing loaded CSS and inject generated overrides
processor.addTheme(darkTheme);

// 4) Activate theme by adding theme.name as class
//    (Theme applies only the name, e.g. "dark")
darkTheme.applyTo(document.body);

// Optional deactivation
// darkTheme.removeFrom(document.body);
```

### CSS (parser-safe pattern)

Use expressions inline inside declarations:

```css
.button {
  background: /*![demo.primary]*/ #2563eb;
  color: /*![demo.text]*/ #ffffff;
  font-size: /*![toPx(demo.baseSize)]*/ 16px;
}
```

This inline form is the most reliable pattern with current parser behavior.

---

## 4) Runtime model agents should assume

1. `processor.addTheme(theme)` scans:
   - `document.styleSheets` (external + inline loaded styles)
   - `<style>` elements not yet represented in `document.styleSheets`
2. Each expression is evaluated.
3. Overrides are grouped and injected into `<style id="style-shifter-<namespace>">`.
4. Theme visual activation happens only when target elements include class `theme.name`.

Important implications:

- `theme.name` is the class selector anchor (not `namespace-name` by default).
- `addTheme` caches by `theme.name`; calling it again for the same name is a no-op.
- The library does not provide a public API to clear cached processed themes from a processor.

---

## 5) Expression syntax and rules

## 5.1 Direct property access

```css
.card { border-color: /*![demo.primary]*/ #3b82f6; }
```

- Prefix must match `theme.namespace` (`demo` in this example).
- Nested access is supported: `demo.colors.primary`.

## 5.2 Function calls

```css
.title { font-size: /*![toPx(demo.baseSize)]*/ 16px; }
.overlay { background: /*![opacify(demo.primary, 0.5)]*/ rgba(0,0,0,.5); }
```

## 5.3 Keep a valid fallback

Always keep a valid fallback value after the expression marker. This fallback is used as default CSS and as parser context.

---

## 6) Built-in functions

- `url(string)`
- `toPx(value)`
- `toRem(size, base?, initialBase?)`
- `opacify(color, opacity)`
- `tint(baseColor, tintColor, amount)`
- `invert(color)`
- `printf(format, ...args)`
- `mapSvgColors(svgContent, originalColors, ...themeColors)`
- `local(varName, value?)` (processor-local variable store)
- `global(varName, value?)` (shared across processors)
- `setRuleScope(selector, position?)`

For SVG recoloring, `mapSvgColors` expects:
- full SVG string,
- original colors as pipe-separated string (e.g. `"#FF0000|#00FF00"`),
- one replacement color per original color.

---

## 7) Custom API function registration

```ts
import { CSSProcessor, type APIFunction } from '@slizzart/style-shifter';

const processor = new CSSProcessor({ namespace: 'demo' });

const darken: APIFunction = (expression, theme, src, parserPos, args) => {
  const color = String(args[0] ?? '#000000');
  const amount = Number(args[1] ?? 0.1);
  // Return CSS-ready value
  return color; // replace with real implementation
};

processor.registerFunction('darken', darken);
```

Use in CSS:

```css
.btn { background: /*![darken(demo.primary, 0.2)]*/ #1f2937; }
```

---

## 8) Theme cascade (multi-source theme data)

Use `ThemeRegistry` to provide defaults and layer multiple data sources.

```ts
import { Theme, ThemeRegistry } from '@slizzart/style-shifter';

ThemeRegistry.registerCascade('demo', {
  spacing: 8,
  radius: '8px'
});

const theme = new Theme({
  namespace: 'demo',
  name: 'dark',
  data: { primary: '#111827' }
});

ThemeRegistry.applyCascade('demo', theme.data);
```

From the demo pattern, this is useful for combining independent dimensions (e.g., color theme + typography theme).

---

## 9) Preprocessors and postprocessors

Use `CSSProcessor` options to transform generated values.

```ts
const processor = new CSSProcessor({
  namespace: 'demo',
  preprocessors: [
    (theme, override) => override.value
  ],
  postprocessors: [
    (theme, override) => override.value
  ]
});
```

Both processors receive `(theme, override)` and can return a replacement string or `null`.

---

## 10) Fonts and image preload support in Theme

```ts
const theme = new Theme({
  namespace: 'demo',
  name: 'dark',
  data: { primary: '#111827' },
  fonts: new Map([
    ['title-font', 'https://example.com/title.woff2']
  ]),
  preloadImages: [
    'https://example.com/hero.jpg'
  ]
});

theme.onComplete(() => {
  // all pending preloads finished
});
```

---

## 11) Agent playbook for integrating into any project

1. Pick a namespace (e.g. `app`).
2. Create one `CSSProcessor` per namespace.
3. Ensure theme classes are unique and meaningful (e.g. `dark`, `ocean`, `compact`).
4. Insert expressions into CSS declarations using inline syntax:
   - `prop: /*![app.token]*/ fallback;`
5. Add and activate themes:
   - `processor.addTheme(theme)` once per `theme.name`
   - `theme.applyTo(targetElement)` to switch on
6. For switching themes in same dimension:
   - remove old theme class (`oldTheme.removeFrom(target)`)
   - apply new theme class (`newTheme.applyTo(target)`)
7. If theme data changes but name stays the same, create a new `Theme` name or a new `CSSProcessor` instance before re-processing.

---

## 12) Operational caveats (important for autonomous agents)

- External stylesheets may fail to parse due to CORS; current implementation silently ignores fetch errors.
- CSS scanning is runtime-based (loaded styles only).
- Theme application is class-based only; no automatic DOM scope discovery.
- Processor cache key is theme name, not theme object identity.
- Injected style element id format is fixed: `style-shifter-<namespace>`.

---

## 13) Minimal acceptance checklist

An integration is correct if all are true:

- Expressions are in CSS using `/*![...]*/`.
- Expressions reference the same namespace used by the theme.
- `processor.addTheme(theme)` has run before expecting overrides.
- Target DOM node has class equal to `theme.name`.
- Generated style tag exists: `#style-shifter-<namespace>`.

---

## 14) Quick troubleshooting

- No visual change:
  - verify target has class `theme.name`.
  - verify expression namespace matches `theme.namespace`.
  - verify `addTheme` was called.
- Some expressions not applied:
  - switch to inline expression syntax inside declaration values.
- External CSS rules missing:
  - check CORS/accessibility of stylesheet URLs.
- Updated theme data ignored:
  - processor already cached that `theme.name`; use a new name or new processor instance.

---

If you are building an automated integration, treat this document as implementation guidance and default contract for current StyleShifter behavior.