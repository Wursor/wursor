'use client';

import { useEffect, useId, type ReactNode } from 'react';

/** A panel that rises from the bottom of a phone (Figma N2–N4): a grab bar, a title and the content. Escape or a tap outside closes it. */
export function Sheet({ title, height, onClose, children }: { title: string; /** The sheet's height in px; it never goes past 90% of the screen. */ height?: number; onClose: () => void; children: ReactNode }) {
  const id = useId();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="mb-scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby={id} className="mb-sheet" style={height ? { height } : undefined}>
        <span className="mb-grab" aria-hidden="true" />
        <h2 id={id}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
