import { getEnabledRemovalItems } from './config.js';

export const BILIBILI_REMOVAL_INTERVAL = 1000;

export function initBilibiliElementRemover(removalItems, bilibiliSelectors) {
  const enabledItems = getEnabledRemovalItems(removalItems);
  return setInterval(() => {
    const playerEl = document.querySelector(bilibiliSelectors.playerContainer);
    if (!playerEl) return;
    const isWebFullScreen = playerEl.classList.contains(bilibiliSelectors.webscreenClass);
    for (const item of enabledItems) {
      const element = document.querySelector(item.selector);
      if (!element) continue;
      if (item.mode === "remove") {
        element.remove();
      } else {
        if (isWebFullScreen) {
          element.style.width = "0";
        } else {
          element.style.width = "";
        }
      }
    }
  }, BILIBILI_REMOVAL_INTERVAL);
}
