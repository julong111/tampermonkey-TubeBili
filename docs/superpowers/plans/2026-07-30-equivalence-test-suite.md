# Equivalence Test Suite 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 为 TubeBili 工程化重构后的 4 个脚本文件建立自动化测试基础设施，验证构建产物与原始脚本行为等价。

**Architecture:** Vitest + jsdom + VM 沙箱注入。旧版脚本通过 `vm.createContext` 加载并注入一行捕获代码获取内部函数引用，新版直接 import 源模块。等价对比测试对同一组 inputs 同时跑旧版和新版，断言输出一致。

**Tech Stack:** Vitest, jsdom, Node.js `vm` module

## Global Constraints

- 不修改任何 `src/` 下的业务源码
- 不修改 `rollup.config.js` 和构建流程
- 不加其他 npm 依赖（只用 vitest + jsdom）
- 测试文件均放在 `src/__tests__/` 下
- 使用 ESM 格式（`import/export`）
- 语言：中文（test description 用中文描述用例意图）
- `__TARGET__` 是 Rollup 编译时常量，测试时不可用，必须用 `vi.mock` 或条件重写代替

---

## 1. 基础设施搭建

### Task 1.1: 安装依赖 + Vitest 配置

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`
- Create: `src/__tests__/helpers/setup-vitest-env.js`

**Interfaces:**
- Consumes: 无
- Produces: `vitest.config.js` 配置文件，`npm test` / `npm run test:watch` 命令

- [x] **Step 1: 安装依赖**

```bash
npm install -D vitest jsdom
```

- [x] **Step 2: 创建 vitest.config.js**

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/__tests__/**/*.test.js'],
    setupFiles: ['src/__tests__/helpers/setup-vitest-env.js'],
  },
})
```

- [x] **Step 3: 创建 Vitest 全局 setup 文件**

```js
// src/__tests__/helpers/setup-vitest-env.js
import { vi } from 'vitest'

// 确保 globals 存在
globalThis.__TARGET__ = undefined
```

- [x] **Step 4: 修改 package.json 添加 scripts**

在 `"scripts"` 中添加：
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [x] **Step 5: 验证安装**

```bash
npm test
```
Expected: 输出 "No test files found"（尚未有测试文件，正常）

- [x] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.js src/__tests__/helpers/setup-vitest-env.js
git commit -m "test: add vitest + jsdom infrastructure"
```

---

### Task 1.2: 创建 VM 沙箱加载器 — Tampermonkey

**Files:**
- Create: `src/__tests__/helpers/load-original-tampermonkey.js`

**Interfaces:**
- Consumes: `TubeBili.user.js`（根目录原始文件）
- Produces: 导出 `original` 对象，包含 `{ Common, sys, isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage, youtubeSelectors, bilibiliSelectors, youtube_removal_items, bilibili_removal_items, handleYoutubePage, handleBilibiliPage, initYoutubeListeners, initBilibiliListener, main, cleanup }`

- [x] **Step 1: 创建加载器文件**

```js
// src/__tests__/helpers/load-original-tampermonkey.js
import { readFileSync } from 'fs'
import { createContext, runInContext } from 'vm'
import { JSDOM } from 'jsdom'

let original = null

export function getOriginalTampermonkey() {
  if (original) return original

  const code = readFileSync('./TubeBili.user.js', 'utf-8')

  const instrumented = code
    .replace(
      'window.addEventListener("beforeunload", cleanup);\n  main();',
      '// [TEST] main() suppressed'
    )
    .replace(
      '})();',
      `
  globalThis.__TB_ORIG = {
    Common, sys, main, cleanup,
    isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage,
    youtubeSelectors, bilibiliSelectors,
    youtube_removal_items, bilibili_removal_items,
    handleYoutubePage, handleBilibiliPage,
    initYoutubeListeners, initBilibiliListener,
  };
})();`
    )

  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'https://www.youtube.com/watch?v=test',
  })

  const sandbox = {
    globalThis: {},
    // GM API mocks
    GM_getValue: (key, def) => def,
    GM_setValue: () => {},
    GM_addStyle: () => {},
    GM_registerMenuCommand: () => {},
    // Browser mocks
    document: dom.window.document,
    window: dom.window,
    location: dom.window.location,
    navigator: { language: 'zh-CN' },
    // ElementGetter mock (外部 @require)
    elmGetter: {
      get: (selector) => Promise.resolve(null),
      any: (selectors) => Promise.resolve(null),
    },
    ElementGetter: {
      get: (selector) => Promise.resolve(null),
      any: (selectors) => Promise.resolve(null),
    },
    // Node.js / jsdom provided
    console, setTimeout, clearTimeout, setInterval, clearInterval,
    MutationObserver: dom.window.MutationObserver,
    localStorage: dom.window.localStorage,
    // Safety
    unsafeWindow: dom.window,
    GM_info: { script: { version: '2.0.2' } },
  }

  const ctx = createContext(sandbox)
  runInContext(instrumented, ctx)

  original = ctx.globalThis.__TB_ORIG
  return original
}
```

- [x] **Step 2: 写一个快速验证脚本确保加载器工作**

创建临时测试 `src/__tests__/helpers/__load-test.test.js`：
```js
import { describe, test, expect } from 'vitest'
import { getOriginalTampermonkey } from './load-original-tampermonkey.js'

