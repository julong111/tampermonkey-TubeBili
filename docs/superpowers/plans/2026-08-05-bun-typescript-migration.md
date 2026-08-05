# TubeBili Bun + TypeScript 迁移 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 TubeBili 从 npm + Rollup + Vitest + jsdom 全栈迁移到 Bun（Bun.build + bun:test），全部源码与测试转为 TypeScript（strict），测试改为行为 mock 的纯业务测试。

**Architecture:** 分四个阶段执行，每阶段保持可验证：A) 工具链（安装 bun、bunfig.toml、tsconfig、test-env）→ B) 构建迁移（build.ts 替代 rollup，双目录四产物不变）→ C) 源码 TS 迁移（叶节点模块先行、依赖模块随后，每步 `npx vitest run` 保持绿色）→ D) 测试迁移（行为 mock + bun:test，逐步替换 vitest，最后移除 vitest/jsdom/rollup 依赖）。旧的 vitest 测试在整个 C 阶段作为回归安全网保留。

**Tech Stack:** Bun ≥ v1.3.14（`bun test`/`Bun.build`）、TypeScript 5.x（strict）、bun:test（`mock.fn`/`mock.stubGlobal`/`mock.module`）。

## Global Constraints

- Bun.build 产物形态与现一致：`dist/vX.X.X/` + `dist/latest/` 各写 `TubeBili.user.js` 与 `TubeBili.userscripts.js`，`format: 'iife'`、`minify: false`、`define: { __TARGET__: ... }`。
- Header 注入用 `banner`，占位符替换逻辑从 `rollup.config.js:10-22` 的 `replaceHeaderInfo` 原样搬入 build.ts。
- 不引入 happy-dom / jsdom / jsdom-vm；测试只用 bun 默认环境 + `src/__tests__/helpers/` 下的行为 mock。
- bun:test 兼容边界：`vi.useFakeTimers`/`vi.advanceTimersByTime`/`vi.useRealTimers`/`vi.fn`/`vi.spyOn` 可用；`vi.stubGlobal`/`vi.unstubAllGlobals`/`vi.resetModules` **不可用** → 一律用 `mock.stubGlobal`/`mock.unstubAllGlobals`/`mock.module`（bun:test 导出 `mock`）。
- 模块状态清理靠各模块的 reset 导出（`resetTubeBili`/`resetShortcuts`/`resetSettingsPanel`），生产行为不变。
- TypeScript：`strict: true`、`module: "ESNext"`、`moduleResolution: "bundler"`、`target: "ES2022"`、`lib: ["ES2022", "DOM", "DOM.Iterable"]`、`types: ["bun"]`、`allowImportingTsExtensions: true`、`noEmit: true`。
- `__TARGET__` 与 GM_* 全局需在 `src/types/global.d.ts` 声明，否则 strict 下源码引用报错。
- 删除文件清单：`src/__tests__/integration/web-fullscreen-tracking.test.js`、`src/__tests__/helpers/load-original-tampermonkey.js`、`src/__tests__/helpers/load-original-userscripts.js`、`vitest.config.js`、`src/__tests__/helpers/setup-vitest-env.js`。
- 移除依赖：rollup、@rollup/plugin-replace、@rollup/plugin-terser、jsdom、vitest。新增 devDeps：typescript、@types/bun。

---
---

## Task 1: Bun 工具链 + 项目配置

**Files:**
- Create: `bunfig.toml`
- Create: `tsconfig.json`
- Create: `src/__tests__/helpers/test-env.ts`
- Create: `src/types/global.d.ts`
- Modify: `package.json`（scripts + devDeps）

**Interfaces:**
- Produces: `globalThis.__TARGET__` 默认 `undefined`（test-env.ts，被 bunfig `[test].preload` 加载）；`__TARGET__`/`GM_*` 全局类型声明（global.d.ts，被所有后续 TS 源码引用）。

- [ ] **Step 1: 安装 Bun**

```bash
curl -fsSL https://bun.sh/install | bash
source ~/.zshrc 2>/dev/null
bun --version
```
Expected: 输出 `1.3.x`（≥ 1.3.14）。

- [ ] **Step 2: 创建 `bunfig.toml`**

```toml
[test]
preload = ["./src/__tests__/helpers/test-env.ts"]
```

- [ ] **Step 3: 创建 `src/__tests__/helpers/test-env.ts`**

```ts
// 测试默认环境：__TARGET__ 默认 undefined（走 userscripts 分支），各测试用 mock.stubGlobal 覆盖
globalThis.__TARGET__ = undefined
```

- [ ] **Step 4: 创建 `src/types/global.d.ts`**

```ts
declare const __TARGET__: string | undefined
declare function GM_getValue(key: string, defaultValue?: unknown): unknown
declare function GM_setValue(key: string, value: unknown): void
declare function GM_addStyle(css: string): void
declare function GM_registerMenuCommand(name: string, callback: () => void): void
```

- [ ] **Step 5: 创建 `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["bun"],
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "allowImportingTsExtensions": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src", "build.ts"]
}
```

- [ ] **Step 6: 更新 `package.json`**

scripts 与 devDeps 改为（**本轮保留旧依赖 vitest/rollup/jsdom，最后任务移除**）：

```json
{
  "scripts": {
    "build": "bun build.ts",
    "dev": "bun build.ts --watch",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/bun": "^1.3.0",
    "typescript": "^5.9.0"
  }
}
```

- [ ] **Step 7: 安装依赖**

```bash
bun install
```
Expected: 生成 `bun.lock`，`node_modules` 更新。

- [ ] **Step 8: 验证当前测试仍绿（vitest 兜底）**

```bash
npx vitest run
```
Expected: 全部通过（`npx vitest run` 只执行 .test.js，vitest.config.js 尚在）。若提示缺少 vitest 依赖，先 `bun install` 确认 devDeps 完整。

- [ ] **Step 9: Commit**

```bash
git add bunfig.toml tsconfig.json src/__tests__/helpers/test-env.ts src/types/global.d.ts package.json bun.lock
git commit -m "chore: 引入 Bun 工具链与 TS 配置（bunfig/tsconfig/typecheck）"
```

---

## Task 2: 构建迁移 — build.ts 替代 rollup

**Files:**
- Create: `build.ts`
- Delete: `rollup.config.js`
- Rename: `src/build/header-tampermonkey.js` → `src/build/header-tampermonkey.ts`
- Rename: `src/build/header-userscripts.js` → `src/build/header-userscripts.ts`
- Modify: `src/main.js` 需先存在（沿用），本任务入口先用 `src/main.js`，TS 迁移后再切 `src/entry.ts`

**Interfaces:**
- Produces: `bun build.ts` 输出与 rollup 相同的 4 个产物；供 `package.json` `build`/`dev` 脚本调用。

- [ ] **Step 1: 重命名 header 模板为 .ts（内容不变）**

```bash
git mv src/build/header-tampermonkey.js src/build/header-tampermonkey.ts
git mv src/build/header-userscripts.js src/build/header-userscripts.ts
```

- [ ] **Step 2: 创建 `build.ts`**（`replaceHeaderInfo` 逻辑搬自 rollup.config.js）

```ts
import { build } from 'bun'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
const versionDir = `v${pkg.version}`

const targets = [
  {
    file: 'TubeBili.user.js',
    header: readFileSync('./src/build/header-tampermonkey.ts', 'utf8'),
    target: 'tampermonkey'
  },
  {
    file: 'TubeBili.userscripts.js',
    header: readFileSync('./src/build/header-userscripts.ts', 'utf8'),
    target: 'userscripts'
  }
]

function replaceHeaderInfo(str: string): string {
  return str
    .replace(/\$\{version\}/g, pkg.version)
    .replace(/\$\{namezh\}/g, pkg.namezh)
    .replace(/\$\{nameen\}/g, pkg.nameen)
    .replace(/\$\{namespace\}/g, pkg.namespace)
    .replace(/\$\{author\}/g, pkg.author)
    .replace(/\$\{descriptionzh\}/g, pkg.descriptionzh)
    .replace(/\$\{descriptionen\}/g, pkg.descriptionen)
    .replace(/\$\{license\}/g, pkg.license)
    .replace(/\$\{icon\}/g, pkg.icon)
    .replace(/\$\{homepage\}/g, pkg.homepage)
    .replace(/\$\{supportURL\}/g, pkg.supportURL)
}

const watch = process.argv.includes('--watch')

async function buildTarget(target: (typeof targets)[number], dir: string) {
  await build({
    entrypoints: ['src/main.js'],
    outfile: `dist/${dir}/${target.file}`,
    format: 'iife',
    minify: false,
    define: { __TARGET__: JSON.stringify(target.target) },
    banner: replaceHeaderInfo(target.header),
    watch
  })
}

for (const target of targets) {
  await buildTarget(target, versionDir)
  await buildTarget(target, 'latest')
}

if (watch) {
  console.log('[build] watching for changes...')
}
```

- [ ] **Step 3: 删除 rollup 配置**

```bash
git rm rollup.config.js
```

- [ ] **Step 4: 运行构建并校验产物**

```bash
bun run build
git diff --stat dist/
```
Expected: 4 个产物更新（`dist/v2.1.1/` 与 `dist/latest/` 各 2 个）。与上一个 rollup 产物 diff 应只含 header 版本一致性/空白差异。用 `bun run typecheck` 确认 build.ts 无类型错误。

- [ ] **Step 5: Commit**

```bash
git add build.ts src/build/ package.json
git commit -m "build: Bun.build 替代 Rollup（双目录四产物一致）"
```

---

## Task 3: 源码 TS 迁移 — 叶节点模块（constants / i18n / router / adapter / speed-list / catalog / styles）

**Files:**
- Rename + type: `src/core/i18n-constants.js` → `.ts`
- Rename + type: `src/core/i18n.js` → `.ts`
- Rename + type: `src/platforms/router.js` → `.ts`
- Rename + type: `src/platforms/adapter.js` → `.ts`
- Rename + type: `src/settings/speed-list-constants.js` → `.ts`
- Rename + type: `src/settings/speed-list.js` → `.ts`
- Rename + type: `src/settings/catalog.js` → `.ts`
- Rename + type: `src/ui/styles.js` → `.ts`

**Interfaces:**
- Produces: `PlatformAdapter` 契约接口（adapter.ts），供 youtube/bilibili 与 adapter.test 使用：

```ts
export interface PlatformAdapter {
  id: string
  matches(url: string): boolean
  isWatchPage(url: string): boolean
  init(onPageChange: () => void): void
  onPage(): void
  cleanup(): void
}
```

- [ ] **Step 1: 重命名并迁移 `adapter.ts`**

```bash
git mv src/platforms/adapter.js src/platforms/adapter.ts
```

