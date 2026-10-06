# Renderer Plan: `react-native-a2ui`

A React Native renderer for A2UI v0.9, built on `@a2ui/web_core`. It ships the basic catalog components that React Native core can build, plus theming/styling. Everything else is added by the host through a custom catalog.

Builds on [initial-study.md](./initial-study.md). This plan takes the **Metro helper** route for the Lit problem: no files are copied out of web_core.

## Decisions

| Topic                                   | Decision                                                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Core logic                              | Depend on `@a2ui/web_core`; don't port or copy it                                                               |
| Lit-free basic catalog access           | A Metro helper (`withA2ui`) shipped in our package, plus a matching Jest helper                                 |
| Long-term fix                           | Upstream PR adding a Lit-free subpath to web_core. Once released, the helpers are deleted and no import changes |
| Copying web_core files into our package | Rejected: re-copying on every web_core release costs too much                                                   |
| Component scope                         | Only components React Native core can build. No third-party UI, media or markdown libraries                     |
| Unsupported components                  | Listed explicitly. Hosts implement them in their own catalog                                                    |
| Extension point                         | The custom catalog only. A host component with the same name replaces ours; no extra providers or plugins       |

## Validated by the spike

The spike in `ask-copart-packages-workspace` (`apps/mobile-expo-53`, Expo 53 / RN 0.79 / Metro 0.82) with `@a2ui/web_core@0.12.0`:

- The root `@a2ui/web_core` entry loads 57 modules. Its only dependencies are `zod`, `zod-to-json-schema` and `@preact/signals-core`, so no Lit and no JSON imports.
- Messages → `MessageProcessor` → `NodeResolver` → resolved props works with no DOM. A data binding resolves, and `updateDataModel` re-runs only the affected node.
- With a Metro alias, the iOS bundle contains 60 web_core modules and **0 Lit modules**.
- Still open: the `\p{XID_Start}` regex reaches Hermes untouched. This is waiting on a device run.

## The Lit-free modules

In the published `@a2ui/web_core@0.12.0`, everything we need beyond the root entry is in three files. None of them load Lit:

| Virtual subpath (what our code imports)       | File in `@a2ui/web_core/src/`                       | Exports                                    | Dependencies                    |
| --------------------------------------------- | --------------------------------------------------- | ------------------------------------------ | ------------------------------- |
| `@a2ui/web_core/v0_9/basic_catalog/api`       | `v0_9/basic_catalog/components/basic_components.js` | `TextApi` … `VideoApi`, `BASIC_COMPONENTS` | zod (4 modules)                 |
| `@a2ui/web_core/v0_9/basic_catalog/functions` | `v0_9/basic_catalog/functions/basic_functions.js`   | `BASIC_FUNCTIONS`                          | same as root entry (20 modules) |
| `@a2ui/web_core/v0_9/basic_catalog/theme`     | `v0_9/basic_catalog/theme.js`                       | `BasicCatalogThemeSchema`                  | zod, validate-color             |

The subpath names are the ones we'll propose upstream. Once web_core ships them for real, the helper can be deleted and our imports stay the same.

## Component support

The React Native ecosystem has many competing libraries for icons, media, pickers and markdown, and they differ between Expo and bare React Native. The renderer doesn't choose for hosts: it ships only what React Native core can build, and has no runtime dependencies beyond `@a2ui/web_core`.

### Supported (13)