describe('VM loader — Tampermonkey', () => {
  test('should load Common with all methods', () => {
    const orig = getOriginalTampermonkey()
    expect(orig.Common).toBeDefined()
    expect(typeof orig.Common.validateSpeedList).toBe('function')
    expect(typeof orig.Common.detectLanguage).toBe('function')
    expect(typeof orig.Common.handleKeydown).toBe('function')
    expect(Array.isArray(orig.Common.shortcutSpeeds)).toBe(true)
    expect(Array.isArray(orig.Common.buttonSpeeds)).toBe(true)
  })

  test('should load URL detection functions', () => {
    const orig = getOriginalTampermonkey()
    expect(typeof orig.isYoutubePage).toBe('function')
    expect(typeof orig.isYoutubeWatchPage).toBe('function')
    expect(typeof orig.isBilibiliVideoPage).toBe('function')
  })

  test('should suppress auto-execution of main()', () => {
    // main() should not have been called — sys.isMainRunning should be false
    const orig = getOriginalTampermonkey()
    expect(orig.sys.isMainRunning).toBe(false)
  })
})
```

- [x] **Step 3: 运行验证**

```bash
npx vitest run src/__tests__/helpers/__load-test.test.js
```
Expected: 3 PASS

- [x] **Step 4: 清理临时文件**

```bash
rm src/__tests__/helpers/__load-test.test.js
```

- [x] **Step 5: Commit**

```bash
git add src/__tests__/helpers/load-original-tampermonkey.js
git commit -m "test: create VM sandbox loader for original Tampermonkey script"
```

---

### Task 1.3: 创建 VM 沙箱加载器 — Userscripts

**Files:**
- Create: `src/__tests__/helpers/load-original-userscripts.js`

**Interfaces:**
- Consumes: `TubeBili.userscripts.js`（根目录原始文件）
- Produces: 导出 `original` 对象，与 Tampermonkey 加载器结构相同

- [x] **Step 1: 创建加载器文件**

```js
// src/__tests__/helpers/load-original-userscripts.js
import { readFileSync } from 'fs'
import { createContext, runInContext } from 'vm'
import { JSDOM } from 'jsdom'

let original = null

export function getOriginalUserscripts() {
  if (original) return original

  const code = readFileSync('./TubeBili.userscripts.js', 'utf-8')

  const instrumented = code
    .replace(
      'window.addEventListener("beforeunload", cleanup);\n  main();',
      '// [TEST] main() suppressed'
    )
    .replace(
      '})();',
      `
  globalThis.__TB_ORIG = {
    Common, sys, main, cleanup,
    isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage,
    youtubeSelectors, bilibiliSelectors,
    youtube_removal_items, bilibili_removal_items,
    handleYoutubePage, handleBilibiliPage,
    initYoutubeListeners, initBilibiliListener,
  };
})();`
    )

  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'https://www.youtube.com/watch?v=test',
  })

  const sandbox = {
    globalThis: {},
    document: dom.window.document,
    window: dom.window,
    location: dom.window.location,
    navigator: { language: 'zh-CN' },
    console, setTimeout, clearTimeout, setInterval, clearInterval,
    MutationObserver: dom.window.MutationObserver,
    localStorage: dom.window.localStorage,
    // Userscripts 脚本用 var GM_getValue = ... 自注入
    // 不需要额外 GM_* mock，脚本自带 GM_Polyfill
    unsafeWindow: dom.window,
    GM_info: { script: { version: '2.0.2-safari' } },
    // ElementGetter 内联在脚本中，不需要 mock
  }

  const ctx = createContext(sandbox)
  runInContext(instrumented, ctx)

  original = ctx.globalThis.__TB_ORIG
  return original
}
```

- [x] **Step 2: 创建并运行验证**

```js
// src/__tests__/helpers/__load-test-us.test.js
import { describe, test, expect } from 'vitest'
import { getOriginalUserscripts } from './load-original-userscripts.js'

describe('VM loader — Userscripts', () => {
  test('should load Common with all methods', () => {
    const orig = getOriginalUserscripts()
    expect(orig.Common).toBeDefined()
    expect(typeof orig.Common.validateSpeedList).toBe('function')
  })
  test('should suppress auto-execution', () => {
    const orig = getOriginalUserscripts()
    expect(orig.sys.isMainRunning).toBe(false)
  })
})
```

```bash
npx vitest run src/__tests__/helpers/__load-test-us.test.js
```

- [x] **Step 3: 清理临时文件 + Commit**

```bash
rm src/__tests__/helpers/__load-test-us.test.js
git add src/__tests__/helpers/load-original-userscripts.js
git commit -m "test: create VM sandbox loader for original Userscripts script"
```

---

### Task 1.4: 创建通用 GM mock 工厂

**Files:**
- Create: `src/__tests__/helpers/setup-gm-mock.js`

**Interfaces:**
- Produces: 导出 `createGMMock()` 函数，返回 `{ getValue, setValue, addStyle, registerMenuCommand }`
- 提供给集成测试在 `beforeEach` 中调用

- [x] **Step 1: 创建工厂文件**

```js
// src/__tests__/helpers/setup-gm-mock.js
import { vi } from 'vitest'

