import type { ComponentGallery } from '../types'

export const modalGallery: ComponentGallery = {
  slug: 'modal',
  name: 'Modal',
  summary: 'Dialog opened by its trigger',
  examples: [
    {
      title: 'Button trigger',
      description: 'Tap the button; close with × or the backdrop',
      components: [
        { id: 'root', component: 'Modal', trigger: 'open', content: 'content' },
        {
          id: 'open',
          component: 'Button',
          variant: 'primary',
          child: 'open-text',
          action: { event: { name: 'openModal' } },
        },
        { id: 'open-text', component: 'Text', text: 'Open modal' },
        {
          id: 'content',
          component: 'Column',
          children: ['title', 'body'],
        },
        { id: 'title', component: 'Text', variant: 'h3', text: 'Modal title' },
        {
          id: 'body',
          component: 'Text',
          text: 'Content shown in the dialog.',
        },
      ],
    },
    {
      title: 'Text trigger',
      description: 'Any component can be the trigger',
      components: [
        { id: 'root', component: 'Modal', trigger: 'open', content: 'content' },
        { id: 'open', component: 'Text', text: 'Tap this text' },
        { id: 'content', component: 'Text', text: 'Opened from a Text' },
      ],
    },
    {
      title: 'Long content',
      description: 'The dialog body scrolls',
      components: [
        { id: 'root', component: 'Modal', trigger: 'open', content: 'content' },
        {
          id: 'open',
          component: 'Button',
          child: 'open-text',
          action: { event: { name: 'openModal' } },
        },
        { id: 'open-text', component: 'Text', text: 'Open long modal' },
        {
          id: 'content',
          component: 'Column',
          children: { path: '/paragraphs', componentId: 'paragraph' },
        },
        { id: 'paragraph', component: 'Text', text: { path: 'text' } },
      ],
      data: {
        paragraphs: Array.from({ length: 20 }, (_, i) => ({
          text: `Paragraph ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        })),
      },
    },
  ],
}
