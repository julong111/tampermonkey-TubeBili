export function waitElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const el = document.querySelector(selector);
      if (el) {
        obs.disconnect();
        clearTimeout(timer);
        resolve(el);
      }
    });

    const observeTarget = document.documentElement || document.body;
    if (observeTarget) {
      observer.observe(observeTarget, {
        childList: true,
        subtree: true
      });
    }

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element not found within ${timeout}ms: ${selector}`));
    }, timeout);
  });
}

export function getVideoElement() {
  return document.getElementsByTagName("video")[0] || null;
}
