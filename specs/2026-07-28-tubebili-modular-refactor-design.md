# TubeBili 模块化重构设计

- **路径：** `specs/2026-07-28-tubebili-modular-refactor-design.md`
- **状态：** 待批准
- **作者：** julong
- **日期：** 2026-07-28
- **范围：** 源码工程化（产物形态 + 双版本构建 + 模块切分）

---

## 1. 目标与范围

### 1.1 这次重构要解决什么

- `TubeBili.user.js`（~60KB / 1465 行）和 `TubeBili.userscripts.js`（~67KB / 1700+ 行）都是巨型单文件，工程师难以局部定位和修改
- 两个文件的差异点（头部、polyfill、样式微调）靠手工同步，容易漂移

### 1.2 这次重构不解决什么

- 不改变任何用户可见的功能（除了移除三个 YAGNI 项，见 1.4）
- 不改变现有 bug（如 Bilibili 移除定时器闪烁、`mode: "hide"` 已统一改为 `remove` 等）
- 不引入新功能
- 不重写 CSS 视觉设计
- **不改任何运行时行为/逻辑/架构**（不抽象 `sys` 状态、不引 EventBus、不重排 `Common` 模块内部结构）

### 1.3 事实来源（唯一）

- `TubeBili.user.js`
- `TubeBili.userscripts.js`

其他文件（`AGENTS.md`、`README*.md`、`documents/`、git 历史）**不作为本次重构的依据**。

### 1.4 已批准的功能削减

删除以下三项（含相关 i18n 文案、配置项注册）：

- `Bilibili_Remove_Volume`（移除音量按钮）
- `Bilibili_Remove_FullScreen`（移除全屏按钮）
- `Bilibili_Action_Unlimited_Trial`（未登录无限试用 1080P）—— 含被完整注释的 `Object.defineProperty` / `setTimeout` 劫持代码

### 1.5 成功标准

- `dist/TubeBili.user.js` 与 `dist/TubeBili.userscripts.js` 与现有两个文件功能等价（不计被砍功能 + 三处统一调整，见 §5.3）
- 源码每个文件 ≤ ~300 行，主入口 ≤ ~200 行
- 一次 `pnpm build` 同时生成两个产物
- 新增/修改功能只需改一处源码，不再手动同步两个文件

---

## 2. 架构概览

### 2.1 双构建策略

Rollup 的**两个独立 build** 复用同一份源码。核心约定：

- `src/main.js` 顶部首句是 `import './runtime/chrome.js';` —— Chrome 版以 main.js 为入口，这条 import 把 chrome.js（空模块）inline 到 IIFE 体的最前面。
- `src/runtime/safari.js` 内部 `import './main.js';` —— Safari 版以 safari.js 为入口，import 链为 polyfill → main.js → 其余模块。

**源码目录：**

```
src/
├── runtime/
│   ├── chrome.js         # 空模块，被 main.js 首句 import
│   └── safari.js         # Safari 版入口（含 polyfill + 自身 import './main.js'）
├── i18n.js
├── selectors.js
├── speed-controls.js
├── settings-panel.js
├── styles.js
├── youtube.js
├── bilibili.js
├── runtime-utils.js
└── main.js               # Chrome 版入口（首句 import chrome.js）
```

**产物目录：**

```
dist/
├── TubeBili.user.js            # Chrome 版产物
├── TubeBili.user.js.map
├── TubeBili.userscripts.js     # Safari 版产物
└── TubeBili.userscripts.js.map
```

**构建流向：**

