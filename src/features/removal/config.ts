import { gm } from '../../core/gm-api.js'
import { getSettingPanelItems } from '../../settings/store.js'

export interface RemovalItem {
  selector: string
  mode: 'remove' | 'hide'
}

export function getEnabledRemovalItems(removalItems: Record<string, RemovalItem>): RemovalItem[] {
  const settingPanelItems = getSettingPanelItems()
  const enabledItems: RemovalItem[] = []
  for (const key in removalItems) {
    const itemConfig = settingPanelItems[key]
    if (!itemConfig) continue
    const item = removalItems[key]
    if (!item) continue
    if (gm.getValue(itemConfig.enableKey, false)) {
      enabledItems.push(item)
    }
  }
  return enabledItems
}
