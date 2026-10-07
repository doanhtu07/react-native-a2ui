import type { ImageProps, ImageStyle } from 'react-native'

export const SMALL_FEATURE_MAX_WIDTH = 100
export const LARGE_FEATURE_MAX_HEIGHT = 400

export type ImageIntrinsicSize = { width: number; height: number }

/**
 * Computes the layout box for a non-fixed-size image from its intrinsic size
 * and the width `onLayout` reported.
 *
 * Yoga derives an aspect-ratio height from the *unclamped* width and only
 * clamps afterwards, so `{ width: intrinsic, aspectRatio, maxWidth: cap }`
 * yields a tall, distorted box (e.g. 100x400 for a 600x400 asset capped at
 * 100 wide). Computing exact pixels here keeps Yoga out of that path: no
 * explicit dimension ever fights a same-axis clamp.
 *
 * The ratio always comes from the intrinsic source size (`getSize`/`onLoad`);
 * `contentWidth` is only ever used as a length (the available width).
 */
export function resolveImageBox(
  variant: string | undefined,
  size: ImageIntrinsicSize,
  contentWidth: number | undefined,
): ImageStyle | undefined {
  if (size.height <= 0) {
    return undefined
  }

  const aspectRatio = size.width / size.height

  // A header sets the height; the width follows from the aspect ratio.
  // The `maxWidth: 100%` clamp hits the derived axis here, which is safe.
  if (variant === 'header') {
    return { aspectRatio }
  }

  if (contentWidth === undefined || contentWidth <= 0) {
    // First pass: span the parent so `onLayout` can measure its width.
    return {
      aspectRatio,
      width: '100%',
      maxWidth:
        variant === 'smallFeature' ? SMALL_FEATURE_MAX_WIDTH : size.width,
    }
  }

  // Exact box: width is the tightest of the available, variant, and
  // intrinsic widths; height follows the true ratio (largeFeature mirrors
  // the web `max-height` by clamping height only, letting `cover` crop).

  const width = Math.min(
    contentWidth,
    variant === 'smallFeature' ? SMALL_FEATURE_MAX_WIDTH : size.width,
    size.width,
  )

  const height = Math.min(
    width / aspectRatio,
    variant === 'largeFeature' ? LARGE_FEATURE_MAX_HEIGHT : Infinity,
  )

  return { width, height }
}

export type ResizeMode = NonNullable<ImageProps['resizeMode']>

// CSS `object-fit` → `resizeMode`; `scaleDown` behaves as `contain` for
// images larger than their box, which is the case `resizeMode` can express.
// An omitted `fit` covers, matching the web renderer's `props.fit || 'cover'`
// (and avoiding distortion when a variant cap clamps the measured box).
export const mapFit = (fit?: string): ResizeMode => {
  switch (fit) {
    case 'contain':
    case 'scaleDown':
      return 'contain'
    case 'fill':
      return 'stretch'
    case 'none':
      return 'center'
    case 'cover':
    default:
      return 'cover'
  }
}
