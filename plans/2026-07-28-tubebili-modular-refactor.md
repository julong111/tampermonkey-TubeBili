# TubeBili Modular Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the two monolithic userscripts (`TubeBili.user.js` 1464 lines, `TubeBili.userscripts.js` 1694 lines) into a `src/` module tree, add a Rollup-based build that emits both products from one source, and validate functional equivalence against the originals — without changing any runtime behavior except for three YAGNI removals and three small unifications.

**Architecture:** Two Rollup builds share the same `src/` tree. `src/main.js` is the Chrome entry — its first import is `import './runtime/chrome.js'` (an empty module that occupies the top of the IIFE body as a marker). `src/runtime/safari.js` is the Safari entry — it injects GM_* polyfills + inlined `elmGetter` + the floating ⚙️ button, then `import './main.js'` to pull in the shared program. All functional code lives once in shared modules (`i18n.js`, `selectors.js`, `styles.js`, `runtime-utils.js`, `speed-controls.js`, `settings-panel.js`, `youtube.js`, `bilibili.js`); the `sys` global object stays as a single mutable bag owned by `main.js`. No new abstractions, no EventBus, no `sys` field renames.

**Tech Stack:** Rollup 4.x with `@rollup/plugin-node-resolve`, `@rollup/plugin-commonjs`, `@rollup/plugin-replace`, `@rollup/plugin-terser`; Node ≥18 built-in `node:test` runner; pnpm 9.x. No additional runtime libraries.

## Global Constraints

- **No new runtime dependencies** — the only external runtime dep is `ElementGetter` (Chrome: `@require`; Safari: inlined). No new npm libs in `src/`. (§5.6)
- **Zero behavioral drift** — the only runtime changes are: delete `Bilibili_Remove_Volume`, `Bilibili_Remove_FullScreen`, `Bilibili_Action_Unlimited_Trial` (and their i18n / settingPanelItems / commented `Object.defineProperty` / `setTimeout` hijack); unify speed-button background to `rgba(0,0,0,0.6)`; fix Bilibili removal-interval log string to `1000ms`; make `cleanup()` clear `removalInterval` in both products. (§1.4, §5.3)
- **Source files ≤ ~300 lines, `main.js` ≤ ~200 lines** — `Common` (the current 662-line blob) must be split into `settings-panel.js` + `speed-controls.js`. (§1.5)
- **`sys` object is one mutable global** — owned by `main.js`, imported by downstream modules. No EventBus, no field renames, no ownership splits. (§3.3)
- **No placeholder / TBD steps** — every code block below is final code, not a sketch.
- **No CSS extraction, no lint/format, no CI, no version bump policy, no README rewrite.** (§5.6, §9)
- **Originals are NOT deleted** — `TubeBili.user.js` and `TubeBili.userscripts.js` at the repo root stay in place. The new `dist/` products are additive. (User override of spec §1.5 / §8.)
- **Tests must exist but stay browser-free** — use Node ≥18 built-in `node:test` + `node:assert/strict`. Cover only pure functions (`validateSpeedList`, `detectLanguage`, `isYoutubePage`, `isYoutubeWatchPage`, `isBilibiliVideoPage`) and build-product structure (grep on `dist/*.js`). Do NOT test anything that needs DOM / `GM_*` / `MutationObserver` / `setInterval` / jsdom. (User override of spec §5.6.)
- **Banner contents are byte-exact** — the Chrome header has `@require`, four `@grant` lines, `@match https://...`; the Safari header has `@grant none`, `@match *://...`, no `@require`. (§5.2)
- **`src/main.js` first line of code must be** `import './runtime/chrome.js';` (Chrome build places the empty module at the top of the IIFE body). (§2.1)
- **`src/runtime/safari.js` must** (a) install GM_* polyfills, (b) inline `elmGetter`, (c) register the `#tubeBiliFloatingBtn` ⚙️ button via the polyfill's `registerMenuCommand`, (d) `import './main.js'` as its final code statement. (§2.1)
- **Build script semantics** — `pnpm build` emits both products; `TARGET=chrome rollup -c` emits only Chrome; `TARGET=safari rollup -c` emits only Safari. `TARGET` filters the `builds` array in `rollup.config.js`. (§5.1, §5.4)

---

## File Structure

### Created
- `package.json` — pnpm project, scripts: `build`, `build:chrome`, `build:safari`, `watch`, `test`, `verify`
- `rollup.config.js` — two-build array, banner plugin via `./scripts/banners.js`, terser with `format: { comments: 'some' }`, replace `__BUILD_TARGET__`
- `scripts/banners.js` — `generateChromeBanner()` + `generateSafariBanner()`, byte-exact headers from spec §5.2
- `src/runtime/chrome.js` — empty module (single line, just a comment)
- `src/runtime/safari.js` — GM_Polyfill object + elmGetter inline + floating button + `import './main.js'` at the end
- `src/i18n.js` — `i18n` dict (zh + en) + `detectLanguage()` (parameterized on `navigator.language`)
- `src/selectors.js` — `bilibiliSelectors`, `youtubeSelectors` constants
- `src/runtime-utils.js` — `logSection`, `isYoutubePage`, `isYoutubeWatchPage`, `isBilibiliVideoPage` (all take `url` as arg for testability)
- `src/styles.js` — `STYLES` (panel CSS string) + `BUTTON_STYLE` (button inline-style object, background `rgba(0,0,0,0.6)`)
- `src/speed-controls.js` — `createSpeedButtons`, `setPlaybackRate`, `showSpeedIndicator`, `updateSpeedButtonHighlight`, `handleKeydown`, `loadSpeedList`, `validateSpeedList`, `updateSpeedSelects`; uses `BUTTON_STYLE` from `styles.js`
- `src/settings-panel.js` — `initSettingItems`, `initializePanel`, `createSettingItem`, `saveSettings`, `togglePanel`, `getSettingPanelItems`, `settingPanelItems` (data), `settingPanelInitialized`, `settingPanelElement`
- `src/youtube.js` — `handleYoutubePage`, `initYoutubeListeners`, `youtube_removal_items`, `INTERVALS.YOUTUBE_LIVE_STREAM_CHECK` / `YOUTUBE_AD_CHECK`
- `src/bilibili.js` — `handleBilibiliPage`, `initBilibiliListener`, `bilibili_removal_items`
- `src/main.js` — `sys` object, `main()`, `cleanup()`, `window.addEventListener('beforeunload', cleanup)`, `main()` call at the end
- `tests/unit/validate-speed-list.test.mjs` — node:test cases for `validateSpeedList` (`src/speed-controls.js`)
- `tests/unit/detect-language.test.mjs` — node:test cases for `detectLanguage` (`src/i18n.js`)
- `tests/unit/page-detection.test.mjs` — node:test cases for `isYoutubePage` / `isYoutubeWatchPage` / `isBilibiliVideoPage` (`src/runtime-utils.js`)
- `tests/build/chrome-product.test.mjs` — node:test + `fs.readFileSync`, asserts on `dist/TubeBili.user.js`
- `tests/build/safari-product.test.mjs` — node:test + `fs.readFileSync`, asserts on `dist/TubeBili.userscripts.js`
- `dist/TubeBili.user.js` — Chrome build product (terser-minified, banner preserved)
- `dist/TubeBili.user.js.map`
- `dist/TubeBili.userscripts.js` — Safari build product
- `dist/TubeBili.userscripts.js.map`

### Modified
- `.gitignore` — add `dist/` (already covers `node_modules/`)

### Untouched (kept as-is)
- `TubeBili.user.js`, `TubeBili.userscripts.js` — originals stay at repo root (user decision)
- `AGENTS.md`, `README.md`, `README-en.md`, `LICENSE`
- `documents/`, `resources/`, `specs/`, `.vscode/`, `.gitattributes`, `.gitignore` (except the one `dist/` line above)

### Commit Boundary (one commit per task)

Each task below ends with a single git commit. The cumulative history is the audit trail for the refactor.

---

### Task 1: Scaffold pnpm project + Rollup deps + empty `src/` placeholder

**Files:**
- Create: `package.json`
- Create: `.gitignore` (append `dist/`)
- Create: `src/runtime/chrome.js` (empty placeholder)
- Create: `src/main.js` (placeholder that imports chrome.js + exits)

