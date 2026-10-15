'use client';

import { useState, type ReactNode } from 'react';
import { Icon } from '../ui/Icon.tsx';
import { Counter } from './Counter.tsx';

type Props = { title: string; count: number; defaultExpanded?: boolean; children?: ReactNode };

/** Groups a run of similar steps under one line at the Steps detail level. Expand to see each step. */
export function StepGroup({ title, count, defaultExpanded = false, children }: Props) {
  const [open, setOpen] = useState(defaultExpanded);
  return (
    <div className="p-stepgroup">
      <button type="button" className="p-stepgroup-header" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <Icon name={open ? 'chevron-down' : 'chevron-right'} size={20} />
        <span className="p-stepgroup-title">{title}</span>
        <Counter count={count} />
      </button>
      {open && <div className="p-stepgroup-body">{children}</div>}
    </div>
  );
}
