import { gm } from '../core/gm-api.js';
import { detectLanguage } from '../core/i18n.js';
import { buildCatalog } from './catalog.js';
import {
  shortcutSpeedListKey,
  buttonSpeedListKey,
  DEFAULT_SHORTCUT_SPEEDS,
  DEFAULT_BUTTON_SPEEDS,
  DEFAULT_SPEED
} from './speed-list-constants.js';
import { validateSpeedList } from './speed-list.js';

const settingsState = {
  shortcutSpeeds: [...DEFAULT_SHORTCUT_SPEEDS],
  buttonSpeeds: [...DEFAULT_BUTTON_SPEEDS],
  defaultSpeed: DEFAULT_SPEED,
  settingPanelItems: {},
  currentLang: 'en'
};

export function initSettings(url) {
  settingsState.currentLang = detectLanguage();
  loadSpeedLists();
  settingsState.settingPanelItems = buildCatalog(url, settingsState.currentLang);
}

function loadSpeedLists() {
  const shortcutRaw = gm.getValue(shortcutSpeedListKey);
  if (shortcutRaw != null) {
    const result = validateSpeedList(shortcutRaw, settingsState.currentLang);
    if (result.valid) settingsState.shortcutSpeeds = result.speeds;
  }
  const buttonRaw = gm.getValue(buttonSpeedListKey);
  if (buttonRaw != null) {
    const result = validateSpeedList(buttonRaw, settingsState.currentLang);
    if (result.valid) settingsState.buttonSpeeds = result.speeds;
  }
}

export function getShortcutSpeeds() {
  return [...settingsState.shortcutSpeeds];
}

export function getButtonSpeeds() {
  return [...settingsState.buttonSpeeds];
}

export function getDefaultSpeed() {
  return settingsState.defaultSpeed;
}

export function getSettingPanelItems() {
  return { ...settingsState.settingPanelItems };
}

export function getCurrentLang() {
  return settingsState.currentLang;
}

export function setSpeedLists(shortcutSpeeds, buttonSpeeds) {
  settingsState.shortcutSpeeds = [...shortcutSpeeds];
  settingsState.buttonSpeeds = buttonSpeeds ? [...buttonSpeeds] : [...shortcutSpeeds];
}
