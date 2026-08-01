import { describe, test, expect } from 'vitest'
import { isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage } from '../../platforms/router.js'
import { getOriginalTampermonkey } from '../helpers/load-original-tampermonkey.js'

const oldTM = getOriginalTampermonkey()

const urlCases = [
  ['https://www.youtube.com/watch?v=abc123',           true,  true,  false],
  ['https://www.youtube.com/',                          true,  false, false],
  ['https://www.youtube.com/feed/trending',             true,  false, false],
  ['https://m.youtube.com/watch?v=abc123',              true,  true,  false],
  ['https://www.bilibili.com/video/BV1xx411c7mD',       false, false, true],
  ['https://www.bilibili.com/bangumi/play/ep123456',    false, false, true],
  ['https://www.bilibili.com/',                         false, false, false],
  ['https://accounts.youtube.com/login',                true,  false, false],
]

describe('router — URL 检测纯函数', () => {
  test.each(urlCases)('%s → %s', (url, expected) => {
    expect(isYoutubePage(url)).toBe(expected)
  })
})

describe('isYoutubeWatchPage', () => {
  test.each(urlCases)('%s → %s', (url, _1, expected) => {
    expect(isYoutubeWatchPage(url)).toBe(expected)
  })
})

describe('isBilibiliVideoPage', () => {
  test.each(urlCases)('%s → %s', (url, _1, _2, expected) => {
    expect(isBilibiliVideoPage(url)).toBe(expected)
  })
})

describe('URL 检测 — 旧版 TM 基础功能', () => {
  test('旧版 isYoutubePage 在 youtube.com 上返回 true', () => {
    expect(oldTM.isYoutubePage()).toBe(true)
  })
})

describe('URL 检测 — 新旧等价对比', () => {
  test.each(urlCases)('%s', (url, expYtPage, expYtWatch, expBili) => {
    const orig = oldTM._testHref.current
    oldTM._testHref.current = url
    try {
      expect(oldTM.isYoutubePage()).toBe(isYoutubePage(url))
      expect(oldTM.isYoutubeWatchPage()).toBe(isYoutubeWatchPage(url))
      expect(oldTM.isBilibiliVideoPage()).toBe(isBilibiliVideoPage(url))
    } finally {
      oldTM._testHref.current = orig
    }
  })
})
