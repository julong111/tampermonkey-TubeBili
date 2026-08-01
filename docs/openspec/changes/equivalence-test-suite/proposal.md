## Why

TubeBili 已完成工程化重构：将单文件 `TubeBili.user.js` / `TubeBili.userscripts.js` 拆分为 `src/` 下的模块化源码，通过 Rollup 构建出 `dist/` 产物。当前**缺乏任何自动化验证手段**来证明构建产物与原始脚本行为等价。需要建立测试基础设施，以防后续修改引入回归。

## What Changes

- 新增 Vitest 测试框架 + jsdom DOM 模拟
- 新增旧版脚本 VM 沙箱加载器（`load-original-*.js`），直接加载原始文件，不复制函数体
- 新增等价对比测试：对每个纯逻辑函数，用同一组输入同时跑旧版和新版，断言输出一致
- 新增 GM API 层测试：验证 `gm-api.js` 在 tampermonkey 和 userscripts 两个目标下的正确实现
- 新增集成测试：对 `settings-panel`、`shortcut`、`rate-control`、`element-remover` 等模块，mock GM/DOM 后验证业务逻辑
- 新增 header 元数据验证：确认 4 个文件的 metadata block 与模板一致
- 不修改任何业务源码或构建配置

## Capabilities

### New Capabilities

无。本次变更**不引入新用户功能**，也不修改现有行为。`skip_specs: true`。

### Modified Capabilities

无。

## Impact

- `package.json` — 新增 `vitest`、`jsdom` devDependencies + `test` scripts
- `vitest.config.js` — 新建，`environment: jsdom`
- `src/__tests__/` — 新建完整测试目录结构（helpers/、equivalence/、gm-api/、element-getter/、integration/、header-metadata）
- 现有源文件不变，构建流程不变
