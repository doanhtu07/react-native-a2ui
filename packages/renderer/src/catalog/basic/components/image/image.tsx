import { ImageApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useEffect, useState } from 'react'
import type { ImageStyle } from 'react-native'
import { Image as RNImage, StyleSheet } from 'react-native'

import { createComponentImplementation } from '../../../../adapter'
import { useComponentStyles } from '../../../../styles/styles'
import { getWeightStyle } from '../../styles/utils'
import { mapFit, resolveImageBox } from './utils'
import { LARGE_FEATURE_MAX_HEIGHT, SMALL_FEATURE_MAX_WIDTH } from './constants'
import type { ImageIntrinsicSize } from './types'

export const Image = createComponentImplementation(ImageApi, ({ props }) => {
  // MARK: Variables + States

  const styles = useComponentStyles('Image', imageStyles)

  // An `<img>` lays out at its intrinsic size; a React Native remote image
  // has none, so it's measured here
  const [size, setSize] = useState<ImageIntrinsicSize>()

  // Width `onLayout` reported for this image's box: the available width on
  // the measuring pass, the exact laid-out width afterwards.
  const [contentWidth, setContentWidth] = useState<number>()

  const isFixedSize = props.variant === 'icon' || props.variant === 'avatar'

  // MARK: Effects

  /*
    Effect: A new image or variant can change the intrinsic size and the caps, so
    the previous measurement must not be reused.
  */
  useEffect(() => {
    setSize(undefined)
    setContentWidth(undefined)
  }, [props.url, props.variant])

  // Effect: Fetch the intrinsic size of the image from the remote URL.
  useEffect(() => {
    if (!props.url) {
      return
    }

    let active = true

    RNImage.getSize(props.url).then(
      ({ width, height }) => {
        if (active) setSize({ width, height })
      },
      () => {},
    )

    return () => {
      active = false
    }
  }, [props.url])

  // MARK: Preparation

  const intrinsicStyle: ImageStyle | undefined =
    size && !isFixedSize
      ? resolveImageBox(props.variant, size, contentWidth)
      : undefined

  const variantStyle =
    props.variant && props.variant in styles
      ? styles[props.variant as keyof typeof styles]
      : undefined

  // MARK: Renderers

  return (
    <RNImage
      source={{ uri: props.url }}
      style={[
        styles.base,
        getWeightStyle(props.weight),
        intrinsicStyle,
        variantStyle,
      ]}
      accessibilityLabel={props.description || ''}
      resizeMode={props.variant === 'header' ? 'cover' : mapFit(props.fit)}
      /*
        `getSize` above can fail for non-remote URIs (e.g. bundled local
        assets); the load event reports intrinsic dimensions for any source
        and fills in whatever `getSize` missed.
      */
      onLoad={(e) => {
        const { width, height } = e.nativeEvent.source ?? {}

        if (width > 0 && height > 0) {
          setSize({ width, height })
        }
      }}
      /*
        Measures the available width for the exact box above. Only the
        width is used, and only when it actually changed, so layout
        converges instead of looping.
      */
      onLayout={(e) => {
        const { width } = e.nativeEvent.layout

        if (
          width > 0 &&
          (contentWidth === undefined || Math.abs(width - contentWidth) > 0.5)
        ) {
          setContentWidth(width)
        }
      }}
    />
  )
})

// MARK: Styles

export const imageStyles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  base: {
    borderRadius: 0,
    maxWidth: '100%',
  },
  header: {
    height: 200,
  },
  icon: {
    height: 24,
    width: 24,
  },
  largeFeature: {
    maxHeight: LARGE_FEATURE_MAX_HEIGHT,
  },
  smallFeature: {
    maxWidth: SMALL_FEATURE_MAX_WIDTH,
  },
})
