'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useFeedback } from '../system/Feedback.tsx';
import { Icon } from '../ui/Icon.tsx';

const MODES = [
  { name: 'Ask first', text: 'Wursor shows you a plan and the result, and waits for you.', said: 'Wursor will ask first, then show you the result before anything goes live.' },
  { name: 'Go ahead', text: 'Everyday changes are made and you are told. Anything sensitive still waits.', said: 'Wursor will make everyday changes and tell you. Sensitive ones still wait for you.' },
  { name: 'Plan only', text: 'Wursor writes the plan. Nothing on your site changes.', said: 'Wursor will only write a plan. Nothing on your site changes.' },
] as const;

/** How much Wursor does before asking. A small menu that opens under its button; the choice shows on the button. */
export function ModeMenu({ mode }: { mode: string }) {
  const [current, setCurrent] = useState(mode);
  const [open, setOpen] = useState(false);
  const { notify } = useFeedback();
  const box = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  const pick = (m: (typeof MODES)[number]) => {
    setCurrent(m.name);
    setOpen(false);
    notify(m.said, 'info');
    trigger.current?.focus();
  };

  return (
    <span ref={box} className="p-modemenu">
      <button ref={trigger} type="button" className="p-btn p-btn-ghost p-btn-sm" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen(!open)}>
        <span>{current}</span>
        <Icon name="chevron-down" size={16} />
      </button>
      {open && (
        <div id={id} role="menu" aria-label="How Wursor works" className="p-modemenu-list">
          {MODES.map((m) => (
            <button key={m.name} type="button" role="menuitemradio" aria-checked={current === m.name} className="p-modemenu-item" onClick={() => pick(m)}>
              <span>{m.name}</span>
              <span>{m.text}</span>
            </button>
          ))}
          <a href="/settings/safety" className="p-modemenu-more">
            Safety and approvals settings
          </a>
        </div>
      )}
    </span>
  );
}
