import { gm } from '../core/gm-api.js';
import { waitElement, getVideoElement } from '../core/element-getter.js';
import { isYoutubePage, isYoutubeWatchPage } from './router.js';
import { definePlatformAdapter } from './adapter.js';
import type { PlatformAdapter } from './adapter.js';
import { getSettingPanelItems, getDefaultSpeed } from '../settings/store.js';
import { setPlaybackRate, setUserRateChangeListener } from '../features/rate.js';
import { createSpeedButtons, updateSpeedButtonHighlight } from '../ui/speed-buttons.js';
import { showSpeedIndicator } from '../ui/speed-indicator.js';
import { initYouTubeElementRemover } from '../features/removal/remove-once.js';
import {
  INTERVAL_YOUTUBE_LIVE_STREAM_CHECK,
  INTERVAL_YOUTUBE_AD_CHECK,
  INTERVAL_YOUTUBE_SKIP_AD_CHECK,
  YOUTUBE_AD_PLAY_DURATION,
  youtubeSelectors,
  youtubeRemovalItems
} from './youtube-constants.js';

const youtubeState: {
  liveStreamStatus: boolean;
  fallbackRate: number | null;
  adDetected: boolean;
  adStartTime: number | null;
  adCheckInterval: ReturnType<typeof setInterval> | null;
  skipAdCheckInterval: ReturnType<typeof setInterval> | null;
  liveStreamCheck: ReturnType<typeof setInterval> | null;
  isPageProcessing: boolean;
} = {
  liveStreamStatus: false,
  fallbackRate: null,
  adDetected: false,
  adStartTime: null,
  adCheckInterval: null,
  skipAdCheckInterval: null,
  liveStreamCheck: null,
  isPageProcessing: false
};

function setRateInternal(rate: number): void {
  const video = getVideoElement();
  if (!video) return;
  video.playbackRate = rate;
  updateSpeedButtonHighlight(String(rate));
  showSpeedIndicator(rate);
}

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
    setUserRateChangeListener((rate) => {
      youtubeState.fallbackRate = rate;
    });
    window.addEventListener(youtubeSelectors.finishListener, () => handleYoutubePage());
    youtubeState.liveStreamCheck = setInterval(() => {
      const element = document.querySelector(youtubeSelectors.liveStreamIcon);
      const isLive = element && element.classList.contains(youtubeSelectors.liveStreamClass);
      const isWatchPage = isYoutubeWatchPage(window.location.href);
      if (isWatchPage) {
        if (isLive && !youtubeState.liveStreamStatus) {
          setRateInternal(1);
          youtubeState.liveStreamStatus = true;
        } else if (!isLive && youtubeState.liveStreamStatus) {
          setRateInternal(youtubeState.fallbackRate as number);
          youtubeState.liveStreamStatus = false;
        }
      }
    }, INTERVAL_YOUTUBE_LIVE_STREAM_CHECK);
    youtubeState.adCheckInterval = setInterval(() => {
      const adOverlay = document.querySelector(youtubeSelectors.adSelector);
      const video = getVideoElement();
      if (adOverlay && !youtubeState.adDetected && video) {
        setRateInternal(1);
        youtubeState.adDetected = true;
        youtubeState.adStartTime = Date.now();
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
            const skipAdOverlay = document.querySelector(youtubeSelectors.adSelector);
            if (skipAdOverlay) {
              const skipBtn = document.querySelector(youtubeSelectors.skipAdButton) as HTMLElement | null;
              if (skipBtn && skipBtn.offsetParent !== null && window.getComputedStyle(skipBtn).opacity === '1') {
                skipBtn.click();
              }
              const adVideo = getVideoElement();
              if (
                adVideo &&
                Number.isFinite(adVideo.duration) &&
                adVideo.duration > 0 &&
                youtubeState.adStartTime !== null &&
                Date.now() - youtubeState.adStartTime >= YOUTUBE_AD_PLAY_DURATION
              ) {
                adVideo.currentTime = adVideo.duration;
              }
            }
          }, INTERVAL_YOUTUBE_SKIP_AD_CHECK);
        }
      } else if (!adOverlay && youtubeState.adDetected && video) {
        setRateInternal(youtubeState.fallbackRate as number);
        youtubeState.adDetected = false;
        youtubeState.adStartTime = null;
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
  youtubeState.adStartTime = null;
  setUserRateChangeListener(null);
}

export async function handleYoutubePage(): Promise<void> {
  if (youtubeState.isPageProcessing) return;
  if (!isYoutubeWatchPage(window.location.href)) return;
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
