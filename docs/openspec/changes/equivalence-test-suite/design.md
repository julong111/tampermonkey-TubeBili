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
