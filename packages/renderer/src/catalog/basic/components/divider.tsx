import { DividerApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { useA2uiTokens } from '../../../styles/tokens/tokens'
import { lightTokens, type A2uiTokens } from '../styles/tokens/tokens'

export const Divider = createComponentImplementation(
  DividerApi,
  ({ props }) => {
    // MARK: Variables + States

    const tokens = useA2uiTokens()

    const tokenStyles = useMemo(
      () => createDividerTokenStyles(tokens),
      [tokens],
    )
    const styles = useComponentStyles('Divider', dividerStyles, tokenStyles)

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
    borderWidth: 0,
  },
  horizontal: {
    height: lightTokens.borderWidth,
    marginVertical: lightTokens.spacing.m,
    width: '100%',
  },
  // `height: 100%` of an auto-height row resolves to 0 in React Native;
  // stretching on the cross axis gives the same result
  vertical: {
    alignSelf: 'stretch',
    marginHorizontal: lightTokens.spacing.m,
    width: lightTokens.borderWidth,
  },
})

export const createDividerTokenStyles = (tokens: A2uiTokens) => ({
  divider: {
    backgroundColor: tokens.color.border,
  },
  horizontal: {},
  vertical: {},
})
