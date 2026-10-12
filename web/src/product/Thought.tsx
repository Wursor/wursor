'use client';

import { useState, type ReactNode } from 'react';
import { Icon } from '../ui/Icon.tsx';

type Props = { seconds: number; defaultExpanded?: boolean; children?: ReactNode };

/** Collapsed by default. Shows that Wursor reasoned; expand to read the reasoning in plain words. */
export function Thought({ seconds, defaultExpanded = false, children }: Props) {
  const [open, setOpen] = useState(defaultExpanded);
  return (
    <div className="p-thought">
      <button type="button" className="p-thought-header" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <Icon name={open ? 'chevron-down' : 'chevron-right'} size={20} />
        <span>Thought for {seconds} seconds</span>
      </button>
      {open && (
        <div className="p-thought-body">
          <span className="p-thought-rule" aria-hidden="true" />
          <p>{children}</p>
        </div>
      )}
    </div>
  );
}
