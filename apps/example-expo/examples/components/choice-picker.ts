import type { ComponentGallery } from '../types'

const options = [
  { label: 'Red', value: 'red' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' },
]

const countries = [
  'Australia',
  'Brazil',
  'Canada',
  'Denmark',
  'Egypt',
  'France',
  'Germany',
  'India',
  'Japan',
  'Vietnam',
].map((label) => ({ label, value: label.toLowerCase() }))

export const choicePickerGallery: ComponentGallery = {
  slug: 'choice-picker',
  name: 'ChoicePicker',
  summary: 'Single or multiple selection, as a list or chips',
  examples: [
    {
      title: 'Mutually exclusive',
      description: 'Radio list',
      components: [
        {
          id: 'root',
          component: 'ChoicePicker',
          label: 'Favorite color',
          options,
          value: { path: '/single' },
        },
      ],
      data: { single: ['green'] },
    },
    {
      title: 'Multiple selection',
      description: 'Checkbox list',
      components: [
        {
          id: 'root',
          component: 'ChoicePicker',
          label: 'Colors',
          variant: 'multipleSelection',
          options,
          value: { path: '/multiple' },
        },
      ],
      data: { multiple: ['red', 'blue'] },
    },
    {
      title: 'Chips',
      components: [
        {
          id: 'root',
          component: 'ChoicePicker',
          label: 'Tags',
          variant: 'multipleSelection',
          displayStyle: 'chips',
          options,
          value: { path: '/chips' },
        },
      ],
      data: { chips: ['yellow'] },
    },
    {
      title: 'Filterable',
      components: [
        {
          id: 'root',
          component: 'ChoicePicker',
          label: 'Country',
          filterable: true,
          options: countries,
          value: { path: '/country' },
        },
      ],
      data: { country: [] },
    },
  ],
}
