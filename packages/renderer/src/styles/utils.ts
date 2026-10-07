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
 * Merges overrides into a style sheet key by key: an overridden key becomes
 * `[default, override]`, so the override wins; other keys are unchanged.
 */
export function mergeStyles<Sheet extends Record<string, AnyStyle>>(
  defaultStyles: Sheet,
  overrides: Record<string, StyleProp<AnyStyle>> | undefined,
): { [Key in keyof Sheet]: StyleProp<Sheet[Key]> } {
  if (!overrides) {
    return defaultStyles
  }

  const merged: Record<string, StyleProp<AnyStyle>> = { ...defaultStyles }

  for (const [key, override] of Object.entries(overrides)) {
    if (override != null) {
      merged[key] = [defaultStyles[key], override]
    }
  }

  return merged as { [Key in keyof Sheet]: StyleProp<Sheet[Key]> }
}
