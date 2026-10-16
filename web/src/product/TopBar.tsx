'use client';

import { useFeedback } from '../system/Feedback.tsx';
import { Icon } from '../ui/Icon.tsx';
import { Avatar } from './Avatar.tsx';
import { ModeMenu } from './ModeMenu.tsx';
import { IconButton } from './IconButton.tsx';
import { StatusPill, type Status } from './StatusPill.tsx';

type Props = {
  site: string;
  siteInitial: string;
  change?: string;
  status?: Status;
  autonomy: string;
  account: { initials: string; name: string };
  onToggleSidebar?: (() => void) | undefined;
  onSearch?: (() => void) | undefined;
  onSite?: (() => void) | undefined;
  onNotifications?: (() => void) | undefined;
};

/** Workspace top bar (48 px): sidebar toggle, site switcher, the current change and its status, autonomy, search, notifications, account. */
export function TopBar({ site, siteInitial, change, status, autonomy, account, onToggleSidebar, onSearch, onSite, onNotifications }: Props) {
  const { notify } = useFeedback();
  return (
    <header className="p-topbar">
      <IconButton icon="sidebar" label="Toggle sidebar" onClick={onToggleSidebar} />
      <button type="button" className="p-site-switcher" onClick={onSite ?? (() => notify(`${site} is your only site right now.`, 'info'))}>
        <span className="p-favicon" aria-hidden="true">
          {siteInitial}
        </span>
        <span>{site}</span>
        <Icon name="chevron-down" size={20} />
      </button>
      <span className="p-spacer" />
      {change && status && (
        <div className="p-topbar-change">
          <span className="p-topbar-change-title">{change}</span>
          <StatusPill status={status} />
        </div>
      )}
      <span className="p-spacer" />
      <ModeMenu mode={autonomy} />
      <IconButton icon="search" label="Search" onClick={onSearch} />
      <IconButton icon="bell" label="Notifications" onClick={onNotifications ?? (() => notify("You're all caught up.", 'info'))} />
      <Avatar kind="initials" initials={account.initials} name={account.name} />
    </header>
  );
}
