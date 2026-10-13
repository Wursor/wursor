import type { ReactNode } from 'react';
import { Icon } from './Icon.tsx';

/** Transient dark confirmation with a check mark (Figma "Toast"). Place it in a live region so it is announced. */
export function Toast({ children }: { children: ReactNode }) {
  return (
    <div className="ui-toast">
      <Icon name="check-circle" size={18} />
      <span className="t-body-m">{children}</span>
    </div>
  );
}
