import '@the-polyfills/random-uuid'

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'

import { ThemeToggle } from '@/components/theme-toggle'
import { useCallback } from 'react'

export default function RootLayout() {
  // MARK: Variables + States

  const colorScheme = useColorScheme()

  // MARK: Renderers

  const renderHeaderRight = useCallback(() => <ThemeToggle />, [])

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerRight: renderHeaderRight }}>
        <Stack.Screen name="index" options={{ title: 'A2UI Gallery' }} />
        <Stack.Screen name="components/[slug]" />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
