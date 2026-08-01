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

已确认两版本之间存在以下差异点（将在 tasks 中列明需确认的冲突项）：
- 样式差异：按钮背景色/边框/文字颜色
- Bilibili 定时移除间隔：200ms vs 1000ms
- Safari 版有额外的 cleanup 逻辑

## Risks / Trade-offs

- **风险**：Rollup 配置复杂度上升。**缓解**：配置集中管理，模块化设计使新增平台只需要加一个新的 target
- **风险**：`@require` 外部 ElementGetter 与内联实现的 API 不一致。**缓解**：验证最终输出中 TM 版通过 `@require` 加载后 `window.ElementGetter` 可用，Safari 版内联实现接口一致
- **风险**：重构过程中可能遗漏平台差异点。**缓解**：通过 diff 完整清单逐项核对，构建后做功能回归对比

## Open Questions

（已与用户确认，以下差异统一处理：1️⃣ 样式统一为 TM 版白色半透明，Safari 深色是疏忽；2️⃣ Bilibili 移除间隔统一 1000ms；3️⃣ Cleanup 逻辑两版本均添加）
