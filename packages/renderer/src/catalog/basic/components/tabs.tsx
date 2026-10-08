import { TabsApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { useA2uiTokens } from '../../../styles/tokens/tokens'
import { lightTokens, type A2uiTokens } from '../styles'

export const Tabs = createComponentImplementation(
  TabsApi,
  ({ props, buildChild }) => {
    // MARK: Variables + States

    const tokens = useA2uiTokens()
    const tokenStyles = useMemo(() => createTabsTokenStyles(tokens), [tokens])
    const styles = useComponentStyles('Tabs', tabsStyles, tokenStyles)

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
    paddingHorizontal: lightTokens.spacing.m,
  },
  tabsHeader: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: lightTokens.borderRadius,
    borderTopRightRadius: lightTokens.borderRadius,
    paddingHorizontal: lightTokens.spacing.l,
    paddingVertical: lightTokens.spacing.m,
  },
  tabsHeaderActive: {},
  tabsHeaderLabel: {},
  tabsHeaderLabelActive: {},
  tabsHeaders: {
    borderBottomWidth: lightTokens.borderWidth,
    flexDirection: 'row',
    gap: lightTokens.spacing.xs,
    marginBottom: lightTokens.spacing.m,
  },
})

export const createTabsTokenStyles = (tokens: A2uiTokens) => ({
  content: {},
  tabsHeader: {},
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
  },
})