```ts
export interface PlatformAdapter {
  id: string
  matches(url: string): boolean
  isWatchPage(url: string): boolean
  init(onPageChange: () => void): void
  onPage(): void
  cleanup(): void
}

const REQUIRED_KEYS: Array<keyof PlatformAdapter> = ['id', 'matches', 'isWatchPage', 'init', 'onPage', 'cleanup']

export function definePlatformAdapter(adapter: PlatformAdapter): Readonly<PlatformAdapter> {
  const missing = REQUIRED_KEYS.filter((key) => !(key in adapter))
  if (missing.length > 0) {
    throw new Error(`PlatformAdapter missing keys: ${missing.join(', ')}`)
  }
  return Object.freeze({ ...adapter })
}
```

- [ ] **Step 2: 重命名并迁移其余 7 个叶节点模块**

逐个 `git mv` 并补充类型（保持导出名与行为不变）：

```bash
git mv src/core/i18n-constants.js src/core/i18n-constants.ts
git mv src/core/i18n.js src/core/i18n.ts
git mv src/platforms/router.js src/platforms/router.ts
git mv src/settings/speed-list-constants.js src/settings/speed-list-constants.ts
git mv src/settings/speed-list.js src/settings/speed-list.ts
git mv src/settings/catalog.js src/settings/catalog.ts
git mv src/ui/styles.js src/ui/styles.ts
```

- `i18n.ts`：`export function t(key: string, lang: string = 'zh'): string`；`export function detectLanguage(): 'zh' | 'en'`（返回值收窄为字面量联合）。
- `router.ts`：三个判定函数签名为 `(url: string) => boolean`；`detectPlatform(url: string): 'youtube' | 'bilibili' | null`。
- `speed-list.ts`：新增返回类型：

```ts
export interface SpeedListResult {
  valid: boolean
  speeds: string[]
  error: string
}
export function validateSpeedList(input: unknown, lang: string = 'en'): SpeedListResult
```
  `input` 判空逻辑 `if (!input || typeof input !== "string")` 不变。
- `speed-list-constants.ts`：导出数组类型 `string[]`（`DEFAULT_SHORTCUT_SPEEDS`、`DEFAULT_BUTTON_SPEEDS`），常量 `DEFAULT_SPEED: string`、`shortcutSpeedListKey`/`buttonSpeedListKey: string`。
- `catalog.ts`：导出 `SettingItem` 接口，`buildCatalog(url: string, lang: string): Record<string, SettingItem>`：

```ts
export interface SettingItem {
  classId: string
  text: string
  enableKey: string
  valueKey?: string
  recommended?: boolean
}
```
- `i18n-constants.ts`、`styles.ts`：仅 `git mv`，内容已是纯数据/字符串，不改逻辑。

- [ ] **Step 3: 验证**

```bash
bun run typecheck
npx vitest run
```
Expected: typecheck 无错误（此时 src 中还有 .js 文件，`include: ["src"]` 不影响 tsc 只检查 .ts）；vitest 仍全绿（`.js` import 被 vitest 解析为 `.ts`）。

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor(ts): 叶节点模块转 TS（constants/i18n/router/adapter/speed-list/catalog/styles）"
```

---

## Task 4: 源码 TS 迁移 — 核心模块（element-getter / gm-api / store / floating-button / speed-indicator / speed-buttons）

**Files:**
- Rename + type: `src/core/element-getter.js` → `.ts`
- Rename + type: `src/core/gm-api.js` → `.ts`
- Rename + type: `src/settings/store.js` → `.ts`
- Rename + type: `src/ui/floating-button.js` → `.ts`
- Rename + type: `src/ui/speed-indicator.js` → `.ts`
- Rename + type: `src/ui/speed-buttons.js` → `.ts`

**Interfaces:**
- Produces: `GmApi` 接口（gm-api.ts，调用时按 `__TARGET__` 分支，保持可测试性）；`waitElement`/`getVideoElement` 签名；供后续 feature/platform 与测试使用。

```ts
export interface GmApi {
  getValue(key: string, defaultValue?: unknown): unknown
  setValue(key: string, value: unknown): unknown
  addStyle(css: string): unknown
  registerMenuCommand(name: string, callback: () => void): void
}
```

- [ ] **Step 1: 迁移 `gm-api.ts`**（保持调用时分支，不改为加载时选择）

```bash
git mv src/core/gm-api.js src/core/gm-api.ts
```

```ts
import { createFloatingButton } from '../ui/floating-button.js'

export interface GmApi {
  getValue(key: string, defaultValue?: unknown): unknown
  setValue(key: string, value: unknown): unknown
  addStyle(css: string): unknown
  registerMenuCommand(name: string, callback: () => void): void
}

export const gm: GmApi = {
  getValue(key, defaultValue) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_getValue(key, defaultValue)
    }
    try {
      const value = localStorage.getItem('TubeBili_' + key)
      if (value === null) return defaultValue
      if (value === 'true') return true
      if (value === 'false') return false
      if (!isNaN(value) && value !== '') return Number(value)
      return value
    } catch (e) {
      console.warn('[TubeBili] localStorage read failed:', e)
      return defaultValue
    }
  },

  setValue(key, value) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_setValue(key, value)
    }
    try {
      localStorage.setItem('TubeBili_' + key, String(value))
      return Promise.resolve()
    } catch (e) {
      console.warn('[TubeBili] localStorage write failed:', e)
      return Promise.reject(e)
    }
  },

  addStyle(css) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_addStyle(css)
    }
    const style = document.createElement('style')
    style.textContent = css
    style.setAttribute('data-tubebili-style', 'true')
    if (document.head) {
      document.head.appendChild(style)
    } else {
      const addWhenReady = () => {
        if (document.head) {
          document.head.appendChild(style)
          document.removeEventListener('DOMContentLoaded', addWhenReady)
        }
      }
      document.addEventListener('DOMContentLoaded', addWhenReady)
    }
    return style
  },

  registerMenuCommand(name, callback) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_registerMenuCommand(name, callback)
    }
    createFloatingButton(name, callback)
  }
}
```

- [ ] **Step 2: 迁移 `element-getter.ts`**

```bash
git mv src/core/element-getter.js src/core/element-getter.ts
```

```ts
export function waitElement(selector: string, timeout: number = 10000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }

    const observer = new MutationObserver((_mutations, obs) => {
      const el = document.querySelector(selector)
      if (el) {
        obs.disconnect()
        clearTimeout(timer)
        resolve(el)
      }
    })

    const observeTarget = document.documentElement || document.body
    if (observeTarget) {
      observer.observe(observeTarget, {
        childList: true,
        subtree: true
      })
    }

    const timer = setTimeout(() => {
      observer.disconnect()
      reject(new Error(`Element not found within ${timeout}ms: ${selector}`))
    }, timeout)
  })
}

export function getVideoElement(): HTMLVideoElement | null {
  return document.getElementsByTagName('video')[0] || null
}
```
> 若 `new MutationObserver` 在测试环境无全局，测试侧由 mock-document 的 fake `MutationObserver` 补齐（Task 9）。

- [ ] **Step 3: 迁移 `store.ts`**（模块级 `settingsState` 增加 `resetSettings()` 内部重置辅助，导出保持）

```bash
git mv src/settings/store.js src/settings/store.ts
```

```ts
import { gm } from '../core/gm-api.js'
import { detectLanguage } from '../core/i18n.js'
import { buildCatalog, type SettingItem } from './catalog.js'
import {
  shortcutSpeedListKey,
  buttonSpeedListKey,
  DEFAULT_SHORTCUT_SPEEDS,
  DEFAULT_BUTTON_SPEEDS,
  DEFAULT_SPEED
} from './speed-list-constants.js'
import { validateSpeedList } from './speed-list.js'

const settingsState = {
  shortcutSpeeds: [...DEFAULT_SHORTCUT_SPEEDS],
  buttonSpeeds: [...DEFAULT_BUTTON_SPEEDS],
  defaultSpeed: DEFAULT_SPEED,
  settingPanelItems: {} as Record<string, SettingItem>,
  currentLang: 'en' as 'zh' | 'en'
}

export function initSettings(url: string): void {
  settingsState.currentLang = detectLanguage()
  loadSpeedLists()
  settingsState.settingPanelItems = buildCatalog(url, settingsState.currentLang)
}

export function resetSettings(): void {
  settingsState.shortcutSpeeds = [...DEFAULT_SHORTCUT_SPEEDS]
  settingsState.buttonSpeeds = [...DEFAULT_BUTTON_SPEEDS]
  settingsState.defaultSpeed = DEFAULT_SPEED
  settingsState.settingPanelItems = {}
  settingsState.currentLang = 'en'
}

function loadSpeedLists(): void {
  const shortcutRaw = gm.getValue(shortcutSpeedListKey)
  if (shortcutRaw != null) {
    const result = validateSpeedList(shortcutRaw, settingsState.currentLang)
    if (result.valid) settingsState.shortcutSpeeds = result.speeds
  }
  const buttonRaw = gm.getValue(buttonSpeedListKey)
  if (buttonRaw != null) {
    const result = validateSpeedList(buttonRaw, settingsState.currentLang)
    if (result.valid) settingsState.buttonSpeeds = result.speeds
  }
}

export function getShortcutSpeeds(): string[] {
  return [...settingsState.shortcutSpeeds]
}

export function getButtonSpeeds(): string[] {
  return [...settingsState.buttonSpeeds]
}

export function getDefaultSpeed(): string {
  return settingsState.defaultSpeed
}

export function getSettingPanelItems(): Record<string, SettingItem> {
  return { ...settingsState.settingPanelItems }
}

export function getCurrentLang(): 'zh' | 'en' {
  return settingsState.currentLang
}

export function setSpeedLists(shortcutSpeeds: string[], buttonSpeeds?: string[]): void {
  settingsState.shortcutSpeeds = [...shortcutSpeeds]
  settingsState.buttonSpeeds = buttonSpeeds ? [...buttonSpeeds] : [...shortcutSpeeds]
}
```

- [ ] **Step 4: 迁移 `floating-button.ts` / `speed-indicator.ts` / `speed-buttons.ts`**

```bash
git mv src/ui/floating-button.js src/ui/floating-button.ts
git mv src/ui/speed-indicator.js src/ui/speed-indicator.ts
git mv src/ui/speed-buttons.js src/ui/speed-buttons.ts
```

- `floating-button.ts`：`export function createFloatingButton(name: string, callback: () => void): void`，其余 DOM 操作不变。
- `speed-indicator.ts`：`export function showSpeedIndicator(rate: string | number): void`，`document.fullscreenElement || document.webkitFullscreenElement` 需先 `declare global` 或类型断言（DOM lib 已含 `fullscreenElement`；`webkitFullscreenElement` 不存在于标准类型，用 `(document as Document & { webkitFullscreenElement?: Element | null }).webkitFullscreenElement`）。
- `speed-buttons.ts`：签名 `export function updateSpeedButtonHighlight(rate: string): void`；`export function createSpeedButtons(panelCallback: (div: HTMLDivElement) => void, btnClickCallback: (rate: string) => void): void`。`getButtonSpeeds()` 返回 `string[]`。

- [ ] **Step 5: 验证**

```bash
bun run typecheck
npx vitest run
```
Expected: 两者通过。注意 vitest 运行 gm-api/settings-panel 等旧测试依赖 DOM（jsdom），本项目 vitest.config.js 仍指向 jsdom，应保持绿。

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor(ts): 核心模块转 TS（element-getter/gm-api/store/floating-button/speed-indicator/speed-buttons）"
```

