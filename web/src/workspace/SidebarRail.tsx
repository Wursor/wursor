import { Avatar } from '../product/Avatar.tsx';
import { Icon, type IconName } from '../ui/Icon.tsx';

const PLACES: ReadonlyArray<{ label: 'Home' | 'Board' | 'Activity' | 'Sites'; icon: IconName }> = [
  { label: 'Home', icon: 'home' },
  { label: 'Board', icon: 'board' },
  { label: 'Activity', icon: 'activity' },
  { label: 'Sites', icon: 'globe' },
];

const DEFAULT_HREFS = { Home: '/home', Board: '/board', Activity: '/activity', Sites: '/sites' } as const;

type Props = {
  account: { initials: string; name: string };
  hrefs?: Partial<Record<'Home' | 'Board' | 'Activity' | 'Sites', string>>;
};

/** The sidebar at 56 px: icons only. Used when the What changed drawer is open. */
export function SidebarRail({ account, hrefs = {} }: Props) {
  return (
    <aside className="p-rail" aria-label="Workspace">
      <nav aria-label="Places" className="p-rail-nav">
        {PLACES.map((p) => (
          <a key={p.label} href={hrefs[p.label] ?? DEFAULT_HREFS[p.label]} aria-label={p.label} className="p-iconbtn p-iconbtn-md p-iconbtn-ghost">
            <Icon name={p.icon} size={16} />
          </a>
        ))}
      </nav>
      <span className="p-rail-rule" aria-hidden="true" />
      <a href="/board" aria-label="Changes" className="p-iconbtn p-iconbtn-md p-iconbtn-ghost">
        <Icon name="list" size={16} />
      </a>
      <a href="/workspace" aria-label="New change" className="p-iconbtn p-iconbtn-md p-iconbtn-ghost">
        <Icon name="plus" size={16} />
      </a>
      <span className="p-spacer" />
      <Avatar kind="initials" initials={account.initials} name={account.name} size="md" />
    </aside>
  );
}
