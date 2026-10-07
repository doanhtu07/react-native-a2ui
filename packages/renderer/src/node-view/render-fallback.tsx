import type { ComponentNode } from '@a2ui/web_core'
import type {
  ReactComponentImplementation,
  NodeBuildChild,
} from '../react_component_implementation'
import { useNodeView } from './hooks/use-node-view'
import { LoadingPlaceholder } from './loading-placeholder'

/** Renders an implementation that has no `view`: its wrapper binds itself. */
export const RenderFallback: React.FC<{
  node: ComponentNode<ReactComponentImplementation>
  impl: ReactComponentImplementation
  buildChild: NodeBuildChild
}> = ({ node, impl, buildChild }) => {
  // MARK: Variables + States

  // `render` reads raw component ids from the model, not the tokens the
  // conversion puts in view props, so it resolves through the raw-id map.
  const { context, rawBuildChild } = useNodeView(node, buildChild)
  const Render = impl.render

  // MARK: Renderers

  if (!context) {
    return <LoadingPlaceholder componentId={node.componentId} />
  }

  return <Render context={context} buildChild={rawBuildChild} />
}