```
        ┌──────────────────────────────────────────────────┐
        │  src/main.js (Chrome entry)                       │
        │   ├─ import './runtime/chrome.js'   (空模块)     │
        │   ├─ import './i18n.js'                          │
        │   ├─ import './selectors.js'                     │
        │   ├─ import './speed-controls.js'                │
        │   ├─ import './settings-panel.js'                │
        │   ├─ import './styles.js'                        │
        │   ├─ import './youtube.js'                       │
        │   ├─ import './bilibili.js'                      │
        │   └─ import './runtime-utils.js'                 │
        └──────────────────────────────────────────────────┘
                                  │
                                  │  Rollup build #1
                                  │  (banner = Chrome header)
                                  ▼
                       ┌──────────────────────────┐
                       │  dist/TubeBili.user.js   │
                       │  IIFE 体顶部：空模块      │
                       │  (Tampermonkey 提供 GM_*) │
                       └──────────────────────────┘

        ┌──────────────────────────────────────────────────┐
        │  src/runtime/safari.js (Safari entry)            │
        │   ├─ window.GM_getValue = ...   (polyfill)        │
        │   ├─ window.GM_setValue = ...                    │
        │   ├─ window.GM_addStyle = ...                    │
        │   ├─ window.GM_registerMenuCommand = ...        │
        │   ├─ const elmGetter = { ... }   (内嵌)          │
        │   ├─ floating button creation                   │
        │   └─ import './main.js'                          │
        │         └─ import './runtime/chrome.js' (空模块) │
        │         ├─ import './i18n.js'                    │
        │         └─ ...其余模块                          │
        └──────────────────────────────────────────────────┘
                                  │
                                  │  Rollup build #2
                                  │  (banner = Safari header)
                                  ▼
                       ┌──────────────────────────────────────┐
                       │  dist/TubeBili.userscripts.js        │
                       │  IIFE 体顶部：polyfill + elmGetter   │
                       │  + 浮动按钮 + 空 chrome.js 模块      │
                       └──────────────────────────────────────┘
```

每个产物由三部分拼接：

1. **Banner** — 由 Rollup 插件生成的头部注释（`==UserScript==` 元数据）
2. **运行时层** — `chrome.js`（空模块，被 main.js 顶部 import）或 `safari.js`（Safari 版的构建入口，自身 import main.js）
3. **主程序** — `main.js` 及其导入的 8 个源文件（两个版本完全相同）

**两个版本的 entry 模式：**
- **Chrome 版**：`input: 'src/main.js'`。main.js 顶部 `import './runtime/chrome.js'`，chrome.js 是空模块，bundler 把空内容 inline 进 IIFE 体的最前面（无副作用）。
- **Safari 版**：`input: 'src/runtime/safari.js'`。safari.js 自身 `import './main.js'`，Rollup 从 safari.js 入口出发，沿 import 链打包 polyfill + 主程序到同一个 IIFE 内。

两个 entry 看似不对称，**实际等价** —— Rollup 不管从哪个 entry 出发，只要 import 链覆盖了所有源码，产物都一致。这种"双入口"模式确保了每个产物的 IIFE 体顶部恰好是它的运行时层（chrome 版 IIFE 体以空模块开头，Safari 版以 polyfill 开头）。

### 2.2 关键设计原则

- **代码主体只写一次**：所有功能代码不区分版本，差异全部由 banner + runtime 层承担
- **运行时层是差异的唯一来源**：Chrome 版 `chrome.js` 是空模块（构建入口占位），Safari 版 `safari.js` 注入 GM polyfill + 内嵌 elmGetter + 浮动按钮菜单
- **样式差异在 `styles.js` 中以单一常量呈现**：倍速按钮背景色两个版本统一为 `rgba(0,0,0,0.6)`，无需 `__BUILD_TARGET__` 分支
- **不引入运行时分支判断**（如 `typeof GM_getValue`）：避免幽灵代码，明确每个产物的最终形态

### 2.3 依赖边界

- **外部运行时依赖**：仅一个 —— `ElementGetter`（Chrome 版用 `@require`，Safari 版内嵌）
- **不引入** npm 上其他库（避免脚本体积膨胀和许可问题）
- **构建期依赖**：`rollup`、`@rollup/plugin-node-resolve`、`@rollup/plugin-replace`、`@rollup/plugin-commonjs`、`@rollup/plugin-terser`，以及自写 banner 生成 plugin（或用 `@rollup/plugin-banner`）

---

## 3. 模块边界

### 3.1 目录与文件职责

