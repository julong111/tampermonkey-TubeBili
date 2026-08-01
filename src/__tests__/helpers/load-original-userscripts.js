import { readFileSync } from 'fs'
import { createContext, runInContext } from 'vm'
import { JSDOM } from 'jsdom'

let original = null

export function getOriginalUserscripts() {
  if (original) return original

  const code = readFileSync('./legacy/TubeBili.userscripts.js', 'utf-8')

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
    elmGetter, GM_Polyfill,
  };
})();`
    )

  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'https://www.youtube.com/watch?v=test',
  })

  const sandbox = {
    globalThis: {},
    document: dom.window.document,
    window: dom.window,
    location: dom.window.location,
    navigator: { language: 'zh-CN' },
    console, setTimeout, clearTimeout, setInterval, clearInterval,
    MutationObserver: dom.window.MutationObserver,
    localStorage: dom.window.localStorage,
    requestAnimationFrame: dom.window.requestAnimationFrame,
    unsafeWindow: dom.window,
    GM_info: { script: { version: '2.0.2-safari' } },
  }

  const ctx = createContext(sandbox)
  runInContext(instrumented, ctx)

  original = ctx.globalThis.__TB_ORIG
  return original
}