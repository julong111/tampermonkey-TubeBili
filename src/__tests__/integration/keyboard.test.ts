import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test'
import { createDocumentMock, type ElementStub } from '../helpers/mock-document.ts'
import { createVideoMock } from '../helpers/mock-video.ts'
import { resetShortcuts } from '../../features/shortcut.ts'
import { stubGlobal, unstubAllGlobals } from '../helpers/mock-gm.ts'

mock.module('../../features/rate.ts', () => ({
  setPlaybackRate: mock((rate: string) => {})
}))

let doc: ReturnType<typeof createDocumentMock>
let setPlaybackRate: ReturnType<typeof mock>

beforeEach(async () => {
  doc = createDocumentMock()
  stubGlobal('document', doc)
  const video = createVideoMock()
  doc.getElementsByTagName.mockImplementation((tag) => (tag === 'video' ? [video as unknown as ElementStub] : []))
  resetShortcuts()
  const rate = await import('../../features/rate.ts')
  setPlaybackRate = rate.setPlaybackRate as ReturnType<typeof mock>
  mock.clearAllMocks()
})

afterEach(() => {
  unstubAllGlobals()
})

async function importShortcut() {
  return import('../../features/shortcut.ts')
}

describe('handleKeydown — 快捷键调速', () => {
  test('按逗号降速', async () => {
    const { handleKeydown } = await importShortcut()
    handleKeydown({ code: 'Comma', target: { tagName: 'DIV' } } as unknown as KeyboardEvent)
    expect(setPlaybackRate).toHaveBeenCalledWith('0.5')
  })

  test('按句号加速', async () => {
    const { handleKeydown } = await importShortcut()
    handleKeydown({ code: 'Period', target: { tagName: 'DIV' } } as unknown as KeyboardEvent)
    expect(setPlaybackRate).toHaveBeenCalledWith('1.5')
  })

  test('在 input 上按快捷键跳过', async () => {
    const { handleKeydown } = await importShortcut()
    handleKeydown({ code: 'Comma', target: { tagName: 'INPUT' } } as unknown as KeyboardEvent)
    expect(setPlaybackRate).not.toHaveBeenCalled()
  })

  test('在 textarea 上按快捷键跳过', async () => {
    const { handleKeydown } = await importShortcut()
    handleKeydown({ code: 'Comma', target: { tagName: 'TEXTAREA' } } as unknown as KeyboardEvent)
    expect(setPlaybackRate).not.toHaveBeenCalled()
  })

  test('已在最低速度时按逗号不降速', async () => {
    const video = createVideoMock()
    video.playbackRate = 0.5
    doc.getElementsByTagName.mockImplementation((tag) => (tag === 'video' ? [video as unknown as ElementStub] : []))
    const { handleKeydown } = await importShortcut()
    handleKeydown({ code: 'Comma', target: { tagName: 'DIV' } } as unknown as KeyboardEvent)
    expect(setPlaybackRate).toHaveBeenCalledWith('0.5')
  })

  test('未识别的按键码不触发', async () => {
    const { handleKeydown } = await importShortcut()
    handleKeydown({ code: 'KeyA', target: { tagName: 'DIV' } } as unknown as KeyboardEvent)
    expect(setPlaybackRate).not.toHaveBeenCalled()
  })
})

describe('initShortcuts — 注册监听器', () => {
  test('注册 keydown 事件并生效', async () => {
    const { initShortcuts } = await importShortcut()
    const addSpy = mock(() => {})
    doc.addEventListener = addSpy as unknown as ReturnType<typeof createDocumentMock>['addEventListener']
    initShortcuts()
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  test('重复调用不重复注册', async () => {
    const { initShortcuts } = await importShortcut()
    initShortcuts()
    const addSpy = mock(() => {})
    doc.addEventListener = addSpy as unknown as ReturnType<typeof createDocumentMock>['addEventListener']
    initShortcuts()
    expect(addSpy).not.toHaveBeenCalled()
  })
})
