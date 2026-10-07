import { type Signal, effect, getValue, peekValue } from '@a2ui/web_core'
import { useCallback, useSyncExternalStore } from 'react'

export function useSignalValue<T>(signal: Signal<T>): T {
  const subscribe = useCallback(
    (onChange: () => void) =>
      effect(() => {
        getValue(signal)
        onChange()
      }),
    [signal],
  )

  const getSnapshot = useCallback(() => peekValue(signal), [signal])

  return useSyncExternalStore(subscribe, getSnapshot)
}
