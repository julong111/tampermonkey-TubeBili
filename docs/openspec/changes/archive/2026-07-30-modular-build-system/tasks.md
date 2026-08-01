## 1. 项目初始化

- [x] 1.1 创建 `package.json`，添加 Rollup 构建依赖
- [x] 1.2 创建 `rollup.config.js`，配置两个输出 target
- [x] 1.3 创建 `src/` 目录结构

## 2. Header 模板与构建配置

- [x] 2.1 创建 `scripts/header-tampermonkey.js`——Tampermonkey 版 UserScript header 模板
- [x] 2.2 创建 `scripts/header-userscripts.js`——Safari Userscripts 版 header 模板
- [x] 2.3 配置 Rollup banner 插件，按 target 注入对应 header

## 3. GM API 抽象层

- [x] 3.1 创建 `src/gm-api.js`——统一接口（通过 `__TARGET__` 条件编译区分平台实现）
- [x] 3.2 条件编译实现：TM 版直接调用原生 GM_*，Safari 版内联 Polyfill
- [x] 3.3 配置 Rollup `@rollup/plugin-replace` 按 target 替换 `__TARGET__`

## 4. ElementGetter 模块

- [x] 4.1 创建 `src/element-getter.js`——统一接口 `{ waitElement, waitAnyElement }`
- [x] 4.2 TM 版：保留 `@require`，运行时通过全局 ElementGetter 调用
- [x] 4.3 Safari 版：内联完整 MutationObserver 实现

## 5. 核心模块抽取

- [x] 5.1 创建 `src/i18n.js`——从双文件抽取 i18n 字典，统一为一个来源
- [x] 5.2 创建 `src/ui/styles.js`——CSS 样式（统一为 TM 版白色半透明按钮样式）
- [x] 5.3 创建 `src/ui/settings-panel.js`——设置面板 UI
- [x] 5.4 创建 `src/features/rate-control.js`——自动倍速功能
- [x] 5.5 创建 `src/features/shortcut.js`——快捷键处理
- [x] 5.6 创建 `src/features/element-remover.js`——移除按钮/元素功能（Bilibili interval 统一 1000ms）

## 6. 平台适配

- [x] 6.1 创建 `src/platforms/youtube.js`——YouTube 特定逻辑（影院模式、自动播放开关等）
- [x] 6.2 创建 `src/platforms/bilibili.js`——Bilibili 特定逻辑（网页全屏、分辨率等）

## 7. 入口与清理逻辑

- [x] 7.1 创建 `src/main.js`——入口，组合所有模块
- [x] 7.2 在 `src/main.js` 中添加清除定时器逻辑（cleanup，两版本统一）

## 8. 构建验证

- [x] 8.1 运行 `npm run build`，确认输出 `dist/TubeBili.user.js` 和 `dist/TubeBili.userscripts.js`
- [x] 8.2 构建验证通过：`dist/TubeBili.user.js` (1501行) + `dist/TubeBili.userscripts.js` (1608行) 成功输出


## 9. 文档与收尾

- [x] 9.1 更新 `README.md` 添加构建说明
- [x] 9.2 已确认 `.gitignore` 包含 `dist/`、`.superpowers/`
- [x] 9.3 保留根目录原始文件（`TubeBili.user.js`、`TubeBili.userscripts.js`），不做删除
