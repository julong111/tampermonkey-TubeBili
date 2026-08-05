import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test'
import { createDocumentMock, type ElementStub } from '../helpers/mock-document.ts'
import { createGMMock, stubGlobalGM, unstubGlobalGM, stubGlobal, unstubAllGlobals } from '../helpers/mock-gm.ts'
import { resetSettings } from '../../settings/store.ts'

let doc: ReturnType<typeof createDocumentMock>
let gmMock: ReturnType<typeof createGMMock>

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  stubGlobal('__TARGET__', 'tampermonkey')
  doc = createDocumentMock()
  stubGlobal('document', doc)
  stubGlobal('window', { location: { href: 'https://www.youtube.com/watch?v=test' } })
  resetSettings()
})

afterEach(() => {
  unstubGlobalGM()
  unstubAllGlobals()
})

describe('createSpeedButtons — 速度按钮创建', () => {
  test('YouTube 平台按钮具有 youtube CSS 类且回调收到容器', async () => {
    const { createSpeedButtons } = await import('../../ui/speed-buttons.ts')
    const panelCallback = mock((_div: HTMLDivElement) => {})
    const btnClickCallback = mock(() => {})
    createSpeedButtons(panelCallback, btnClickCallback)

    expect(panelCallback).toHaveBeenCalledTimes(1)
    const container = panelCallback.mock.calls[0]?.[0] as unknown as ElementStub
    expect(container.classList.contains('youtube')).toBe(true)
  })

  test('按钮点击触发 btnClickCallback', async () => {
    const { createSpeedButtons } = await import('../../ui/speed-buttons.ts')
    const panelCallback = mock((_div: HTMLDivElement) => {})
    const btnClickCallback = mock(() => {})
    createSpeedButtons(panelCallback, btnClickCallback)

    const container = panelCallback.mock.calls[0]?.[0]
    const buttons = (container as unknown as { children: Array<{ click: () => void; dataset: Record<string, string> }> }).children
    expect(buttons.length).toBeGreaterThan(0)
    buttons[0]?.click()
    expect(btnClickCallback).toHaveBeenCalledWith(buttons[0]?.dataset.speed)
  })
})

describe('updateSpeedButtonHighlight — 激活按钮高亮', () => {
  test('高亮对应速度的按钮', async () => {
    const { updateSpeedButtonHighlight } = await import('../../ui/speed-buttons.ts')
    const btn0 = createButton('0.5')
    const btn1 = createButton('1.0')
    const btn2 = createButton('1.5')
    doc.querySelectorAll.mockReturnValue([btn0, btn1, btn2])
    doc.querySelector.mockImplementation((sel) => {
      if (sel === '.speed-control-button[data-speed="1.0"]') return btn1
      return null
    })

    updateSpeedButtonHighlight('1.0')

    expect(btn0.classList.contains('active')).toBe(false)
    expect(btn1.classList.contains('active')).toBe(true)
    expect(btn2.classList.contains('active')).toBe(false)
  })
})

function createButton(speed: string): ElementStub {
  const btn = doc.createElement('button')
  btn.dataset.speed = speed
  return btn
}