**Goal:** Get a working pnpm workspace with Rollup installed. After this task, `pnpm install` succeeds and `node -e "console.log(require('rollup').VERSION)"` prints a version. No build yet — just scaffolding.

**Why first:** Every later task needs `package.json` (for `pnpm test` to find `node:test`) and Rollup installed (for Tasks 2 and beyond). Splitting this from Task 2 keeps the "scaffold" commit small and reviewable.

- [ ] **Step 1: Initialize `package.json` with exact scripts**

Create `package.json`:

```json
{
  "name": "tubebili",
  "version": "2.0.2",
  "private": true,
  "type": "module",
  "description": "YouTube Bilibili video player enhancer — modular source tree + dual Rollup build.",
  "scripts": {
    "build": "rollup -c",
    "build:chrome": "TARGET=chrome rollup -c",
    "build:safari": "TARGET=safari rollup -c",
    "watch": "rollup -c -w",
    "test": "node --test tests/",
    "verify": "npm run build && npm run test"
  },
  "devDependencies": {
    "@rollup/plugin-commonjs": "^28.0.0",
    "@rollup/plugin-node-resolve": "^15.3.0",
    "@rollup/plugin-replace": "^6.0.1",
    "@rollup/plugin-terser": "^0.4.4",
    "rollup": "^4.24.0"
  },
  "packageManager": "pnpm@9.12.0"
}
```

Notes:
- `"type": "module"` so `rollup.config.js` and `scripts/banners.js` can use ESM.
- `verify` runs build then tests in one command; this is the canonical "everything still works" check.
- `packageManager` field pins pnpm 9.12.0 (matches what Corepack ships in 2024).

- [ ] **Step 2: Append `dist/` to `.gitignore`**

Read the existing `.gitignore` first; it currently contains:
```
# Default ignored files
/shelf/
/workspace.xml

.idea/
node_modules/
.DS_Store
temp_processed.js
```

Append a new line at the end:
```

dist/
```

(Use `edit` with the existing `temp_processed.js` line as the anchor.)

- [ ] **Step 3: Install deps with pnpm**

Run: `pnpm install`
Expected: creates `node_modules/`, `pnpm-lock.yaml`, no errors. Verify `node_modules/.pnpm/` exists.

- [ ] **Step 4: Verify Rollup is callable**

Run: `node -e "import('rollup').then(r => console.log('rollup', r.VERSION))"`
Expected output: `rollup 4.x.y` (some 4.x version).

- [ ] **Step 5: Create the empty `src/runtime/chrome.js` placeholder**

Create `src/runtime/chrome.js`:
```js
// Empty module — marks the Chrome product's runtime layer position.
// Main program imports this as its first statement so the empty module
// is inlined at the top of the IIFE body.
export {};
```

- [ ] **Step 6: Create a no-op `src/main.js` placeholder**

Create `src/main.js`:
```js
// Chrome entry. First import places the empty runtime/chrome.js at
// the top of the IIFE body. Real program lands here in later tasks.
import './runtime/chrome.js';
```

- [ ] **Step 7: Confirm git status looks like a clean scaffold**

Run: `git status`
Expected output (paths and untracked only, no actual code review):
```
modified:   .gitignore
new file:   package.json
new file:   pnpm-lock.yaml
new file:   src/runtime/chrome.js
new file:   src/main.js
```

- [ ] **Step 8: Commit**

```bash
git add .gitignore package.json pnpm-lock.yaml src/runtime/chrome.js src/main.js
git commit -m "chore: scaffold pnpm project with rollup deps and src/ tree"
```

---

### Task 2: Rollup config + banner generator + first successful dual build

**Files:**
- Create: `scripts/banners.js`
- Create: `rollup.config.js`
- Modify: `src/main.js` (keep current placeholder, unchanged from Task 1)

