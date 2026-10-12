import type { ReactNode } from 'react';
import { Icon } from '../ui/Icon.tsx';

/** A divider in the stream that marks a stage in the life of a change. Always visible, even at the Headline level. */
export function Milestone({ children }: { children: string | ReactNode }) {
  const label = typeof children === 'string' ? children : undefined;
  return (
    <div role="separator" aria-label={label} className="p-milestone">
      <span className="p-milestone-line" />
      <span className="p-milestone-chip">
        <Icon name="list" size={20} />
        <span>{children}</span>
      </span>
      <span className="p-milestone-line" />
    </div>
  );
}
