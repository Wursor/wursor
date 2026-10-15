'use client';

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { BoardStrip } from '../../product/BoardStrip.tsx';
import { HARBOR } from '../../product/harbor-bakery.ts';
import { HarborConversation } from '../../product/HarborConversation.tsx';
import { PreviewColumn } from '../../product/PreviewColumn.tsx';
import { Fit } from '../../ui/Fit.tsx';
import { Icon, type IconName } from '../../ui/Icon.tsx';
import { Responsive } from './SectionHeader.tsx';

type Surface = 'conversation' | 'preview' | 'board';

const SURFACES: ReadonlyArray<{ value: Surface; label: string; icon: IconName; caption: string; mobileCaption?: string }> = [
  { value: 'conversation', label: 'Conversation', icon: 'sparkles', caption: 'Conversation: ask in plain words. Wursor explains each step as it goes.', mobileCaption: 'Ask in plain words. Wursor explains each step.' },
  { value: 'preview', label: 'Preview', icon: 'eye', caption: 'Preview: see the real page on a phone, tablet and laptop before anything goes live.' },
  { value: 'board', label: 'Board', icon: 'board', caption: 'Board: every change in one place, from idea to published.' },
];

/**
 * Each window is a share of the stage width with the design's aspect ratio, and its content is scaled to the
 * window's own width, so the three views stay in proportion on any screen. Sizes are from the design (1344 × 720 stage).
 */
const WINDOWS: Record<Surface, { width: string; aspect: string; contentWidth: number; contentHeight: number; initialScale: number }> = {
  conversation: { width: '41.667%', aspect: '560 / 620', contentWidth: 440, contentHeight: 852, initialScale: 560 / 440 },
  preview: { width: '60.863%', aspect: '818 / 600', contentWidth: 760, contentHeight: 852, initialScale: 818 / 760 },
  board: { width: '78.571%', aspect: '1056 / 341', contentWidth: 760, contentHeight: 246, initialScale: 1056 / 760 },
};

function SurfaceWindow({ surface }: { surface: Surface }) {
  const w = WINDOWS[surface];
  const style = { '--w': w.width, aspectRatio: w.aspect } as CSSProperties;
  return (
    <div className="m-window" style={style}>
      <Fit designWidth={w.contentWidth} designHeight={w.contentHeight} initialScale={w.initialScale} maxScale={3}>
        {surface === 'conversation' && <HarborConversation />}
        {surface === 'preview' && <PreviewColumn />}
        {surface === 'board' && <BoardStrip lanes={HARBOR.board} />}
      </Fit>
    </div>
  );
}

export function SurfacesShowcase() {
  const [selected, setSelected] = useState<Surface>('conversation');
  const id = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = SURFACES.find((s) => s.value === selected)!;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + SURFACES.length) % SURFACES.length;
    setSelected(SURFACES[next]!.value);
    tabs.current[next]?.focus();
  };

  return (
    <div className="m-showcase">
      <div role="tablist" aria-label="Workspace views" className="m-feature-tabs">
        {SURFACES.map((s, i) => (
          <button
            key={s.value}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${s.value}`}
            aria-selected={s.value === selected}
            aria-controls={`${id}-panel`}
            tabIndex={s.value === selected ? 0 : -1}
            className="m-feature-tab t-label-m"
            onClick={() => setSelected(s.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <Icon name={s.icon} size={20} />
            {s.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${selected}`} className="m-showcase-panel">
        <div className="m-surface" aria-hidden="true" inert>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="m-backdrop" src="/marketing/backdrop.svg" alt="" />
          <SurfaceWindow surface={selected} />
        </div>
        <p className="t-body-l m-section-sub m-caption">
          <Responsive desktop={current.caption} mobile={current.mobileCaption} />
        </p>
      </div>
    </div>
  );
}
