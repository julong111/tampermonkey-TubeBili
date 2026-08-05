import { describe, test, expect, mock, vi, beforeEach, afterEach } from 'bun:test'
import { createGMMock, stubGlobalGM, unstubGlobalGM, stubGlobal, unstubAllGlobals } from '../helpers/mock-gm.ts'
import { createDocumentMock } from '../helpers/mock-document.ts'
import { createVideoMock } from '../helpers/mock-video.ts'
import { resetSettings } from '../../settings/store.ts'
import { resetShortcuts } from '../../features/shortcut.ts'
import { resetSettingsPanel } from '../../ui/settings-panel.ts'
import { resetTubeBili, cleanup } from '../../main.ts'

let gmMock: ReturnType<typeof createGMMock>

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  stubGlobal('__TARGET__', 'tampermonkey')
  stubGlobal('document', createDocumentMock())
  stubGlobal('MutationObserver', class {
    observe() {}
    disconnect() {}
  })
  stubGlobal('navigator', { language: 'en' })
  stubGlobal('window', {
    location: { href: 'https://www.youtube.com/watch?v=test' },
    addEventListener: mock(() => {}),
    removeEventListener: mock(() => {})
  })
  resetTubeBili()
  resetSettings()
  resetShortcuts()
  resetSettingsPanel()
})

afterEach(() => {
  cleanup()
  unstubGlobalGM()
  unstubAllGlobals()
  vi.useRealTimers()
})

describe('main — 初始化流程', () => {
  test('首次运行时自动设置面板', async () => {
    gmMock.getValue.mockImplementation((key, defaultValue) => {
      if (key === 'firstRunComplete') return false
      return defaultValue
    })

    vi.useFakeTimers()
    const { main } = await import('../../main.ts')
    main()
    vi.advanceTimersByTime(500)

    expect(gmMock.setValue).toHaveBeenCalledWith('firstRunComplete', true)
  })

  test('再次调用 main 不重复初始化', async () => {
    const { main } = await import('../../main.ts')
    main()
    const setValueCalls = gmMock.setValue.mock.calls.length
    main()
    expect(gmMock.setValue.mock.calls.length).toBe(setValueCalls)
  })
})

describe('cleanup — 清理定时器和观察器', () => {
  test('beforeunload 触发 cleanup', async () => {
    const windowAddSpy = mock((..._args: unknown[]) => {})
    stubGlobal('window', {
      location: { href: 'https://www.youtube.com/watch?v=test' },
      addEventListener: windowAddSpy,
      removeEventListener: mock(() => {})
    })
    await import('../../entry.ts')
    expect(windowAddSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })
})
