/**
 * web_core's basic catalog defaults (`injectBasicCatalogStyles`), resolved to
 * numbers. `@a2ui/react` reads these as CSS variables; React Native has none,
 * so the views read them from here. Light-scheme values; rem is 16px.
 */

const gridBase = 8
const fontSize = 16
const fontScale = 1.2

export const tokens = {
  borderRadius: 4,
  borderWidth: 1,
  color: {
    border: '#ccc',
    input: '#fff',
    onBackground: '#333',
    onInput: '#333',
    onPrimary: '#fff',
    onSecondary: '#333',
    onSurface: '#333',
    primary: '#17e',
    // --a2ui-color-primary-dark: primary mixed 85% with black
    primaryHover: '#0e65ca',
    secondary: '#ddd',
    // --a2ui-color-secondary-dark: secondary mixed 95% with black
    secondaryHover: '#d2d2d2',
    // --a2ui-color-surface: background (#eee) mixed 85% with white
    surface: '#f1f1f1',
    textCaption: '#666',
    error: 'red',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  fontSize: {
    xs: fontSize / fontScale / fontScale,
    s: fontSize / fontScale,
    m: fontSize,
    l: fontSize * fontScale,
    xl: fontSize * fontScale * fontScale,
    '2xl': fontSize * fontScale * fontScale * fontScale,
  },
  lineHeight: { body: 1.5, headings: 1.2 },
  spacing: {
    xs: gridBase / 4,
    s: gridBase / 2,
    m: gridBase,
    l: gridBase * 2,
  },
} as const
