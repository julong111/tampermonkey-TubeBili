import { describe, test, expect } from 'vitest'
import { validateSpeedList } from '../../settings/speed-list.js'
import { getOriginalTampermonkey } from '../helpers/load-original-tampermonkey.js'
import { getOriginalUserscripts } from '../helpers/load-original-userscripts.js'

const oldTM = getOriginalTampermonkey().Common
const oldUS = getOriginalUserscripts().Common

const validCases = [
  { input: '0.5,1.0,1.5,2.0',           desc: '英文逗号标准输入' },
  { input: '0.5，1.0，1.5，2.0',          desc: '中文逗号输入' },
  { input: '0.5,  1.0 , 1.5,2.0',       desc: '带空格的输入' },
  { input: '0.5',                        desc: '单个值' },
  { input: '0.1',                        desc: '下限边界 0.1' },
  { input: '10.0',                       desc: '上限边界 10.0' },
  { input: '0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0', desc: '恰好 10 个值' },
  { input: '.5',                         desc: '省略前导零的格式 .5' },
  { input: '1',                          desc: '整数格式' },
]

const invalidCases = [
  { input: '',                           desc: '空字符串' },
  { input: '   ',                        desc: '纯空格字符串' },
  { input: null,                         desc: 'null' },
  { input: undefined,                    desc: 'undefined' },
  { input: 'abc',                        desc: '非数字文本' },
  { input: '1.2.3',                      desc: '多个小数点' },
  { input: '0.05',                       desc: '小于 0.1' },
  { input: '10.1',                       desc: '大于 10' },
  { input: '-1.0',                       desc: '负数' },
  { input: '0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0,5.5', desc: '超过 10 个值' },
]

describe('validateSpeedList — 三版本等价对比', () => {
  describe('有效输入', () => {
    test.each(validCases)('$desc ($input)', ({ input }) => {
      const r1 = oldTM.validateSpeedList(input)
      const r2 = oldUS.validateSpeedList(input)
      const r3 = validateSpeedList(input)
      expect(r1).toEqual(r2)
      expect(r2).toEqual(r3)
    })
  })

  describe('无效输入', () => {
    test.each(invalidCases)('$desc ($input)', ({ input }) => {
      const r1 = oldTM.validateSpeedList(input)
      const r2 = oldUS.validateSpeedList(input)
      const r3 = validateSpeedList(input)
      expect(r1).toEqual(r2)
      expect(r2).toEqual(r3)
      expect(r1.valid).toBe(false)
    })
  })
})
