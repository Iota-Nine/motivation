type FullscreenCapable = HTMLElement & {
  webkitRequestFullscreen?: (options?: unknown) => Promise<void> | void
  webkitRequestFullScreen?: () => Promise<void> | void
  msRequestFullscreen?: () => Promise<void> | void
}

/** Closest browser equivalent to F11. Must run inside a user gesture. */
export async function enterFullscreen(
  el: HTMLElement = document.documentElement,
): Promise<void> {
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null
    msFullscreenElement?: Element | null
  }

  if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement) {
    return
  }

  const node = el as FullscreenCapable

  try {
    if (node.requestFullscreen) {
      await node.requestFullscreen({ navigationUI: 'hide' })
      return
    }
    if (node.webkitRequestFullscreen) {
      await node.webkitRequestFullscreen()
      return
    }
    if (node.webkitRequestFullScreen) {
      await node.webkitRequestFullScreen()
      return
    }
    if (node.msRequestFullscreen) {
      await node.msRequestFullscreen()
    }
  } catch {
    try {
      if (node.requestFullscreen) await node.requestFullscreen()
    } catch {
      /* blocked */
    }
  }
}
