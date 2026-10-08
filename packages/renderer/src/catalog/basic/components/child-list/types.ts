// Type-only: the `v0_9` entry loads Lit at runtime, but types are erased
import type { ComponentId } from '@a2ui/web_core/v0_9'

export type ResolvedChildRef =
  | ComponentId
  | {
      id: ComponentId
      basePath: string
    }

export type ResolvedChildList = ResolvedChildRef[]
