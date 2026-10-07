import type { ComponentGallery } from '../types'

export const tabsGallery: ComponentGallery = {
  slug: 'tabs',
  name: 'Tabs',
  summary: 'Tab headers that switch the visible child',
  examples: [
    {
      title: 'Three tabs',
      components: [
        {
          id: 'root',
          component: 'Tabs',
          tabs: [
            { title: 'Overview', child: 'overview' },
            { title: 'Details', child: 'details' },
            { title: 'Reviews', child: 'reviews' },
          ],
        },
        { id: 'overview', component: 'Text', text: 'Overview content' },
        {
          id: 'details',
          component: 'Column',
          children: ['details-title', 'details-body'],
        },
        {
          id: 'details-title',
          component: 'Text',
          variant: 'h4',
          text: 'Details',
        },
        {
          id: 'details-body',
          component: 'Text',
          text: 'Each tab renders a single child; use a layout for more.',
        },
        { id: 'reviews', component: 'Text', text: 'No reviews yet' },
      ],
    },
    {
      title: 'Bound titles',
      description: 'Tab titles from the data model',
      components: [
        {
          id: 'root',
          component: 'Tabs',
          tabs: [
            { title: { path: '/tabs/first' }, child: 'first' },
            { title: { path: '/tabs/second' }, child: 'second' },
          ],
        },
        { id: 'first', component: 'Text', text: 'First tab' },
        { id: 'second', component: 'Text', text: 'Second tab' },
      ],
      data: { tabs: { first: 'Inbox', second: 'Archive' } },
    },
  ],
}
