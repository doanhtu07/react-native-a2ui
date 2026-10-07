import { createContext, useContext, useMemo } from 'react'
import type { StyleProp } from 'react-native'
import { mergeStyles, type A2uiStylesMap, type AnyStyle } from './utils'

export const A2uiStylesContext = createContext<A2uiStylesMap>({})

export const A2uiStylesProvider = A2uiStylesContext.Provider

/** A component's style sheet with the host's overrides merged in. */
export function useComponentStyles<Sheet extends Record<string, AnyStyle>>(
  name: string,
  defaultStyles: Sheet,
): { [Key in keyof Sheet]: StyleProp<Sheet[Key]> } {
  const overrides = useContext(A2uiStylesContext)[name]

  return useMemo(
    () => mergeStyles(defaultStyles, overrides),
    [defaultStyles, overrides],
  )
}
