# Brainstorm Summary

- Change: modular-build-system
- Date: 2026-07-30

## 确认的技术方案

Rollup 双 target 构建，一份 `rollup.config.js` 输出两个平台版本。平台差异通过 `__TARGET__` 条件编译变量处理，tree-shaking 消除死代码。

### 架构

```
src/gm-api.js         → 统一 GM API 接口，按平台条件编译实现
src/element-getter.js → 统一接口，TM @require / Safari 内联
src/ 其余模块          → 共享代码，少量 __TARGET__ 条件
```

### 模块结构

```
src/
├── gm-api.js
├── element-getter.js
├── i18n.js
├── ui/
│   ├── settings-panel.js
│   ├── styles.js
│   └── floating-btn.js        (Safari only)
├── features/
│   ├── rate-control.js
│   ├── shortcut.js
│   ├── element-remover.js
│   └── bilibili/
│       ├── web-fullscreen.js
│       └── ad-trial.js
├── platforms/
│   ├── youtube.js
│   └── bilibili.js
└── main.js
```

### 差异统一处理
- 按钮样式 → TM 版白色半透明
- Bilibili 移除间隔 → 统一 1000ms
- Cleanup 逻辑 → 两版本均添加
- 原始文件保留，构建产物输出 dist/

## 关键取舍与风险

- Rollup 配置复杂度可控，模块化使新增平台只需加新的 target
- @require 外部 ElementGetter 与内联实现需保证接口一致

## 测试策略

不做单元测试（保留后续添加可能性）。构建后通过对比构建输出与原始文件验证功能一致性。

## Spec Patch

无（纯重构/工具链变更，skip_specs: true）
