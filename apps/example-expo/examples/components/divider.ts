import type { ComponentGallery } from '../types'

export const dividerGallery: ComponentGallery = {
  slug: 'divider',
  name: 'Divider',
  summary: 'Hairline separator, horizontal or vertical',
  examples: [
    {
      title: 'Horizontal',
      components: [
        {
          id: 'root',
          component: 'Column',
          children: ['above', 'divider', 'below'],
        },
        { id: 'above', component: 'Text', text: 'Above' },
        { id: 'divider', component: 'Divider' },
        { id: 'below', component: 'Text', text: 'Below' },
      ],
    },
    {
      title: 'Vertical',
      description: 'Stretches to the Row height',
      components: [
        {
          id: 'root',
          component: 'Row',
          children: ['left', 'divider', 'right'],
        },
        { id: 'left', component: 'Text', text: 'Left\nside' },
        { id: 'divider', component: 'Divider', axis: 'vertical' },
        { id: 'right', component: 'Text', text: 'Right\nside' },
      ],
    },
  ],
}
