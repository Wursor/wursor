'use client';

import { useLayoutEffect, useState, type CSSProperties } from 'react';

const HINTS: ReadonlyArray<{ label: string; keys: string; target: string; place: (r: DOMRect) => CSSProperties }> = [
  { label: 'Toggle sidebar', keys: '⌘\\', target: 'button[aria-label="Toggle sidebar"]', place: (r) => ({ left: r.left, top: r.bottom + 9 }) },
  { label: 'Cycle detail', keys: '⇧⌘D', target: '.p-convo-header .p-segmented', place: (r) => ({ left: r.left + 70, top: r.bottom + 8 }) },
  { label: 'Toggle board', keys: '⌘J', target: '.p-board-link', place: (r) => ({ left: r.right - 133, top: r.top - 50 }) },
  { label: 'Send message', keys: '⌘↵', target: '.p-composer', place: (r) => ({ left: r.right - 150, top: r.top - 37 }) },
];

/** Shortcut names beside the things they work on, shown while the owner holds the shortcut key (Figma K5). */
export function ShortcutHints() {
  const [styles, setStyles] = useState<Record<string, CSSProperties>>({});
  useLayoutEffect(() => {
    const measure = () => {
      const next: Record<string, CSSProperties> = {};
      for (const h of HINTS) {
        const el = document.querySelector<HTMLElement>(h.target);
        const r = el?.getBoundingClientRect();
        if (r && r.width > 0) next[h.label] = h.place(r);
      }
      setStyles(next);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return (
    <div className="cmd-hints" aria-hidden="false">
      {HINTS.map((h) => (
        <div key={h.label} className="cmd-hint" style={styles[h.label] ?? { visibility: 'hidden' }}>
          <span>{h.label}</span>
          <kbd>{h.keys}</kbd>
        </div>
      ))}
    </div>
  );
}
