import { Icon } from '../ui/Icon.tsx';

export type CheckState = 'done' | 'running' | 'pending';
export type CheckItem = { label: string; state: CheckState };

const CAPTION: Record<CheckState, string> = { done: 'Done', running: 'Working…', pending: 'Waiting' };

/** One line per task: done (green tick), working (orange spinner) or waiting (grey ring). Figma "Connect Checklist Item". */
export function Checklist({ label, items }: { label: string; items: readonly CheckItem[] }) {
  return (
    <ol aria-label={label} className="ob-checklist">
      {items.map((item) => (
        <li key={item.label} className="ob-checkitem" data-state={item.state}>
          <span className="ob-checkitem-mark" aria-hidden="true">
            {item.state === 'done' && <Icon name="check-circle" size={20} />}
            {item.state === 'running' && <Icon name="loader" size={20} className="ob-spin" />}
            {item.state === 'pending' && <span className="ob-pending-dot" />}
          </span>
          <span className="ob-checkitem-text">
            <span className="t-body-m">{item.label}</span>
            <span className="t-caption">{CAPTION[item.state]}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