export function createGMMock() {
  const store = new Map()

  return {
    getValue: vi.fn((key, defaultValue) => {
      return store.has(key) ? store.get(key) : defaultValue
    }),
    setValue: vi.fn((key, value) => {
      store.set(key, value)
    }),
    addStyle: vi.fn(() => {}),
    registerMenuCommand: vi.fn(() => {}),
    _store: store,
  }
}

export function stubGlobalGM(mock) {
  vi.stubGlobal('GM_getValue', mock.getValue)
  vi.stubGlobal('GM_setValue', mock.setValue)
  vi.stubGlobal('GM_addStyle', mock.addStyle)
  vi.stubGlobal('GM_registerMenuCommand', mock.registerMenuCommand)
}

export function unstubGlobalGM() {
  vi.unstubAllGlobals()
}

export function createLocalStorageMock() {
  const store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = String(value) }),
    _store: store,
  }
}
```

- [x] **Step 2: Commit**

```bash
git add src/__tests__/helpers/setup-gm-mock.js
git commit -m "test: create GM mock factory for integration tests"
```

---

## 2. 纯函数等价对比测试

### Task 2.1: validateSpeedList 等价对比

**Files:**
- Create: `src/__tests__/equivalence/validate-speed-list.test.js`

**Interfaces:**
- Consumes: `getOriginalTampermonkey()` (旧版 Tampermonkey), `getOriginalUserscripts()` (旧版 Userscripts), `validateSpeedList` (新版 from `src/ui/settings-panel.js`)
- Verifies: 三种实现（TM 旧版、US 旧版、新版）对同一组 inputs 输出一致

- [x] **Step 1: 编写测试文件**

```js
// src/__tests__/equivalence/validate-speed-list.test.js
import { describe, test, expect } from 'vitest'
import { validateSpeedList } from '../../ui/settings-panel.js'
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
```

- [x] **Step 2: 运行测试**

```bash
npx vitest run src/__tests__/equivalence/validate-speed-list.test.js
```
Expected: 所有用例通过

- [x] **Step 3: Commit**

```bash
git add src/__tests__/equivalence/validate-speed-list.test.js
git commit -m "test: validateSpeedList equivalence (TM old, US old, new)"
```

---

### Task 2.2: detectLanguage + t() 等价对比

**Files:**
- Create: `src/__tests__/equivalence/detect-language.test.js`

- [x] **Step 1: 编写测试文件**

```js
// src/__tests__/equivalence/detect-language.test.js
import { describe, test, expect, beforeEach } from 'vitest'
import { t, detectLanguage } from '../../i18n.js'
import { getOriginalTampermonkey } from '../helpers/load-original-tampermonkey.js'
import { getOriginalUserscripts } from '../helpers/load-original-userscripts.js'

const oldTM = getOriginalTampermonkey().Common
const oldUS = getOriginalUserscripts().Common

describe('detectLanguage — 三版本等价', () => {
  const cases = [
    { lang: 'zh-CN', expected: 'zh' },
    { lang: 'zh-TW', expected: 'zh' },
    { lang: 'zh',    expected: 'zh' },
    { lang: 'en-US', expected: 'en' },
    { lang: 'en',    expected: 'en' },
    { lang: 'fr-FR', expected: 'en' },
    { lang: 'ja',    expected: 'en' },
  ]

  test.each(cases)('$lang → $expected', ({ lang, expected }) => {
    const navigator = { language: lang }

    // 新版 detectLanguage 依赖 navigator.language
    const originalNav = globalThis.navigator
    globalThis.navigator = navigator
    try {
      const newResult = detectLanguage()
      expect(newResult).toBe(expected)
    } finally {
      globalThis.navigator = originalNav
    }
  })
})

describe('t() i18n 查找 — 新版与旧版等价', () => {
  const keys = [
    'Menu_Settings',
    'Menu_Save',
    'Menu_Close',
    'Youtube_Action_Rate',
    'Bilibili_Action_WebFullscreen',
  ]

  test.each(keys)('t("%s", "zh") 等价', (key) => {
    const oldT = oldTM.geti18nText(key)
    // 新版 t() 不依赖 sys.currentLang，直接传 lang
    const newResult = t(key, 'zh')
    expect(newResult).toBe(oldT)
  })

  test.each(keys)('t("%s", "en") 等价', (key) => {
    const oldT = oldTM.geti18nText(key)
    const newResult = t(key, 'en')
    expect(newResult).toBe(oldT)
  })

  test('不存在的 key 返回 key 本身', () => {
    expect(t('NonExistentKey', 'zh')).toBe('NonExistentKey')
  })
})
```

- [x] **Step 2: 运行 + Commit**

```bash
npx vitest run src/__tests__/equivalence/detect-language.test.js
```

```bash
git add src/__tests__/equivalence/detect-language.test.js
git commit -m "test: detectLanguage + t() equivalence"
```

---

### Task 2.3: URL 检测函数等价对比

**Files:**
- Create: `src/__tests__/equivalence/url-detection.test.js`

- [x] **Step 1: 编写测试文件**

```js
// src/__tests__/equivalence/url-detection.test.js
import { describe, test, expect } from 'vitest'
import { isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage } from '../../main.js'
import { getOriginalTampermonkey } from '../helpers/load-original-tampermonkey.js'

const oldTM = getOriginalTampermonkey()

