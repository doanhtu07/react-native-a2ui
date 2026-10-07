import type { SurfaceModel } from '@a2ui/web_core'
import { useEffect } from 'react'
import type { ReactComponentImplementation } from '../react_component_implementation'
import { StyleSheet, Text } from 'react-native'

/** Unresolved-reference reports already dispatched, per surface. */
const reportedUnresolved = new WeakMap<
  SurfaceModel<ReactComponentImplementation>,
  Set<string>
>()

/**
 * The in-tree notice for a child reference the resolver built no node for.
 * Also reports it through the surface's error channel once per (id, path)
 * so agents see it too, matching how the resolver reports unknown types and
 * cycles. The report runs in an effect: dispatching during render would
 * invoke onError subscribers while React is rendering, and a subscriber
 * that sets state would then warn.
 */
export const UnresolvedChildReference: React.FC<{
  surface: SurfaceModel<ReactComponentImplementation> | null
  id: string
  requestedPath: string
  detail: string
}> = ({ surface, id, requestedPath, detail }) => {
  // MARK: Variables + States

  const message = `Unresolved child reference '${id}' at '${requestedPath}': ${detail}`

  // MARK: Effects

  useEffect(() => {
    if (!surface) {
      return
    }

    let seen = reportedUnresolved.get(surface)

    if (!seen) {
      seen = new Set()
      reportedUnresolved.set(surface, seen)
    }

    const key = JSON.stringify([id, requestedPath])

    if (!seen.has(key)) {
      seen.add(key)

      surface
        .dispatchError({ code: 'UNRESOLVED_CHILD_REFERENCE', message })
        .catch(() => {})
    }
  }, [surface, id, requestedPath, message])

  // MARK: Renderers

  return <Text style={styles.error}>{message}</Text>
}

// MARK: Styles

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
})
