import type { Status } from '../product/StatusPill.tsx';

export type SiteInfo = {
  name: string;
  url: string;
  home: 'cloud' | 'wordpress';
  access: 'full' | 'content';
  status: Status;
  /** What the right of the row says: when it last changed, or what needs the owner. */
  note: string;
  group: 'attention' | 'waiting' | 'live';
};

/** The agency's sites (Figma S2). The first one with a home of "wordpress" and Full access is the owner's own Harbor Bakery in S1. */
export const SITES: SiteInfo[] = [
  { name: 'Northline Studio', url: 'northlinestudio.co', home: 'cloud', access: 'full', status: 'live', note: 'Last change · 20 min ago', group: 'live' },
  { name: 'Kestrel Coffee', url: 'kestrelcoffee.com', home: 'wordpress', access: 'full', status: 'live', note: 'Last change · 3 h ago', group: 'live' },
  { name: 'Ridgeway Dental', url: 'ridgewaydental.com', home: 'wordpress', access: 'content', status: 'needs-you', note: 'Helper needs an update', group: 'attention' },
  { name: 'Harbor Bakery', url: 'harborbakery.com', home: 'cloud', access: 'full', status: 'live', note: 'Last change · 2 h ago', group: 'live' },
  { name: 'Greenfield Florist', url: 'greenfieldflorist.shop', home: 'wordpress', access: 'full', status: 'needs-you', note: 'Question waiting for you', group: 'waiting' },
  { name: 'Oyelaran Law', url: 'northwindlaw.com', home: 'wordpress', access: 'content', status: 'live', note: 'Last change · Yesterday', group: 'live' },
  { name: 'Atlas Bikes', url: 'atlasbikes.cc', home: 'wordpress', access: 'full', status: 'stopped', note: 'Disconnected 4 days ago', group: 'attention' },
];

export const OWN_SITE: SiteInfo = { name: 'Harbor Bakery', url: 'harborbakery.com', home: 'wordpress', access: 'full', status: 'live', note: 'Last change · 2 h ago', group: 'live' };
