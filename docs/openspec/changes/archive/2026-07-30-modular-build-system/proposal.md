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
