import { createContext, useContext, useMemo } from 'react'
import type { StyleProp } from 'react-native'
import type { A2uiStylesMap, A2uiTokenStyles, AnyStyle } from './types'
import { mergeStyleLayers } from './utils'

export const A2uiStylesContext = createContext<A2uiStylesMap>({})

export const A2uiStylesProvider = A2uiStylesContext.Provider

/**
 * A component's style sheet: static structure, token colors, then the
 * host's `styles` overrides — overrides always last, so deeper restyles win.
 *
 * ```tsx
 * const tokens = useA2uiTokens()
 * const tokenStyles = useMemo(() => createButtonTokenStyles(tokens), [tokens])
 * const styles = useComponentStyles('Button', buttonStyles, tokenStyles)
 * ```
 *
 * Token-independent components (and host catalogs) omit `tokenStyles`;
 * behavior is then identical to the previous two-layer merge.
 */
export function useComponentStyles<Sheet extends Record<string, AnyStyle>>(
  name: string,
  staticStyles: Sheet,
  tokenStyles?: A2uiTokenStyles<Sheet>,
): { [Key in keyof Sheet]: StyleProp<Sheet[Key]> } {
  const overrides = useContext(A2uiStylesContext)[name]

  return useMemo(
    () => mergeStyleLayers(staticStyles, tokenStyles, overrides),
    [staticStyles, tokenStyles, overrides],
  )
}
