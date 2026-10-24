import { Icon, type IconName } from '../ui/Icon.tsx';

export type Place = 'home' | 'board' | 'activity' | 'sites' | 'more';
const TABS: ReadonlyArray<{ place: Place; label: string; icon: IconName; href: string }> = [
  { place: 'home', label: 'Home', icon: 'home', href: '/home' },
  { place: 'board', label: 'Board', icon: 'board', href: '/board' },
  { place: 'activity', label: 'Activity', icon: 'activity', href: '/activity' },
  { place: 'sites', label: 'Sites', icon: 'globe', href: '/sites' },
  { place: 'more', label: 'More', icon: 'dots', href: '/more' },
];

/** The phone's bottom tabs: the four places and More. The current one is darker, with a dot under it. */
export function BottomNav({ active }: { active?: Place | undefined }) {
  return (
    <nav aria-label="Main" className="app-tabs">
      {TABS.map((t) => (
        <a key={t.place} href={t.href} className="app-tab" aria-current={active === t.place ? 'page' : undefined}>
          <Icon name={t.icon} size={20} />
          <span>{t.label}</span>
          <i aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
