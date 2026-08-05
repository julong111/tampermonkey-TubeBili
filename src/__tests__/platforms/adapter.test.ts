// src/__tests__/platforms/adapter.test.ts
import { describe, test, expect } from 'bun:test'
import { definePlatformAdapter } from '../../platforms/adapter.ts'
import { youtubeAdapter } from '../../platforms/youtube.ts'
import { bilibiliAdapter } from '../../platforms/bilibili.ts'
import type { PlatformAdapter } from '../../platforms/adapter.ts'

describe('definePlatformAdapter — 契约校验', () => {
  test('缺少必需键时抛错', () => {
    expect(() => definePlatformAdapter({ id: 'x' } as unknown as PlatformAdapter)).toThrow('missing')
  })

  test('返回冻结对象', () => {
    const adapter = definePlatformAdapter({
      id: 't', matches: () => true, isWatchPage: () => false, init: () => {}, onPage: () => {}, cleanup: () => {}
    })
    expect(Object.isFrozen(adapter)).toBe(true)
  })
})

describe('youtubeAdapter', () => {
  test('matches 识别 YouTube 站点', () => {
    expect(youtubeAdapter.matches('https://www.youtube.com/')).toBe(true)
    expect(youtubeAdapter.matches('https://www.bilibili.com/video/BV1xx')).toBe(false)
  })

  test('isWatchPage 仅 watch 页', () => {
    expect(youtubeAdapter.isWatchPage('https://www.youtube.com/watch?v=abc')).toBe(true)
    expect(youtubeAdapter.isWatchPage('https://www.youtube.com/feed/trending')).toBe(false)
  })
})

describe('bilibiliAdapter', () => {
  test('matches 识别 Bilibili 视频页', () => {
    expect(bilibiliAdapter.matches('https://www.bilibili.com/video/BV1xx')).toBe(true)
    expect(bilibiliAdapter.matches('https://www.youtube.com/')).toBe(false)
  })

  test('isWatchPage 含 bangumi 播放页', () => {
    expect(bilibiliAdapter.isWatchPage('https://www.bilibili.com/bangumi/play/ep123')).toBe(true)
    expect(bilibiliAdapter.isWatchPage('https://www.bilibili.com/')).toBe(false)
  })
})
