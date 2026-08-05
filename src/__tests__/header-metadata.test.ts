// src/__tests__/header-metadata.test.ts
import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'

const pkgVersion = JSON.parse(readFileSync('./package.json', 'utf8')).version

function parseHeader(filePath: string) {
  const content = readFileSync(filePath, 'utf-8')
  const match = content.match(/^\/\/ ==UserScript==\n([\s\S]*?)\n\/\/ ==\/UserScript==/)
  if (!match) throw new Error('No header found in ' + filePath)
  return (match[1] as string).split('\n').filter(l => l.startsWith('// @'))
}

describe('legacy/TubeBili.user.js header 元数据', () => {
  const header = parseHeader('./legacy/TubeBili.user.js')

  test('@name 包含 TubeBili', () => {
    expect(header.some(l => l.includes('TubeBili'))).toBe(true)
  })
  test('@version 为 2.0.2', () => {
    expect(header.some(l => l.includes('@version            2.0.2'))).toBe(true)
  })
  test('@match 包含 youtube.com 和 bilibili.com', () => {
    expect(header.some(l => l.includes('youtube.com'))).toBe(true)
    expect(header.some(l => l.includes('bilibili.com'))).toBe(true)
  })
  test('@grant 包含 GM_addStyle, GM_getValue, GM_registerMenuCommand, GM_setValue', () => {
    expect(header.some(l => l.includes('GM_addStyle'))).toBe(true)
    expect(header.some(l => l.includes('GM_getValue'))).toBe(true)
    expect(header.some(l => l.includes('GM_registerMenuCommand'))).toBe(true)
    expect(header.some(l => l.includes('GM_setValue'))).toBe(true)
  })
  test('@run-at 为 document-start', () => {
    expect(header.some(l => l.includes('document-start'))).toBe(true)
  })
})

describe('dist/latest/TubeBili.user.js header', () => {
  const header = parseHeader('./dist/latest/TubeBili.user.js')

  test('@version 与 package.json 一致', () => {
    expect(header.some(l => l.includes(`@version            ${pkgVersion}`))).toBe(true)
  })
  test('无 @require（移除外部 ElementGetter 依赖）', () => {
    expect(header.some(l => l.includes('@require'))).toBe(false)
  })
})

describe('legacy/TubeBili.userscripts.js header', () => {
  const header = parseHeader('./legacy/TubeBili.userscripts.js')

  test('@name 包含 Safari/Universal', () => {
    expect(header.some(l => l.includes('Safari/通用版'))).toBe(true)
  })
  test('@grant 为 none', () => {
    expect(header.some(l => l.includes('@grant              none'))).toBe(true)
  })
  test('@match 使用通配符 *://*', () => {
    expect(header.some(l => l.includes('*://*.youtube.com'))).toBe(true)
  })
  test('无 @require', () => {
    expect(header.some(l => l.includes('@require'))).toBe(false)
  })
})

describe('dist/latest/TubeBili.userscripts.js header', () => {
  const header = parseHeader('./dist/latest/TubeBili.userscripts.js')

  test('@version 与 package.json 一致', () => {
    expect(header.some(l => l.includes(`@version            ${pkgVersion}`))).toBe(true)
  })
  test('@grant 为 none', () => {
    expect(header.some(l => l.includes('@grant              none'))).toBe(true)
  })
})
