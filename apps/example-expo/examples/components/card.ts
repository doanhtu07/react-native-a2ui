import { galleryImages } from '../gallery-images'
import type { ComponentGallery } from '../types'

export const cardGallery: ComponentGallery = {
  slug: 'card',
  name: 'Card',
  summary: 'Surface container with a single child',
  examples: [
    {
      title: 'Simple',
      components: [
        { id: 'root', component: 'Card', child: 'text' },
        { id: 'text', component: 'Text', text: 'Content inside a card' },
      ],
    },
    {
      title: 'Rich content',
      description: 'Image, text and actions in a Column',
      components: [
        { id: 'root', component: 'Card', child: 'content' },
        {
          id: 'content',
          component: 'Column',
          children: ['image', 'title', 'body', 'actions'],
        },
        {
          id: 'image',
          component: 'Image',
          variant: 'header',
          url: galleryImages.card,
          description: 'Card image',
        },
        { id: 'title', component: 'Text', variant: 'h3', text: 'Card title' },
        {
          id: 'body',
          component: 'Text',
          text: 'Supporting text that describes the card.',
        },
        {
          id: 'actions',
          component: 'Row',
          justify: 'end',
          children: ['cancel', 'confirm'],
        },
        {
          id: 'cancel',
          component: 'Button',
          variant: 'borderless',
          child: 'cancel-text',
          action: { event: { name: 'cancel' } },
        },
        { id: 'cancel-text', component: 'Text', text: 'Cancel' },
        {
          id: 'confirm',
          component: 'Button',
          variant: 'primary',
          child: 'confirm-text',
          action: { event: { name: 'confirm' } },
        },
        { id: 'confirm-text', component: 'Text', text: 'Confirm' },
      ],
    },
    {
      title: 'Side by side',
      description: 'Weighted cards in a Row',
      components: [
        { id: 'root', component: 'Row', children: ['left', 'right'] },
        { id: 'left', component: 'Card', weight: 1, child: 'left-text' },
        { id: 'right', component: 'Card', weight: 1, child: 'right-text' },
        { id: 'left-text', component: 'Text', text: 'Left card' },
        { id: 'right-text', component: 'Text', text: 'Right card' },
      ],
    },
  ],
}
