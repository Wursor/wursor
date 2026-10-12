import { Icon, type IconName } from '../ui/Icon.tsx';

export type ActivityKind = 'published' | 'check' | 'change' | 'safe-copy';
export type ActivityRowData = { kind: ActivityKind; text: string; time: string };

const ICON: Record<ActivityKind, IconName> = { published: 'rocket', check: 'shield-check', change: 'pencil', 'safe-copy': 'camera' };

/** A short, plain-words record of what happened to a site, newest first. */
export function ActivityCard({ rows }: { rows: readonly ActivityRowData[] }) {
  return (
    <div className="p-card">
      <ul aria-label="Activity" className="p-activity">
        {rows.map((r) => (
          <li key={r.text} className="p-activityrow" data-kind={r.kind}>
            <span className="p-activity-icon">
              <Icon name={ICON[r.kind]} size={20} />
            </span>
            <span className="p-activity-text">{r.text}</span>
            <span className="p-activity-time">{r.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
