// src/__tests__/element-getter/element-getter.test.js
import { describe, test, expect } from 'vitest'
import { waitElement, getVideoElement } from '../../core/element-getter.js'

describe('waitElement — 统一内联 MutationObserver 实现', () => {
  test('已存在的元素立即返回', async () => {
    const div = document.createElement('div')
    div.id = 'existing-element'
    document.body.appendChild(div)

    const result = await waitElement('#existing-element', 1000)
    expect(result).toBe(div)

    document.body.removeChild(div)
  })

  test('不存在的元素超时 reject', async () => {
    await expect(
      waitElement('#nonexistent-element', 100)
    ).rejects.toThrow('Element not found')
  })
})

describe('getVideoElement — 获取当前页面 video 元素', () => {
  test('存在 video 时返回第一个', () => {
    const video = document.createElement('video')
    document.body.appendChild(video)

    expect(getVideoElement()).toBe(video)

    document.body.removeChild(video)
  })

  test('无 video 时返回 null', () => {
    expect(getVideoElement()).toBeNull()
  })
})
