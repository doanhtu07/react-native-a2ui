import { CardApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { useA2uiTokens } from '../../../styles/tokens/tokens'
import { getWeightStyle, lightTokens, type A2uiTokens } from '../styles'
import { TextColorProvider } from '../providers/text-color'

export const Card = createComponentImplementation(
  CardApi,
  ({ props, buildChild }) => {
    // MARK: Variables + States

    const tokens = useA2uiTokens()
    const tokenStyles = useMemo(() => createCardTokenStyles(tokens), [tokens])
    const styles = useComponentStyles('Card', cardStyles, tokenStyles)

    // MARK: Renderers

    return (
      <View style={[getWeightStyle(props.weight), styles.card]}>
        <TextColorProvider value={tokens.color.onSurface}>
          {props.child ? buildChild(props.child) : null}
        </TextColorProvider>
      </View>
    )
  },
)

// MARK: Styles

export const cardStyles = StyleSheet.create({
  card: {
    borderRadius: lightTokens.borderRadius,
    borderWidth: lightTokens.borderWidth,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin: lightTokens.spacing.m,
    padding: lightTokens.spacing.m,
  },
})

export const createCardTokenStyles = (tokens: A2uiTokens) => ({
  card: {
    backgroundColor: tokens.color.surface,
    borderColor: tokens.color.border,
  },
})
