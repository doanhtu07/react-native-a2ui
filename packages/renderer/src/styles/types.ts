import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'

export type AnyStyle = ViewStyle | TextStyle | ImageStyle

/**
 * The style kind a sheet entry belongs to. Entries are inferred from literal
 * token values, so overrides are typed by kind, not by the exact values.
 * Text-only keys mark a text style, `resizeMode`/`tintColor` an image style.
 */
export type StyleKind<Entry> = Entry extends { fontSize: unknown }
  ? TextStyle
  : Entry extends { fontWeight: unknown }
    ? TextStyle
    : Entry extends { fontStyle: unknown }
      ? TextStyle
      : Entry extends { color: unknown }
        ? TextStyle
        : Entry extends { tintColor: unknown }
          ? ImageStyle
          : ViewStyle

/** Overrides for a component's style sheet: any of its keys, each optional. */
export type StyleOverrides<Sheet> = {
  [Key in keyof Sheet]?: StyleProp<StyleKind<Sheet[Key]>>
}

/**
 * Style overrides for components, keyed by component name, then by the key
 * in that component's style sheet. Each override is applied after the
 * component's own style for that key, so it wins.
 *
 * ```tsx
 * <A2uiSurface
 *   surface={surface}
 *   styles={{ Button: { primary: { backgroundColor: 'teal' } } }}
 * />
 * ```
 *
 * The basic catalog's keys are typed in `A2uiStyles` (see `catalog/basic`).
 * Host catalog components read theirs with `useComponentStyles`.
 */
export type A2uiStylesMap = Record<
  string,
  Record<string, StyleProp<AnyStyle>> | undefined
>

/**
 * Token-driven colors for a component's style sheet: same keys as the
 * static sheet, plain objects only (never `StyleSheet.create`). Built from
 * `useA2uiTokens()` at render so light/dark + host `tokens` overrides apply.
 * Loosely typed on purpose — precise per-key kinds for the host's `styles`
 * overrides live in `A2uiStyles` (static sheet combined with the creator's
 * return type).
 */
export type A2uiTokenStyles<Sheet extends Record<string, AnyStyle>> = {
  [Key in keyof Sheet]?: StyleProp<AnyStyle>
}
