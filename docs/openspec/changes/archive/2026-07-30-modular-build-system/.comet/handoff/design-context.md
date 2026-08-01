# Comet Design Handoff

- Change: modular-build-system
- Phase: design
- Mode: compact
- Context hash: 59b7bd2c0f8313ae456aa14dd3b56fb631cea09fb1ea8fce4445d9a0fcedf34a

Generated-by: comet-handoff.sh

OpenSpec remains the canonical capability spec. This handoff is a deterministic, source-traceable context pack, not an agent-authored summary.

## docs/openspec/changes/modular-build-system/proposal.md

- Source: docs/openspec/changes/modular-build-system/proposal.md
- Lines: 1-26
- SHA256: f04e78e4edfb630b520184ee80df0b04c063c1897533cd1898b93599170a9a28

```md
## Why

TubeBili 目前维护两份功能相同但平台适配不同的 userscript 文件：`TubeBili.user.js`（Tampermonkey）和 `TubeBili.userscripts.js`（Safari Userscripts）。每次功能变更都需要在两个文件中同步修改，不仅工作量大，而且容易遗漏或产生不一致。此外，1465+1694 行的单体文件也让代码理解和模块化复用变得困难。

本项目希望通过工程化手段解决维护难题：将源代码拆分为细粒度模块，通过构建工具自动输出两个平台对应的最终脚本。

## What Changes

- 将所有源代码移到 `src/` 目录，按功能拆分为细粒度模块
- 引入 Rollup 构建工具，一份配置输出两个目标文件
- 抽取平台适配层（GM API Polyfill / ElementGetter），构建时按平台注入
- Tampermonkey 版保留 `@require` + `@grant GM_*` header
- Safari Userscripts 版使用 `@grant none` header，构建时内联 Polyfill + ElementGetter
- 不修改任何现有功能逻辑
- 保留根目录原始文件 `TubeBili.user.js` 和 `TubeBili.userscripts.js`，构建产物输出到 `dist/`

## Capabilities

纯重构/工具链变更，不涉及行为级变更，无需 specs。

## Impact

- **构建流程**：新增 Rollup 配置、npm scripts（`build`、`dev`、`lint`）
- **源码结构**：从两个单体文件变为 `src/` 下多个模块文件
- **运行时**：零影响，最终输出脚本功能与原版完全一致
- **依赖**：新增 `rollup`、`@rollup/plugin-node-resolve` 等开发依赖

```

## docs/openspec/changes/modular-build-system/design.md

- Source: docs/openspec/changes/modular-build-system/design.md
- Lines: 1-94
- SHA256: c9118d4ea957e97aaec162890d7d6b344476f78bd5393ab41db0119bf89eda25

[TRUNCATED]

```md
## Context

见 proposal.md。本项目将两个独立的 userscript 文件重构为模块化源码 + 构建工具输出的工程化方案。

## Goals / Non-Goals

**Goals:**
- 所有功能逻辑统一在 `src/` 下开发，使用 Rollup 构建输出两个平台版本
- 平台差异（GM API、ElementGetter、header 元数据）通过 Rollup 插件机制在构建时注入
- 保持两个版本的运行时行为与当前完全一致

**Non-Goals:**
- 不修改任何功能逻辑
- 不新增功能
- 不做单元测试（但保留后续添加的可能性）

## Decisions

### 1. 构建工具：Rollup

**选择理由：** Rollup 原生支持数组式多输出目标，一份 `rollup.config.js` 同时在 `dist/` 下输出两个文件。配合 `@rollup/plugin-replace` 实现条件编译，`banner` 选项注入不同 header。

### 2. 平台适配策略：抽象层 + 构建时注入

```
src/gm-api.js ──→ 统一接口 { getValue, setValue, addStyle, registerMenuCommand }
  ├─ Rollup tampermonkey target: 直接调用原生 GM_* (构建时 banner 注入 @grant)
  └─ Rollup userscripts target:     注入 GM_Polyfill 实现 (构建时注入完整 polyfill)
