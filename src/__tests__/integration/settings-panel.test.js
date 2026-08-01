import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { createGMMock, stubGlobalGM, unstubGlobalGM } from '../helpers/setup-gm-mock.js'

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

async function importSettings() {
  vi.resetModules()
  const store = await import('../../settings/store.js')
  const panel = await import('../../ui/settings-panel.js')
  return { store, panel }
}

describe('store.loadSpeedLists — 从 GM 存储加载速度列表', () => {
  test('有效数据更新 shortcutSpeeds', async () => {
    gmMock.getValue.mockImplementation((key, defaultValue) => {
      if (key === 'Shortcut_Speed_List') return '1.0,2.0,3.0'
      if (key === 'Button_Speed_List') return '0.5,1.0'
      return defaultValue
    })

    const { store } = await importSettings()
    store.initSettings('https://www.youtube.com/watch?v=xxx')

    expect(store.getShortcutSpeeds()).toEqual(['1', '2', '3'])
    expect(store.getButtonSpeeds()).toEqual(['0.5', '1'])
  })

  test('无效数据保留默认值', async () => {
    gmMock.getValue.mockImplementation((key, defaultValue) => {
      if (key === 'Shortcut_Speed_List') return 'invalid'
      if (key === 'Button_Speed_List') return ''
      return defaultValue
    })

    const { store } = await importSettings()
    store.initSettings('https://www.youtube.com/watch?v=xxx')

    expect(store.getShortcutSpeeds()).toEqual(['0.5', '1.0', '1.5', '2.0', '2.5', '3.0'])
    expect(store.getButtonSpeeds()).toEqual(['0.5', '1.0', '1.5', '2.0'])
  })
})

describe('saveSettings — 保存速度列表设置', () => {
  test('有效输入调用 gm.setValue 并更新 select', async () => {
    const { store, panel } = await importSettings()
    store.initSettings('https://www.youtube.com/watch?v=xxx')
    panel.togglePanel()

    document.getElementById('shortcutSpeedListInput').value = '0.5,1.0,2.0'
    document.getElementById('buttonSpeedListInput').value = '1.0,1.5,2.0'

    document.getElementById('saveBtn').click()

    expect(gmMock.setValue).toHaveBeenCalledWith('Shortcut_Speed_List', '0.5,1.0,2.0')
    expect(gmMock.setValue).toHaveBeenCalledWith('Button_Speed_List', '1.0,1.5,2.0')
  })
})

describe('catalog — 平台相关配置', () => {
  test('YouTube URL 加载 YouTube 配置项', async () => {
    const { store } = await importSettings()
    store.initSettings('https://www.youtube.com/watch?v=xxx')

    const items = store.getSettingPanelItems()
    expect(items.Youtube_Action_Rate).toBeDefined()
    expect(items.Youtube_Action_TheaterMode).toBeDefined()
    expect(items.Bilibili_Action_Rate).toBeUndefined()
  })

  test('Bilibili URL 加载 Bilibili 配置项', async () => {
    const { store } = await importSettings()
    store.initSettings('https://www.bilibili.com/video/BV1xx')

    const items = store.getSettingPanelItems()
    expect(items.Bilibili_Action_Rate).toBeDefined()
    expect(items.Bilibili_Action_WebFullscreen).toBeDefined()
    expect(items.Youtube_Action_Rate).toBeUndefined()
  })
})

describe('createSpeedList — DOM select option 创建', () => {
  test('panel 中速度选择器包含对应数量 option', async () => {
    const { store, panel } = await importSettings()
    store.initSettings('https://www.youtube.com/watch?v=xxx')
    panel.togglePanel()

    const select = document.getElementById('Youtube_Action_Rate_Value')
    expect(select.children.length).toBe(6)
    expect(select.children[0].value).toBe('0.5')
    expect(select.children[1].value).toBe('1.0')
    expect(select.children[2].value).toBe('1.5')
  })
})