---

## Task 5: 源码 TS 迁移 — feature 模块（rate / shortcut / removal / auto-close-login-window）

**Files:**
- Rename + type: `src/features/rate.js` → `.ts`
- Rename + type: `src/features/shortcut.js` → `.ts`（新增 `resetShortcuts`）
- Rename + type: `src/features/removal/config.js` → `.ts`
- Rename + type: `src/features/removal/remove-once.js` → `.ts`
- Rename + type: `src/features/removal/remove-loop.js` → `.ts`
- Rename + type: `src/features/auto-close-login-window.js` → `.ts`

**Interfaces:**
- Produces: `resetShortcuts()`（测试清理模块态，生产不变）；`RemovalItem` 类型。

```ts
export interface RemovalItem {
  selector: string
  mode: 'remove' | 'hide'
}
```

- [ ] **Step 1: 迁移 `shortcut.ts`**（保留模块级 `shortcutHandler`，新增 reset）

```bash
git mv src/features/shortcut.js src/features/shortcut.ts
```

```ts
import { setPlaybackRate } from './rate.js'
import { getShortcutSpeeds } from '../settings/store.js'
import { getVideoElement } from '../core/element-getter.js'

let shortcutHandler: ((event: KeyboardEvent) => void) | null = null

export function handleKeydown(event: KeyboardEvent): void {
  const target = event.target as Element | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as HTMLElement).isContentEditable)) {
    return
  }
  const video = getVideoElement()
  if (!video) {
    return
  }
  const currentRate = video.playbackRate
  const shortcutSpeeds = getShortcutSpeeds()
  let currentIndex = shortcutSpeeds.findIndex((speed) => parseFloat(speed) === currentRate)
  if (currentIndex === -1) {
    const closest = shortcutSpeeds.reduce((prev, curr) => {
      return Math.abs(parseFloat(curr) - currentRate) < Math.abs(parseFloat(prev) - currentRate) ? curr : prev
    })
    currentIndex = shortcutSpeeds.indexOf(closest)
  }
  let newIndex = currentIndex
  if (event.code === 'Comma') {
    if (currentIndex > 0) {
      newIndex = currentIndex - 1
    }
  } else if (event.code === 'Period') {
    if (currentIndex < shortcutSpeeds.length - 1) {
      newIndex = currentIndex + 1
    }
  } else {
    return
  }
  setPlaybackRate(shortcutSpeeds[newIndex] ?? shortcutSpeeds[0] ?? '1.0')
}

export function initShortcuts(): void {
  if (shortcutHandler) return
  shortcutHandler = handleKeydown
  document.addEventListener('keydown', shortcutHandler)
}

export function resetShortcuts(): void {
  if (shortcutHandler) {
    document.removeEventListener('keydown', shortcutHandler)
  }
  shortcutHandler = null
}
```

- [ ] **Step 2: 迁移 `rate.ts`**

```bash
git mv src/features/rate.js src/features/rate.ts
```
`export function setPlaybackRate(rate: string | number): void`，内部 `parseFloat(rate)` 保持。

- [ ] **Step 3: 迁移 removal 模块**

```bash
git mv src/features/removal/config.js src/features/removal/config.ts
git mv src/features/removal/remove-once.js src/features/removal/remove-once.ts
git mv src/features/removal/remove-loop.js src/features/removal/remove-loop.ts
```
- `config.ts`：`export function getEnabledRemovalItems(removalItems: Record<string, RemovalItem>): RemovalItem[]`。
- `remove-once.ts`：`export function initYouTubeElementRemover(removalItems: Record<string, RemovalItem>): void`；`waitElement(item.selector).then((element) => {...})` 中 `element.style` 用 `(element as HTMLElement).style`。
- `remove-loop.ts`：`export function initBilibiliElementRemover(removalItems: Record<string, RemovalItem>, bilibiliSelectors: { playerContainer: string; webscreenClass: string }): ReturnType<typeof setInterval>`；`playerEl.classList` 用 `(playerEl as HTMLElement).classList`。

- [ ] **Step 4: 迁移 `auto-close-login-window.ts`**

```bash
git mv src/features/auto-close-login-window.js src/features/auto-close-login-window.ts
```

```ts
import { getVideoElement } from '../core/element-getter.js'

export const AUTO_CLOSE_LOGIN_WINDOW_INTERVAL = 1000

export function initAutoCloseLoginWindowGuard(
  closeBtnSelector: string,
  onDialogClosed?: () => void
): ReturnType<typeof setInterval> {
  return setInterval(() => {
    const closeBtn = document.querySelector(closeBtnSelector)
    if (!closeBtn) return
    ;(closeBtn as HTMLElement).click()
    const video = getVideoElement()
    if (video && video.paused) {
      video.play().catch(() => {})
    }
    if (onDialogClosed) {
      onDialogClosed()
    }
  }, AUTO_CLOSE_LOGIN_WINDOW_INTERVAL)
}
```

- [ ] **Step 5: 验证**

```bash
bun run typecheck
npx vitest run
```
Expected: 两者通过。旧 keyboard.test.js 用 `vi.mock('../../features/rate.js')` 仍被 vitest 支持。

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor(ts): feature 模块转 TS（rate/shortcut/removal/auto-close-login-window）+ resetShortcuts"
```

---

## Task 6: 源码 TS 迁移 — settings-panel / platforms（youtube / bilibili）+ main 拆分 entry

**Files:**
- Rename + type: `src/ui/settings-panel.js` → `.ts`（新增 `resetSettingsPanel`）
- Rename + type: `src/platforms/youtube-constants.js` → `.ts`
- Rename + type: `src/platforms/bilibili-constants.js` → `.ts`
- Rename + type: `src/platforms/youtube.js` → `.ts`
- Rename + type: `src/platforms/bilibili.js` → `.ts`
- Rename + type: `src/main.js` → `src/main.ts`（新增 `resetTubeBili`，移除自动执行）
- Create: `src/entry.ts`（自动执行：`addEventListener('beforeunload', cleanup)` + `main()`）
- Modify: `build.ts` 入口 `src/main.js` → `src/entry.ts`

**Interfaces:**
- Produces: `main()`/`cleanup()`/`resetTubeBili()`（main.ts，供 main-flow.test 直接调用）；`resetSettingsPanel()`（settings-panel.ts）。

- [ ] **Step 1: 迁移 `settings-panel.ts`**（文件较大，仅在首尾加类型；`resetSettingsPanel` 重置模块态）

```bash
git mv src/ui/settings-panel.js src/ui/settings-panel.ts
```

首部新增接口与内部函数类型（保留 362 行逻辑，仅加类型标注）：

```ts
import { gm, type GmApi } from '../core/gm-api.js'
import { t } from '../core/i18n.js'
import { shortcutSpeedListKey, buttonSpeedListKey } from '../settings/speed-list-constants.js'
import { validateSpeedList } from '../settings/speed-list.js'
import {
  getShortcutSpeeds,
  getButtonSpeeds,
  getDefaultSpeed,
  getSettingPanelItems,
  getCurrentLang,
  setSpeedLists
} from '../settings/store.js'

let settingPanelInitialized = false
let settingPanelElement: HTMLElement | null = null

function getText(key: string): string {
  return t(key, getCurrentLang())
}
```

尾部新增：

```ts
export function resetSettingsPanel(): void {
  if (settingPanelElement?.parentNode) {
    settingPanelElement.parentNode.removeChild(settingPanelElement)
  }
  settingPanelElement = null
  settingPanelInitialized = false
}
```
> `initializePanel` 内 `document.createElement("div")` 断言为 `HTMLElement`；`saveSettings` 内 `document.getElementById(...)` 为空时保持原有 null 保护（TS 下用 `?.` 或显式 if）。

- [ ] **Step 2: 迁移 platform constants**

```bash
git mv src/platforms/youtube-constants.js src/platforms/youtube-constants.ts
git mv src/platforms/bilibili-constants.js src/platforms/bilibili-constants.ts
```
纯数据，仅改扩展名；对象成员如需类型，用 `satisfies Record<string, string>` 或保持推断。

- [ ] **Step 3: 迁移 `youtube.ts` / `bilibili.ts`**

```bash
git mv src/platforms/youtube.js src/platforms/youtube.ts
git mv src/platforms/bilibili.js src/platforms/bilibili.ts
```
- 两文件均以 `definePlatformAdapter({...} satisfies PlatformAdapter)` 或 `export const youtubeAdapter: PlatformAdapter = definePlatformAdapter({...})` 标注。
- `bilibili.ts` 的 `initUrlObserver` 回调参数 `(callback: () => void)`；`handleBilibiliPage` 不变；`cleanupBilibili` 保持导出。
- `onFullscreenControlKeydown(e: KeyboardEvent)`、`onFullscreenControlClick(e: MouseEvent)`；`e.target.closest?.(...)` 用 `(e.target as Element | null)?.closest?.(...)`。

- [ ] **Step 4: 拆分 `main.ts` + 新建 `entry.ts`**

```bash
git mv src/main.js src/main.ts
```

`main.ts`（去掉末尾自动执行，新增 reset）：

```ts
import { gm } from './core/gm-api.js'
import { injectStyles } from './ui/styles.js'
import { t, detectLanguage } from './core/i18n.js'
import { initSettings } from './settings/store.js'
import { togglePanel } from './ui/settings-panel.js'
import { initShortcuts } from './features/shortcut.js'
import { youtubeAdapter } from './platforms/youtube.js'
import { bilibiliAdapter } from './platforms/bilibili.js'
import type { PlatformAdapter } from './platforms/adapter.js'

const adapters: PlatformAdapter[] = [youtubeAdapter, bilibiliAdapter]

const sys = {
  initialized: false,
  isMainRunning: false,
  currentLang: 'en' as 'zh' | 'en'
}

function logSection(msg: string): void {
  console.log(`========== ${msg} ==========`)
}

function getAdapter(url: string): PlatformAdapter | null {
  return adapters.find((adapter) => adapter.matches(url)) || null
}

