import { CardApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { StyleSheet, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { tokens } from '../tokens'
import { getWeightStyle } from '../utils'
import { TextColorProvider } from '../providers/text-color'

export const Card = createComponentImplementation(
  CardApi,
  ({ props, buildChild }) => {
    // MARK: Variables + States

    const styles = useComponentStyles('Card', cardStyles)

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
    backgroundColor: tokens.color.surface,
    borderColor: tokens.color.border,
    borderRadius: tokens.borderRadius,
    borderWidth: tokens.borderWidth,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin: tokens.spacing.m,
    padding: tokens.spacing.m,
  },
})
