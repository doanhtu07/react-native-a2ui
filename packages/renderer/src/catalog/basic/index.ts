import { Catalog } from '@a2ui/web_core'
import { BASIC_FUNCTIONS } from '@a2ui/web_core/v0_9/basic_catalog/functions'
import { BasicCatalogThemeSchema } from '@a2ui/web_core/v0_9/basic_catalog/theme'

import type { ReactComponentImplementation } from '../../react_component_implementation'
import { Button } from './components/button'
import { Card } from './components/card'
import { CheckBox } from './components/check-box'
import { ChoicePicker } from './components/choice-picker'
import { Column } from './components/column'
import { Divider } from './components/divider'
import { Image } from './components/image/image'
import { List } from './components/list'
import { Modal } from './components/modal'
import { Row } from './components/row'
import { Tabs } from './components/tabs'
import { Text } from './components/text'
import { TextField } from './components/text-field'

// Icon, Video, AudioPlayer, Slider and DateTimeInput are left out: React
// Native core can't build them. Hosts add them to their own catalog.
const basicComponents: ReactComponentImplementation[] = [
  Text,
  Image,
  Row,
  Column,
  List,
  Card,
  Tabs,
  Divider,
  Modal,
  Button,
  TextField,
  CheckBox,
  ChoicePicker,
]

export const basicCatalog = new Catalog<ReactComponentImplementation>(
  'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json',
  '0.9',
  basicComponents,
  BASIC_FUNCTIONS,
  BasicCatalogThemeSchema,
)

export {
  Button,
  Card,
  CheckBox,
  ChoicePicker,
  Column,
  Divider,
  Image,
  List,
  Modal,
  Row,
  Tabs,
  Text,
  TextField,
}
