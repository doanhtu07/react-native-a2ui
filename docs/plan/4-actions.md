# Actions

How A2UI actions work, and who calls the API when a user taps a button. Based on the [A2UI actions concept](https://a2ui.org/concepts/actions/) and `@a2ui/web_core@0.12.0`.

New to surfaces, components and the data model? Read [concepts.md](./concepts.md) first.

## Two action models

A component's `action` prop takes one of two forms. Both carry a name and arguments; values can be literals or `{ "path": ... }` bindings resolved from the data model at tap time.

```jsonc
// Function: runs on the device
{ "functionCall": { "call": "openUrl", "args": { "url": "https://a2ui.org/help" } } }

// Event: sent to the agent
{ "event": { "name": "submit_reservation", "context": { "size": { "path": "/partySize" } } } }
```

|                | `functionCall`                                     | `event`                                         |
| -------------- | -------------------------------------------------- | ----------------------------------------------- |
| Intent (spec)  | Immediate behaviour, **no network round trip**     | Data for the **agent** to process               |
| Agent informed | No                                                 | Yes                                             |
| Defined by     | The catalog (name + zod schema, checked on device) | The agent: `name` is a free string, not checked |
| Delivered to   | The catalog function                               | The host's `actionHandler`                      |
| Typical use    | Open URL, switch tab, validation, navigation       | Submit, bid, save: anything needing the backend |

**These are conventions, not hard limits.** Both end in host code: a catalog function is code the host registers, and an event goes to a handler the host writes. A function can call an API or forward to the agent (`context.surface.dispatchAction`); an event handler can act locally and never call the agent. The spec's split is what to use by default:

> **`functionCall` for anything without a network round trip. `event` for anything the agent should handle.**

Breaking the convention costs something: a function that calls the backend hides business logic in the app and the agent never hears about it; an event handled locally relies on unchecked event names agreed between teams.

## Who owns what

| Layer                            | Owns                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| Agent (server)                   | Handling events, calling business APIs, replying with `updateDataModel`/`updateComponents` |
| Host app                         | Catalog functions (device behaviour) and the `actionHandler` (transport to the agent)      |
| `react-native-the-a2ui` renderer | Calls `props.action()` on press. No API knowledge                                          |

## Functions

The host adds functions through the custom catalog:

```ts
const OpenLotApi = {
  name: 'openLot',
  returnType: 'void',
  schema: z.object({ lotId: z.string().describe('Lot to open.') }),
} as const

const OpenLot = createFunctionImplementation(OpenLotApi, ({ lotId }) => {
  router.push(`/lots/${lotId}`)
})

const catalog = createBasicCatalog({
  id: 'https://copart.com/a2ui/catalogs/mobile/v1', // own ID: the catalog's contents changed
  functions: [OpenLot],
})
```

## Events

The host forwards events to the agent:

```ts
const processor = new MessageProcessor([catalog], async (action) => {
  const reply = await agentClient.send({ version: 'v0.9', action })
  processor.processMessages(reply.messages)
})
```

What the agent receives:

```json
{
  "version": "v0.9",
  "action": {
    "name": "submit_reservation",
    "surfaceId": "booking-surface",
    "sourceComponentId": "submit-btn",
    "timestamp": "2026-02-25T10:40:00Z",
    "context": { "size": 4 }
  }
}
```

The agent calls the API, then replies with `updateDataModel` / `updateComponents` for that surface. Without an `actionHandler`, events are dropped silently.

## Data model sync (v0.9)

User input writes to the local data model immediately; the spec calls it "always the source of truth for the UI's current state". By default the agent only sees the values listed in an event's `context`.

With `sendDataModel: true` on `createSurface`, every message the client sends also carries the surface's full data model, so the agent sees every field without listing them:

```jsonc
// agent → client
{ "version": "v0.9", "createSurface": { "surfaceId": "booking-surface", "catalogId": "...", "sendDataModel": true } }

// client → agent, in the A2A message metadata
"metadata": {
  "a2uiClientDataModel": {
    "version": "v0.9",
    "surfaces": { "booking-surface": { "reservationTime": "7:00 PM", "partySize": 4 } }
  }
}
```

This helps events in two ways:

- **Simpler wiring:** a submit button can send `{ "event": { "name": "submit" } }` with no `context`.
- **Verbal shortcuts:** the user can type "okay, submit" in chat; the agent already has the form state, no button tap needed. This also allows a stateless agent.

web_core only builds the payload (`processor.getRendererDataModel()`); the host attaches it to outgoing messages:

```ts
await agentClient.send(
  { version: 'v0.9', action },
  {
    metadata: { a2uiClientDataModel: processor.getRendererDataModel() },
  },
)
```

Prefer explicit `context` when an action needs only a few fields: it documents what the action depends on.

## Server requirements

Events and data model sync only work with an agent that implements A2UI **surfaces**:

- **Lifecycle:** `createSurface` → `updateComponents` / `updateDataModel` → `deleteSurface`. Every message and action carries a `surfaceId`.
- **State:** track active surface IDs and their component and data state, so an incoming action can be matched to its surface.
- **Actions:** accept `{ version, action }` messages, route by `action.name`, and reply with updates for that surface (or delete it).
- **Data model sync:** read `a2uiClientDataModel` from message metadata when the surface was created with `sendDataModel: true`.
- **Transport:** A2A or AG-UI are the stable options; anything that sends JSON works. The client → agent path must exist (one-way streaming is not enough for events).

Functions need none of this: they work even with a one-way agent.

## Gotchas

- **`openUrl` does nothing on React Native.** web_core's version calls `window.open` and returns silently when it's missing. The renderer must replace it with `Linking.openURL`.
- **Async function errors aren't caught.** web_core wraps function calls in a synchronous `try/catch`; a function that calls an API must catch its own errors.
- **Event names aren't checked.** The agent defines them; if the host handles some locally, list them in the agent's prompt or the catalog's `instructions` (plain text, never validated). `instructions` only reaches the agent if the client sends [inline catalogs](./concepts.md#catalog-negotiation), which isn't recommended in production, so the agent's prompt is the reliable place.

## Open items

- Add a `functions` option to `createBasicCatalog`, merged by name like `components`.
- Ship `openUrl` → `Linking.openURL`.
- The spike's `MessageProcessor` has no `actionHandler` yet.
- Confirm the Copart agent supports surfaces, reads `a2uiClientCapabilities` and `a2uiClientDataModel`, and which transport it uses.
