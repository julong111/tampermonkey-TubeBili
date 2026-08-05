import { setPlaybackRate } from './rate.js'
import { getShortcutSpeeds } from '../settings/store.js'
import { getVideoElement } from '../core/element-getter.js'

let shortcutHandler: ((event: KeyboardEvent) => void) | null = null

export function handleKeydown(event: KeyboardEvent): void {
  const target = event.target as Element | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as HTMLElement).isContentEditable)) {
    return
  }
  const video = getVideoElement()
  if (!video) {
    return
  }
  const currentRate = video.playbackRate
  const shortcutSpeeds = getShortcutSpeeds()
  let currentIndex = shortcutSpeeds.findIndex((speed) => parseFloat(speed) === currentRate)
  if (currentIndex === -1) {
    const closest = shortcutSpeeds.reduce((prev, curr) => {
      return Math.abs(parseFloat(curr) - currentRate) < Math.abs(parseFloat(prev) - currentRate) ? curr : prev
    })
    currentIndex = shortcutSpeeds.indexOf(closest)
  }
  let newIndex = currentIndex
  if (event.code === 'Comma') {
    if (currentIndex > 0) {
      newIndex = currentIndex - 1
    }
  } else if (event.code === 'Period') {
    if (currentIndex < shortcutSpeeds.length - 1) {
      newIndex = currentIndex + 1
    }
  } else {
    return
  }
  setPlaybackRate(shortcutSpeeds[newIndex] ?? shortcutSpeeds[0] ?? '1.0')
}

export function initShortcuts(): void {
  if (shortcutHandler) return
  shortcutHandler = handleKeydown
  document.addEventListener('keydown', shortcutHandler)
}

export function resetShortcuts(): void {
  if (shortcutHandler) {
    document.removeEventListener('keydown', shortcutHandler)
  }
  shortcutHandler = null
}
