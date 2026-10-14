'use client';

import { useSyncExternalStore } from 'react';

/** True while the media query matches. False on the server and on first paint, so server and client markup agree. */
export function useMediaQuery(query: string): boolean {
  const subscribe = (notify: () => void) => {
    const mq = window.matchMedia?.(query);
    mq?.addEventListener('change', notify);
    return () => mq?.removeEventListener('change', notify);
  };
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia?.(query).matches ?? false,
    () => false,
  );
}

export const PHONE = '(max-width: 600px)';
