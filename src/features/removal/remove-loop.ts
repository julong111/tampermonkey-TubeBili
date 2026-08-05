import { getEnabledRemovalItems, type RemovalItem } from './config.js'

export const BILIBILI_REMOVAL_INTERVAL = 1000

export function initBilibiliElementRemover(
  removalItems: Record<string, RemovalItem>,
  bilibiliSelectors: { playerContainer: string; webscreenClass: string }
): ReturnType<typeof setInterval> {
  const enabledItems = getEnabledRemovalItems(removalItems)
  return setInterval(() => {
    const playerEl = document.querySelector(bilibiliSelectors.playerContainer)
    if (!playerEl) return
    const isWebFullScreen = (playerEl as HTMLElement).classList.contains(bilibiliSelectors.webscreenClass)
    for (const item of enabledItems) {
      const element = document.querySelector(item.selector)
      if (!element) continue
      if (item.mode === 'remove') {
        element.remove()
      } else {
        const el = element as HTMLElement
        if (isWebFullScreen) {
          el.style.width = '0'
        } else {
          el.style.width = ''
        }
      }
    }
  }, BILIBILI_REMOVAL_INTERVAL)
}
