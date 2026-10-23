'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../product/Button.tsx';
import { IconButton } from '../product/IconButton.tsx';
import { SegmentedControl } from '../product/SegmentedControl.tsx';
import { Select } from '../settings/controls.tsx';
import { LANES, type LaneId } from './data.ts';

export type NewChange = {
  text: string;
  site: string;
  mode: 'Ask first' | 'Go ahead' | 'Plan only';
  /** The lane the card is added to. */
  stage: LaneId;
  page: string;
  /** Optional, as YYYY-MM-DD. Empty when there is none. */
  due: string;
  files: string[];
};
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
const STAGE_HELP: Record<LaneId, string> = {
  idea: 'Saved for later. Wursor does nothing until you move it on.',
  'plan-ready': 'Wursor writes the plan and waits for you to look at it.',
  working: 'Wursor starts right away.',
  'needs-you': 'For something Wursor must ask you about before it can go on.',
  ready: 'Already made. Waiting for you to look and approve.',
  done: 'Already live. Kept here so the board tells the whole story.',
};
const PAGES = ['Whole site', 'Home page', 'Contact page', 'Menu', 'Footer', 'Gallery', 'Order page'];
const SITES = ['Harbor Bakery', 'Northline Studio', 'Kestrel Coffee', 'Lumen Studio'];
const stageTitle = (id: LaneId) => LANES.find((l) => l.id === id)!.title;

/** Say what you want in your own words, pick the site and how Wursor should work, and start (Figma BD8). */
export function NewChangeDialog({ onStart, onClose, initialText = '', initialStage = 'working' }: { onStart: (c: NewChange) => void; onClose: () => void; initialText?: string; initialStage?: LaneId }) {
  const [text, setText] = useState(initialText);
  const [site, setSite] = useState('Harbor Bakery');
  const [mode, setMode] = useState<NewChange['mode']>('Ask first');
  const [stage, setStage] = useState<LaneId>(initialStage);
  const [page, setPage] = useState(PAGES[0]!);
  const [due, setDue] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const picker = useRef<HTMLInputElement>(null);
  const action = stage === 'working' ? 'Start' : stage === 'idea' ? 'Add idea' : 'Add to board';
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
            <span>Stage</span>
            <Select label="Stage" options={LANES.map((l) => l.title)} value={stageTitle(stage)} onChange={(t) => setStage(LANES.find((l) => l.title === t)!.id)} />
          </div>
        </div>
        <p className="bd-dialog-help">{STAGE_HELP[stage]}</p>
        <div className="bd-dialog-row">
          <div className="bd-dialog-field">
            <span>Page</span>
            <Select label="Page" options={PAGES} value={page} onChange={setPage} />
          </div>
        </div>
        <div className="bd-dialog-row">
          <div className="bd-dialog-field">
            <label htmlFor={`${id}-due`}>Due date (optional)</label>
            <input id={`${id}-due`} type="date" className="bd-dialog-date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          <div className="bd-dialog-field">
            <span id={`${id}-mode`}>How to work</span>
            <SegmentedControl label="How to work" options={MODES} value={mode} onChange={setMode} />
          </div>
        </div>
        <p className="bd-dialog-help">{HELP[mode](site)}</p>
        <div className="bd-dialog-files">
          <input
            ref={picker}
            id={`${id}-files`}
            type="file"
            multiple
            hidden
            aria-label="Attach files"
            onChange={(e) => {
              const names = Array.from(e.target.files ?? []).map((f) => f.name);
              setFiles((cur) => [...cur, ...names.filter((n) => !cur.includes(n))]);
              e.target.value = '';
            }}
          />
          <Button variant="secondary" size="sm" leadingIcon="paperclip" onClick={() => picker.current?.click()}>
            Attach files
          </Button>
          {files.map((f) => (
            <span key={f} className="bd-dialog-chip">
              <span>{f}</span>
              <button type="button" aria-label={`Remove ${f}`} onClick={() => setFiles((cur) => cur.filter((n) => n !== f))}>
                ×
              </button>
            </span>
          ))}
        </div>
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
              onStart({ text: text.trim(), site, mode, stage, page, due, files });
              onClose();
            }}
          >
            {action}
          </button>
        </div>
      </div>
    </div>
  );
}
