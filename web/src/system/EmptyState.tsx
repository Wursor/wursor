import type { ReactNode } from 'react';
import { Button } from '../product/Button.tsx';
import { Icon, type IconName } from '../ui/Icon.tsx';

type Props = { title: string; children: ReactNode; icon?: IconName; action?: { label: string; onClick: () => void } | undefined };

/** Nothing here yet (Figma SY10): a quiet tile, what this place is for, and at most one thing to do. */
export function EmptyState({ title, children, icon = 'sparkles', action }: Props) {
  return (
    <div className="sy-empty">
      <span className="sy-tile" aria-hidden="true">
        <Icon name={icon} size={20} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {action && (
        <Button size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
