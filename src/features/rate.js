import { getVideoElement } from '../core/element-getter.js';
import { showSpeedIndicator } from '../ui/speed-indicator.js';
import { updateSpeedButtonHighlight } from '../ui/speed-buttons.js';

export function setPlaybackRate(rate) {
  const video = getVideoElement();
  if (!video) return;
  video.playbackRate = parseFloat(rate);
  updateSpeedButtonHighlight(rate);
  showSpeedIndicator(rate);
}