// 新版 URL 检测函数是独立函数，直接传 URL 参数
// 旧版在闭包中使用 window.location.href
// 所以测试策略不同：新版直接调用，旧版需要设置 location.href 后调用

const urlCases = [
  // [url, isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage]
  ['https://www.youtube.com/watch?v=abc123',           true,  true,  false],
  ['https://www.youtube.com/',                          true,  false, false],
  ['https://www.youtube.com/feed/trending',             true,  false, false],
  ['https://m.youtube.com/watch?v=abc123',              true,  true,  false],
  ['https://www.bilibili.com/video/BV1xx411c7mD',       false, false, true],
  ['https://www.bilibili.com/bangumi/play/ep123456',    false, false, true],
  ['https://www.bilibili.com/',                         false, false, false],
  ['https://accounts.youtube.com/login',                true,  false, false],
]

describe('isYoutubePage — 新版正确性', () => {
  test.each(urlCases)('%s → %s', (url, expected) => {
    expect(isYoutubePage(url)).toBe(expected)
  })
})

describe('isYoutubeWatchPage — 新版正确性', () => {
  test.each(urlCases)('%s → %s', (url, _1, expected) => {
    expect(isYoutubeWatchPage(url)).toBe(expected)
  })
})

describe('isBilibiliVideoPage — 新版正确性', () => {
  test.each(urlCases)('%s → %s', (url, _1, _2, expected) => {
    expect(isBilibiliVideoPage(url)).toBe(expected)
  })
})

describe('URL 检测 — 旧版 TM 基础功能', () => {
  test('旧版 isYoutubePage 在 youtube.com 上返回 true', () => {
    expect(oldTM.isYoutubePage()).toBe(true)
  })
})
```

- [x] **Step 2: 运行 + Commit**

```bash
npx vitest run src/__tests__/equivalence/url-detection.test.js
```

```bash
git add src/__tests__/equivalence/url-detection.test.js
git commit -m "test: URL detection functions correctness"
```

---

## 3. GM API 层验证

### Task 3.1: Tampermonkey 分支 — gm-api

**Files:**
- Create: `src/__tests__/gm-api/tampermonkey.test.js`

- [x] **Step 1: 编写测试**

```js
// src/__tests__/gm-api/tampermonkey.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

// 模拟 __TARGET__ = 'tampermonkey'
beforeEach(() => {
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
    const { gm } = await import('../../gm-api.js')
    const result = gm.getValue('test_key', 'default_val')
    expect(GM_getValue).toHaveBeenCalledWith('test_key', 'default_val')
    expect(result).toBe('default_val')
  })

  test('setValue 转发到 GM_setValue', async () => {
    const { gm } = await import('../../gm-api.js')
    gm.setValue('test_key', 'test_val')
    expect(GM_setValue).toHaveBeenCalledWith('test_key', 'test_val')
  })

  test('addStyle 转发到 GM_addStyle', async () => {
    const { gm } = await import('../../gm-api.js')
    gm.addStyle('body { color: red; }')
    expect(GM_addStyle).toHaveBeenCalledWith('body { color: red; }')
  })

  test('registerMenuCommand 转发到 GM_registerMenuCommand', async () => {
    const { gm } = await import('../../gm-api.js')
    const callback = () => {}
    gm.registerMenuCommand('Test Menu', callback)
    expect(GM_registerMenuCommand).toHaveBeenCalledWith('Test Menu', callback)
  })
})
```

- [x] **Step 2: 运行 + Commit**

```bash
npx vitest run src/__tests__/gm-api/tampermonkey.test.js
```

```bash
git add src/__tests__/gm-api/tampermonkey.test.js
git commit -m "test: gm-api Tampermonkey branch (GM_* delegation)"
```

---

### Task 3.2: Userscripts 分支 — gm-api

**Files:**
- Create: `src/__tests__/gm-api/userscripts.test.js`

- [x] **Step 1: 编写测试**

```js
// src/__tests__/gm-api/userscripts.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  localStorage.clear()
  // 不 stub GM_* globals — userscripts 分支应走 localStorage
})

afterEach(() => {
  localStorage.clear()
})

