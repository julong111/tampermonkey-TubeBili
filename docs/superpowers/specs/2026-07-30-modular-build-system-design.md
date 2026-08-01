---
comet_change: modular-build-system
role: technical-design
canonical_spec: openspec
archived-with: 2026-07-30-modular-build-system
status: final
---

# TubeBili 模块化构建系统 — 技术设计文档

## 1. 概述

将 TubeBili 从两个独立的 userscript 单体文件重构为 `src/` 下细粒度模块，通过 Rollup 构建工具输出两个平台版本（Tampermonkey / Safari Userscripts），不修改任何现有功能。

## 2. 构建系统

### 2.1 Rollup 多目标输出

一份 `rollup.config.js` 声明两个 output target：

```js
// rollup.config.js 核心结构
export default [
  {
    input: 'src/main.js',
    output: { file: 'dist/TubeBili.user.js', format: 'iife' },
    plugins: [
      replace({ __TARGET__: JSON.stringify('tampermonkey') }),
      // ...
    ]
  },
  {
    input: 'src/main.js',
    output: { file: 'dist/TubeBili.userscripts.js', format: 'iife' },
    plugins: [
      replace({ __TARGET__: JSON.stringify('userscripts') }),
      // ...
    ]
  }
];
```

### 2.2 Header 注入

使用 Rollup `banner` 选项注入 UserScript header。Tampermonkey 版包含 `@require` 和 `@grant` 声明，Safari 版使用 `@grant none`。版本号从 `package.json` 读取。

### 2.3 条件编译

`__TARGET__` 全局变量在构建时替换为 `'tampermonkey'` 或 `'userscripts'` 字面量。源码中 `if (__TARGET__ === 'userscripts')` 分支在 TM 构建中被 tree-shaking 消除，反之亦然。

## 3. 平台适配层

### 3.1 GM API 适配器

```js
// src/gm-api.js
export const gm = {
  getValue(key, defaultVal) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_getValue(key, defaultVal);
    }
    // Safari: localStorage Polyfill
    const val = localStorage.getItem('TubeBili_' + key);
    if (val === null) return defaultVal;
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (!isNaN(val) && val !== '') return Number(val);
    return val;
  },
  setValue(key, val) { ... },
  addStyle(css) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_addStyle(css);
    }
    // Safari: createElement('style')
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return style;
  },
  registerMenuCommand(name, callback) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_registerMenuCommand(name, callback);
    }
    // Safari: 浮动按钮
    createFloatingButton(name, callback);
  }
};
```

### 3.2 ElementGetter

```js
// src/element-getter.js
// TM 版：由 @require 提供全局 ElementGetter
// Safari 版：内联 MutationObserver 实现
export const waitElement = (selector, timeout = 10000) => {
  if (__TARGET__ === 'tampermonkey') {
    return ElementGetter.get(selector, timeout);
  }
  return inlineWaitElement(selector, timeout);
};
export const waitAnyElement = (selectors, timeout = 10000) => {
  if (__TARGET__ === 'tampermonkey') {
    return ElementGetter.any(selectors, timeout);
  }
  return inlineWaitAnyElement(selectors, timeout);
};
```

内联实现使用 MutationObserver 监听 DOM 变化，支持超时拒绝（Promise）。

## 4. 模块结构

```
src/
├── gm-api.js              # GM API 适配器（条件编译）
├── element-getter.js      # Element 等待（条件编译）
├── i18n.js                # 国际化字典（共享）
├── ui/
│   ├── settings-panel.js  # 设置面板（共享）
│   ├── styles.js          # CSS 样式（共享，统一白色半透明）
│   └── floating-btn.js    # Safari 浮动按钮（userscripts only）
├── features/
│   ├── rate-control.js    # 自动倍速
│   ├── shortcut.js        # 快捷键 . , 调速
│   ├── element-remover.js # 移除按钮/元素（interval 统一 1000ms）
│   └── bilibili/
│       ├── web-fullscreen.js
│       └── ad-trial.js    # 1080P 试用（已注释）
├── platforms/
│   ├── youtube.js         # YouTube 特定（影院模式、自动播放等）
│   └── bilibili.js        # Bilibili 特定（网页全屏、分辨率等）
└── main.js                # 入口 + 清理逻辑（cleanup 两版本统一）
```

## 5. 差异统一处理

| 差异点 | TM 原值 | Safari 原值 | 统一值 |
|--------|---------|-------------|--------|
| 按钮背景色 | `rgba(255,255,255,0.2)` | `rgba(0,0,0,0.6)` | 白色半透明 |
| 按钮边框 | `1px solid rgba(255,255,255,0.4)` | `1px solid rgba(255,255,255,0.3)` | TM 值 |
| Bilibili 移除间隔 | 200ms | 1000ms | 1000ms |
| Cleanup clearInterval | 无 | 有 | 两版本均添加 |

## 6. 构建验证策略

1. 运行 `npm run build` → 输出 `dist/TubeBili.user.js` 和 `dist/TubeBili.userscripts.js`
2. 对比构建产物与原始文件的核心功能：运行在 YouTube/Bilibili 上测试倍速、快捷键、设置面板等
3. 原始文件保留不动，作为回归对照

## 7. 风险与缓解

| 风险 | 缓解 |
|------|------|
| @require ElementGetter 与内联实现 API 不一致 | 验证 TM 构建后通过 @require 加载的 ElementGetter 接口与内联实现完全一致 |
| 重构过程中遗漏平台差异点 | 基于完整 diff 逐项确认清单，构建后做功能回归 |
| Rollup 配置复杂 | 配置集中管理，后续新增平台只需加新 target |