```
src/
├── runtime/
│   ├── chrome.js         # 空模块，被 main.js 首句 import，标记 Chrome 产物运行时层位置
│   └── safari.js         # Safari 版入口：GM_* polyfill + 内嵌 elmGetter + 浮动按钮菜单
│                         # 自身 import './main.js' 触发主程序打包
│
├── i18n.js               # 导出 i18n 对象（中英文）+ detectLanguage()
│
├── selectors.js          # 导出 bilibiliSelectors / youtubeSelectors 常量对象
│
├── speed-controls.js     # 倍速按钮（创建/点击）+ 倍速设置 + 速度指示器 + 键盘快捷键
│
├── settings-panel.js     # 设置面板 DOM 构建 + 保存逻辑 + toggle 显示
│                         # 包含：initSettingItems / initializePanel / createSettingItem
│                         #          / saveSettings / togglePanel / settingPanelItems 配置
│
├── styles.js             # 导出 STYLES（设置面板 CSS）+ BUTTON_STYLE（倍速按钮内联样式，两版统一）
│
├── youtube.js            # YouTube 处理：handleYoutubePage + initYoutubeListeners
│                         # 包含：倍速按钮注入、按钮移除、影院模式、直播检测、广告检测
│
├── bilibili.js           # Bilibili 处理：handleBilibiliPage + initBilibiliListener
│                         # 包含：倍速按钮注入、按钮移除轮询、自动网页全屏、自动倍速
│
├── runtime-utils.js      # 纯函数：detectLanguage / isYoutubePage / isYoutubeWatchPage
│                         #          / isBilibiliVideoPage / logSection
│
└── main.js               # main() + cleanup() + 调度逻辑；导出 sys 共享对象
```

### 3.2 每个模块的契约

| 模块 | 它做什么 | 我怎么用它 | 它依赖什么 |
|---|---|---|---|
| `runtime/chrome.js` | 空模块，标记 Chrome 产物中此位置为运行时层 | 被 `main.js` 顶部 `import` | 无 |
| `runtime/safari.js` | Safari 版入口 + 注入 GM_* 全局 + 内嵌 elmGetter + 浮动按钮 | Rollup config 作为 `input`；自身 `import './main.js'` | 无（独立可运行） |
| `i18n.js` | 文本查找 + 语言检测 | `geti18nText(key)` / `detectLanguage()` | 无 |
| `selectors.js` | CSS 选择器常量 | `import { bilibiliSelectors, youtubeSelectors } from './selectors.js'` | 无 |
| `speed-controls.js` | 倍速 UI + 播放速度修改 + 快捷键 | `createSpeedButtons(...)` / `setPlaybackRate(...)` / `handleKeydown` | `styles.js`、GM_getValue、`sys` |
| `settings-panel.js` | 设置面板 DOM + 配置项注册 + 保存 | `initSettingItems(url)` / `togglePanel()` / `getSettingPanelItems()` | `i18n.js`、GM_getValue/GM_setValue |
| `styles.js` | CSS 字符串常量 | `import { STYLES, BUTTON_STYLE } from './styles.js'` | 无 |
| `youtube.js` | YouTube 处理入口 | `handleYoutubePage()` / `initYoutubeListeners()` | `selectors.js`、`speed-controls.js`、`settings-panel.js`、`runtime-utils.js` |
| `bilibili.js` | Bilibili 处理入口 | `handleBilibiliPage()` / `initBilibiliListener()` | `selectors.js`、`speed-controls.js`、`settings-panel.js`、`runtime-utils.js` |
| `runtime-utils.js` | 纯判断/检测函数 | `isYoutubePage()` / `isYoutubeWatchPage()` / `isBilibiliVideoPage()` / `detectLanguage()` / `logSection()` | 无 |
| `main.js` | 调度 + 生命周期；持有 `sys` | `main()` / `cleanup()` | `youtube.js`、`bilibili.js`、`runtime-utils.js`、`settings-panel.js`、`speed-controls.js`、`styles.js`、`runtime/chrome.js` |

### 3.3 跨模块状态：`sys` 对象

当前 `sys` 全局对象包含 12 个字段：`initialized`、`youtubeLiveStreamStatus`、`youtubeFallbackRate`、`youtubeAdDetected`、`youtubeAdCheckInterval`、`isMainRunning`、`isYoutubePageProcessing`、`youtubeLiveStreamCheck`、`removalInterval`、`bilibiliUrlObserver`、`currentLang`、`lastUrl`。

**本次重构保持单一 `sys` 对象不动**，集中放在 `main.js` 导出，下游模块按需 import。**不**抽象为 EventBus、不拆分所有权、不重命名字段。后续如状态混乱再单独项目处理。

---

## 4. 数据流

