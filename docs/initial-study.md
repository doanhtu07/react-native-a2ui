# Initial Study: A2UI v0.9 on React Native

Links:

- https://a2ui.org/guides/renderer-development/
- https://a2ui.org/reference/renderers/#ecosystem-renderers

Goals:

1. Find out which dependencies `@a2ui/web_core` has, and whether we can use it directly in React Native or need to write our own port of the core.
2. List what the React renderer (`@a2ui/react`) implements for spec v0.9 that we need to port to React Native.

**Source:** [a2ui](https://github.com/a2ui-project/a2ui) `main` @ `1444719a` (2026-10-02). `@a2ui/web_core` and `@a2ui/react` are both at `0.12.0`.

**Method:** static analysis of the import graph and source code. Nothing has been built or run on Hermes yet. Items marked ⚠️ need to be checked in a spike (see [Next step](#next-step-spike)).

## TL;DR

- **Reuse `@a2ui/web_core`; don't port it.** The engine (data model, binding, expressions, node resolver, message processing, validation) is plain TypeScript that never touches the DOM.
- **One packaging problem blocks it:** the `v0_9`, `v0_9/basic_catalog`, `v1_0` and `catalogs/basic/v1` entry points also load the Lit web components, which extend `HTMLElement` as soon as the module loads. Fix it with an upstream subpath split, or with a Metro alias / patch in the meantime.
- **React renderer:** the code that renders a surface (~720 lines) carries over almost unchanged. All 18 basic catalog components (~1,300 lines) need a native rewrite.

## 1. `@a2ui/web_core` dependencies

### Runtime dependencies

| Dependency                      | Used by                                                          | Safe on React Native?                                                                          |
| ------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `zod` ^3.25                     | schemas, `GenericBinder`, catalog                                | ✅ plain JS                                                                                    |
| `zod-to-json-schema` ^3.25      | `processing/message-processor.ts`, `catalog/schema_generator.ts` | ✅ plain JS (adds bundle size)                                                                 |
| `@preact/signals-core` ^1.14    | `reactivity/signals.ts`                                          | ✅ no DOM. It can also be swapped out with `setSignalImplementation()`                         |
| `validate-color` ^2.2           | `universal/basic_catalog/theme.ts` only                          | ✅ plain JS                                                                                    |
| `lit` ^3.3, `@lit/context` ^1.1 | `universal/**` only (the web components)                         | ❌ the classes extend `HTMLElement` when the module loads, so it will probably crash on Hermes |

### The core is Lit-free

None of these folders import `universal/` or Lit:

`catalog/`, `state/`, `processing/`, `resolution/`, `expressions/`, `reactivity/`, `validation/`, `rpc/`, `common/`, `types/`, `v0_9/schema/`

These entry points should therefore be safe on React Native:

- `@a2ui/web_core` (root)
- `/catalog`, `/state`, `/processing`, `/resolution`, `/reactivity`, `/expressions`, `/validation`, `/rpc`

### Blocker: entry points that pull in Lit

| Entry point                         | Why it loads Lit                                                                                                                                                                              |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@a2ui/web_core/v0_9`               | re-exports `./basic_catalog/index.js`                                                                                                                                                         |
| `@a2ui/web_core/v0_9/basic_catalog` | `components/index.ts` runs `toWebComponentImplementation(A2ui*Element, *Api)` for all 18 Lit elements when it loads. It also re-exports `universal/basic_catalog/{context,directives,styles}` |
| `@a2ui/web_core/v1_0`               | `export * from '../universal/index.js'`                                                                                                                                                       |
| `@a2ui/web_core/catalogs/basic/v1`  | same pattern as `v0_9/basic_catalog`                                                                                                                                                          |

Why this matters:

- Metro doesn't tree-shake, so `"sideEffects": false` doesn't help. Importing `Catalog` from `v0_9` is enough to load Lit.
- `package.json` `exports` blocks deep imports. RN 0.79's Metro respects `exports` by default, so we can't simply import the internal files.

What we actually need from those entry points is Lit-free; it just has no Lit-free entry point:

| Need                                                                                       | Source file (Lit-free)                                                       |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `ButtonApi` … `VideoApi`, `BASIC_COMPONENTS`                                               | `v0_9/basic_catalog/components/basic_components.ts`                          |
| `BASIC_FUNCTIONS`                                                                          | `v0_9/basic_catalog/functions/basic_functions.ts`                            |
| `BasicCatalogThemeSchema`                                                                  | `universal/basic_catalog/theme.ts` (imports only `zod` and `validate-color`) |
| `Catalog`, `NodeResolver`, `GenericBinder`, `ComponentContext`, `SurfaceModel`, signals, … | also exported from the root `@a2ui/web_core`                                 |

### Runtime APIs to check on Hermes

| Item                                           | Where                                           | Risk                                                                                                                                         |
| ---------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ⚠️ `/[\p{XID_Start}_][\p{XID_Continue}]*/u`    | `common/uax31.ts`, exported from the root entry | If Hermes doesn't support these Unicode properties, the regex fails as soon as the module loads and everything breaks. **Check this first.** |
| ⚠️ `Intl.PluralRules`                          | `common/basic_functions.ts` (`pluralize`)       | Probably missing on Hermes. Plan on `@formatjs/intl-pluralrules`                                                                             |
| ⚠️ `Intl.NumberFormat` / `Intl.DateTimeFormat` | `formatNumber`, `formatCurrency`, `formatDate`  | Check that the options we use are supported, especially on Android                                                                           |
| ⚠️ `import … with {type: 'json'}`              | `v0_9/index.ts`, `v0_8/index.ts`                | Metro/Babel may not parse import attributes. The root entry avoids it                                                                        |
| `window.open`                                  | `executeOpenUrl` (`openUrl`)                    | Silently does nothing on RN. Replace it with a `Linking.openURL` version in our catalog's function list                                      |
| `crypto.randomUUID`                            | `rpc/rpc-handler.ts`                            | Already has a `Math.random` fallback                                                                                                         |
| `structuredClone`                              | `v0_8/styles/utils.ts`                          | v0_8 only; not used                                                                                                                          |

### Options

1. **Upstream PR (preferred long-term).** Add a Lit-free subpath, e.g. `@a2ui/web_core/v0_9/basic_catalog/api`, exporting the component APIs, `BASIC_FUNCTIONS` and `BasicCatalogThemeSchema`. Stop the `v0_9` entry from re-exporting the Lit catalog.
2. **Short-term workaround.** Use a Metro `resolveRequest` alias, or `patch-package` to add that subpath, pointing at `basic_components.js`, `basic_functions.js` and `theme.js` in `dist/`.
3. **Port the core (last resort).** web_core holds all the hard spec logic and already tracks v0.9, v0.9.1 and v1.0. A fork would keep drifting from the spec, and we'd lose the upstream conformance suite.

**Recommendation: options 1 + 2.**

## 2. What the React renderer implements for v0.9

### Handled by web_core (no port needed)

- Messages: `createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface`
- Building the component tree from the adjacency list (`NodeResolver`), and resolving templates and child lists
- Data model paths, scoping, and two-way binding setters (`GenericBinder`, `ResolvedBinding`)
- Expressions and client-side functions (`formatString`, `required`, `regex`, `length`, `numeric`, `email`, `formatNumber`, `formatCurrency`, `formatDate`, `pluralize`, `openUrl`, `and`, `or`, `not`)
- Checks/validation, resolving action context, error dispatch, client capabilities

The renderer's job: render the tree, map props to native components, apply the theme, and render markdown.

### Rendering layer (~720 lines): port almost as-is

Files in `renderers/react/src/v0_9/`:

| File                                | Lines | Role                                                                                        | RN changes                                                                          |
| ----------------------------------- | ----- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `A2uiSurface.tsx`                   | 93    | Owns the `NodeResolver` and subscribes to the root node with `useSyncExternalStore`         | Drop the `setMarkdownRenderer` call; it only feeds the Lit elements                 |
| `node-view.tsx`                     | 384   | `NodeView`, `useNodeView`, `useSignalValue`, child index, unresolved-reference reporting    | `<div>` placeholders (loading, unresolved child, unknown type) become `View`/`Text` |
| `adapter.tsx`                       | 136   | `createComponentImplementation` (with binder) and `createBinderlessComponentImplementation` | none                                                                                |
| `react_component_implementation.ts` | 68    | Implementation and props types                                                              | none                                                                                |
| `markdown-context.tsx`              | 22    | `MarkdownContext`                                                                           | The renderer type changes (see Text below)                                          |

All of this is plain React (`useSyncExternalStore`, `memo`, context) and should work on React 19 / RN 0.79.

### Basic catalog (~1,300 lines): native rewrite

The React components depend on web-only features:

- CSS modules and `className`
- `injectBasicCatalogStyles()` (`document.adoptedStyleSheets`)
- `document.head` style injection in `DateTimeInput`
- `dangerouslySetInnerHTML` in `Text`

None of them read the theme directly; they rely on CSS variables. On RN we need to read `primaryColor` from the surface theme and turn it into styles ourselves.

| Component     | React today                                                | RN approach / gotchas                                                                                                                                                                |
| ------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Text          | Markdown converted to HTML, then `dangerouslySetInnerHTML` | `MarkdownRenderer` returns an HTML string, which RN can't display. Needs markdown → native nodes, with a fallback that strips the markers (per the spec). Variants h1–h5 and caption |
| Image         | `<img>`, `object-fit`                                      | `Image` with `resizeMode`. Variants: icon, avatar, small/medium/large feature, header. Full-width variants need `aspectRatio`                                                        |
| Icon          | font glyph                                                 | `@expo/vector-icons` MaterialIcons, converting camelCase names to snake_case                                                                                                         |
| Video         | `<video controls>`                                         | `expo-video` (native dependency)                                                                                                                                                     |
| AudioPlayer   | `<audio controls>`                                         | `expo-audio` (native dependency)                                                                                                                                                     |
| Row / Column  | flexbox                                                    | `View`. Reuse `mapJustify`/`mapAlign`, but `justify: stretch` isn't valid in RN. `weight` maps to `flex`                                                                             |
| List          | overflow scroll                                            | `ScrollView` / `FlatList`, vertical or horizontal; hide the scrollbar when horizontal                                                                                                |
| Card          | CSS                                                        | `View` with shadow on iOS, `elevation` on Android; exactly one child                                                                                                                 |
| Tabs          | local `selectedIndex`                                      | `Pressable` headers; render only the active child                                                                                                                                    |
| Divider       | border                                                     | hairline `View`, horizontal or vertical                                                                                                                                              |
| Modal         | dialog                                                     | The spec says mobile should use a bottom sheet or full-screen dialog. Needs a close mechanism                                                                                        |
| Button        | `<button>`                                                 | `Pressable`. Variants default/primary/borderless, `primaryColor`, disabled when `isValid === false`, calls `props.action`                                                            |
| TextField     | `<input>` / `<textarea>`                                   | `TextInput`: `multiline` for longText, `keyboardType="numeric"`, `secureTextEntry` for obscured, plus validation errors                                                              |
| CheckBox      | `<input type=checkbox>`                                    | RN has no checkbox: custom one or `Switch`                                                                                                                                           |
| ChoicePicker  | custom + CSS                                               | Custom list or chips; filter `TextInput` when `filterable` (case-insensitive substring match)                                                                                        |
| Slider        | `<input type="range">`                                     | `@react-native-community/slider` (decimal values)                                                                                                                                    |
| DateTimeInput | `datetime-local`                                           | `@react-native-community/datetimepicker`. Convert to and from ISO 8601; `enableDate` / `enableTime`                                                                                  |

Reference: `specification/v0_9/docs/basic_catalog_implementation_guide.md` (written for web, mobile and desktop).

### Theme (`createSurface.theme`)

| Property                      | RN handling                                                                                                                                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `primaryColor`                | Primary button background, active tab or border, selected chips. Generate variants as needed (`computeColorVariant` is in the Lit-tainted `styles/default.ts`, so reimplement it or move it upstream) |
| `iconUrl`, `agentDisplayName` | Attribution next to the surface (optional UI)                                                                                                                                                         |

### Tests

The React tests run on jsdom and don't carry over. web_core's conformance suite (`conformance/`) still covers the core. We need our own RN component tests (e.g. `@testing-library/react-native`).

## Next step: spike

Time-box: about 1 hour, in an Expo 53 / RN 0.79 app.

1. Import the root `@a2ui/web_core`, and the three Lit-free files through a Metro alias.
2. Process a sample v0.9 message stream (e.g. from `specification/v0_9/test`).
3. Render one `Text` and one `Button` through the ported surface layer.

The spike should answer these questions:

- [ ] Does `common/uax31.ts` (`\p{XID_Start}` regex) load on Hermes?
- [ ] Is `Intl.PluralRules` available, or is a polyfill needed?
- [ ] Do the `Intl.NumberFormat` / `DateTimeFormat` options we use work on Android?
- [ ] Does Metro resolve the `exports` map and the alias without loading Lit?
- [ ] What does `zod` + `zod-to-json-schema` + the core add to the bundle?
