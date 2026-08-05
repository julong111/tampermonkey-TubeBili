import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { gm } from '../../core/gm-api.ts'
import { createDocumentMock } from '../helpers/mock-document.ts'
import { createLocalStorageMock, stubGlobal, unstubAllGlobals } from '../helpers/mock-gm.ts'

let doc: ReturnType<typeof createDocumentMock>
let ls: Storage & { _store: Map<string, string> }

beforeEach(() => {
  stubGlobal('__TARGET__', undefined)
  ls = createLocalStorageMock()
  stubGlobal('localStorage', ls)
  doc = createDocumentMock()
  stubGlobal('document', doc)
})

afterEach(() => {
  unstubAllGlobals()
})

describe('gm-api Userscripts 分支', () => {
  test('getValue 从 localStorage 读取 (已存在的值)', () => {
    ls.setItem('TubeBili_test_key', 'hello')
    expect(gm.getValue('test_key', 'default')).toBe('hello')
  })

  test('getValue 返回默认值 (不存在的 key)', () => {
    expect(gm.getValue('nonexistent', 'fallback')).toBe('fallback')
  })

  test('getValue 解析布尔值 "true"', () => {
    ls.setItem('TubeBili_bool_key', 'true')
    expect(gm.getValue('bool_key', false)).toBe(true)
  })

  test('getValue 解析数字字符串', () => {
    ls.setItem('TubeBili_num_key', '42')
    expect(gm.getValue('num_key', 0)).toBe(42)
  })

  test('setValue 写入 localStorage', () => {
    gm.setValue('test_key', 'test_val')
    expect(ls.getItem('TubeBili_test_key')).toBe('test_val')
  })

  test('addStyle 创建 style 元素', () => {
    gm.addStyle('.test { color: red; }')
    expect(doc.createElement).toHaveBeenCalledWith('style')
    expect(doc.head.appendChild).toBeDefined()
  })

  test('registerMenuCommand 创建浮动按钮', () => {
    gm.registerMenuCommand('Test', () => {})
    expect(doc.getElementById('tubeBiliFloatingBtn')).toBeDefined()
  })
})