export function main(): void {
  if (sys.isMainRunning) return
  sys.isMainRunning = true
  logSection('main 开始执行')
  const url = window.location.href

  if (!sys.initialized) {
    sys.currentLang = detectLanguage()
    initSettings(url)

    logSection('执行一次性初始化')
    injectStyles()
    gm.registerMenuCommand(t('Menu_Settings', sys.currentLang), togglePanel)
    initShortcuts()

    const adapter = getAdapter(url)
    if (adapter) {
      adapter.init(() => main())
    }

    const isFirstRun = gm.getValue('firstRunComplete', false)
    if (!isFirstRun) {
      gm.setValue('firstRunComplete', true)
      setTimeout(() => togglePanel(), 500)
    }

    sys.initialized = true
    logSection('一次性初始化完成')
  }

  const adapter = getAdapter(url)
  if (adapter && adapter.isWatchPage(url)) {
    adapter.onPage()
  }

  logSection('main 执行完毕')
  sys.isMainRunning = false
}

export const cleanup = (): void => {
  adapters.forEach((adapter) => adapter.cleanup())
}

export function resetTubeBili(): void {
  sys.initialized = false
  sys.isMainRunning = false
  sys.currentLang = 'en'
}
```

新建 `src/entry.ts`：

```ts
import { main, cleanup } from './main.js'

window.addEventListener('beforeunload', cleanup)
main()
```

- [ ] **Step 5: 更新 `build.ts` 入口**

`build.ts` 中 `entrypoints: ['src/main.js']` 改为 `entrypoints: ['src/entry.ts']`。

- [ ] **Step 6: 验证**

```bash
bun run typecheck
npx vitest run
bun run build
```
Expected: typecheck 通过；vitest 旧套件仍绿——**注意**：`main-flow.test.js` 依赖 `main.js` 的自动执行（`import('../../main.js')` 触发 `window.addEventListener + main()`），拆分后不再自动执行，此测试将失败。将 `main-flow.test.js` 的迁移提前到 Task 8 一并处理，或用临时占位断言跳过（见 Task 8 Step 1）；其余测试不受影响。构建产物 4 个正常生成。

> 决策：为保证每任务可验证，**main-flow.test 的改写放到 Task 8**（该任务同时提供所需 reset 与 mock-document）。本任务 commit 前用 `npx vitest run src/__tests__/gm-api src/__tests__/equivalence src/__tests__/platforms src/__tests__/header-metadata.test.js src/__tests__/integration/keyboard.test.js src/__tests__/integration/speed-buttons.test.js src/__tests__/integration/settings-panel.test.js src/__tests__/integration/element-remover.test.js src/__tests__/integration/auto-close-login-window.test.js src/__tests__/element-getter` 确认这些仍绿，main-flow 单独列入 Task 8。

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor(ts): settings-panel/platforms 转 TS；main 拆分 entry.ts（自动执行）+ resetTubeBili"
```

---

## Task 7: 删除 web-fullscreen-tracking 与 load-original helpers（测试侧清理）

**Files:**
- Delete: `src/__tests__/integration/web-fullscreen-tracking.test.js`
- Delete: `src/__tests__/helpers/load-original-tampermonkey.js`
- Delete: `src/__tests__/helpers/load-original-userscripts.js`

**Interfaces:**
- Consumes: 无（这些文件在本任务被移除，随后 equivalence 测试改写不再 import 它们）。

- [ ] **Step 1: 删除文件**

```bash
git rm src/__tests__/integration/web-fullscreen-tracking.test.js \
       src/__tests__/helpers/load-original-tampermonkey.js \
       src/__tests__/helpers/load-original-userscripts.js
```
Reason（写入 commit message 或在 PR 描述）：web-fullscreen-tracking 重度依赖 MutationObserver 属性监听与 fullscreenchange 事件流，属纯 DOM 行为无业务价值；load-original-* 为 jsdom vm 沙箱加载 legacy 脚本，等价测试改写后将不再需要。

- [ ] **Step 2: 暂时注释受影响测试的 import（等价测试在 Task 8 改写）**

在 `npx vitest run` 前，`detect-language.test.js` / `url-detection.test.js` / `validate-speed-list.test.js` 仍 `import ... from '../helpers/load-original-*.js'`。将这三个文件中所有 `getOriginalTampermonkey` / `getOriginalUserscripts` 引用相关代码临时注释（最终 Task 8 会整体重写），使 vitest 通过。

- [ ] **Step 3: 验证**

```bash
npx vitest run src/__tests__/equivalence
bun run typecheck
```
Expected: 等价测试因临时注释而通过（或已被 Task 8 重写覆盖）。

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "test: 移除 web-fullscreen-tracking 与 load-original helpers（jsdom 沙箱废弃）"
```

---

## Task 8: 行为 mock 基础设施 + main-flow 改写

**Files:**
- Create: `src/__tests__/helpers/mock-gm.ts`
- Create: `src/__tests__/helpers/mock-document.ts`
- Create: `src/__tests__/helpers/mock-video.ts`
- Rewrite: `src/__tests__/integration/main-flow.test.js` → `src/__tests__/integration/main-flow.test.ts`
- Delete: `src/__tests__/helpers/setup-gm-mock.js`（其 createGMMock 能力并入 mock-gm.ts）

**Interfaces:**
- Produces: `createGMMock`/`stubGlobalGM`/`unstubGlobalGM`/`createLocalStorageMock`（mock-gm.ts）、`createDocumentMock`（mock-document.ts）、`createVideoMock`（mock-video.ts）——后续所有测试与脚本复用。

- [ ] **Step 1: 创建 `mock-gm.ts`**（bun:test 版）

```ts
import { mock, type Mock } from 'bun:test'

export type GMMock = {
  getValue: Mock<(key: string, defaultValue?: unknown) => unknown>
  setValue: Mock<(key: string, value: unknown) => unknown>
  addStyle: Mock<(css: string) => unknown>
  registerMenuCommand: Mock<(name: string, callback: () => void) => void>
  _store: Map<string, unknown>
}

export function createGMMock(): GMMock {
  const store = new Map<string, unknown>()
  return {
    getValue: mock((key, defaultValue) => {
      return store.has(key) ? store.get(key) : defaultValue
    }),
    setValue: mock((key, value) => {
      store.set(key, value)
    }),
    addStyle: mock(() => {}),
    registerMenuCommand: mock(() => {}),
    _store: store
  }
}

export function stubGlobalGM(gmMock: GMMock): void {
  mock.stubGlobal('GM_getValue', gmMock.getValue)
  mock.stubGlobal('GM_setValue', gmMock.setValue)
  mock.stubGlobal('GM_addStyle', gmMock.addStyle)
  mock.stubGlobal('GM_registerMenuCommand', gmMock.registerMenuCommand)
}

export function unstubGlobalGM(): void {
  mock.unstubAllGlobals()
}

export function createLocalStorageMock(): Storage & { _store: Map<string, string> } {
  const store = new Map<string, string>()
  return {
    getItem: mock((key: string) => (store.has(key) ? (store.get(key) as string) : null)),
    setItem: mock((key: string, value: string) => {
      store.set(key, String(value))
    }),
    removeItem: mock((key: string) => {
      store.delete(key)
    }),
    clear: mock(() => {
      store.clear()
    }),
    key: mock((index: number) => [...store.keys()][index] ?? null),
    get length() {
      return store.size
    },
    _store: store
  } as Storage & { _store: Map<string, string> }
}
```

- [ ] **Step 2: 创建 `mock-document.ts`**（element stub + document mock）

```ts
import { mock, type Mock } from 'bun:test'

export type ElementStub = {
  tagName: string
  id: string
  className: string
  textContent: string
  value: string
  checked: boolean
  title: string
  style: Record<string, string>
  dataset: Record<string, string>
  children: ElementStub[]
  firstChild: ElementStub | null
  parentNode: ElementStub | null
  classList: {
    add: Mock<(tokens: string) => void>
    remove: Mock<(tokens: string) => void>
    contains: (token: string) => boolean
    toggle: (token: string, force?: boolean) => void
  }
  addEventListener: Mock<(type: string, cb: (e?: unknown) => void) => void>
  removeEventListener: Mock<(type: string, cb: (e?: unknown) => void) => void>
  setAttribute: (name: string, value: string) => void
  getAttribute: (name: string) => string | null
  appendChild: (child: ElementStub) => void
  removeChild: (child: ElementStub) => void
  remove: Mock<() => void>
  click: Mock<() => void>
  before: (node: ElementStub) => void
  dispatchEvent: (event: { type: string }) => boolean
}

export function createElementStub(tagName = 'div'): ElementStub {
  const classes = new Set<string>()
  const attributes = new Map<string, string>()
  const listeners = new Map<string, Array<(e?: unknown) => void>>()

  const el: ElementStub = {
    tagName,
    id: '',
    className: '',
    textContent: '',
    value: '',
    checked: false,
    title: '',
    style: {},
    dataset: {},
    children: [],
    firstChild: null,
    parentNode: null,
    classList: {
      add: mock((token: string) => {
        classes.add(token)
      }),
      remove: mock((token: string) => {
        classes.delete(token)
      }),
      contains: (token) => classes.has(token),
      toggle: (token, force) => {
        if (force === undefined) {
          if (classes.has(token)) classes.delete(token)
          else classes.add(token)
        } else if (force) {
          classes.add(token)
        } else {
          classes.delete(token)
        }
      }
    },
    addEventListener: mock((type, cb) => {
      const list = listeners.get(type) ?? []
      list.push(cb)
      listeners.set(type, list)
    }),
    removeEventListener: mock((type, cb) => {
      const list = listeners.get(type) ?? []
      listeners.set(type, list.filter((fn) => fn !== cb))
    }),
    setAttribute: (name, value) => {
      attributes.set(name, value)
      if (name === 'id') el.id = value
    },
    getAttribute: (name) => attributes.get(name) ?? null,
    appendChild: (child) => {
      child.parentNode = el
      el.children.push(child)
      el.firstChild = el.children[0] ?? null
    },
    removeChild: (child) => {
      const idx = el.children.indexOf(child)
      if (idx !== -1) el.children.splice(idx, 1)
      child.parentNode = null
      el.firstChild = el.children[0] ?? null
    },
    remove: mock(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }),
    click: mock(() => {
      ;(listeners.get('click') ?? []).forEach((cb) => cb({ type: 'click' }))
    }),
    before: (node) => {
      if (el.parentNode) {
        const idx = el.parentNode.children.indexOf(el)
        if (idx === -1) el.parentNode.appendChild(node)
        else el.parentNode.children.splice(idx, 0, node)
      }
    },
    dispatchEvent: (event) => {
      ;(listeners.get(event.type) ?? []).forEach((cb) => cb(event))
      return true
    }
  }
  return el
}

