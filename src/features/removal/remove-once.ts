import { waitElement } from '../../core/element-getter.js'
import { getEnabledRemovalItems, type RemovalItem } from './config.js'

export function initYouTubeElementRemover(removalItems: Record<string, RemovalItem>): void {
  const enabledItems = getEnabledRemovalItems(removalItems)
  for (const item of enabledItems) {
    waitElement(item.selector).then((element) => {
      if (item.mode === 'hide') {
        const el = element as HTMLElement
        el.style.width = '0'
        el.style.overflow = 'hidden'
        el.style.flexShrink = '0'
      } else {
        element.remove()
      }
    })
  }
}