### 4.1 全局数据

- **GM_* 存储**：键值对存储（`GM_getValue`/`GM_setValue`）。键如 `Youtube_Action_Rate_Enabled`、`Shortcut_Speed_List`、`Bilibili_Action_Rate_Value` 等。Chrome 版由 Tampermonkey 提供，Safari 版由 `runtime/safari.js` 的 polyfill 通过 localStorage 实现（前缀 `TubeBili_`）。
- **`sys` 共享对象**：12 个字段（见 §3.3）。重构后仍为单一全局对象，集中放在 `main.js` 导出，下游模块按需 import。
- **DOM 选择器**：所有选择器集中在 `selectors.js`，作为常量对象导出。两个产物共用同一份。

### 4.2 启动流程

```
用户访问 youtube.com/watch 或 bilibili.com/video
        ↓
油猴注入脚本（IIFE）
        ↓
[Chrome] Tampermonkey 注入 GM_* + @require 加载 elmGetter
[Safari] runtime/safari.js 执行：注入 GM_* polyfill + 内嵌 elmGetter + 创建浮动按钮
        ↓
main() 首次执行
        ↓
sys.currentLang = detectLanguage()
settingsPanel.initSettingItems(url)  → 注册 settingPanelItems
settingsPanel.loadSpeedList()         → 从 GM_* 读取快捷键/按钮倍速列表
GM_addStyle(STYLES)
GM_registerMenuCommand('设置面板', settingsPanel.togglePanel)
document.addEventListener('keydown', speedControls.handleKeydown)
[首次运行] setTimeout(settingsPanel.togglePanel, 500) 弹出面板
        ↓
YouTube 页面 → youtube.initYoutubeListeners()
              - 监听 'yt-navigate-finish' 事件
              - setInterval(youtubeLiveStreamCheck, 1000)
              - setInterval(youtubeAdCheck, 200)
Bilibili 页面 → bilibili.initBilibiliListener()
              - MutationObserver 监听 URL 变化
        ↓
youtube.handleYoutubePage() / bilibili.handleBilibiliPage() 注入倍速按钮 + 应用配置
```

### 4.3 运行时数据流（倍速点击为例）

```
用户点击倍速按钮
    ↓
speed-controls.js: buttonClickCallback(speed)
    ↓
setPlaybackRate(speed):
    - video.playbackRate = parseFloat(speed)
    - updateSpeedButtonHighlight(speed)   → 改 DOM 类名
    - showSpeedIndicator(speed)            → 显示屏幕中央提示，500ms 淡出
```

### 4.4 跨模块调用关系

```
main.js
  ├─ import './runtime/chrome.js'  (首条 import，标记 Chrome 产物运行时层位置)
  ├─→ settings-panel.js (initSettingItems, togglePanel, getSettingPanelItems)
  │     └─→ i18n.js (geti18nText)
  │     └─→ GM_* (读写)
  ├─→ youtube.js (handleYoutubePage, initYoutubeListeners)
  │     ├─→ selectors.js (youtubeSelectors)
  │     ├─→ speed-controls.js (createSpeedButtons, setPlaybackRate)
  │     └─→ settings-panel.js (getSettingPanelItems)
  ├─→ bilibili.js (handleBilibiliPage, initBilibiliListener)
  │     ├─→ selectors.js (bilibiliSelectors)
  │     ├─→ speed-controls.js (createSpeedButtons, setPlaybackRate)
  │     └─→ settings-panel.js (getSettingPanelItems)
  ├─→ speed-controls.js (handleKeydown 绑定到 document)
  └─→ runtime-utils.js (isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage, logSection)
```

---

## 5. 构建产物与双版本策略

### 5.1 Rollup 配置（双 build 数组）

**核心约定：**
- `src/main.js` 顶部首句是 `import './runtime/chrome.js';` —— Chrome 版从 main.js 出发时，这条 import 会把 chrome.js（空模块）inline 到 IIFE 体的最前面。
- `src/runtime/safari.js` 自身 `import './main.js';` —— Safari 版从 safari.js 出发时，import 链经过 safari.js（polyfill）再到 main.js，最终顺序是 polyfill → main.js → 其余模块。

