import { createContext, useContext } from 'react'

/**
 * `@a2ui/react` opens a Modal when a click inside its trigger bubbles up to
 * the trigger `div`. React Native presses don't bubble to a parent
 * `Pressable`, so a pressable trigger (a Button) calls this as well.
 */
const ModalTriggerContext = createContext<(() => void) | undefined>(undefined)
export const ModalTriggerProvider = ModalTriggerContext.Provider
export const useModalTrigger = () => useContext(ModalTriggerContext)
