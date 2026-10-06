# React Native Component Structure

Follow this structure when writing React Native components.

## Template

```tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

// MARK: Variables + States

// Declare constants, hooks, and state variables here

const MyComponent = ({ prop1, prop2 }) => {
  // State declarations
  const [count, setCount] = useState(0)

  // MARK: Effects

  // useEffect, useLayoutEffect, etc.

  // MARK: Preparation

  // Styles, derived data, style variables
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  })

  // MARK: Renderers

  return <View style={styles.container}>{/* Component JSX */}</View>
}

export default MyComponent
```

## Rules

1. **Variables + States** - Declare constants, hooks, and state at the top of the component function body
2. **Effects** - Group all useEffect, useLayoutEffect, and other side effects under `// MARK: Effects`
3. **Preparation** - Define styles (StyleSheet.create), derived data, and any style-related variables under `// MARK: Preparation`
4. **Renderers** - Return JSX (or `null`) under `// MARK: Renderers`
