import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native'

import type { buttonStyles } from './components/button'
import type { cardStyles } from './components/card'
import type { checkBoxStyles } from './components/check-box'
import type { choicePickerStyles } from './components/choice-picker'
import type { columnStyles } from './components/column'
import type { dividerStyles } from './components/divider'
import type { imageStyles } from './components/image/image'
import type { listStyles } from './components/list'
import type { modalStyles } from './components/modal'
import type { rowStyles } from './components/row'
import type { tabsStyles } from './components/tabs'
import type { textFieldStyles } from './components/text-field'
import type { textStyles } from './components/text'
import type { StyleOverrides } from '../../styles/utils'

/**
 * Style overrides for the basic catalog: each component's style sheet keys,
 * each optional. Unknown component names are allowed for host catalogs.
 */
export type A2uiStyles = {
  Button?: StyleOverrides<typeof buttonStyles>
  Card?: StyleOverrides<typeof cardStyles>
  CheckBox?: StyleOverrides<typeof checkBoxStyles>
  ChoicePicker?: StyleOverrides<typeof choicePickerStyles>
  Column?: StyleOverrides<typeof columnStyles>
  Divider?: StyleOverrides<typeof dividerStyles>
  Image?: StyleOverrides<typeof imageStyles>
  List?: StyleOverrides<typeof listStyles>
  Modal?: StyleOverrides<typeof modalStyles>
  Row?: StyleOverrides<typeof rowStyles>
  Tabs?: StyleOverrides<typeof tabsStyles>
  Text?: StyleOverrides<typeof textStyles>
  TextField?: StyleOverrides<typeof textFieldStyles>
  [component: string]:
    Record<string, StyleProp<ViewStyle | TextStyle | ImageStyle>> | undefined
}
