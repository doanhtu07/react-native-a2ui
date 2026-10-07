import { StyleSheet, Text } from 'react-native'

/** Stands in for a component that has not arrived, or has just been removed. */
export const LoadingPlaceholder: React.FC<{ componentId: string }> = ({
  componentId,
}) => {
  // MARK: Renderers

  return <Text style={styles.loading}>[Loading {componentId}...]</Text>
}

// MARK: Styles

const styles = StyleSheet.create({
  loading: {
    color: 'gray',
    padding: 4,
  },
})
