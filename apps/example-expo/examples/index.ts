import { buttonGallery } from './components/button'
import { cardGallery } from './components/card'
import { checkBoxGallery } from './components/check-box'
import { choicePickerGallery } from './components/choice-picker'
import { columnGallery } from './components/column'
import { dividerGallery } from './components/divider'
import { imageGallery } from './components/image'
import { listGallery } from './components/list'
import { modalGallery } from './components/modal'
import { rowGallery } from './components/row'
import { tabsGallery } from './components/tabs'
import { textFieldGallery } from './components/text-field'
import { textGallery } from './components/text'
import type { ComponentGallery } from './types'

/** One entry per basic catalog component, in the catalog's order. */
export const galleries: ComponentGallery[] = [
  textGallery,
  imageGallery,
  rowGallery,
  columnGallery,
  listGallery,
  cardGallery,
  tabsGallery,
  dividerGallery,
  modalGallery,
  buttonGallery,
  textFieldGallery,
  checkBoxGallery,
  choicePickerGallery,
]

export const findGallery = (slug: string) =>
  galleries.find((gallery) => gallery.slug === slug)

export type { ComponentGallery, Example } from './types'
