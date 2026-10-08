/**
 * Surface renderer driven by the node layer. Mirrors `@a2ui/react`'s
 * `A2uiSurface.tsx`.
 *
 * `A2uiSurface` owns one `NodeResolver` for the surface it is given,
 * subscribes to the resolved root node, and renders it through `NodeView`
 * under `NodeSurfaceContext`. Everything below the root, including dispatch
 * to each implementation and child reference resolution, lives in
 * `node-view.tsx`.
 *
 * Unlike `@a2ui/react`, there is no markdown renderer: Text shows its string
 * as is, and hosts that want markdown replace Text through the catalog.
 *
 * Theming is two layers, mirroring `@copartit/react-native-ui`:
 * - Quick color theme swap: `themeMode` (`auto` follows the OS scheme live)
 *   plus partial `tokens` / `darkTokens` overrides, deep merged over the
 *   defaults. Components read the resolved set via `useA2uiTokens()`.
 * - Deeper per-component restyle: `styles` (`A2uiStyles`), merged after the
 *   token-derived colors, so it always wins.
 */

import {
  effect,
  getValue,
  NodeResolver,
  peekValue,
  type SurfaceModel,
} from '@a2ui/web_core'
import type React from 'react'
import { useCallback, useMemo, useSyncExternalStore } from 'react'

import { NodeView } from './node-view/node-view'
import { NodeSurfaceProvider } from './node-view/node-surface-context'
import type { ReactComponentImplementation } from './react_component_implementation'
import type { A2uiStyles } from './catalog/basic/styles/styles-overrides'
import { A2uiStylesProvider } from './styles/styles'
import {
  A2uiTokensProvider,
  useResolvedA2uiTokens,
} from './styles/tokens/tokens'
import { LoadingPlaceholder } from './node-view/loading-placeholder'
import type { A2uiStylesMap } from './styles/types'
import type {
  A2uiThemeMode,
  A2uiTokenOverrides,
} from './catalog/basic/styles/tokens/types'

const NO_STYLES: A2uiStylesMap = {}

export const A2uiSurface: React.FC<{
  surface: SurfaceModel<ReactComponentImplementation>

  /**
   * Which token set to use. `auto` (default) follows the OS color scheme
   * live via `useColorScheme`.
   */
  themeMode?: A2uiThemeMode

  /** Partial overrides for the light token set (quick theme swap). */
  lightTokens?: A2uiTokenOverrides

  /** Partial overrides for the dark token set (quick theme swap). */
  darkTokens?: A2uiTokenOverrides

  /**
   * Deeper style overrides, keyed by component name, then by its style
   * sheet key. Applied after the token-derived colors, so they win.
   */
  styles?: A2uiStyles
}> = ({
  surface,
  themeMode = 'auto',
  lightTokens,
  darkTokens,
  styles = NO_STYLES,
}) => {
  // MARK: Variables + States

  /*
    The resolver is created inside subscribe, which React calls only for
    committed renders: a render that is discarded (concurrent mode,
    Suspense) never constructs one, and every constructed resolver is
    disposed by its own unsubscribe. StrictMode's double mount creates and
    disposes two in turn.

    The factory reads nothing; the dependency exists to reset the box when
    the surface is swapped.
  */
  const box = useMemo(
    () => ({
      resolver: undefined as
        NodeResolver<ReactComponentImplementation> | undefined,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [surface],
  )

  const subscribe = useCallback(
    (onChange: () => void) => {
      const resolver = new NodeResolver(surface, surface.defaultCatalog)
      box.resolver = resolver

      const stopEffect = effect(() => {
        getValue(resolver.rootNode)
        onChange()
      })

      return () => {
        stopEffect()
        resolver.dispose()

        if (box.resolver === resolver) {
          box.resolver = undefined
        }
      }
    },
    [surface, box],
  )
  const getSnapshot = useCallback(
    () => (box.resolver ? peekValue(box.resolver.rootNode) : undefined),
    [box],
  )

  const root = useSyncExternalStore(subscribe, getSnapshot)

  const resolvedTokens = useResolvedA2uiTokens(themeMode, {
    lightTokens,
    darkTokens,
  })

  // MARK: Renderers

  if (!root) {
    return <LoadingPlaceholder componentId="root" />
  }

  return (
    <NodeSurfaceProvider value={surface}>
      <A2uiTokensProvider value={resolvedTokens}>
        <A2uiStylesProvider value={styles}>
          <NodeView surface={surface} node={root} />
        </A2uiStylesProvider>
      </A2uiTokensProvider>
    </NodeSurfaceProvider>
  )
}
