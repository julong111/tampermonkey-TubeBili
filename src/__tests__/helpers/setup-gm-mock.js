import { vi } from 'vitest'

export function createGMMock() {
  const store = new Map()

  return {
    getValue: vi.fn((key, defaultValue) => {
      return store.has(key) ? store.get(key) : defaultValue
    }),
    setValue: vi.fn((key, value) => {
      store.set(key, value)
    }),
    addStyle: vi.fn(() => {}),
    registerMenuCommand: vi.fn(() => {}),
    _store: store,
  }
}

export function stubGlobalGM(mock) {
  vi.stubGlobal('GM_getValue', mock.getValue)
  vi.stubGlobal('GM_setValue', mock.setValue)
  vi.stubGlobal('GM_addStyle', mock.addStyle)
  vi.stubGlobal('GM_registerMenuCommand', mock.registerMenuCommand)
}

export function unstubGlobalGM() {
  vi.unstubAllGlobals()
}

export function createLocalStorageMock() {
  const store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = String(value) }),
    _store: store,
  }
}