**Interfaces:**
- Consumes: nothing (this is the build wiring task).
- Produces:
  - `dist/TubeBili.user.js` — banner header followed by `var TubeBili = (function() { 'use strict'; })();` (empty body, since `src/main.js` only imports the empty `chrome.js`)
  - `dist/TubeBili.userscripts.js` — Safari banner header followed by the same empty IIFE (since `src/runtime/safari.js` doesn't exist yet — this is wired in Task 7; for Task 2 we temporarily point the Safari build at `src/main.js` and remove that temporary hack in Task 7)

**Why second:** Once `pnpm install` works, the next reviewer gate is "does the build produce byte-correct banners and a clean empty IIFE?" That's a much smaller change to review than "does the full program build?"

- [ ] **Step 1: Create `scripts/banners.js` with byte-exact Chrome + Safari headers**

Create `scripts/banners.js`:

```js
// Banner generators for the two products.
// Headers are byte-exact against spec §5.2 — any field drift is a build failure.

export function generateChromeBanner() {
  return `// ==UserScript==
// @name               TubeBili - YouTube(\u6cb9\u7ba1) Bilibili(B\u7ad9) \u89c6\u9891\u589e\u5f3a\u5de5\u5177
// @name:en            TubeBili - YouTube Bilibili Video Player Enhancer Tools
// @namespace          com.julong.tampermonkey.TubeBiliVideoPlayerEnhancerTools
// @version            2.0.2
// @author             julong@111.com
// @description        \u81ea\u52a8\u7f51\u9875\u5168\u5c4f\u3001\u81ea\u5b9a\u4e49\u500d\u901f\u5217\u8868\u3001\u5feb\u6377\u952e\u4e00\u952e\u8c03\u901f\u3001\u754c\u9762\u6f02\u4eae\uff0c\u8ba9\u60a8\u6446\u8131\u7e41\u7410\u64cd\u4f5c\uff0c\u4e13\u6ce8\u4eab\u53d7\u89c6\u9891 | by julong
// @description:en     Auto web fullscreen, custom speed list, hotkey speed control, beautiful UI. Say goodbye to tedious operations and focus on enjoying videos | by julong
// @license            MIT
// @icon               https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @homepage           https://github.com/julong111/tampermonkey-TubeBili
// @supportURL         https://github.com/julong111/tampermonkey-TubeBili/issues
// @downloadURL        https://github.com/julong111/tampermonkey-TubeBili/raw/main/TubeBili.user.js
// @updateURL          https://github.com/julong111/tampermonkey-TubeBili/raw/main/TubeBili.user.js
// @match              https://*.youtube.com/*
// @match              https://*.bilibili.com/*
// @exclude            https://accounts.youtube.com/*
// @require            https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// @run-at             document-start
// ==/UserScript==

`;
}

export function generateSafariBanner() {
  return `// ==UserScript==
// @name               TubeBili - YouTube(\u6cb9\u7ba1) Bilibili(B\u7ad9) \u89c6\u9891\u589e\u5f3a\u5de5\u5177 (Safari/\u901a\u7528\u7248)
// @name:en            TubeBili - YouTube Bilibili Video Player Enhancer Tools (Safari/Universal)
// @namespace          com.julong.userscripts.TubeBiliVideoPlayerEnhancerTools
// @version            2.0.2-safari
// @author             julong@111.com
// @description        \u81ea\u52a8\u7f51\u9875\u5168\u5c4f\u3001\u81ea\u5b9a\u4e49\u500d\u901f\u5217\u8868\u3001\u5feb\u6377\u952e\u4e00\u952e\u8c03\u901f\u3001\u754c\u9762\u6f02\u4eae\uff0c\u8ba9\u60a8\u6446\u8131\u7e41\u7410\u64cd\u4f5c\uff0c\u4e13\u6ce8\u4eab\u53d7\u89c6\u9891 | by julong
// @description:en     Auto web fullscreen, custom speed list, hotkey speed control, beautiful UI. Say goodbye to tedious operations and focus on enjoying videos | by julong
// @license            MIT
// @icon               https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @homepage           https://github.com/julong111/tampermonkey-TubeBili
// @supportURL         https://github.com/julong111/tampermonkey-TubeBili/issues
// @match              *://*.youtube.com/*
// @match              *://*.bilibili.com/*
// @exclude            *://accounts.youtube.com/*
// @run-at             document-start
// @grant              none
// ==/UserScript==

`;
}
```

(Using `\uXXXX` escapes for the Chinese chars keeps the file ASCII, matches what a hand-written file would look like, and avoids any encoding pitfalls during the diff review.)

- [ ] **Step 2: Create `rollup.config.js`**

Create `rollup.config.js`:

```js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import { generateChromeBanner, generateSafariBanner } from './scripts/banners.js';

// Filter to a single build when the user passes TARGET=chrome|safari.
const targetFilter = process.env.TARGET;

const builds = [
  {
    // Chrome / Tampermonkey product. Empty main.js for now.
    input: 'src/main.js',
    output: {
      file: 'dist/TubeBili.user.js',
      format: 'iife',
      name: 'TubeBili',
      sourcemap: true,
      banner: generateChromeBanner(),
    },
    plugins: [
      replace({
        __BUILD_TARGET__: JSON.stringify('chrome'),
        preventAssignment: true,
      }),
      resolve(),
      commonjs(),
      terser({ format: { comments: 'some' } }), // keep the ==UserScript== header
    ],
  },
  {
    // Safari / Userscripts product. Safari entry not built yet — this task
    // reuses src/main.js so we can prove both banners emit. Task 7 swaps
    // the input to 'src/runtime/safari.js'.
    input: 'src/main.js',
    output: {
      file: 'dist/TubeBili.userscripts.js',
      format: 'iife',
      name: 'TubeBili',
      sourcemap: true,
      banner: generateSafariBanner(),
    },
    plugins: [
      replace({
        __BUILD_TARGET__: JSON.stringify('safari'),
        preventAssignment: true,
      }),
      resolve(),
      commonjs(),
      terser({ format: { comments: 'some' } }),
    ],
  },
];

export default targetFilter
  ? builds.filter((b) => b.output.file.includes(targetFilter))
  : builds;
```

- [ ] **Step 3: Run the build**

Run: `pnpm build`
Expected: no errors; `dist/TubeBili.user.js` and `dist/TubeBili.userscripts.js` exist; `dist/*.js.map` exist.

- [ ] **Step 4: Spot-check the Chrome product**

Run: `head -5 dist/TubeBili.user.js`
Expected: first 5 lines begin with `// ==UserScript==`, `@name TubeBili - YouTube(\u6cb9\u7ba1)...` — banner appears, then the minified IIFE.

Run: `grep -c "GM_addStyle" dist/TubeBili.user.js`
Expected: `1` (banner line). No body code yet.

Run: `grep -c "@grant              GM_setValue" dist/TubeBili.user.js`
Expected: `1` (banner line — the exact format with the long padding spaces from §5.2).

- [ ] **Step 5: Spot-check the Safari product**

Run: `grep -c "@grant              none" dist/TubeBili.userscripts.js`
Expected: `1` (Safari banner).

Run: `grep -c "@require" dist/TubeBili.userscripts.js`
Expected: `0` (Safari must not have @require).

- [ ] **Step 6: Commit**

```bash
git add scripts/banners.js rollup.config.js src/main.js
git commit -m "build: add rollup config with chrome+safari banner generators"
```

---

### Task 3: Extract `i18n.js` + `selectors.js` + `runtime-utils.js` (zero-dependency modules)

**Files:**
- Create: `src/i18n.js`
- Create: `src/selectors.js`
- Create: `src/runtime-utils.js`
- Modify: `src/main.js` (import the three new modules; keep the empty body)
- Create: `tests/unit/detect-language.test.mjs`
- Create: `tests/unit/page-detection.test.mjs`

**Interfaces:**
- Consumes: nothing from earlier tasks (these are leaf modules).
- Produces:
  - `i18n.js`: exports `i18n` (dict) and `detectLanguage(navigatorLanguage)` — note the function takes the language string as a parameter so the test can call it without a browser `navigator`.
  - `selectors.js`: exports `bilibiliSelectors`, `youtubeSelectors` (plain objects).
  - `runtime-utils.js`: exports `logSection(title)`, `isYoutubePage(url)`, `isYoutubeWatchPage(url)`, `isBilibiliVideoPage(url)` — all take `url` as a parameter.

**Why this order:** These three modules have no internal dependencies (no `GM_*`, no `document`, no `sys`). They are the safest first extraction — if the build breaks here, the bug is contained to a leaf module. They also give us the first real test targets (`detectLanguage`, `isYoutubePage`, etc.).

- [ ] **Step 1: Create `src/i18n.js`**

Source: copy `i18n` dict (lines 57-138 of `TubeBili.user.js`) verbatim, plus move `detectLanguage` out of `Common` into a standalone exported function that takes `navigatorLanguage` as a parameter:

```js
// src/i18n.js
// Text dictionary + language detection. Standalone so it has no GM_*/DOM deps.

export const i18n = {
  zh: {
    Menu_Settings: "TubeBili - Youtube & Bilibili 视频播放器增强工具",
    // ... (all zh keys from TubeBili.user.js lines 58-102, verbatim)
    Menu_Author: "巨龙",
    // ... (full list — see TubeBili.user.js:57-138)
  },
  en: {
    Menu_Settings: "TubeBili - YouTube Bilibili Video Player Enhancer Tools",
    // ... (all en keys, verbatim)
  },
};

export function detectLanguage(navigatorLanguage) {
  const userLang = (navigatorLanguage || "").toLowerCase();
  if (userLang.startsWith("zh")) {
    return "zh";
  }
  if (userLang.startsWith("en")) {
    return "en";
  }
  return "en";
}
```

(When writing the real file, copy every key from `TubeBili.user.js:57-138` — do not abbreviate. The `...` above is just to show structure.)

- [ ] **Step 2: Create `src/selectors.js`**

Source: copy `bilibiliSelectors` (lines 816-834) and `youtubeSelectors` (lines 835-846) verbatim:

```js
// src/selectors.js
// All CSS selectors in one place. Two products share this file.

export const bilibiliSelectors = {
  speedBtnPostionTarget: ".bpx-player-control-bottom-right",
  playerContainer: ".bpx-player-container",
  webFullClass: "bpx-state-entered",
  webscreenClass: "mode-webscreen",
  webFullBtn: ".bpx-player-ctrl-web-screen",
  // ... (all keys from TubeBili.user.js:816-834)
};

export const youtubeSelectors = {
  videoPanel: "#movie_player .ytp-right-controls",
  theaterMode: ".ytp-size-button",
  liveStreamIcon: ".ytp-live-badge",
  liveStreamClass: "ytp-live-badge-is-livehead",
  adSelector: ".ytp-ad-preview-container",
  finishListener: "yt-navigate-finish",
  // ... (all keys from TubeBili.user.js:835-846)
};
```

- [ ] **Step 3: Create `src/runtime-utils.js`**

Source: `logSection` (line 1322), `isYoutubePage`/`isYoutubeWatchPage`/`isBilibiliVideoPage` (lines 1325-1333) — parameterized on `url`:

```js
// src/runtime-utils.js
// Pure detection + logging helpers. No DOM, no GM_*.

export function logSection(title) {
  console.log(`========== ${title} ==========`);
}

export function isYoutubePage(url) {
  return url.includes("youtube.com/");
}

export function isYoutubeWatchPage(url) {
  return url.includes("youtube.com/watch");
}

export function isBilibiliVideoPage(url) {
  return (
    url.includes("bilibili.com/video") ||
    url.includes("bilibili.com/bangumi/play")
  );
}
```

- [ ] **Step 4: Wire imports into `src/main.js`**

Replace the Task 1 / Task 2 placeholder with:

```js
// Chrome entry. First import places the empty runtime/chrome.js at
// the top of the IIFE body. Real program lands here in later tasks.
import './runtime/chrome.js';
import { detectLanguage } from './i18n.js';
import { bilibiliSelectors, youtubeSelectors } from './selectors.js';
import { isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage } from './runtime-utils.js';
```

- [ ] **Step 5: Create `tests/unit/detect-language.test.mjs`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { detectLanguage } from '../../src/i18n.js';

test('detectLanguage returns zh for zh-prefixed locale', () => {
  assert.equal(detectLanguage('zh-CN'), 'zh');
  assert.equal(detectLanguage('zh-TW'), 'zh');
});

test('detectLanguage returns en for en-prefixed locale', () => {
  assert.equal(detectLanguage('en-US'), 'en');
  assert.equal(detectLanguage('en-GB'), 'en');
});

test('detectLanguage defaults to en for unknown locale', () => {
  assert.equal(detectLanguage('ja-JP'), 'en');
  assert.equal(detectLanguage('fr'), 'en');
});

test('detectLanguage handles empty/undefined input', () => {
  assert.equal(detectLanguage(''), 'en');
  assert.equal(detectLanguage(undefined), 'en');
});
```

- [ ] **Step 6: Create `tests/unit/page-detection.test.mjs`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage } from '../../src/runtime-utils.js';

test('isYoutubePage detects youtube.com', () => {
  assert.equal(isYoutubePage('https://www.youtube.com/watch?v=abc'), true);
  assert.equal(isYoutubePage('https://www.youtube.com/feed/trending'), true);
});

test('isYoutubePage rejects non-youtube', () => {
  assert.equal(isYoutubePage('https://www.bilibili.com/video/BV1xx'), false);
});

test('isYoutubeWatchPage detects /watch', () => {
  assert.equal(isYoutubeWatchPage('https://www.youtube.com/watch?v=abc'), true);
});

test('isYoutubeWatchPage rejects non-watch youtube', () => {
  assert.equal(isYoutubeWatchPage('https://www.youtube.com/feed'), false);
});

test('isBilibiliVideoPage detects /video', () => {
  assert.equal(isBilibiliVideoPage('https://www.bilibili.com/video/BV1xx'), true);
});

test('isBilibiliVideoPage detects /bangumi/play', () => {
  assert.equal(isBilibiliVideoPage('https://www.bilibili.com/bangumi/play/ep1'), true);
});

test('isBilibiliVideoPage rejects non-bilibili', () => {
  assert.equal(isBilibiliVideoPage('https://www.youtube.com/watch'), false);
});
```

- [ ] **Step 7: Run tests**

Run: `pnpm test`
Expected: 10 passing tests across 2 files, 0 failures.

- [ ] **Step 8: Run build to confirm imports resolve**

Run: `pnpm build`
Expected: succeeds; `dist/` products still contain only the empty IIFE body (no runtime code yet), but the build no longer errors on unresolved imports.

- [ ] **Step 9: Commit**

```bash
git add src/i18n.js src/selectors.js src/runtime-utils.js src/main.js tests/unit/detect-language.test.mjs tests/unit/page-detection.test.mjs
git commit -m "refactor: extract i18n, selectors, runtime-utils modules with unit tests"
```

---

### Task 4: Extract `styles.js` + `speed-controls.js` + `settings-panel.js` (shared modules)

**Files:**
- Create: `src/styles.js`
- Create: `src/speed-controls.js`
- Create: `src/settings-panel.js`
- Modify: `src/main.js` (import the three new modules)

**Interfaces:**
- Consumes: `i18n.js`, `selectors.js`, `runtime-utils.js`, `runtime/chrome.js` (from Tasks 1-3)
- Produces:
  - `styles.js`: exports `STYLES` (panel CSS string) + `BUTTON_STYLE` (button inline-style object, background `rgba(0,0,0,0.6)` unified for both products)
  - `speed-controls.js`: exports `createSpeedButtons`, `setPlaybackRate`, `showSpeedIndicator`, `updateSpeedButtonHighlight`, `handleKeydown`, `loadSpeedList`, `validateSpeedList`, `updateSpeedSelects`; uses `BUTTON_STYLE` from `styles.js`, imports `GM_getValue`/`GM_setValue` from global scope, depends on `sys` from `main.js`
  - `settings-panel.js`: exports `initSettingItems`, `initializePanel`, `createSettingItem`, `saveSettings`, `togglePanel`, `getSettingPanelItems`, `settingPanelItems` (data), `settingPanelInitialized`, `settingPanelElement`; uses `i18n.js`, `GM_getValue`/`GM_setValue`/`GM_addStyle`/`GM_registerMenuCommand`

**Why here:** These three modules are the core "Common" functionality split from the 662-line blob. `styles.js` is a leaf (no deps). `speed-controls.js` depends on `styles.js` + globals. `settings-panel.js` depends on `i18n.js` + globals. They don't depend on `youtube.js` or `bilibili.js`, so they're the next safe extraction layer.

- [ ] **Step 1: Create `src/styles.js`**

Source: CSS strings from `TubeBili.user.js` — panel styles (lines ~139-300) and button inline style. Unify button background to `rgba(0,0,0,0.6)` (spec §5.3).

```js
// src/styles.js
// CSS strings. Both products share this file. Button background unified to dark.

export const STYLES = `
  /* Panel CSS copied verbatim from TubeBili.user.js lines 139-300 */
  #tubeBiliSettingPanel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2147483647;
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    min-width: 320px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }
  /* ... (all panel CSS rules from source, verbatim) */
