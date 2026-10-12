import type { ReactNode } from 'react';
import { Icon, type IconName } from '../ui/Icon.tsx';

type Kind = 'look' | 'search' | 'edit' | 'running';
const ICON: Record<Kind, IconName> = { look: 'eye', search: 'search', edit: 'pencil', running: 'loader' };

/** One thing Wursor did. A running step swaps in a spinner and a stronger label. */
export function StepLine({ kind, time, children }: { kind: Kind; time: string; children: ReactNode }) {
  const running = kind === 'running';
  return (
    <div className={`p-stepline${running ? ' p-stepline-running' : ''}`}>
      {running ? (
        <span role="status" aria-label="In progress" className="p-stepline-icon">
          <Icon name={ICON[kind]} size={20} />
        </span>
      ) : (
        <span className="p-stepline-icon">
          <Icon name={ICON[kind]} size={20} />
        </span>
      )}
      <span className="p-stepline-text">{children}</span>
      <span className="p-stepline-time">{time}</span>
    </div>
  );
}
