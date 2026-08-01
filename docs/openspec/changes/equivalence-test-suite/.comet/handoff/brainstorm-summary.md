# Brainstorm Summary

- Change: equivalence-test-suite
- Date: 2026-07-30

## 确认的技术方案

- **测试框架**：Vitest（项目已是 ESM + Rollup，原生支持，无需转译）
- **DOM 环境**：jsdom（轻量，可在 Node.js 中运行，无需真实浏览器）
- **旧版加载**：Node.js `vm.createContext` 沙箱 + 一行注入捕获代码，直接加载原始 `.user.js` 文件，不复制任何函数体
- **加载器分离**：两套独立加载器——`load-original-tampermonkey.js` 加载原始 `TubeBili.user.js`（Tampermonkey 目标），`load-original-userscripts.js` 加载原始 `TubeBili.userscripts.js`（Userscripts 目标）
- **等价对比方法**：对同一组 inputs，同时跑旧版和新版，`expect(new).toEqual(old)`

## 关键取舍与风险

| 取舍点 | 选择 | 理由 |
|--------|------|------|
| VM 沙箱 vs 复制逻辑 | VM 沙箱注入 | 零复制错误风险，100% 原始代码 |
| Vitest vs Jest | Vitest | ESM 原生、Rollup 生态一致、配置极简 |
| jsdom vs Playwright | jsdom | 纯逻辑和轻量集成测试足够，无需浏览器启动 |

| 风险 | 缓解 |
|------|------|
| VM 沙箱与真实浏览器环境差异 | 纯函数和 mock 完备的函数用等价对比；DOM 密集型函数单独集成测试 |
| jsdom MutationObserver 不完整 | element-getter 内联实现仅验证关键路径 |

## 测试策略

四层测试：
1. **P0 等价对比** — 纯函数（validateSpeedList、detectLanguage、URL 检测），无 mock，旧版新版同输入对比输出
2. **P1 GM API 层** — `gm-api.js` 双目标分支（Tampermonkey vs Userscripts），`__TARGET__` 编译常量的条件覆盖
3. **P2 集成测试** — settings-panel、shortcut、rate-control、element-remover，mock GM/DOM 后验证业务逻辑
4. **P3 元数据验证** — header 的 @version、@grant、@match 与模板一致

## Spec Patch

无。`skip_specs: true`，不涉及任何行为变更。
