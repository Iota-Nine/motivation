type FullscreenCapable = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
  webkitRequestFullScreen?: () => Promise<void> | void
  msRequestFullscreen?: () => Promise<void> | void
  webkitEnterFullscreen?: () => void
}

function isFullscreen(): boolean {
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null
    msFullscreenElement?: Element | null
  }
  return Boolean(
    doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement,
  )
}

function requestOn(el: HTMLElement): void {
  const node = el as FullscreenCapable
  try {
    if (typeof node.requestFullscreen === 'function') {
      void Promise.resolve(node.requestFullscreen()).catch(() => {})
      return
    }
    if (typeof node.webkitRequestFullscreen === 'function') {
      void Promise.resolve(node.webkitRequestFullscreen()).catch(() => {})
      return
    }
    if (typeof node.webkitRequestFullScreen === 'function') {
      void Promise.resolve(node.webkitRequestFullScreen()).catch(() => {})
      return
    }
    if (typeof node.msRequestFullscreen === 'function') {
      void Promise.resolve(node.msRequestFullscreen()).catch(() => {})
    }
  } catch {
    /* ignore */
  }
}

/**
 * Force browser fullscreen (F11-like).
 * Must be invoked synchronously from a click / pointerdown handler.
 */
export function forceFullscreen(extra?: HTMLElement | null): void {
  document.documentElement.classList.add('is-forced-fs')
  document.body.classList.add('is-forced-fs')

  if (isFullscreen()) return

  requestOn(document.documentElement)

  window.setTimeout(() => {
    if (isFullscreen()) return
    if (extra) requestOn(extra)
    if (!isFullscreen()) requestOn(document.body)
  }, 0)

  if (extra && 'webkitEnterFullscreen' in extra) {
    try {
      ;(extra as FullscreenCapable).webkitEnterFullscreen?.()
    } catch {
      /* ignore */
    }
  }
}

export async function enterFullscreen(
  el: HTMLElement = document.documentElement,
): Promise<void> {
  forceFullscreen(el)
}
