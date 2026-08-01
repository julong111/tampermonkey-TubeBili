import { describe, test, expect } from 'vitest'
import { t, detectLanguage } from '../../core/i18n.js'
import { getOriginalTampermonkey } from '../helpers/load-original-tampermonkey.js'
import { getOriginalUserscripts } from '../helpers/load-original-userscripts.js'

const oldTM = getOriginalTampermonkey()
const oldUS = getOriginalUserscripts()

describe('detectLanguage — 三版本等价', () => {
  const cases = [
    { lang: 'zh-CN', expected: 'zh' },
    { lang: 'zh-TW', expected: 'zh' },
    { lang: 'zh',    expected: 'zh' },
    { lang: 'en-US', expected: 'en' },
    { lang: 'en',    expected: 'en' },
    { lang: 'fr-FR', expected: 'en' },
    { lang: 'ja',    expected: 'en' },
  ]

  test.each(cases)('$lang → $expected', ({ lang, expected }) => {
    const navigator = { language: lang }
    const originalNav = globalThis.navigator
    globalThis.navigator = navigator
    try {
      const newResult = detectLanguage()
      expect(newResult).toBe(expected)
    } finally {
      globalThis.navigator = originalNav
    }
  })
})

describe('t() i18n 查找 — 新版与旧版等价', () => {
  const keys = [
    'Menu_Settings',
    'Menu_Save',
    'Menu_Close',
    'Youtube_Action_Rate',
    'Bilibili_Action_WebFullscreen',
  ]

  test.each(keys)('t("%s", "zh") 等价', (key) => {
    const origLang = oldTM.sys.currentLang
    oldTM.sys.currentLang = 'zh'
    oldUS.sys.currentLang = 'zh'
    try {
      const tmVal = oldTM.Common.geti18nText(key)
      const usVal = oldUS.Common.geti18nText(key)
      const newResult = t(key, 'zh')
      expect(newResult).toBe(tmVal)
      expect(newResult).toBe(usVal)
    } finally {
      oldTM.sys.currentLang = origLang
      oldUS.sys.currentLang = origLang
    }
  })

  test.each(keys)('t("%s", "en") 等价', (key) => {
    const origLang = oldTM.sys.currentLang
    oldTM.sys.currentLang = 'en'
    oldUS.sys.currentLang = 'en'
    try {
      const tmVal = oldTM.Common.geti18nText(key)
      const usVal = oldUS.Common.geti18nText(key)
      const newResult = t(key, 'en')
      expect(newResult).toBe(tmVal)
      expect(newResult).toBe(usVal)
    } finally {
      oldTM.sys.currentLang = origLang
      oldUS.sys.currentLang = origLang
    }
  })

  test('不存在的 key 返回 key 本身', () => {
    expect(t('NonExistentKey', 'zh')).toBe('NonExistentKey')
  })
})
