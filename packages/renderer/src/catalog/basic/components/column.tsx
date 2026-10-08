import { ColumnApi } from '@a2ui/web_core/v0_9/basic_catalog/api'
import { StyleSheet, View } from 'react-native'

import { createComponentImplementation } from '../../../adapter'
import { useComponentStyles } from '../../../styles/styles'
import { ChildList } from './child-list/child-list'
import { lightTokens, mapAlign, mapJustify, getWeightStyle } from '../styles'

export const Column = createComponentImplementation(
  ColumnApi,
  ({ props, buildChild, context }) => {
    // MARK: Variables + States

    const styles = useComponentStyles('Column', columnStyles)

    // MARK: Renderers

    return (
      <View
        style={[
          getWeightStyle(props.weight),
          styles.column,
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

export const columnStyles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    gap: lightTokens.spacing.m,
  },
})
