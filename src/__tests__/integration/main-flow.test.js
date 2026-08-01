import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { createGMMock, stubGlobalGM, unstubGlobalGM } from '../helpers/setup-gm-mock.js'

vi.mock('../../core/element-getter.js', () => ({
  waitElement: vi.fn(() => Promise.resolve(document.createElement('div'))),
  getVideoElement: () => null,
}))

let gmMock

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  vi.stubGlobal('__TARGET__', 'tampermonkey')
  document.body.innerHTML = ''
  localStorage.clear()
})

afterEach(() => {
  unstubGlobalGM()
})

async function importMain() {
  vi.resetModules()
  return import('../../main.js')
}

describe('main — 初始化流程', () => {
  test('首次运行时自动设置面板', async () => {
    gmMock.getValue.mockImplementation((key, defaultValue) => {
      if (key === 'firstRunComplete') return false
      return defaultValue
    })

    vi.useFakeTimers()
    vi.stubGlobal('location', { href: 'https://www.youtube.com/watch?v=test' })

    await importMain()

    expect(gmMock.setValue).toHaveBeenCalledWith('firstRunComplete', true)
  })

  test('YouTube 页面注册 beforeunload 监听器', async () => {
    vi.stubGlobal('location', { href: 'https://www.youtube.com/watch?v=test' })
    const addListenerSpy = vi.spyOn(window, 'addEventListener')

    await importMain()

    expect(addListenerSpy).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    )
  })
})

describe('cleanup — 清理定时器和观察器', () => {
  test('清除 youtubeAdCheckInterval', async () => {
    vi.stubGlobal('location', { href: 'https://www.youtube.com/watch?v=test' })

    await importMain()

    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    window.dispatchEvent(new Event('beforeunload'))

    expect(clearSpy).toHaveBeenCalled()
  })
})