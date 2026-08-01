---
change: modular-build-system
design-doc: docs/superpowers/specs/2026-07-30-modular-build-system-design.md
base-ref: d897bc9b0b7b5bb0548f52905cc9a628cde41e66
archived-with: 2026-07-30-modular-build-system
---

# TubeBili 模块化构建系统 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将两个 userscript 单体文件重构为 `src/` 模块化源码，通过 Rollup 构建输出两个平台版本，不修改功能。

**Architecture:** 单入口 `src/main.js`，按功能拆分为 15+ 个小模块，Rollup 双 target 构建，`__TARGET__` 条件编译处理平台差异，tree-shaking 消除死代码。

**Tech Stack:** JavaScript (ES6), Rollup

## Global Constraints

- 不修改任何现有功能逻辑
- 不新增功能
- 输出文件名必须为 `dist/TubeBili.user.js` 和 `dist/TubeBili.userscripts.js`
- 根目录原始文件 `TubeBili.user.js` 和 `TubeBili.userscripts.js` 保留不动
- 按钮样式统一为白色半透明 `rgba(255,255,255,0.2)`
- Bilibili 移除间隔统一为 1000ms
- Cleanup 逻辑两版本均添加

---

## 1. 项目初始化

### Task 1.1: 创建 package.json

**Files:**
- Create: `package.json`

**Interfaces:**
- Consumes: none
- Produces: npm 项目骨架

- [x] **Step 1: 创建 package.json**

```json
{
  "name": "tubebili",
  "version": "2.0.2",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w"
  },
  "devDependencies": {
    "rollup": "^4.0.0",
    "@rollup/plugin-replace": "^6.0.0",
    "@rollup/plugin-terser": "^0.4.0"
  }
}
```

- [x] **Step 2: 安装依赖**

```bash
npm install
```

### Task 1.2: 创建目录结构

**Files:**
- Create: `src/`, `src/ui/`, `src/features/`, `src/features/bilibili/`, `src/platforms/`, `scripts/`, `dist/`

- [x] **Step 1: 创建目录**

```bash
mkdir -p src/ui src/features/bilibili src/platforms scripts dist
```

### Task 1.3: 创建 rollup.config.js

**Files:**
- Create: `rollup.config.js`

**Interfaces:**
- Consumes: 所有 src/ 模块, scripts/header-*.js
- Produces: 双 target 构建配置

- [x] **Step 1: 创建 rollup.config.js**

```js
import replace from '@rollup/plugin-replace';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const tampermonkeyHeader = readFileSync('./scripts/header-tampermonkey.js', 'utf8');
const userscriptsHeader = readFileSync('./scripts/header-userscripts.js', 'utf8');

function replaceVersion(str) {
  return str.replace(/\$\{version\}/g, pkg.version);
}

export default [
  {
    input: 'src/main.js',
    output: {
      file: 'dist/TubeBili.user.js',
      format: 'iife',
      banner: replaceVersion(tampermonkeyHeader),
    },
    plugins: [
      replace({
        preventAssignment: true,
        __TARGET__: JSON.stringify('tampermonkey'),
      }),
    ],
  },
  {
    input: 'src/main.js',
    output: {
      file: 'dist/TubeBili.userscripts.js',
      format: 'iife',
      banner: replaceVersion(userscriptsHeader),
    },
    plugins: [
      replace({
        preventAssignment: true,
        __TARGET__: JSON.stringify('userscripts'),
      }),
    ],
  },
];
```

## 2. Header 模板

### Task 2.1: 创建 Tampermonkey header 模板

**Files:**
- Create: `scripts/header-tampermonkey.js`

- [x] **Step 1: 创建 header 文件**

