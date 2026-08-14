import { describe, test, expect, mock, vi, beforeEach, afterEach } from 'bun:test'
import { createGMMock, stubGlobalGM, unstubGlobalGM, stubGlobal, unstubAllGlobals } from '../helpers/mock-gm.ts'
import { createDocumentMock } from '../helpers/mock-document.ts'
import { initSettings, resetSettings } from '../../settings/store.ts'
import { handleYoutubePage } from '../../platforms/youtube.ts'

let gmMock: ReturnType<typeof createGMMock>
let doc: ReturnType<typeof createDocumentMock>
let errorSpy: ReturnType<typeof vi.spyOn>

function setupUrl(href: string) {
  stubGlobal('window', {
    location: { href },
    addEventListener: mock(() => {}),
    removeEventListener: mock(() => {})
  })
}

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  stubGlobal('__TARGET__', 'tampermonkey')
  stubGlobal('navigator', { language: 'en' })
  doc = createDocumentMock()
  stubGlobal('document', doc)
  stubGlobal('MutationObserver', class {
    observe() {}
    disconnect() {}
  })
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  resetSettings()
  vi.useFakeTimers()
})

afterEach(() => {
  errorSpy.mockRestore()
  vi.useRealTimers()
  unstubGlobalGM()
  unstubAllGlobals()
})

describe('handleYoutubePage — watch 页判断', () => {
  test('非 watch 页（首页）导航时不等待 videoPanel、不报错', async () => {
    setupUrl('https://www.youtube.com/')
    initSettings('https://www.youtube.com/')

    const promise = handleYoutubePage()
    vi.advanceTimersByTime(10000)
    await promise

    expect(errorSpy).not.toHaveBeenCalled()
  })

  test('非 watch 页（搜索结果）导航时不等待 videoPanel、不报错', async () => {
    setupUrl('https://www.youtube.com/results?search_query=test')
    initSettings('https://www.youtube.com/results')

    const promise = handleYoutubePage()
    vi.advanceTimersByTime(10000)
    await promise

    expect(errorSpy).not.toHaveBeenCalled()
  })

  test('watch 页且有 videoPanel 时正常创建按钮，不报错', async () => {
    setupUrl('https://www.youtube.com/watch?v=test')
    initSettings('https://www.youtube.com/watch?v=test')
    const videoPanel = doc.createElement('div')
    doc.querySelector.mockImplementation((selector) => {
      if (selector === '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls') {
        return videoPanel
      }
      return null
    })

    const promise = handleYoutubePage()
    await promise

    expect(errorSpy).not.toHaveBeenCalled()
  })
})
