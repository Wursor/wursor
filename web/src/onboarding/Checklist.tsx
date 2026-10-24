import { Icon } from '../ui/Icon.tsx';

export type CheckState = 'done' | 'running' | 'pending' | 'failed';
/** `detail` replaces the default caption (Done, Working…, Waiting), for example "Backup taken just now" or the plain reason a step failed. */
export type CheckItem = { label: string; state: CheckState; detail?: string };

const CAPTION: Record<CheckState, string> = { done: 'Done', running: 'Working…', pending: 'Waiting', failed: 'Failed' };

/** One line per task: done (green tick), working (orange spinner), waiting (grey ring) or failed (red cross). Figma "Connect Checklist Item". */
export function Checklist({ label, items }: { label: string; items: readonly CheckItem[] }) {
  return (
    <ol aria-label={label} className="ob-checklist">
      {items.map((item) => (
        <li key={item.label} className="ob-checkitem" data-state={item.state}>
          <span className="ob-checkitem-mark" aria-hidden="true">
            {item.state === 'done' && <Icon name="check-circle" size={20} />}
            {item.state === 'running' && <Icon name="loader" size={20} className="ob-spin" />}
            {item.state === 'failed' && <Icon name="x-circle" size={20} />}
            {item.state === 'pending' && <span className="ob-pending-dot" />}
          </span>
          <span className="ob-checkitem-text">
            <span className="t-body-m">{item.label}</span>
            <span className="t-caption">{item.detail ?? CAPTION[item.state]}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
