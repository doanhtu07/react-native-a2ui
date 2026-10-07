import { galleryImages } from '../gallery-images'
import type { ComponentGallery } from '../types'

export const imageGallery: ComponentGallery = {
  slug: 'image',
  name: 'Image',
  summary: 'Bundled images with size variants and fit',
  examples: [
    {
      title: 'Icon and avatar',
      description: 'Fixed-size variants',
      components: [
        {
          id: 'root',
          component: 'Row',
          align: 'center',
          children: ['icon', 'avatar'],
        },
        {
          id: 'icon',
          component: 'Image',
          variant: 'icon',
          fit: 'cover',
          url: galleryImages.icon,
          description: 'Icon',
        },
        {
          id: 'avatar',
          component: 'Image',
          variant: 'avatar',
          fit: 'cover',
          url: galleryImages.avatar,
          description: 'Avatar',
        },
      ],
    },
    {
      title: 'Small feature',
      components: [
        {
          id: 'root',
          component: 'Image',
          variant: 'smallFeature',
          url: galleryImages.small,
          description: 'Small feature',
        },
      ],
    },
    {
      title: 'Medium feature',
      description: 'The default variant',
      components: [
        {
          id: 'root',
          component: 'Image',
          url: galleryImages.medium,
          description: 'Medium feature',
        },
      ],
    },
    {
      title: 'Large feature',
      components: [
        {
          id: 'root',
          component: 'Image',
          variant: 'largeFeature',
          url: galleryImages.large,
          description: 'Large feature',
        },
      ],
    },
    {
      title: 'Header',
      description: 'Fixed height, always cover',
      components: [
        {
          id: 'root',
          component: 'Image',
          variant: 'header',
          url: galleryImages.header,
          description: 'Header',
        },
      ],
    },
    {
      title: 'Fit',
      description: 'contain, cover, fill and none in equal boxes',
      components: [
        {
          id: 'root',
          component: 'Row',
          children: ['contain', 'cover', 'fill', 'none'],
        },
        ...['contain', 'cover', 'fill', 'none'].map((fit) => ({
          id: fit,
          component: 'Image',
          variant: 'avatar',
          fit,
          url: galleryImages.fit,
          description: fit,
        })),
      ],
    },
  ],
}
