'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { AgentCursor } from '../product/AgentCursor.tsx';
import { PointHighlight } from '../product/PointHighlight.tsx';

type Rect = { left: number; top: number; width: number; height: number };
type Props = {
  /** The `data-point` value of the element to mark, inside the same box. */
  target: string;
  label: string;
  /** Space added around the target, in pixels. */
  pad?: { x: number; y: number };
  cursor?: boolean;
  /** Changes whenever the page is scaled, so the box is measured again. */
  zoom: number;
};

/** A dashed accent box over the spot Wursor is working on, measured from the page so it follows the layout. */
export function PointOverlay({ target, label, pad = { x: 8, y: 6 }, cursor = false, zoom }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect | null>(null);

  useLayoutEffect(() => {
    const host = ref.current?.parentElement;
    const el = host?.querySelector<HTMLElement>(`[data-point="${target}"]`);
    if (!host || !el) return;
    const h = host.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    setRect({ left: r.left - h.left - pad.x, top: r.top - h.top - pad.y, width: r.width + pad.x * 2, height: r.height + pad.y * 2 });
  }, [target, pad.x, pad.y, zoom]);

  return (
    <div ref={ref} className="ws-overlay">
      {rect && <PointHighlight {...rect} label={label} />}
      {rect && cursor && <AgentCursor left={rect.left + rect.width * 0.62} top={rect.top + rect.height + 6} />}
    </div>
  );
}
