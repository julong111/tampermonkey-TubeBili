import { gm } from '../core/gm-api.js';
import { waitElement, getVideoElement } from '../core/element-getter.js';
import { isBilibiliVideoPage } from './router.js';
import { definePlatformAdapter } from './adapter.js';
import type { PlatformAdapter } from './adapter.js';
import { getSettingPanelItems, getDefaultSpeed } from '../settings/store.js';
import { setPlaybackRate } from '../features/rate.js';
import { createSpeedButtons, updateSpeedButtonHighlight } from '../ui/speed-buttons.js';
import { initBilibiliElementRemover } from '../features/removal/remove-loop.js';
import { initAutoCloseLoginWindowGuard } from '../features/auto-close-login-window.js';
import {
  BILIBILI_RATE_RETRY_DELAY,
  BILIBILI_WEB_FULLSCREEN_GESTURE_WINDOW,
  bilibiliSelectors,
  bilibiliRemovalItems
} from './bilibili-constants.js';

type DisplayMode = 'normal' | 'fullscreen' | 'web-fullscreen' | 'wide';

const bilibiliState: {
  removalInterval: ReturnType<typeof setInterval> | null;
  autoCloseLoginWindowInterval: ReturnType<typeof setInterval> | null;
  urlObserver: MutationObserver | null;
  lastUrl: string;
  displayMode: DisplayMode;
  desiredMode: DisplayMode;
  lastUserGesture: number;
  webFullscreenObserver: MutationObserver | null;
  wideObserver: MutationObserver | null;
  gestureListenersRegistered: boolean;
  removeGestureListeners: (() => void) | null;
} = {
  removalInterval: null,
  autoCloseLoginWindowInterval: null,
  urlObserver: null,
  lastUrl: '',
  displayMode: 'normal',
  desiredMode: 'normal',
  lastUserGesture: 0,
  webFullscreenObserver: null,
  wideObserver: null,
  gestureListenersRegistered: false,
  removeGestureListeners: null
};

function markUserGesture() {
  bilibiliState.lastUserGesture = Date.now();
}

function getWideMode(): boolean {
  const btn = document.querySelector(bilibiliSelectors.wideBtn);
  return btn?.classList.contains('bpx-state-entered') ?? false;
}

function getDisplayMode(): DisplayMode {
  if (document.fullscreenElement) return 'fullscreen';
  const container = document.querySelector(bilibiliSelectors.videoPanel);
  const screen = container ? container.getAttribute('data-screen') : null;
  if (screen === 'web') return 'web-fullscreen';
  if (screen === 'full') return 'fullscreen';
  if (getWideMode()) return 'wide';
  return 'normal';
}

function updateDisplayMode(): void {
  const mode = getDisplayMode();
  if (mode === bilibiliState.displayMode) return;
  bilibiliState.displayMode = mode;
  if (mode === 'normal') {
    if (Date.now() - bilibiliState.lastUserGesture < BILIBILI_WEB_FULLSCREEN_GESTURE_WINDOW) {
      bilibiliState.desiredMode = 'normal';
    }
    return;
  }
  bilibiliState.desiredMode = mode;
  bilibiliState.lastUserGesture = 0;
}

function markUserExitMode(): void {
  const mode = getDisplayMode();
  if (mode === 'web-fullscreen' || mode === 'fullscreen' || mode === 'wide') {
    bilibiliState.desiredMode = 'normal';
  }
}

function onFullscreenControlKeydown(e: KeyboardEvent): void {
  markUserGesture();
  if (e.key === 'Escape' || e.key === 'Esc' || e.key === 'f' || e.key === 'F') {
    markUserExitMode();
  }
}

function onFullscreenControlClick(e: MouseEvent): void {
  const mode = getDisplayMode();
  if (
    (mode === 'fullscreen' && (e.target as Element | null)?.closest?.(bilibiliSelectors.fullScreenBtn)) ||
    (mode === 'web-fullscreen' && (e.target as Element | null)?.closest?.(bilibiliSelectors.webFullBtn)) ||
    (mode === 'wide' && (e.target as Element | null)?.closest?.(bilibiliSelectors.wideBtn))
  ) {
    markUserExitMode();
  }
}

