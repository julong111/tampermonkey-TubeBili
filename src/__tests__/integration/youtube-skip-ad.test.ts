import { describe, test, expect, mock, vi, beforeEach, afterEach } from 'bun:test'
import { createGMMock, stubGlobalGM, unstubGlobalGM, stubGlobal, unstubAllGlobals } from '../helpers/mock-gm.ts'
import { createDocumentMock, type ElementStub } from '../helpers/mock-document.ts'
import { createVideoMock } from '../helpers/mock-video.ts'
import { initSettings, resetSettings } from '../../settings/store.ts'
import { youtubeHandlers, cleanupYoutube } from '../../platforms/youtube.ts'

const AD_SELECTOR = '.ytp-ad-player-overlay, .ytp-ad-player-overlay-layout'
const SKIP_SELECTOR = '.ytp-skip-ad-button'
const SKIP_ENABLE_KEY = 'Youtube_Action_SkipAd_Enabled'

let gmMock: ReturnType<typeof createGMMock>
let doc: ReturnType<typeof createDocumentMock>
let video: ReturnType<typeof createVideoMock>
let adOverlay: ElementStub
let skipBtn: ElementStub

function setupAdEnvironment(skipEnabled: boolean) {
  doc.querySelector.mockImplementation((selector) => {
    if (selector === AD_SELECTOR) return adOverlay
    if (selector === SKIP_SELECTOR) return skipBtn
    return null
  })
  doc.getElementsByTagName.mockImplementation((tag) => (tag === 'video' ? [video as unknown as never] : []))
  gmMock.getValue.mockImplementation((key, defaultValue) => {
    if (key === SKIP_ENABLE_KEY) return skipEnabled
    if (key === 'Youtube_Action_Rate_Value') return '2'
    return defaultValue
  })
  initSettings('https://www.youtube.com/watch?v=test')
  youtubeHandlers.initListeners()
}

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  stubGlobal('__TARGET__', 'tampermonkey')
  stubGlobal('navigator', { language: 'en' })
  doc = createDocumentMock()
  stubGlobal('document', doc)
  stubGlobal('window', {
    location: { href: 'https://www.youtube.com/watch?v=test' },
    addEventListener: mock(() => {}),
    removeEventListener: mock(() => {}),
    getComputedStyle: mock((el: unknown) => {
      const style = (el as { style?: Record<string, string> }).style
      return { opacity: style?.opacity ?? '1' }
    })
  })
  video = createVideoMock()
  adOverlay = doc.createElement('div')
  skipBtn = doc.createElement('div')
  skipBtn.className = 'ytp-skip-ad-button'
  skipBtn.offsetParent = adOverlay
  resetSettings()
  vi.useFakeTimers()
})

afterEach(() => {
  cleanupYoutube()
  vi.useRealTimers()
  unstubGlobalGM()
  unstubAllGlobals()
})

describe('youtube skip-ad — 自动点击跳过广告按钮', () => {
  test('广告出现且开启时，检测到 skip 按钮即点击并恢复 1 倍速', () => {
    setupAdEnvironment(true)

    vi.advanceTimersByTime(200)
    vi.advanceTimersByTime(1000)

    expect(skipBtn.click).toHaveBeenCalledTimes(1)
    expect(video.playbackRate).toBe(1)
  })

  test('广告中未出现 skip 按钮时不点击', () => {
    setupAdEnvironment(true)
    skipBtn = doc.createElement('div')
    doc.querySelector.mockImplementation((selector) => {
      if (selector === AD_SELECTOR) return adOverlay
      return null
    })

    vi.advanceTimersByTime(200)
    vi.advanceTimersByTime(2000)

    expect(skipBtn.click).not.toHaveBeenCalled()
  })

  test('skip 按钮存在但未显示（offsetParent 为 null）时不点击', () => {
    setupAdEnvironment(true)
    skipBtn.offsetParent = null

    vi.advanceTimersByTime(200)
    vi.advanceTimersByTime(2000)

    expect(skipBtn.click).not.toHaveBeenCalled()
  })

  test('skip 按钮存在但半透明（倒计时中 opacity 0.5）时不点击', () => {
    setupAdEnvironment(true)
    skipBtn.style.opacity = '0.5'

    vi.advanceTimersByTime(200)
    vi.advanceTimersByTime(2000)

    expect(skipBtn.click).not.toHaveBeenCalled()
  })

  test('设置项关闭时即便广告出现也不点击', () => {
    setupAdEnvironment(false)

    vi.advanceTimersByTime(200)
    vi.advanceTimersByTime(2000)

    expect(skipBtn.click).not.toHaveBeenCalled()
  })

  test('广告结束后停止点击', () => {
    setupAdEnvironment(true)

    vi.advanceTimersByTime(200)
    vi.advanceTimersByTime(1000)
    expect(skipBtn.click).toHaveBeenCalledTimes(1)

    doc.querySelector.mockImplementation((selector) => {
      if (selector === SKIP_SELECTOR) return skipBtn
      return null
    })

    vi.advanceTimersByTime(200)
    vi.advanceTimersByTime(2000)
    expect(skipBtn.click).toHaveBeenCalledTimes(1)
  })

  test('广告中关闭开关后立即停止点击', () => {
    setupAdEnvironment(true)

    vi.advanceTimersByTime(200)
    vi.advanceTimersByTime(1000)
    expect(skipBtn.click).toHaveBeenCalledTimes(1)

    gmMock.getValue.mockImplementation((key, defaultValue) => {
      if (key === SKIP_ENABLE_KEY) return false
      if (key === 'Youtube_Action_Rate_Value') return '2'
      return defaultValue
    })

    vi.advanceTimersByTime(1000)
    vi.advanceTimersByTime(2000)
    expect(skipBtn.click).toHaveBeenCalledTimes(1)
  })

  test('cleanupYoutube 清除 skip 间隔后不再点击', () => {
    setupAdEnvironment(true)

    vi.advanceTimersByTime(200)
    vi.advanceTimersByTime(1000)
    expect(skipBtn.click).toHaveBeenCalledTimes(1)

    cleanupYoutube()
    vi.advanceTimersByTime(3000)
    expect(skipBtn.click).toHaveBeenCalledTimes(1)
  })
})
