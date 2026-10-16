'use client';

import { useEffect, useId, useState } from 'react';
import { Button } from '../product/Button.tsx';
import { IconButton } from '../product/IconButton.tsx';
import { SegmentedControl } from '../product/SegmentedControl.tsx';
import { Select } from '../settings/controls.tsx';

export type NewChange = { text: string; site: string; mode: 'Ask first' | 'Go ahead' | 'Plan only' };
const MODES = [
  { value: 'Ask first', label: 'Ask first' },
  { value: 'Go ahead', label: 'Go ahead' },
  { value: 'Plan only', label: 'Plan only' },
] as const;
const HELP: Record<NewChange['mode'], (site: string) => string> = {
  'Ask first': (s) => `Wursor will show you a plan before it changes anything on ${s}.`,
  'Go ahead': (s) => `Wursor will make everyday changes on ${s} and tell you; it still asks first for anything sensitive.`,
  'Plan only': (s) => `Wursor will only write a plan for ${s}. Nothing changes.`,
};
const SITES = ['Harbor Bakery', 'Northline Studio', 'Kestrel Coffee', 'Lumen Studio'];

/** Say what you want in your own words, pick the site and how Wursor should work, and start (Figma BD8). */
export function NewChangeDialog({ onStart, onClose, initialText = '' }: { onStart: (c: NewChange) => void; onClose: () => void; initialText?: string }) {
  const [text, setText] = useState(initialText);
  const [site, setSite] = useState('Harbor Bakery');
  const [mode, setMode] = useState<NewChange['mode']>('Ask first');
  const id = useId();
  const ready = text.trim() !== '';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="bd-scrim bd-scrim-center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="New change" className="bd-dialog">
        <div className="bd-dialog-head">
          <h2>New change</h2>
          <IconButton icon="x" label="Close" onClick={onClose} />
        </div>
        <textarea
          aria-label="What should change"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          placeholder="Say it in your own words, like: “Add our Sunday hours to the footer”"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="bd-dialog-row">
          <div className="bd-dialog-field">
            <span id={id}>Site</span>
            <Select label="Site" options={SITES} value={site} onChange={setSite} />
          </div>
          <div className="bd-dialog-field">
            <span id={`${id}-mode`}>How to work</span>
            <SegmentedControl label="How to work" options={MODES} value={mode} onChange={setMode} />
          </div>
        </div>
        <p className="bd-dialog-help">{HELP[mode](site)}</p>
        <div className="bd-dialog-actions">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <button
            type="button"
            className="p-btn p-btn-primary p-btn-md"
            aria-disabled={!ready}
            onClick={() => {
              if (!ready) return;
              onStart({ text: text.trim(), site, mode });
              onClose();
            }}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
