import type { ComponentGallery } from '../types'

export const checkBoxGallery: ComponentGallery = {
  slug: 'check-box',
  name: 'CheckBox',
  summary: 'Boolean toggle, rendered as a Switch',
  examples: [
    {
      title: 'Checked and unchecked',
      components: [
        { id: 'root', component: 'Column', children: ['on', 'off'] },
        {
          id: 'on',
          component: 'CheckBox',
          label: 'Checked',
          value: { path: '/on' },
        },
        {
          id: 'off',
          component: 'CheckBox',
          label: 'Unchecked',
          value: { path: '/off' },
        },
      ],
      data: { on: true, off: false },
    },
    {
      title: 'Validation',
      description: 'Must be checked',
      components: [
        {
          id: 'root',
          component: 'CheckBox',
          label: 'I accept the terms',
          value: { path: '/accepted' },
          checks: [
            {
              condition: { path: '/accepted' },
              message: 'You must accept the terms',
            },
          ],
        },
      ],
      data: { accepted: false },
    },
  ],
}
