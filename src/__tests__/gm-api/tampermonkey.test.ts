import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { gm } from '../../core/gm-api.ts'
import { createGMMock, stubGlobalGM, unstubGlobalGM, stubGlobal } from '../helpers/mock-gm.ts'

let gmMock: ReturnType<typeof createGMMock>

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  stubGlobal('__TARGET__', 'tampermonkey')
})

afterEach(() => {
  unstubGlobalGM()
})

describe('gm-api Tampermonkey 分支', () => {
  test('getValue 转发到 GM_getValue', () => {
    const result = gm.getValue('test_key', 'default_val')
    expect(gmMock.getValue).toHaveBeenCalledWith('test_key', 'default_val')
    expect(result).toBe('default_val')
  })

  test('setValue 转发到 GM_setValue', () => {
    gm.setValue('test_key', 'test_val')
    expect(gmMock.setValue).toHaveBeenCalledWith('test_key', 'test_val')
  })

  test('addStyle 转发到 GM_addStyle', () => {
    gm.addStyle('body { color: red; }')
    expect(gmMock.addStyle).toHaveBeenCalledWith('body { color: red; }')
  })

  test('registerMenuCommand 转发到 GM_registerMenuCommand', () => {
    const callback = () => {}
    gm.registerMenuCommand('Test Menu', callback)
    expect(gmMock.registerMenuCommand).toHaveBeenCalledWith('Test Menu', callback)
  })
})