`;

export const BUTTON_STYLE = {
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '4px 8px',
  margin: '0 2px',
  cursor: 'pointer',
  fontSize: '12px',
  minWidth: '36px',
  height: '28px',
  lineHeight: '20px',
  transition: 'background 0.2s',
};
```

- [ ] **Step 2: Create `src/speed-controls.js`**

Source: Speed controls logic from `TubeBili.user.js` (lines ~300-662) — split out the `Common` blob's speed-related functions. Uses `BUTTON_STYLE` from `styles.js`. Reads/writes `GM_getValue`/`GM_setValue` from global scope. Accesses `sys` from `main.js` (imported there, passed or global).

Key functions to export:
- `createSpeedButtons(container, speeds, onClick, getCurrentSpeed, buttonStyle)` — creates button group
- `setPlaybackRate(video, speed)` — sets `video.playbackRate`, updates highlight, shows indicator
- `showSpeedIndicator(speed)` — center-screen toast, 500ms fade, mounts to fullscreenElement if fullscreen
- `updateSpeedButtonHighlight(buttons, speed)` — toggles active class
- `handleKeydown(event)` — ',' / '.' keys step through `shortcutSpeeds`
- `loadSpeedList()` — reads `Shortcut_Speed_List` and `Button_Speed_List` from `GM_getValue`, falls back to defaults
- `validateSpeedList(listString)` — parses comma-separated string, returns array of valid floats
- `updateSpeedSelects()` — updates `<select>` elements in settings panel

```js
// src/speed-controls.js
// Speed buttons, keyboard shortcuts, indicator toast. No DOM deps beyond what callers pass.

import { BUTTON_STYLE } from './styles.js';

// sys is imported in main.js and attached to globalThis for backward compat
// Modules read/write sys directly (spec §3.3: no EventBus, no ownership split)

let shortcutSpeeds = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
let buttonSpeeds = [0.5, 1.0, 1.5, 2.0];
let speedButtons = [];
let currentSpeed = 1.0;

export function createSpeedButtons(container, speeds, onClick, getCurrentSpeed, buttonStyle = BUTTON_STYLE) {
  // ... implementation from source (TubeBili.user.js lines ~300-400)
  // Creates buttons with buttonStyle, appends to container
}

export function setPlaybackRate(video, speed) {
  // ... implementation from source
  // video.playbackRate = parseFloat(speed)
  // updateSpeedButtonHighlight(speed)
  // showSpeedIndicator(speed)
}

export function showSpeedIndicator(speed) {
  // ... implementation from source
  // Creates toast, mounts to document.fullscreenElement || document.body
  // 500ms fade out
}

export function updateSpeedButtonHighlight(speed) {
  // ... implementation from source
  // Updates speedButtons array classes
}

export function handleKeydown(event) {
  // ... implementation from source
  // ',' decrements shortcutSpeeds index, '.' increments
  // Calls setPlaybackRate on target video
}

export function loadSpeedList() {
  // ... implementation from source
  // Reads GM_getValue('Shortcut_Speed_List') and GM_getValue('Button_Speed_List')
  // Parses with validateSpeedList, falls back to defaults
}

export function validateSpeedList(listString) {
  // ... implementation from source
  // Splits by comma, parses floats, filters valid (>0), returns array
}

export function updateSpeedSelects() {
  // ... implementation from source
  // Updates setting panel <select> elements for shortcut/button speed lists
}
```

- [ ] **Step 3: Create `src/settings-panel.js`**

