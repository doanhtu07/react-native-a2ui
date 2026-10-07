/** One rendered example: a single A2UI surface on a component's screen. */
export type Example = {
  title: string
  description?: string

  /** v0.9 `updateComponents` entries; the surface renders the `root` id. */
  components: Record<string, unknown>[]

  /** Initial data model, applied at `/`. */
  data?: Record<string, unknown>
}

/** All examples for one catalog component, shown on its own screen. */
export type ComponentGallery = {
  /** Route segment, e.g. `choice-picker`. */
  slug: string

  /** Catalog component name, e.g. `ChoicePicker`. */
  name: string
  summary: string
  examples: Example[]
}
