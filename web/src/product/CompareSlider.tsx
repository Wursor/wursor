'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Icon } from '../ui/Icon.tsx';

type Props = { before: ReactNode; after: ReactNode; defaultPosition?: number };

const STEP = 5;
const clamp = (n: number) => Math.min(100, Math.max(0, n));

/** Drag the divider (or use the arrow keys) to compare the live site on the left with the draft on the right. */
export function CompareSlider({ before, after, defaultPosition = 50 }: Props) {
  const [position, setPosition] = useState(clamp(defaultPosition));
  const box = useRef<HTMLDivElement>(null);

  const moveTo = (clientX: number) => {
    const rect = box.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100));
  };
  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.buttons === 1) moveTo(e.clientX);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next: Record<string, number | undefined> = {
      ArrowLeft: position - STEP,
      ArrowRight: position + STEP,
      Home: 0,
      End: 100,
    };
    const value = next[e.key];
    if (value === undefined) return;
    e.preventDefault();
    setPosition(clamp(value));
  };

  return (
    <div ref={box} className="p-compare">
      <div className="p-compare-layer">{after}</div>
      <div className="p-compare-layer p-compare-before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {before}
      </div>
      <span className="p-compare-divider" style={{ left: `${position}%` }} aria-hidden="true" />
      <span className="p-compare-label p-compare-label-before">Before</span>
      <span className="p-compare-label p-compare-label-after">After</span>
      <button
        type="button"
        role="slider"
        aria-label="Compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% before`}
        className="p-compare-handle"
        style={{ left: `${position}%` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
      >
        <Icon name="split" size={20} />
      </button>
    </div>
  );
}
