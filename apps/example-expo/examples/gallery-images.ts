import { Image } from 'react-native'

/**
 * Bundled gallery artwork as URI strings.
 *
 * The A2UI `Image` schema takes `url: string`, so `require(...)` handles
 * can't be passed through the payload. Resolving them here keeps the
 * examples fully offline (no VPN-sensitive remote fetches): in dev the URI
 * points at Metro on the LAN, in production builds it is a bundled
 * on-device asset.
 */
const uri = (module: number) => Image.resolveAssetSource(module).uri

export const galleryImages = {
  icon: uri(require('../assets/images/gallery/gallery-icon.png')),
  avatar: uri(require('../assets/images/gallery/gallery-avatar.png')),
  small: uri(require('../assets/images/gallery/gallery-small.png')),
  medium: uri(require('../assets/images/gallery/gallery-medium.png')),
  large: uri(require('../assets/images/gallery/gallery-large.png')),
  header: uri(require('../assets/images/gallery/gallery-header.png')),
  fit: uri(require('../assets/images/gallery/gallery-fit.png')),
  card: uri(require('../assets/images/gallery/gallery-card.png')),
}