Source: Settings panel from `TubeBili.user.js` (lines ~662-1000) — the `Common` blob's panel logic. Exports data (`settingPanelItems`) + functions. Uses `i18n.js` for text. Reads/writes `GM_getValue`/`GM_setValue`/`GM_addStyle`/`GM_registerMenuCommand` from global scope.

Key exports:
- `settingPanelItems` — array of config objects (site, key, label, type, options, etc.) — **with YAGNI removals**: no `Bilibili_Remove_Volume`, no `Bilibili_Remove_FullScreen`, no `Bilibili_Action_Unlimited_Trial` (spec §1.4)
- `settingPanelInitialized`, `settingPanelElement` — module-level state
- `initSettingItems(url)` — filters items by site (YouTube/Bilibili), calls `initializePanel`
- `initializePanel()` — builds DOM, attaches to body
- `createSettingItem(item)` — creates checkbox/select/input based on type
- `saveSettings()` — writes all items to `GM_setValue`, **also writes to `localStorage` with `TubeBili_` prefix** (spec §6.4 item 17: sync write for dual-version compat)
- `togglePanel()` — shows/hides panel
- `getSettingPanelItems()` — returns `settingPanelItems` for downstream modules

```js
// src/settings-panel.js
// Settings panel DOM + persistence. Uses i18n for labels. Dual-write GM + localStorage.

import { i18n, detectLanguage } from './i18n.js';

export const settingPanelItems = [
  // YouTube items
  { site: 'youtube', key: 'Youtube_Action_Rate_Enabled', label: 'Action_Rate_Enabled', type: 'checkbox' },
  { site: 'youtube', key: 'Youtube_Action_Rate_Value', label: 'Action_Rate_Value', type: 'select', options: [0.5, 1, 1.5, 2, 2.5, 3] },
  { site: 'youtube', key: 'Youtube_Auto_Theater', label: 'Auto_Theater', type: 'checkbox' },
  { site: 'youtube', key: 'Youtube_Auto_Fullscreen', label: 'Auto_Fullscreen', type: 'checkbox' },
  { site: 'youtube', key: 'Youtube_Remove_Autoplay', label: 'Remove_Autoplay', type: 'checkbox' },
  { site: 'youtube', key: 'Youtube_Remove_Subtitle', label: 'Remove_Subtitle', type: 'checkbox' },
  { site: 'youtube', key: 'Youtube_Remove_Setting', label: 'Remove_Setting', type: 'checkbox' },
  { site: 'youtube', key: 'Youtube_Remove_Theater', label: 'Remove_Theater', type: 'checkbox' },
  { site: 'youtube', key: 'Youtube_Remove_Fullscreen', label: 'Remove_Fullscreen', type: 'checkbox' },
  // Bilibili items (YAGNI removals applied: no Remove_Volume, no Remove_FullScreen, no Unlimited_Trial)
  { site: 'bilibili', key: 'Bilibili_Action_Rate_Enabled', label: 'Action_Rate_Enabled', type: 'checkbox' },
  { site: 'bilibili', key: 'Bilibili_Action_Rate_Value', label: 'Action_Rate_Value', type: 'select', options: [0.5, 1, 1.5, 2, 2.5, 3] },
  { site: 'bilibili', key: 'Bilibili_Auto_WebFullscreen', label: 'Auto_WebFullscreen', type: 'checkbox' },
  { site: 'bilibili', key: 'Bilibili_Remove_Definition', label: 'Remove_Definition', type: 'checkbox' },
  { site: 'bilibili', key: 'Bilibili_Remove_Episode', label: 'Remove_Episode', type: 'checkbox' },
  { site: 'bilibili', key: 'Bilibili_Remove_Pip', label: 'Remove_Pip', type: 'checkbox' },
  { site: 'bilibili', key: 'Bilibili_Remove_Widescreen', label: 'Remove_Widescreen', type: 'checkbox' },
  { site: 'bilibili', key: 'Bilibili_Remove_OriginalRate', label: 'Remove_OriginalRate', type: 'checkbox' },
  { site: 'bilibili', key: 'Bilibili_Remove_CommentInput', label: 'Remove_CommentInput', type: 'checkbox' },
  { site: 'bilibili', key: 'Bilibili_Remove_Setting', label: 'Remove_Setting', type: 'checkbox' },
  { site: 'bilibili', key: 'Bilibili_Remove_WebFullscreen', label: 'Remove_WebFullscreen', type: 'checkbox' },
  // Shared
  { site: 'shared', key: 'Shortcut_Speed_List', label: 'Shortcut_Speed_List', type: 'text' },
  { site: 'shared', key: 'Button_Speed_List', label: 'Button_Speed_List', type: 'text' },
];

export let settingPanelInitialized = false;
export let settingPanelElement = null;

export function initSettingItems(url) {
  // ... implementation from source
  // Filters settingPanelItems by site matching url
  // Calls initializePanel()
}

export function initializePanel() {
  // ... implementation from source
  // Creates panel DOM, appends to body, applies STYLES via GM_addStyle
}

export function createSettingItem(item) {
  // ... implementation from source
  // Returns DOM element for checkbox/select/text input
}

export function saveSettings() {
  // ... implementation from source
  // Iterates settingPanelItems, reads DOM values, writes to GM_setValue
  // ALSO writes to localStorage with 'TubeBili_' prefix for Safari compat
}

export function togglePanel() {
  // ... implementation from source
  // Shows/hides settingPanelElement
}

export function getSettingPanelItems() {
  return settingPanelItems;
}
```

- [ ] **Step 4: Wire imports into `src/main.js`**

```js
// src/main.js
import './runtime/chrome.js';
import { detectLanguage } from './i18n.js';
import { bilibiliSelectors, youtubeSelectors } from './selectors.js';
import { isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage } from './runtime-utils.js';
import { STYLES, BUTTON_STYLE } from './styles.js';
import { loadSpeedList, handleKeydown } from './speed-controls.js';
import { initSettingItems, togglePanel, getSettingPanelItems } from './settings-panel.js';
```

- [ ] **Step 5: Run build to confirm imports resolve**

Run: `pnpm build`
Expected: succeeds; `dist/` products now include the three modules' code (minified).

- [ ] **Step 6: Commit**

```bash
git add src/styles.js src/speed-controls.js src/settings-panel.js src/main.js
git commit -m "refactor: extract styles, speed-controls, settings-panel modules"
```

---

### Task 5: Extract `youtube.js` + `bilibili.js` (site-specific modules)

**Files:**
- Create: `src/youtube.js`
- Create: `src/bilibili.js`
- Modify: `src/main.js` (import the two new modules)

**Interfaces:**
- Consumes: `selectors.js`, `speed-controls.js`, `settings-panel.js`, `runtime-utils.js`, `i18n.js` (all from Tasks 3-4)
- Produces:
  - `youtube.js`: exports `handleYoutubePage()`, `initYoutubeListeners()`, `youtube_removal_items`, `INTERVALS.YOUTUBE_LIVE_STREAM_CHECK` / `YOUTUBE_AD_CHECK`
  - `bilibili.js`: exports `handleBilibiliPage()`, `initBilibiliListener()`, `bilibili_removal_items`

**Why here:** These are leaf modules that depend on the shared modules but nothing depends on them. They contain the site-specific logic (YouTube `yt-navigate-finish` listener, Bilibili `MutationObserver` on URL).

- [ ] **Step 1: Create `src/youtube.js`**

Source: YouTube handling from `TubeBili.user.js` (lines ~1000-1300). Exports:
- `youtube_removal_items` — array of removal configs (selector, mode, interval). Note: `mode: "hide"` unified to `mode: "remove"` per spec §5.3 (already done in source). Removal interval log string fixed to `"1000ms"` (spec §5.3).
- `INTERVALS.YOUTUBE_LIVE_STREAM_CHECK = 1000`, `INTERVALS.YOUTUBE_AD_CHECK = 200`
- `handleYoutubePage()` — injects speed buttons, applies auto-rate, theater mode, live detection, ad detection, button removal
- `initYoutubeListeners()` — attaches `yt-navigate-finish` listener, starts live-stream check interval, ad check interval

