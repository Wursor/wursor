import type { ReactNode } from 'react';
import { HARBOR } from '../product/harbor-bakery.ts';
import { Sidebar } from '../product/Sidebar.tsx';
import type { Status } from '../product/StatusPill.tsx';
import { TopBar } from '../product/TopBar.tsx';
import { MobileTopBar } from '../workspace/MobileTopBar.tsx';
import { BottomNav, type Place } from './BottomNav.tsx';

const HREFS = { Home: '/home', Board: '/board', Activity: '/activity', Sites: '/sites' } as const;
const LABEL = { home: 'Home', board: 'Board', activity: 'Activity', sites: 'Sites' } as const;

type Change = { title: string; status: Status; active?: boolean };
type Props = {
  /** The place the owner is in. Settings and the like are "more" on a phone and have no sidebar entry. */
  active?: Place;
  /** The sidebar's list of changes. Empty on the first run. */
  changes?: readonly Change[];
  children: ReactNode;
};

/** The frame around every screen that is not the workspace: top bar, sidebar, a scrolling main area, and the phone's bottom tabs. */
export function AppShell({ active, changes = [], children }: Props) {
  const place = active && active !== 'more' ? LABEL[active] : undefined;
  return (
    <div className="ws app" data-wide="true">
      <TopBar site={HARBOR.site.name} siteInitial={HARBOR.site.initial} autonomy={HARBOR.autonomy} account={HARBOR.account} />
      <MobileTopBar site={HARBOR.site.name} siteInitial={HARBOR.site.initial} />
      <div className="ws-body">
        <Sidebar changes={changes} account={HARBOR.account} hrefs={HREFS} {...(place ? { active: place } : {})} />
        <main className="app-main">
          <div className="app-content">{children}</div>
        </main>
      </div>
      <BottomNav active={active} />
    </div>
  );
}
