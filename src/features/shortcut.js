import { setPlaybackRate } from './rate.js';
import { getShortcutSpeeds } from '../settings/store.js';
import { getVideoElement } from '../core/element-getter.js';

let shortcutHandler = null;

export function handleKeydown(event) {
  const target = event.target;
  if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
    return;
  }
  const video = getVideoElement();
  if (!video) {
    return;
  }
  const currentRate = video.playbackRate;
  const shortcutSpeeds = getShortcutSpeeds();
  let currentIndex = shortcutSpeeds.findIndex((speed) => parseFloat(speed) === currentRate);
  if (currentIndex === -1) {
    const closest = shortcutSpeeds.reduce((prev, curr) => {
      return Math.abs(parseFloat(curr) - currentRate) < Math.abs(parseFloat(prev) - currentRate) ? curr : prev;
    });
    currentIndex = shortcutSpeeds.indexOf(closest);
  }
  let newIndex = currentIndex;
  if (event.code === "Comma") {
    if (currentIndex > 0) {
      newIndex = currentIndex - 1;
    }
  } else if (event.code === "Period") {
    if (currentIndex < shortcutSpeeds.length - 1) {
      newIndex = currentIndex + 1;
    }
  } else {
    return;
  }
  setPlaybackRate(shortcutSpeeds[newIndex]);
}

export function initShortcuts() {
  if (shortcutHandler) return;
  shortcutHandler = handleKeydown;
  document.addEventListener("keydown", shortcutHandler);
}
