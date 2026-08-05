import { describe, test, expect } from 'bun:test'
import { isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage } from '../../platforms/router.ts'

const urlCases: Array<[string, boolean, boolean, boolean]> = [
  ['https://www.youtube.com/watch?v=abc123', true, true, false],
  ['https://www.youtube.com/', true, false, false],
  ['https://www.youtube.com/feed/trending', true, false, false],
  ['https://m.youtube.com/watch?v=abc123', true, true, false],
  ['https://www.bilibili.com/video/BV1xx411c7mD', false, false, true],
  ['https://www.bilibili.com/bangumi/play/ep123456', false, false, true],
  ['https://www.bilibili.com/', false, false, false],
  ['https://accounts.youtube.com/login', true, false, false]
]

describe('router — URL 检测纯函数', () => {
  for (const [url, ytPage, ytWatch, bili] of urlCases) {
    test(`${url}`, () => {
      expect(isYoutubePage(url)).toBe(ytPage)
      expect(isYoutubeWatchPage(url)).toBe(ytWatch)
      expect(isBilibiliVideoPage(url)).toBe(bili)
    })
  }
})
