import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.stubGlobal('__TARGET__', 'tampermonkey')
  vi.stubGlobal('GM_getValue', vi.fn((key, def) => def))
  vi.stubGlobal('GM_setValue', vi.fn())
  vi.stubGlobal('GM_addStyle', vi.fn())
  vi.stubGlobal('GM_registerMenuCommand', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('gm-api Tampermonkey 分支', () => {
  test('getValue 转发到 GM_getValue', async () => {
    const { gm } = await import('../../core/gm-api.js')
    const result = gm.getValue('test_key', 'default_val')
    expect(GM_getValue).toHaveBeenCalledWith('test_key', 'default_val')
    expect(result).toBe('default_val')
  })

  test('setValue 转发到 GM_setValue', async () => {
    const { gm } = await import('../../core/gm-api.js')
    gm.setValue('test_key', 'test_val')
    expect(GM_setValue).toHaveBeenCalledWith('test_key', 'test_val')
  })

  test('addStyle 转发到 GM_addStyle', async () => {
    const { gm } = await import('../../core/gm-api.js')
    gm.addStyle('body { color: red; }')
    expect(GM_addStyle).toHaveBeenCalledWith('body { color: red; }')
  })

  test('registerMenuCommand 转发到 GM_registerMenuCommand', async () => {
    const { gm } = await import('../../core/gm-api.js')
    const callback = () => {}
    gm.registerMenuCommand('Test Menu', callback)
    expect(GM_registerMenuCommand).toHaveBeenCalledWith('Test Menu', callback)
  })
})
