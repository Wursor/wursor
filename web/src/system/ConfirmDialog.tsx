'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from '../product/Button.tsx';

type Props = {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** A danger button for anything that stops Wursor working on a site. */
  tone?: 'danger';
  onConfirm: () => void;
  onCancel: () => void;
};

/** A short question before something that matters (Figma SY9 / N4): what will happen, then Cancel and the action. */
export function ConfirmDialog({ title, children, confirmLabel, cancelLabel = 'Cancel', tone, onConfirm, onCancel }: Props) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  // Keyboard users land inside the question, on its safest button.
  useEffect(() => {
    box.current?.querySelector<HTMLButtonElement>('button')?.focus();
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);
  return (
    <div ref={box} role="alertdialog" aria-modal="true" aria-labelledby={id} className="sy-dialog">
      <h2 id={id}>{title}</h2>
      <p>{children}</p>
      <div className="sy-dialog-actions">
        <Button variant="ghost" size="md" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={tone === 'danger' ? 'danger' : 'primary'} size="md" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
