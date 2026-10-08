import type { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native'
import type {
  buttonStyles,
  createButtonTokenStyles,
} from '../components/button'
import type { cardStyles, createCardTokenStyles } from '../components/card'
import type {
  checkBoxStyles,
  createCheckBoxTokenStyles,
} from '../components/check-box'
import type {
  choicePickerStyles,
  createChoicePickerTokenStyles,
} from '../components/choice-picker/choice-picker'
import type { columnStyles } from '../components/column'
import type {
  dividerStyles,
  createDividerTokenStyles,
} from '../components/divider'
import type { imageStyles } from '../components/image/image'
import type { listStyles } from '../components/list/list'
import type {
  modalStyles,
  createModalTokenStyles,
} from '../components/modal/modal'
import type { rowStyles } from '../components/row'
import type { tabsStyles, createTabsTokenStyles } from '../components/tabs'
import type { textStyles, createTextTokenStyles } from '../components/text'
import type {
  textFieldStyles,
  createTextFieldTokenStyles,
} from '../components/text-field'
import type { StyleOverrides } from '../../../styles/types'

/**
 * A component's full default keys: the static structure sheet combined with
 * its token-color creator. Colors live in the token layer (not the static
 * sheet), so combining both keeps override kinds precise — e.g. a
 * color-only key still types as `TextStyle`, not `ViewStyle`.
 */
type WithTokens<
  Static,
  Creator extends (...args: never[]) => unknown,
> = Static & ReturnType<Creator>

/**
 * Style overrides for the basic catalog: each component's style sheet keys,
 * each optional. Applied after the token-derived colors, so they win —
 * use them for deeper restyles; use `tokens` / `darkTokens` on
 * `A2uiSurface` for a quick color theme swap. Unknown component names are
 * allowed for host catalogs.
 */
export type A2uiStyles = {
  Button?: StyleOverrides<
    WithTokens<typeof buttonStyles, typeof createButtonTokenStyles>
  >
  Card?: StyleOverrides<
    WithTokens<typeof cardStyles, typeof createCardTokenStyles>
  >
  CheckBox?: StyleOverrides<
    WithTokens<typeof checkBoxStyles, typeof createCheckBoxTokenStyles>
  >
  ChoicePicker?: StyleOverrides<
    WithTokens<typeof choicePickerStyles, typeof createChoicePickerTokenStyles>
  >
  Column?: StyleOverrides<typeof columnStyles>
  Divider?: StyleOverrides<
    WithTokens<typeof dividerStyles, typeof createDividerTokenStyles>
  >
  Image?: StyleOverrides<typeof imageStyles>
  List?: StyleOverrides<typeof listStyles>
  Modal?: StyleOverrides<
    WithTokens<typeof modalStyles, typeof createModalTokenStyles>
  >
  Row?: StyleOverrides<typeof rowStyles>
  Tabs?: StyleOverrides<
    WithTokens<typeof tabsStyles, typeof createTabsTokenStyles>
  >
  Text?: StyleOverrides<
    WithTokens<typeof textStyles, typeof createTextTokenStyles>
  >
  TextField?: StyleOverrides<
    WithTokens<typeof textFieldStyles, typeof createTextFieldTokenStyles>
  >
  [component: string]:
    Record<string, StyleProp<ViewStyle | TextStyle | ImageStyle>> | undefined
}
