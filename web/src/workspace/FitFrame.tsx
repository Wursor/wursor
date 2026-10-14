'use client';

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type Props = { designWidth?: number; maxWidth?: number; children: ReactNode; overlay?: (zoom: number) => ReactNode };

/**
 * Shows a page designed at one width (760 px) at the width the stage has, never wider than `maxWidth`.
 * The page is scaled with zoom so it stays crisp; the overlay (point highlights) is not scaled.
 */
export function FitFrame({ designWidth = 760, maxWidth = 760, children, overlay }: Props) {
  const outer = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(Math.min(maxWidth, designWidth));

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setWidth(Math.min(maxWidth, w));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [maxWidth]);

  const zoom = width / designWidth;
  return (
    <div ref={outer} className="ws-fit">
      <div className="ws-fit-box" style={{ width }}>
        <div className="ws-fit-clip">
          <div className="ws-fit-page" style={{ width: designWidth, zoom } as CSSProperties}>
            {children}
          </div>
        </div>
        {overlay?.(zoom)}
      </div>
    </div>
  );
}