function ensureDisplayModeListeners(): void {
  if (bilibiliState.gestureListenersRegistered) return;
  window.addEventListener('pointerdown', markUserGesture, true);
  window.addEventListener('keydown', onFullscreenControlKeydown, true);
  document.addEventListener('click', onFullscreenControlClick, true);
  document.addEventListener('fullscreenchange', updateDisplayMode);
  bilibiliState.removeGestureListeners = () => {
    window.removeEventListener('pointerdown', markUserGesture, true);
    window.removeEventListener('keydown', onFullscreenControlKeydown, true);
    document.removeEventListener('click', onFullscreenControlClick, true);
    document.removeEventListener('fullscreenchange', updateDisplayMode);
  };
  bilibiliState.gestureListenersRegistered = true;
}

function removeDisplayModeListeners(): void {
  if (bilibiliState.gestureListenersRegistered) {
    bilibiliState.removeGestureListeners?.();
    bilibiliState.removeGestureListeners = null;
    bilibiliState.gestureListenersRegistered = false;
  }
}

function setupDisplayModeTracking(): void {
  if (bilibiliState.webFullscreenObserver) {
    bilibiliState.webFullscreenObserver.disconnect();
    bilibiliState.webFullscreenObserver = null;
  }
  bilibiliState.displayMode = getDisplayMode();
  bilibiliState.desiredMode = bilibiliState.displayMode;
  waitElement(bilibiliSelectors.videoPanel).then((container) => {
    if (bilibiliState.webFullscreenObserver) return;
    updateDisplayMode();
    const observer = new MutationObserver(updateDisplayMode);
    observer.observe(container, { attributes: true, attributeFilter: ['data-screen'] });
    bilibiliState.webFullscreenObserver = observer;
  }).catch(() => {});
}

function setupWideModeTracking(): void {
  if (bilibiliState.wideObserver) {
    bilibiliState.wideObserver.disconnect();
    bilibiliState.wideObserver = null;
  }
  waitElement(bilibiliSelectors.wideBtn).then((btn) => {
    if (bilibiliState.wideObserver) return;
    const observer = new MutationObserver(updateDisplayMode);
    observer.observe(btn, { attributes: true, attributeFilter: ['class'] });
    bilibiliState.wideObserver = observer;
  }).catch(() => {});
}

export const bilibiliHandlers = {
  webFullscreen() {
    waitElement(bilibiliSelectors.videoPanel).then(() => {
      if (getDisplayMode() === 'web-fullscreen') return;
      waitElement(bilibiliSelectors.webFullBtn).then((item) => {
        (item as HTMLElement).click();
      });
    });
  },
  wideMode() {
    waitElement(bilibiliSelectors.videoPanel).then(() => {
      if (getDisplayMode() === 'wide') return;
      waitElement(bilibiliSelectors.wideBtn).then((item) => {
        (item as HTMLElement).click();
      });
    });
  },
  enterFullscreen() {
    waitElement(bilibiliSelectors.videoPanel).then(() => {
      if (getDisplayMode() === 'fullscreen') return;
      waitElement(bilibiliSelectors.fullScreenBtn).then((item) => {
        (item as HTMLElement).click();
      });
    });
  },
  initUrlObserver(callback: () => void) {
    bilibiliState.lastUrl = location.href;
    bilibiliState.urlObserver = new MutationObserver(() => {
      const url = location.href;
      if (url !== bilibiliState.lastUrl) {
        bilibiliState.lastUrl = url;
        if (isBilibiliVideoPage(url)) {
          callback();
        }
      }
    });
    bilibiliState.urlObserver.observe(document, { subtree: true, childList: true });
  },
  startRemoval() {
    if (bilibiliState.removalInterval !== null) {
      clearInterval(bilibiliState.removalInterval);
      bilibiliState.removalInterval = null;
    }
    bilibiliState.removalInterval = initBilibiliElementRemover(bilibiliRemovalItems, bilibiliSelectors);
  },
  startAutoCloseLoginWindowGuard() {
    const settingPanelItems = getSettingPanelItems();
    if (bilibiliState.autoCloseLoginWindowInterval !== null) {
      clearInterval(bilibiliState.autoCloseLoginWindowInterval);
      bilibiliState.autoCloseLoginWindowInterval = null;
    }
    if (gm.getValue(settingPanelItems.Bilibili_Action_AutoCloseLoginWindow?.enableKey as string, false)) {
      bilibiliState.autoCloseLoginWindowInterval = initAutoCloseLoginWindowGuard(
        bilibiliSelectors.LoginWindowCloseBtn,
        () => {
          if (bilibiliState.desiredMode === 'web-fullscreen') {
            bilibiliHandlers.webFullscreen();
          } else if (bilibiliState.desiredMode === 'fullscreen') {
            bilibiliHandlers.enterFullscreen();
          } else if (bilibiliState.desiredMode === 'wide') {
            bilibiliHandlers.wideMode();
          }
        }
      );
    }
  }
};

