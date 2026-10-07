import type { ComponentGallery } from '../types'

const items = ['a', 'b', 'c']

const texts = (prefix: string) =>
  items.map((item) => ({
    id: `${prefix}-${item}`,
    component: 'Card',
    child: `${prefix}-${item}-text`,
  }))

const textLabels = (prefix: string) =>
  items.map((item) => ({
    id: `${prefix}-${item}-text`,
    component: 'Text',
    text: `Item ${item.toUpperCase()}`,
  }))

const alignExample = (align: string) => ({
  title: `align: ${align}`,
  components: [
    {
      id: 'root',
      component: 'Column',
      align,
      children: items.map((item) => `x-${item}`),
    },
    ...texts('x'),
    ...textLabels('x'),
  ],
})

export const columnGallery: ComponentGallery = {
  slug: 'column',
  name: 'Column',
  summary: 'Vertical layout with justify, align and weight',
  examples: [
    alignExample('stretch'),
    alignExample('start'),
    alignExample('center'),
    alignExample('end'),
    {
      title: 'Template children',
      description: 'Children generated from /people',
      components: [
        {
          id: 'root',
          component: 'Column',
          children: { path: '/people', componentId: 'person' },
        },
        { id: 'person', component: 'Text', text: { path: 'name' } },
      ],
      data: {
        people: [{ name: 'Ada' }, { name: 'Grace' }, { name: 'Linus' }],
      },
    },
    {
      title: 'Nested layout',
      description: 'A Row inside a Column',
      components: [
        { id: 'root', component: 'Column', children: ['title', 'row'] },
        { id: 'title', component: 'Text', variant: 'h3', text: 'Title' },
        { id: 'row', component: 'Row', children: ['left', 'right'] },
        { id: 'left', component: 'Text', weight: 1, text: 'Left' },
        { id: 'right', component: 'Text', weight: 1, text: 'Right' },
      ],
    },
  ],
}
