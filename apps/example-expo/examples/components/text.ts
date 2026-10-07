import type { ComponentGallery } from '../types'

export const textGallery: ComponentGallery = {
  slug: 'text',
  name: 'Text',
  summary: 'Headings, body and caption text',
  examples: [
    {
      title: 'Variants',
      description: 'h1–h5, body and caption',
      components: [
        {
          id: 'root',
          component: 'Column',
          children: ['h1', 'h2', 'h3', 'h4', 'h5', 'body', 'caption'],
        },
        { id: 'h1', component: 'Text', variant: 'h1', text: 'Heading 1' },
        { id: 'h2', component: 'Text', variant: 'h2', text: 'Heading 2' },
        { id: 'h3', component: 'Text', variant: 'h3', text: 'Heading 3' },
        { id: 'h4', component: 'Text', variant: 'h4', text: 'Heading 4' },
        { id: 'h5', component: 'Text', variant: 'h5', text: 'Heading 5' },
        {
          id: 'body',
          component: 'Text',
          variant: 'body',
          text: 'Body text. The quick brown fox jumps over the lazy dog.',
        },
        {
          id: 'caption',
          component: 'Text',
          variant: 'caption',
          text: 'Caption text',
        },
      ],
    },
    {
      title: 'Long text',
      description: 'Wraps across lines',
      components: [
        {
          id: 'root',
          component: 'Text',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
      ],
    },
    {
      title: 'Data binding',
      description: 'Text bound to /user/name',
      components: [
        { id: 'root', component: 'Text', text: { path: '/user/name' } },
      ],
      data: { user: { name: 'Bound from the data model' } },
    },
    {
      title: 'Markdown markers',
      description: 'No markdown renderer: markers are shown as is',
      components: [
        {
          id: 'root',
          component: 'Text',
          text: '**Bold**, _italic_ and `code`',
        },
      ],
    },
  ],
}
