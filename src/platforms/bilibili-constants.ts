import type { RemovalItem } from '../features/removal/config.js';

export const BILIBILI_RATE_RETRY_DELAY = 500;

export const BILIBILI_WEB_FULLSCREEN_GESTURE_WINDOW = 1000;

export const bilibiliSelectors = {
  playerContainer: "#bilibili-player",
  webscreenClass: "mode-webscreen",
  speedBtn: ".bpx-player-control-bottom-center",
  videoPanel: ".bpx-player-container",
  commentsPanel: ".bpx-player-sending-bar",
  webFullBtn: ".bpx-player-ctrl-web",
  fullScreenBtn: ".bpx-player-ctrl-full",
  pipBtn: ".bpx-player-ctrl-pip",
  speedsListBtn: ".bpx-player-ctrl-playbackrate",
  trialConfirmBtn: ".bpx-player-toast-confirm-login",
  LoginWindowCloseBtn: ".bili-mini-close-icon",
  speedBtnPostionTarget: ".bpx-player-control-bottom-right"
};

export const bilibiliRemovalItems: Record<string, RemovalItem> = {
  Bilibili_Remove_Pip: {
    selector: bilibiliSelectors.pipBtn,
    mode: "remove"
  },
  Bilibili_Remove_Speed: {
    selector: bilibiliSelectors.speedsListBtn,
    mode: "remove"
  },
  Bilibili_Remove_Comments: {
    selector: bilibiliSelectors.commentsPanel,
    mode: "remove"
  }
};