```

`src/element-getter.js` 统一 `export { waitElement }`：
- TM 版：保留 `@require` 外部 CDN，源码只做 re-export
- Safari 版：构建时内联完整实现

### 3. 模块结构

```
src/
├── gm-api.js              # GM API 抽象层（统一接口）
├── element-getter.js      # Element 等待工具
├── i18n.js                # 国际化字典
├── platform-adapter.js    # 平台差异适配（match URL、bilibili interval 等）
├── ui/
│   ├── settings-panel.js  # 设置面板
│   ├── styles.js          # CSS 样式
│   └── floating-btn.js    # Safari 浮动按钮（TM 版 tree-shaking 消除）
├── features/
│   ├── rate-control.js    # 自动倍速
│   ├── shortcut.js        # 快捷键
│   ├── element-remover.js # 移除按钮/元素
│   └── bilibili/
│       ├── web-fullscreen.js
│       └── ad-trial.js    # 1080P 试用（已注释）
├── platforms/
│   ├── youtube.js         # YouTube 特定逻辑
│   └── bilibili.js        # Bilibili 特定逻辑
└── main.js                # 入口
```

### 4. Header 生成

使用 Rollup `banner` 选项 + 模板字符串，每个 target 有独立的 banner：

```js
// tampermonkey banner
'// ==UserScript==\n// @name TubeBili - ...\n// @require https://...\n// @grant GM_addStyle\n...'

// userscripts banner  
'// ==UserScript==\n// @name TubeBili - ... (Safari/通用版)\n// @grant none\n...'
```

### 5. 构建流程

```
npm run build
  └─ rollup -c
       ├─ target: tampermonkey → dist/TubeBili.user.js
       └─ target: userscripts  → dist/TubeBili.userscripts.js
```


```

Full source: docs/openspec/changes/modular-build-system/design.md

## docs/openspec/changes/modular-build-system/tasks.md

- Source: docs/openspec/changes/modular-build-system/tasks.md
- Lines: 1-54
- SHA256: 5412d39aa6d69ccb866979612dc60d3eda98ce83f9a3f96b66892ed6a400b312

```md
## 1. 项目初始化

- [ ] 1.1 创建 `package.json`，添加 Rollup 构建依赖
- [ ] 1.2 创建 `rollup.config.js`，配置两个输出 target
- [ ] 1.3 创建 `src/` 目录结构

## 2. Header 模板与构建配置

- [ ] 2.1 创建 `scripts/header-tampermonkey.js`——Tampermonkey 版 UserScript header 模板
- [ ] 2.2 创建 `scripts/header-userscripts.js`——Safari Userscripts 版 header 模板
- [ ] 2.3 配置 Rollup banner 插件，按 target 注入对应 header

## 3. GM API 抽象层

- [ ] 3.1 创建 `src/gm-api.js`——统一接口 `{ getValue, setValue, addStyle, registerMenuCommand }`
- [ ] 3.2 创建 `src/gm-api.userscripts.js`——Safari 版 GM Polyfill 实现（localStorage 替代）
- [ ] 3.3 配置 Rollup 按 target 替换 `src/gm-api.js` 实现

## 4. ElementGetter 模块

- [ ] 4.1 创建 `src/element-getter.js`——统一接口 `{ waitElement, waitAnyElement }`
- [ ] 4.2 TM 版：保留 `@require`，模块做 re-export
- [ ] 4.3 Safari 版：内联完整实现（MutationObserver 版本）

## 5. 核心模块抽取

- [ ] 5.1 创建 `src/i18n.js`——从双文件抽取 i18n 字典，统一为一个来源
- [ ] 5.2 创建 `src/ui/styles.js`——CSS 样式（统一为 TM 版白色半透明按钮样式）
- [ ] 5.3 创建 `src/ui/settings-panel.js`——设置面板 UI
- [ ] 5.4 创建 `src/features/rate-control.js`——自动倍速功能
- [ ] 5.5 创建 `src/features/shortcut.js`——快捷键处理
- [ ] 5.6 创建 `src/features/element-remover.js`——移除按钮/元素功能（Bilibili interval 统一 1000ms）

## 6. 平台适配

- [ ] 6.1 创建 `src/platforms/youtube.js`——YouTube 特定逻辑（影院模式、自动播放开关等）
- [ ] 6.2 创建 `src/platforms/bilibili.js`——Bilibili 特定逻辑（网页全屏、分辨率等）

## 7. 入口与清理逻辑

- [ ] 7.1 创建 `src/main.js`——入口，组合所有模块
- [ ] 7.2 在 `src/main.js` 中添加清除定时器逻辑（cleanup，两版本统一）

## 8. 构建验证

- [ ] 8.1 运行 `npm run build`，确认输出 `dist/TubeBili.user.js` 和 `dist/TubeBili.userscripts.js`
- [ ] 8.2 对比构建输出与原始文件功能一致性


## 9. 文档与收尾

- [ ] 9.1 更新 `README.md` 构建说明
- [ ] 9.2 更新 `.gitignore` 添加 `dist/` 相关规则
- [ ] 9.3 保留根目录原始文件（`TubeBili.user.js`、`TubeBili.userscripts.js`），不做删除

```