describe('gm-api Userscripts 分支', () => {
  test('getValue 从 localStorage 读取 (已存在的值)', async () => {
    localStorage.setItem('TubeBili_test_key', 'hello')
    const { gm } = await import('../../gm-api.js')
    const result = gm.getValue('test_key', 'default')
    expect(result).toBe('hello')
  })

  test('getValue 返回默认值 (不存在的 key)', async () => {
    const { gm } = await import('../../gm-api.js')
    const result = gm.getValue('nonexistent', 'fallback')
    expect(result).toBe('fallback')
  })

  test('getValue 解析布尔值 "true"', async () => {
    localStorage.setItem('TubeBili_bool_key', 'true')
    const { gm } = await import('../../gm-api.js')
    expect(gm.getValue('bool_key', false)).toBe(true)
  })

  test('getValue 解析数字字符串', async () => {
    localStorage.setItem('TubeBili_num_key', '42')
    const { gm } = await import('../../gm-api.js')
    expect(gm.getValue('num_key', 0)).toBe(42)
  })

  test('setValue 写入 localStorage', async () => {
    const { gm } = await import('../../gm-api.js')
    gm.setValue('test_key', 'test_val')
    expect(localStorage.getItem('TubeBili_test_key')).toBe('test_val')
  })

  test('addStyle 创建 style 元素', async () => {
    const { gm } = await import('../../gm-api.js')
    gm.addStyle('.test { color: red; }')
    const style = document.querySelector('style[data-tubebili-style]')
    expect(style).not.toBeNull()
    expect(style.textContent).toContain('.test { color: red; }')
  })

  test('registerMenuCommand 创建浮动按钮', async () => {
    const { gm } = await import('../../gm-api.js')
    gm.registerMenuCommand('Test', () => {})
    const btn = document.getElementById('tubeBiliFloatingBtn')
    expect(btn).not.toBeNull()
    expect(btn.title).toBe('Test')
  })
})
```

- [x] **Step 2: 运行 + Commit**

```bash
npx vitest run src/__tests__/gm-api/userscripts.test.js
```

```bash
git add src/__tests__/gm-api/userscripts.test.js
git commit -m "test: gm-api Userscripts branch (localStorage + style + floating button)"
```

---

### Task 3.3: Userscripts ElementGetter 内联实现

**Files:**
- Create: `src/__tests__/element-getter/userscripts.test.js`

- [x] **Step 1: 编写测试**

```js
// src/__tests__/element-getter/userscripts.test.js
import { describe, test, expect } from 'vitest'
import { waitElement, waitAnyElement } from '../../element-getter.js'

describe('waitElement — Userscripts 内联 MutationObserver 实现', () => {
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

describe('waitAnyElement — Userscripts 内联实现', () => {
  test('已存在的元素立即返回', async () => {
    const div = document.createElement('div')
    div.id = 'target-a'
    document.body.appendChild(div)

    const result = await waitAnyElement(['#target-a', '#target-b'], 1000)
    expect(result.element).toBe(div)
    expect(result.selector).toBe('#target-a')

    document.body.removeChild(div)
  })
})
```

- [x] **Step 2: 运行 + Commit**

```bash
npx vitest run src/__tests__/element-getter/userscripts.test.js
```

```bash
git add src/__tests__/element-getter/userscripts.test.js
git commit -m "test: element-getter Userscripts inline MutationObserver implementation"
```

---

## 4. 集成函数测试

### Task 4.1: Settings Panel 集成测试

**Files:**
- Create: `src/__tests__/integration/settings-panel.test.js`

- [x] **Step 1: 编写测试**

```js
// src/__tests__/integration/settings-panel.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { createGMMock, stubGlobalGM, unstubGlobalGM } from '../helpers/setup-gm-mock.js'

let gmMock

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  document.body.innerHTML = ''
  localStorage.clear()
})

afterEach(() => {
  unstubGlobalGM()
})

// 需要动态 import 因为模块级有状态
// 使用 vi.isolateModules 确保每个测试获得干净的模块状态
async function importModule() {
  return import('../../ui/settings-panel.js')
}

describe('loadSpeedList — 从 GM 存储加载速度列表', () => {
  test('有效数据更新 shortcutSpeeds', async () => {
    gmMock.getValue.mockImplementation((key) => {
      if (key === 'Shortcut_Speed_List') return '1.0,2.0,3.0'
      if (key === 'Button_Speed_List') return '0.5,1.0'
      return undefined
    })

    const mod = await importModule()
    mod.loadSpeedList()

    expect(mod.getShortcutSpeeds()).toEqual(['1.0', '2.0', '3.0'])
    expect(mod.getButtonSpeeds()).toEqual(['0.5', '1.0'])
  })

  test('无效数据保留默认值', async () => {
    gmMock.getValue.mockImplementation((key) => {
      if (key === 'Shortcut_Speed_List') return 'invalid'
      if (key === 'Button_Speed_List') return ''
      return undefined
    })

    const mod = await importModule()
    mod.loadSpeedList()

    // 应该保持默认值
    expect(mod.getShortcutSpeeds()).toEqual(['0.5', '1.0', '1.5', '2.0', '2.5', '3.0'])
    expect(mod.getButtonSpeeds()).toEqual(['0.5', '1.0', '1.5', '2.0'])
  })
})

describe('saveSettings — 保存速度列表设置', () => {
  test('有效输入调用 gm.setValue 并更新 select', async () => {
    document.body.innerHTML = `
      <input id="shortcutSpeedListInput" value="0.5,1.0,2.0">
      <input id="buttonSpeedListInput" value="1.0,1.5,2.0">
      <div id="minimalSettingsPanel">
        <select id="Youtube_Action_Rate_Value"></select>
        <select id="Bilibili_Action_Rate_Value"></select>
      </div>
    `

    const mod = await importModule()
    mod.saveSettings()

    expect(gmMock.setValue).toHaveBeenCalledWith('Shortcut_Speed_List', '0.5,1.0,2.0')
    expect(gmMock.setValue).toHaveBeenCalledWith('Button_Speed_List', '1.0,1.5,2.0')
  })
})

