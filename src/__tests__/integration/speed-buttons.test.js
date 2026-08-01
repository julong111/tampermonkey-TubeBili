import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  document.body.innerHTML = ''
  vi.stubGlobal('GM_getValue', vi.fn(() => '0.5,1.0,1.5'))
  vi.stubGlobal('GM_setValue', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createSpeedButtons — 速度按钮创建', () => {
  test('YouTube 平台按钮具有 youtube CSS 类', async () => {
    vi.stubGlobal('location', { href: 'https://www.youtube.com/watch?v=test' })
    const { createSpeedButtons } = await import('../../ui/speed-buttons.js')

    await new Promise((resolve) => {
      createSpeedButtons((div) => {
        document.body.appendChild(div)
        resolve()
      })
    })

    const container = document.getElementById('speedButtons')
    expect(container).not.toBeNull()
    expect(container.classList.contains('youtube')).toBe(true)

    const buttons = container.querySelectorAll('.speed-control-button')
    expect(buttons.length).toBeGreaterThan(0)
    expect(buttons[0].classList.contains('youtube')).toBe(true)
  })

  test('Bilibili 平台按钮具有 bilibili CSS 类', async () => {
    vi.stubGlobal('location', { href: 'https://www.bilibili.com/video/BV1xx' })
    const { createSpeedButtons } = await import('../../ui/speed-buttons.js')

    await new Promise((resolve) => {
      createSpeedButtons((div) => {
        document.body.appendChild(div)
        resolve()
      })
    })

    const container = document.getElementById('speedButtons')
    expect(container.classList.contains('bilibili')).toBe(true)

    const buttons = container.querySelectorAll('.speed-control-button')
    expect(buttons[0].classList.contains('bilibili')).toBe(true)
  })
})

describe('updateSpeedButtonHighlight — 激活按钮高亮', () => {
  test('高亮对应速度的按钮', async () => {
    const { updateSpeedButtonHighlight } = await import('../../ui/speed-buttons.js')

    document.body.innerHTML = `
      <button class="speed-control-button" data-speed="0.5">0.5×</button>
      <button class="speed-control-button" data-speed="1.0">1.0×</button>
      <button class="speed-control-button" data-speed="1.5">1.5×</button>
    `

    updateSpeedButtonHighlight('1.0')

    const buttons = document.querySelectorAll('.speed-control-button')
    expect(buttons[0].classList.contains('active')).toBe(false)
    expect(buttons[1].classList.contains('active')).toBe(true)
    expect(buttons[2].classList.contains('active')).toBe(false)
  })
})