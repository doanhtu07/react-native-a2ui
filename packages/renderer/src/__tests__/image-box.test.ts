import { describe, expect, it } from '@jest/globals'
import {
  LARGE_FEATURE_MAX_HEIGHT,
  resolveImageBox,
  SMALL_FEATURE_MAX_WIDTH,
} from '../catalog/basic/components/image/utils'

describe('resolveImageBox', () => {
  it('returns undefined when the intrinsic height is not measurable', () => {
    expect(
      resolveImageBox('smallFeature', { width: 600, height: 0 }, 366),
    ).toBeUndefined()
  })

  it('keeps the header on the aspect-ratio path (explicit height caps it)', () => {
    expect(
      resolveImageBox('header', { width: 1200, height: 400 }, 366),
    ).toEqual({ aspectRatio: 3 })
  })

  it('measures the parent on the first pass without engaging clamps', () => {
    expect(
      resolveImageBox('smallFeature', { width: 600, height: 400 }, undefined),
    ).toEqual({
      aspectRatio: 1.5,
      width: '100%',
      maxWidth: SMALL_FEATURE_MAX_WIDTH,
    })

    expect(
      resolveImageBox('mediumFeature', { width: 600, height: 400 }, 0),
    ).toEqual({ aspectRatio: 1.5, width: '100%', maxWidth: 600 })
  })

  it('sizes smallFeature from the measured width and the true ratio', () => {
    // The screenshot case: 600x400 asset, 366pt parent -> 100x66.7, not 100x400.
    expect(
      resolveImageBox('smallFeature', { width: 600, height: 400 }, 366),
    ).toEqual({ width: 100, height: 100 / 1.5 })
  })

  it('never upscales beyond the intrinsic width', () => {
    expect(
      resolveImageBox('mediumFeature', { width: 600, height: 400 }, 800),
    ).toEqual({ width: 600, height: 400 })

    expect(
      resolveImageBox('smallFeature', { width: 60, height: 40 }, 366),
    ).toEqual({ width: 60, height: 40 })
  })

  it('caps largeFeature height web-style, letting cover crop', () => {
    expect(
      resolveImageBox('largeFeature', { width: 800, height: 1000 }, 366),
    ).toEqual({ width: 366, height: LARGE_FEATURE_MAX_HEIGHT })

    // A wide asset stays ratio-exact instead of stretching to the cap.
    expect(
      resolveImageBox('largeFeature', { width: 1200, height: 400 }, 366),
    ).toEqual({ width: 366, height: 122 })
  })

  it('treats an omitted variant as the ratio-exact default', () => {
    expect(
      resolveImageBox(undefined, { width: 600, height: 400 }, 366),
    ).toEqual({ width: 366, height: 366 / 1.5 })
  })
})
