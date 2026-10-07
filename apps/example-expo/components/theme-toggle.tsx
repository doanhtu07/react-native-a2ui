import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import { useTheme } from 'expo-router'
import { useState } from 'react'
import { Appearance, Pressable, StyleSheet } from 'react-native'

type ThemeMode = 'system' | 'light' | 'dark'

const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

const ICONS = {
  system: 'theme-light-dark',
  light: 'weather-sunny',
  dark: 'weather-night',
} as const

/** Header button cycling the app's color scheme: system → light → dark. */
export function ThemeToggle() {
  const { colors } = useTheme()

  const [mode, setMode] = useState<ThemeMode>('system')

  const onPress = () => {
    const next = NEXT_MODE[mode]
    setMode(next)
    Appearance.setColorScheme(next === 'system' ? 'unspecified' : next)
  }

  // MARK: Renderers

  return (
    <Pressable
      accessibilityLabel={`Theme: ${mode}. Tap to switch.`}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={styles.button}
    >
      <MaterialDesignIcons color={colors.text} name={ICONS[mode]} size={22} />
    </Pressable>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
})
