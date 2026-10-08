import { CheckBoxApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useMemo } from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { useA2uiTokens } from '../../../styles/tokens/tokens'
import { lightTokens, type A2uiTokens } from '../styles/tokens/tokens'

/**
 * React Native core has no checkbox; the spec allows "a native checkbox or
 * toggle switch", so this uses `Switch`.
 */
export const CheckBox = createComponentImplementation(
  CheckBoxApi,
  ({ props }) => {
    // MARK: Variables + States

    const tokens = useA2uiTokens()

    const tokenStyles = useMemo(
      () => createCheckBoxTokenStyles(tokens),
      [tokens],
    )

    const styles = useComponentStyles('CheckBox', checkBoxStyles, tokenStyles)

    const hasError = props.validationErrors && props.validationErrors.length > 0

    // MARK: Renderers

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Switch
            accessibilityLabel={props.label || undefined}
            onValueChange={(checked) => props.setValue(checked)}
            trackColor={{ true: tokens.color.primary }}
            value={!!props.value}
          />

          {props.label ? (
            <Text style={[styles.label, hasError && styles.labelError]}>
              {props.label}
            </Text>
          ) : null}
        </View>

        {hasError ? (
          <Text style={styles.error}>{props.validationErrors?.[0]}</Text>
        ) : null}
      </View>
    )
  },
)

// MARK: Styles

export const checkBoxStyles = StyleSheet.create({
  container: {
    margin: lightTokens.spacing.m,
  },
  error: {
    fontSize: lightTokens.fontSize.xs,
    marginTop: 4,
  },
  label: {
    fontSize: lightTokens.fontSize.s,
    fontWeight: 'bold',
  },
  labelError: {},
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: lightTokens.spacing.m,
  },
})

export const createCheckBoxTokenStyles = (tokens: A2uiTokens) => ({
  container: {},
  error: {
    color: tokens.color.error,
  },
  label: {
    color: tokens.color.onSurface,
  },
  labelError: {
    color: tokens.color.error,
  },
  row: {},
})
