/**
 * Metro helper for `@the-a2ui/renderer`.
 *
 * The renderer imports web_core's basic catalog from Lit-free files that
 * web_core's `exports` map doesn't expose yet. `withA2ui` resolves those
 * subpaths to the files directly, so the bundle never pulls in Lit.
 *
 * ```js
 * // metro.config.js
 * const { getDefaultConfig } = require('expo/metro-config')
 * const { withA2ui } = require('@the-a2ui/renderer/metro')
 *
 * module.exports = withA2ui(getDefaultConfig(__dirname))
 * ```
 */

const fs = require('node:fs')
const path = require('node:path')

/** Lit-free modules web_core's `exports` map doesn't expose yet. */
const VIRTUAL_SUBPATHS = {
  '@a2ui/web_core/v0_9/basic_catalog/api':
    'v0_9/basic_catalog/components/basic_components.js',
  '@a2ui/web_core/v0_9/basic_catalog/functions':
    'v0_9/basic_catalog/functions/basic_functions.js',
  '@a2ui/web_core/v0_9/basic_catalog/theme': 'v0_9/basic_catalog/theme.js',
}

/** Maps each virtual subpath to its file in the installed web_core. */
function resolveA2uiSubpaths(projectRoot) {
  const webCoreSrc = path.dirname(
    require.resolve('@a2ui/web_core', { paths: [projectRoot] }),
  )

  return Object.fromEntries(
    Object.entries(VIRTUAL_SUBPATHS).map(([subpath, file]) => {
      const filePath = path.join(webCoreSrc, file)

      // Fail when Metro starts, not with a vague bundle error
      if (!fs.existsSync(filePath)) {
        throw new Error(
          `@the-a2ui/renderer: ${file} not found in @a2ui/web_core. ` +
            'This web_core version is not supported; check the peer dependency range.',
        )
      }

      return [subpath, filePath]
    }),
  )
}

/** Wraps a Metro config so the renderer's web_core subpaths resolve. */
function withA2ui(config) {
  const subpaths = resolveA2uiSubpaths(config.projectRoot ?? process.cwd())
  const upstream = config.resolver?.resolveRequest

  return {
    ...config,
    resolver: {
      ...config.resolver,
      resolveRequest(context, moduleName, platform) {
        const filePath = subpaths[moduleName]

        if (filePath) {
          return { type: 'sourceFile', filePath }
        }

        return (upstream ?? context.resolveRequest)(
          context,
          moduleName,
          platform,
        )
      },
    },
  }
}

module.exports = { withA2ui, resolveA2uiSubpaths, VIRTUAL_SUBPATHS }
