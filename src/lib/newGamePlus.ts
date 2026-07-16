const KEY = 'godhood.clears'

export function getClearCount(): number {
  try {
    const raw = localStorage.getItem(KEY)
    const n = raw ? Number.parseInt(raw, 10) : 0
    return Number.isFinite(n) && n > 0 ? n : 0
  } catch {
    return 0
  }
}

export function isNewGamePlus(): boolean {
  return getClearCount() > 0
}

export function recordClear(): number {
  const next = getClearCount() + 1
  try {
    localStorage.setItem(KEY, String(next))
  } catch {
    /* ignore */
  }
  return next
}