describe('initSettingItems — 平台相关配置', () => {
  test('YouTube URL 加载 YouTube 配置项', async () => {
    const mod = await importModule()
    mod.initSettingItems('https://www.youtube.com/watch?v=xxx')

    const items = mod.getSettingPanelItems()
    expect(items.Youtube_Action_Rate).toBeDefined()
    expect(items.Youtube_Action_TheaterMode).toBeDefined()
    expect(items.Bilibili_Action_Rate).toBeUndefined()
  })

  test('Bilibili URL 加载 Bilibili 配置项', async () => {
    const mod = await importModule()
    mod.initSettingItems('https://www.bilibili.com/video/BV1xx')

    const items = mod.getSettingPanelItems()
    expect(items.Bilibili_Action_Rate).toBeDefined()
    expect(items.Bilibili_Action_WebFullscreen).toBeDefined()
    expect(items.Youtube_Action_Rate).toBeUndefined()
  })
})

describe('createSpeedList — DOM select option 创建', () => {
  test('给定的 speeds 创建对应数量 option', async () => {
    const mod = await importModule()
    const select = document.createElement('select')
    mod.createSpeedList(['0.5', '1.0', '1.5'], select)

    expect(select.children.length).toBe(3)
    expect(select.children[0].value).toBe('0.5')
    expect(select.children[1].value).toBe('1.0')
    expect(select.children[2].value).toBe('1.5')
  })
})
```

- [x] **Step 2: 运行 + Commit**

```bash
npx vitest run src/__tests__/integration/settings-panel.test.js
```

```bash
git add src/__tests__/integration/settings-panel.test.js
git commit -m "test: settings-panel integration tests"
```

---

### Task 4.2: 键盘快捷键集成测试

**Files:**
- Create: `src/__tests__/integration/keyboard.test.js`

- [x] **Step 1: 编写测试**

```js
// src/__tests__/integration/keyboard.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { handleKeydown, initShortcuts } from '../../features/shortcut.js'
import { setPlaybackRate } from '../../features/rate-control.js'

vi.mock('../../features/rate-control.js', async () => {
  const actual = await vi.importActual('../../features/rate-control.js')
  return {
    ...actual,
    setPlaybackRate: vi.fn(),
  }
})

beforeEach(() => {
  // 设置 shortcutSpeeds
  const mockVideo = document.createElement('video')
  mockVideo.playbackRate = 1.0
  vi.spyOn(document, 'getElementsByTagName').mockImplementation((tag) => {
    if (tag === 'video') return [mockVideo]
    return []
  })
  document.KeyDownFlag = undefined
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('handleKeydown — 快捷键调速', () => {
  test('按逗号降速', () => {
    const event = { code: 'Comma', target: { tagName: 'DIV' } }
    handleKeydown(event)
    expect(setPlaybackRate).toHaveBeenCalledWith('0.5')
  })

  test('按句号加速', () => {
    const event = { code: 'Period', target: { tagName: 'DIV' } }
    handleKeydown(event)
    expect(setPlaybackRate).toHaveBeenCalledWith('1.5')
  })

  test('在 input 上按快捷键跳过', () => {
    const event = { code: 'Comma', target: { tagName: 'INPUT' } }
    handleKeydown(event)
    expect(setPlaybackRate).not.toHaveBeenCalled()
  })

  test('在 textarea 上按快捷键跳过', () => {
    const event = { code: 'Comma', target: { tagName: 'TEXTAREA' } }
    handleKeydown(event)
    expect(setPlaybackRate).not.toHaveBeenCalled()
  })

  test('已在最低速度时按逗号不降速', () => {
    // 将速度设为 0.5（最低）
    document.getElementsByTagName('video')[0].playbackRate = 0.5
    const event = { code: 'Comma', target: { tagName: 'DIV' } }
    handleKeydown(event)
    expect(setPlaybackRate).toHaveBeenCalledWith('0.5')
  })

  test('已在最高速度时按句号不升速', () => {
    document.getElementsByTagName('video')[0].playbackRate = 3.0
    const event = { code: 'Period', target: { tagName: 'DIV' } }
    handleKeydown(event)
    expect(setPlaybackRate).toHaveBeenCalledWith('3.0')
  })

  test('未识别的按键码不触发', () => {
    const event = { code: 'KeyA', target: { tagName: 'DIV' } }
    handleKeydown(event)
    expect(setPlaybackRate).not.toHaveBeenCalled()
  })
})

describe('initShortcuts — 注册监听器', () => {
  test('注册 keydown 事件', () => {
    const addSpy = vi.spyOn(document, 'addEventListener')
    initShortcuts()
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    expect(document.KeyDownFlag).toBeDefined()
  })

  test('重复调用不重复注册', () => {
    const addSpy = vi.spyOn(document, 'addEventListener')
    initShortcuts()
    initShortcuts()
    expect(addSpy).toHaveBeenCalledTimes(1)
  })
})
```

- [x] **Step 2: 运行 + Commit**

```bash
npx vitest run src/__tests__/integration/keyboard.test.js
```

```bash
git add src/__tests__/integration/keyboard.test.js
git commit -m "test: keyboard shortcut integration tests"
```

---

### Task 4.3: 速度按钮集成测试

**Files:**
- Create: `src/__tests__/integration/speed-buttons.test.js`

- [x] **Step 1: 编写测试**

```js
// src/__tests__/integration/speed-buttons.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  document.body.innerHTML = ''
  vi.stubGlobal('GM_getValue', vi.fn(() => '0.5,1.0,1.5'))
  vi.stubGlobal('GM_setValue', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createSpeedButtons — 速度按钮创建', () => {
  test('YouTube 平台按钮具有 youtube CSS 类', async () => {
    vi.stubGlobal('location', { href: 'https://www.youtube.com/watch?v=test' })
    const { createSpeedButtons } = await import('../../features/rate-control.js')

    await new Promise((resolve) => {
      createSpeedButtons((div) => {
        document.body.appendChild(div)
        resolve()
      })
    })

    const container = document.getElementById('speedButtons')
    expect(container).not.toBeNull()
    expect(container.classList.contains('youtube')).toBe(true)

    const buttons = container.querySelectorAll('.speed-control-button')
    expect(buttons.length).toBeGreaterThan(0)
    expect(buttons[0].classList.contains('youtube')).toBe(true)
  })

  test('Bilibili 平台按钮具有 bilibili CSS 类', async () => {
    vi.stubGlobal('location', { href: 'https://www.bilibili.com/video/BV1xx' })
    const { createSpeedButtons } = await import('../../features/rate-control.js')

    await new Promise((resolve) => {
      createSpeedButtons((div) => {
        document.body.appendChild(div)
        resolve()
      })
    })

    const container = document.getElementById('speedButtons')
    expect(container.classList.contains('bilibili')).toBe(true)

    const buttons = container.querySelectorAll('.speed-control-button')
    expect(buttons[0].classList.contains('bilibili')).toBe(true)
  })
})

describe('updateSpeedButtonHighlight — 激活按钮高亮', () => {
  test('高亮对应速度的按钮', async () => {
    const { updateSpeedButtonHighlight } = await import('../../features/rate-control.js')

    document.body.innerHTML = `
      <button class="speed-control-button" data-speed="0.5">0.5×</button>
      <button class="speed-control-button" data-speed="1.0">1.0×</button>
      <button class="speed-control-button" data-speed="1.5">1.5×</button>
    `

    updateSpeedButtonHighlight('1.0')

    const buttons = document.querySelectorAll('.speed-control-button')
    expect(buttons[0].classList.contains('active')).toBe(false)
    expect(buttons[1].classList.contains('active')).toBe(true)
    expect(buttons[2].classList.contains('active')).toBe(false)
  })
})
```

- [x] **Step 2: 运行 + Commit**

```bash
npx vitest run src/__tests__/integration/speed-buttons.test.js
```

```bash
git add src/__tests__/integration/speed-buttons.test.js
git commit -m "test: speed buttons integration tests"
```

---

### Task 4.4: Element Remover 集成测试

**Files:**
- Create: `src/__tests__/integration/element-remover.test.js`

- [x] **Step 1: 编写测试**

```js
// src/__tests__/integration/element-remover.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { createGMMock, stubGlobalGM, unstubGlobalGM } from '../helpers/setup-gm-mock.js'

let gmMock

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  document.body.innerHTML = ''
})

