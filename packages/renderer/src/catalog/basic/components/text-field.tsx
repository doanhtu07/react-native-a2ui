import { TextFieldApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useMemo, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { useA2uiTokens } from '../../../styles/tokens/tokens'
import { lightTokens, type A2uiTokens } from '../styles/tokens/tokens'

export const TextField = createComponentImplementation(
  TextFieldApi,
  ({ props }) => {
    // MARK: Variables + States

    const tokens = useA2uiTokens()

    const tokenStyles = useMemo(
      () => createTextFieldTokenStyles(tokens),
      [tokens],
    )

    const styles = useComponentStyles('TextField', textFieldStyles, tokenStyles)

    // `:focus` on the web
    const [isFocused, setIsFocused] = useState(false)

    const isLong = props.variant === 'longText'
    const hasError = props.validationErrors && props.validationErrors.length > 0

    // MARK: Renderers

    return (
      <View style={styles.host}>
        {props.label ? <Text style={styles.label}>{props.label}</Text> : null}

        <TextInput
          accessibilityLabel={props.label || undefined}
          keyboardType={props.variant === 'number' ? 'numeric' : 'default'}
          multiline={isLong}
          onBlur={() => setIsFocused(false)}
          onChangeText={(text) => props.setValue(text)}
          onFocus={() => setIsFocused(true)}
          secureTextEntry={props.variant === 'obscured'}
          style={[
            styles.input,
            isLong && styles.longText,
            isFocused && styles.focused,
            hasError && styles.invalid,
          ]}
          value={props.value || ''}
        />

        {hasError ? (
          <Text style={styles.error}>{props.validationErrors![0]}</Text>
        ) : null}
      </View>
    )
  },
)

// MARK: Styles

export const textFieldStyles = StyleSheet.create({
  error: {
    fontSize: lightTokens.fontSize.xs,
  },
  focused: {},
  host: {
    gap: lightTokens.spacing.xs,
    width: '100%',
  },
  input: {
    borderRadius: lightTokens.spacing.m,
    borderWidth: lightTokens.borderWidth,
    padding: lightTokens.spacing.m,
    width: '100%',
  },
  invalid: {},
  label: {
    fontSize: lightTokens.fontSize.s,
    fontWeight: 'bold',
  },
  // A `<textarea>`'s default two rows
  longText: {
    minHeight: lightTokens.fontSize.m * 2 * lightTokens.lineHeight.body,
    textAlignVertical: 'top',
  },
})

export const createTextFieldTokenStyles = (tokens: A2uiTokens) => ({
  error: {
    color: tokens.color.error,
  },
  focused: {
    borderColor: tokens.color.primary,
  },
  host: {},
  input: {
    backgroundColor: tokens.color.input,
    borderColor: tokens.color.border,
    color: tokens.color.onInput,
  },
  invalid: {
    borderColor: tokens.color.error,
  },
  label: {
    color: tokens.color.onBackground,
  },
  longText: {},
})
