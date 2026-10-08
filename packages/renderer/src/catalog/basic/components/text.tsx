import { TextApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useMemo } from 'react'
import { Text as RNText, StyleSheet } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { useA2uiTokens } from '../../../styles/tokens/tokens'
import { useTextColor } from '../providers/text-color'
import { getWeightStyle } from '../styles/utils'
import { lightTokens, type A2uiTokens } from '../styles/tokens/tokens'

/**
 * Renders the text as is. Unlike `@a2ui/react`, body text isn't run through
 * a markdown renderer: markers are shown verbatim. Hosts that want markdown
 * replace Text through the catalog.
 */
export const Text = createComponentImplementation(TextApi, ({ props }) => {
  // MARK: Variables + States

  const tokens = useA2uiTokens()
  const tokenStyles = useMemo(() => createTextTokenStyles(tokens), [tokens])
  const styles = useComponentStyles('Text', textStyles, tokenStyles)

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
    fontStyle: 'italic',
    textAlign: 'left',
  },
  body: {
    fontSize: lightTokens.fontSize.m,
    lineHeight: lightTokens.fontSize.m * lightTokens.lineHeight.body,
  },
  h1: {
    fontSize: lightTokens.fontSize['2xl'],
    fontWeight: 'bold',
    lineHeight: lightTokens.fontSize['2xl'] * lightTokens.lineHeight.headings,
  },
  h2: {
    fontSize: lightTokens.fontSize.xl,
    fontWeight: 'bold',
    lineHeight: lightTokens.fontSize.xl * lightTokens.lineHeight.headings,
  },
  h3: {
    fontSize: lightTokens.fontSize.l,
    fontWeight: 'bold',
    lineHeight: lightTokens.fontSize.l * lightTokens.lineHeight.headings,
  },
  h4: {
    fontSize: lightTokens.fontSize.m,
    fontWeight: 'bold',
    lineHeight: lightTokens.fontSize.m * lightTokens.lineHeight.headings,
  },
  h5: {
    fontSize: lightTokens.fontSize.s,
    fontWeight: 'bold',
    lineHeight: lightTokens.fontSize.s * lightTokens.lineHeight.headings,
  },
})

export const createTextTokenStyles = (tokens: A2uiTokens) => ({
  a2uiCaption: {
    color: tokens.color.textCaption,
  },
  body: {},
  h1: {},
  h2: {},
  h3: {},
  h4: {},
  h5: {},
})