export type DocumentMock = {
  body: ElementStub
  head: ElementStub
  documentElement: ElementStub
  fullscreenElement: ElementStub | null
  createElement: Mock<(tagName: string) => ElementStub>
  createTextNode: Mock<(text: string) => { textContent: string }>
  getElementById: Mock<(id: string) => ElementStub>
  querySelector: Mock<(selector: string) => ElementStub | null>
  querySelectorAll: Mock<(selector: string) => ElementStub[]>
  getElementsByTagName: Mock<(tag: string) => ElementStub[]>
  addEventListener: Mock<(type: string, cb: (e?: unknown) => void) => void>
  removeEventListener: Mock<(type: string, cb: (e?: unknown) => void) => void>
  _registry: Map<string, ElementStub>
}

export function createDocumentMock(): DocumentMock {
  const body = createElementStub('body')
  const head = createElementStub('head')
  const documentElement = createElementStub('html')
  const registry = new Map<string, ElementStub>()
  const byTag = new Map<string, ElementStub[]>()

  const register = (el: ElementStub) => {
    if (el.id) registry.set(el.id, el)
  }

  const doc: DocumentMock = {
    body,
    head,
    documentElement,
    fullscreenElement: null,
    createElement: mock((tagName: string) => createElementStub(tagName)),
    createTextNode: mock((text: string) => ({ textContent: text })),
    getElementById: mock((id: string) => registry.get(id) ?? createElementStub('div')),
    querySelector: mock(() => null),
    querySelectorAll: mock(() => []),
    getElementsByTagName: mock((tag: string) => byTag.get(tag) ?? []),
    addEventListener: mock(() => {}),
    removeEventListener: mock(() => {}),
    _registry: registry
  }

  const originalCreate = doc.createElement
  doc.createElement = mock((tagName: string) => {
    const el = originalCreate(tagName)
    let id = ''
    Object.defineProperty(el, 'id', {
      get: () => id,
      set: (v: string) => {
        id = v
        if (v) register(el)
      },
      configurable: true
    })
    return el
  }) as DocumentMock['createElement']

  ;(doc as unknown as { addElement(el: ElementStub): void }).addElement = (el: ElementStub) => {
    register(el)
    byTag.set(el.tagName, [...(byTag.get(el.tagName) ?? []), el])
  }

  return doc
}
```
> 说明：`createElement` 用 `Object.defineProperty` 拦截 `id` setter，使 `btn.id = 'saveBtn'` 后 `getElementById('saveBtn')` 能返回同一实例（settings-panel 测试依赖此行为）。

- [ ] **Step 3: 创建 `mock-video.ts`**

```ts
import { mock, type Mock } from 'bun:test'

export type VideoMock = {
  playbackRate: number
  paused: boolean
  play: Mock<() => Promise<void>>
  pause: Mock<() => void>
  tagName: string
}

export function createVideoMock(): VideoMock {
  return {
    playbackRate: 1.0,
    paused: false,
    play: mock(() => Promise.resolve()),
    pause: mock(() => {}),
    tagName: 'video'
  }
}
```

- [ ] **Step 4: 改写 `main-flow.test.ts`**（显式调 main + resetTubeBili；beforeunload 改测 entry 导入）

```bash
git mv src/__tests__/integration/main-flow.test.js src/__tests__/integration/main-flow.test.ts
```

```ts
import { describe, test, expect, mock, vi, beforeEach, afterEach } from 'bun:test'
import { createGMMock, stubGlobalGM, unstubGlobalGM } from '../helpers/mock-gm.ts'
import { createDocumentMock } from '../helpers/mock-document.ts'
import { createVideoMock } from '../helpers/mock-video.ts'
import { resetSettings } from '../../settings/store.ts'
import { resetShortcuts } from '../../features/shortcut.ts'
import { resetSettingsPanel } from '../../ui/settings-panel.ts'
import { resetTubeBili } from '../../main.ts'

let gmMock: ReturnType<typeof createGMMock>

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  mock.stubGlobal('__TARGET__', 'tampermonkey')
  mock.stubGlobal('document', createDocumentMock())
  mock.stubGlobal('navigator', { language: 'en' })
  mock.stubGlobal('window', {
    location: { href: 'https://www.youtube.com/watch?v=test' },
    addEventListener: mock(() => {}),
    removeEventListener: mock(() => {})
  })
  resetTubeBili()
  resetSettings()
  resetShortcuts()
  resetSettingsPanel()
})

afterEach(() => {
  unstubGlobalGM()
  mock.unstubAllGlobals()
  vi.useRealTimers()
})

describe('main — 初始化流程', () => {
  test('首次运行时自动设置面板', async () => {
    gmMock.getValue.mockImplementation((key, defaultValue) => {
      if (key === 'firstRunComplete') return false
      return defaultValue
    })

    vi.useFakeTimers()
    const { main } = await import('../../main.ts')
    main()
    vi.advanceTimersByTime(500)

    expect(gmMock.setValue).toHaveBeenCalledWith('firstRunComplete', true)
  })

  test('再次调用 main 不重复初始化', async () => {
    const { main } = await import('../../main.ts')
    main()
    const setValueCalls = gmMock.setValue.mock.calls.length
    main()
    expect(gmMock.setValue.mock.calls.length).toBe(setValueCalls)
  })
})

