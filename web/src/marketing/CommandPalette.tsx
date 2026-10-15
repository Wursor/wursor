'use client';

import Link from 'next/link';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Icon } from '../ui/Icon.tsx';
import { isPaletteShortcut, searchEntries } from './search.ts';

type Palette = { open: () => void };

/** Without a provider (a page rendered on its own) opening does nothing instead of crashing. */
const PaletteContext = createContext<Palette>({ open: () => {} });
export const useCommandPalette = () => useContext(PaletteContext);

/** Owns the open state and the Cmd/Ctrl+K shortcut. Wrap the whole marketing site once. */
export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open }), [open]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (!isPaletteShortcut(e)) return;
      e.preventDefault(); // Ctrl+K is "focus the address bar search" in some browsers.
      setIsOpen((v) => !v);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <PaletteContext.Provider value={value}>
      {children}
      {isOpen && <Palette onClose={close} />}
    </PaletteContext.Provider>
  );
}

const optionId = (id: string) => `palette-option-${id}`;

function Palette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchEntries(query), [query]);
  const activeEntry = results[active];

  // Remember where focus was, take it into the search box, and give it back on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (activeEntry) document.getElementById(optionId(activeEntry.id))?.scrollIntoView?.({ block: 'nearest' });
  }, [activeEntry]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault(); // One control to focus: the search box. Results are chosen with the arrow keys.
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) setActive((i) => (i + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
    } else if (e.key === 'Enter' && activeEntry) {
      e.preventDefault();
      document.getElementById(optionId(activeEntry.id))?.click();
    }
  };

  return (
    <div
      className="palette-backdrop"
      data-testid="palette-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label="Search" className="palette" onKeyDown={onKeyDown}>
        <div className="palette-field">
          <Icon name="search" size={16} />
          <input
            ref={inputRef}
            role="combobox"
            aria-label="Search the site"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-autocomplete="list"
            aria-activedescendant={activeEntry ? optionId(activeEntry.id) : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder="Search pages and docs…"
            className="palette-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
          />
        </div>
        {results.length > 0 ? (
          <ul id="palette-results" role="listbox" aria-label="Results" className="palette-results">
            {results.map((r, i) => (
              <li key={r.id} role="presentation">
                <Link
                  id={optionId(r.id)}
                  role="option"
                  aria-selected={i === active}
                  href={r.href}
                  className="palette-option"
                  tabIndex={-1}
                  onMouseMove={() => setActive(i)}
                  onClick={onClose}
                >
                  <span className="palette-option-text">
                    <span className="t-label-m">{r.title}</span>
                    {r.description && <span className="t-body-s palette-option-desc">{r.description}</span>}
                  </span>
                  <span className="t-label-s palette-option-group">{r.group}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" className="palette-empty t-body-m">
            No results for “{query.trim()}”
          </p>
        )}
      </div>
    </div>
  );
}
