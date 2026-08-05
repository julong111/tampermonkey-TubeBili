export function waitElement(selector: string, timeout: number = 10000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }

    const observer = new MutationObserver((_mutations, obs) => {
      const el = document.querySelector(selector)
      if (el) {
        obs.disconnect()
        clearTimeout(timer)
        resolve(el)
      }
    })

    const observeTarget = document.documentElement || document.body
    if (observeTarget) {
      observer.observe(observeTarget, {
        childList: true,
        subtree: true
      })
    }

    const timer = setTimeout(() => {
      observer.disconnect()
      reject(new Error(`Element not found within ${timeout}ms: ${selector}`))
    }, timeout)
  })
}

export function getVideoElement(): HTMLVideoElement | null {
  return document.getElementsByTagName('video')[0] || null
}
