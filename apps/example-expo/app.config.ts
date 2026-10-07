import type { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
  name: 'rn-a2ui',
  slug: 'rn-a2ui',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'rna2ui',
  userInterfaceStyle: 'automatic',
  platforms: ['ios', 'android'],
  ios: {
    bundleIdentifier: 'com.rna2ui',
    supportsTablet: true,
  },
  android: {
    package: 'com.rna2ui.exampleexpo',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    'expo-font',
    'expo-web-browser',
    'expo-image',
    'expo-status-bar',

    '@react-native-vector-icons/ant-design',
    '@react-native-vector-icons/material-design-icons',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
}

export default config
