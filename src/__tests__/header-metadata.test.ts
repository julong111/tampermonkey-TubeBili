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

describe('dist/latest/TubeBili.user.js header', () => {
  const header = parseHeader('./dist/latest/TubeBili.user.js')

  test('@version 与 package.json 一致', () => {
    expect(header.some(l => l.includes(`@version            ${pkgVersion}`))).toBe(true)
  })
  test('无 @require（移除外部 ElementGetter 依赖）', () => {
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