**两个 entry 不对称但产物等价**：只要 import 链覆盖了所有源码，Rollup IIFE 输出都会按依赖顺序排列。这种模式确保每个产物的 IIFE 体顶部恰好是它的运行时层。

```js
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import { generateChromeBanner, generateSafariBanner } from './scripts/banners.js';

// process.env.TARGET 可选为 'chrome' | 'safari' | undefined (默认两个都生成)
const targetFilter = process.env.TARGET;

const builds = [
  // ── Chrome / Tampermonkey 版 ──────────────────────────────
  {
    input: 'src/main.js',
    output: {
      file: 'dist/TubeBili.user.js',
      format: 'iife',
      name: 'TubeBili',
      sourcemap: true,
      banner: generateChromeBanner(),
    },
    plugins: [
      replace({ __BUILD_TARGET__: '"chrome"', preventAssignment: true }),
      resolve(),
      commonjs(),
      terser({ format: { comments: 'some' } })  // 保留 ==UserScript== 头部
    ]
  },
  // ── Safari / Userscripts 版 ──────────────────────────────
  {
    input: 'src/runtime/safari.js',
    output: {
      file: 'dist/TubeBili.userscripts.js',
      format: 'iife',
      name: 'TubeBili',
      sourcemap: true,
      banner: generateSafariBanner(),
    },
    plugins: [
      replace({ __BUILD_TARGET__: '"safari"', preventAssignment: true }),
      resolve(),
      commonjs(),
      terser({ format: { comments: 'some' } })
    ]
  }
];

export default targetFilter
  ? builds.filter(b => b.output.file.includes(targetFilter))
  : builds;
```

**两个 entry 的代码片段约束（必须实现）：**

`src/main.js`（节选）：
```js
// 首条语句必须是 chrome.js 的 import
import './runtime/chrome.js';
import { ... } from './i18n.js';
// ...其余 import
```

`src/runtime/safari.js`（节选）：
```js
// polyfill 代码...
window.GM_getValue = ...;
// 然后显式 import 主入口
import './main.js';
```

### 5.2 Banner 内容（逐字段保留事实）

#### Chrome 版头部（`generateChromeBanner`）

```js
// ==UserScript==
// @name               TubeBili - YouTube(油管) Bilibili(B站) 视频增强工具
// @name:en            TubeBili - YouTube Bilibili Video Player Enhancer Tools
// @namespace          com.julong.tampermonkey.TubeBiliVideoPlayerEnhancerTools
// @version            2.0.2
// @author             julong@111.com
// @description        自动网页全屏、自定义倍速列表、快捷键一键调速、界面漂亮，让您摆脱繁琐操作，专注享受视频 | by julong
// @description:en     Auto web fullscreen, custom speed list, hotkey speed control, beautiful UI. Say goodbye to tedious operations and focus on enjoying videos | by julong
// @license            MIT
// @icon               https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @homepage           https://github.com/julong111/tampermonkey-TubeBili
// @supportURL         https://github.com/julong111/tampermonkey-TubeBili/issues
// @downloadURL         https://github.com/julong111/tampermonkey-TubeBili/raw/main/TubeBili.user.js
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
```

#### Safari 版头部（`generateSafariBanner`）

```js
// ==UserScript==
// @name               TubeBili - YouTube(油管) Bilibili(B站) 视频增强工具 (Safari/通用版)
// @name:en            TubeBili - YouTube Bilibili Video Player Enhancer Tools (Safari/Universal)
// @namespace          com.julong.userscripts.TubeBiliVideoPlayerEnhancerTools
// @version            2.0.2-safari
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
```

### 5.3 源码差异处理（事实保留 / 统一调整）

| 项 | 原 Chrome | 原 Safari | 重构后 | 实现方式 |
|---|---|---|---|---|
| 倍速按钮背景色 | `rgba(255,255,255,0.2)` | `rgba(0,0,0,0.6)` | **统一 `rgba(0,0,0,0.6)`** | `styles.js` 单一常量 `BUTTON_STYLE`，两版共用 |
| Bilibili 移除定时器日志文案 | "200ms"（但实际 1000ms） | "1000ms"（实际 1000ms） | **统一 "1000ms"** | `console.log` 字符串直接修正，无构建分支 |
| cleanup 清理 `removalInterval` | 不清理 | 清理 | **两版都清理** | `main.js` 的 `cleanup()` 增加该分支，源码两处一致 |

