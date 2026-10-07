import { DividerApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { StyleSheet, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { tokens } from '../tokens'

export const Divider = createComponentImplementation(
  DividerApi,
  ({ props }) => {
    // MARK: Variables + States

    const styles = useComponentStyles('Divider', dividerStyles)

    const isVertical = props.axis === 'vertical'

    // MARK: Renderers

    return (
      <View
        style={[
          styles.divider,
          isVertical ? styles.vertical : styles.horizontal,
        ]}
      />
    )
  },
)

// MARK: Styles

export const dividerStyles = StyleSheet.create({
  divider: {
    backgroundColor: tokens.color.border,
    borderWidth: 0,
  },
  horizontal: {
    height: tokens.borderWidth,
    marginVertical: tokens.spacing.m,
    width: '100%',
  },
  // `height: 100%` of an auto-height row resolves to 0 in React Native;
  // stretching on the cross axis gives the same result
  vertical: {
    alignSelf: 'stretch',
    marginHorizontal: tokens.spacing.m,
    width: tokens.borderWidth,
  },
})