```js
export default `// ==UserScript==
// @name               TubeBili - YouTube(油管) Bilibili(B站) 视频增强工具
// @name:en            TubeBili - YouTube Bilibili Video Player Enhancer Tools
// @namespace          com.julong.tampermonkey.TubeBiliVideoPlayerEnhancerTools
// @version            ${version}
// @author             julong@111.com
// @description        自动网页全屏、自定义倍速列表、快捷键一键调速、界面漂亮，让您摆脱繁琐操作，专注享受视频 | by julong
// @description:en     Auto web fullscreen, custom speed list, hotkey speed control, beautiful UI. Say goodbye to tedious operations and focus on enjoying videos | by julong
// @license            MIT
// @icon               https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @homepage           https://github.com/julong111/tampermonkey-TubeBili
// @supportURL         https://github.com/julong111/tampermonkey-TubeBili/issues
// @downloadURL        https://github.com/julong111/tampermonkey-TubeBili/raw/main/TubeBili.user.js
// @updateURL          https://github.com/julong111/tampermonkey-TubeBili/raw/main/TubeBili.user.js
// @match              https://*.youtube.com/*
// @match              https://*.bilibili.com/*
// @exclude            https://accounts.youtube.com/*
// @require            https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// @run-at             document-start
// ==/UserScript==
`;
```

### Task 2.2: 创建 Safari Userscripts header 模板

**Files:**
- Create: `scripts/header-userscripts.js`

- [x] **Step 1: 创建 header 文件**

```js
export default `// ==UserScript==
// @name               TubeBili - YouTube(油管) Bilibili(B站) 视频增强工具 (Safari/通用版)
// @name:en            TubeBili - YouTube Bilibili Video Player Enhancer Tools (Safari/Universal)
// @namespace          com.julong.userscripts.TubeBiliVideoPlayerEnhancerTools
// @version            ${version}-safari
// @author             julong@111.com
// @description        自动网页全屏、自定义倍速列表、快捷键一键调速、界面漂亮，让您摆脱繁琐操作，专注享受视频 | by julong
// @description:en     Auto web fullscreen, custom speed list, hotkey speed control, beautiful UI. Say goodbye to tedious operations and focus on enjoying videos | by julong
// @license            MIT
// @icon               https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @homepage           https://github.com/julong111/tampermonkey-TubeBili
// @supportURL         https://github.com/julong111/tampermonkey-TubeBili/issues
// @match              *://*.youtube.com/*
// @match              *://*.bilibili.com/*
// @exclude            *://accounts.youtube.com/*
// @run-at             document-start
// @grant              none
// ==/UserScript==
`;
```

## 3. GM API 抽象层

### Task 3.1: 创建统一 GM API 接口

**Files:**
- Create: `src/gm-api.js`

**Interfaces:**
- Produces: `gm.getValue(key, defaultVal)`, `gm.setValue(key, val)`, `gm.addStyle(css)`, `gm.registerMenuCommand(name, callback)`

- [x] **Step 1: 创建 gm-api.js**

```js
export const gm = {
  getValue(key, defaultValue) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_getValue(key, defaultValue);
    }
    try {
      const value = localStorage.getItem('TubeBili_' + key);
      if (value === null) return defaultValue;
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (!isNaN(value) && value !== '') return Number(value);
      return value;
    } catch (e) {
      console.warn('[TubeBili] localStorage read failed:', e);
      return defaultValue;
    }
  },

  setValue(key, value) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_setValue(key, value);
    }
    try {
      localStorage.setItem('TubeBili_' + key, String(value));
      return Promise.resolve();
    } catch (e) {
      console.warn('[TubeBili] localStorage write failed:', e);
      return Promise.reject(e);
    }
  },

  addStyle(css) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_addStyle(css);
    }
    const style = document.createElement('style');
    style.textContent = css;
    style.setAttribute('data-tubebili-style', 'true');
    if (document.head) {
      document.head.appendChild(style);
    } else {
      const addWhenReady = () => {
        if (document.head) {
          document.head.appendChild(style);
          document.removeEventListener('DOMContentLoaded', addWhenReady);
        }
      };
      document.addEventListener('DOMContentLoaded', addWhenReady);
    }
    return style;
  },

  registerMenuCommand(name, callback) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_registerMenuCommand(name, callback);
    }
    createFloatingButton(name, callback);
  }
};

function createFloatingButton(name, callback) {
  if (document.getElementById('tubeBiliFloatingBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'tubeBiliFloatingBtn';
  btn.textContent = '⚙️';
  btn.title = name;
  Object.assign(btn.style, {
    position: 'fixed',
    top: '5%',
    right: '-25px',
    width: '40px',
    height: '40px',
    borderRadius: '8px 0 0 8px',
    background: 'rgba(59, 130, 246, 0.9)',
    opacity: '0.3',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: '2147483647',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    WebkitBackdropFilter: 'blur(10px)',
    backdropFilter: 'blur(10px)',
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.right = '20px';
    btn.style.opacity = '1';
    btn.style.transform = 'scale(1.1)';
    btn.style.background = 'rgba(37, 99, 235, 1)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.right = '-25px';
    btn.style.opacity = '0.3';
    btn.style.transform = 'scale(1)';
    btn.style.background = 'rgba(37, 99, 235, 0.8)';
  });
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  });

  const appendBtn = () => {
    if (document.body) {
      document.body.appendChild(btn);
    } else {
      requestAnimationFrame(appendBtn);
    }
  };
  appendBtn();

  const hideStyle = document.createElement('style');
  hideStyle.textContent = `
    body:has(#minimalSettingsPanel.show) #tubeBiliFloatingBtn {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.8);
    }
  `;
  if (document.head) document.head.appendChild(hideStyle);
}
```

