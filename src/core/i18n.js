import { i18n } from './i18n-constants.js';

export function t(key, lang = 'zh') {
  return i18n[lang]?.[key] || key;
}

export function detectLanguage() {
  let userLang = navigator.language.toLowerCase();
  if (userLang.startsWith("zh")) return "zh";
  if (userLang.startsWith("en")) return "en";
  return "en";
}
