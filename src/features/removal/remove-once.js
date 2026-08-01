import { waitElement } from '../../core/element-getter.js';
import { getEnabledRemovalItems } from './config.js';

export function initYouTubeElementRemover(removalItems) {
  const enabledItems = getEnabledRemovalItems(removalItems);
  for (const item of enabledItems) {
    waitElement(item.selector).then((element) => {
      if (item.mode === "hide") {
        element.style.width = "0";
        element.style.overflow = "hidden";
        element.style.flexShrink = "0";
      } else {
        element.remove();
      }
    });
  }
}
