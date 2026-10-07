import { describe, expect, it } from '@jest/globals'
import { mergeStyles } from '../styles/utils'

describe('mergeStyles', () => {
  const defaults = { button: { margin: 8 }, primary: { padding: 4 } }

  it('returns the defaults when there are no overrides', () => {
    expect(mergeStyles(defaults, undefined)).toBe(defaults)
  })

  it('appends an override after the default for its key only', () => {
    const styles = mergeStyles(defaults, { primary: { padding: 0 } })
    expect(styles.primary).toEqual([{ padding: 4 }, { padding: 0 }])
    expect(styles.button).toBe(defaults.button)
  })

  it('ignores null overrides', () => {
    const styles = mergeStyles(defaults, { primary: null })
    expect(styles.primary).toBe(defaults.primary)
  })
})
