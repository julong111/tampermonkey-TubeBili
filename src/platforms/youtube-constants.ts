import type { RemovalItem } from '../features/removal/config.js';

export const INTERVAL_YOUTUBE_LIVE_STREAM_CHECK = 1000;
export const INTERVAL_YOUTUBE_AD_CHECK = 500;
export const INTERVAL_YOUTUBE_SKIP_AD_CHECK = 500;

export const youtubeSelectors = {
  videoPanel: "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls",
  liveStreamIcon: "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate.ytp-live > button",
  autoplayToggleBtn: "#movie_player .ytp-autonav-toggle",
  subtitlesBtn: "#movie_player .ytp-subtitles-button",
  settingsBtn: "#movie_player .ytp-settings-button",
  theaterMode: "#movie_player .ytp-size-button",
  fullScreenBtn: "#movie_player .ytp-fullscreen-button",
  finishListener: "yt-navigate-finish",
  liveStreamClass: "ytp-live-badge-is-livehead",
  adSelector: ".ytp-ad-player-overlay, .ytp-ad-player-overlay-layout",
  skipAdButton: ".ytp-skip-ad-button"
};

export const youtubeRemovalItems: Record<string, RemovalItem> = {
  Youtube_Remove_Autoplay: {
    selector: youtubeSelectors.autoplayToggleBtn,
    mode: "remove"
  },
  Youtube_Remove_Subtitles: {
    selector: youtubeSelectors.subtitlesBtn,
    mode: "remove"
  },
  Youtube_Remove_Settings: {
    selector: youtubeSelectors.settingsBtn,
    mode: "remove"
  },
  Youtube_Remove_TheaterMode: {
    selector: youtubeSelectors.theaterMode,
    mode: "remove"
  },
  Youtube_Remove_FullScreen: {
    selector: youtubeSelectors.fullScreenBtn,
    mode: "remove"
  }
};