describe('cleanup — 清理定时器和观察器', () => {
  test('beforeunload 触发 cleanup', async () => {
    const windowAddSpy = mock((..._args: unknown[]) => {})
    mock.stubGlobal('window', {
      location: { href: 'https://www.youtube.com/watch?v=test' },
      addEventListener: windowAddSpy,
      removeEventListener: mock(() => {})
    })
    await import('../../entry.ts')
    expect(windowAddSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })
})
```
> 注意：`main()` 内 `adapter.init` 会对 youtube 调用 `setInterval`，测试中无需 fake timers 也会无害（interval 真实存在但测试结束即丢弃）。`resetTubeBili()` 必须在每个用例前调用以重置模块态。

- [ ] **Step 5: 删除旧 `setup-gm-mock.js`**

```bash
git rm src/__tests__/helpers/setup-gm-mock.js
```
> 其它旧测试仍 import 它，会失败——在 Task 9-11 改写时统一迁移到 `mock-gm.ts`。本任务后 `npx vitest run` 会红，改为运行指定文件：`bun test src/__tests__/integration/main-flow.test.ts`。

- [ ] **Step 6: 验证 main-flow**

```bash
bun test src/__tests__/integration/main-flow.test.ts
bun run typecheck
```
Expected: main-flow 测试通过（bun:test）。

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "test: 新增行为 mock（gm/document/video）+ 改写 main-flow 为显式调用"
```

---

## Task 9: 测试迁移 — 等价测试 + adapter + header-metadata + gm-api + element-getter

**Files:**
- Rewrite: `src/__tests__/equivalence/detect-language.test.js` → `.ts`（去掉 legacy 对比）
- Rewrite: `src/__tests__/equivalence/url-detection.test.js` → `.ts`（去掉 legacy 对比）
- Rewrite: `src/__tests__/equivalence/validate-speed-list.test.js` → `.ts`（去掉 legacy 对比）
- Rewrite: `src/__tests__/platforms/adapter.test.js` → `.ts`（import 改 bun:test）
- Rewrite: `src/__tests__/header-metadata.test.js` → `.ts`（import 改 bun:test，纯 fs 不动逻辑）
- Rewrite: `src/__tests__/gm-api/tampermonkey.test.js` → `.ts`
- Rewrite: `src/__tests__/gm-api/userscripts.test.js` → `.ts`
- Rewrite: `src/__tests__/element-getter/element-getter.test.js` → `.ts`

**Interfaces:**
- Consumes: mock-gm.ts、mock-document.ts（Task 8）；`PlatformAdapter`（Task 3）。

- [ ] **Step 1: 改写 `detect-language.test.ts`**

```bash
git mv src/__tests__/equivalence/detect-language.test.js src/__tests__/equivalence/detect-language.test.ts
```

```ts
import { describe, test, expect } from 'bun:test'
import { t, detectLanguage } from '../../core/i18n.ts'

describe('detectLanguage', () => {
  const cases: Array<{ lang: string; expected: 'zh' | 'en' }> = [
    { lang: 'zh-CN', expected: 'zh' },
    { lang: 'zh-TW', expected: 'zh' },
    { lang: 'zh', expected: 'zh' },
    { lang: 'en-US', expected: 'en' },
    { lang: 'en', expected: 'en' },
    { lang: 'fr-FR', expected: 'en' },
    { lang: 'ja', expected: 'en' }
  ]

  for (const { lang, expected } of cases) {
    test(`${lang} → ${expected}`, () => {
      const originalNav = globalThis.navigator
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: { language: lang }
      })
      try {
        expect(detectLanguage()).toBe(expected)
      } finally {
        Object.defineProperty(globalThis, 'navigator', {
          configurable: true,
          value: originalNav
        })
      }
    })
  }
})

describe('t() i18n 查找', () => {
  const keys = [
    'Menu_Settings',
    'Menu_Save',
    'Menu_Close',
    'Youtube_Action_Rate',
    'Bilibili_Action_WebFullscreen'
  ]

  for (const lang of ['zh', 'en'] as const) {
    for (const key of keys) {
      test(`t("${key}", "${lang}") 返回非空文本`, () => {
        const result = t(key, lang)
        expect(result).toBeTruthy()
        expect(result).not.toBe(key)
      })
    }
  }

  test('不存在的 key 返回 key 本身', () => {
    expect(t('NonExistentKey', 'zh')).toBe('NonExistentKey')
  })
})
```

- [ ] **Step 2: 改写 `url-detection.test.ts`**

```bash
git mv src/__tests__/equivalence/url-detection.test.js src/__tests__/equivalence/url-detection.test.ts
```

```ts
import { describe, test, expect } from 'bun:test'
import { isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage } from '../../platforms/router.ts'

const urlCases: Array<[string, boolean, boolean, boolean]> = [
  ['https://www.youtube.com/watch?v=abc123', true, true, false],
  ['https://www.youtube.com/', true, false, false],
  ['https://www.youtube.com/feed/trending', true, false, false],
  ['https://m.youtube.com/watch?v=abc123', true, true, false],
  ['https://www.bilibili.com/video/BV1xx411c7mD', false, false, true],
  ['https://www.bilibili.com/bangumi/play/ep123456', false, false, true],
  ['https://www.bilibili.com/', false, false, false],
  ['https://accounts.youtube.com/login', true, false, false]
]

describe('router — URL 检测纯函数', () => {
  for (const [url, ytPage, ytWatch, bili] of urlCases) {
    test(`${url}`, () => {
      expect(isYoutubePage(url)).toBe(ytPage)
      expect(isYoutubeWatchPage(url)).toBe(ytWatch)
      expect(isBilibiliVideoPage(url)).toBe(bili)
    })
  }
})
```

- [ ] **Step 3: 改写 `validate-speed-list.test.ts`**

```bash
git mv src/__tests__/equivalence/validate-speed-list.test.js src/__tests__/equivalence/validate-speed-list.test.ts
```

```ts
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
```

- [ ] **Step 4: 改写 `adapter.test.ts`**

```bash
git mv src/__tests__/platforms/adapter.test.js src/__tests__/platforms/adapter.test.ts
```
仅将 `import { describe, test, expect } from 'vitest'` → `from 'bun:test'`；模块 import 路径 `'../../platforms/adapter.js'` 改为 `.ts`。其余断言不变。

- [ ] **Step 5: 改写 `header-metadata.test.ts`**

```bash
git mv src/__tests__/header-metadata.test.js src/__tests__/header-metadata.test.ts
```
仅改 `from 'vitest'` → `from 'bun:test'`；fs 解析逻辑不动。

- [ ] **Step 6: 改写 `tampermonkey.test.ts`**

```bash
git mv src/__tests__/gm-api/tampermonkey.test.js src/__tests__/gm-api/tampermonkey.test.ts
```

```ts
import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test'
import { gm } from '../../core/gm-api.ts'
import { createGMMock, stubGlobalGM, unstubGlobalGM } from '../helpers/mock-gm.ts'

let gmMock: ReturnType<typeof createGMMock>

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  mock.stubGlobal('__TARGET__', 'tampermonkey')
})

afterEach(() => {
  unstubGlobalGM()
})

describe('gm-api Tampermonkey 分支', () => {
  test('getValue 转发到 GM_getValue', () => {
    const result = gm.getValue('test_key', 'default_val')
    expect(gmMock.getValue).toHaveBeenCalledWith('test_key', 'default_val')
    expect(result).toBe('default_val')
  })

  test('setValue 转发到 GM_setValue', () => {
    gm.setValue('test_key', 'test_val')
    expect(gmMock.setValue).toHaveBeenCalledWith('test_key', 'test_val')
  })

  test('addStyle 转发到 GM_addStyle', () => {
    gm.addStyle('body { color: red; }')
    expect(gmMock.addStyle).toHaveBeenCalledWith('body { color: red; }')
  })

  test('registerMenuCommand 转发到 GM_registerMenuCommand', () => {
    const callback = () => {}
    gm.registerMenuCommand('Test Menu', callback)
    expect(gmMock.registerMenuCommand).toHaveBeenCalledWith('Test Menu', callback)
  })
})
```
> 为什么这里与旧测试不同：旧测试用 `vi.resetModules()` + 动态 import 来隔离模块缓存。`gm-api` 在**调用时**读 `__TARGET__` 全局（不是加载时选择），且我们用 `mock.stubGlobal('GM_*', gmMock.*)` 已替换全局，因此顶部静态 import `gm` 一次即可，不需要 `mock.module` 重置。断言对象从 `GM_getValue` 全局改为 `gmMock.getValue`（同一函数引用）。

- [ ] **Step 7: 改写 `userscripts.test.ts`**

```bash
git mv src/__tests__/gm-api/userscripts.test.js src/__tests__/gm-api/userscripts.test.ts
```

```ts
import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test'
import { gm } from '../../core/gm-api.ts'
import { createDocumentMock } from '../helpers/mock-document.ts'
import { createLocalStorageMock } from '../helpers/mock-gm.ts'

let doc: ReturnType<typeof createDocumentMock>
let ls: Storage & { _store: Map<string, string> }

beforeEach(() => {
  mock.stubGlobal('__TARGET__', undefined)
  ls = createLocalStorageMock()
  mock.stubGlobal('localStorage', ls)
  doc = createDocumentMock()
  mock.stubGlobal('document', doc)
})

afterEach(() => {
  mock.unstubAllGlobals()
})

describe('gm-api Userscripts 分支', () => {
  test('getValue 从 localStorage 读取 (已存在的值)', () => {
    ls.setItem('TubeBili_test_key', 'hello')
    expect(gm.getValue('test_key', 'default')).toBe('hello')
  })

  test('getValue 返回默认值 (不存在的 key)', () => {
    expect(gm.getValue('nonexistent', 'fallback')).toBe('fallback')
  })

  test('getValue 解析布尔值 "true"', () => {
    ls.setItem('TubeBili_bool_key', 'true')
    expect(gm.getValue('bool_key', false)).toBe(true)
  })

  test('getValue 解析数字字符串', () => {
    ls.setItem('TubeBili_num_key', '42')
    expect(gm.getValue('num_key', 0)).toBe(42)
  })

  test('setValue 写入 localStorage', () => {
    gm.setValue('test_key', 'test_val')
    expect(ls.getItem('TubeBili_test_key')).toBe('test_val')
  })

  test('addStyle 创建 style 元素', () => {
    gm.addStyle('.test { color: red; }')
    expect(doc.createElement).toHaveBeenCalledWith('style')
    expect(doc.head.appendChild).toBeDefined()
  })

  test('registerMenuCommand 创建浮动按钮', () => {
    gm.registerMenuCommand('Test', () => {})
    expect(doc.getElementById('tubeBiliFloatingBtn')).toBeDefined()
  })
})
```
> 说明：`addStyle` 内 `document.createElement('style')` 返回的 stub 被 `setAttribute('data-tubebili-style')` 与 `appendChild` 调用，均被 mock-document 支持。`registerMenuCommand` 走 `createFloatingButton`，会执行 `document.getElementById('tubeBiliFloatingBtn')`（返回 stub 非 null，后续属性赋值无害）。

- [ ] **Step 8: 改写 `element-getter.test.ts`**

```bash
git mv src/__tests__/element-getter/element-getter.test.js src/__tests__/element-getter/element-getter.test.ts
```

```ts
import { describe, test, expect, mock, vi, beforeEach, afterEach } from 'bun:test'
import { waitElement, getVideoElement } from '../../core/element-getter.ts'
import { createDocumentMock, createElementStub, type ElementStub } from '../helpers/mock-document.ts'
import { createVideoMock } from '../helpers/mock-video.ts'

let doc: ReturnType<typeof createDocumentMock>

beforeEach(() => {
  doc = createDocumentMock()
  mock.stubGlobal('document', doc)
  mock.stubGlobal('MutationObserver', class {
    observe() {}
    disconnect() {}
  })
})

afterEach(() => {
  mock.unstubAllGlobals()
  vi.useRealTimers()
})

describe('waitElement — 统一内联 MutationObserver 实现', () => {
  test('已存在的元素立即返回', async () => {
    const div = createElementStub('div')
    doc.querySelector.mockReturnValue(div as unknown as Element)
    const result = await waitElement('#existing-element', 1000)
    expect(result).toBe(div as unknown as Element)
  })

  test('不存在的元素超时 reject', async () => {
    vi.useFakeTimers()
    doc.querySelector.mockReturnValue(null)
    const promise = waitElement('#nonexistent-element', 100)
    const expectation = expect(promise).rejects.toThrow('Element not found')
    await vi.advanceTimersByTimeAsync(100)
    await expectation
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
```
> 类型说明：`getElementsByTagName` 返回 `ElementStub[]`。用 `createElementStub`（mock-document.ts）生成元素、`as unknown as Element` 断言；`video` 用 `as unknown as ElementStub` 放入返回数组即可。

- [ ] **Step 9: 验证**

```bash
bun test src/__tests__/equivalence src/__tests__/platforms src/__tests__/header-metadata.test.ts src/__tests__/gm-api src/__tests__/element-getter
bun run typecheck
```
Expected: 全部通过。

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "test: 等价测试去 legacy、adapter/header-metadata/gm-api/element-getter 迁 bun:test + mock"
```

---

## Task 10: 测试迁移 — keyboard / speed-buttons / element-remover / auto-close-login-window / settings-panel

**Files:**
- Rewrite: `src/__tests__/integration/keyboard.test.js` → `.ts`
- Rewrite: `src/__tests__/integration/speed-buttons.test.js` → `.ts`
- Rewrite: `src/__tests__/integration/element-remover.test.js` → `.ts`
- Rewrite: `src/__tests__/integration/auto-close-login-window.test.js` → `.ts`
- Rewrite: `src/__tests__/integration/settings-panel.test.js` → `.ts`

**Interfaces:**
- Consumes: mock-gm.ts / mock-document.ts / mock-video.ts；`resetShortcuts`/`resetSettingsPanel`/`resetSettings`。

- [ ] **Step 1: 改写 `keyboard.test.ts`**（mock.module 替代 vi.mock；video 由 mock-document 的 getElementsByTagName 提供）

```bash
git mv src/__tests__/integration/keyboard.test.js src/__tests__/integration/keyboard.test.ts
```

```ts
import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test'
import { createDocumentMock } from '../helpers/mock-document.ts'
import { createVideoMock } from '../helpers/mock-video.ts'
import { resetShortcuts } from '../../features/shortcut.ts'

mock.module('../../features/rate.ts', () => ({
  setPlaybackRate: mock((rate: string) => {})
}))

let doc: ReturnType<typeof createDocumentMock>
let setPlaybackRate: ReturnType<typeof mock>

beforeEach(async () => {
  doc = createDocumentMock()
  mock.stubGlobal('document', doc)
  const video = createVideoMock()
  doc.getElementsByTagName.mockImplementation((tag) => (tag === 'video' ? [video] : []))
  resetShortcuts()
  const rate = await import('../../features/rate.ts')
  setPlaybackRate = rate.setPlaybackRate as ReturnType<typeof mock>
  mock.clearAllMocks()
})

afterEach(() => {
  mock.unstubAllGlobals()
})

async function importShortcut() {
  return import('../../features/shortcut.ts')
}

describe('handleKeydown — 快捷键调速', () => {
  test('按逗号降速', async () => {
    const { handleKeydown } = await importShortcut()
    handleKeydown({ code: 'Comma', target: { tagName: 'DIV' } } as unknown as KeyboardEvent)
    expect(setPlaybackRate).toHaveBeenCalledWith('0.5')
  })

  test('按句号加速', async () => {
    const { handleKeydown } = await importShortcut()
    handleKeydown({ code: 'Period', target: { tagName: 'DIV' } } as unknown as KeyboardEvent)
    expect(setPlaybackRate).toHaveBeenCalledWith('1.5')
  })

  test('在 input 上按快捷键跳过', async () => {
    const { handleKeydown } = await importShortcut()
    handleKeydown({ code: 'Comma', target: { tagName: 'INPUT' } } as unknown as KeyboardEvent)
    expect(setPlaybackRate).not.toHaveBeenCalled()
  })

  test('在 textarea 上按快捷键跳过', async () => {
    const { handleKeydown } = await importShortcut()
    handleKeydown({ code: 'Comma', target: { tagName: 'TEXTAREA' } } as unknown as KeyboardEvent)
    expect(setPlaybackRate).not.toHaveBeenCalled()
  })

  test('已在最低速度时按逗号不降速', async () => {
    const video = createVideoMock()
    video.playbackRate = 0.5
    doc.getElementsByTagName.mockImplementation((tag) => (tag === 'video' ? [video] : []))
    const { handleKeydown } = await importShortcut()
    handleKeydown({ code: 'Comma', target: { tagName: 'DIV' } } as unknown as KeyboardEvent)
    expect(setPlaybackRate).toHaveBeenCalledWith('0.5')
  })

  test('未识别的按键码不触发', async () => {
    const { handleKeydown } = await importShortcut()
    handleKeydown({ code: 'KeyA', target: { tagName: 'DIV' } } as unknown as KeyboardEvent)
    expect(setPlaybackRate).not.toHaveBeenCalled()
  })
})

describe('initShortcuts — 注册监听器', () => {
  test('注册 keydown 事件并生效', async () => {
    const { initShortcuts } = await importShortcut()
    const addSpy = mock(() => {})
    doc.addEventListener = addSpy as unknown as ReturnType<typeof createDocumentMock>['addEventListener']
    initShortcuts()
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  test('重复调用不重复注册', async () => {
    const { initShortcuts } = await importShortcut()
    initShortcuts()
    const addSpy = mock(() => {})
    doc.addEventListener = addSpy as unknown as ReturnType<typeof createDocumentMock>['addEventListener']
    initShortcuts()
    expect(addSpy).not.toHaveBeenCalled()
  })
})
```
> 说明：rate.ts 在 shortcut.ts 里是模块级 import，用 `mock.module` 预先替换即可，无需 resetModules。`initShortcuts` 重复调用测试依赖模块态 `shortcutHandler` 持久（resetShortcuts 已 beforeEach 清空）。

- [ ] **Step 2: 改写 `speed-buttons.test.ts`**

```bash
git mv src/__tests__/integration/speed-buttons.test.js src/__tests__/integration/speed-buttons.test.ts
```

```ts
import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test'
import { createDocumentMock, type ElementStub } from '../helpers/mock-document.ts'
import { createGMMock, stubGlobalGM, unstubGlobalGM } from '../helpers/mock-gm.ts'
import { resetSettings } from '../../settings/store.ts'

let doc: ReturnType<typeof createDocumentMock>
let gmMock: ReturnType<typeof createGMMock>

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  mock.stubGlobal('__TARGET__', 'tampermonkey')
  doc = createDocumentMock()
  mock.stubGlobal('document', doc)
  mock.stubGlobal('window', { location: { href: 'https://www.youtube.com/watch?v=test' } })
  resetSettings()
})

afterEach(() => {
  unstubGlobalGM()
  mock.unstubAllGlobals()
})

describe('createSpeedButtons — 速度按钮创建', () => {
  test('YouTube 平台按钮具有 youtube CSS 类且回调收到容器', async () => {
    const { createSpeedButtons } = await import('../../ui/speed-buttons.ts')
    const panelCallback = mock(() => {})
    const btnClickCallback = mock(() => {})
    createSpeedButtons(panelCallback as (div: HTMLDivElement) => void, btnClickCallback)

    expect(panelCallback).toHaveBeenCalledTimes(1)
    const container = panelCallback.mock.calls[0][0] as ElementStub
    expect(container.classList.contains('youtube')).toBe(true)
  })

  test('按钮点击触发 btnClickCallback', async () => {
    const { createSpeedButtons } = await import('../../ui/speed-buttons.ts')
    const panelCallback = mock(() => {})
    const btnClickCallback = mock(() => {})
    createSpeedButtons(panelCallback as (div: HTMLDivElement) => void, btnClickCallback)

    const container = panelCallback.mock.calls[0][0]
    const buttons = (container as { children: Array<{ click: () => void; dataset: Record<string, string> }> }).children
    expect(buttons.length).toBeGreaterThan(0)
    buttons[0].click()
    expect(btnClickCallback).toHaveBeenCalledWith(buttons[0].dataset.speed)
  })
})

describe('updateSpeedButtonHighlight — 激活按钮高亮', () => {
  test('高亮对应速度的按钮', async () => {
    const { updateSpeedButtonHighlight } = await import('../../ui/speed-buttons.ts')
    const btn0 = createButton('0.5')
    const btn1 = createButton('1.0')
    const btn2 = createButton('1.5')
    doc.querySelectorAll.mockReturnValue([btn0, btn1, btn2])

    updateSpeedButtonHighlight('1.0')

    expect(btn0.classList.contains('active')).toBe(false)
    expect(btn1.classList.contains('active')).toBe(true)
    expect(btn2.classList.contains('active')).toBe(false)
  })
})

function createButton(speed: string): ElementStub {
  const btn = doc.createElement('button')
  btn.dataset.speed = speed
  return btn
}
```
> 说明：`createSpeedButtons` 内 `window.location.href.includes("youtube.com")` 需 stub 的 `window.location`。`updateSpeedButtonHighlight` 内部 `document.querySelectorAll` 与 `document.querySelector`（data-speed 选择器）都要 mock：`querySelectorAll` 返回按钮数组，`querySelector` 返回对应按钮——上面的实现中 `updateSpeedButtonHighlight` 用 `document.querySelector(...[data-speed="${rate}"])`，需把 `doc.querySelector` 也 mock 返回 `btn1`：

```ts
doc.querySelector.mockImplementation((sel) => {
  if (sel === '.speed-control-button[data-speed="1.0"]') return btn1
  return null
})
```

- [ ] **Step 3: 改写 `element-remover.test.ts`**（fake timers + querySelector mock）

```bash
git mv src/__tests__/integration/element-remover.test.js src/__tests__/integration/element-remover.test.ts
```

```ts
import { describe, test, expect, mock, vi, beforeEach, afterEach } from 'bun:test'
import { createGMMock, stubGlobalGM, unstubGlobalGM } from '../helpers/mock-gm.ts'
import { createDocumentMock } from '../helpers/mock-document.ts'
import { resetSettings } from '../../settings/store.ts'

let gmMock: ReturnType<typeof createGMMock>
let doc: ReturnType<typeof createDocumentMock>

mock.module('../../core/element-getter.ts', () => ({
  waitElement: (selector: string) => Promise.resolve(document.querySelector(selector)),
  getVideoElement: () => null
}))

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  mock.stubGlobal('__TARGET__', 'tampermonkey')
  doc = createDocumentMock()
  mock.stubGlobal('document', doc)
  resetSettings()
})

