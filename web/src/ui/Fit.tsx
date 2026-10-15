'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type Props = {
  /** The width the content is designed at, in px. */
  designWidth: number;
  /** The height the content is designed at, in px. */
  designHeight: number;
  /** Scale used before the container is measured (server render). */
  initialScale?: number;
  /** Never scale above this. Default 1. */
  maxScale?: number;
  /** Never scale below this; the parent clips what does not fit. Default 0 (always fits). */
  minScale?: number;
  className?: string;
  children: ReactNode;
};

/** Scales content designed at a fixed size to the width of its container, and reserves the scaled height. */
export function Fit({ designWidth, designHeight, initialScale = 1, maxScale = 1, minScale = 0, className, children }: Props) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialScale);

  useEffect(() => {
    const el = outer.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(Math.max(minScale, Math.min(maxScale, w / designWidth)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth, maxScale, minScale]);

  const outerStyle: CSSProperties = { width: '100%', height: designHeight * scale, position: 'relative', overflow: 'hidden' };
  const innerStyle: CSSProperties = {
    width: designWidth,
    height: designHeight,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    position: 'absolute',
    top: 0,
    left: 0,
  };
  return (
    <div ref={outer} className={className} style={outerStyle}>
      <div style={innerStyle}>{children}</div>
    </div>
  );
}
