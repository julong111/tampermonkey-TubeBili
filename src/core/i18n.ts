import { i18n } from './i18n-constants.js';

export function t(key: string, lang: string = 'zh'): string {
  return i18n[lang]?.[key] || key;
}

export function detectLanguage(): 'zh' | 'en' {
  let userLang = navigator.language.toLowerCase();
  if (userLang.startsWith("zh")) return "zh";
  if (userLang.startsWith("en")) return "en";
  return "en";
}