afterEach(() => {
  unstubGlobalGM()
  mock.unstubAllGlobals()
  vi.useRealTimers()
})

describe('initYouTubeElementRemover — 条件移除 YouTube 元素', () => {
  test('启用的项目移除元素', async () => {
    gmMock.getValue.mockImplementation((key) => key === 'Youtube_Remove_Autoplay')

    const btn = doc.createElement('button')
    btn.className = 'ytp-autonav-toggle'
    doc.addEventListener('parent', () => {})
    doc.createElement = (() => btn) as ReturnType<typeof createDocumentMock>['createElement']
    doc.querySelector.mockImplementation((sel) => (sel === '.ytp-autonav-toggle' ? btn : null))

    const { initSettings } = await import('../../settings/store.ts')
    initSettings('https://www.youtube.com/watch?v=test')
    const { initYouTubeElementRemover } = await import('../../features/removal/remove-once.ts')
    await initYouTubeElementRemover({ Youtube_Remove_Autoplay: { selector: '.ytp-autonav-toggle', mode: 'remove' } })

    await new Promise((r) => setTimeout(r, 10))
    expect(btn.remove).toHaveBeenCalled()
  })
})

describe('initBilibiliElementRemover — 轮询移除 Bilibili 元素', () => {
  test('启用的项目在轮询中移除', async () => {
    vi.useFakeTimers()
    gmMock.getValue.mockImplementation((key) => key === 'Bilibili_Remove_Pip')

    const btn = doc.createElement('button')
    btn.className = 'bpx-player-ctrl-pip'
    const player = doc.createElement('div')
    player.classList.add('bpx-player-ctrl-pip')
    doc.querySelector.mockImplementation((sel) => {
      if (sel === '.bpx-player-ctrl-pip') return btn
      if (sel === '#bilibili-player') return player
      return null
    })

    const { initSettings } = await import('../../settings/store.ts')
    initSettings('https://www.bilibili.com/video/BV1xx')
    const { initBilibiliElementRemover } = await import('../../features/removal/remove-loop.ts')

    const intervalId = initBilibiliElementRemover(
      { Bilibili_Remove_Pip: { selector: '.bpx-player-ctrl-pip', mode: 'remove' } },
      { playerContainer: '#bilibili-player', webscreenClass: 'mode-webscreen' }
    )

    vi.advanceTimersByTime(1000)
    expect(btn.remove).toHaveBeenCalled()
    clearInterval(intervalId)
  })
})
```

- [ ] **Step 4: 改写 `auto-close-login-window.test.ts`**

```bash
git mv src/__tests__/integration/auto-close-login-window.test.js src/__tests__/integration/auto-close-login-window.test.ts
```

```ts
import { describe, test, expect, mock, vi, beforeEach, afterEach } from 'bun:test'
import { createDocumentMock } from '../helpers/mock-document.ts'
import { createVideoMock } from '../helpers/mock-video.ts'

let doc: ReturnType<typeof createDocumentMock>

mock.module('../../core/element-getter.ts', () => ({
  getVideoElement: () => (globalThis as Record<string, unknown>).__videoMock ?? null,
  waitElement: () => Promise.resolve(null)
}))

beforeEach(() => {
  doc = createDocumentMock()
  mock.stubGlobal('document', doc)
})

afterEach(() => {
  mock.unstubAllGlobals()
  vi.useRealTimers()
  ;(globalThis as Record<string, unknown>).__videoMock = undefined
})

