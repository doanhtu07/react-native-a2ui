import type { ComponentGallery } from '../types'

const fruits = ['Apple', 'Banana', 'Cherry', 'Durian', 'Elderberry', 'Fig']

export const listGallery: ComponentGallery = {
  slug: 'list',
  name: 'List',
  summary: 'Scrolling list, vertical or horizontal',
  examples: [
    {
      title: 'Vertical',
      description: 'Template children from /fruits',
      components: [
        {
          id: 'root',
          component: 'List',
          children: { path: '/fruits', componentId: 'fruit' },
        },
        { id: 'fruit', component: 'Text', text: { path: 'name' } },
      ],
      data: { fruits: fruits.map((name) => ({ name })) },
    },
    {
      title: 'Horizontal',
      description: 'Scrolls sideways',
      components: [
        {
          id: 'root',
          component: 'List',
          direction: 'horizontal',
          children: { path: '/fruits', componentId: 'fruit' },
        },
        { id: 'fruit', component: 'Card', child: 'fruit-name' },
        { id: 'fruit-name', component: 'Text', text: { path: 'name' } },
      ],
      data: { fruits: fruits.map((name) => ({ name })) },
    },
    {
      title: 'align: center',
      components: [
        {
          id: 'root',
          component: 'List',
          align: 'center',
          children: ['one', 'two', 'three'],
        },
        { id: 'one', component: 'Text', text: 'Short' },
        { id: 'two', component: 'Text', text: 'A longer item' },
        { id: 'three', component: 'Text', text: 'Mid length' },
      ],
    },
  ],
}
