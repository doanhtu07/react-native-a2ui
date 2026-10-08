import { ModalApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useCallback, useState } from 'react'
import {
  Pressable,
  Modal as RNModal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { tokens } from '../tokens'
import { TextColorProvider } from '../providers/text-color'
import { ModalTriggerProvider } from '../providers/modal-trigger'

const CLOSE_BUTTON_SIZE = 24

export const Modal = createComponentImplementation(
  ModalApi,
  ({ props, buildChild }) => {
    // MARK: Variables + States

    const styles = useComponentStyles('Modal', modalStyles)

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
    color: tokens.color.onSurface,
    fontSize: tokens.fontSize.xl,
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
    backgroundColor: tokens.color.surface,
    borderRadius: tokens.borderRadius,
    maxHeight: '90%',
    maxWidth: '90%',
    padding: tokens.spacing.l,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: tokens.color.overlay,
    flex: 1,
    justifyContent: 'center',
  },
  trigger: {
    alignSelf: 'flex-start',
  },
})
