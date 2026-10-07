import type { ViewStyle } from 'react-native'

type FlexStyle = Pick<
  ViewStyle,
  'alignItems' | 'flex' | 'justifyContent' | 'minHeight' | 'minWidth'
>

export const mapJustify = (j?: string): FlexStyle['justifyContent'] => {
  switch (j) {
    case 'center':
      return 'center'
    case 'end':
      return 'flex-end'
    case 'spaceAround':
      return 'space-around'
    case 'spaceBetween':
      return 'space-between'
    case 'spaceEvenly':
      return 'space-evenly'
    case 'start':
      return 'flex-start'
    // React Native has no `justifyContent: stretch`; flex-start is what the
    // browser falls back to for it in a flex container
    case 'stretch':
      return 'flex-start'
    default:
      return 'flex-start'
  }
}

export const mapAlign = (a?: string): FlexStyle['alignItems'] => {
  switch (a) {
    case 'start':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'end':
      return 'flex-end'
    case 'stretch':
      return 'stretch'
    default:
      return 'stretch'
  }
}

// `minWidth: 0` / `minHeight: 0` let weighted children shrink below their
// intrinsic content size. Without them, a component with large content would
// force the container to overflow.
export const getWeightStyle = (weight?: number): FlexStyle => {
  if (typeof weight !== 'number') return {}
  return { flex: weight, minWidth: 0, minHeight: 0 }
}
