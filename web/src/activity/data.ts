import type { IconName } from '../ui/Icon.tsx';

export type Kind = 'published' | 'checks' | 'copies' | 'moves' | 'decisions';
export type ActivityEvent = {
  id: string;
  day: string;
  time: string;
  text: string;
  icon: IconName;
  kind: Kind;
  tone?: 'success';
  /** Routine events the full feed leaves out; they show when their kind is chosen. */
  quiet?: boolean;
  site: string;
};

const SITES = ['Northline Studio', 'Kestrel Coffee', 'Harbor Bakery', 'Ridgeway Dental', 'Greenfield Florist'];

const raw: Omit<ActivityEvent, 'site'>[] = [
  { id: 'pub1', day: 'Today', time: '9:41', text: 'Published “Make phone number tappable”', icon: 'rocket', kind: 'published', tone: 'success' },
  { id: 'chk1', day: 'Today', time: '9:38', text: 'Checked 9 things. All passed.', icon: 'shield-check', kind: 'checks' },
  { id: 'chg1', day: 'Today', time: '9:36', text: 'Changed the Contact page and footer', icon: 'pencil', kind: 'published' },
  { id: 'cpy1', day: 'Today', time: '9:34', text: 'Took a safe copy of your site', icon: 'camera', kind: 'copies' },
  { id: 'dec1', day: 'Today', time: '9:33', text: 'Amara approved “Make phone number tappable”', icon: 'check-circle', kind: 'decisions', tone: 'success' },
  { id: 'chk2', day: 'Today', time: '8:12', text: 'Checked “Update opening hours” plan. 2 things to confirm.', icon: 'shield-check', kind: 'checks', quiet: true },
  { id: 'pub2', day: 'Yesterday', time: 'Yesterday', text: 'Published “Update Saturday hours”', icon: 'rocket', kind: 'published', tone: 'success' },
  { id: 'und1', day: 'Yesterday', time: 'Yesterday', text: 'Undid “Add menu PDF”, restored the safe copy from 4:02 PM', icon: 'undo', kind: 'copies', tone: 'success' },
  { id: 'chk3', day: 'Yesterday', time: 'Yesterday', text: 'Checked 9 things. 1 needs a look.', icon: 'shield-check', kind: 'checks' },
  { id: 'chk4', day: 'Yesterday', time: 'Yesterday', text: 'Watching for errors. All clear.', icon: 'shield-check', kind: 'checks', quiet: true },
  { id: 'mov1', day: 'Monday 5 Oct', time: 'Mon 5 Oct', text: 'Connected harborbakery.com to Wursor Cloud', icon: 'cloud', kind: 'moves', tone: 'success' },
  { id: 'mov2', day: 'Monday 5 Oct', time: 'Mon 5 Oct', text: 'Moved Harbor Bakery to Wursor Cloud', icon: 'swap', kind: 'moves', tone: 'success' },
];

/** What Wursor has done, newest first. `site` is who it was done on, shown when looking across every site. */
export const EVENTS: ActivityEvent[] = raw.map((e, i) => ({ ...e, site: SITES[i % SITES.length]! }));

export const FILTERS: ReadonlyArray<{ id: Kind | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'checks', label: 'Checks' },
  { id: 'copies', label: 'Safe copies' },
  { id: 'moves', label: 'Moves' },
  { id: 'decisions', label: 'Decisions' },
];
