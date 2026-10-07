/**
 * The node rendering layer: everything that turns a resolved `ComponentNode`
 * into React Native output. Mirrors `@a2ui/react`'s `node-view.tsx`.
 *
 * `NodeView` walks the resolved tree, hands each implementation its node and a
 * `buildChild` that renders resolved children, and reports the child
 * references the resolver could not classify. Each implementation carries a
 * generated `view` (see `adapter.tsx`) that subscribes to its own node's props
 * through `useNodeView` and converts them back to the shapes existing views
 * expect, so a data change re-renders exactly the affected component.
 *
 * Surface lifecycle concerns (resolver construction and disposal, root
 * subscription) belong in `A2uiSurface.tsx`, not here.
 */

import {
  isComponentNode,
  type ComponentNode,
  type SurfaceModel,
} from '@a2ui/web_core'
import { memo, useCallback } from 'react'
import { StyleSheet, Text } from 'react-native'

import type {
  NodeBuildChild,
  ReactComponentImplementation,
} from '../react_component_implementation'
import { LoadingPlaceholder } from './loading-placeholder'
import { RenderFallback } from './render-fallback'
import { UnresolvedChildReference } from './unresolved-child-reference'

export { NodeSurfaceContext, NodeSurfaceProvider } from './node-surface-context'

export const NodeView = memo(
  ({
    surface,
    node,
  }: {
    surface: SurfaceModel<ReactComponentImplementation>
    node: ComponentNode<ReactComponentImplementation>
  }) => {
    // MARK: Variables + States

    const buildChild = useCallback<NodeBuildChild>(
      (child, basePath) => {
        if (isComponentNode(child)) {
          return (
            <NodeView key={child.instanceId} surface={surface} node={child} />
          )
        }

        // The resolver turns every child reference it can identify into a
        // node, so a leftover id was never classified. Distinguish the two
        // causes a catalog author can actually have.
        const requested = basePath ?? node.dataPath

        const detail = surface.componentsModel.get(child)
          ? 'the component exists, but the catalog schema does not mark the referencing ' +
            'property as a component id. Use componentId() or childList() from ' +
            '@a2ui/web_core.'
          : 'no component with this id exists on the surface.'

        return (
          <UnresolvedChildReference
            key={JSON.stringify([child, requested])}
            surface={surface}
            id={child}
            requestedPath={requested}
            detail={detail}
          />
        )
      },
      [surface, node],
    )

    // MARK: Renderers

    if (node.state === 'unknown-type') {
      return (
        <Text style={styles.error}>Unknown component type: {node.type}</Text>
      )
    }

    if (node.isPlaceholder) {
      return <LoadingPlaceholder componentId={node.componentId} />
    }

    const impl = node.impl

    if (!impl) {
      // Type narrowing; unreachable for a resolved node.
      return null
    }

    const View = impl.view

    if (!View) {
      return <RenderFallback node={node} impl={impl} buildChild={buildChild} />
    }

    return <View node={node} buildChild={buildChild} />
  },
)

NodeView.displayName = 'NodeView'

// MARK: Styles

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
})
