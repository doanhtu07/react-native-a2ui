# A2UI Concepts

The building blocks of A2UI, and how [actions](./actions.md) fit between them. Based on the [A2UI concepts](https://a2ui.org/concepts/overview/) and `@a2ui/web_core@0.12.0`.

## The three pillars

```
┌──────────────────────────────────────────────────────────┐
│ SURFACE  (surfaceId, catalogId)                          │
│                                                          │
│   COMPONENTS (flat list)        DATA MODEL (JSON)        │
│   root: Column ──────────┐      {                        │
│     title: Text          │        "partySize": 4,        │
│     size: TextField ◄────┼─────►  "time": "7:00 PM"      │
│     submit: Button       │      }                        │
│                          │                               │
│        bindings: { "path": "/partySize" }                │
└──────────────────────────────────────────────────────────┘
          ▲ updateComponents / updateDataModel   │ action
          │                                      ▼
                            AGENT
```

| Pillar     | Like                | Role                                                                                                   |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------------ |
| Surface    | A screen or widget  | Isolation and lifecycle. Owns its components, data model and catalog. Several can be on screen at once |
| Components | DOM elements        | Layout and presentation. A flat list of typed components that point to their children by ID            |
| Data model | A local state store | State. A JSON object that components read from and write to through JSON Pointer paths                 |

Two more pieces connect them:

- **Catalog:** the set of component types (and functions) a surface may use. Chosen per surface in `createSurface`.
- **Actions:** the way back from client to agent. See [actions.md](./actions.md).

## Surface

The container. The agent creates it, fills it, and deletes it:

```jsonc
{ "version": "v0.9", "createSurface": { "surfaceId": "booking", "catalogId": "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json" } }
// ... updateComponents / updateDataModel ...
{ "version": "v0.9", "deleteSurface": { "surfaceId": "booking" } }
```

- Every message and action carries a `surfaceId`; that's how the agent knows which UI an action came from.
- Each surface has its own data model. Paths like `/partySize` never reach across surfaces.
- `createSurface` options: `catalogId` (required), `theme`, and `sendDataModel` (see [data model sync](./actions.md#data-model-sync-v09)).

In web_core: `SurfaceModel`. The host listens with `processor.onSurfaceCreated` and renders `<A2uiSurface surface={surface} />`.

## Components

A flat list, not a nested tree. Each entry has an `id`, a `component` type from the catalog, and its props at the top level:

```jsonc
{
  "version": "v0.9",
  "updateComponents": {
    "surfaceId": "booking",
    "components": [
      {
        "id": "root",
        "component": "Column",
        "children": ["title", "size", "submit"],
      },
      {
        "id": "title",
        "component": "Text",
        "text": "Book a table",
        "variant": "h2",
      },
      {
        "id": "size",
        "component": "TextField",
        "label": "Party size",
        "value": { "path": "/partySize" },
      },
      { "id": "submit-label", "component": "Text", "text": "Book" },
      {
        "id": "submit",
        "component": "Button",
        "child": "submit-label",
        "action": {
          "event": {
            "name": "book",
            "context": { "size": { "path": "/partySize" } },
          },
        },
      },
    ],
  },
}
```

- **Root:** rendering starts from the component with ID `root`.
- **Children:** a list of IDs (`"children": ["a", "b"]`), one ID (`"child": "a"`), or a template that repeats for each item in an array: `"children": { "path": "/items", "componentId": "item-row" }`. Inside a template, relative paths like `name` resolve against each item.
- **Why flat:** easy for LLMs to generate, can be streamed in any order, and any component can be replaced by ID with another `updateComponents`.
- **Props** are literals (`"text": "Book"`) or bindings (`"text": { "path": "/user/name" }`).

In web_core: `MessageProcessor` stores the list; `NodeResolver` turns it into a tree of `ComponentNode`s with resolved props. Our renderer maps each node to a React Native view through the catalog.

## Data model

A JSON object per surface. The source of truth for what the UI shows.

```jsonc
{
  "version": "v0.9",
  "updateDataModel": {
    "surfaceId": "booking",
    "path": "/partySize",
    "value": 4,
  },
}
```

- **Agent writes** with `updateDataModel`, at any path. Only components bound to that path re-render.
- **User writes** through input components. Typing in the `size` field sets `/partySize` locally, immediately, with **no network call**.
- **Read** by components through bindings, and by actions through `context` paths, resolved at tap time.

In web_core: `DataModel`, built on signals. Our views subscribe with `useSignalValue(node.props)`.

## Catalog

The vocabulary for a surface: which component types exist, their prop schemas, and which functions can be called.

- The **basic catalog** (`.../v0_9/catalogs/basic/catalog.json`) has `Text`, `Button`, `TextField`, `Column` and so on, plus functions like `openUrl`, `formatCurrency` and `required`.
- A **custom catalog** adds our own components and functions. Its schema is what the agent generates against, so a catalog with different contents needs its own ID.

In web_core: `Catalog`. Our renderer ships `basicCatalog` and `createBasicCatalog()`.

### Catalog negotiation

The agent can only use a catalog the client says it supports:

1. **Client advertises** its catalog IDs, ordered by preference, in the metadata of **every** message (A2A metadata, `a2uiClientCapabilities`):

   ```json
   "metadata": {
     "a2uiClientCapabilities": {
       "supportedCatalogIds": [
         "https://copart.com/a2ui/catalogs/mobile/v1",
         "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json"
       ]
     }
   }
   ```

2. **Agent picks** the best match and names it in `createSurface.catalogId`. The choice is locked for that surface's lifetime.
3. **No match:** the agent sends no UI.

**Why a list, when a surface has one catalog?** `supportedCatalogIds` describes the **client** (everything it can render); `catalogId` describes **one surface** (what the agent picked). The list exists because:

- **Several agents:** our agent may know `copart/mobile/v1`, a generic agent only the basic catalog. Each picks the first ID it understands.
- **Migrations:** list `[".../mobile/v2", ".../mobile/v1"]` so updated and older agents both work, without releasing the app and agent together.
- **Per-surface choice:** one agent can render a `lot-detail` surface with our catalog and a `confirm` dialog with the basic one.

On the device it's the same: `new MessageProcessor([copartCatalog, basicCatalog])` registers both, and each `createSurface` selects one by ID. If only our own agent talks to the app and our catalog extends the basic one, advertising just our ID is enough.

web_core builds the payload from the catalogs the processor was created with; the host attaches it to outgoing messages, the same way as `a2uiClientDataModel`:

```ts
const caps = processor.getRendererCapabilities({ versions: ['v0.9'] })
// { 'v0.9': { supportedCatalogIds: [...] } }

await agentClient.send(message, {
  metadata: { a2uiClientCapabilities: caps['v0.9'] },
})
```

Notes:

- **IDs only, not schemas.** The agent must already know what each ID means (it's built into the agent's prompt or tooling). This is why a catalog with different contents needs a new ID, and a breaking change needs a new version in the URI (`.../mobile/v2`). During a migration the client lists both.
- **Inline catalogs:** `getRendererCapabilities({ versions, includeInlineCatalogs: true })` also sends the full catalog schemas (components, functions, `instructions`). The spec supports this but doesn't recommend it in production.
- **Order matters:** put our custom catalog first so the agent prefers it, with the basic catalog as a fallback.

## How actions connect the pillars

The data model changes locally all the time; the agent hears nothing until an action fires.

```
user types "4"          TextField writes /partySize = 4          (local, no network)
user taps "Book"        Button.action fires
  ├─ functionCall  →    catalog function runs on device          (agent not told)
  └─ event         →    context resolved from data model
                        → { action: { name: "book", surfaceId: "booking", context: { size: 4 } } }
                        → host actionHandler → agent
agent replies           updateDataModel / updateComponents / deleteSurface for "booking"
```

So, in terms of the pillars:

- An action **originates from a component** (`sourceComponentId`).
- It **reads from the data model** (its `context`, or the whole model with `sendDataModel`).
- It's **scoped to a surface** (`surfaceId`), and the agent's reply targets that same surface.

## Messages at a glance

| Direction      | Message            | Does                                      |
| -------------- | ------------------ | ----------------------------------------- |
| Agent → client | `createSurface`    | New surface with a catalog                |
| Agent → client | `updateComponents` | Add or replace components by ID           |
| Agent → client | `updateDataModel`  | Set a value at a path                     |
| Agent → client | `deleteSurface`    | Remove the surface                        |
| Client → agent | `action`           | A user triggered an event                 |
| Client → agent | `error`            | Validation or runtime error on the client |

v1.0 adds RPC (`callAgentFunction` and its responses); we target v0.9.
