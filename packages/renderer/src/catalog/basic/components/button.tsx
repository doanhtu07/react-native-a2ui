import { ButtonApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useMemo } from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { useA2uiTokens } from '../../../styles/tokens/tokens'
import { TextColorProvider } from '../providers/text-color'
import { useModalTrigger } from '../providers/modal-trigger'
import { lightTokens, type A2uiTokens } from '../styles'

export const Button = createComponentImplementation(
  ButtonApi,
  ({ props, buildChild }) => {
    // MARK: Variables + States

    const tokens = useA2uiTokens()
    const tokenStyles = useMemo(() => createButtonTokenStyles(tokens), [tokens])
    const styles = useComponentStyles('Button', buttonStyles, tokenStyles)

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
          pressed && isBorderless && styles.borderlessPressed,
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
    borderWidth: lightTokens.borderWidth,
    paddingHorizontal: lightTokens.spacing.m,
    paddingVertical: lightTokens.spacing.m,
  },
  borderlessPressed: {
    opacity: 0.6,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: lightTokens.borderRadius,
    borderWidth: lightTokens.borderWidth,
    justifyContent: 'center',
    paddingHorizontal: lightTokens.spacing.l,
    paddingVertical: lightTokens.spacing.m,
  },
  buttonPressed: {},
  disabled: {
    opacity: 0.6,
  },
  primary: {
    borderWidth: lightTokens.borderWidth,
  },
  primaryPressed: {},
})

/**
 * Theme colors, resolved at render from `useA2uiTokens()`. Plain objects —
 * never `StyleSheet.create` — merged between the static sheet and the
 * host's `styles` overrides, so deeper restyles win.
 */
export const createButtonTokenStyles = (tokens: A2uiTokens) => ({
  borderless: {},
  borderlessPressed: {},
  button: {
    backgroundColor: tokens.color.surface,
    borderColor: tokens.color.border,
  },
  buttonPressed: {
    backgroundColor: tokens.color.secondaryHover,
  },
  disabled: {},
  primary: {
    backgroundColor: tokens.color.primary,
    borderColor: tokens.color.primary,
  },
  primaryPressed: {
    backgroundColor: tokens.color.primaryHover,
    borderColor: tokens.color.primaryHover,
  },
})
