import { gm } from '../core/gm-api.js';
import { waitElement, getVideoElement } from '../core/element-getter.js';
import { isYoutubePage, isYoutubeWatchPage } from './router.js';
import { definePlatformAdapter } from './adapter.js';
import type { PlatformAdapter } from './adapter.js';
import { getSettingPanelItems, getDefaultSpeed } from '../settings/store.js';
import { setPlaybackRate } from '../features/rate.js';
import { createSpeedButtons, updateSpeedButtonHighlight } from '../ui/speed-buttons.js';
import { initYouTubeElementRemover } from '../features/removal/remove-once.js';
import {
  INTERVAL_YOUTUBE_LIVE_STREAM_CHECK,
  INTERVAL_YOUTUBE_AD_CHECK,
  INTERVAL_YOUTUBE_SKIP_AD_CHECK,
  youtubeSelectors,
  youtubeRemovalItems
} from './youtube-constants.js';

const youtubeState: {
  liveStreamStatus: boolean;
  fallbackRate: number | null;
  adDetected: boolean;
  adCheckInterval: ReturnType<typeof setInterval> | null;
  skipAdCheckInterval: ReturnType<typeof setInterval> | null;
  liveStreamCheck: ReturnType<typeof setInterval> | null;
  isPageProcessing: boolean;
} = {
  liveStreamStatus: false,
  fallbackRate: null,
  adDetected: false,
  adCheckInterval: null,
  skipAdCheckInterval: null,
  liveStreamCheck: null,
  isPageProcessing: false
};

export const youtubeHandlers = {
  // theaterMode() {
  //   waitElement(youtubeSelectors.theaterMode).then((item) => {
  //     item.click();
  //   });
  // },
  initListeners() {
    const settingPanelItems = getSettingPanelItems();
    const skipAdEnableKey = settingPanelItems.Youtube_Action_SkipAd?.enableKey as string | undefined;
    const stopSkipAdCheck = () => {
      if (youtubeState.skipAdCheckInterval !== null) {
        clearInterval(youtubeState.skipAdCheckInterval);
        youtubeState.skipAdCheckInterval = null;
      }
    };
    if (youtubeState.fallbackRate === null) {
      const item = settingPanelItems.Youtube_Action_Rate;
      youtubeState.fallbackRate = parseFloat(
        String(gm.getValue(item?.valueKey ?? getDefaultSpeed(), getDefaultSpeed()))
      );
    }
    window.addEventListener(youtubeSelectors.finishListener, () => handleYoutubePage());
    youtubeState.liveStreamCheck = setInterval(() => {
      const element = document.querySelector(youtubeSelectors.liveStreamIcon);
      const isLive = element && element.classList.contains(youtubeSelectors.liveStreamClass);
      const isWatchPage = isYoutubeWatchPage(window.location.href);
      if (isWatchPage) {
        if (isLive && !youtubeState.liveStreamStatus) {
          setPlaybackRate(1);
          youtubeState.liveStreamStatus = true;
        } else if (!isLive && youtubeState.liveStreamStatus) {
          setPlaybackRate(youtubeState.fallbackRate as number);
          youtubeState.liveStreamStatus = false;
        }
      }
    }, INTERVAL_YOUTUBE_LIVE_STREAM_CHECK);
    youtubeState.adCheckInterval = setInterval(() => {
      const adOverlay = document.querySelector(youtubeSelectors.adSelector);
      const video = getVideoElement();
      if (adOverlay && !youtubeState.adDetected && video) {
        setPlaybackRate(1);
        youtubeState.adDetected = true;
        if (
          skipAdEnableKey &&
          gm.getValue(skipAdEnableKey, false) &&
          youtubeState.skipAdCheckInterval === null
        ) {
          youtubeState.skipAdCheckInterval = setInterval(() => {
            if (!gm.getValue(skipAdEnableKey, false)) {
              stopSkipAdCheck();
              return;
            }
            const skipBtn = document.querySelector(youtubeSelectors.skipAdButton);
            if (skipBtn && typeof (skipBtn as HTMLElement).click === 'function') {
              (skipBtn as HTMLElement).click();
            }
          }, INTERVAL_YOUTUBE_SKIP_AD_CHECK);
        }
      } else if (!adOverlay && youtubeState.adDetected && video) {
        setPlaybackRate(youtubeState.fallbackRate as number);
        youtubeState.adDetected = false;
        stopSkipAdCheck();
      }
    }, INTERVAL_YOUTUBE_AD_CHECK);
  }
};

export function cleanupYoutube() {
  if (youtubeState.liveStreamCheck !== null) {
    clearInterval(youtubeState.liveStreamCheck);
    youtubeState.liveStreamCheck = null;
  }
  if (youtubeState.adCheckInterval !== null) {
    clearInterval(youtubeState.adCheckInterval);
    youtubeState.adCheckInterval = null;
  }
  if (youtubeState.skipAdCheckInterval !== null) {
    clearInterval(youtubeState.skipAdCheckInterval);
    youtubeState.skipAdCheckInterval = null;
  }
  youtubeState.adDetected = false;
}

export async function handleYoutubePage(): Promise<void> {
  if (youtubeState.isPageProcessing) return;
  youtubeState.isPageProcessing = true;
  const settingPanelItems = getSettingPanelItems();

  try {
    let videoPanel = await waitElement(youtubeSelectors.videoPanel);
    createSpeedButtons(
      (moreSpeedsDiv) => {
        videoPanel.before(moreSpeedsDiv);
        const video = getVideoElement();
        if (video) {
          updateSpeedButtonHighlight(video.playbackRate.toString());
        }
      },
      setPlaybackRate
    );
  } catch (error) {
    console.error("Failed create speed button elements:", error);
  }

  const autoRateEnabled = gm.getValue(settingPanelItems.Youtube_Action_Rate?.enableKey as string, false);
  if (autoRateEnabled) {
    const adOverlay = document.querySelector(youtubeSelectors.adSelector);
    if (!adOverlay) {
      const rate = parseFloat(String(gm.getValue(settingPanelItems.Youtube_Action_Rate?.valueKey ?? getDefaultSpeed(), getDefaultSpeed())));
      setPlaybackRate(rate);
      youtubeState.liveStreamStatus = false;
    }
  }

  youtubeState.isPageProcessing = false;
}

export const youtubeAdapter: PlatformAdapter = definePlatformAdapter({
  id: 'youtube',
  matches: (url) => isYoutubePage(url),
  isWatchPage: (url) => isYoutubeWatchPage(url),
  init: () => youtubeHandlers.initListeners(),
  onPage: () => {
    handleYoutubePage();
    initYouTubeElementRemover(youtubeRemovalItems);
  },
  cleanup: cleanupYoutube,
});