describe('initAutoCloseLoginWindowGuard — 轮询关闭登录弹窗并恢复播放', () => {
  test('检测到登录弹窗时点击关闭按钮并恢复播放', async () => {
    vi.useFakeTimers()

    const closeBtn = doc.createElement('div')
    closeBtn.className = 'bili-mini-close-icon'
    doc.querySelector.mockReturnValue(closeBtn)

    const video = createVideoMock()
    video.paused = true
    ;(globalThis as Record<string, unknown>).__videoMock = video

    const { initAutoCloseLoginWindowGuard } = await import('../../features/auto-close-login-window.ts')
    const intervalId = initAutoCloseLoginWindowGuard('.bili-mini-close-icon')

    vi.advanceTimersByTime(1000)
    expect(closeBtn.click).toHaveBeenCalledTimes(1)
    expect(video.play).toHaveBeenCalledTimes(1)
    clearInterval(intervalId)
  })

  test('没有弹窗时不执行点击和播放', async () => {
    vi.useFakeTimers()
    doc.querySelector.mockReturnValue(null)
    const video = createVideoMock()
    video.paused = true
    ;(globalThis as Record<string, unknown>).__videoMock = video

    const { initAutoCloseLoginWindowGuard } = await import('../../features/auto-close-login-window.ts')
    const intervalId = initAutoCloseLoginWindowGuard('.bili-mini-close-icon')

    vi.advanceTimersByTime(1000)
    expect(video.play).not.toHaveBeenCalled()
    clearInterval(intervalId)
  })

  test('关闭弹窗后调用 onDialogClosed 回调', async () => {
    vi.useFakeTimers()
    const closeBtn = doc.createElement('div')
    doc.querySelector.mockReturnValue(closeBtn)

    const { initAutoCloseLoginWindowGuard } = await import('../../features/auto-close-login-window.ts')
    const onDialogClosed = mock(() => {})
    const intervalId = initAutoCloseLoginWindowGuard('.bili-mini-close-icon', onDialogClosed)

    vi.advanceTimersByTime(1000)
    expect(onDialogClosed).toHaveBeenCalledTimes(1)
    clearInterval(intervalId)
  })

  test('没有弹窗时不调用 onDialogClosed 回调', async () => {
    vi.useFakeTimers()
    doc.querySelector.mockReturnValue(null)

    const { initAutoCloseLoginWindowGuard } = await import('../../features/auto-close-login-window.ts')
    const onDialogClosed = mock(() => {})
    const intervalId = initAutoCloseLoginWindowGuard('.bili-mini-close-icon', onDialogClosed)

    vi.advanceTimersByTime(2000)
    expect(onDialogClosed).not.toHaveBeenCalled()
    clearInterval(intervalId)
  })
})
```

- [ ] **Step 5: 改写 `settings-panel.test.ts`**（删 DOM 计数断言，只测 loadSpeedLists / catalog 分派 / gm.setValue 参数）

```bash
git mv src/__tests__/integration/settings-panel.test.js src/__tests__/integration/settings-panel.test.ts
```

```ts
import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test'
import { createGMMock, stubGlobalGM, unstubGlobalGM } from '../helpers/mock-gm.ts'
import { createDocumentMock } from '../helpers/mock-document.ts'
import { resetSettings } from '../../settings/store.ts'
import { resetSettingsPanel } from '../../ui/settings-panel.ts'

let gmMock: ReturnType<typeof createGMMock>
let doc: ReturnType<typeof createDocumentMock>

beforeEach(() => {
  gmMock = createGMMock()
  stubGlobalGM(gmMock)
  mock.stubGlobal('__TARGET__', 'tampermonkey')
  doc = createDocumentMock()
  mock.stubGlobal('document', doc)
  resetSettings()
  resetSettingsPanel()
})

afterEach(() => {
  unstubGlobalGM()
  mock.unstubAllGlobals()
})

describe('store.loadSpeedLists — 从 GM 存储加载速度列表', () => {
  test('有效数据更新 shortcutSpeeds', () => {
    gmMock.getValue.mockImplementation((key, defaultValue) => {
      if (key === 'Shortcut_Speed_List') return '1.0,2.0,3.0'
      if (key === 'Button_Speed_List') return '0.5,1.0'
      return defaultValue
    })

    const { initSettings, getShortcutSpeeds, getButtonSpeeds } = require_store()
    initSettings('https://www.youtube.com/watch?v=xxx')

    expect(getShortcutSpeeds()).toEqual(['1', '2', '3'])
    expect(getButtonSpeeds()).toEqual(['0.5', '1'])
  })

  test('无效数据保留默认值', () => {
    gmMock.getValue.mockImplementation((key, defaultValue) => {
      if (key === 'Shortcut_Speed_List') return 'invalid'
      if (key === 'Button_Speed_List') return ''
      return defaultValue
    })

    const { initSettings, getShortcutSpeeds, getButtonSpeeds } = require_store()
    initSettings('https://www.youtube.com/watch?v=xxx')

    expect(getShortcutSpeeds()).toEqual(['0.5', '1.0', '1.5', '2.0', '2.5', '3.0'])
    expect(getButtonSpeeds()).toEqual(['0.5', '1.0', '1.5', '2.0'])
  })
})

describe('saveSettings — 保存速度列表设置', () => {
  test('有效输入调用 gm.setValue', () => {
    const { initSettings } = require_store()
    initSettings('https://www.youtube.com/watch?v=xxx')
    const { togglePanel } = require_panel()

    const shortcutInput = doc.getElementById('shortcutSpeedListInput')
    shortcutInput.value = '0.5,1.0,2.0'
    const buttonInput = doc.getElementById('buttonSpeedListInput')
    buttonInput.value = '1.0,1.5,2.0'

    togglePanel()
    doc.getElementById('saveBtn').click()

    expect(gmMock.setValue).toHaveBeenCalledWith('Shortcut_Speed_List', '0.5,1.0,2.0')
    expect(gmMock.setValue).toHaveBeenCalledWith('Button_Speed_List', '1.0,1.5,2.0')
  })
})

describe('catalog — 平台相关配置', () => {
  test('YouTube URL 加载 YouTube 配置项', () => {
    const { initSettings, getSettingPanelItems } = require_store()
    initSettings('https://www.youtube.com/watch?v=xxx')

    const items = getSettingPanelItems()
    expect(items.Youtube_Action_Rate).toBeDefined()
    expect(items.Youtube_Action_TheaterMode).toBeDefined()
    expect(items.Bilibili_Action_Rate).toBeUndefined()
  })

  test('Bilibili URL 加载 Bilibili 配置项', () => {
    const { initSettings, getSettingPanelItems } = require_store()
    initSettings('https://www.bilibili.com/video/BV1xx')

    const items = getSettingPanelItems()
    expect(items.Bilibili_Action_Rate).toBeDefined()
    expect(items.Bilibili_Action_WebFullscreen).toBeDefined()
    expect(items.Youtube_Action_Rate).toBeUndefined()
  })
})

function require_store() {
  return {
    initSettings: (url: string) => import('../../settings/store.ts').then((m) => m.initSettings(url)),
    getShortcutSpeeds: () => import('../../settings/store.ts').then((m) => m.getShortcutSpeeds()),
    getButtonSpeeds: () => import('../../settings/store.ts').then((m) => m.getButtonSpeeds()),
    getSettingPanelItems: () => import('../../settings/store.ts').then((m) => m.getSettingPanelItems())
  }
}
```
> 简化建议：`require_store()` 改为顶部静态 import `import { initSettings, getShortcutSpeeds, getButtonSpeeds, getSettingPanelItems } from '../../settings/store.ts'`，`require_panel()` 改为 `import { togglePanel } from '../../ui/settings-panel.ts'`。注意 saveSettings 测试中 `togglePanel()` 会 `initializePanel` 并注册 `saveBtn` click → `saveSettings`；因 mock-document 的 `getElementById` 从 registry 返回同一实例，`doc.getElementById('saveBtn').click()` 触发保存。

- [ ] **Step 6: 验证**

```bash
bun test src/__tests__/integration
bun run typecheck
```
Expected: 这 5 个测试文件全绿。

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "test: keyboard/speed-buttons/element-remover/auto-close-login-window/settings-panel 迁 bun:test + mock"
```

---

## Task 11: 移除 vitest/jsdom/rollup 依赖，最终验证

**Files:**
- Delete: `vitest.config.js`
- Delete: `src/__tests__/helpers/setup-vitest-env.js`
- Delete: `node_modules` 重新安装后不再包含 vitest/jsdom
- Modify: `package.json`（devDeps 仅剩 typescript、@types/bun；移除 rollup/@rollup/plugin-replace/@rollup/plugin-terser/jsdom/vitest）

**Interfaces:**
- Consumes: 前序全部任务产物。此任务后 `bun test` 为唯一测试入口，`bun build` 为唯一构建入口。

- [ ] **Step 1: 删除 vitest 相关文件**

```bash
git rm vitest.config.js src/__tests__/helpers/setup-vitest-env.js
```

- [ ] **Step 2: 确认 package.json devDeps 为最终形态**

```json
{
  "devDependencies": {
    "@types/bun": "^1.3.0",
    "typescript": "^5.9.0"
  }
}
```

- [ ] **Step 3: 重新安装**

```bash
rm -rf node_modules
bun install
```

- [ ] **Step 4: 全量验证**

```bash
bun test
bun run typecheck
bun run build
```
Expected: `bun test` 全绿（当前 14 个测试文件）；typecheck 无错误；构建输出 4 个产物。

- [ ] **Step 5: 手动回归清单**

在 YouTube / Bilibili 上验证（Tampermonkey 安装 `dist/latest/TubeBili.user.js`）：
- 首次运行自动弹出设置面板
- 快捷键 `,` / `.` 调速
- 倍速按钮创建与高亮
- 设置面板保存倍速列表（重新加载后生效）
- 自动关闭 Bilibili 登录窗
- 网页全屏 / 全屏恢复
- 设置面板打开/关闭（菜单命令 + 浮动按钮 Safari 版）

- [ ] **Step 6: 清理残留引用**

```bash
rg -n "vitest|jsdom|rollup" package.json src build.ts bunfig.toml 2>/dev/null || echo "无残留"
```
Expected: 无输出（或仅在 git 历史中）。

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: 移除 vitest/jsdom/rollup，bun test 为唯一测试入口"
```

---

## Self-Review（计划自审记录）

**Spec 覆盖检查：**
- §2 构建（build.ts/双目录/header/define/minify:false）→ Task 2、6 ✓
- §3 bun:test 兼容边界 + test-env → Task 1、8 ✓
- §4.1 三 mock + setup-gm-mock 改写 → Task 8（mock-gm.ts 吸收 setup-gm-mock.js）✓
- §4.2 14 个测试改写 → Task 8（main-flow）、9、10 ✓
- §4.3 删除 3 文件 → Task 7 ✓
- §4.4 entry/main 拆分 + reset 导出 → Task 6、8 ✓
- §5 TS 迁移（strict/接口契约/迁移顺序）→ Task 1（tsconfig）、3-6 ✓
- §6 验证策略 → Task 11 ✓

**占位符检查：** 所有代码步骤均含实际内容；测试代码块均给出可直接落地的最终形式（mock 断言对象从全局改为 `gmMock.*`，模块隔离用 `reset*` 导出替代 `vi.resetModules`）。无 TBD。

**类型一致性：** `PlatformAdapter`（Task 3）被 Task 6 youtube/bilibili 与 Task 9 adapter.test 使用；`GmApi`（Task 4）被 Task 6 settings-panel 使用；`resetShortcuts`/`resetSettingsPanel`/`resetTubeBili`/`resetSettings`（Task 4-6）被 Task 8、10 使用；`mock-gm/mock-document/mock-video`（Task 8）被 Task 9、10 使用。签名一致。