## 4. ElementGetter 模块

### Task 4.1: 创建统一 ElementGetter 接口

**Files:**
- Create: `src/element-getter.js`

**Interfaces:**
- Produces: `waitElement(selector, timeout)`, `waitAnyElement(selectors, timeout)`

- [x] **Step 1: 创建 element-getter.js**

```js
export function waitElement(selector, timeout = 10000) {
  if (__TARGET__ === 'tampermonkey') {
    return ElementGetter.get(selector, timeout);
  }
  return inlineGet(selector, timeout);
}

export function waitAnyElement(selectors, timeout = 10000) {
  if (__TARGET__ === 'tampermonkey') {
    return ElementGetter.any(selectors, timeout);
  }
  return inlineAny(selectors, timeout);
}

// Safari 内联实现
function inlineGet(selector, timeout) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) { resolve(el); return; }

    const observer = new MutationObserver((mutations, obs) => {
      const el = document.querySelector(selector);
      if (el) {
        obs.disconnect();
        clearTimeout(timer);
        resolve(el);
      }
    });

    const target = document.documentElement || document.body;
    if (target) observer.observe(target, { childList: true, subtree: true });

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element not found: ${selector}`));
    }, timeout);
  });
}

function inlineAny(selectors, timeout) {
  return new Promise((resolve, reject) => {
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el) { resolve({ element: el, selector: s }); return; }
    }

    const observer = new MutationObserver((mutations, obs) => {
      for (const s of selectors) {
        const el = document.querySelector(s);
        if (el) {
          obs.disconnect();
          clearTimeout(timer);
          resolve({ element: el, selector: s });
          return;
        }
      }
    });

    const target = document.documentElement || document.body;
    if (target) observer.observe(target, { childList: true, subtree: true });

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`No elements found: ${selectors.join(', ')}`));
    }, timeout);
  });
}
```

## 5. 核心模块抽取

### Task 5.1: 创建 i18n.js

**Files:**
- Create: `src/i18n.js`

**Interfaces:**
- Produces: `i18n` 对象包含 `zh` 和 `en` 字典，`get(key, lang)` 方法

- [x] **Step 1: 从原始文件抽取 i18n 字典**

从 `TubeBili.user.js` 第 57-158 行完整复制所有 i18n 字典条目（zh 和 en），合并为一个文件并默认导出。

### Task 5.2: 创建样式模块

**Files:**
- Create: `src/ui/styles.js`

**Interfaces:**
- Produces: `injectStyles()` 注入所有 CSS

- [x] **Step 1: 从原始文件抽取所有 CSS 样式**

从双文件抽取全部 CSS-in-JS 样式。按钮背景色统一为 `rgba(255,255,255,0.2)`，边框 `1px solid rgba(255,255,255,0.4)`，文字色 `#ffffff`。

### Task 5.3: 创建设置面板 UI

**Files:**
- Create: `src/ui/settings-panel.js`

**Interfaces:**
- Consumes: `gm`, `i18n`
- Produces: `createSettingsPanel()`

