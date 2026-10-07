import { createContext } from 'react'
import type { SurfaceModel } from '@a2ui/web_core'

import type { ReactComponentImplementation } from '../react_component_implementation'

/** The surface a node view renders under, provided by `A2uiSurface`. */
export const NodeSurfaceContext =
  createContext<SurfaceModel<ReactComponentImplementation> | null>(null)

export const NodeSurfaceProvider = NodeSurfaceContext.Provider
