import { Icon, type IconName } from '../ui/Icon.tsx';
import { Avatar } from './Avatar.tsx';
import type { Status } from './StatusPill.tsx';

const DEFAULT_HREFS = { Home: '/home', Board: '/board', Activity: '/activity', Sites: '/sites' } as const;

type Change = { title: string; status: Status; active?: boolean };
type Props = {
  changes: readonly Change[];
  account: { initials: string; name: string; role: string };
  /** Where each place goes. Defaults to in-page anchors so a mockup has no real links. */
  hrefs?: Partial<Record<'Home' | 'Board' | 'Activity' | 'Sites', string>>;
  /** The place the owner is in, marked with aria-current. */
  active?: 'Home' | 'Board' | 'Activity' | 'Sites';
};

const PLACES: ReadonlyArray<{ label: 'Home' | 'Board' | 'Activity' | 'Sites'; icon: IconName }> = [
  { label: 'Home', icon: 'home' },
  { label: 'Board', icon: 'board' },
  { label: 'Activity', icon: 'activity' },
  { label: 'Sites', icon: 'globe' },
];

export function Sidebar({ changes, account, hrefs = {}, active }: Props) {
  return (
    <aside className="p-sidebar">
      <nav aria-label="Workspace" className="p-sidebar-nav">
        {PLACES.map((p) => (
          <a key={p.label} href={hrefs[p.label] ?? DEFAULT_HREFS[p.label]} className="p-navitem" aria-current={active === p.label ? 'page' : undefined}>
            <Icon name={p.icon} size={18} />
            <span>{p.label}</span>
          </a>
        ))}
      </nav>
      <div className="p-sidebar-changes-header">
        <span className="t-overline">Changes</span>
        <a href="/workspace" aria-label="New change" className="p-iconbtn p-iconbtn-ghost p-iconbtn-sm">
          <Icon name="plus" size={16} />
        </a>
      </div>
      {changes.length > 0 && (
      <ul aria-label="Changes" className="p-changelist">
        {changes.map((c) => (
          <li key={c.title} className="p-changeitem" aria-current={c.active ? 'true' : undefined} data-status={c.status}>
            <span className="p-statusdot" aria-hidden="true" />
            <a href="/workspace" className="p-changeitem-title">
              {c.title}
            </a>
          </li>
        ))}
      </ul>
      )}
      <span className="p-spacer" />
      <div className="p-account">
        <Avatar kind="initials" initials={account.initials} name={account.name} size="md" />
        <div className="p-account-text">
          <p>{account.name}</p>
          <p>{account.role}</p>
        </div>
        <a href="/settings" aria-label="Account settings" className="p-iconbtn p-iconbtn-ghost p-iconbtn-sm">
          <Icon name="sliders" size={16} />
        </a>
      </div>
    </aside>
  );
}
