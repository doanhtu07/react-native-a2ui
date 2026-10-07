import { createContext, useContext } from 'react'

/**
 * `@a2ui/react` recolors a Button's child Text through the inherited
 * `--_a2ui-text-color` CSS variable. React Native text color doesn't inherit
 * through views, so Button provides it here instead.
 */
const TextColorContext = createContext<string | undefined>(undefined)
export const TextColorProvider = TextColorContext.Provider
export const useTextColor = () => useContext(TextColorContext)