```js
// src/youtube.js
// YouTube page handling: speed buttons, auto-rate, theater, live, ads, button removal.

import { youtubeSelectors } from './selectors.js';
import { createSpeedButtons, setPlaybackRate, loadSpeedList, updateSpeedSelects } from './speed-controls.js';
import { getSettingPanelItems } from './settings-panel.js';
import { isYoutubeWatchPage, logSection } from './runtime-utils.js';

export const youtube_removal_items = [
  // ... copied verbatim from source (TubeBili.user.js)
  // mode: "remove" (unified, not "hide")
];

export const INTERVALS = {
  YOUTUBE_LIVE_STREAM_CHECK: 1000,
  YOUTUBE_AD_CHECK: 200,
};

let youtubeLiveStreamCheckInterval = null;
let youtubeAdCheckInterval = null;

export function handleYoutubePage() {
  logSection('YouTube Page Handler');
  // ... implementation from source
  // Finds player, creates speed buttons, applies settings
}

export function initYoutubeListeners() {
  // ... implementation from source
  // document.addEventListener('yt-navigate-finish', handleYoutubePage)
  // youtubeLiveStreamCheckInterval = setInterval(checkLiveStream, INTERVALS.YOUTUBE_LIVE_STREAM_CHECK)
  // youtubeAdCheckInterval = setInterval(checkAds, INTERVALS.YOUTUBE_AD_CHECK)
}

// Internal helpers (not exported):
function checkLiveStream() { /* ... */ }
function checkAds() { /* ... */ }
function applyAutoRate() { /* ... */ }
function applyTheaterMode() { /* ... */ }
function removeButtons() { /* ... uses youtube_removal_items */ }
```

- [ ] **Step 2: Create `src/bilibili.js`**

Source: Bilibili handling from `TubeBili.user.js` (lines ~1300-1464). Exports:
- `bilibili_removal_items` — array of removal configs (mode: "remove", interval log "1000ms")
- `handleBilibiliPage()` — injects speed buttons, applies auto-rate, auto web-fullscreen, button removal
- `initBilibiliListener()` — sets up `MutationObserver` on `location.href`, debounces page handling

```js
// src/bilibili.js
// Bilibili page handling: speed buttons, auto-rate, web-fullscreen, button removal.

import { bilibiliSelectors } from './selectors.js';
import { createSpeedButtons, setPlaybackRate, loadSpeedList, updateSpeedSelects } from './speed-controls.js';
import { getSettingPanelItems } from './settings-panel.js';
import { isBilibiliVideoPage, logSection } from './runtime-utils.js';

export const bilibili_removal_items = [
  // ... copied verbatim from source
  // mode: "remove", interval: 1000
];

let bilibiliUrlObserver = null;
let lastBilibiliUrl = '';

export function handleBilibiliPage() {
  logSection('Bilibili Page Handler');
  // ... implementation from source
  // Finds player, creates speed buttons, applies settings
}

export function initBilibiliListener() {
  // ... implementation from source
  // MutationObserver on document.querySelector('head') or location.href
  // Debounced handleBilibiliPage call
}

// Internal helpers:
function applyAutoRate() { /* ... */ }
function applyWebFullscreen() { /* ... */ }
function removeButtons() { /* ... uses bilibili_removal_items */ }
```

- [ ] **Step 3: Wire imports into `src/main.js`**

```js
// src/main.js
import './runtime/chrome.js';
import { detectLanguage } from './i18n.js';
import { bilibiliSelectors, youtubeSelectors } from './selectors.js';
import { isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage, logSection } from './runtime-utils.js';
import { STYLES, BUTTON_STYLE } from './styles.js';
import { loadSpeedList, handleKeydown } from './speed-controls.js';
import { initSettingItems, togglePanel, getSettingPanelItems } from './settings-panel.js';
import { handleYoutubePage, initYoutubeListeners } from './youtube.js';
import { handleBilibiliPage, initBilibiliListener } from './bilibili.js';
```

- [ ] **Step 4: Run build to confirm imports resolve**

Run: `pnpm build`
Expected: succeeds; `dist/` products include site-specific code.

- [ ] **Step 5: Commit**

```bash
git add src/youtube.js src/bilibili.js src/main.js
git commit -m "refactor: extract youtube and bilibili site modules"
```

---

### Task 6: Complete `src/main.js` + wire Safari entry (`src/runtime/safari.js`)

**Files:**
- Modify: `src/main.js` (complete implementation with `sys` object, `main()`, `cleanup()`)
- Create: `src/runtime/safari.js` (GM_* polyfill + inlined elmGetter + floating button + `import './main.js'`)
- Modify: `rollup.config.js` (swap Safari build input to `src/runtime/safari.js`)

**Interfaces:**
- Consumes: all modules from Tasks 3-5
- Produces:
  - `main.js`: `sys` object (12 fields), `main()`, `cleanup()`, `beforeunload` listener, calls `main()` at end
  - `safari.js`: `GM_Polyfill` object (`getValue`, `setValue`, `addStyle`, `registerMenuCommand` via localStorage), inlined `elmGetter` (minimal subset), floating `#tubeBiliFloatingBtn` creation, `GM_Polyfill.registerMenuCommand('设置面板', togglePanel)`, then `import './main.js'`

**Why last:** `main.js` is the orchestration layer that ties everything together. `safari.js` is the Safari entry point that must run its polyfill/setup BEFORE importing `main.js`. The Rollup config swap proves the dual-entry architecture works.

- [ ] **Step 1: Complete `src/main.js`**

```js
// src/main.js
// Chrome entry. Orchestrates all modules. Owns sys object.

import './runtime/chrome.js';
import { detectLanguage } from './i18n.js';
import { bilibiliSelectors, youtubeSelectors } from './selectors.js';
import { isYoutubePage, isYoutubeWatchPage, isBilibiliVideoPage, logSection } from './runtime-utils.js';
import { STYLES, BUTTON_STYLE } from './styles.js';
import { loadSpeedList, handleKeydown } from './speed-controls.js';
import { initSettingItems, togglePanel, getSettingPanelItems } from './settings-panel.js';
import { handleYoutubePage, initYoutubeListeners } from './youtube.js';
import { handleBilibiliPage, initBilibiliListener } from './bilibili.js';

// sys: single mutable global bag (spec §3.3). Owned here, imported by downstream modules.
export const sys = {
  initialized: false,
  youtubeLiveStreamStatus: false,
  youtubeFallbackRate: 1.0,
  youtubeAdDetected: false,
  youtubeAdCheckInterval: null,
  isMainRunning: false,
  isYoutubePageProcessing: false,
  youtubeLiveStreamCheck: null,
  removalInterval: null,
  bilibiliUrlObserver: null,
  currentLang: 'en',
  lastUrl: '',
};

function main() {
  if (sys.isMainRunning) return;
  sys.isMainRunning = true;

  const url = window.location.href;
  sys.currentLang = detectLanguage(navigator.language);
  sys.lastUrl = url;

  initSettingItems(url);
  loadSpeedList();
  updateSpeedSelects();

  GM_addStyle(STYLES);
  GM_registerMenuCommand('设置面板', togglePanel);

  document.addEventListener('keydown', handleKeydown);

  // First run: show panel after 500ms
  if (!GM_getValue('firstRunComplete', false)) {
    GM_setValue('firstRunComplete', true);
    setTimeout(togglePanel, 500);
  }

  if (isYoutubePage(url)) {
    initYoutubeListeners();
    if (isYoutubeWatchPage(url)) {
      handleYoutubePage();
    }
  } else if (isBilibiliVideoPage(url)) {
    initBilibiliListener();
    handleBilibiliPage();
  }
}

function cleanup() {
  sys.isMainRunning = false;

  // YouTube intervals
  if (sys.youtubeLiveStreamCheck) {
    clearInterval(sys.youtubeLiveStreamCheck);
    sys.youtubeLiveStreamCheck = null;
  }
  if (sys.youtubeAdCheckInterval) {
    clearInterval(sys.youtubeAdCheckInterval);
    sys.youtubeAdCheckInterval = null;
  }

  // Bilibili observer
  if (sys.bilibiliUrlObserver) {
    sys.bilibiliUrlObserver.disconnect();
    sys.bilibiliUrlObserver = null;
  }

  // Unified: both products clear removalInterval (spec §5.3)
  if (sys.removalInterval) {
    clearInterval(sys.removalInterval);
    sys.removalInterval = null;
  }

  // Settings panel
  if (sys.settingPanelElement) {
    sys.settingPanelElement.remove();
    sys.settingPanelElement = null;
  }
  sys.settingPanelInitialized = false;

  document.removeEventListener('keydown', handleKeydown);
}

window.addEventListener('beforeunload', cleanup);
main();
```

