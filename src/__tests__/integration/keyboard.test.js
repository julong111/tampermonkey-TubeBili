// src/__tests__/integration/keyboard.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../features/rate.js', () => ({
  setPlaybackRate: vi.fn(),
}))

let mockVideo

beforeEach(() => {
  mockVideo = document.createElement('video')
  mockVideo.playbackRate = 1.0
  vi.spyOn(document, 'getElementsByTagName').mockImplementation((tag) => {
    if (tag === 'video') return [mockVideo]
    return []
  })
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

async function importShortcut() {
  vi.resetModules()
  const shortcut = await import('../../features/shortcut.js')
  const { setPlaybackRate } = await import('../../features/rate.js')
  return { ...shortcut, setPlaybackRate }
}

describe('handleKeydown — 快捷键调速', () => {
  test('按逗号降速', async () => {
    const { handleKeydown, setPlaybackRate } = await importShortcut()
    const event = { code: 'Comma', target: { tagName: 'DIV' } }
    handleKeydown(event)
    expect(setPlaybackRate).toHaveBeenCalledWith('0.5')
  })

  test('按句号加速', async () => {
    const { handleKeydown, setPlaybackRate } = await importShortcut()
    const event = { code: 'Period', target: { tagName: 'DIV' } }
    handleKeydown(event)
    expect(setPlaybackRate).toHaveBeenCalledWith('1.5')
  })

  test('在 input 上按快捷键跳过', async () => {
    const { handleKeydown, setPlaybackRate } = await importShortcut()
    const event = { code: 'Comma', target: { tagName: 'INPUT' } }
    handleKeydown(event)
    expect(setPlaybackRate).not.toHaveBeenCalled()
  })

  test('在 textarea 上按快捷键跳过', async () => {
    const { handleKeydown, setPlaybackRate } = await importShortcut()
    const event = { code: 'Comma', target: { tagName: 'TEXTAREA' } }
    handleKeydown(event)
    expect(setPlaybackRate).not.toHaveBeenCalled()
  })

  test('已在最低速度时按逗号不降速', async () => {
    const { handleKeydown, setPlaybackRate } = await importShortcut()
    mockVideo.playbackRate = 0.5
    const event = { code: 'Comma', target: { tagName: 'DIV' } }
    handleKeydown(event)
    expect(setPlaybackRate).toHaveBeenCalledWith('0.5')
  })

  test('已在最高速度时按句号不升速', async () => {
    const { handleKeydown, setPlaybackRate } = await importShortcut()
    mockVideo.playbackRate = 3.0
    const event = { code: 'Period', target: { tagName: 'DIV' } }
    handleKeydown(event)
    expect(setPlaybackRate).toHaveBeenCalledWith('3.0')
  })

  test('未识别的按键码不触发', async () => {
    const { handleKeydown, setPlaybackRate } = await importShortcut()
    const event = { code: 'KeyA', target: { tagName: 'DIV' } }
    handleKeydown(event)
    expect(setPlaybackRate).not.toHaveBeenCalled()
  })
})

describe('initShortcuts — 注册监听器', () => {
  const registeredHandlers = []

  afterEach(() => {
    registeredHandlers.forEach((handler) => document.removeEventListener('keydown', handler))
    registeredHandlers.length = 0
  })

  test('注册 keydown 事件并生效', async () => {
    const { initShortcuts, setPlaybackRate } = await importShortcut()
    const addSpy = vi.spyOn(document, 'addEventListener')
    initShortcuts()
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function))

    registeredHandlers.push(addSpy.mock.calls[0][1])
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Comma', bubbles: true }))
    expect(setPlaybackRate).toHaveBeenCalled()
  })

  test('重复调用不重复注册', async () => {
    const { initShortcuts, setPlaybackRate } = await importShortcut()
    const addSpy = vi.spyOn(document, 'addEventListener')
    initShortcuts()
    initShortcuts()
    expect(addSpy).toHaveBeenCalledTimes(1)

    registeredHandlers.push(addSpy.mock.calls[0][1])
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Comma', bubbles: true }))
    expect(setPlaybackRate).toHaveBeenCalledTimes(1)
  })
})
