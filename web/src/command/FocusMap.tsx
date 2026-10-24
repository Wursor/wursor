'use client';

import { useLayoutEffect, useState, type CSSProperties } from 'react';

const STOPS: ReadonlyArray<{ n: number; label: string; target: string; at: (r: DOMRect) => CSSProperties }> = [
  { n: 1, label: 'Sidebar', target: '.p-sidebar, .p-rail', at: (r) => ({ left: r.left - 5, top: r.top - 12 }) },
  { n: 2, label: 'Conversation stream (arrow keys move through steps)', target: '.p-stream', at: (r) => ({ left: r.left - 13, top: r.top + 31 }) },
  { n: 3, label: 'Composer', target: '.p-composer', at: (r) => ({ left: r.left - 9, top: r.top - 12 }) },
  { n: 4, label: 'Preview tabs', target: '.p-previewbar', at: (r) => ({ left: r.left + 7, top: r.top - 3 }) },
  { n: 5, label: 'Before and after slider', target: '.ws-fit-clip', at: (r) => ({ left: r.left - 6, top: r.top - 10 }) },
  { n: 6, label: 'Approve and publish (⌘↵ when focused)', target: '.p-approval .p-btn-primary', at: (r) => ({ left: r.right - 12, top: r.top - 14 }) },
];

/** Numbers on the page showing the order Tab moves focus in, with a short list beside it (Figma K6). */
export function FocusMap() {
  const [pos, setPos] = useState<Record<number, CSSProperties>>({});
  const [card, setCard] = useState<CSSProperties>({ visibility: 'hidden' });
  useLayoutEffect(() => {
    const measure = () => {
      const next: Record<number, CSSProperties> = {};
      for (const s of STOPS) {
        const r = document.querySelector<HTMLElement>(s.target)?.getBoundingClientRect();
        if (r && r.width > 0) next[s.n] = s.at(r);
      }
      setPos(next);
      const slider = document.querySelector<HTMLElement>('.ws-fit-clip')?.getBoundingClientRect();
      setCard(slider ? { left: slider.left, top: slider.bottom + 42 } : { left: 24, top: 24 });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return (
    <div className="cmd-focusmap">
      {STOPS.map((s) => (
        <span key={s.n} className="cmd-badge" aria-hidden="true" style={pos[s.n] ?? { visibility: 'hidden' }}>
          {s.n}
        </span>
      ))}
      <section aria-label="Tab order" className="cmd-taborder" style={card}>
        <h2>Tab order</h2>
        <ol>
          {STOPS.map((s) => (
            <li key={s.n}>
              <span>{s.n}</span>
              {s.label}
            </li>
          ))}
        </ol>
        <p>Esc closes any open layer. Focus is always a 2 px accent ring.</p>
      </section>
    </div>
  );
}
