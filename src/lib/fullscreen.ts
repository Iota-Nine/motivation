/** Browsers only allow this inside a user gesture (e.g. ENTER click). */
export async function enterFullscreen(
  el: HTMLElement = document.documentElement,
): Promise<void> {
  if (document.fullscreenElement) return

  const node = el as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void
    msRequestFullscreen?: () => Promise<void> | void
  }

  try {
    if (node.requestFullscreen) {
      await node.requestFullscreen()
    } else if (node.webkitRequestFullscreen) {
      await node.webkitRequestFullscreen()
    } else if (node.msRequestFullscreen) {
      await node.msRequestFullscreen()
    }
  } catch {
    /* blocked or unsupported */
  }
}
