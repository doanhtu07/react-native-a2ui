import { TextApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { Text as RNText, StyleSheet } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { tokens } from '../tokens'
import { getWeightStyle } from '../utils'
import { useTextColor } from '../providers/text-color'

/**
 * Renders the text as is. Unlike `@a2ui/react`, body text isn't run through
 * a markdown renderer: markers are shown verbatim. Hosts that want markdown
 * replace Text through the catalog.
 */
export const Text = createComponentImplementation(TextApi, ({ props }) => {
  // MARK: Variables + States

  const styles = useComponentStyles('Text', textStyles)

  const textColor = useTextColor()

  const text =
    typeof props.text === 'string' ? props.text : String(props.text ?? '')

  const variant = props.variant || 'body'

  // MARK: Preparation

  const variantStyle =
    variant === 'caption' ? styles.a2uiCaption : styles[variant]

  // MARK: Renderers

  return (
    <RNText
      accessibilityRole={variant.startsWith('h') ? 'header' : undefined}
      style={[
        { color: textColor ?? tokens.color.onBackground },
        variantStyle,
        getWeightStyle(props.weight),
      ]}
    >
      {text}
    </RNText>
  )
})

// MARK: Styles

export const textStyles = StyleSheet.create({
  a2uiCaption: {
    color: tokens.color.textCaption,
    fontStyle: 'italic',
    textAlign: 'left',
  },
  body: {
    fontSize: tokens.fontSize.m,
    lineHeight: tokens.fontSize.m * tokens.lineHeight.body,
  },
  h1: {
    fontSize: tokens.fontSize['2xl'],
    fontWeight: 'bold',
    lineHeight: tokens.fontSize['2xl'] * tokens.lineHeight.headings,
  },
  h2: {
    fontSize: tokens.fontSize.xl,
    fontWeight: 'bold',
    lineHeight: tokens.fontSize.xl * tokens.lineHeight.headings,
  },
  h3: {
    fontSize: tokens.fontSize.l,
    fontWeight: 'bold',
    lineHeight: tokens.fontSize.l * tokens.lineHeight.headings,
  },
  h4: {
    fontSize: tokens.fontSize.m,
    fontWeight: 'bold',
    lineHeight: tokens.fontSize.m * tokens.lineHeight.headings,
  },
  h5: {
    fontSize: tokens.fontSize.s,
    fontWeight: 'bold',
    lineHeight: tokens.fontSize.s * tokens.lineHeight.headings,
  },
})
