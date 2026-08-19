import { getVideoElement } from '../core/element-getter.js'
import { setPlaybackRate } from './rate.js'
import { turboPlaybackEnabledKey, turboPlaybackKeyKey, turboPlaybackSpeedKey, DEFAULT_TURBO_PLAYBACK_KEY, DEFAULT_TURBO_PLAYBACK_SPEED } from '../settings/speed-list-constants.js'
import { gm } from '../core/gm-api.js'
import { showPersistentSpeedIndicator, hideSpeedIndicator } from '../ui/speed-indicator.js'

const TURBO_THRESHOLD_MS = 500

interface TurboState {
  isActive: boolean
  keyPressedTime: number
  triggerTimer: ReturnType<typeof setTimeout> | null
  previousRate: number
  boundKeyDown: (event: KeyboardEvent) => void
  boundKeyUp: (event: KeyboardEvent) => void
}

const turboState: TurboState = {
  isActive: false,
  keyPressedTime: 0,
  triggerTimer: null,
  previousRate: 1.0,
  boundKeyDown: handleKeyDown,
  boundKeyUp: handleKeyUp
}

function getTriggerKey(): string {
  return String(gm.getValue(turboPlaybackKeyKey, DEFAULT_TURBO_PLAYBACK_KEY))
}

function getTurboSpeed(): number {
  const speedValue = gm.getValue(turboPlaybackSpeedKey, DEFAULT_TURBO_PLAYBACK_SPEED)
  return parseFloat(String(speedValue))
}

function isTargetKey(event: KeyboardEvent): boolean {
  const triggerKey = getTriggerKey()
  return event.key === triggerKey || event.code === triggerKey
}

function handleKeyDown(event: KeyboardEvent): void {
  if (!gm.getValue(turboPlaybackEnabledKey, false)) return

  const target = event.target as Element | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || (target as HTMLElement).isContentEditable)) {
    return
  }

  const video = getVideoElement()
  if (!video) return

  if (!isTargetKey(event)) return

  if (turboState.isActive) return

  turboState.keyPressedTime = Date.now()

  turboState.triggerTimer = setTimeout(() => {
    turboState.previousRate = video.playbackRate
    const turboSpeed = getTurboSpeed()
    showPersistentSpeedIndicator(turboSpeed)
    setPlaybackRate(turboSpeed)
    turboState.isActive = true
  }, TURBO_THRESHOLD_MS)
}

function handleKeyUp(event: KeyboardEvent): void {
  if (!turboState.triggerTimer) return

  clearTimeout(turboState.triggerTimer)
  turboState.triggerTimer = null

  if (!turboState.isActive) return

  const video = getVideoElement()
  if (!video) return

  setPlaybackRate(turboState.previousRate)
  hideSpeedIndicator()
  turboState.isActive = false
  turboState.previousRate = 1.0
}

export function initTurboPlayback(): void {
  document.addEventListener('keydown', turboState.boundKeyDown, true)
  document.addEventListener('keyup', turboState.boundKeyUp, true)
}

export function resetTurboPlayback(): void {
  document.removeEventListener('keydown', turboState.boundKeyDown, true)
  document.removeEventListener('keyup', turboState.boundKeyUp, true)

  if (turboState.triggerTimer) {
    clearTimeout(turboState.triggerTimer)
    turboState.triggerTimer = null
  }
  turboState.isActive = false
  turboState.previousRate = 1.0
}