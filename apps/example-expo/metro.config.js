// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const { withA2ui } = require('@the-a2ui/renderer/metro')

module.exports = withA2ui(getDefaultConfig(__dirname))
