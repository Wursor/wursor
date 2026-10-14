import type { ReactNode } from 'react';
import { Icon, type IconName } from '../ui/Icon.tsx';

export type MilestoneKind = 'plan' | 'needs-you' | 'ready' | 'published';
const ICON: Record<MilestoneKind, IconName> = { plan: 'list', 'needs-you': 'alert-triangle', ready: 'check-circle', published: 'rocket' };

/** A divider in the stream that marks a stage in the life of a change. Always visible, even at the Headline level. */
export function Milestone({ children, kind = 'plan' }: { children: string | ReactNode; kind?: MilestoneKind }) {
  const label = typeof children === 'string' ? children : undefined;
  return (
    <div role="separator" aria-label={label} className="p-milestone" data-kind={kind}>
      <span className="p-milestone-line" />
      <span className="p-milestone-chip">
        <Icon name={ICON[kind]} size={20} />
        <span>{children}</span>
      </span>
      <span className="p-milestone-line" />
    </div>
  );
}