- [x] **Step 1: 抽取设置面板代码**

从原始文件抽取 `createMinimalSettingsPanel` 或等效面板创建函数，保持完全相同的 HTML 结构和样式。

### Task 5.4: 创建倍速控制模块

**Files:**
- Create: `src/features/rate-control.js`

**Interfaces:**
- Consumes: `gm`, `i18n`
- Produces: `initRateControl(videoElement)`

- [x] **Step 1: 抽取自动倍速逻辑**

从原始文件抽取自动倍速播放功能，保持完全相同的倍速检测和设置逻辑。

### Task 5.5: 创建快捷键模块

**Files:**
- Create: `src/features/shortcut.js`

**Interfaces:**
- Produces: `initShortcuts(videoElement)`

- [x] **Step 1: 抽取快捷键逻辑**

从原始文件抽取 `,`（减速）和 `.`（加速）快捷键处理逻辑。

### Task 5.6: 创建元素移除模块

**Files:**
- Create: `src/features/element-remover.js`

**Interfaces:**
- Consumes: `waitElement`, `waitAnyElement`
- Produces: `initElementRemover(sys, platform)`

- [x] **Step 1: 抽取元素移除逻辑**

从原始文件抽取按钮移除和元素隐藏功能。Bilibili 定时移除间隔统一为 1000ms。

## 6. 平台适配

### Task 6.1: 创建 YouTube 平台模块

**Files:**
- Create: `src/platforms/youtube.js`

**Interfaces:**
- Produces: `youtubeHandlers = { theaterMode, removeAutoplay, removeSubtitles, ... }`

- [x] **Step 1: 抽取 YouTube 特定逻辑**

从原始文件抽取 YouTube 平台特有的影院模式、自动播放移除等逻辑。

### Task 6.2: 创建 Bilibili 平台模块

**Files:**
- Create: `src/platforms/bilibili.js`

**Interfaces:**
- Produces: `bilibiliHandlers = { webFullscreen, removeQuality, removeEplist, ... }`

- [x] **Step 1: 抽取 Bilibili 特定逻辑**

从原始文件抽取 Bilibili 平台特有的网页全屏、分辨率移除等逻辑。

## 7. 入口与清理

### Task 7.1: 创建 main.js 入口

**Files:**
- Create: `src/main.js`

**Interfaces:**
- Consumes: 所有模块
- Produces: 最终打包入口

- [x] **Step 1: 创建入口文件**

```js
import { gm } from './gm-api.js';
import { waitElement, waitAnyElement } from './element-getter.js';
import { i18n } from './i18n.js';
// ... 导入其他模块

(function () {
  'use strict';
  // 从原始文件整合完整的初始化逻辑
  // 包括：URL 检测、平台判定、功能初始化、设置面板创建
})();
```

### Task 7.2: 添加 cleanup 逻辑

**Files:**
- Modify: `src/main.js`

- [x] **Step 1: 在入口中添加清除定时器逻辑**

两版本统一添加：
```js
// 清理逻辑
const cleanup = () => {
  if (sys.removalInterval !== null) {
    console.log('[清理] bilibili定时移除 定时器');
    clearInterval(sys.removalInterval);
    sys.removalInterval = null;
  }
};
```

## 8. 构建验证

### Task 8.1: 验证构建输出

- [x] **Step 1: 运行构建命令**

```bash
npm run build
```

- [x] **Step 2: 确认输出文件存在**

```bash
ls -la dist/
```

### Task 8.2: 功能一致性对比

- [x] **Step 1: 对比构建产物与原始文件的功能等价性**

手动在 YouTube 和 Bilibili 上加载两个构建产物，测试：倍速播放、快捷键调速、设置面板、按钮移除等功能。

## 9. 文档与收尾

### Task 9.1: 更新 README.md

**Files:**
- Modify: `README.md`

- [x] **Step 1: 添加构建说明**

在 README 中添加构建系统说明、`npm run build` 用法、`src/` 目录结构。

### Task 9.2: 更新 .gitignore

**Files:**
- Modify: `.gitignore`

- [x] **Step 1: 添加 dist/ 相关规则**

```
dist/
```

### Task 9.3: 保留原始文件
