import { TabsApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { tokens } from '../tokens'

export const Tabs = createComponentImplementation(
  TabsApi,
  ({ props, buildChild }) => {
    // MARK: Variables + States

    const styles = useComponentStyles('Tabs', tabsStyles)

    const [selectedIndex, setSelectedIndex] = useState(0)

    const tabs = props.tabs || []
    const activeTab = tabs[selectedIndex]

    // MARK: Renderers

    return (
      <View>
        <View accessibilityRole="tablist" style={styles.tabsHeaders}>
          {tabs.map((tab, i) => {
            const isActive = selectedIndex === i

            return (
              <Pressable
                key={i}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                onPress={() => setSelectedIndex(i)}
                style={[styles.tabsHeader, isActive && styles.tabsHeaderActive]}
              >
                <Text
                  style={[
                    styles.tabsHeaderLabel,
                    isActive && styles.tabsHeaderLabelActive,
                  ]}
                >
                  {tab.title as string}
                </Text>
              </Pressable>
            )
          })}
        </View>

        <View style={styles.content}>
          {activeTab ? buildChild(activeTab.child) : null}
        </View>
      </View>
    )
  },
)

// MARK: Styles

export const tabsStyles = StyleSheet.create({
  content: {
    paddingHorizontal: tokens.spacing.m,
  },
  tabsHeader: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: tokens.borderRadius,
    borderTopRightRadius: tokens.borderRadius,
    paddingHorizontal: tokens.spacing.l,
    paddingVertical: tokens.spacing.m,
  },
  tabsHeaderActive: {
    backgroundColor: tokens.color.secondary,
  },
  tabsHeaderLabel: {
    color: tokens.color.onSurface,
  },
  tabsHeaderLabelActive: {
    color: tokens.color.onSecondary,
  },
  tabsHeaders: {
    borderBottomColor: tokens.color.border,
    borderBottomWidth: tokens.borderWidth,
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    marginBottom: tokens.spacing.m,
  },
})
