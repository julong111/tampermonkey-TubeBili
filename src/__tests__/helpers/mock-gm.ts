import { mock, type Mock } from 'bun:test'

const savedGlobals = new Map<string, unknown>()

export function stubGlobal(name: string, value: unknown): void {
  if (!savedGlobals.has(name)) {
    savedGlobals.set(name, (globalThis as unknown as Record<string, unknown>)[name])
  }
  ;(globalThis as unknown as Record<string, unknown>)[name] = value
}

export function unstubAllGlobals(): void {
  for (const [name, prev] of savedGlobals) {
    if (prev === undefined) {
      delete (globalThis as unknown as Record<string, unknown>)[name]
    } else {
      ;(globalThis as unknown as Record<string, unknown>)[name] = prev
    }
  }
  savedGlobals.clear()
}

export type GMMock = {
  getValue: Mock<(key: string, defaultValue?: unknown) => unknown>
  setValue: Mock<(key: string, value: unknown) => unknown>
  addStyle: Mock<(css: string) => unknown>
  registerMenuCommand: Mock<(name: string, callback: () => void) => void>
  _store: Map<string, unknown>
}

export function createGMMock(): GMMock {
  const store = new Map<string, unknown>()
  return {
    getValue: mock((key, defaultValue) => {
      return store.has(key) ? store.get(key) : defaultValue
    }),
    setValue: mock((key, value) => {
      store.set(key, value)
    }),
    addStyle: mock(() => {}),
    registerMenuCommand: mock(() => {}),
    _store: store
  }
}

export function stubGlobalGM(gmMock: GMMock): void {
  stubGlobal('GM_getValue', gmMock.getValue)
  stubGlobal('GM_setValue', gmMock.setValue)
  stubGlobal('GM_addStyle', gmMock.addStyle)
  stubGlobal('GM_registerMenuCommand', gmMock.registerMenuCommand)
}

export function unstubGlobalGM(): void {
  unstubAllGlobals()
}

export function createLocalStorageMock(): Storage & { _store: Map<string, string> } {
  const store = new Map<string, string>()
  return {
    getItem: mock((key: string) => (store.has(key) ? (store.get(key) as string) : null)),
    setItem: mock((key: string, value: string) => {
      store.set(key, String(value))
    }),
    removeItem: mock((key: string) => {
      store.delete(key)
    }),
    clear: mock(() => {
      store.clear()
    }),
    key: mock((index: number) => [...store.keys()][index] ?? null),
    get length() {
      return store.size
    },
    _store: store
  } as Storage & { _store: Map<string, string> }
}