export function cleanupBilibili(): void {
  if (bilibiliState.removalInterval !== null) {
    clearInterval(bilibiliState.removalInterval);
    bilibiliState.removalInterval = null;
  }
  if (bilibiliState.autoCloseLoginWindowInterval !== null) {
    clearInterval(bilibiliState.autoCloseLoginWindowInterval);
    bilibiliState.autoCloseLoginWindowInterval = null;
  }
  if (bilibiliState.urlObserver !== null) {
    bilibiliState.urlObserver.disconnect();
    bilibiliState.urlObserver = null;
  }
  if (bilibiliState.webFullscreenObserver !== null) {
    bilibiliState.webFullscreenObserver.disconnect();
    bilibiliState.webFullscreenObserver = null;
  }
  if (bilibiliState.wideObserver !== null) {
    bilibiliState.wideObserver.disconnect();
    bilibiliState.wideObserver = null;
  }
  removeDisplayModeListeners();
  bilibiliState.displayMode = 'normal';
  bilibiliState.desiredMode = 'normal';
}

export function handleBilibiliPage(): void {
  const settingPanelItems = getSettingPanelItems();

  waitElement(bilibiliSelectors.speedBtnPostionTarget).then((targetContainer) => {
    if (targetContainer) {
      createSpeedButtons((moreSpeedsDiv) => {
        if (targetContainer.firstChild) {
          targetContainer.insertBefore(moreSpeedsDiv, targetContainer.firstChild);
        } else {
          targetContainer.appendChild(moreSpeedsDiv);
        }
        const video = getVideoElement();
        if (video) {
          updateSpeedButtonHighlight(video.playbackRate.toString());
        }
      }, setPlaybackRate);
    }
  });

  const autoRateEnabled = gm.getValue(settingPanelItems.Bilibili_Action_Rate?.enableKey as string, false);
  if (autoRateEnabled) {
    const rate = parseFloat(String(gm.getValue(settingPanelItems.Bilibili_Action_Rate?.valueKey ?? getDefaultSpeed(), getDefaultSpeed())));
    let retryCount = 0;
    const setRateWithRetry = () => {
      const video = getVideoElement();
      if (video) {
        setPlaybackRate(rate);
      } else {
        retryCount++;
        setTimeout(setRateWithRetry, BILIBILI_RATE_RETRY_DELAY);
        if (retryCount % 10 === 0) {
          console.log(`[等待] 视频元素加载中... (已尝试${retryCount}次)`);
        }
      }
    };
    setRateWithRetry();
  }
}

export const bilibiliAdapter: PlatformAdapter = definePlatformAdapter({
  id: 'bilibili',
  matches: (url) => isBilibiliVideoPage(url),
  isWatchPage: (url) => isBilibiliVideoPage(url),
  init: (onPageChange) => bilibiliHandlers.initUrlObserver(onPageChange),
  onPage: () => {
    handleBilibiliPage();
    const settingPanelItems = getSettingPanelItems();
    const enabled = gm.getValue(settingPanelItems.Bilibili_DisplayMode_Enabled?.enableKey as string, false);
    const type = gm.getValue("Bilibili_DisplayMode_Type", "web-fullscreen");
    if (enabled) {
      if (type === 'web-fullscreen') {
        bilibiliHandlers.webFullscreen();
      } else if (type === 'wide') {
        bilibiliHandlers.wideMode();
      }
    }
    bilibiliHandlers.startRemoval();
    bilibiliHandlers.startAutoCloseLoginWindowGuard();
    ensureDisplayModeListeners();
    setupDisplayModeTracking();
    setupWideModeTracking();
  },
  cleanup: cleanupBilibili,
});