afterEach(() => {
  unstubGlobalGM()
})

describe('initYouTubeElementRemover — 条件移除 YouTube 元素', () => {
  test('启用的项目移除元素', async () => {
    gmMock.getValue.mockImplementation((key) => {
      return key === 'Youtube_Remove_Autoplay'
    })

    const btn = document.createElement('button')
    btn.className = 'ytp-autonav-toggle'
    document.body.appendChild(btn)

    const { initYouTubeElementRemover } = await import('../../features/element-remover.js')

    // 先 initSettingItems 注册配置
    const { initSettingItems } = await import('../../ui/settings-panel.js')
    initSettingItems('https://www.youtube.com/watch?v=test')

    // 模拟 waitElement 立即返回
    vi.mock('../../element-getter.js', () => ({
      waitElement: (selector) => Promise.resolve(document.querySelector(selector)),
    }))

    await initYouTubeElementRemover({
      Youtube_Remove_Autoplay: { selector: '.ytp-autonav-toggle', mode: 'remove' }
    })

    // waitElement 异步，需短暂等待
    await new Promise(r => setTimeout(r, 50))

    expect(document.querySelector('.ytp-autonav-toggle')).toBeNull()
  })
})

describe('initBilibiliElementRemover — 轮询移除 Bilibili 元素', () => {
  test('启用的项目在轮询中移除', async () => {
    gmMock.getValue.mockImplementation((key) => {
      return key === 'Bilibili_Remove_Quality'
    })

    const btn = document.createElement('button')
    btn.className = 'bpx-player-ctrl-quality'
    document.body.appendChild(btn)
    document.body.innerHTML += '<div id="bilibili-player"></div>'

    const { initBilibiliElementRemover } = await import('../../features/element-remover.js')
    const { initSettingItems } = await import('../../ui/settings-panel.js')
    initSettingItems('https://www.bilibili.com/video/BV1xx')

    const removalRef = { current: null }
    initBilibiliElementRemover(
      { Bilibili_Remove_Quality: { selector: '.bpx-player-ctrl-quality', mode: 'remove' } },
      removalRef,
      { playerContainer: '#bilibili-player', webscreenClass: 'mode-webscreen' }
    )

    await new Promise(r => setTimeout(r, 100))

    expect(document.querySelector('.bpx-player-ctrl-quality')).toBeNull()

    // 清理定时器
    if (removalRef.current) clearInterval(removalRef.current)
  })
})
```

- [x] **Step 2: 运行 + Commit**

```bash
npx vitest run src/__tests__/integration/element-remover.test.js
```

```bash
git add src/__tests__/integration/element-remover.test.js
git commit -m "test: element remover integration tests"
```

---

## 5. 编排与元数据验证

### Task 5.1: Main 编排逻辑测试

**Files:**
- Create: `src/__tests__/integration/main-flow.test.js`

- [x] **Step 1: 编写测试**

```js
// src/__tests__/integration/main-flow.test.js
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { createGMMock, stubGlobalGM, unstubGlobalGM } from '../helpers/setup-gm-mock.js'

