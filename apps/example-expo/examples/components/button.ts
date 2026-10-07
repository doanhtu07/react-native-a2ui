import type { ComponentGallery } from '../types'

const button = (id: string, variant: string, label: string) => [
  {
    id,
    component: 'Button',
    variant,
    child: `${id}-text`,
    action: { event: { name: id, context: { variant } } },
  },
  { id: `${id}-text`, component: 'Text', text: label },
]

export const buttonGallery: ComponentGallery = {
  slug: 'button',
  name: 'Button',
  summary: 'Default, primary and borderless; disabled by checks',
  examples: [
    {
      title: 'Variants',
      description: 'Tap one to see the dispatched action',
      components: [
        {
          id: 'root',
          component: 'Column',
          children: ['default', 'primary', 'borderless'],
        },
        ...button('default', 'default', 'Default'),
        ...button('primary', 'primary', 'Primary'),
        ...button('borderless', 'borderless', 'Borderless'),
      ],
    },
    {
      title: 'Disabled by checks',
      description: 'Enabled once the field is filled in',
      components: [
        { id: 'root', component: 'Column', children: ['name', 'submit'] },
        {
          id: 'name',
          component: 'TextField',
          label: 'Name',
          value: { path: '/name' },
        },
        {
          id: 'submit',
          component: 'Button',
          variant: 'primary',
          child: 'submit-text',
          checks: [
            {
              condition: {
                call: 'required',
                args: { value: { path: '/name' } },
              },
              message: 'Name is required',
            },
          ],
          action: {
            event: { name: 'submit', context: { name: { path: '/name' } } },
          },
        },
        { id: 'submit-text', component: 'Text', text: 'Submit' },
      ],
      data: { name: '' },
    },
    {
      title: 'In a Row',
      components: [
        {
          id: 'root',
          component: 'Row',
          justify: 'end',
          children: ['cancel', 'save'],
        },
        ...button('cancel', 'default', 'Cancel'),
        ...button('save', 'primary', 'Save'),
      ],
    },
  ],
}
