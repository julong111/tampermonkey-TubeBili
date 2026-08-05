import { describe, test, expect } from 'bun:test'
import { validateSpeedList } from '../../settings/speed-list.ts'

const validCases: Array<{ input: string; desc: string }> = [
  { input: '0.5,1.0,1.5,2.0', desc: '英文逗号标准输入' },
  { input: '0.5，1.0，1.5，2.0', desc: '中文逗号输入' },
  { input: '0.5,  1.0 , 1.5,2.0', desc: '带空格的输入' },
  { input: '0.5', desc: '单个值' },
  { input: '0.1', desc: '下限边界 0.1' },
  { input: '10.0', desc: '上限边界 10.0' },
  { input: '0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0', desc: '恰好 10 个值' },
  { input: '.5', desc: '省略前导零的格式 .5' },
  { input: '1', desc: '整数格式' }
]

const invalidCases: Array<{ input: unknown; desc: string }> = [
  { input: '', desc: '空字符串' },
  { input: '   ', desc: '纯空格字符串' },
  { input: null, desc: 'null' },
  { input: undefined, desc: 'undefined' },
  { input: 'abc', desc: '非数字文本' },
  { input: '1.2.3', desc: '多个小数点' },
  { input: '0.05', desc: '小于 0.1' },
  { input: '10.1', desc: '大于 10' },
  { input: '-1.0', desc: '负数' },
  { input: '0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0,5.5', desc: '超过 10 个值' }
]

describe('validateSpeedList', () => {
  for (const { input, desc } of validCases) {
    test(`有效: ${desc}`, () => {
      const r = validateSpeedList(input)
      expect(r.valid).toBe(true)
      expect(r.speeds.length).toBeGreaterThan(0)
    })
  }

  for (const { input, desc } of invalidCases) {
    test(`无效: ${desc}`, () => {
      const r = validateSpeedList(input)
      expect(r.valid).toBe(false)
      expect(r.speeds).toEqual([])
    })
  }
})
