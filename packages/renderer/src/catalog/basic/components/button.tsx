import { ButtonApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { Pressable, StyleSheet } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { tokens } from '../tokens'
import { TextColorProvider } from '../providers/text-color'
import { useModalTrigger } from '../providers/modal-trigger'

export const Button = createComponentImplementation(
  ButtonApi,
  ({ props, buildChild }) => {
    // MARK: Variables + States

    const styles = useComponentStyles('Button', buttonStyles)

    const openModal = useModalTrigger()

    const onPress = () => {
      props.action?.()

      // A click inside a Modal trigger bubbles up to it on the web
      openModal?.()
    }

    // MARK: Preparation

    const isPrimary = props.variant === 'primary'
    const isBorderless = props.variant === 'borderless'
    const isDisabled = props.isValid === false

    let textColor: string = tokens.color.onSecondary
    if (isPrimary) {
      textColor = tokens.color.onPrimary
    } else if (isBorderless) {
      textColor = tokens.color.primary
    }

    // MARK: Renderers

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        disabled={isDisabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          pressed && !isBorderless && styles.buttonPressed,
          isPrimary && styles.primary,
          pressed && isPrimary && styles.primaryPressed,
          isBorderless && styles.borderless,
          isDisabled && styles.disabled,
        ]}
      >
        <TextColorProvider value={textColor}>
          {props.child ? buildChild(props.child) : null}
        </TextColorProvider>
      </Pressable>
    )
  },
)

// MARK: Styles

export const buttonStyles = StyleSheet.create({
  borderless: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: tokens.borderWidth,
    paddingHorizontal: tokens.spacing.m,
    paddingVertical: tokens.spacing.m,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: tokens.color.surface,
    borderColor: tokens.color.border,
    borderRadius: tokens.borderRadius,
    borderWidth: tokens.borderWidth,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.l,
    paddingVertical: tokens.spacing.m,
  },
  // `:hover` on the web; the pressed state on touch screens
  buttonPressed: {
    backgroundColor: tokens.color.secondaryHover,
  },
  disabled: {
    opacity: 0.6,
  },
  primary: {
    backgroundColor: tokens.color.primary,
    borderColor: tokens.color.primary,
    borderWidth: tokens.borderWidth,
  },
  primaryPressed: {
    backgroundColor: tokens.color.primaryHover,
    borderColor: tokens.color.primaryHover,
  },
})
