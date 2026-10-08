import { createContext, useContext, useMemo } from 'react'
import { useColorScheme } from 'react-native'

import {
  darkTokens,
  lightTokens,
  type A2uiTokens,
} from '../../catalog/basic/styles/tokens/tokens'
import type {
  A2uiThemeMode,
  A2uiTokenOverrides,
} from '../../catalog/basic/styles/tokens/types'
import { mergeTokens } from '../../catalog/basic/styles/tokens/utils'

const A2uiTokensContext = createContext<A2uiTokens>(lightTokens)

export const A2uiTokensProvider = A2uiTokensContext.Provider

/** The resolved token set for the current surface. */
export function useA2uiTokens(): A2uiTokens {
  return useContext(A2uiTokensContext)
}

export type ResolveTokensOptions = {
  /** Partial overrides for the light token set (quick theme swap). */
  lightTokens?: A2uiTokenOverrides

  /** Partial overrides for the dark token set (quick theme swap). */
  darkTokens?: A2uiTokenOverrides
}

/**
 * Resolves a theme mode to a concrete token set, mirroring
 * `useResolvedAskAITheme`: `auto` follows the OS color scheme live via
 * `useColorScheme`. Partial `tokens` / `darkTokens` overrides are deep
 * merged over the defaults for the active scheme.
 */
export function useResolvedA2uiTokens(
  mode: A2uiThemeMode = 'auto',
  overrides: ResolveTokensOptions = {},
): A2uiTokens {
  const { lightTokens: lightOverrides, darkTokens: darkOverrides } = overrides

  const systemScheme = useColorScheme()

  const isDark = useMemo(() => {
    if (mode === 'dark') {
      return
    }
    return mode === 'light' ? false : systemScheme === 'dark'
  }, [mode, systemScheme])

  return useMemo(
    () =>
      isDark
        ? mergeTokens(darkTokens, darkOverrides)
        : mergeTokens(lightTokens, lightOverrides),
    [isDark, lightOverrides, darkOverrides],
  )
}
