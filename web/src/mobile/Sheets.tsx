'use client';

import { Icon, type IconName } from '../ui/Icon.tsx';
import { Sheet } from './Sheet.tsx';

export const SITES = [
  { name: 'Harbor Bakery', url: 'harborbakery.com' },
  { name: 'Lumen Studio', url: 'lumenstudio.co' },
  { name: 'North Fork Dental', url: 'northforkdental.com' },
] as const;

/** Pick which site you are working on (Figma N2). */
export function SiteSwitcherSheet({ current, onPick, onClose }: { current: string; onPick: (name: string) => void; onClose: () => void }) {
  return (
    <Sheet title="Switch site" height={544} onClose={onClose}>
      <ul className="mb-sites">
        {SITES.map((s) => (
          <li key={s.name}>
            <button type="button" className="mb-site" aria-current={s.name === current ? 'true' : undefined} onClick={() => onPick(s.name)}>
              <span className="mb-site-mark" aria-hidden="true">
                {s.name.charAt(0)}
              </span>
              <span className="mb-site-text">
                <span>{s.name}</span>
                <span>{s.url}</span>
              </span>
              {s.name === current && <Icon name="check" size={20} />}
            </button>
          </li>
        ))}
      </ul>
      <a href="/start" className="mb-add">
        <Icon name="plus" size={16} />
        <span>Add a site</span>
      </a>
    </Sheet>
  );
}

const NOTES: ReadonlyArray<{ icon: IconName; text: string; time: string }> = [
  { icon: 'check-circle', text: 'Wursor has a question about opening hours', time: '1 hour ago' },
  { icon: 'shield-check', text: 'Ready for you: Fix broken order link', time: '12 min ago' },
  { icon: 'rocket', text: 'Published: Update Saturday hours', time: 'Yesterday' },
  { icon: 'alert-triangle', text: 'Heads up: a plugin update is waiting', time: 'Mon' },
];

/** What happened lately that needs a look (Figma N3). */
export function NotificationsSheet({ onClose }: { onClose: () => void }) {
  return (
    <Sheet title="Notifications" height={684} onClose={onClose}>
      <ul aria-label="Notifications" className="mb-notes">
        {NOTES.map((n) => (
          <li key={n.text}>
            <span className="mb-note-icon" aria-hidden="true">
              <Icon name={n.icon} size={20} />
            </span>
            <span className="mb-note-text">{n.text}</span>
            <span className="mb-note-time">{n.time}</span>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
