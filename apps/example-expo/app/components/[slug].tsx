import { Stack, useLocalSearchParams, useTheme } from 'expo-router'
import { useCallback } from 'react'
import { FlatList, StyleSheet, Text } from 'react-native'

import { ExampleSurface } from '@/components/example-surface'
import { findGallery, type Example } from '@/examples'

/** One component's gallery: each of its examples on its own surface. */
export default function ComponentScreen() {
  // MARK: Variables + States

  const { slug } = useLocalSearchParams<{ slug: string }>()
  const { colors } = useTheme()

  const gallery = findGallery(slug)

  // MARK: Renderers

  // FlatList-backed container: A2UI `List` renders on RN `FlatList`, and a
  // virtualized list must never sit inside a plain ScrollView of the same
  // orientation, so the page itself is virtualized too.
  const renderExample = useCallback(
    ({ item }: { item: Example }) => <ExampleSurface example={item} />,
    [],
  )

  if (!gallery) {
    return (
      <Text style={[styles.missing, { color: colors.text }]}>
        {`No component named "${slug}"`}
      </Text>
    )
  }

  return (
    <>
      <Stack.Screen options={{ title: gallery.name }} />

      <FlatList
        data={gallery.examples}
        keyExtractor={(item) => item.title}
        renderItem={renderExample}
        ListHeaderComponent={
          <Text style={[styles.summary, { color: colors.text }]}>
            {gallery.summary}
          </Text>
        }
        style={styles.root}
        contentContainerStyle={styles.contentContainer}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      />
    </>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  contentContainer: {
    gap: 16,
    padding: 16,
    paddingBottom: 64,
  },
  missing: {
    padding: 16,
  },
  root: {
    flex: 1,
  },
  summary: {
    fontSize: 14,
    opacity: 0.7,
  },
})
