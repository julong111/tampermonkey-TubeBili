---
role: technical-design
canonical_spec: openspec
---

# TubeBili Bun + TypeScript 迁移 — 技术设计文档

## 1. 概述

将 TubeBili 从当前工具链（npm + Rollup + Vitest + jsdom）全栈迁移到 Bun：

- **包管理**：npm → `bun install`（生成 `bun.lock`）
- **构建**：`rollup.config.js` + @rollup/plugin-* → 打包脚本 `build.ts`（基于 `Bun.build`）
- **测试**：Vitest + jsdom → `bun test`（bun:test），**不引入任何真实 DOM 环境**
- **语言**：全部源码与测试从 JavaScript 迁移到 TypeScript，`strict` 严格模式 + 完整类型

不修改任何现有功能，构建产物形态（双平台、双目录、header 注入）保持不变。

## 2. 构建系统

### 2.1 打包脚本 `build.ts`

新增根目录 `build.ts`，替代 `rollup.config.js`。核心结构：

```ts
// build.ts（示意）
import { build } from 'bun';

const targets: Array<{ file: string; target: 'tampermonkey' | 'userscripts' }> = [
  { file: 'dist/latest/TubeBili.user.js', target: 'tampermonkey' },
  { file: 'dist/latest/TubeBili.userscripts.js', target: 'userscripts' },
  // 版本目录 dist/vX.X.X/ 由脚本同步生成
];

for (const t of targets) {
  await build({
    entrypoints: ['src/entry.ts'],
    outfile: t.file,
    format: 'iife',
    minify: false,
    define: { __TARGET__: JSON.stringify(t.target) },
    banner: buildHeader(t.target), // 复用 src/build/ 下 header 模板
  });
}
```

要点：

- **双目录输出**：`dist/vX.X.X/` + `dist/latest/` 各写 `TubeBili.user.js` 与 `TubeBili.userscripts.js` 两份，与现状一致（版本号从 `package.json` 读取）
- **`__TARGET__`** 用 `Bun.build` 的 `define` 替换为 `'tampermonkey'` / `'userscripts'` 字面量，保留 tree-shaking 消除分支的能力
- **Header 注入** 用 `banner`；占位符替换（版本号、`@require`、`@grant` 等）复用 `src/build/header-tampermonkey.js`、`src/build/header-userscripts.js` 现有逻辑
- **不压缩**（`minify: false`）

### 2.2 脚本命令

`package.json` scripts 替换为：

```json
{
  "build": "bun build.ts",
  "dev": "bun build.ts --watch",
  "test": "bun test",
  "test:watch": "bun test --watch",
  "typecheck": "tsc --noEmit"
}
```

### 2.3 依赖变更

- **移除**（devDependencies）：`rollup`、`@rollup/plugin-replace`、`@rollup/plugin-terser`、`jsdom`、`vitest`、`vite`
- **新增**（devDependencies）：`typescript`、`@types/bun`
- 运行时无第三方依赖（现有格局不变）

## 3. 测试框架迁移

### 3.1 bun:test 兼容边界

以 Bun v1.3.14 为准（2026-05）。`vi` 兼容层提供：

- ✅ `vi.useFakeTimers()` / `vi.advanceTimersByTime()` / `vi.useRealTimers()` / `vi.fn()` / `vi.spyOn()` / `vi.clearAllMocks()` / `vi.restoreAllMocks()`
- ✅ 全局桩：用 `mock.stubGlobal()` / `mock.unstubAllGlobals()`（`vi.stubGlobal` 不可用）
- ✅ 模块桩：`mock.module()` + 重新 `import`
- ❌ `vi.resetModules()` **无替代** → 通过模块自身暴露 reset 函数解决（见 4.4）
- ❌ `vi.unmock` 等非必要 API 不依赖

### 3.2 测试环境

- `bunfig.toml`：

```toml
[test]
preload = ["./src/__tests__/helpers/test-env.ts"]
```

- `test-env.ts` 极简：仅设置 `globalThis.__TARGET__ = undefined` 默认值（替代原 `setup-vitest-env.js`）
- **不引入 happy-dom / jsdom / jsdom-vm 沙箱**；测试跑在 bun 默认环境 + 行为 mock

## 4. 测试策略：行为 mock，无真实 DOM

用户已确认：**不写真实 DOM 测试**。假定脚本操作浏览器 `document` 对象，测试时 mock 一个接口、正常返回即可，不假定其出错（不测失败路径）。只关注业务逻辑。

### 4.1 三个行为 mock（`src/__tests__/helpers/`）

| 文件 | 职责 |
|------|------|
| `mock-gm.ts` | `GM_getValue`/`GM_setValue` 读写内存 store（`getValue` 返回存储值或 default，`setValue` 写入 store）；`GM_addStyle`/`GM_registerMenuCommand` no-op。全部用 `mock.fn` 包裹，可断言调用参数 |
| `mock-document.ts` | `createElement` 返回带 `classList`/`style`/`addEventListener`/`dataset`/`value`/`checked` 的 element stub；`getElementById` 返回非 null 的 stub；`querySelector` 默认返回 null；`body`/`head`/`documentElement` 为 stub；`addEventListener`/`removeEventListener` no-op |
| `mock-video.ts` | `playbackRate: 1.0`、`paused: false`、`play()` 返回 resolved Promise |

