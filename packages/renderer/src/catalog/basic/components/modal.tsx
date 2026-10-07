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
                  style={styles.close}
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
    flexShrink: 1,
  },
  close: {
    padding: tokens.spacing.xs,
  },
  closeLabel: {
    color: tokens.color.onSurface,
    fontSize: tokens.fontSize.xl,
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
