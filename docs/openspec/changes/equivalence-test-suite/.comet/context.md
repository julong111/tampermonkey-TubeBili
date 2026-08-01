# Comet Design Handoff

- Change: equivalence-test-suite
- Phase: design
- Mode: compact
- Context hash: 770d7aaecc8173e52054afb467da6987efddeb504a094c131743c71024f39697

Generated-by: comet-handoff.sh

OpenSpec remains the canonical capability spec. This handoff is a deterministic, source-traceable context pack, not an agent-authored summary.

## docs/openspec/changes/equivalence-test-suite/proposal.md

- Source: docs/openspec/changes/equivalence-test-suite/proposal.md
- Lines: 1-30
- SHA256: b8426b120f43db451d65299cb32536b19568df4d9c0a97bdd781c490af5aeb50

```md
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

```

## docs/openspec/changes/equivalence-test-suite/design.md

- Source: docs/openspec/changes/equivalence-test-suite/design.md
- Lines: 1-60
- SHA256: d5cebf38d95687b6061522903cc243cf2897a306984860cf63443290d3d1e144

```md
## Context

项目现状见 proposal.md。本次只新增测试基础设施，不修改任何业务源码和构建配置。

被测四文件：
- `TubeBili.user.js` (原始 TM, 1465 行) — `dist/TubeBili.user.js` (构建 TM, 1499 行)
- `TubeBili.userscripts.js` (原始 US, 1694 行) — `dist/TubeBili.userscripts.js` (构建 US, 1606 行)

核心挑战：脚本运行在浏览器 Tampermonkey 环境中，依赖 DOM 和 GM_* API，无法直接在 Node.js 中运行。

## Goals / Non-Goals

**Goals:**
- 纯函数（无外部依赖）的单元测试全覆盖
- 带 mock 的集成函数测试覆盖主要业务逻辑
- 旧版 vs 新版等价对比测试（VM 沙箱直接加载旧版）
- GM API 层双目标分支验证（tampermonkey / userscripts）
- 元素获取层 userscripts 内联实现验证
- Header 元数据验证

**Non-Goals:**
- 不测试 CSS 渲染效果（视觉由人工验证）
- 不测第三方库 ElementGetter（Tampermonkey @require）
- 不修改任何业务代码
- 不做浏览器端 E2E 测试

## Decisions

### 1. 测试框架：Vitest（而非 Jest）
- 项目已是 ESM + Rollup，Vitest 原生支持 ESM，无需额外转译
- 配置极简（几行即可），与构建工具链一致
- jsdom 环境原生支持

### 2. 旧版加载：VM 沙箱 + 单行注入（而非复制旧逻辑）
- 用 Node.js `vm.createContext` 创建沙箱
- 机械替换原始文件的 `})()` 闭合——插入一行 `globalThis.__TB_ORIG = {Common, ...}`
- 替换 `main()` 调用为捕获语句，防止自动执行
- 提供全部 mock（GM_*, ElementGetter, localStorage, DOM）
- **不复制任何函数体**，零引入错误风险

### 3. 两套加载器分离
- `load-original-tm.js` — 加载 `TubeBili.user.js`，需 mock GM_* + ElementGetter
- `load-original-us.js` — 加载 `TubeBili.userscripts.js`，自带 GM_Polyfill + 内联 ElementGetter

### 4. 等价对比策略
对同一组 inputs，同时跑旧版和新版函数，断言输出一致：
```js
test.each(cases)('等价: %s', (input) => {
  expect(newFn(input)).toEqual(oldFn(input))
})
```

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| VM 沙箱环境与真实浏览器有差异 | 只在纯函数和 mock 完备的函数上用等价对比；DOM 密集型函数单独写集成测试 |
| jsdom MutationObserver 实现不完整 | element-getter 的内联 MutationObserver 实现仅验证关键路径，不测边界时序 |
| 旧版代码中的 `var` 变量提升影响沙箱 | 沙箱创建时预注册全部 mock 标识符 |
| `__TARGET__` 是编译时常量，测试时不可用 | 使用 `vi.mock` 或条件重写模拟两个分支 |

```

