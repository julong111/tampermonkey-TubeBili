import { createFloatingButton } from '../ui/floating-button.js'

export interface GmApi {
  getValue(key: string, defaultValue?: unknown): unknown
  setValue(key: string, value: unknown): unknown
  addStyle(css: string): unknown
  registerMenuCommand(name: string, callback: () => void): void
}

export const gm: GmApi = {
  getValue(key, defaultValue) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_getValue(key, defaultValue)
    }
    try {
      const value = localStorage.getItem('TubeBili_' + key)
      if (value === null) return defaultValue
      if (value === 'true') return true
      if (value === 'false') return false
      if (!isNaN(Number(value)) && value !== '') return Number(value)
      return value
    } catch (e) {
      console.warn('[TubeBili] localStorage read failed:', e)
      return defaultValue
    }
  },

  setValue(key, value) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_setValue(key, value)
    }
    try {
      localStorage.setItem('TubeBili_' + key, String(value))
      return Promise.resolve()
    } catch (e) {
      console.warn('[TubeBili] localStorage write failed:', e)
      return Promise.reject(e)
    }
  },

  addStyle(css) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_addStyle(css)
    }
    const style = document.createElement('style')
    style.textContent = css
    style.setAttribute('data-tubebili-style', 'true')
    if (document.head) {
      document.head.appendChild(style)
    } else {
      const addWhenReady = () => {
        if (document.head) {
          document.head.appendChild(style)
          document.removeEventListener('DOMContentLoaded', addWhenReady)
        }
      }
      document.addEventListener('DOMContentLoaded', addWhenReady)
    }
    return style
  },

  registerMenuCommand(name, callback) {
    if (__TARGET__ === 'tampermonkey') {
      return GM_registerMenuCommand(name, callback)
    }
    createFloatingButton(name, callback)
  }
}
