import { Catalog } from '@a2ui/web_core'
import { BASIC_FUNCTIONS } from '@a2ui/web_core/v0_9/basic_catalog/functions'
import { BasicCatalogThemeSchema } from '@a2ui/web_core/v0_9/basic_catalog/theme'

import type { ReactComponentImplementation } from '../../react_component_implementation'
import {
  Text,
  Image,
  Modal,
  Row,
  Column,
  List,
  Card,
  Tabs,
  Button,
  Divider,
  TextField,
  CheckBox,
  ChoicePicker,
} from './components'

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
