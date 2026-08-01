import { gm } from './core/gm-api.js';
import { injectStyles } from './ui/styles.js';
import { t, detectLanguage } from './core/i18n.js';
import { initSettings } from './settings/store.js';
import { togglePanel } from './ui/settings-panel.js';
import { initShortcuts } from './features/shortcut.js';
import { youtubeAdapter } from './platforms/youtube.js';
import { bilibiliAdapter } from './platforms/bilibili.js';

const adapters = [youtubeAdapter, bilibiliAdapter];

const sys = {
  initialized: false,
  isMainRunning: false,
  currentLang: 'en'
};

function logSection(msg) {
  console.log(`========== ${msg} ==========`);
}

function getAdapter(url) {
  return adapters.find((adapter) => adapter.matches(url)) || null;
}

function main() {
  if (sys.isMainRunning) return;
  sys.isMainRunning = true;
  logSection("main 开始执行");
  const url = window.location.href;

  if (!sys.initialized) {
    sys.currentLang = detectLanguage();
    initSettings(url);

    logSection("执行一次性初始化");
    injectStyles();
    gm.registerMenuCommand(t("Menu_Settings", sys.currentLang), togglePanel);
    initShortcuts();

    const adapter = getAdapter(url);
    if (adapter) {
      adapter.init(() => main());
    }

    const isFirstRun = gm.getValue("firstRunComplete", false);
    if (!isFirstRun) {
      gm.setValue("firstRunComplete", true);
      setTimeout(() => togglePanel(), 500);
    }

    sys.initialized = true;
    logSection("一次性初始化完成");
  }

  const adapter = getAdapter(url);
  if (adapter && adapter.isWatchPage(url)) {
    adapter.onPage();
  }

  logSection("main 执行完毕");
  sys.isMainRunning = false;
}

const cleanup = () => {
  adapters.forEach((adapter) => adapter.cleanup());
};

window.addEventListener("beforeunload", cleanup);
main();
