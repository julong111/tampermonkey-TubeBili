---
comet_change: equivalence-test-suite
role: technical-design
canonical_spec: openspec
---

# 等价测试套件 — 技术设计文档

## 1. 目标

构建自动化测试基础设施，验证工程化重构后的构建产物与原版脚本行为等价。被测四文件：

| 目标平台 | 原始版本 | 构建版本 |
|----------|---------|---------|
| Tampermonkey | `TubeBili.user.js` (1465 行) | `dist/TubeBili.user.js` (1499 行) |
| Userscripts (Safari) | `TubeBili.userscripts.js` (1694 行) | `dist/TubeBili.userscripts.js` (1606 行) |

## 2. 架构

```
测试执行: Vitest (Node.js)
DOM 模拟: jsdom
旧版加载: VM 沙箱注入

            ┌─────────────────────────┐
            │     vitest runner       │
            └──┬──────────┬───────────┘
               │          │
     ┌─────────▼──┐  ┌───▼──────────┐
     │ 等价对比测试 │  │ 集成测试      │
     │ (equivalence)│  │ (integration) │
     └──────┬──────┘  └───┬──────────┘
            │             │
     ┌──────▼──────┐     │
     │ 旧版沙箱    │     │
     │ load-*-tm  │     │
     │ load-*-us  ├─────┤
     └─────────────┘     │
                    ┌────▼────┐
                    │ vi.mock │
                    │ GM_*    │
                    │ loc     │
                    │ DOM     │
                    └─────────┘
```

## 3. 核心技术方案

### 3.1 旧版代码加载（VM 沙箱注入）

核心问题：原始脚本是封闭 IIFE，内部变量对外不可见。测试需要访问其函数引用。

解法：用 Node.js `vm.createContext` 创建沙箱，机械替换文件末尾的 `})()` 闭合，注入一行捕获代码，将 `Common` 等内部变量暴露到 `globalThis.__TB_ORIG`。同时替换 `main()` 调用为捕获语句，防止自动执行产生副作用。

```js
// 原始结尾:
  window.addEventListener("beforeunload", cleanup);
  main();
})();

// 替换为:
  globalThis.__TB_ORIG = {
    Common, sys, main, cleanup,
    isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage,
    youtubeSelectors, bilibiliSelectors,
    youtube_removal_items, bilibili_removal_items,
    handleYoutubePage, handleBilibiliPage,
    initYoutubeListeners, initBilibiliListener,
  };
})();
```

### 3.2 两套加载器

- **`load-original-tampermonkey.js`** — 加载 `TubeBili.user.js`，mock `GM_getValue`、`GM_setValue`、`GM_addStyle`、`GM_registerMenuCommand` 和外部 ElementGetter
- **`load-original-userscripts.js`** — 加载 `TubeBili.userscripts.js`，该脚本自带 GM_Polyfill（使用 localStorage）和内联 MutationObserver 实现的 ElementGetter，只需提供 localStorage 和 DOM 环境

### 3.3 等价对比方法

对同一组 inputs，同时调旧版和新版，断言输出一致：

```js
test('validateSpeedList 等价', () => {
  const old = original.Common.validateSpeedList('0.5,1.0,1.5,2.0')
  const now = validateSpeedList('0.5,1.0,1.5,2.0')
  expect(now).toEqual(old)
})
```

## 4. 测试层级

### P0 — 纯函数等价对比（无需任何 mock）

| 函数 | 源文件 | 测试文件 | 用例数 |
|------|--------|---------|-------|
| `validateSpeedList` | settings-panel.js | `equivalence/validate-speed-list.test.js` | ~25 |
| `detectLanguage`, `t()` | i18n.js | `equivalence/detect-language.test.js` | ~14 |
| `isYoutubePage` 等 | main.js | `equivalence/url-detection.test.js` | ~14 |

### P1 — GM API 层测试（条件分支验证）

| 函数 | `__TARGET__='tampermonkey'` | `__TARGET__='userscripts'` | 测试文件 |
|------|----------------------------|---------------------------|---------|
| `gm.getValue` | 调用 `GM_getValue` | `localStorage.getItem('TubeBili_'+key)` + 类型解析 | `gm-api/tampermonkey.test.js`, `gm-api/userscripts.test.js` |
| `gm.setValue` | 调用 `GM_setValue` | `localStorage.setItem` | 同上 |
| `gm.addStyle` | 调用 `GM_addStyle` | 创建 `<style>` 元素 + `head.appendChild` | 同上 |
| `gm.registerMenuCommand` | 调用 `GM_registerMenuCommand` | `createFloatingButton` 创建浮动按钮 | 同上 |
| `waitElement` | `ElementGetter.get()` | 内联 MutationObserver 实现 | `element-getter/userscripts.test.js` |

