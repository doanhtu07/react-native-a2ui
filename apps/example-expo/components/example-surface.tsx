import { MessageProcessor, type ActionPayload } from '@a2ui/web_core'
import { useTheme } from 'expo-router'
import {
  A2uiSurface,
  basicCatalog,
  type ReactComponentImplementation,
} from '@the-a2ui/renderer'
import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import type { Example } from '@/examples'

const SURFACE_ID = 'example'

type Props = {
  example: Example
}

/** Renders one example as its own surface, with the last action it sent. */
export function ExampleSurface({ example }: Readonly<Props>) {
  const { colors } = useTheme()

  /*
    Built during render rather than in an effect: the surface is plain data
    derived from the example, and it lets StrictMode's second mount reuse it.
    Nothing to dispose; the processor holds no native resources.
  */
  const surface = useMemo(() => {
    const processor = new MessageProcessor<ReactComponentImplementation>([
      basicCatalog,
    ])

    processor.processMessages([
      {
        version: 'v0.9',
        createSurface: { surfaceId: SURFACE_ID, catalogId: basicCatalog.id },
      },
      {
        version: 'v0.9',
        updateComponents: {
          surfaceId: SURFACE_ID,
          components: example.components,
        },
      },
      {
        version: 'v0.9',
        updateDataModel: {
          surfaceId: SURFACE_ID,
          path: '/',
          value: example.data ?? {},
        },
      },
    ])

    return processor.getSurface(SURFACE_ID)
  }, [example])

  const [lastAction, setLastAction] = useState<ActionPayload>()

  // MARK: Effects

  useEffect(() => {
    const subscription = surface?.onAction.subscribe(setLastAction)

    return () => subscription?.unsubscribe()
  }, [surface])

  // MARK: Preparation

  const actionText = lastAction
    ? `${lastAction.name} ${JSON.stringify(lastAction.context)}`
    : undefined

  // MARK: Renderers

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {example.title}
        </Text>

        {example.description ? (
          <Text style={[styles.description, { color: colors.text }]}>
            {example.description}
          </Text>
        ) : null}
      </View>

      <View style={styles.surface}>
        {surface ? <A2uiSurface surface={surface} /> : null}
      </View>

      {actionText ? (
        <Text style={[styles.action, { color: colors.primary }]}>
          {`Action: ${actionText}`}
        </Text>
      ) : null}
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  action: {
    fontFamily: 'Menlo',
    fontSize: 12,
  },
  container: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
    padding: 12,
  },
  description: {
    fontSize: 13,
    opacity: 0.6,
  },
  header: {
    gap: 2,
  },
  surface: {
    minHeight: 24,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
})
