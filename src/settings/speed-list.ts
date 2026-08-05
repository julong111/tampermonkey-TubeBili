import { i18n } from '../core/i18n-constants.js';

export interface SpeedListResult {
  valid: boolean
  speeds: string[]
  error: string
}

function speedListError(lang: string): string {
  return i18n[lang]?.["Menu_SpeedList_Error"] || "Menu_SpeedList_Error";
}

export function validateSpeedList(input: unknown, lang: string = 'en'): SpeedListResult {
  if (!input || typeof input !== "string") {
    return { valid: false, speeds: [], error: speedListError(lang) };
  }
  const parts = input.split(/[,，]/).map((s) => s.trim()).filter((s) => s !== "");
  if (parts.length === 0 || parts.length > 10) {
    return { valid: false, speeds: [], error: speedListError(lang) };
  }
  const speeds: string[] = [];
  for (const part of parts) {
    const regex = /^(\d+\.?\d{0,1}|\.\d{1})$/;
    if (!regex.test(part)) {
      return { valid: false, speeds: [], error: speedListError(lang) };
    }
    const num = parseFloat(part);
    if (num < 0.1 || num > 10) {
      return { valid: false, speeds: [], error: speedListError(lang) };
    }
    speeds.push(parseFloat(num.toFixed(1)).toString());
  }
  return { valid: true, speeds, error: "" };
}
