// src/__tests__/element-getter/element-getter.test.ts
import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { waitElement, getVideoElement } from '../../core/element-getter.ts'
import { createDocumentMock, createElementStub, type ElementStub } from '../helpers/mock-document.ts'
import { createVideoMock } from '../helpers/mock-video.ts'
import { stubGlobal, unstubAllGlobals } from '../helpers/mock-gm.ts'

let doc: ReturnType<typeof createDocumentMock>

beforeEach(() => {
  doc = createDocumentMock()
  stubGlobal('document', doc)
  stubGlobal('MutationObserver', class {
    observe() {}
    disconnect() {}
  })
})

afterEach(() => {
  unstubAllGlobals()
})

describe('waitElement — 统一内联 MutationObserver 实现', () => {
  test('已存在的元素立即返回', async () => {
    const div = createElementStub('div')
    doc.querySelector.mockReturnValue(div)
    const result = await waitElement('#existing-element', 1000)
    expect(result).toBe(div as unknown as Element)
  })
})

describe('getVideoElement — 获取当前页面 video 元素', () => {
  test('存在 video 时返回第一个', () => {
    const video = createVideoMock()
    doc.getElementsByTagName.mockReturnValue([video as unknown as ElementStub])
    expect(getVideoElement()).toBe(video as unknown as HTMLVideoElement)
  })

  test('无 video 时返回 null', () => {
    doc.getElementsByTagName.mockReturnValue([])
    expect(getVideoElement()).toBeNull()
  })
})
