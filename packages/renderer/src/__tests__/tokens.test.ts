import { describe, expect, it } from '@jest/globals'
import { darkTokens, lightTokens } from '../catalog/basic/styles/tokens/tokens'
import { mergeTokens } from '../catalog/basic/styles/tokens/utils'
import { mergeStyleLayers } from '../styles/utils'

describe('mergeTokens', () => {
  it('returns the base when there are no overrides', () => {
    expect(mergeTokens(lightTokens, undefined)).toBe(lightTokens)
    expect(mergeTokens(lightTokens, null)).toBe(lightTokens)
  })

  it('deep merges color overrides key by key', () => {
    const merged = mergeTokens(lightTokens, {
      color: { primary: 'teal' },
    })

    expect(merged.color.primary).toBe('teal')
    expect(merged.color.surface).toBe(lightTokens.color.surface)
    expect(merged.spacing).toBe(lightTokens.spacing)
  })

  it('replaces scalars and never mutates the base', () => {
    const merged = mergeTokens(lightTokens, {
      borderRadius: 999,
    } as never)

    expect(merged.borderRadius).toBe(999)
    expect(lightTokens.borderRadius).toBe(4)
    expect(lightTokens.color.primary).toBe('#17e')
  })

  it('dark tokens keep the same shape with swapped colors', () => {
    expect(Object.keys(darkTokens.color).sort()).toEqual(
      Object.keys(lightTokens.color).sort(),
    )
    expect(darkTokens.color.surface).not.toBe(lightTokens.color.surface)
    expect(darkTokens.spacing).toEqual(lightTokens.spacing)
  })
})

describe('mergeStyleLayers', () => {
  const statics = {
    button: { padding: 8 },
    primary: { padding: 4 },
  }

  it('returns statics when neither layer is present', () => {
    expect(mergeStyleLayers(statics, undefined, undefined)).toBe(statics)
  })

  it('orders [static, token, override] so host styles win', () => {
    const merged = mergeStyleLayers(
      statics,
      { primary: { backgroundColor: 'blue' } },
      { primary: { backgroundColor: 'teal' } },
    )

    expect(merged.primary).toEqual([
      { padding: 4 },
      { backgroundColor: 'blue' },
      { backgroundColor: 'teal' },
    ])

    expect(merged.button).toBe(statics.button)
  })

  it('keeps token-only keys without an override', () => {
    const merged = mergeStyleLayers(
      statics,
      { button: { backgroundColor: 'blue' } },
      undefined,
    )

    expect(merged.button).toEqual([{ padding: 8 }, { backgroundColor: 'blue' }])
  })

  it('ignores null token and override entries', () => {
    const merged = mergeStyleLayers(
      statics,
      { primary: null },
      { primary: null },
    )

    expect(merged.primary).toBe(statics.primary)
  })
})
