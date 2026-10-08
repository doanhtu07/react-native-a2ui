import type { StyleProp } from 'react-native'
import type { AnyStyle } from './types'

/**
 * Three-layer merge for token-aware components, key by key:
 * `[static, token, override]`.
 *
 * - `static`: `StyleSheet.create` at module level — structure plus
 *   non-color token values. Built once.
 * - `token`: plain-object colors resolved from `useA2uiTokens()` at render
 *   (light/dark + host `tokens` overrides). Never `StyleSheet.create`.
 * - `override`: the host's deeper `styles` override. Always last, so it wins
 *   over both layers.
 *
 * Keys with neither a token nor an override entry keep their static identity.
 * Override-only keys (host catalogs) are appended as `[static, override]`.
 */
export function mergeStyleLayers<Sheet extends Record<string, AnyStyle>>(
  staticStyles: Sheet,
  tokenStyles: Partial<Record<keyof Sheet, StyleProp<AnyStyle>>> | undefined,
  overrides: Record<string, StyleProp<AnyStyle>> | undefined,
): { [Key in keyof Sheet]: StyleProp<Sheet[Key]> } {
  if (!tokenStyles && !overrides) {
    return staticStyles
  }

  const merged: Record<string, StyleProp<AnyStyle>> = { ...staticStyles }

  const keys = new Set<string>([
    ...Object.keys(tokenStyles ?? {}),
    ...Object.keys(overrides ?? {}),
  ])

  for (const key of keys) {
    const token = tokenStyles?.[key as keyof Sheet]
    const override = overrides?.[key]

    if (token == null && override == null) {
      continue
    }

    merged[key] = [staticStyles[key], token, override].filter(
      (entry) => entry != null,
    ) as StyleProp<AnyStyle>
  }

  return merged as { [Key in keyof Sheet]: StyleProp<Sheet[Key]> }
}
