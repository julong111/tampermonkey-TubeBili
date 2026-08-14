import { getVideoElement } from '../core/element-getter.js'
import { showSpeedIndicator } from '../ui/speed-indicator.js'
import { updateSpeedButtonHighlight } from '../ui/speed-buttons.js'

let userRateChangeListener: ((rate: number) => void) | null = null

export function setUserRateChangeListener(listener: ((rate: number) => void) | null): void {
  userRateChangeListener = listener
}

export function setPlaybackRate(rate: string | number): void {
  const video = getVideoElement()
  if (!video) return
  const parsedRate = parseFloat(String(rate))
  video.playbackRate = parsedRate
  updateSpeedButtonHighlight(String(rate))
  showSpeedIndicator(rate)
  userRateChangeListener?.(parsedRate)
}
