import * as React from 'react'

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener('change', onStoreChange)
  return () => mql.removeEventListener('change', onStoreChange)
}

/**
 * useSyncExternalStore rather than useState + useEffect.
 *
 * The previous version initialised to `undefined`, then set the real value in
 * an effect -- so the first client render always reported "not mobile" and
 * corrected itself a tick later, which is a layout flash on small screens as
 * well as a react-hooks/set-state-in-effect violation. This subscribes to the
 * media query directly and reads it during render.
 *
 * The third argument is the server snapshot: there is no matchMedia during
 * SSR, so we assume desktop, matching the previous behaviour on the server.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  )
}
