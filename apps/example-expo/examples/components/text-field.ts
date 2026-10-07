import type { ComponentGallery } from '../types'

const field = (id: string, variant: string, label: string) => ({
  id,
  component: 'TextField',
  variant,
  label,
  value: { path: `/${id}` },
})

export const textFieldGallery: ComponentGallery = {
  slug: 'text-field',
  name: 'TextField',
  summary: 'Short, long, number and obscured input',
  examples: [
    {
      title: 'Variants',
      components: [
        {
          id: 'root',
          component: 'Column',
          children: ['short', 'long', 'number', 'obscured'],
        },
        field('short', 'shortText', 'Short text'),
        field('long', 'longText', 'Long text'),
        field('number', 'number', 'Number'),
        field('obscured', 'obscured', 'Password'),
      ],
      data: { short: 'Hello', long: '', number: '42', obscured: 'secret' },
    },
    {
      title: 'Validation',
      description: 'Shows the first failing check',
      components: [
        {
          id: 'root',
          component: 'TextField',
          label: 'Email',
          value: { path: '/email' },
          checks: [
            {
              condition: {
                call: 'required',
                args: { value: { path: '/email' } },
              },
              message: 'Email is required',
            },
            {
              condition: { call: 'email', args: { value: { path: '/email' } } },
              message: 'Enter a valid email',
            },
          ],
        },
      ],
      data: { email: 'not-an-email' },
    },
    {
      title: 'Two-way binding',
      description: 'The Text below mirrors the field',
      components: [
        { id: 'root', component: 'Column', children: ['input', 'mirror'] },
        {
          id: 'input',
          component: 'TextField',
          label: 'Type here',
          value: { path: '/text' },
        },
        {
          id: 'mirror',
          component: 'Text',
          variant: 'caption',
          text: { path: '/text' },
        },
      ],
      data: { text: 'Edit me' },
    },
  ],
}
