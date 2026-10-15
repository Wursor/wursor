'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon.tsx';

type Props = {
  children: ReactNode;
  tone?: 'info' | 'warning' | 'success' | 'danger';
  /** An optional ghost button on the right, for example Details. */
  action?: { label: string; onClick: () => void } | undefined;
};

/** The text line height, in px (Body/M). A banner whose text runs to three lines or more gets room around it. */
const LINE = 20;

/** Inline message bar (Figma "Banner"): info is blue, warning is amber, success is green. */
export function Banner({ children, tone = 'info', action }: Props) {
  const text = useRef<HTMLParagraphElement>(null);
  const [tall, setTall] = useState(false);
  useLayoutEffect(() => {
    const el = text.current;
    if (!el) return;
    const measure = () => setTall(el.getBoundingClientRect().height >= LINE * 3 - 1);
    measure();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [children]);
  return (
    <div className="ui-banner" data-tone={tone} data-tall={tall ? 'true' : undefined}>
      <Icon name={tone === 'warning' ? 'alert-triangle' : tone === 'success' ? 'check-circle' : tone === 'danger' ? 'x-circle' : 'info'} size={20} />
      <p ref={text} className="t-body-m">{children}</p>
      {action && (
        <button type="button" className="ui-banner-action t-label-m" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
