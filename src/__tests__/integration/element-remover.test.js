import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { createGMMock, stubGlobalGM, unstubGlobalGM } from '../helpers/setup-gm-mock.js'

let gmMock

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  document.body.innerHTML = ''
  globalThis.__TARGET__ = 'tampermonkey'
})

afterEach(() => {
  unstubGlobalGM()
  globalThis.__TARGET__ = undefined
})

vi.mock('../../core/element-getter.js', () => ({
  waitElement: (selector) => Promise.resolve(document.querySelector(selector)),
  getVideoElement: () => null,
}))

describe('initYouTubeElementRemover — 条件移除 YouTube 元素', () => {
  test('启用的项目移除元素', async () => {
    gmMock.getValue.mockImplementation((key) => {
      return key === 'Youtube_Remove_Autoplay'
    })

    const btn = document.createElement('button')
    btn.className = 'ytp-autonav-toggle'
    document.body.appendChild(btn)

    const { initYouTubeElementRemover } = await import('../../features/removal/remove-once.js')

    const { initSettings } = await import('../../settings/store.js')
    initSettings('https://www.youtube.com/watch?v=test')

    await initYouTubeElementRemover({
      Youtube_Remove_Autoplay: { selector: '.ytp-autonav-toggle', mode: 'remove' }
    })

    await new Promise(r => setTimeout(r, 50))

    expect(document.querySelector('.ytp-autonav-toggle')).toBeNull()
  })
})

describe('initBilibiliElementRemover — 轮询移除 Bilibili 元素', () => {
  test('启用的项目在轮询中移除', async () => {
    vi.useFakeTimers()

    gmMock.getValue.mockImplementation((key) => {
      return key === 'Bilibili_Remove_Pip'
    })

    const btn = document.createElement('button')
    btn.className = 'bpx-player-ctrl-pip'
    document.body.appendChild(btn)
    document.body.innerHTML += '<div id="bilibili-player"></div>'

    const { initBilibiliElementRemover } = await import('../../features/removal/remove-loop.js')
    const { initSettings } = await import('../../settings/store.js')
    initSettings('https://www.bilibili.com/video/BV1xx')

    const intervalId = initBilibiliElementRemover(
      { Bilibili_Remove_Pip: { selector: '.bpx-player-ctrl-pip', mode: 'remove' } },
      { playerContainer: '#bilibili-player', webscreenClass: 'mode-webscreen' }
    )

    vi.advanceTimersByTime(1000)

    expect(document.querySelector('.bpx-player-ctrl-pip')).toBeNull()

    clearInterval(intervalId)
    vi.useRealTimers()
  })
})