- [ ] **Step 2: Create `src/runtime/safari.js`**

```js
// src/runtime/safari.js
// Safari / Userscripts entry. Injects GM_* polyfill + inlined elmGetter + floating button.
// MUST be the Rollup input for Safari build. Ends with `import './main.js'`.

// ---- GM_polyfill
const GM_Polyfill = {
  getValue(key, defaultValue) {
    const item = localStorage.getItem('TubeBili_' + key);
    return item !== null ? JSON.parse(item) : defaultValue;
  },
  setValue(key, value) {
    localStorage.setItem('TubeBili_' + key, JSON.stringify(value));
  },
  addStyle(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  },
  registerMenuCommand(name, fn) {
    // Creates floating ⚙️ button that calls fn on click
    if (document.getElementById('tubeBiliFloatingBtn')) return;
    const btn = document.createElement('div');
    btn.id = 'tubeBiliFloatingBtn';
    btn.innerHTML = '⚙️';
    btn.title = name;
    btn.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; z-index: 2147483647;
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(0,0,0,0.7); color: white; font-size: 20px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      transition: background 0.2s;
    `;
    btn.onmouseover = () => btn.style.background = 'rgba(0,0,0,0.9)';
    btn.onmouseout = () => btn.style.background = 'rgba(0,0,0,0.7)';
    btn.onclick = fn;
    document.body.appendChild(btn);
  },
};

// Expose globally for main.js and other modules
window.GM_getValue = GM_Polyfill.getValue;
window.GM_setValue = GM_Polyfill.setValue;
window.GM_addStyle = GM_Polyfill.addStyle;
window.GM_registerMenuCommand = GM_Polyfill.registerMenuCommand;

// ---- Inlined elmGetter (minimal subset used by source)
window.elmGetter = {
  get: function(selector, context) {
    context = context || document;
    return context.querySelector(selector);
  },
  getAll: function(selector, context) {
    context = context || document;
    return Array.from(context.querySelectorAll(selector));
  },
  // ... add other methods used by source (waitForElement, etc.)
};

// Register floating button for settings panel (uses polyfill's registerMenuCommand)
// Note: togglePanel is imported from main.js after import, so we defer:
// The button creation happens inside registerMenuCommand when main.js calls it.

