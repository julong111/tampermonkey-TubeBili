// src/__tests__/platforms/youtube-constants.test.ts
import { describe, test, expect } from 'bun:test'
import {
  INTERVAL_YOUTUBE_AD_CHECK,
  INTERVAL_YOUTUBE_SKIP_AD_CHECK,
  youtubeSelectors
} from '../../platforms/youtube-constants.ts'

describe('youtube constants — 自动点击跳过广告', () => {
  test('skipAdButton 选择器指向 ytp-skip-ad-button', () => {
    expect(youtubeSelectors.skipAdButton).toBe('.ytp-skip-ad-button')
  })

  test('skip 检查间隔为 1000ms', () => {
    expect(INTERVAL_YOUTUBE_SKIP_AD_CHECK).toBe(1000)
  })

  test('广告检测选择器保持存在', () => {
    expect(youtubeSelectors.adSelector).toBe('.ytp-ad-player-overlay, .ytp-ad-player-overlay-layout')
    expect(INTERVAL_YOUTUBE_AD_CHECK).toBe(200)
  })
})
