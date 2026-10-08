import { ChoicePickerApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import type { Option } from './types'
import { createComponentImplementation } from '../../../../adapter'
import { useA2uiTokens, useComponentStyles } from '../../../../styles'
import { lightTokens, type A2uiTokens } from '../../styles'

export const ChoicePicker = createComponentImplementation(
  ChoicePickerApi,
  ({ props }) => {
    // MARK: Variables + States

    const tokens = useA2uiTokens()

    const tokenStyles = useMemo(
      () => createChoicePickerTokenStyles(tokens),
      [tokens],
    )
    const styles = useComponentStyles(
      'ChoicePicker',
      choicePickerStyles,
      tokenStyles,
    )

    const [filter, setFilter] = useState('')

    const values: string[] = Array.isArray(props.value) ? props.value : []

    const options = ((props.options || []) as Option[]).filter(
      (opt) =>
        !props.filterable ||
        filter === '' ||
        String(opt.label).toLowerCase().includes(filter.toLowerCase()),
    )

    // Deviates from `@a2ui/react`, which tests `=== 'mutuallyExclusive'`:
    // web_core doesn't apply schema defaults, so an omitted variant would be
    // multi-select there, against the spec default of mutuallyExclusive
    const isMutuallyExclusive = props.variant !== 'multipleSelection'
    const isChips = props.displayStyle === 'chips'

    const onToggle = (val: string) => {
      if (isMutuallyExclusive) {
        props.setValue([val])
      } else {
        const newValues = values.includes(val)
          ? values.filter((v: string) => v !== val)
          : [...values, val]

        props.setValue(newValues)
      }
    }

    // MARK: Renderers

    return (
      <View style={styles.host}>
        {props.label ? <Text style={styles.label}>{props.label}</Text> : null}

        {props.filterable ? (
          <TextInput
            accessibilityLabel="Filter options"
            onChangeText={setFilter}
            placeholder="Filter options..."
            style={styles.filterInput}
            value={filter}
          />
        ) : null}

        <View
          accessibilityRole={isMutuallyExclusive ? 'radiogroup' : undefined}
          style={[styles.options, isChips && styles.chips]}
        >
          {options.map((opt, i) => {
            const isSelected = values.includes(opt.value)

            if (isChips) {
              return (
                <Pressable
                  key={i}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => onToggle(opt.value)}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                >
                  <Text
                    style={[
                      styles.chipLabel,
                      isSelected && styles.chipLabelSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              )
            }

            return (
              <Pressable
                key={i}
                accessibilityRole={isMutuallyExclusive ? 'radio' : 'checkbox'}
                accessibilityState={{ checked: isSelected }}
                onPress={() => onToggle(opt.value)}
                style={styles.optionLabel}
              >
                <View
                  style={[
                    styles.indicator,
                    isMutuallyExclusive && styles.indicatorRadio,
                    isSelected && styles.indicatorSelected,
                  ]}
                >
                  {isSelected ? (
                    <View
                      style={[
                        styles.indicatorChecked,
                        isMutuallyExclusive && styles.indicatorCheckedRadio,
                      ]}
                    />
                  ) : null}
                </View>

                <Text style={styles.optionText}>{opt.label}</Text>
              </Pressable>
            )
          })}
        </View>
      </View>
    )
  },
)

// MARK: Styles

export const choicePickerStyles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: lightTokens.spacing.m,
    paddingVertical: lightTokens.spacing.s,
  },
  chipLabel: {
    fontSize: lightTokens.fontSize.s,
  },
  chipLabelSelected: {},
  chipSelected: {},
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterInput: {
    borderRadius: lightTokens.spacing.m,
    borderWidth: lightTokens.borderWidth,
    marginBottom: lightTokens.spacing.s,
    padding: lightTokens.spacing.m,
  },
  host: {
    gap: lightTokens.spacing.s,
    width: '100%',
  },
  indicator: {
    alignItems: 'center',
    borderRadius: 2,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  indicatorChecked: {
    borderRadius: 1,
    height: 8,
    width: 8,
  },
  indicatorCheckedRadio: {
    borderRadius: 4,
  },
  indicatorRadio: {
    borderRadius: 8,
  },
  indicatorSelected: {},
  label: {
    fontSize: lightTokens.fontSize.s,
    fontWeight: 'bold',
  },
  optionLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: lightTokens.spacing.m,
  },
  optionText: {
    fontSize: lightTokens.fontSize.m,
  },
  options: {
    gap: lightTokens.spacing.s,
  },
})

export const createChoicePickerTokenStyles = (tokens: A2uiTokens) => ({
  chip: {
    backgroundColor: tokens.color.surface,
    borderColor: tokens.color.border,
  },
  chipLabel: {
    color: tokens.color.onSurface,
  },
  chipLabelSelected: {
    color: tokens.color.onPrimary,
  },
  chipSelected: {
    backgroundColor: tokens.color.primary,
    borderColor: tokens.color.primary,
  },
  chips: {},
  filterInput: {
    backgroundColor: tokens.color.input,
    borderColor: tokens.color.border,
    color: tokens.color.onInput,
  },
  host: {},
  indicator: {
    borderColor: tokens.color.border,
  },
  indicatorChecked: {
    backgroundColor: tokens.color.primary,
  },
  indicatorCheckedRadio: {},
  indicatorRadio: {},
  indicatorSelected: {
    borderColor: tokens.color.primary,
  },
  label: {
    color: tokens.color.onBackground,
  },
  optionLabel: {},
  optionText: {
    color: tokens.color.onBackground,
  },
  options: {},
})
