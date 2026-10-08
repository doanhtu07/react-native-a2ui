import { ListApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { useCallback, type ReactElement } from 'react'
import {
  FlatList,
  StyleSheet,
  View,
  type ListRenderItemInfo,
} from 'react-native'

import { createComponentImplementation } from '../../../../adapter'
import { useComponentStyles } from '../../../../styles/styles'
import type { ListChildRef } from './types'
import { getWeightStyle, lightTokens, mapAlign } from '../../styles'

export const List = createComponentImplementation(
  ListApi,
  ({ props, buildChild }) => {
    // MARK: Variables + States

    const styles = useComponentStyles('List', listStyles)

    const isHorizontal = props.direction === 'horizontal'

    const data: ListChildRef[] = Array.isArray(props.children)
      ? props.children
      : []

    // MARK: Preparation

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<ListChildRef>) => {
        const node =
          typeof item === 'string'
            ? buildChild(item)
            : buildChild(item.id, item.basePath)

        return node as ReactElement | null
      },
      [buildChild],
    )

    const keyExtractor = useCallback((item: ListChildRef, index: number) => {
      if (typeof item === 'string') return `${item}-${index}`

      return `${item.id}-${item.basePath}-${index}`
    }, [])

    const Separator = useCallback(
      () => (
        <View
          style={
            isHorizontal ? styles.horizontalSeparator : styles.verticalSeparator
          }
        />
      ),
      [isHorizontal, styles],
    )

    // MARK: Renderers

    // `overflow: auto` in the list's direction: it scrolls once constrained.
    // Virtualized with FlatList; the agent contract stays `List`.
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={[
          styles.content,
          { alignItems: mapAlign(props.align) },
        ]}
        style={[getWeightStyle(props.weight), styles.list]}
        horizontal={isHorizontal}
        nestedScrollEnabled
      />
    )
  },
)

// MARK: Styles

export const listStyles = StyleSheet.create({
  content: {
    padding: 0,
  },
  horizontalSeparator: {
    width: lightTokens.spacing.s,
  },
  list: {
    flexShrink: 1,
  },
  verticalSeparator: {
    height: lightTokens.spacing.s,
  },
})
