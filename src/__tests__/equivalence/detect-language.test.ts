import { describe, test, expect } from 'bun:test'
import { t, detectLanguage } from '../../core/i18n.ts'

describe('detectLanguage', () => {
  const cases: Array<{ lang: string; expected: 'zh' | 'en' }> = [
    { lang: 'zh-CN', expected: 'zh' },
    { lang: 'zh-TW', expected: 'zh' },
    { lang: 'zh', expected: 'zh' },
    { lang: 'en-US', expected: 'en' },
    { lang: 'en', expected: 'en' },
    { lang: 'fr-FR', expected: 'en' },
    { lang: 'ja', expected: 'en' }
  ]

  for (const { lang, expected } of cases) {
    test(`${lang} → ${expected}`, () => {
      const originalNav = globalThis.navigator
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: { language: lang }
      })
      try {
        expect(detectLanguage()).toBe(expected)
      } finally {
        Object.defineProperty(globalThis, 'navigator', {
          configurable: true,
          value: originalNav
        })
      }
    })
  }
})

describe('t() i18n 查找', () => {
  const keys = [
    'Menu_Settings',
    'Menu_Save',
    'Menu_Close',
    'Youtube_Action_Rate',
    'Bilibili_Action_WebFullscreen'
  ]

  for (const lang of ['zh', 'en'] as const) {
    for (const key of keys) {
      test(`t("${key}", "${lang}") 返回非空文本`, () => {
        const result = t(key, lang)
        expect(result).toBeTruthy()
        expect(result).not.toBe(key)
      })
    }
  }

  test('不存在的 key 返回 key 本身', () => {
    expect(t('NonExistentKey', 'zh')).toBe('NonExistentKey')
  })
})
