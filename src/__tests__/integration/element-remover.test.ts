import { describe, test, expect, mock, vi, beforeEach, afterEach } from 'bun:test'
import { createGMMock, stubGlobalGM, unstubGlobalGM, stubGlobal, unstubAllGlobals } from '../helpers/mock-gm.ts'
import { createDocumentMock } from '../helpers/mock-document.ts'
import { resetSettings } from '../../settings/store.ts'

let gmMock: ReturnType<typeof createGMMock>
let doc: ReturnType<typeof createDocumentMock>

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  stubGlobal('__TARGET__', 'tampermonkey')
  stubGlobal('navigator', { language: 'en' })
  doc = createDocumentMock()
  stubGlobal('document', doc)
  resetSettings()
})

afterEach(() => {
  unstubGlobalGM()
  unstubAllGlobals()
  vi.useRealTimers()
})

describe('initYouTubeElementRemover — 条件移除 YouTube 元素', () => {
  test('启用的项目移除元素', async () => {
    gmMock.getValue.mockImplementation((key) => key === 'Youtube_Remove_Autoplay')

    const btn = doc.createElement('button')
    btn.className = 'ytp-autonav-toggle'
    doc.addEventListener('parent', () => {})
    doc.createElement = (() => btn) as unknown as ReturnType<typeof createDocumentMock>['createElement']
    doc.querySelector.mockImplementation((sel) => (sel === '.ytp-autonav-toggle' ? btn : null))

    const { initSettings } = await import('../../settings/store.ts')
    initSettings('https://www.youtube.com/watch?v=test')
    const { initYouTubeElementRemover } = await import('../../features/removal/remove-once.ts')
    await initYouTubeElementRemover({ Youtube_Remove_Autoplay: { selector: '.ytp-autonav-toggle', mode: 'remove' } })

    await new Promise((r) => setTimeout(r, 10))
    expect(btn.remove).toHaveBeenCalled()
  })
})

describe('initBilibiliElementRemover — 轮询移除 Bilibili 元素', () => {
  test('启用的项目在轮询中移除', async () => {
    vi.useFakeTimers()
    gmMock.getValue.mockImplementation((key) => key === 'Bilibili_Remove_Pip')

    const btn = doc.createElement('button')
    btn.className = 'bpx-player-ctrl-pip'
    const player = doc.createElement('div')
    player.classList.add('bpx-player-ctrl-pip')
    doc.querySelector.mockImplementation((sel) => {
      if (sel === '.bpx-player-ctrl-pip') return btn
      if (sel === '#bilibili-player') return player
      return null
    })

    const { initSettings } = await import('../../settings/store.ts')
    initSettings('https://www.bilibili.com/video/BV1xx')
    const { initBilibiliElementRemover } = await import('../../features/removal/remove-loop.ts')

    const intervalId = initBilibiliElementRemover(
      { Bilibili_Remove_Pip: { selector: '.bpx-player-ctrl-pip', mode: 'remove' } },
      { playerContainer: '#bilibili-player', webscreenClass: 'mode-webscreen' }
    )

    vi.advanceTimersByTime(1000)
    expect(btn.remove).toHaveBeenCalled()
    clearInterval(intervalId)
  })
})
