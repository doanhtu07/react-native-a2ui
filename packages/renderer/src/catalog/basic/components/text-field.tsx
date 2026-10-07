import { TextFieldApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { tokens } from '../tokens'

export const TextField = createComponentImplementation(
  TextFieldApi,
  ({ props }) => {
    // MARK: Variables + States

    const styles = useComponentStyles('TextField', textFieldStyles)

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
    color: tokens.color.error,
    fontSize: tokens.fontSize.xs,
  },
  focused: {
    borderColor: tokens.color.primary,
  },
  host: {
    gap: tokens.spacing.xs,
    width: '100%',
  },
  input: {
    backgroundColor: tokens.color.input,
    borderColor: tokens.color.border,
    borderRadius: tokens.spacing.m,
    borderWidth: tokens.borderWidth,
    color: tokens.color.onInput,
    padding: tokens.spacing.m,
    width: '100%',
  },
  invalid: {
    borderColor: tokens.color.error,
  },
  label: {
    color: tokens.color.onBackground,
    fontSize: tokens.fontSize.s,
    fontWeight: 'bold',
  },
  // A `<textarea>`'s default two rows
  longText: {
    minHeight: tokens.fontSize.m * 2 * tokens.lineHeight.body,
    textAlignVertical: 'top',
  },
})
