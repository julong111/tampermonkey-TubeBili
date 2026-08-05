import { gm } from '../core/gm-api.js'
import { detectLanguage } from '../core/i18n.js'
import { buildCatalog, type SettingItem } from './catalog.js'
import {
  shortcutSpeedListKey,
  buttonSpeedListKey,
  DEFAULT_SHORTCUT_SPEEDS,
  DEFAULT_BUTTON_SPEEDS,
  DEFAULT_SPEED
} from './speed-list-constants.js'
import { validateSpeedList } from './speed-list.js'

const settingsState = {
  shortcutSpeeds: [...DEFAULT_SHORTCUT_SPEEDS],
  buttonSpeeds: [...DEFAULT_BUTTON_SPEEDS],
  defaultSpeed: DEFAULT_SPEED,
  settingPanelItems: {} as Record<string, SettingItem>,
  currentLang: 'en' as 'zh' | 'en'
}

export function initSettings(url: string): void {
  settingsState.currentLang = detectLanguage()
  loadSpeedLists()
  settingsState.settingPanelItems = buildCatalog(url, settingsState.currentLang)
}

export function resetSettings(): void {
  settingsState.shortcutSpeeds = [...DEFAULT_SHORTCUT_SPEEDS]
  settingsState.buttonSpeeds = [...DEFAULT_BUTTON_SPEEDS]
  settingsState.defaultSpeed = DEFAULT_SPEED
  settingsState.settingPanelItems = {}
  settingsState.currentLang = 'en'
}

function loadSpeedLists(): void {
  const shortcutRaw = gm.getValue(shortcutSpeedListKey)
  if (shortcutRaw != null) {
    const result = validateSpeedList(shortcutRaw, settingsState.currentLang)
    if (result.valid) settingsState.shortcutSpeeds = result.speeds
  }
  const buttonRaw = gm.getValue(buttonSpeedListKey)
  if (buttonRaw != null) {
    const result = validateSpeedList(buttonRaw, settingsState.currentLang)
    if (result.valid) settingsState.buttonSpeeds = result.speeds
  }
}

export function getShortcutSpeeds(): string[] {
  return [...settingsState.shortcutSpeeds]
}

export function getButtonSpeeds(): string[] {
  return [...settingsState.buttonSpeeds]
}

export function getDefaultSpeed(): string {
  return settingsState.defaultSpeed
}

export function getSettingPanelItems(): Record<string, SettingItem> {
  return { ...settingsState.settingPanelItems }
}

export function getCurrentLang(): 'zh' | 'en' {
  return settingsState.currentLang
}

export function setSpeedLists(shortcutSpeeds: string[], buttonSpeeds?: string[]): void {
  settingsState.shortcutSpeeds = [...shortcutSpeeds]
  settingsState.buttonSpeeds = buttonSpeeds ? [...buttonSpeeds] : [...shortcutSpeeds]
}
