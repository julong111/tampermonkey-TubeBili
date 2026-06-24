# TubeBili — AGENTS.md

## 项目结构

- **`TubeBili.user.js`** — 标准油猴版。使用 `@require` 引入 ElementGetter，`@grant` 声明 GM_* API。
- **`TubeBili.userscripts.js`** — Safari/Userscripts 版。无 `@require`，`@grant none`。内嵌基于 `localStorage` 的 GM polyfill。
- **`documents/source.js`** — 开发源码（旧版，可能与已部署的文件有差异）。
- **`documents/buildzip.js`** — 构建脚本：TubeBili.dev.js → Terser 压缩 → JavaScript Obfuscator 混淆 → TubeBili.user.js。需要根目录存在 `TubeBili.dev.js`（当前不存在）。
- **`documents/arch.md`** — 架构文档；描述了一个计划中的 Rollup 重构，但**尚未实现**（不存在 `package.json` 和 `rollup.config.js`）。
- **`documents/todo.txt`** — YouTube/Bilibili 播放器按钮的选择器参考。

**本项目没有构建系统、没有包管理器、没有测试/CI/lint 基础设施。**

## 双文件同步维护规则

两个 `.user.js` 文件包含完全相同的逻辑。**对其中一个文件的每一次修改，都必须同步到另一个。** 差异点：
- `TubeBili.user.js`：`@require ElementGetter`，`@grant GM_*`，`@match https://*.youtube.com/*`（显式协议）
- `TubeBili.userscripts.js`：使用 `localStorage` 的 GM polyfill，无 `@require`，`@grant none`，`@match *://*.youtube.com/*`（通配符协议）

## 架构（单文件 IIFE）

两个文件结构相同：
```
main() → WebSite.youtube() 或 WebSite.bilibili()
  ├── Common 模块：倍速按钮、设置面板、键盘快捷键、存储
  ├── WebSite.youtube：基于 elmGetter.get()，每次导航执行一次
  └── WebSite.bilibili：elmGetter.get() + setInterval 轮询（1000ms 移除，200ms 显隐切换）
```

- `@run-at document-start`，匹配 `*.youtube.com/*` + `*.bilibili.com/*`，排除 `accounts.youtube.com/*`
- CSS 选择器定位 YouTube（`#movie_player .ytp-*`）和 Bilibili（`.bpx-player-ctrl-*`、`#bilibili-player`）播放器元素
- SPA 导航：YouTube 使用 `yt-navigate-finish` 事件，Bilibili 使用监听 `location.href` 的 `MutationObserver`

## 注意事项

- **注释代码**：Bilibili「未登录无限试用1080P」功能在两个文件中均被完整注释（早期劫持 + UI 开关）。
- **定时器冲突**（arch.md §3）：`bilibiliHideToggleInterval`（200ms）和 `removalConfigs`（1000ms）同时管理 `mode: "hide"` 的按钮，偶尔导致闪烁。arch.md 建议合并为一个 200ms 定时器——`TubeBili.user.js` 中尚未实现（但 `documents/source.js` 中可能已包含）。
- **版本标记**：`TubeBili.userscripts.js` 版本号为 `2.0.2-safari`。
- **表单式设置键名**：例如 `Youtube_Action_Rate_Enabled` + `Youtube_Action_Rate_Value`。键同时用作 GM 存储键和 HTML 元素 ID。
- **保存时同步写入 GM 和 localStorage**，以兼容两个版本。
