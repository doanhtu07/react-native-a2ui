/**
 * Basic catalog design tokens.
 *
 * Two layers, mirroring `@copartit/react-native-ui`'s `theme.ts`:
 *
 * - Quick color theme swap: override `tokens` / `darkTokens` (partial, deep
 *   merged) on `A2uiSurface`. The resolved tokens flow through
 *   `A2uiTokensProvider`; each component builds its colors from them via
 *   `useA2uiTokens()` and passes them as the token layer to
 *   `useComponentStyles(name, staticStyles, tokenStyles)`.
 * - Deeper per-component restyle: `styles` prop on `A2uiSurface`
 *   (`A2uiStyles`), merged after the token-derived colors, so it wins.
 *
 * `lightTokens` are web_core's basic catalog defaults
 * (`injectBasicCatalogStyles`), resolved to numbers. `@a2ui/react` reads
 * these as CSS variables; React Native has none, so the views read them from
 * here. Light-scheme values; rem is 16px.
 */

const gridBase = 8
const fontSize = 16
const fontScale = 1.2

/** A complete (resolved) token set. */
export interface A2uiTokens {
  borderRadius: number
  borderWidth: number
  color: {
    border: string
    input: string
    onBackground: string
    onInput: string
    onPrimary: string
    onSecondary: string
    onSurface: string
    primary: string
    primaryHover: string
    secondary: string
    secondaryHover: string
    surface: string
    textCaption: string
    error: string
    overlay: string
  }
  fontSize: {
    xs: number
    s: number
    m: number
    l: number
    xl: number
    '2xl': number
  }
  lineHeight: { body: number; headings: number }
  spacing: {
    xs: number
    s: number
    m: number
    l: number
  }
}

export const lightTokens: A2uiTokens = {
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
}

/**
 * Dark token set. Same shape as `lightTokens`; only color values change.
 * Primary is lightened for contrast on dark surfaces. Only `color` swaps
 * with the scheme — spacing, typography, and geometry stay in the static
 * `StyleSheet.create` sheets; restyle those per component via `styles`.
 */
export const darkTokens: A2uiTokens = {
  borderRadius: lightTokens.borderRadius,
  borderWidth: lightTokens.borderWidth,
  color: {
    border: '#3a4150',
    input: '#22262e',
    onBackground: '#f0f1f3',
    onInput: '#f0f1f3',
    onPrimary: '#fff',
    onSecondary: '#f0f1f3',
    onSurface: '#f0f1f3',
    primary: '#5b8ef0',
    primaryHover: '#7aaaf5',
    secondary: '#2e3340',
    secondaryHover: '#3a4150',
    surface: '#22262e',
    textCaption: '#a8b2bc',
    error: '#f06080',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  fontSize: { ...lightTokens.fontSize },
  lineHeight: { ...lightTokens.lineHeight },
  spacing: { ...lightTokens.spacing },
}