### P2 — 集成测试（mock GM + DOM）

| 模块 | 测试文件 | 覆盖函数 |
|------|---------|---------|
| settings-panel | `integration/settings-panel.test.js` | `loadSpeedList`, `updateSpeedSelects`, `createSettingItem`, `saveSettings`, `togglePanel`, `initSettingItems` |
| shortcut | `integration/keyboard.test.js` | `handleKeydown` (Comma/Period、边界、input 跳过) |
| rate-control | `integration/speed-buttons.test.js` | `createSpeedButtons`, `setPlaybackRate`, `showSpeedIndicator`, `updateSpeedButtonHighlight` |
| element-remover | `integration/element-remover.test.js` | `initYouTubeElementRemover`, `initBilibiliElementRemover` |
| main | `integration/main-flow.test.js` | `main()` 初始化流程、平台分发、`cleanup` |

### P3 — 元数据验证

`header-metadata.test.js` 验证四个文件的 UserScript header 与模板一致：@version、@grant、@match schema 等。

## 5. 测试数据

```js
// validateSpeedList 测试用例（部分）
const testCases = [
  // 有效输入
  { input: '0.5,1.0,1.5,2.0',     expect: { valid: true, speeds: ['0.5','1.0','1.5','2.0'] } },
  { input: '0.5，1.0，1.5，2.0',    expect: { valid: true, speeds: ['0.5','1.0','1.5','2.0'] } }, // 中文逗号
  { input: ' 0.5 , 1.0 ',          expect: { valid: true, speeds: ['0.5','1.0'] } },              // 带空格
  { input: '0.5',                  expect: { valid: true, speeds: ['0.5'] } },                     // 单值
  { input: '0.1',                  expect: { valid: true, speeds: ['0.1'] } },                     // 下限
  { input: '10.0',                 expect: { valid: true, speeds: ['10.0'] } },                    // 上限
  // 无效输入
  { input: '',                     expect: { valid: false } },
  { input: null,                   expect: { valid: false } },
  { input: 'abc',                  expect: { valid: false } },
  { input: '1.2.3',                expect: { valid: false } },
  { input: '0.05',                 expect: { valid: false } },  // 小于 0.1
  { input: '10.1',                 expect: { valid: false } },  // 大于 10
  { input: '-1.0',                 expect: { valid: false } },
]
```

```js
// detectLanguage 测试用例
const langCases = [
  { lang: 'zh-CN', expect: 'zh' },
  { lang: 'zh-TW', expect: 'zh' },
  { lang: 'en-US', expect: 'en' },
  { lang: 'fr-FR', expect: 'en' },
]
```

```js
// URL 检测测试用例
const urlCases = [
  // isYoutubePage
  { url: 'https://www.youtube.com/watch?v=xxx',     fn: 'isYoutubePage', expect: true },
  { url: 'https://www.youtube.com/',                fn: 'isYoutubePage', expect: true },
  { url: 'https://www.bilibili.com/video/BV1xx',    fn: 'isYoutubePage', expect: false },
]
```

## 6. 文件变动清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 修改 | `package.json` | 添加 vitest + jsdom devDependencies, test scripts |
| 新建 | `vitest.config.js` | environment: jsdom |
| 新建 | `src/__tests__/helpers/load-original-tampermonkey.js` | VM 沙箱加载原始 Tampermonkey 脚本 |
| 新建 | `src/__tests__/helpers/load-original-userscripts.js` | VM 沙箱加载原始 Userscripts 脚本 |
| 新建 | `src/__tests__/helpers/setup-gm-mock.js` | 通用 GM mock 工厂 |
| 新建 | `src/__tests__/equivalence/validate-speed-list.test.js` | P0 |
| 新建 | `src/__tests__/equivalence/detect-language.test.js` | P0 |
| 新建 | `src/__tests__/equivalence/url-detection.test.js` | P0 |
| 新建 | `src/__tests__/gm-api/tampermonkey.test.js` | P1 |
| 新建 | `src/__tests__/gm-api/userscripts.test.js` | P1 |
| 新建 | `src/__tests__/element-getter/userscripts.test.js` | P1 |
| 新建 | `src/__tests__/integration/settings-panel.test.js` | P2 |
| 新建 | `src/__tests__/integration/keyboard.test.js` | P2 |
| 新建 | `src/__tests__/integration/speed-buttons.test.js` | P2 |
| 新建 | `src/__tests__/integration/element-remover.test.js` | P2 |
| 新建 | `src/__tests__/integration/main-flow.test.js` | P2 |
| 新建 | `src/__tests__/header-metadata.test.js` | P3 |

所有新建文件均为测试代码，不修改任何业务源码或构建配置。
