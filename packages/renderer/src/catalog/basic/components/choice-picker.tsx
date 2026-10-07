import { ChoicePickerApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { tokens } from '../tokens'

// MARK: Variables + States

type _Option = { label: string; value: string }

export const ChoicePicker = createComponentImplementation(
  ChoicePickerApi,
  ({ props }) => {
    // MARK: Variables + States

    const styles = useComponentStyles('ChoicePicker', choicePickerStyles)

    const [filter, setFilter] = useState('')

    const values: string[] = Array.isArray(props.value) ? props.value : []

    const options = ((props.options || []) as _Option[]).filter(
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
    backgroundColor: tokens.color.surface,
    borderColor: tokens.color.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: tokens.spacing.m,
    paddingVertical: tokens.spacing.s,
  },
  chipLabel: {
    color: tokens.color.onSurface,
    fontSize: tokens.fontSize.xs,
  },
  chipLabelSelected: {
    color: tokens.color.onPrimary,
  },
  chipSelected: {
    backgroundColor: tokens.color.primary,
    borderColor: tokens.color.primary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterInput: {
    backgroundColor: tokens.color.input,
    borderColor: tokens.color.border,
    borderRadius: tokens.spacing.m,
    borderWidth: tokens.borderWidth,
    color: tokens.color.onInput,
    paddingHorizontal: tokens.spacing.s,
    paddingVertical: tokens.spacing.xs,
  },
  host: {
    gap: tokens.spacing.s,
    width: '100%',
  },
  // Radio buttons are round, checkboxes square, as the browser draws them
  indicator: {
    alignItems: 'center',
    borderColor: tokens.color.border,
    borderRadius: 2,
    borderWidth: 1,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  indicatorRadio: {
    borderRadius: 8,
  },
  indicatorChecked: {
    backgroundColor: tokens.color.primary,
    borderRadius: 1,
    height: 8,
    width: 8,
  },
  indicatorCheckedRadio: {
    borderRadius: 4,
  },
  indicatorSelected: {
    borderColor: tokens.color.primary,
  },
  label: {
    color: tokens.color.onBackground,
    fontSize: tokens.fontSize.s,
    fontWeight: 'bold',
  },
  optionLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.xs,
  },
  optionText: {
    color: tokens.color.onBackground,
    fontSize: tokens.fontSize.m,
  },
  options: {
    gap: tokens.spacing.xs,
  },
})
