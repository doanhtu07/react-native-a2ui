import { Stack, useLocalSearchParams, useTheme } from 'expo-router'
import { ScrollView, StyleSheet, Text } from 'react-native'

import { ExampleSurface } from '@/components/example-surface'
import { findGallery } from '@/examples'

/** One component's gallery: each of its examples on its own surface. */
export default function ComponentScreen() {
  // MARK: Variables + States

  const { slug } = useLocalSearchParams<{ slug: string }>()
  const { colors } = useTheme()

  const gallery = findGallery(slug)

  // MARK: Renderers

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

      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.contentContainer}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.summary, { color: colors.text }]}>
          {gallery.summary}
        </Text>

        {gallery.examples.map((example) => (
          <ExampleSurface key={example.title} example={example} />
        ))}
      </ScrollView>
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