### 5.4 package.json 脚本

```json
{
  "scripts": {
    "build": "rollup -c",
    "build:chrome": "TARGET=chrome rollup -c",
    "build:safari": "TARGET=safari rollup -c",
    "watch": "rollup -c -w"
  }
}
```

**脚本语义：**
- `pnpm build` —— 同时生成两个产物
- `pnpm build:chrome` —— 仅生成 `dist/TubeBili.user.js`
- `pnpm build:safari` —— 仅生成 `dist/TubeBili.userscripts.js`

`TARGET` 环境变量由 rollup.config.js 读取并过滤 `builds` 数组（见 §5.1）。

### 5.5 验证清单（构建后必须做的）

**头部注释：**
- [ ] `dist/TubeBili.user.js` 头部注释逐字段与本设计 §5.2 Chrome 版一致
- [ ] `dist/TubeBili.userscripts.js` 头部注释逐字段与本设计 §5.2 Safari 版一致

**Chrome 版特有（与 Safari 版对比）：**
- [ ] 包含 `@require https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=`
- [ ] 包含 4 行 `@grant`：`GM_addStyle`、`GM_getValue`、`GM_registerMenuCommand`、`GM_setValue`
- [ ] 不含 `TubeBili_` 前缀的 localStorage 写入
- [ ] 不含 `#tubeBiliFloatingBtn` 浮动按钮创建逻辑

**Safari 版特有（与 Chrome 版对比）：**
- [ ] 含 1 行 `@grant none`
- [ ] 包含 `TubeBili_` 前缀的 localStorage polyfill（`GM_Polyfill.getValue`/`setValue`）
- [ ] 包含 `#tubeBiliFloatingBtn` 浮动按钮（`GM_Polyfill.registerMenuCommand`）
- [ ] 不含 `@require` ElementGetter（内嵌实现）

**两版统一项：**
- [ ] 倍速按钮背景色在两个产物中均为深色 `rgba(0,0,0,0.6)`
- [ ] Bilibili 移除定时器日志文案均为 `"1000ms"`
- [ ] `cleanup()` 函数中两个产物都清理 `removalInterval`

**被删除功能（不应出现）：**
- [ ] 两个产物均不含 `Bilibili_Remove_Volume` 键（i18n、settingPanelItems、bilibili_removal_items）
- [ ] 两个产物均不含 `Bilibili_Remove_FullScreen` 键（同上）
- [ ] 两个产物均不含 `Bilibili_Action_Unlimited_Trial` 键
- [ ] 两个产物均不含被注释的 `Object.defineProperty` / `setTimeout` 劫持代码块

**行为等价性（人工验证）：**
- [ ] 在 YouTube/Bilibili 实际页面中测试，倍速按钮、设置面板、自动化功能、按键快捷键、按钮移除功能均正常

> 注：构建工具会重排代码（变量名压缩、treeshake 等），不要求字节级等价。验证方式以**行为等价**为准。

### 5.6 不做的事

- ❌ 不引入 npm 上其他运行时库（保持脚本体积）
- ❌ 不做 CSS 抽取/合并（CSS 仍以字符串内联）
- ❌ 不引入 sourcemap 上传（仅本地构建产物可读）
- ❌ 不引入 lint/format/test 工具链（YAGNI）
- ❌ 不改任何运行时逻辑、不抽象、不重命名 `sys` 字段

---

## 6. 现有功能清单（作为重构后验收依据）

### 6.1 通用功能（两个站点共有）

1. **自定义倍速列表（两套独立）**
   - `Shortcut_Speed_List`（默认 `0.5,1.0,1.5,2.0,2.5,3.0`）—— 键盘 `,` / `.` 切换列表
   - `Button_Speed_List`（默认 `0.5,1.0,1.5,2.0`）—— 界面按钮列表
2. **键盘快捷键** —— `,` 减速、`.` 加速（在 shortcutSpeeds 中步进）
3. **倍速指示器** —— 屏幕中央浮层提示（500ms 淡出，全屏时挂载到 fullscreenElement）

### 6.2 YouTube 专属（`yt-navigate-finish` 事件驱动）

