import { getVideoElement } from '../core/element-getter.js'
import { showSpeedIndicator } from '../ui/speed-indicator.js'
import { updateSpeedButtonHighlight } from '../ui/speed-buttons.js'

export function setPlaybackRate(rate: string | number): void {
  const video = getVideoElement()
  if (!video) return
  video.playbackRate = parseFloat(String(rate))
  updateSpeedButtonHighlight(String(rate))
  showSpeedIndicator(rate)
}
