import type { A2uiTokens } from './tokens'

/**
 * How `A2uiSurface` picks between the light and dark token sets.
 *
 * - `light` / `dark` force that set.
 * - `auto` follows the host OS color scheme live via `useColorScheme`.
 */
export type A2uiThemeMode = 'light' | 'dark' | 'auto'

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? { [P in keyof T[K]]?: T[K][P] }
    : T[K]
}

/** Partial token overrides, deep merged over the defaults. */
export type A2uiTokenOverrides = DeepPartial<A2uiTokens>