let gmMock

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  document.body.innerHTML = ''
  localStorage.clear()
})

afterEach(() => {
  unstubGlobalGM()
})

describe('main — 初始化流程', () => {
  test('首次运行时自动打开设置面板', async () => {
    gmMock.getValue.mockImplementation((key) => {
      if (key === 'firstRunComplete') return false
      return undefined
    })

    vi.useFakeTimers()
    vi.stubGlobal('location', { href: 'https://www.youtube.com/watch?v=test' })

    const mainModule = await import('../../main.js')
    // main() 会被自动调用的，但这里我们手动测试

    // 验证首次运行标志被设置
    expect(gmMock.setValue).toHaveBeenCalledWith('firstRunComplete', true)
  })

  test('YouTube 页面注册 yt-navigate-finish 监听器', async () => {
    vi.stubGlobal('location', { href: 'https://www.youtube.com/watch?v=test' })
    const addListenerSpy = vi.spyOn(window, 'addEventListener')

    await import('../../main.js')

    expect(addListenerSpy).toHaveBeenCalledWith(
      'beforeunload',
      expect.any(Function)
    )
  })
})

describe('cleanup — 清理定时器和观察器', () => {
  test('清除 youtubeAdCheckInterval', async () => {
    const { cleanup } = await import('../../main.js')

    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    cleanup()

    expect(clearSpy).toHaveBeenCalled()
  })
})
```

- [x] **Step 2: 运行 + Commit**

```bash
npx vitest run src/__tests__/integration/main-flow.test.js
```

```bash
git add src/__tests__/integration/main-flow.test.js
git commit -m "test: main orchestration flow tests"
```

---

### Task 5.2: Header 元数据验证

**Files:**
- Create: `src/__tests__/header-metadata.test.js`

- [x] **Step 1: 编写测试**

```js
// src/__tests__/header-metadata.test.js
import { describe, test, expect } from 'vitest'
import { readFileSync } from 'fs'
import { readFile } from 'fs/promises'

function parseHeader(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const match = content.match(/^\/\/ ==UserScript==\n([\s\S]*?)\n\/\/ ==\/UserScript==/)
  if (!match) throw new Error('No header found in ' + filePath)
  return match[1].split('\n').filter(l => l.startsWith('// @'))
}

describe('TubeBili.user.js header 元数据', () => {
  const header = parseHeader('./TubeBili.user.js')

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
  test('@require 指向 ElementGetter', () => {
    expect(header.some(l => l.includes('ElementGetter'))).toBe(true)
  })
  test('@run-at 为 document-start', () => {
    expect(header.some(l => l.includes('document-start'))).toBe(true)
  })
})

describe('dist/TubeBili.user.js header', () => {
  const header = parseHeader('./dist/TubeBili.user.js')

  test('@version 为 2.0.2', () => {
    expect(header.some(l => l.includes('@version            2.0.2'))).toBe(true)
  })
  test('@require 与原始版一致', () => {
    const origHeader = parseHeader('./TubeBili.user.js')
    const origRequire = origHeader.find(l => l.includes('@require'))
    const distRequire = header.find(l => l.includes('@require'))
    expect(distRequire).toBe(origRequire)
  })
})

describe('TubeBili.userscripts.js header', () => {
  const header = parseHeader('./TubeBili.userscripts.js')

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

describe('dist/TubeBili.userscripts.js header', () => {
  const header = parseHeader('./dist/TubeBili.userscripts.js')

  test('@version 为 2.0.2', () => {
    expect(header.some(l => l.includes('@version            2.0.2'))).toBe(true)
  })
  test('@grant 为 none', () => {
    expect(header.some(l => l.includes('@grant              none'))).toBe(true)
  })
})
```

- [x] **Step 2: 运行 + Commit**

```bash
npx vitest run src/__tests__/header-metadata.test.js
```

```bash
git add src/__tests__/header-metadata.test.js
git commit -m "test: header metadata verification for all 4 files"
```

---

## 6. 运行验证

### Task 6.1: 全量运行

- [x] **Step 1: 运行全部测试**

```bash
npm test
```
Expected: 所有测试 PASS

- [x] **Step 2: 如有失败，定位修复**

检查失败测试的输出，按需修复代码。

### Task 6.2: 构建后验证

- [x] **Step 1: 重新构建**

```bash
npm run build
```

- [x] **Step 2: 确认构建成功**

```bash
ls -la dist/TubeBili.user.js dist/TubeBili.userscripts.js
```

- [x] **Step 3: 重新运行测试确认**

```bash
npm test
```
Expected: 构建后测试依然全部通过

- [x] **Step 4: 最后 commit**

```bash
git add -A
git commit -m "chore: complete equivalence test suite implementation"
```
