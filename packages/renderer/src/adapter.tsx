import {
  GenericBinder,
  type ComponentApi,
  type ComponentContext,
  type InferredComponentApiSchemaType,
  type ResolveA2uiProps,
} from '@a2ui/web_core'
import type React from 'react'
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react'

import type {
  NodeViewProps,
  ReactA2uiComponentProps,
  ReactComponentImplementation,
  ReactRenderProps,
} from './react_component_implementation'
import { useNodeView } from './node-view/hooks/use-node-view'
import { LoadingPlaceholder } from './node-view/loading-placeholder'

// MARK: Component Factories

/**
 * Creates a React Native component implementation using the deep generic binder.
 */
export function createComponentImplementation<Api extends ComponentApi>(
  api: Api,
  RenderComponent: React.FC<
    ReactA2uiComponentProps<
      ResolveA2uiProps<InferredComponentApiSchemaType<Api>>
    >
  >,
): ReactComponentImplementation {
  type Props = ResolveA2uiProps<InferredComponentApiSchemaType<Api>>

  const MemoizedRender = memo(RenderComponent, (prev, next) => {
    if (prev.props !== next.props) return false

    // The child index is rebuilt when a child arrives, leaves, or is
    // replaced; binder props don't change with it, so the builder's identity
    // is the only signal.
    if (prev.buildChild !== next.buildChild) return false

    if (prev.context.componentModel.id !== next.context.componentModel.id)
      return false

    if (prev.context.dataContext.path !== next.context.dataContext.path)
      return false

    return true
  })

  const ReactWrapper: React.FC<ReactRenderProps> = ({
    context,
    buildChild,
  }) => {
    // MARK: Variables + States

    const bindingRef = useRef<GenericBinder<Props> | null>(null)

    // Create or recreate the binder if the context object changes. Callers
    // memoize `context`, so a new reference means the component's model or its
    // data path changed.
    if (!bindingRef.current) {
      bindingRef.current = new GenericBinder<Props>(context, api.schema)
    } else if (
      (bindingRef.current as unknown as { context: ComponentContext })
        .context !== context
    ) {
      bindingRef.current.dispose()
      bindingRef.current = new GenericBinder<Props>(context, api.schema)
    }

    const binding = bindingRef.current

    const subscribe = useCallback(
      (callback: () => void) => {
        const sub = binding.subscribe(callback)
        return () => sub.unsubscribe()
      },
      [binding],
    )

    const getSnapshot = useCallback(() => binding.snapshot, [binding])
    const props = useSyncExternalStore(subscribe, getSnapshot)

    // MARK: Effects

    // Prevent DataModel subscription leaks on unmount
    useEffect(() => {
      return () => binding.dispose()
    }, [binding])

    // MARK: Renderers

    return (
      <MemoizedRender
        props={props || ({} as Props)}
        buildChild={buildChild}
        context={context}
      />
    )
  }

  const NodeView: React.FC<NodeViewProps> = ({ node, buildChild }) => {
    // MARK: Variables + States

    const { viewProps, context, viewBuildChild } = useNodeView(node, buildChild)

    // MARK: Renderers

    if (!context) {
      return <LoadingPlaceholder componentId={node.componentId} />
    }

    return (
      <MemoizedRender
        props={viewProps as Props}
        buildChild={viewBuildChild}
        context={context}
      />
    )
  }

  NodeView.displayName = `${api.name}.view`

  return {
    name: api.name,
    schema: api.schema,
    render: ReactWrapper,
    view: NodeView,
  }
}

/**
 * Creates a React Native component implementation that manages its own
 * context bindings (no generic binder).
 */
export function createBinderlessComponentImplementation(
  api: ComponentApi,
  RenderComponent: React.FC<ReactRenderProps>,
): ReactComponentImplementation {
  const NodeView: React.FC<NodeViewProps> = ({ node, buildChild }) => {
    // MARK: Variables + States

    // The conversion's only role here is filling the child index; the
    // component binds its own values from the context, so its child ids are
    // raw component ids, not view tokens.
    const { context, rawBuildChild } = useNodeView(node, buildChild)

    // MARK: Renderers

    if (!context) {
      return <LoadingPlaceholder componentId={node.componentId} />
    }

    return <RenderComponent context={context} buildChild={rawBuildChild} />
  }

  NodeView.displayName = `${api.name}.view`

  return {
    name: api.name,
    schema: api.schema,
    render: RenderComponent,
    view: NodeView,
  }
}
