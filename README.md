# react-native-the-a2ui

A2UI renderer for React Native

## Setup

The renderer imports web_core's basic catalog from files its `exports` map doesn't expose yet. Wrap your Metro config with `withA2ui` so they resolve without pulling in Lit:

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config')
const { withA2ui } = require('@the-a2ui/renderer/metro')

module.exports = withA2ui(getDefaultConfig(__dirname))
```

## Catalog

### Supported (13)

| Component    | Built with                | Notes                                                                                                                                               |
| ------------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text         | `Text`                    | No markdown rendering. Markers (`**`, `#`, `` ` ``, …) are stripped and plain text is shown, per the spec's fallback. Variants h1–h5, caption, body |
| Image        | `Image`                   | `fit` → `resizeMode`; variants icon, avatar, small/medium/large feature, header                                                                     |
| Row          | `View`                    | `justify`/`align` → flexbox; `weight` → `flex`                                                                                                      |
| Column       | `View`                    | Same as Row                                                                                                                                         |
| List         | `FlatList`                | Virtualized vertical or horizontal list; template children                                                                                          |
| Card         | `View`                    | Shadow on iOS, `elevation` on Android; exactly one child                                                                                            |
| Divider      | `View`                    | Hairline, horizontal or vertical                                                                                                                    |
| Tabs         | `Pressable` + `View`      | Local `selectedIndex`; renders only the active child                                                                                                |
| Modal        | `Modal`                   | Trigger child opens it; close button and backdrop tap close it                                                                                      |
| Button       | `Pressable`               | Variants default/primary/borderless; `primaryColor`; disabled when `isValid === false`                                                              |
| TextField    | `TextInput`               | `multiline` for longText, `keyboardType="numeric"`, `secureTextEntry` for obscured; validation errors                                               |
| CheckBox     | `Switch`                  | The spec allows "a native checkbox or toggle switch"                                                                                                |
| ChoicePicker | `Pressable` + `TextInput` | Chips or list; filter input when `filterable` (case-insensitive substring match)                                                                    |

**NOTES**:

- List is virtualized (`FlatList`): never place a scrolling `List` inside a plain `ScrollView` of the same orientation. Use a `FlatList`-backed screen instead, otherwise React Native logs a nesting warning and windowing breaks.
- Tabs and ChoicePicker are custom-built from core primitives, not native widgets.

### Unsupported (5)

React Native core has no implementation for these. Hosts add them to their catalog using whichever library they already use.

| Component     | Why core can't do it | Typical host choices                              |
| ------------- | -------------------- | ------------------------------------------------- |
| Icon          | No icon font in core | `@expo/vector-icons`, `react-native-vector-icons` |
| Video         | No video player      | `expo-video`, `react-native-video`                |
| AudioPlayer   | No audio player      | `expo-audio`, `react-native-track-player`         |
| Slider        | Removed from core    | `@react-native-community/slider`                  |
| DateTimeInput | Removed from core    | `@react-native-community/datetimepicker`          |

### Unsupported special cases (2)

| Component                          | Why core can't do it                                                                                       | Typical host choices                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Text (with markdown)               | No markdown support in core                                                                                | `react-native-markdown-display`, `react-native-enriched-markdown` |
| TextField (with keyboard avoiding) | No general keyboard avoiding solution. Different scenarios like bottom sheet could require custom handling | `react-native-keyboard-controller`                                |

### Override

If you want to have new behaviors or implementations for certain components, you can create custom components with `createComponentImplementation` and `createBinderlessComponentImplementation`.

Then, add your custom components to the renderer's catalog.

#### What implementation to choose?

`createComponentImplementation`:

- Default choice. All 13 built-in catalog components use it.
- Subscribe to props from @a2ui/web_core component context by default

`createBinderlessComponentImplementation`:

- Component will only get @a2ui/web_core component context
- You manage the props yourself

## Resources

- https://a2ui.org/guides/renderer-development/
- https://a2ui.org/reference/renderers/#using-a-renderer
- https://a2ui.org/ecosystem/renderers/#community-renderers
- https://a2ui.org/concepts/actions/
