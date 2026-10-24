import type { IconName } from '../ui/Icon.tsx';

export type Group = 'ask' | 'needs-you' | 'actions' | 'navigate' | 'changes' | 'help';
export type Item = {
  id: string;
  group: Group;
  label: string;
  meta?: string;
  icon: IconName;
  kbd?: string;
  /** Where the item goes. Items without one are actions the screen handles. */
  href?: string;
  /** Shown when the box is empty. */
  initial?: boolean;
  keywords?: string;
};

export const GROUP_LABEL: Record<Group, string> = { ask: 'Ask', 'needs-you': 'Needs you', actions: 'Actions', navigate: 'Navigate', changes: 'Changes', help: 'Help' };
const ORDER: Group[] = ['ask', 'needs-you', 'actions', 'navigate', 'changes', 'help'];

export const CATALOG: Item[] = [
  { id: 'hours', group: 'needs-you', label: 'Update opening hours', meta: 'Ready for you · Home page', icon: 'check-circle', initial: true, href: '/workspace?phase=ready' },
  { id: 'images', group: 'needs-you', label: 'Describe 3 images', meta: 'Suggested · Gallery', icon: 'sparkles', initial: true, href: '/workspace?phase=plan' },
  { id: 'new', group: 'actions', label: 'New change', icon: 'plus', kbd: '⌘N', initial: true, href: '/workspace' },
  { id: 'approve', group: 'actions', label: 'Approve and publish', meta: 'Update opening hours', icon: 'check', kbd: '⌘↵', initial: true, href: '/workspace?phase=ready', keywords: 'publish' },
  { id: 'undo', group: 'actions', label: 'Undo the last change', icon: 'undo', initial: true, keywords: 'publish revert' },
  { id: 'pause', group: 'actions', label: 'Pause all work', icon: 'pause', initial: true },
  { id: 'move-out', group: 'actions', label: 'Move this site to my own WordPress', icon: 'swap', initial: true, href: '/sites/harbor-bakery?tab=where&host=cloud' },
  { id: 'move-in', group: 'actions', label: 'Host this site on Wursor Cloud', icon: 'swap', initial: true, href: '/sites/harbor-bakery?tab=where&host=content' },
  { id: 'home', group: 'navigate', label: 'Home', icon: 'home', initial: true, href: '/home' },
  { id: 'sites', group: 'navigate', label: 'Sites', icon: 'globe', initial: true, href: '/sites' },
  { id: 'board', group: 'navigate', label: 'Board', icon: 'board', kbd: '⌘J', initial: true, href: '/board' },
  { id: 'activity', group: 'navigate', label: 'Activity', meta: 'Published changes', icon: 'activity', href: '/activity' },
  { id: 'settings', group: 'navigate', label: 'Settings', meta: 'Safety, team, billing', icon: 'sliders', href: '/settings' },
  { id: 'help-publish', group: 'help', label: 'Publishing and undo', meta: 'Documentation', icon: 'file', href: '/docs' },
  { id: 'help-new', group: 'help', label: 'What is new', meta: 'Release notes', icon: 'sparkles', href: '/docs', keywords: 'publishing releases' },
];

export const CHANGES: Item[] = [
  { id: 'change-phone', group: 'changes', label: 'Make phone number tappable', meta: 'Contact page · 1 min ago', icon: 'pencil', href: '/workspace?phase=working' },
  { id: 'change-hours', group: 'changes', label: 'Update opening hours', meta: 'Home page · yesterday', icon: 'pencil', href: '/workspace?phase=needs-you' },
];

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** What the palette lists for what was typed: the usual places and actions, a match, or an offer to ask Wursor. */
export function search(query: string): Item[] {
  const q = query.trim();
  if (q === '') return CATALOG.filter((i) => i.initial);
  if (q.split(/\s+/).length >= 3) {
    const ask: Item = { id: 'ask', group: 'ask', label: `Ask Wursor to ${lowerFirst(q)}`, icon: 'sparkles' };
    return [ask, ...CHANGES];
  }
  const tokens = q.toLowerCase().split(/\s+/);
  const hit = (i: Item) => {
    const hay = `${i.label} ${i.meta ?? ''} ${i.keywords ?? ''}`.toLowerCase();
    return tokens.every((t) => hay.includes(t));
  };
  return [...CATALOG, ...CHANGES].filter(hit).sort((a, b) => ORDER.indexOf(a.group) - ORDER.indexOf(b.group));
}
