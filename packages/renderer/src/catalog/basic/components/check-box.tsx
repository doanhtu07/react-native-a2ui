import { CheckBoxApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { StyleSheet, Switch, Text, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { tokens } from '../tokens'

/**
 * React Native core has no checkbox; the spec allows "a native checkbox or
 * toggle switch", so this uses `Switch`.
 */
export const CheckBox = createComponentImplementation(
  CheckBoxApi,
  ({ props }) => {
    // MARK: Variables + States

    const styles = useComponentStyles('CheckBox', checkBoxStyles)

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
    margin: tokens.spacing.m,
  },
  error: {
    color: tokens.color.error,
    fontSize: tokens.fontSize.xs,
    marginTop: 4,
  },
  label: {
    color: tokens.color.onSurface,
    fontSize: tokens.fontSize.s,
    fontWeight: 'bold',
  },
  labelError: {
    color: tokens.color.error,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.m,
  },
})
