import { gm } from '../../core/gm-api.js';
import { getSettingPanelItems } from '../../settings/store.js';

export function getEnabledRemovalItems(removalItems) {
  const settingPanelItems = getSettingPanelItems();
  const enabledItems = [];
  for (const key in removalItems) {
    const itemConfig = settingPanelItems[key];
    if (!itemConfig) continue;
    if (gm.getValue(itemConfig.enableKey, false)) {
      enabledItems.push(removalItems[key]);
    }
  }
  return enabledItems;
}
