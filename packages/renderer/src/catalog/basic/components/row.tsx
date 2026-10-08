import { RowApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { StyleSheet, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { ChildList } from './child-list/child-list'
import { mapAlign, mapJustify, getWeightStyle, lightTokens } from '../styles'

export const Row = createComponentImplementation(
  RowApi,
  ({ props, buildChild, context }) => {
    // MARK: Variables + States

    const styles = useComponentStyles('Row', rowStyles)

    // MARK: Renderers

    return (
      <View
        style={[
          getWeightStyle(props.weight),
          styles.row,
          {
            alignItems: mapAlign(props.align),
            justifyContent: mapJustify(props.justify),
          },
        ]}
      >
        <ChildList
          childList={props.children}
          buildChild={buildChild}
          context={context}
        />
      </View>
    )
  },
)

// MARK: Styles

export const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: lightTokens.spacing.m,
  },
})
