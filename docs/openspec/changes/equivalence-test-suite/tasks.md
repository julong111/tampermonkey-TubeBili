## 1. 基础设施搭建

- [x] 1.1 安装 vitest + jsdom 依赖，配置 vitest.config.js，添加 test scripts 到 package.json
- [x] 1.2 创建 `src/__tests__/helpers/load-original-tm.js`：VM 沙箱加载原始 TubeBili.user.js，注入捕获代码，mock GM_* 和 ElementGetter
- [x] 1.3 创建 `src/__tests__/helpers/load-original-us.js`：VM 沙箱加载原始 TubeBili.userscripts.js，注入捕获代码，提供 localStorage + MutationObserver 环境
- [x] 1.4 创建 `src/__tests__/helpers/setup-gm-mock.js`：通用 GM mock 工厂（双目标可用）
- [x] 1.5 创建 `src/__tests__/helpers/setup-vitest-env.js`：Vitest 全局 setup（jsdom 调优）

## 2. 纯函数等价对比测试（P0）

- [x] 2.1 `src/__tests__/equivalence/validate-speed-list.test.js` — 25+ 边界用例，对比旧版 TM、旧版 US、新版三者输出一致
- [x] 2.2 `src/__tests__/equivalence/detect-language.test.js` — 验证旧版/新版 detectLanguage 和 t() 输出一致
- [x] 2.3 `src/__tests__/equivalence/url-detection.test.js` — 验证 isYoutubePage / isYoutubeWatchPage / isBilibiliVideoPage 旧版/新版一致

## 3. GM API 层验证（P1）

- [x] 3.1 `src/__tests__/gm-api/tampermonkey.test.js` — 验证 `__TARGET__='tampermonkey'` 分支：gm.getValue/setValue/addStyle/registerMenuCommand 正确转发到 GM_* API
- [x] 3.2 `src/__tests__/gm-api/userscripts.test.js` — 验证 `__TARGET__='userscripts'` 分支：gm.getValue/setValue 使用 localStorage，addStyle 创建 <style>，registerMenuCommand 创建浮动按钮
- [x] 3.3 `src/__tests__/element-getter/userscripts.test.js` — 验证 userscripts 内联 MutationObserver 实现的 waitElement/waitAnyElement

## 4. 集成函数测试（P2）

- [x] 4.1 `src/__tests__/integration/settings-panel.test.js` — loadSpeedList / updateSpeedSelects / createSettingItem / saveSettings / togglePanel / initSettingItems
- [x] 4.2 `src/__tests__/integration/keyboard.test.js` — handleKeydown Comma/Period 跳转、边界、input 跳过
- [x] 4.3 `src/__tests__/integration/speed-buttons.test.js` — createSpeedButtons platform class、按钮列表、setPlaybackRate + showSpeedIndicator + updateSpeedButtonHighlight
- [x] 4.4 `src/__tests__/integration/element-remover.test.js` — initYouTubeElementRemover / initBilibiliElementRemover 条件移除

## 5. 编排与元数据验证

- [x] 5.1 `src/__tests__/integration/main-flow.test.js` — main() 初始化流程、平台分发、cleanup
- [x] 5.2 `src/__tests__/header-metadata.test.js` — 验证 4 个文件的 header 与模板一致（@version、@grant、@match 等）

## 6. 运行验证

- [x] 6.1 确保 `npm test` 全部通过
- [x] 6.2 验证 `npm run build` 后测试依然通过