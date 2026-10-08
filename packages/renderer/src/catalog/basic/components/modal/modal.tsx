import { ModalApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useCallback, useMemo, useState } from 'react'
import {
  Pressable,
  Modal as RNModal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { createComponentImplementation } from '../../../../adapter'
import { useComponentStyles } from '../../../../styles/styles'
import { useA2uiTokens } from '../../../../styles/tokens/tokens'
import { TextColorProvider } from '../../providers/text-color'
import { ModalTriggerProvider } from '../../providers/modal-trigger'
import { CLOSE_BUTTON_SIZE } from './constants'
import { lightTokens, type A2uiTokens } from '../../styles/tokens/tokens'

export const Modal = createComponentImplementation(
  ModalApi,
  ({ props, buildChild }) => {
    // MARK: Variables + States

    const tokens = useA2uiTokens()

    const tokenStyles = useMemo(() => createModalTokenStyles(tokens), [tokens])
    const styles = useComponentStyles('Modal', modalStyles, tokenStyles)

    const [isOpen, setIsOpen] = useState(false)

    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])

    // MARK: Renderers

    return (
      <>
        <ModalTriggerProvider value={open}>
          <Pressable onPress={open} style={styles.trigger}>
            {props.trigger ? buildChild(props.trigger) : null}
          </Pressable>
        </ModalTriggerProvider>

        <RNModal
          animationType="fade"
          onRequestClose={close}
          transparent
          visible={isOpen}
        >
          <Pressable onPress={close} style={styles.overlay}>
            {/* Swallows presses so they don't reach the overlay (stopPropagation) */}
            <Pressable onPress={() => {}} style={styles.dialog}>
              <View style={styles.closeRow}>
                <Pressable
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                  onPress={close}
                  style={({ pressed }) => {
                    return [styles.close, { opacity: pressed ? 0.6 : 1 }]
                  }}
                >
                  <Text style={styles.closeLabel}>×</Text>
                </Pressable>
              </View>

              <ScrollView style={styles.body}>
                <TextColorProvider value={tokens.color.onSurface}>
                  {props.content ? buildChild(props.content) : null}
                </TextColorProvider>
              </ScrollView>
            </Pressable>
          </Pressable>
        </RNModal>
      </>
    )
  },
)

// MARK: Styles

export const modalStyles = StyleSheet.create({
  body: {
    flexGrow: 0,
    flexShrink: 1,
  },
  close: {
    alignItems: 'center',
    height: CLOSE_BUTTON_SIZE,
    justifyContent: 'center',
    opacity: 1,
    padding: 0,
    width: CLOSE_BUTTON_SIZE,
  },
  closeLabel: {
    fontSize: lightTokens.fontSize.xl,
    includeFontPadding: false,
    lineHeight: CLOSE_BUTTON_SIZE,
    padding: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  closeRow: {
    alignItems: 'flex-end',
  },
  dialog: {
    borderRadius: lightTokens.borderRadius,
    maxHeight: '90%',
    maxWidth: '90%',
    padding: lightTokens.spacing.l,
  },
  overlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  trigger: {
    alignSelf: 'flex-start',
  },
})

export const createModalTokenStyles = (tokens: A2uiTokens) => ({
  body: {},
  close: {},
  closeLabel: {
    color: tokens.color.onSurface,
  },
  closeRow: {},
  dialog: {
    backgroundColor: tokens.color.surface,
  },
  overlay: {
    backgroundColor: tokens.color.overlay,
  },
  trigger: {},
})
