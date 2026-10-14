'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { CommandPalette } from './CommandPalette.tsx';
import { FocusMap } from './FocusMap.tsx';
import type { Item } from './items.ts';
import { ShortcutHints } from './ShortcutHints.tsx';
import { ShortcutsDialog } from './ShortcutsDialog.tsx';

export type Layer = 'palette' | 'palette-ask' | 'palette-search' | 'shortcuts' | 'hints' | 'tab-order';

const HOLD_MS = 600;
const isTyping = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));

/**
 * The layers that sit over any signed-in screen: the command palette (Cmd or Ctrl and K), the list of shortcuts (?),
 * and the hints shown while the shortcut key is held. `initial` opens one straight away, for the fixed design states.
 */
export function useCommandLayers({ onRun, initial }: { onRun: (item: Item) => void; initial?: Layer | undefined }) {
  const [layer, setLayer] = useState<Layer | null>(initial ?? null);
  const hold = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const close = useCallback(() => setLayer(null), []);
  const open = useCallback((l: Layer) => setLayer(l), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setLayer((l) => (l && l.startsWith('palette') ? null : 'palette'));
      } else if (e.key === '?' && !mod && !isTyping(e.target)) {
        e.preventDefault();
        setLayer('shortcuts');
      } else if ((e.key === 'Meta' || e.key === 'Control') && !hold.current) {
        hold.current = setTimeout(() => setLayer((l) => l ?? 'hints'), HOLD_MS);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key !== 'Meta' && e.key !== 'Control') return;
      clearTimeout(hold.current);
      hold.current = undefined;
      setLayer((l) => (l === 'hints' ? null : l));
    };
    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
      clearTimeout(hold.current);
    };
  }, []);

  const query = layer === 'palette-ask' ? 'Make the footer phone number a tap-to-call link' : layer === 'palette-search' ? 'pub' : '';
  const element: ReactNode =
    layer && layer.startsWith('palette') ? <CommandPalette key={layer} onClose={close} onRun={onRun} defaultQuery={query} />
    : layer === 'shortcuts' ? <ShortcutsDialog onClose={close} />
    : layer === 'hints' ? <ShortcutHints />
    : layer === 'tab-order' ? <FocusMap />
    : null;

  return { layer, open, close, element };
}
