import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import { useRouter, useTheme } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { galleries } from '@/examples'

export default function Index() {
  // MARK: Variables + States

  const { colors } = useTheme()
  const router = useRouter()

  // MARK: Renderers

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={[styles.intro, { color: colors.text }]}>
        One screen per basic catalog component. Use the header button to switch
        between system, light and dark.
      </Text>

      <View
        style={[
          styles.list,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {galleries.map((gallery, index) => (
          <Pressable
            key={gallery.slug}
            onPress={() =>
              router.push({
                pathname: '/components/[slug]',
                params: { slug: gallery.slug },
              })
            }
            style={({ pressed }) => [
              styles.item,
              index > 0 && {
                borderTopColor: colors.border,
                borderTopWidth: StyleSheet.hairlineWidth,
              },
              pressed && styles.itemPressed,
            ]}
          >
            <View style={styles.itemText}>
              <Text style={[styles.itemName, { color: colors.text }]}>
                {gallery.name}
              </Text>

              <Text style={[styles.itemSummary, { color: colors.text }]}>
                {gallery.summary}
              </Text>
            </View>

            <MaterialDesignIcons
              color={colors.text}
              name="chevron-right"
              size={22}
              style={styles.chevron}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  chevron: {
    opacity: 0.4,
  },
  contentContainer: {
    gap: 16,
    padding: 16,
    paddingBottom: 64,
  },
  intro: {
    fontSize: 14,
    opacity: 0.7,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPressed: {
    opacity: 0.6,
  },
  itemSummary: {
    fontSize: 13,
    opacity: 0.6,
  },
  itemText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  list: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  root: {
    flex: 1,
  },
})
