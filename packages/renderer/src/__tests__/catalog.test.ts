import { describe, expect, it } from '@jest/globals'
import { MessageProcessor, NodeResolver, peekValue } from '@a2ui/web_core'

import { basicCatalog } from '../catalog/basic/basic-catalog'

const CATALOG_ID =
  'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json'

function createSurface(components: Record<string, unknown>[], data = {}) {
  const processor = new MessageProcessor([basicCatalog])

  processor.processMessages([
    {
      version: 'v0.9',
      createSurface: { surfaceId: 's', catalogId: CATALOG_ID },
    },
    { version: 'v0.9', updateComponents: { surfaceId: 's', components } },
    {
      version: 'v0.9',
      updateDataModel: { surfaceId: 's', path: '/', value: data },
    },
  ])

  const surface = processor.getSurface('s')!

  return new NodeResolver(surface, surface.defaultCatalog)
}

describe('basicCatalog', () => {
  it('registers the 13 supported components', () => {
    expect([...basicCatalog.components.keys()].sort()).toEqual([
      'Button',
      'Card',
      'CheckBox',
      'ChoicePicker',
      'Column',
      'Divider',
      'Image',
      'List',
      'Modal',
      'Row',
      'Tabs',
      'Text',
      'TextField',
    ])
  })

  it('every component has a view for the node surface', () => {
    for (const impl of basicCatalog.components.values()) {
      expect(typeof impl.view).toBe('function')
    }
  })

  it('resolves a template list against the data model', () => {
    const resolver = createSurface(
      [
        {
          id: 'root',
          component: 'Column',
          children: { path: '/items', componentId: 'item' },
        },
        { id: 'item', component: 'Text', text: { path: 'name' } },
      ],
      { items: [{ name: 'a' }, { name: 'b' }] },
    )

    const root = peekValue(resolver.rootNode)!

    const children = peekValue(root.props).children as {
      dataPath: string
      props: unknown
    }[]

    expect(children.map((child) => child.dataPath)).toEqual([
      '/items/0',
      '/items/1',
    ])
  })

  it('reports unknown component types', () => {
    const resolver = createSurface([
      { id: 'root', component: 'Column', children: ['icon'] },
      { id: 'icon', component: 'Icon', name: 'home' },
    ])

    const root = peekValue(resolver.rootNode)!
    const [icon] = peekValue(root.props).children as { state: string }[]

    expect(icon?.state).toBe('unknown-type')
  })
})