- `setup-gm-mock.ts` 改写为导出 `createGMock()` / 全局注册逻辑（用 `mock.fn` 替代 vi.fn）
- 通过 `mock.stubGlobal()` 注册 `GM_*` 与 `document`，`mock.unstubAllGlobals()` 清理

### 4.2 保留并改写为纯业务测试（14 个文件）

| 测试文件 | 改写内容 |
|----------|----------|
| `gm-api/tampermonkey.test.js` | GM 转发正常返回：断言正确调用 `GM_getValue`/`GM_setValue` |
| `gm-api/userscripts.test.js` | localStorage 正常分支：读写断言 |
| `equivalence/url-detection.test.js` | 去掉 legacy 对比部分，保留 URL 判定纯逻辑 |
| `equivalence/validate-speed-list.test.js` | 去掉 legacy 对比部分，保留配置校验纯逻辑 |
| `equivalence/detect-language.test.js` | 去掉 legacy 对比部分，保留语言识别纯逻辑 |
| `platforms/adapter.test.js` | PlatformAdapter 契约纯逻辑（无需 DOM） |
| `header-metadata.test.js` | 纯 fs 解析，**不动** |
| `integration/keyboard.test.js` | 按键 → 倍速映射纯逻辑 |
| `integration/speed-buttons.test.js` | 断言 `panelCallback` 收到按钮；点击回调被触发 |
| `integration/element-remover.test.js` | fake timers 驱动 + `querySelector` mock（元素存在/不存在分支） |
| `integration/auto-close-login-window.test.js` | `closeBtn.click()`、`onDialogClosed()`、`paused` 时 `play()` |
| `integration/settings-panel.test.js` | **删 DOM 计数断言**，只测 `loadSpeedLists` / catalog 分派 / `gm.setValue` 参数 |
| `integration/main-flow.test.js` | 显式调用 `main()`，断言初始化调用与 `cleanup()` |
| `element-getter/element-getter.test.js` | `mock-document` 提供 fake `MutationObserver`（observe no-op + 触发回调），只测 `waitElement` 元素出现/超时分支 |

### 4.3 删除（3 个文件）

| 文件 | 原因 |
|------|------|
| `integration/web-fullscreen-tracking.test.js` | 重度依赖 MutationObserver 属性监听 + fullscreenchange 事件流，纯 DOM 行为，无业务价值 |
| `helpers/load-original-tampermonkey.js` | jsdom vm 沙箱加载原始脚本，已无用 |
| `helpers/load-original-userscripts.js` | 同上 |

### 4.4 可测试性改造（生产行为不变）

- `src/main.ts` 拆分为：
  - `src/entry.ts`：构建入口，`window.addEventListener('load', main)` + 边界处理（**自动执行**）
  - `src/main.ts`：导出 `main()` / `cleanup()` / `resetTubeBili()`，供测试直接调用
- `src/features/shortcut.ts`、`src/ui/settings-panel.ts`、`src/platforms/bilibili.ts` 增加 reset 导出，供测试间状态清理

## 5. TypeScript 迁移

- 所有 `src/**/*.js` → `.ts`，`src/__tests__/**/*.js` → `.ts`（`build.ts`、`bunfig.toml`、`test-env.ts`、mock 文件自然为 TS）
- `tsconfig.json`：`strict: true`、`module: "ESNext"`、`moduleResolution: "bundler"`、`target: "ES2022"`、`types: ["bun-types"]`、`lib: ["ES2022", "DOM"]`
- 关键类型契约：
  - `src/platforms/adapter.ts`：`PlatformAdapter` 导出为 `interface`（如 `VideoAdapter`），youtube/bilibili 实现之
  - `src/core/gm-api.ts`：`GmApi` 接口 + 平台实现
  - 视频元素操作收敛到 interface（`playbackRate`/`play()`/`paused` 等），与 `mock-video.ts` 对齐
- 迁移顺序（见实施计划）：类型最独立模块先行 → 有依赖模块 → 测试

## 6. 验证策略

1. `bun install` 成功、`bun.lock` 生成
2. `bun build.ts` → 输出 `dist/vX.X.X/` 与 `dist/latest/` 共 4 个文件；与旧 rollup 产物 diff 仅 header 版本一致性，逻辑等价
3. `bun test` 全部通过（改写后的业务测试）
4. `bun run typecheck` 无错误
5. 构建产物在 YouTube / Bilibili 上手动回归：倍速、快捷键、设置面板、自动关闭登录窗等

## 7. 风险与缓解

| 风险 | 缓解 |
|------|------|
| `Bun.build` 的 `banner`/`define` 与 rollup 行为差异 | 构建后 diff 产物，双目录一致性校验 |
| bun:test 与 vitest 行为差异导致断言遗漏 | 改写时逐文件对照原断言意图；等价测试去掉 legacy 对比前先记录原覆盖点 |
| 全局状态泄漏到测试间（原 `vi.resetModules` 隔离） | 4.4 的 reset 导出 + `mock.unstubAllGlobals()` |
| TS 严格模式下历史代码类型错误多 | 按依赖顺序分步迁移，每步过 typecheck |
