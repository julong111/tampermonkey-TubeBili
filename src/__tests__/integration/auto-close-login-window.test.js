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

describe('initAutoCloseLoginWindowGuard — 轮询关闭登录弹窗并恢复播放', () => {
  test('检测到登录弹窗时点击关闭按钮并恢复播放', async () => {
    vi.useFakeTimers()

    const { initAutoCloseLoginWindowGuard } = await import('../../features/auto-close-login-window.js')

    const closeBtn = document.createElement('div')
    closeBtn.className = 'bili-mini-close-icon'
    const closeClick = vi.fn()
    closeBtn.addEventListener('click', closeClick)
    const maskInner = document.createElement('div')
    maskInner.appendChild(closeBtn)
    const mask = document.createElement('div')
    mask.className = 'bili-mini-mask'
    mask.appendChild(maskInner)
    document.body.appendChild(mask)

    const video = document.createElement('video')
    const pausedSpy = vi.spyOn(video, 'paused', 'get').mockReturnValue(true)
    const playSpy = vi.spyOn(video, 'play').mockResolvedValue(undefined)
    document.body.appendChild(video)

    const intervalId = initAutoCloseLoginWindowGuard('.bili-mini-close-icon')

    vi.advanceTimersByTime(1000)

    expect(closeClick).toHaveBeenCalledTimes(1)
    expect(playSpy).toHaveBeenCalledTimes(1)

    clearInterval(intervalId)
    vi.useRealTimers()
    pausedSpy.mockRestore()
  })

  test('没有弹窗时不执行点击和播放', async () => {
    vi.useFakeTimers()

    const { initAutoCloseLoginWindowGuard } = await import('../../features/auto-close-login-window.js')

    const video = document.createElement('video')
    const pausedSpy = vi.spyOn(video, 'paused', 'get').mockReturnValue(true)
    const playSpy = vi.spyOn(video, 'play').mockResolvedValue(undefined)
    document.body.appendChild(video)

    const intervalId = initAutoCloseLoginWindowGuard('.bili-mini-close-icon')

    vi.advanceTimersByTime(1000)

    expect(playSpy).not.toHaveBeenCalled()

    clearInterval(intervalId)
    vi.useRealTimers()
    pausedSpy.mockRestore()
  })

  test('关闭弹窗后调用 onDialogClosed 回调', async () => {
    vi.useFakeTimers()

    const { initAutoCloseLoginWindowGuard } = await import('../../features/auto-close-login-window.js')

    const closeBtn = document.createElement('div')
    closeBtn.className = 'bili-mini-close-icon'
    document.body.appendChild(closeBtn)

    const onDialogClosed = vi.fn()
    const intervalId = initAutoCloseLoginWindowGuard('.bili-mini-close-icon', onDialogClosed)

    vi.advanceTimersByTime(1000)

    expect(onDialogClosed).toHaveBeenCalledTimes(1)

    clearInterval(intervalId)
    vi.useRealTimers()
  })

  test('没有弹窗时不调用 onDialogClosed 回调', async () => {
    vi.useFakeTimers()

    const { initAutoCloseLoginWindowGuard } = await import('../../features/auto-close-login-window.js')

    const onDialogClosed = vi.fn()
    const intervalId = initAutoCloseLoginWindowGuard('.bili-mini-close-icon', onDialogClosed)

    vi.advanceTimersByTime(2000)

    expect(onDialogClosed).not.toHaveBeenCalled()

    clearInterval(intervalId)
    vi.useRealTimers()
  })
})
