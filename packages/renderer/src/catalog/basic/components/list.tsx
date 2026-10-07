import { ListApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { ScrollView, StyleSheet } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { tokens } from '../tokens'
import { mapAlign } from '../utils'
import { ChildList } from './child-list'

export const List = createComponentImplementation(
  ListApi,
  ({ props, buildChild, context }) => {
    // MARK: Variables + States

    const styles = useComponentStyles('List', listStyles)

    const isHorizontal = props.direction === 'horizontal'

    // MARK: Renderers

    // `overflow: auto` in the list's direction: it scrolls once constrained
    return (
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            alignItems: mapAlign(props.align),
            flexDirection: isHorizontal ? 'row' : 'column',
          },
        ]}
        horizontal={isHorizontal}
        nestedScrollEnabled
      >
        <ChildList
          childList={props.children}
          buildChild={buildChild}
          context={context}
        />
      </ScrollView>
    )
  },
)

// MARK: Styles

export const listStyles = StyleSheet.create({
  content: {
    gap: tokens.spacing.s,
    padding: 0,
  },
})
