import { getVideoElement } from '../core/element-getter.js'

export const AUTO_CLOSE_LOGIN_WINDOW_INTERVAL = 1000

export function initAutoCloseLoginWindowGuard(
  closeBtnSelector: string,
  onDialogClosed?: () => void
): ReturnType<typeof setInterval> {
  return setInterval(() => {
    const closeBtn = document.querySelector(closeBtnSelector)
    if (!closeBtn) return
    ;(closeBtn as HTMLElement).click()
    const video = getVideoElement()
    if (video && video.paused) {
      video.play().catch(() => {})
    }
    if (onDialogClosed) {
      onDialogClosed()
    }
  }, AUTO_CLOSE_LOGIN_WINDOW_INTERVAL)
}
