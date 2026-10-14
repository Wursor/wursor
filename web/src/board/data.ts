import type { RiskLevel } from '../product/RiskChip.tsx';
import type { Status } from '../product/StatusPill.tsx';

export type LaneId = 'idea' | 'plan-ready' | 'working' | 'needs-you' | 'ready' | 'done';
export const LANES: ReadonlyArray<{ id: LaneId; title: string; status: Status }> = [
  { id: 'idea', title: 'Idea', status: 'idea' },
  { id: 'plan-ready', title: 'Plan ready', status: 'plan-ready' },
  { id: 'working', title: 'Working', status: 'working' },
  { id: 'needs-you', title: 'Needs you', status: 'needs-you' },
  { id: 'ready', title: 'Ready for you', status: 'ready' },
  { id: 'done', title: 'Done', status: 'done' },
];

export type Change = {
  id: string;
  title: string;
  /** The page it touches and when, for example "Footer · Suggested". */
  meta: string;
  lane: LaneId;
  risk: RiskLevel;
  /** Shown in the list view's last column. */
  when: string;
  page: string;
  /** Asked for by the owner, as opposed to suggested by Wursor. */
  mine: boolean;
  progress?: number;
  /** The day it sits on in the calendar, as a day of October 2026. */
  day?: number;
  site?: string;
};

export const CHANGES: Change[] = [
  { id: 'sunday', title: 'Add Sunday hours to the footer', meta: 'Footer · Suggested', lane: 'idea', risk: 'everyday', when: 'Suggested', page: 'Footer', mine: false, day: 17 },
  { id: 'images', title: 'Describe 3 images', meta: 'Gallery · Suggested', lane: 'idea', risk: 'everyday', when: 'Suggested', page: 'Gallery', mine: false, day: 12 },
  { id: 'menu', title: 'Make the menu easier to read on a phone', meta: 'Menu · Suggested', lane: 'idea', risk: 'everyday', when: 'Suggested', page: 'Menu', mine: false, day: 20 },
  { id: 'footer', title: 'Refresh footer links', meta: 'Footer · 3 min ago', lane: 'plan-ready', risk: 'everyday', when: '3 min ago', page: 'Footer', mine: true, day: 15 },
  { id: 'phone', title: 'Make phone number tappable', meta: 'Contact page · 2 min ago', lane: 'working', risk: 'everyday', when: '2 min ago', page: 'Contact page', mine: true, progress: 0.42, day: 14 },
  { id: 'hours', title: 'Update opening hours', meta: 'Home page · 1 hour ago', lane: 'needs-you', risk: 'noticeable', when: '1 hour ago', page: 'Home page', mine: true, day: 14 },
  { id: 'order', title: 'Fix broken order link', meta: 'Order page · 12 min ago', lane: 'ready', risk: 'everyday', when: '12 min ago', page: 'Order page', mine: true, day: 13 },
  { id: 'saturday', title: 'Update Saturday hours', meta: 'Home page · Yesterday', lane: 'done', risk: 'everyday', when: 'Yesterday', page: 'Home page', mine: true, day: 10 },
  { id: 'pdf', title: 'Add menu PDF', meta: 'Menu · Mon', lane: 'done', risk: 'everyday', when: 'Mon', page: 'Menu', mine: true, day: 8 },
];

/** Changes that appear on the calendar but not on the board's lanes (scheduled checks). */
export const SCHEDULED = [{ id: 'speed', title: 'Check page speed', day: 22 }];

/** Every site, one row each (Figma BD7). */
export const SITE_ROWS: ReadonlyArray<{ site: string; initial: string; cards: ReadonlyArray<{ id: string; title: string; lane: LaneId; progress?: number }> }> = [
  { site: 'Harbor Bakery', initial: 'H', cards: [{ id: 'a1', title: 'Add Sunday hours', lane: 'idea' }, { id: 'a2', title: 'Make phone number tappable', lane: 'working', progress: 0.42 }, { id: 'a3', title: 'Update opening hours', lane: 'needs-you' }] },
  { site: 'Lumen Studio', initial: 'L', cards: [{ id: 'b1', title: 'Refresh footer links', lane: 'plan-ready' }, { id: 'b2', title: 'Fix broken order link', lane: 'ready' }] },
  { site: 'North Fork Dental', initial: 'N', cards: [{ id: 'c1', title: 'Compress home page images', lane: 'working', progress: 0.42 }, { id: 'c2', title: 'Add new patient form', lane: 'needs-you' }, { id: 'c3', title: 'Update team photos', lane: 'done' }] },
  { site: 'Bright Path Tutors', initial: 'B', cards: [{ id: 'd1', title: 'Add FAQ page', lane: 'idea' }] },
];

export const LIST_ORDER: LaneId[] = ['needs-you', 'ready', 'working', 'plan-ready', 'idea', 'done'];
