import { mock, type Mock } from 'bun:test'

export type ElementStub = {
  tagName: string
  id: string
  className: string
  textContent: string
  value: string
  checked: boolean
  title: string
  style: Record<string, string>
  dataset: Record<string, string>
  children: ElementStub[]
  firstChild: ElementStub | null
  parentNode: ElementStub | null
  classList: {
    add: Mock<(tokens: string) => void>
    remove: Mock<(tokens: string) => void>
    contains: (token: string) => boolean
    toggle: (token: string, force?: boolean) => void
  }
  addEventListener: Mock<(type: string, cb: (e?: unknown) => void) => void>
  removeEventListener: Mock<(type: string, cb: (e?: unknown) => void) => void>
  setAttribute: (name: string, value: string) => void
  getAttribute: (name: string) => string | null
  appendChild: (child: ElementStub) => void
  removeChild: (child: ElementStub) => void
  remove: Mock<() => void>
  click: Mock<() => void>
  before: (node: ElementStub) => void
  dispatchEvent: (event: { type: string }) => boolean
}

export function createElementStub(tagName = 'div'): ElementStub {
  const classes = new Set<string>()
  const attributes = new Map<string, string>()
  const listeners = new Map<string, Array<(e?: unknown) => void>>()

  const el: ElementStub = {
    tagName,
    id: '',
    className: '',
    textContent: '',
    value: '',
    checked: false,
    title: '',
    style: {},
    dataset: {},
    children: [],
    firstChild: null,
    parentNode: null,
    classList: {
      add: mock((token: string) => {
        classes.add(token)
      }),
      remove: mock((token: string) => {
        classes.delete(token)
      }),
      contains: (token) => classes.has(token),
      toggle: (token, force) => {
        if (force === undefined) {
          if (classes.has(token)) classes.delete(token)
          else classes.add(token)
        } else if (force) {
          classes.add(token)
        } else {
          classes.delete(token)
        }
      }
    },
    addEventListener: mock((type, cb) => {
      const list = listeners.get(type) ?? []
      list.push(cb)
      listeners.set(type, list)
    }),
    removeEventListener: mock((type, cb) => {
      const list = listeners.get(type) ?? []
      listeners.set(type, list.filter((fn) => fn !== cb))
    }),
    setAttribute: (name, value) => {
      attributes.set(name, value)
      if (name === 'id') el.id = value
    },
    getAttribute: (name) => attributes.get(name) ?? null,
    appendChild: (child) => {
      child.parentNode = el
      el.children.push(child)
      el.firstChild = el.children[0] ?? null
    },
    removeChild: (child) => {
      const idx = el.children.indexOf(child)
      if (idx !== -1) el.children.splice(idx, 1)
      child.parentNode = null
      el.firstChild = el.children[0] ?? null
    },
    remove: mock(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }),
    click: mock(() => {
      ;(listeners.get('click') ?? []).forEach((cb) => cb({ type: 'click' }))
    }),
    before: (node) => {
      if (el.parentNode) {
        const idx = el.parentNode.children.indexOf(el)
        if (idx === -1) el.parentNode.appendChild(node)
        else el.parentNode.children.splice(idx, 0, node)
      }
    },
    dispatchEvent: (event) => {
      ;(listeners.get(event.type) ?? []).forEach((cb) => cb(event))
      return true
    }
  }
  return el
}

export type DocumentMock = {
  body: ElementStub
  head: ElementStub
  documentElement: ElementStub
  fullscreenElement: ElementStub | null
  createElement: Mock<(tagName: string) => ElementStub>
  createTextNode: Mock<(text: string) => { textContent: string }>
  getElementById: Mock<(id: string) => ElementStub>
  querySelector: Mock<(selector: string) => ElementStub | null>
  querySelectorAll: Mock<(selector: string) => ElementStub[]>
  getElementsByTagName: Mock<(tag: string) => ElementStub[]>
  addEventListener: Mock<(type: string, cb: (e?: unknown) => void) => void>
  removeEventListener: Mock<(type: string, cb: (e?: unknown) => void) => void>
  _registry: Map<string, ElementStub>
}

export function createDocumentMock(): DocumentMock {
  const body = createElementStub('body')
  const head = createElementStub('head')
  const documentElement = createElementStub('html')
  const registry = new Map<string, ElementStub>()
  const byTag = new Map<string, ElementStub[]>()

  const register = (el: ElementStub) => {
    if (el.id) registry.set(el.id, el)
  }

  const doc: DocumentMock = {
    body,
    head,
    documentElement,
    fullscreenElement: null,
    createElement: mock((tagName: string) => createElementStub(tagName)),
    createTextNode: mock((text: string) => ({ textContent: text })),
    getElementById: mock((id: string) => registry.get(id) ?? createElementStub('div')),
    querySelector: mock(() => null),
    querySelectorAll: mock(() => []),
    getElementsByTagName: mock((tag: string) => byTag.get(tag) ?? []),
    addEventListener: mock(() => {}),
    removeEventListener: mock(() => {}),
    _registry: registry
  }

  const originalCreate = doc.createElement
  doc.createElement = mock((tagName: string) => {
    const el = originalCreate(tagName)
    let id = ''
    Object.defineProperty(el, 'id', {
      get: () => id,
      set: (v: string) => {
        id = v
        if (v) register(el)
      },
      configurable: true
    })
    return el
  }) as DocumentMock['createElement']

  ;(doc as unknown as { addElement(el: ElementStub): void }).addElement = (el: ElementStub) => {
    register(el)
    byTag.set(el.tagName, [...(byTag.get(el.tagName) ?? []), el])
  }

  return doc
}
