import { readFileSync } from 'fs'
import { createContext, runInContext } from 'vm'
import { JSDOM } from 'jsdom'

let original = null

export function getOriginalTampermonkey() {
  if (original) return original

  const code = readFileSync('./legacy/TubeBili.user.js', 'utf-8')

  const instrumented = code
    .replace(
      'window.addEventListener("beforeunload", cleanup);\n  main();',
      '// [TEST] main() suppressed'
    )
    .replace(
      '})();',
      `
  globalThis.__TB_ORIG = {
    Common, sys, main, cleanup,
    isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage,
    youtubeSelectors, bilibiliSelectors,
    youtube_removal_items, bilibili_removal_items,
    handleYoutubePage, handleBilibiliPage,
    initYoutubeListeners, initBilibiliListener,
    window,
  };
})();`
    )

  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'https://www.youtube.com/watch?v=test',
  })

  const _testHref = { current: 'https://www.youtube.com/watch?v=test' }

  const windowProxy = new Proxy(dom.window, {
    get(target, prop, receiver) {
      if (prop === 'location') {
        return { href: _testHref.current }
      }
      return Reflect.get(target, prop, receiver)
    },
  })

  const sandbox = {
    globalThis: {},
    // GM API mocks
    GM_getValue: (key, def) => def,
    GM_setValue: () => {},
    GM_addStyle: () => {},
    GM_registerMenuCommand: () => {},
    // Browser mocks
    document: dom.window.document,
    window: windowProxy,
    location: dom.window.location,
    navigator: { language: 'zh-CN' },
    // Node.js / jsdom provided
    console, setTimeout, clearTimeout, setInterval, clearInterval,
    MutationObserver: dom.window.MutationObserver,
    localStorage: dom.window.localStorage,
    // Safety
    unsafeWindow: dom.window,
    GM_info: { script: { version: '2.0.2' } },
  }

  const ctx = createContext(sandbox)
  runInContext(instrumented, ctx)

  original = ctx.globalThis.__TB_ORIG
  original._testHref = _testHref
  return original
}