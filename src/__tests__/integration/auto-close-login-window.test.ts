import { describe, test, expect, mock, vi, beforeEach, afterEach } from 'bun:test'
import { createDocumentMock } from '../helpers/mock-document.ts'
import { createVideoMock } from '../helpers/mock-video.ts'
import { stubGlobal, unstubAllGlobals } from '../helpers/mock-gm.ts'

let doc: ReturnType<typeof createDocumentMock>

beforeEach(() => {
  doc = createDocumentMock()
  stubGlobal('document', doc)
})

afterEach(() => {
  unstubAllGlobals()
  vi.useRealTimers()
})

describe('initAutoCloseLoginWindowGuard — 轮询关闭登录弹窗并恢复播放', () => {
  test('检测到登录弹窗时点击关闭按钮并恢复播放', async () => {
    vi.useFakeTimers()

    const closeBtn = doc.createElement('div')
    closeBtn.className = 'bili-mini-close-icon'
    doc.querySelector.mockReturnValue(closeBtn)

    const video = createVideoMock()
    video.paused = true
    doc.getElementsByTagName.mockImplementation((tag) => (tag === 'video' ? [video as unknown as never] : []))

    const { initAutoCloseLoginWindowGuard } = await import('../../features/auto-close-login-window.ts')
    const intervalId = initAutoCloseLoginWindowGuard('.bili-mini-close-icon')

    vi.advanceTimersByTime(1000)
    expect(closeBtn.click).toHaveBeenCalledTimes(1)
    expect(video.play).toHaveBeenCalledTimes(1)
    clearInterval(intervalId)
  })

  test('没有弹窗时不执行点击和播放', async () => {
    vi.useFakeTimers()
    doc.querySelector.mockReturnValue(null)
    const video = createVideoMock()
    video.paused = true
    doc.getElementsByTagName.mockImplementation((tag) => (tag === 'video' ? [video as unknown as never] : []))

    const { initAutoCloseLoginWindowGuard } = await import('../../features/auto-close-login-window.ts')
    const intervalId = initAutoCloseLoginWindowGuard('.bili-mini-close-icon')

    vi.advanceTimersByTime(1000)
    expect(video.play).not.toHaveBeenCalled()
    clearInterval(intervalId)
  })

  test('关闭弹窗后调用 onDialogClosed 回调', async () => {
    vi.useFakeTimers()
    const closeBtn = doc.createElement('div')
    doc.querySelector.mockReturnValue(closeBtn)

    const { initAutoCloseLoginWindowGuard } = await import('../../features/auto-close-login-window.ts')
    const onDialogClosed = mock(() => {})
    const intervalId = initAutoCloseLoginWindowGuard('.bili-mini-close-icon', onDialogClosed)

    vi.advanceTimersByTime(1000)
    expect(onDialogClosed).toHaveBeenCalledTimes(1)
    clearInterval(intervalId)
  })

  test('没有弹窗时不调用 onDialogClosed 回调', async () => {
    vi.useFakeTimers()
    doc.querySelector.mockReturnValue(null)

    const { initAutoCloseLoginWindowGuard } = await import('../../features/auto-close-login-window.ts')
    const onDialogClosed = mock(() => {})
    const intervalId = initAutoCloseLoginWindowGuard('.bili-mini-close-icon', onDialogClosed)

    vi.advanceTimersByTime(2000)
    expect(onDialogClosed).not.toHaveBeenCalled()
    clearInterval(intervalId)
  })
})
