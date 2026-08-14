import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { createGMMock, stubGlobalGM, unstubGlobalGM, stubGlobal, unstubAllGlobals } from '../helpers/mock-gm.ts'
import { createDocumentMock } from '../helpers/mock-document.ts'
import { initSettings, resetSettings, getShortcutSpeeds, getButtonSpeeds, getSettingPanelItems } from '../../settings/store.ts'
import { resetSettingsPanel } from '../../ui/settings-panel.ts'

let gmMock: ReturnType<typeof createGMMock>
let doc: ReturnType<typeof createDocumentMock>

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  stubGlobal('__TARGET__', 'tampermonkey')
  stubGlobal('navigator', { language: 'en' })
  doc = createDocumentMock()
  stubGlobal('document', doc)
  resetSettings()
  resetSettingsPanel()
})

afterEach(() => {
  unstubGlobalGM()
  unstubAllGlobals()
})

describe('store.loadSpeedLists — 从 GM 存储加载速度列表', () => {
  test('有效数据更新 shortcutSpeeds', () => {
    gmMock.getValue.mockImplementation((key, defaultValue) => {
      if (key === 'Shortcut_Speed_List') return '1.0,2.0,3.0'
      if (key === 'Button_Speed_List') return '0.5,1.0'
      return defaultValue
    })

    initSettings('https://www.youtube.com/watch?v=xxx')

    expect(getShortcutSpeeds()).toEqual(['1', '2', '3'])
    expect(getButtonSpeeds()).toEqual(['0.5', '1'])
  })

  test('无效数据保留默认值', () => {
    gmMock.getValue.mockImplementation((key, defaultValue) => {
      if (key === 'Shortcut_Speed_List') return 'invalid'
      if (key === 'Button_Speed_List') return ''
      return defaultValue
    })

    initSettings('https://www.youtube.com/watch?v=xxx')

    expect(getShortcutSpeeds()).toEqual(['0.5', '1.0', '1.5', '2.0', '2.5', '3.0'])
    expect(getButtonSpeeds()).toEqual(['0.5', '1.0', '1.5', '2.0'])
  })
})

describe('catalog — 平台相关配置', () => {
  test('YouTube URL 加载 YouTube 配置项', () => {
    initSettings('https://www.youtube.com/watch?v=xxx')

    const items = getSettingPanelItems()
    expect(items.Youtube_Action_Rate).toBeDefined()
    expect(items.Youtube_Action_TheaterMode).toBeDefined()
    expect(items.Youtube_Action_SkipAd).toBeDefined()
    expect(items.Bilibili_Action_Rate).toBeUndefined()
  })

  test('Bilibili URL 加载 Bilibili 配置项', () => {
    initSettings('https://www.bilibili.com/video/BV1xx')

    const items = getSettingPanelItems()
    expect(items.Bilibili_Action_Rate).toBeDefined()
    expect(items.Bilibili_Action_WebFullscreen).toBeDefined()
    expect(items.Youtube_Action_Rate).toBeUndefined()
  })
})
