'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from '../ui/Icon.tsx';
import { GROUP_LABEL, search, type Group, type Item } from './items.ts';

type Props = {
  onClose: () => void;
  /** Called with the chosen item, just before the palette closes. */
  onRun: (item: Item) => void;
  defaultQuery?: string;
};

const optionId = (id: string) => `cmd-option-${id}`;

/** Search, act and ask in one box: Cmd or Ctrl and K (Figma K1 to K3). */
export function CommandPalette({ onClose, onRun, defaultQuery = '' }: Props) {
  const [query, setQuery] = useState(defaultQuery);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(query), [query]);
  const groups = useMemo(() => {
    const seen: Group[] = [];
    for (const r of results) if (!seen.includes(r.group)) seen.push(r.group);
    return seen.map((g) => ({ group: g, items: results.filter((r) => r.group === g) }));
  }, [results]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    input.current?.focus();
    return () => previous?.focus?.();
  }, []);
  useEffect(() => setActive(0), [query]);

  const run = (item: Item | undefined) => {
    if (!item) return;
    onRun(item);
    onClose();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[active]);
    }
  };

  const current = results[active];
  return (
    <div className="cmd-backdrop" data-testid="palette-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="cmd" onKeyDown={onKeyDown}>
        <div className="cmd-card">
        <div className="cmd-inputrow">
          <Icon name="search" size={20} />
          <input
            ref={input}
            role="combobox"
            aria-label="Ask Wursor to…"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-activedescendant={current ? optionId(current.id) : undefined}
            placeholder="Ask Wursor to…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="p-kbd">Esc</kbd>
        </div>
        <div id="cmd-list" role="listbox" aria-label="Results" className="cmd-list">
          {results.length === 0 && <p className="cmd-empty">Nothing matches “{query.trim()}”.</p>}
          {groups.map(({ group, items }) => (
            <div key={group} role="group" aria-label={GROUP_LABEL[group]} className="cmd-group">
              <p className="cmd-grouphead" aria-hidden="true">
                {GROUP_LABEL[group]}
              </p>
              {items.map((item) => {
                const selected = current?.id === item.id;
                return (
                  <div
                    key={item.id}
                    id={optionId(item.id)}
                    role="option"
                    aria-selected={selected}
                    className="cmd-item"
                    onMouseMove={() => setActive(results.indexOf(item))}
                    onClick={() => run(item)}
                  >
                    <Icon name={item.icon} size={20} />
                    <span className="cmd-label">{item.label}</span>
                    {item.meta && <span className="cmd-meta">{item.meta}</span>}
                    <span className="p-spacer" />
                    {(item.kbd || selected) && <kbd className="p-kbd">{item.kbd ?? '↵'}</kbd>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmd-footer">
          <span>
            <kbd className="p-kbd">↑↓</kbd> Navigate
          </span>
          <span>
            <kbd className="p-kbd">↵</kbd> Select
          </span>
          <span>
            <kbd className="p-kbd">Esc</kbd> Close
          </span>
          <span className="p-spacer" />
          <span>
            <kbd className="p-kbd">⌘↵</kbd> Ask Wursor
          </span>
        </div>
        </div>
      </div>
    </div>
  );
}
