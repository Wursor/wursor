import { AppShell } from '../shell/AppShell.tsx';
import { HARBOR } from '../product/harbor-bakery.ts';
import { Icon, type IconName } from '../ui/Icon.tsx';

type Row = { label: string; icon: IconName; href: string; tone?: 'danger' };
const GROUPS: ReadonlyArray<ReadonlyArray<Row>> = [
  [
    { label: 'Settings', icon: 'sliders', href: '/settings' },
    { label: 'Team', icon: 'user', href: '/settings/team' },
    { label: 'Billing', icon: 'credit-card', href: '/settings/billing' },
    { label: 'Notifications', icon: 'bell', href: '/settings/notifications' },
    { label: 'Safety and approvals', icon: 'shield-check', href: '/settings/safety' },
  ],
  [
    { label: 'Help and docs', icon: 'help', href: '/help' },
    { label: 'What is new', icon: 'sparkles', href: '/whats-new' },
    { label: 'Contact support', icon: 'mail', href: '/support' },
  ],
  [{ label: 'Sign out', icon: 'arrow-right', href: '/signin', tone: 'danger' }],
];

/** The phone's fifth tab (Figma N1): who you are, then everything that is not a place. */
export function MoreScreen() {
  const a = HARBOR.account;
  return (
    <AppShell active="more">
      <div className="mb-more">
        <h1>More</h1>
        <div className="mb-card mb-account">
          <span className="mb-avatar" aria-hidden="true">
            {a.initials}
          </span>
          <span className="mb-account-text">
            <span>{a.name}</span>
            <span>
              {a.role} · {HARBOR.site.name}
            </span>
          </span>
        </div>
        {GROUPS.map((g, i) => (
          <ul key={i} className="mb-card mb-list">
            {g.map((r) => (
              <li key={r.label}>
                <a href={r.href} data-tone={r.tone}>
                  <Icon name={r.icon} size={20} />
                  <span>{r.label}</span>
                  {!r.tone && <Icon name="chevron-right" size={20} />}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </AppShell>
  );
}
