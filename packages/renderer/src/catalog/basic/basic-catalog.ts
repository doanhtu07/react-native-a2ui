import { Catalog } from '@a2ui/web_core'
import { BASIC_FUNCTIONS } from '@a2ui/web_core/v0_9/basic_catalog/functions'
import { BasicCatalogThemeSchema } from '@a2ui/web_core/v0_9/basic_catalog/theme'

import type { ReactComponentImplementation } from '../../react_component_implementation'
import { Text } from './components/text'
import { Image } from './components/image/image'
import { Modal } from './components/modal/modal'
import { Row } from './components/row'
import { Column } from './components/column'
import { List } from './components/list/list'
import { Card } from './components/card'
import { Tabs } from './components/tabs'
import { Button } from './components/button'
import { Divider } from './components/divider'
import { TextField } from './components/text-field'
import { CheckBox } from './components/check-box'
import { ChoicePicker } from './components/choice-picker/choice-picker'

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