## docs/openspec/changes/equivalence-test-suite/tasks.md

- Source: docs/openspec/changes/equivalence-test-suite/tasks.md
- Lines: 1-36
- SHA256: 07127605372eaf0f9147748f49a3484c3f61d8f1abd09d1a90b68216a3c86a79

```md
## 1. 基础设施搭建

- [ ] 1.1 安装 vitest + jsdom 依赖，配置 vitest.config.js，添加 test scripts 到 package.json
- [ ] 1.2 创建 `src/__tests__/helpers/load-original-tm.js`：VM 沙箱加载原始 TubeBili.user.js，注入捕获代码，mock GM_* 和 ElementGetter
- [ ] 1.3 创建 `src/__tests__/helpers/load-original-us.js`：VM 沙箱加载原始 TubeBili.userscripts.js，注入捕获代码，提供 localStorage + MutationObserver 环境
- [ ] 1.4 创建 `src/__tests__/helpers/setup-gm-mock.js`：通用 GM mock 工厂（双目标可用）
- [ ] 1.5 创建 `src/__tests__/helpers/setup-vitest-env.js`：Vitest 全局 setup（jsdom 调优）

## 2. 纯函数等价对比测试（P0）

- [ ] 2.1 `src/__tests__/equivalence/validate-speed-list.test.js` — 25+ 边界用例，对比旧版 TM、旧版 US、新版三者输出一致
- [ ] 2.2 `src/__tests__/equivalence/detect-language.test.js` — 验证旧版/新版 detectLanguage 和 t() 输出一致
- [ ] 2.3 `src/__tests__/equivalence/url-detection.test.js` — 验证 isYoutubePage / isYoutubeWatchPage / isBilibiliVideoPage 旧版/新版一致

## 3. GM API 层验证（P1）

- [ ] 3.1 `src/__tests__/gm-api/tampermonkey.test.js` — 验证 `__TARGET__='tampermonkey'` 分支：gm.getValue/setValue/addStyle/registerMenuCommand 正确转发到 GM_* API
- [ ] 3.2 `src/__tests__/gm-api/userscripts.test.js` — 验证 `__TARGET__='userscripts'` 分支：gm.getValue/setValue 使用 localStorage，addStyle 创建 <style>，registerMenuCommand 创建浮动按钮
- [ ] 3.3 `src/__tests__/element-getter/userscripts.test.js` — 验证 userscripts 内联 MutationObserver 实现的 waitElement/waitAnyElement

## 4. 集成函数测试（P2）

- [ ] 4.1 `src/__tests__/integration/settings-panel.test.js` — loadSpeedList / updateSpeedSelects / createSettingItem / saveSettings / togglePanel / initSettingItems
- [ ] 4.2 `src/__tests__/integration/keyboard.test.js` — handleKeydown Comma/Period 跳转、边界、input 跳过
- [ ] 4.3 `src/__tests__/integration/speed-buttons.test.js` — createSpeedButtons platform class、按钮列表、setPlaybackRate + showSpeedIndicator + updateSpeedButtonHighlight
- [ ] 4.4 `src/__tests__/integration/element-remover.test.js` — initYouTubeElementRemover / initBilibiliElementRemover 条件移除

## 5. 编排与元数据验证

- [ ] 5.1 `src/__tests__/integration/main-flow.test.js` — main() 初始化流程、平台分发、cleanup
- [ ] 5.2 `src/__tests__/header-metadata.test.js` — 验证 4 个文件的 header 与模板一致（@version、@grant、@match 等）

## 6. 运行验证

- [ ] 6.1 确保 `npm test` 全部通过
- [ ] 6.2 验证 `npm run build` 后测试依然通过

```
