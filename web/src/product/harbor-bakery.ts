import type { Status } from './StatusPill.tsx';

/** Harbor Bakery: the fictional example site used for every mockup. Real previews replace this at build time. */
export type BoardCardData = {
  title: string;
  meta: string;
  status: Status;
  risk?: 'everyday';
  /** 0 to 1, shown on a working change. */
  progress?: number;
};
export type BoardLaneData = { status: Status; title: string; cards: BoardCardData[] };

export const HARBOR = {
  site: { name: 'Harbor Bakery', initial: 'H', url: 'harborbakery.com/contact' },
  account: { initials: 'AO', name: 'Amara Okoye', role: 'Owner' },
  autonomy: 'Ask first',
  change: { title: 'Make phone number tappable', status: 'working' as Status },
  changes: [
    { title: 'Make phone number tappable', status: 'working' as Status, active: true },
    { title: 'Update opening hours', status: 'needs-you' as Status },
    { title: 'Describe 3 images', status: 'idea' as Status },
    { title: 'Refresh footer links', status: 'done' as Status },
  ],
  phone: { display: '(555) 014-2290', href: 'tel:+55550142290', callLabel: 'Call (555) 014-2290' },
  board: [
    {
      status: 'needs-you',
      title: 'Needs you',
      cards: [{ title: 'Update opening hours', meta: 'Home page · 1 hour ago', status: 'needs-you' }],
    },
    {
      status: 'working',
      title: 'Working',
      cards: [
        { title: 'Make phone number tappable', meta: 'Contact page · 1 min ago', status: 'working', risk: 'everyday', progress: 0.42 },
      ],
    },
    {
      status: 'idea',
      title: 'Idea',
      cards: [{ title: 'Describe 3 images', meta: 'Home page · Suggested', status: 'idea' }],
    },
    {
      status: 'done',
      title: 'Done',
      cards: [{ title: 'Refresh footer links', meta: 'Footer · Yesterday', status: 'done' }],
    },
  ] as BoardLaneData[],
} as const;