4. **倍速按钮组** —— 注入到 `#movie_player .ytp-right-controls` 之前
5. **自动倍速播放** —— 含广告检测（自动改 1.0 → 广告结束恢复）
6. **自动进入影院模式（Theater Mode）** —— 点击 `.ytp-size-button`
7. **直播检测** —— 检测 `.ytp-live-badge-is-livehead`，直播时强制 1.0，结束后恢复
8. **按钮移除**：自动播放开关、字幕、设置、影院模式、全屏

### 6.3 Bilibili 专属（`MutationObserver` 监听 URL 变化）

9. **倍速按钮组** —— 注入到 `.bpx-player-control-bottom-right` 第一个位置
10. **自动倍速播放** —— 500ms 重试直到 video 就绪
11. **自动网页全屏** —— 检测 `mode-webscreen` / `bpx-state-entered` 类
12. **按钮移除**：分辨率、选集、画中画、宽屏、原始倍速、评论输入区、设置、网页全屏

### 6.4 设置面板

13. **油猴菜单命令** 打开设置面板（Safari 版用浮动按钮 ⚙️ 替代）
14. **首次运行自动弹出**设置面板（`firstRunComplete` 标记，500ms 延迟）
15. **双语 UI**（zh/en，根据 `navigator.language`；前缀 `zh`/`en` 命中，否则默认 en）
16. **持久化** —— Chrome 版用 GM_*，Safari 版 localStorage 前缀 `TubeBili_`
17. **保存时同步写入 GM 和 localStorage**（兼容两个版本的存储读取路径）

---

## 7. 重构后的项目目录

```
tubebili/
├── src/
│   ├── runtime/
│   │   ├── chrome.js
│   │   └── safari.js
│   ├── i18n.js
│   ├── selectors.js
│   ├── speed-controls.js
│   ├── settings-panel.js
│   ├── styles.js
│   ├── youtube.js
│   ├── bilibili.js
│   ├── runtime-utils.js
│   └── main.js
├── scripts/
│   └── banners.js              # 导出 generateChromeBanner / generateSafariBanner
├── dist/
│   ├── TubeBili.user.js          # 构建产物
│   ├── TubeBili.user.js.map
│   ├── TubeBili.userscripts.js   # 构建产物
│   └── TubeBili.userscripts.js.map
├── specs/
│   └── 2026-07-28-tubebili-modular-refactor-design.md   # 本文件
├── rollup.config.js
├── package.json
├── pnpm-lock.yaml
├── README.md
├── README-en.md
└── resources/
    └── ...                     # README 引用的图片
```

旧文件 `TubeBili.user.js` / `TubeBili.userscripts.js`（根目录）在重构后**删除**，由 `dist/` 下的构建产物取代。`AGENTS.md`、`documents/` 在重构后清理（本次任务可一并完成，或作为独立的清理 commit）。

---

## 8. 实施边界

- 本次重构产出：`src/` 全部源码 + `rollup.config.js` + `package.json` + `scripts/banners.js` + `dist/` 四个产物（两个 `.js` + 两个 `.js.map`）+ 本设计文档
- 本次重构**不**产出：测试代码、lint 配置、CI 配置、CHANGELOG、版本号更新策略
- 上线流程：构建后人工在浏览器中验证 §5.5 清单，确认无回归后以 `dist/` 为交付物

**dist 交付形式（默认决定）：**
- `dist/*.js` 提交到 git，保留原有的 raw 安装 URL（`@downloadURL` / `@updateURL` 不需改动）
- `dist/*.js.map` 也提交（sourcemap 仅供本地调试，不对外发布）
- 根目录旧版 `TubeBili.user.js` / `TubeBili.userscripts.js` 在本次重构中**删除**

---

## 9. 待后续决定的开放问题

这些问题**不**在本次重构范围内，列出以便后续跟踪：

1. **版本号管理**：`package.json` 的 `version` 与油猴头部 `@version` 的同步策略（本次手动同步即可）
2. **旧文件清理时机**：`documents/`、`AGENTS.md` 等过期文件是否在本次重构中一并清理，还是作为独立 commit
3. **CI/CD**：是否在 GitHub Actions 中加入构建产物校验
4. **README 更新**：本次重构后 `README.md` / `README-en.md` 是否需要更新安装说明（指向 `dist/` 而非根目录）
