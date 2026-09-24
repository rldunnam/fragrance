'use client'

import { useCallback, useSyncExternalStore } from 'react'

// A boolean remembered in localStorage, per browser.
//
// useSyncExternalStore rather than useState + effect: the server snapshot is
// always `false`, so the prerendered HTML and the first client render agree
// (no hydration mismatch), and the stored value is picked up immediately after
// without a set-state-in-effect cascade. Storage can be unavailable (private
// mode, blocked cookies), so every access is guarded, with an in-memory fallback.

const EVENT = 'fragrance:local-flag'

// Used only when localStorage throws, so the toggle still works for the
// current page view even though it cannot be remembered.
const memory = new Map<string, boolean>()

function read(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === '1'
  } catch {
    return memory.get(key) ?? false
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(EVENT, onChange)
  }
}

export function useLocalFlag(key: string): [boolean, (next: boolean) => void] {
  const value = useSyncExternalStore(subscribe, () => read(key), () => false)
  const set = useCallback(
    (next: boolean) => {
      try {
        window.localStorage.setItem(key, next ? '1' : '0')
      } catch {
        memory.set(key, next)
      }
      window.dispatchEvent(new Event(EVENT))
    },
    [key],
  )
  return [value, set]
}
