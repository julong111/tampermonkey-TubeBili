import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { createGMMock, stubGlobalGM, unstubGlobalGM } from '../helpers/setup-gm-mock.js'

vi.mock('../../core/element-getter.js', () => ({
  waitElement: (selector) => Promise.resolve(document.querySelector(selector)),
  getVideoElement: () => null,
}))

let gmMock
let cleanupBilibili

const flush = () => Promise.resolve()

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  globalThis.__TARGET__ = 'tampermonkey'
  document.body.innerHTML = ''
})

afterEach(() => {
  cleanupBilibili?.()
  vi.useRealTimers()
  delete document.fullscreenElement
  unstubGlobalGM()
  globalThis.__TARGET__ = undefined
})

async function setupBilibiliModule(autoWebFullscreen) {
  vi.resetModules()
  gmMock.getValue.mockImplementation((key, defaultValue) => {
    if (key === 'Bilibili_Action_AutoCloseLoginWindow') return true
    if (key === 'Bilibili_Action_WebFullscreen') return autoWebFullscreen
    return defaultValue
  })
  const { initSettings } = await import('../../settings/store.js')
  initSettings('https://www.bilibili.com/video/BV1xx')
  const mod = await import('../../platforms/bilibili.js')
  cleanupBilibili = mod.cleanupBilibili
  return mod
}

function buildPlayerDom() {
  document.body.innerHTML =
    '<div id="bilibili-player"><div class="bpx-player-container" data-screen="normal"></div></div>' +
    '<button class="bpx-player-ctrl-web"></button>' +
    '<button class="bpx-player-ctrl-full"></button>'
  const container = document.querySelector('.bpx-player-container')
  const webBtn = document.querySelector('.bpx-player-ctrl-web')
  const fullBtn = document.querySelector('.bpx-player-ctrl-full')
  const webClickSpy = vi.fn()
  const fullClickSpy = vi.fn()
  webBtn.addEventListener('click', webClickSpy)
  fullBtn.addEventListener('click', fullClickSpy)
  return { container, webClickSpy, fullClickSpy }
}

function showLoginWindow() {
  const closeBtn = document.createElement('div')
  closeBtn.className = 'bili-mini-close-icon'
  document.body.appendChild(closeBtn)
}

async function runGuardTick() {
  vi.advanceTimersByTime(1000)
  await flush()
  await flush()
  await flush()
}

describe('displayMode — 登录窗关闭后按模式恢复', () => {
  test('自动网页全屏 + 无手势被系统退出 → 登录窗关闭后恢复网页全屏', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'Date'] })

    const mod = await setupBilibiliModule(true)
    const { container, webClickSpy, fullClickSpy } = buildPlayerDom()
    mod.bilibiliAdapter.onPage()
    await flush()
    await flush()

    container.setAttribute('data-screen', 'web')
    await flush()
    container.setAttribute('data-screen', 'normal')
    await flush()

    showLoginWindow()
    const clicksBefore = webClickSpy.mock.calls.length

    await runGuardTick()

    expect(webClickSpy.mock.calls.length).toBe(clicksBefore + 1)
    expect(fullClickSpy).not.toHaveBeenCalled()
  })

  test('用户按 Esc 退出网页全屏 → 登录窗关闭后不再恢复', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'Date'] })

    const mod = await setupBilibiliModule(true)
    const { container, webClickSpy, fullClickSpy } = buildPlayerDom()
    mod.bilibiliAdapter.onPage()
    await flush()
    await flush()

    container.setAttribute('data-screen', 'web')
    await flush()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flush()
    container.setAttribute('data-screen', 'normal')
    await flush()

    showLoginWindow()
    const clicksBefore = webClickSpy.mock.calls.length

    await runGuardTick()

    expect(webClickSpy.mock.calls.length).toBe(clicksBefore)
    expect(fullClickSpy).not.toHaveBeenCalled()
  })

  test('用户手动进入网页全屏 → 登录窗关闭后恢复网页全屏', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'Date'] })

    const mod = await setupBilibiliModule(false)
    const { container, webClickSpy, fullClickSpy } = buildPlayerDom()
    mod.bilibiliAdapter.onPage()
    await flush()
    await flush()

    window.dispatchEvent(new Event('pointerdown'))
    await flush()
    container.setAttribute('data-screen', 'web')
    await flush()

    vi.advanceTimersByTime(5000)
    container.setAttribute('data-screen', 'normal')
    await flush()

    showLoginWindow()
    const clicksBefore = webClickSpy.mock.calls.length

    await runGuardTick()

    expect(webClickSpy.mock.calls.length).toBe(clicksBefore + 1)
    expect(fullClickSpy).not.toHaveBeenCalled()
  })

  test('用户在全屏模式被系统退出 → 登录窗关闭后恢复全屏', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'Date'] })

    const mod = await setupBilibiliModule(false)
    const { container, webClickSpy, fullClickSpy } = buildPlayerDom()
    mod.bilibiliAdapter.onPage()
    await flush()
    await flush()

    container.setAttribute('data-screen', 'full')
    await flush()
    container.setAttribute('data-screen', 'normal')
    await flush()

    showLoginWindow()

    await runGuardTick()

    expect(fullClickSpy).toHaveBeenCalledTimes(1)
    expect(webClickSpy).not.toHaveBeenCalled()
  })

  test('网页全屏下点全屏按钮进入全屏（非退出），登录窗关闭后恢复全屏', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'Date'] })

    const mod = await setupBilibiliModule(true)
    const { container, webClickSpy, fullClickSpy } = buildPlayerDom()
    mod.bilibiliAdapter.onPage()
    await flush()
    await flush()

    container.setAttribute('data-screen', 'web')
    await flush()

    window.dispatchEvent(new Event('pointerdown'))
    document.querySelector('.bpx-player-ctrl-full').dispatchEvent(new Event('click'))
    await flush()
    container.setAttribute('data-screen', 'full')
    await flush()

    vi.advanceTimersByTime(5000)
    container.setAttribute('data-screen', 'normal')
    await flush()

    showLoginWindow()
    const clicksBefore = fullClickSpy.mock.calls.length
    const webClicksBefore = webClickSpy.mock.calls.length

    await runGuardTick()

    expect(fullClickSpy.mock.calls.length).toBe(clicksBefore + 1)
    expect(webClickSpy.mock.calls.length).toBe(webClicksBefore)
  })

  test('原生全屏（fullscreenchange）被系统退出 → 登录窗关闭后恢复全屏', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'Date'] })

    const mod = await setupBilibiliModule(false)
    const { webClickSpy, fullClickSpy } = buildPlayerDom()
    mod.bilibiliAdapter.onPage()
    await flush()
    await flush()

    const container = document.querySelector('.bpx-player-container')
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => container,
    })
    document.dispatchEvent(new Event('fullscreenchange'))
    await flush()
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => null,
    })
    document.dispatchEvent(new Event('fullscreenchange'))
    await flush()

    showLoginWindow()

    await runGuardTick()

    expect(fullClickSpy).toHaveBeenCalledTimes(1)
    expect(webClickSpy).not.toHaveBeenCalled()
  })

  test('普通模式下登录窗关闭后不恢复任何模式', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'Date'] })

    const mod = await setupBilibiliModule(false)
    const { webClickSpy, fullClickSpy } = buildPlayerDom()
    mod.bilibiliAdapter.onPage()
    await flush()
    await flush()

    showLoginWindow()

    await runGuardTick()

    expect(webClickSpy).not.toHaveBeenCalled()
    expect(fullClickSpy).not.toHaveBeenCalled()
  })
})
