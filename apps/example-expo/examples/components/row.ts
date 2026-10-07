import type { ComponentGallery } from '../types'

const boxes = (prefix: string, count = 3) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    component: 'Button',
    child: `${prefix}-${i}-label`,
    action: { event: { name: `${prefix}-${i}` } },
  })).flatMap((button, i) => [
    button,
    { id: `${prefix}-${i}-label`, component: 'Text', text: `Item ${i + 1}` },
  ])

const ids = (prefix: string, count = 3) =>
  Array.from({ length: count }, (_, i) => `${prefix}-${i}`)

const justifyExample = (justify: string) => ({
  title: `justify: ${justify}`,
  components: [
    { id: 'root', component: 'Row', justify, children: ids('b') },
    ...boxes('b'),
  ],
})

export const rowGallery: ComponentGallery = {
  slug: 'row',
  name: 'Row',
  summary: 'Horizontal layout with justify, align and weight',
  examples: [
    justifyExample('start'),
    justifyExample('center'),
    justifyExample('end'),
    justifyExample('spaceBetween'),
    justifyExample('spaceAround'),
    justifyExample('spaceEvenly'),
    {
      title: 'align',
      description: 'start, center, end and stretch against a tall item',
      components: [
        {
          id: 'root',
          component: 'Column',
          children: ['start', 'center', 'end', 'stretch'],
        },
        ...['start', 'center', 'end', 'stretch'].flatMap((align) => [
          {
            id: align,
            component: 'Row',
            align,
            children: [`${align}-tall`, `${align}-short`],
          },
          {
            id: `${align}-tall`,
            component: 'Text',
            text: `align: ${align}\nsecond line\nthird line`,
          },
          {
            id: `${align}-short`,
            component: 'Card',
            child: `${align}-short-text`,
          },
          { id: `${align}-short-text`, component: 'Text', text: 'Short' },
        ]),
      ],
    },
    {
      title: 'weight',
      description: 'Children weighted 1, 2 and 1',
      components: [
        { id: 'root', component: 'Row', children: ['w1', 'w2', 'w3'] },
        { id: 'w1', component: 'Card', weight: 1, child: 'w1-text' },
        { id: 'w2', component: 'Card', weight: 2, child: 'w2-text' },
        { id: 'w3', component: 'Card', weight: 1, child: 'w3-text' },
        { id: 'w1-text', component: 'Text', text: '1' },
        { id: 'w2-text', component: 'Text', text: '2' },
        { id: 'w3-text', component: 'Text', text: '1' },
      ],
    },
  ],
}
