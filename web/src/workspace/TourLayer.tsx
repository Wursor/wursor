'use client';

import { useLayoutEffect, useState, type CSSProperties } from 'react';
import { CoachMark } from './CoachMark.tsx';
import { PHONE, useMediaQuery } from './useMediaQuery.ts';

export const TOUR_STEPS = [
  { title: 'Watch it work', body: 'Wursor explains each step here. Open any step to see more.', target: '.p-convo', arrow: 'left' as const },
  { title: 'See your site change', body: 'Your site updates live here. Nothing goes public yet.', target: '.ws-fit-clip, .ws-phone-frame', arrow: 'up' as const },
  { title: 'Your to-do list', body: 'Every change lives on the board. Add your own ideas anytime.', target: '.p-sidebar', arrow: 'left' as const },
  { title: 'You decide when it goes live', body: 'Approve to publish. You can undo it afterwards.', target: '.p-approval', arrow: 'down' as const },
] as const;

/** Where the callout sits for each step, measured from the surface it introduces. */
function place(step: number, r: DOMRect, phone: boolean): CSSProperties {
  if (phone) return { left: 16, right: 16, bottom: 172 };
  switch (step) {
    case 1: return { left: r.right + 20, top: r.top + 82 };
    case 2: return { left: r.left + 196, top: r.bottom - 10 };
    case 3: return { left: r.right + 10, top: r.top + 22 };
    default: return { left: r.left + 421, top: r.top - 195 };
  }
}

/** The guided tour of the workspace: four callouts, one at a time. */
export function TourLayer({ step, onNext, onSkip }: { step: 1 | 2 | 3 | 4; onNext: () => void; onSkip: () => void }) {
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' });
  const s = TOUR_STEPS[step - 1]!;
  const phone = useMediaQuery(PHONE);

  useLayoutEffect(() => {
    const measure = () => {
      const el = document.querySelector<HTMLElement>(s.target);
      const rect = el?.getBoundingClientRect();
      setStyle(phone ? place(step, new DOMRect(), true) : rect && rect.width > 0 ? place(step, rect, false) : { left: 24, bottom: 24 });
    };
    measure();
    window.addEventListener('resize', measure);
    // The surface can still be settling (the preview scales to its stage), so follow its size too.
    const target = document.querySelector<HTMLElement>(s.target);
    const ro = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    if (target) ro?.observe(target);
    return () => {
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [step, s.target, phone]);

  return <CoachMark step={step} total={4} title={s.title} body={s.body} arrow={phone ? 'left' : s.arrow} onNext={onNext} onSkip={onSkip} style={style} />;
}
