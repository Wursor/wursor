'use client';

import { useEffect } from 'react';

const GROUPS = [
  { name: 'General', rows: [['Command palette', '⌘K'], ['New change', '⌘N'], ['All shortcuts', '?'], ['Close a layer', 'Esc']] },
  { name: 'Compose and review', rows: [['Send message', '⌘↵'], ['Approve (focused)', '⌘↵'], ['Leave composer', 'Esc Esc']] },
  { name: 'Workspace', rows: [['Toggle sidebar', '⌘\\'], ['Toggle board', '⌘J'], ['Cycle detail', '⇧⌘D']] },
] as const;

/** Every keyboard shortcut in one place (Figma K4). */
export function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="cmd-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" className="cmd-shortcuts">
        <header>
          <div>
            <h2>Keyboard shortcuts</h2>
            <p>On Windows and Linux, use Ctrl in place of ⌘.</p>
          </div>
          <kbd className="p-kbd">Esc</kbd>
        </header>
        <div className="cmd-shortcuts-body">
          {GROUPS.map((g) => (
            <div key={g.name} role="group" aria-label={g.name}>
              <p className="cmd-grouphead" aria-hidden="true">
                {g.name}
              </p>
              <ul>
                {g.rows.map(([label, keys]) => (
                  <li key={label}>
                    <span>{label}</span>
                    <kbd className="p-kbd">{keys}</kbd>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