| Component    | Built with                | Notes                                                                                                                                               |
| ------------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text         | `Text`                    | No markdown rendering. Markers (`**`, `#`, `` ` ``, …) are stripped and plain text is shown, per the spec's fallback. Variants h1–h5, caption, body |
| Image        | `Image`                   | `fit` → `resizeMode`; variants icon, avatar, small/medium/large feature, header                                                                     |
| Row          | `View`                    | `justify`/`align` → flexbox; `weight` → `flex`                                                                                                      |
| Column       | `View`                    | Same as Row                                                                                                                                         |
| List         | `ScrollView`              | Vertical or horizontal; template children                                                                                                           |
| Card         | `View`                    | Shadow on iOS, `elevation` on Android; exactly one child                                                                                            |
| Divider      | `View`                    | Hairline, horizontal or vertical                                                                                                                    |
| Tabs         | `Pressable` + `View`      | Local `selectedIndex`; renders only the active child                                                                                                |
| Modal        | `Modal`                   | Trigger child opens it; close button and backdrop tap close it                                                                                      |
| Button       | `Pressable`               | Variants default/primary/borderless; `primaryColor`; disabled when `isValid === false`                                                              |
| TextField    | `TextInput`               | `multiline` for longText, `keyboardType="numeric"`, `secureTextEntry` for obscured; validation errors                                               |
| CheckBox     | `Switch`                  | The spec allows "a native checkbox or toggle switch"                                                                                                |
| ChoicePicker | `Pressable` + `TextInput` | Chips or list; filter input when `filterable` (case-insensitive substring match)                                                                    |

Tabs and ChoicePicker are custom-built from core primitives, not native widgets.

### Unsupported (5)

React Native core has no implementation for these. Hosts add them to their catalog using whichever library they already use.

| Component     | Why core can't do it | Typical host choices                              |
| ------------- | -------------------- | ------------------------------------------------- |
| Icon          | No icon font in core | `@expo/vector-icons`, `react-native-vector-icons` |
| Video         | No video player      | `expo-video`, `react-native-video`                |
| AudioPlayer   | No audio player      | `expo-audio`, `react-native-track-player`         |
| Slider        | Removed from core    | `@react-native-community/slider`                  |
| DateTimeInput | Removed from core    | `@react-native-community/datetimepicker`          |

Their component APIs (`IconApi`, `VideoApi`, …) are still exported, so hosts can implement them without redefining the schemas.

### When an agent sends an unsupported component

Our catalog keeps the basic catalog ID, so an agent may still send `Icon`, `Video`, etc. If the host hasn't added it:

- web_core reports an unknown component type to the agent through the surface's error channel.
- `NodeView` renders a small placeholder in the component's place, and the rest of the surface keeps working.
- In development, a one-time `console.warn` names the component and says to add it to the catalog.

## Customizing the catalog

The custom catalog is the single extension point. web_core's `Catalog` keys components by name, so a host component with the same name replaces ours.

### Add an unsupported component

```tsx
import { MaterialIcons } from '@expo/vector-icons'
import {
  createBasicCatalog,
  createComponentImplementation,
  IconApi,
} from 'react-native-a2ui'

const Icon = createComponentImplementation(IconApi, ({ props }) => (
  // A2UI icon names are camelCase; Material uses snake_case
  <MaterialIcons name={toSnakeCase(props.name)} size={24} />
))

const catalog = createBasicCatalog({ components: [Icon] })
```

### Replace a supported component

The same mechanism works for any component, e.g. a `Text` that renders markdown with the host's library:

```tsx
const Text = createComponentImplementation(TextApi, ({ props }) => (
  <EnrichedMarkdownText markdown={props.text} />
))

const catalog = createBasicCatalog({ components: [Text, Icon] })
```

### Catalog ID

- **Adding unsupported components, or replacing one with the same props:** keep the basic catalog ID. The agent sees the same catalog.
- **Changing a component's props (its schema), or adding new component types:** use your own catalog ID (`createBasicCatalog({ id, components })`). Agents generate messages from the schema, so both sides must agree on what a catalog ID means.

## Metro helper

Shipped as `react-native-a2ui/metro`:

```js
// react-native-a2ui/metro.js
const fs = require('fs')
const path = require('path')

/** Lit-free modules web_core's `exports` map doesn't expose yet. */
const VIRTUAL_SUBPATHS = {
  '@a2ui/web_core/v0_9/basic_catalog/api':
    'v0_9/basic_catalog/components/basic_components.js',
  '@a2ui/web_core/v0_9/basic_catalog/functions':
    'v0_9/basic_catalog/functions/basic_functions.js',
  '@a2ui/web_core/v0_9/basic_catalog/theme': 'v0_9/basic_catalog/theme.js',
}

function resolveA2uiSubpaths(projectRoot) {
  const webCoreSrc = path.dirname(
    require.resolve('@a2ui/web_core', { paths: [projectRoot] }),
  )
  return Object.fromEntries(
    Object.entries(VIRTUAL_SUBPATHS).map(([subpath, file]) => {
      const filePath = path.join(webCoreSrc, file)
      // Fail when Metro starts, not with a vague bundle error
      if (!fs.existsSync(filePath)) {
        throw new Error(
          `react-native-a2ui: ${file} not found in @a2ui/web_core. ` +
            'This web_core version is not supported; check the peer dependency range.',
        )
      }
      return [subpath, filePath]
    }),
  )
}

function withA2ui(config) {
  const subpaths = resolveA2uiSubpaths(config.projectRoot)
  const upstream = config.resolver?.resolveRequest

  return {
    ...config,
    resolver: {
      ...config.resolver,
      resolveRequest(context, moduleName, platform) {
        const filePath = subpaths[moduleName]
        if (filePath) {
          return { type: 'sourceFile', filePath }
        }
        return (upstream ?? context.resolveRequest)(
          context,
          moduleName,
          platform,
        )
      },
    },
  }
}

module.exports = { withA2ui, resolveA2uiSubpaths }
```

Consumer setup:

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config')
const { withA2ui } = require('react-native-a2ui/metro')

module.exports = withA2ui(getDefaultConfig(__dirname))
```

### Jest helper

Shipped as `react-native-a2ui/jest`. It uses the same path table:

```js
// jest.config.js
const { a2uiModuleNameMapper } = require('react-native-a2ui/jest')

module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: { ...a2uiModuleNameMapper(__dirname) },
}
```

### Risks and mitigations

| Risk                                                                                                                 | Mitigation                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A consumer forgets the helper, and the bundle fails with "Unable to resolve `@a2ui/web_core/v0_9/basic_catalog/api`" | Make the setup step the first thing in the README; add a troubleshooting entry that quotes that exact error                                                            |
| web_core moves an internal file in a new release                                                                     | Peer dependency `@a2ui/web_core: ~0.12.0` (patch versions only); `existsSync` check when Metro starts; CI job that bundles the example app against the newest web_core |
| A web_core upgrade changes exports while file paths stay the same                                                    | Same CI job; verify the export list once per web_core release                                                                                                          |
| Our published `.d.ts` references the virtual subpaths, which consumers' TypeScript can't resolve                     | Don't re-export the virtual subpaths in public types; bundle declarations for those modules into our `.d.ts` (see open questions)                                      |
| A second copy of `zod` breaks web_core's runtime schema checks                                                       | `zod` as a peer dependency (`^3.25`); document it                                                                                                                      |

## Package layout

```
packages/react-native-a2ui/
  metro.js                 # withA2ui
  jest.js                  # a2uiModuleNameMapper
  src/
    index.ts
    surface/
      a2ui-surface.tsx     # port of @a2ui/react A2uiSurface
      node-view.tsx        # NodeView, useNodeView, child index, unresolved-ref reporting
      use-signal-value.ts
    adapter/
      create-component-implementation.tsx   # binder + binderless factories
      types.ts             # A2uiComponentImplementation, view props
    theme/
      theme-provider.tsx   # surface theme → tokens; primaryColor variants
      tokens.ts
    catalog/basic/
      index.ts             # basicCatalog, createBasicCatalog(), re-exported *Api schemas
      functions.ts         # BASIC_FUNCTIONS with openUrl → Linking.openURL
      components/          # 13 supported components, one folder each
    utils/
      strip-markdown.ts    # Text's plain-text fallback
```

Peer dependencies: `react`, `react-native`, `@a2ui/web_core` (~0.12.0), `zod` (^3.25). No other runtime dependencies.

## Public API (draft)

```tsx
import {
  A2uiSurface,
  basicCatalog,
  createBasicCatalog,
  createComponentImplementation,
} from 'react-native-a2ui'

// 1. Basic catalog, rendered as-is
const processor = new MessageProcessor([basicCatalog], onAction)
<A2uiSurface surface={surface} />

// 2. Custom catalog: add unsupported components, replace ours, or add new ones
//    (see "Customizing the catalog")
const catalog = createBasicCatalog({ components: [Icon, Slider] })

// 3. Styling: theme tokens plus style slots for each component
<A2uiSurface
  surface={surface}
  styles={{
    Button: { root: {...}, label: {...} },
    Text: { h1: {...} },
  }}
/>
```

Styling follows the `styles?: { root?, ...slots }` convention. The surface theme (`createSurface.theme.primaryColor`) feeds a token set that the components read. Host `styles` override the result.

## Phases

1. **Package skeleton.** Metro and Jest helpers, the rendering layer port (including template child lists), and an example app. Exit criteria: the spike's Text/Column demo renders through the package, on a device.
2. **Theme and styling.** Theme provider, tokens, `primaryColor` variants (reimplement `computeColorVariant`; the original sits in Lit-only code), style slots.
3. **Basic catalog, layout and display.** Text (plain-text fallback), Image, Row, Column, List, Card, Divider, Tabs, Modal.
4. **Basic catalog, input.** Button, TextField, CheckBox, ChoicePicker, plus validation errors.
5. **Unsupported components and docs.** Placeholder and dev warning for unknown types; README section listing the 5 unsupported components with an example of adding one; the example app implements all 5 using Expo libraries, to show the pattern.
6. **Functions and Intl.** `openUrl` override; `Intl.PluralRules` polyfill guidance; verify `formatNumber`, `formatCurrency` and `formatDate` on Android.
7. **Upstream.** PR to a2ui adding the three subpaths to the `exports` map. Once released, delete `metro.js` / `jest.js` and make it a minor release.

The upstream PR (phase 7) can be opened at any time. Starting early cuts down how long the helper has to exist.

The example app is the only place third-party component libraries appear; the package itself stays core-only.

## Open questions

- [ ] Does the `\p{XID_Start}` regex load on Hermes? (device run of the spike)
- [ ] How to publish types for the virtual subpaths: bundle the declarations (e.g. `rollup-plugin-dts` with those three modules inlined) or write our own `ComponentApi` typings?
- [ ] Minimum supported React Native / Expo SDK version?