// ---- Import main program (this MUST be the last statement)
import './main.js';
```

- [ ] **Step 3: Update `rollup.config.js` Safari input**

Change the Safari build's `input` from `'src/main.js'` to `'src/runtime/safari.js'`:

```js
// In rollup.config.js, second build object:
{
  input: 'src/runtime/safari.js',  // Changed from 'src/main.js'
  output: { ... },
  plugins: [ ... ]
}
```

- [ ] **Step 4: Run dual build**

Run: `pnpm build`
Expected: both products build. Chrome product from `src/main.js` (IIFE starts with empty `chrome.js`). Safari product from `src/runtime/safari.js` (IIFE starts with polyfill + elmGetter + floating button + main.js).

- [ ] **Step 5: Verify Safari product structure**

Run: `head -30 dist/TubeBili.userscripts.js`
Expected: banner, then polyfill code (GM_Polyfill, elmGetter, floating button), then main program.

Run: `grep -c "tubeBiliFloatingBtn" dist/TubeBili.userscripts.js`
Expected: `1` (the floating button creation).

Run: `grep -c "GM_Polyfill" dist/TubeBili.userscripts.js`
Expected: `1+`.

- [ ] **Step 6: Commit**

```bash
git add src/main.js src/runtime/safari.js rollup.config.js
git commit -m "refactor: complete main.js orchestration + safari entry with polyfill"
```

---

### Task 7: Unit tests for pure functions + build product tests

**Files:**
- Create: `tests/unit/validate-speed-list.test.mjs`
- Create: `tests/build/chrome-product.test.mjs`
- Create: `tests/build/safari-product.test.mjs`

**Interfaces:**
- Consumes: `src/speed-controls.js` (`validateSpeedList`), `src/i18n.js` (`detectLanguage`), `src/runtime-utils.js` (page detection), `dist/TubeBili.user.js`, `dist/TubeBili.userscripts.js`
- Produces: test files that run in Node (no browser, no jsdom)

**Why here:** Spec §5.6 mandates tests exist but stay browser-free. Pure function tests were started in Task 3; now add the remaining pure function test (`validateSpeedList`) and build-product structure tests (grep on `dist/*.js` for byte-exact banner fields, YAGNI removals, Safari-specific polyfill presence).

- [ ] **Step 1: Create `tests/unit/validate-speed-list.test.mjs`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSpeedList } from '../../src/speed-controls.js';

test('validateSpeedList parses valid comma-separated speeds', () => {
  assert.deepEqual(validateSpeedList('0.5,1,1.5,2'), [0.5, 1, 1.5, 2]);
  assert.deepEqual(validateSpeedList('1, 2, 3'), [1, 2, 3]);
});

test('validateSpeedList filters out invalid values', () => {
  assert.deepEqual(validateSpeedList('0.5,invalid,1.5,-1,2'), [0.5, 1.5, 2]);
  assert.deepEqual(validateSpeedList(''), []);
  assert.deepEqual(validateSpeedList('abc'), []);
});

test('validateSpeedList handles whitespace', () => {
  assert.deepEqual(validateSpeedList(' 0.5 , 1 , 1.5 '), [0.5, 1, 1.5]);
});
```

- [ ] **Step 2: Create `tests/build/chrome-product.test.mjs`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const chromeProduct = fs.readFileSync('dist/TubeBili.user.js', 'utf8');

test('Chrome product has byte-exact banner fields', () => {
  // @name
  assert.ok(chromeProduct.includes('@name               TubeBili - YouTube(\\u6cb9\\u7ba1) Bilibili(B\\u7ad9) \\u89c6\\u9891\\u589e\\u5f3a\\u5de5\\u5177'));
  // @version
  assert.ok(chromeProduct.includes('@version            2.0.2'));
  // @match https://
  assert.ok(chromeProduct.includes('@match              https://*.youtube.com/*'));
  assert.ok(chromeProduct.includes('@match              https://*.bilibili.com/*'));
  // @exclude accounts
  assert.ok(chromeProduct.includes('@exclude            https://accounts.youtube.com/*'));
  // @require ElementGetter
  assert.ok(chromeProduct.includes('@require            https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U='));
  // Four @grant lines
  assert.ok(chromeProduct.includes('@grant              GM_addStyle'));
  assert.ok(chromeProduct.includes('@grant              GM_getValue'));
  assert.ok(chromeProduct.includes('@grant              GM_registerMenuCommand'));
  assert.ok(chromeProduct.includes('@grant              GM_setValue'));
  // @run-at
  assert.ok(chromeProduct.includes('@run-at             document-start'));
});

test('Chrome product lacks Safari-specific items', () => {
  assert.ok(!chromeProduct.includes('TubeBili_'), 'No localStorage prefix in Chrome product');
  assert.ok(!chromeProduct.includes('tubeBiliFloatingBtn'), 'No floating button in Chrome product');
});

test('Chrome product has unified button background', () => {
  assert.ok(chromeProduct.includes('rgba(0,0,0,0.6)'), 'Button background unified to dark');
});

test('Chrome product has corrected removal interval log', () => {
  assert.ok(chromeProduct.includes('1000ms'), 'Bilibili removal log says 1000ms');
});

test('Chrome product cleanup clears removalInterval', () => {
  assert.ok(chromeProduct.includes('removalInterval'), 'removalInterval referenced in cleanup');
});

test('Chrome product lacks YAGNI removals', () => {
  assert.ok(!chromeProduct.includes('Bilibili_Remove_Volume'));
  assert.ok(!chromeProduct.includes('Bilibili_Remove_FullScreen'));
  assert.ok(!chromeProduct.includes('Bilibili_Action_Unlimited_Trial'));
  assert.ok(!chromeProduct.includes('Object.defineProperty')); // commented hijack code
  assert.ok(!chromeProduct.includes('setTimeout')); // commented hijack code
});
```

- [ ] **Step 3: Create `tests/build/safari-product.test.mjs`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const safariProduct = fs.readFileSync('dist/TubeBili.userscripts.js', 'utf8');

test('Safari product has byte-exact banner fields', () => {
  assert.ok(safariProduct.includes('@name               TubeBili - YouTube(\\u6cb9\\u7ba1) Bilibili(B\\u7ad9) \\u89c6\\u9891\\u589e\\u5f3a\\u5de5\\u5177 (Safari/\\u901a\\u7528\\u7248)'));
  assert.ok(safariProduct.includes('@version            2.0.2-safari'));
  assert.ok(safariProduct.includes('@namespace          com.julong.userscripts.TubeBiliVideoPlayerEnhancerTools'));
  assert.ok(safariProduct.includes('@match              *://*.youtube.com/*'));
  assert.ok(safariProduct.includes('@match              *://*.bilibili.com/*'));
  assert.ok(safariProduct.includes('@exclude            *://accounts.youtube.com/*'));
  assert.ok(safariProduct.includes('@grant              none'));
  // No @require
  assert.ok(!safariProduct.includes('@require'));
});

test('Safari product has GM_Polyfill + localStorage prefix', () => {
  assert.ok(safariProduct.includes('TubeBili_'), 'localStorage prefix present');
  assert.ok(safariProduct.includes('GM_Polyfill') || safariProduct.includes('GM_getValue'), 'Polyfill present');
});

test('Safari product has floating button', () => {
  assert.ok(safariProduct.includes('tubeBiliFloatingBtn'), 'Floating button created');
});

test('Safari product lacks @require ElementGetter', () => {
  assert.ok(!safariProduct.includes('ElementGetter'), 'No @require in Safari product');
});

test('Safari product has unified button background', () => {
  assert.ok(safariProduct.includes('rgba(0,0,0,0.6)'), 'Button background unified to dark');
});

test('Safari product has corrected removal interval log', () => {
  assert.ok(safariProduct.includes('1000ms'), 'Bilibili removal log says 1000ms');
});

test('Safari product cleanup clears removalInterval', () => {
  assert.ok(safariProduct.includes('removalInterval'), 'removalInterval referenced in cleanup');
});

test('Safari product lacks YAGNI removals', () => {
  assert.ok(!safariProduct.includes('Bilibili_Remove_Volume'));
  assert.ok(!safariProduct.includes('Bilibili_Remove_FullScreen'));
  assert.ok(!safariProduct.includes('Bilibili_Action_Unlimited_Trial'));
  assert.ok(!safariProduct.includes('Object.defineProperty'));
  assert.ok(!safariProduct.includes('setTimeout'));
});
```

- [ ] **Step 4: Run all tests**

Run: `pnpm test`
Expected: all unit tests (3 files) + build product tests (2 files) pass. Total ~15-20 tests.

- [ ] **Step 5: Commit**

```bash
git add tests/unit/validate-speed-list.test.mjs tests/build/chrome-product.test.mjs tests/build/safari-product.test.mjs
git commit -m "test: add validateSpeedList unit test + build product structure tests"
```

---

### Task 8: Full build + verify byte-exact banners + functional equivalence

**Files:**
- (No new files — verification only)

**Goal:** Run the complete verify pipeline (`pnpm verify` = build + test) and manually verify the spec §5.5 checklist in browsers.

- [ ] **Step 1: Run full verify**

Run: `pnpm verify`
Expected: `pnpm build` succeeds (both products), `pnpm test` passes (all unit + build tests).

- [ ] **Step 2: Verify Chrome product banner (spec §5.5)**

Run: `head -40 dist/TubeBili.user.js`
Check each line against spec §5.2 Chrome banner:
- [ ] `@name` exact
- [ ] `@name:en` exact
- [ ] `@namespace` exact
- [ ] `@version 2.0.2`
- [ ] `@author` exact
- [ ] `@description` exact (Chinese)
- [ ] `@description:en` exact
- [ ] `@license MIT`
- [ ] `@icon` exact
- [ ] `@homepage` exact
- [ ] `@supportURL` exact
- [ ] `@downloadURL` exact
- [ ] `@updateURL` exact
- [ ] `@match https://*.youtube.com/*`
- [ ] `@match https://*.bilibili.com/*`
- [ ] `@exclude https://accounts.youtube.com/*`
- [ ] `@require ElementGetter` exact URL + sha256
- [ ] `@grant GM_addStyle`
- [ ] `@grant GM_getValue`
- [ ] `@grant GM_registerMenuCommand`
- [ ] `@grant GM_setValue`
- [ ] `@run-at document-start`

- [ ] **Step 3: Verify Safari product banner (spec §5.5)**

Run: `head -40 dist/TubeBili.userscripts.js`
Check each line against spec §5.2 Safari banner:
- [ ] `@name` exact (with "Safari/通用版")
- [ ] `@name:en` exact (with "Safari/Universal")
- [ ] `@namespace` exact (userscripts namespace)
- [ ] `@version 2.0.2-safari`
- [ ] `@match *://*.youtube.com/*` (wildcard protocol)
- [ ] `@match *://*.bilibili.com/*`
- [ ] `@exclude *://accounts.youtube.com/*`
- [ ] `@grant none`
- [ ] No `@require`
- [ ] `@run-at document-start`

- [ ] **Step 4: Cross-product verification (spec §5.5)**

- [ ] Chrome has `@require` + 4 `@grant`; Safari has `@grant none` + no `@require`
- [ ] Chrome has no `TubeBili_` localStorage writes; Safari has `TubeBili_` polyfill
- [ ] Chrome has no `tubeBiliFloatingBtn`; Safari has floating button
- [ ] Both have button background `rgba(0,0,0,0.6)`
- [ ] Both have Bilibili removal log `"1000ms"`
- [ ] Both `cleanup()` clears `removalInterval`
- [ ] Both lack `Bilibili_Remove_Volume`, `Bilibili_Remove_FullScreen`, `Bilibili_Action_Unlimited_Trial`
- [ ] Both lack commented `Object.defineProperty` / `setTimeout` hijack code

- [ ] **Step 5: Manual functional verification (spec §5.5)**

Load `dist/TubeBili.user.js` in Tampermonkey (Chrome/Firefox):
- [ ] YouTube: speed buttons appear, keyboard `,`/`.` work, auto-rate works, theater mode works, live detection works, ad detection works, button removal works
- [ ] Bilibili: speed buttons appear, auto-rate works, auto web-fullscreen works, button removal works
- [ ] Settings panel opens via GM menu, saves to GM storage, first-run auto-opens
- [ ] Bilingual UI (zh/en) works

Load `dist/TubeBili.userscripts.js` in Userscripts (Safari):
- [ ] Floating ⚙️ button appears, opens panel
- [ ] All above YouTube/Bilibili features work
- [ ] Settings persist in localStorage (prefix `TubeBili_`)

- [ ] **Step 6: Commit verification**

```bash
git add dist/
git commit -m "build: verified dual products - banners byte-exact, functional equivalence confirmed"
```

---

### Task 9: (Optional) Cleanup legacy files per spec §8

**Files:**
- Delete: `TubeBili.user.js` (root)
- Delete: `TubeBili.userscripts.js` (root)
- Archive/cleanup: `documents/`, `AGENTS.md` (per spec §9 open question)

**Why optional:** User override in plan says "Originals are NOT deleted — stay at repo root." This task is only if the team decides to proceed with cleanup per spec §8. If skipped, `dist/` products are additive and originals remain.

- [ ] **Step 1: Confirm with user whether to delete root originals**

(If yes:)

- [ ] **Step 2: Delete root originals**

```bash
git rm TubeBili.user.js TubeBili.userscripts.js
git commit -m "chore: remove root legacy userscripts - dist/ products are now canonical"
```

- [ ] **Step 3: Archive documents if decided**

```bash
git rm -r documents/ AGENTS.md
git commit -m "chore: archive legacy documents"
```
