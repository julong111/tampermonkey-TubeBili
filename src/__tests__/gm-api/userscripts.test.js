import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

describe('gm-api Userscripts 分支', () => {
  test('getValue 从 localStorage 读取 (已存在的值)', async () => {
    localStorage.setItem('TubeBili_test_key', 'hello')
    const { gm } = await import('../../core/gm-api.js')
    const result = gm.getValue('test_key', 'default')
    expect(result).toBe('hello')
  })

  test('getValue 返回默认值 (不存在的 key)', async () => {
    const { gm } = await import('../../core/gm-api.js')
    const result = gm.getValue('nonexistent', 'fallback')
    expect(result).toBe('fallback')
  })

  test('getValue 解析布尔值 "true"', async () => {
    localStorage.setItem('TubeBili_bool_key', 'true')
    const { gm } = await import('../../core/gm-api.js')
    expect(gm.getValue('bool_key', false)).toBe(true)
  })

  test('getValue 解析数字字符串', async () => {
    localStorage.setItem('TubeBili_num_key', '42')
    const { gm } = await import('../../core/gm-api.js')
    expect(gm.getValue('num_key', 0)).toBe(42)
  })

  test('setValue 写入 localStorage', async () => {
    const { gm } = await import('../../core/gm-api.js')
    gm.setValue('test_key', 'test_val')
    expect(localStorage.getItem('TubeBili_test_key')).toBe('test_val')
  })

  test('addStyle 创建 style 元素', async () => {
    const { gm } = await import('../../core/gm-api.js')
    gm.addStyle('.test { color: red; }')
    const style = document.querySelector('style[data-tubebili-style]')
    expect(style).not.toBeNull()
    expect(style.textContent).toContain('.test { color: red; }')
  })

  test('registerMenuCommand 创建浮动按钮', async () => {
    const { gm } = await import('../../core/gm-api.js')
    gm.registerMenuCommand('Test', () => {})
    const btn = document.getElementById('tubeBiliFloatingBtn')
    expect(btn).not.toBeNull()
    expect(btn.title).toBe('Test')
  })
})
