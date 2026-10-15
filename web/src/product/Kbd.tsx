import type { ReactNode } from 'react';

/** Keyboard key cap for shortcuts. */
export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="p-kbd">{children}</kbd>;
}
