import { ARTICLES, DOCS_TOPICS, NAV_LINKS, ROUTES } from './content.ts';

export type SearchGroup = 'Page' | 'Docs topic' | 'Article';

export type SearchEntry = {
  id: string;
  title: string;
  description?: string;
  group: SearchGroup;
  href: string;
};

/**
 * Everything the site search can open. Built from the same content the pages use, so it cannot drift.
 * Only things with a destination are listed: an article that has no page yet would be a dead end.
 */
export const SEARCH_ENTRIES: readonly SearchEntry[] = [
  { id: 'home', title: 'Home', description: 'Your website, handled.', group: 'Page', href: '/' },
  ...NAV_LINKS.map((l): SearchEntry => ({
    id: l.href.slice(1),
    title: l.mobileLabel ?? l.label,
    group: 'Page',
    href: l.href,
  })),
  { id: 'signup', title: 'Get started', description: 'Create your account.', group: 'Page', href: ROUTES.signUp },
  { id: 'signin', title: 'Sign in', description: 'Back to your sites.', group: 'Page', href: ROUTES.signIn },
  ...DOCS_TOPICS.map((t): SearchEntry => ({
    id: `topic-${t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title: t.title,
    description: t.body,
    group: 'Docs topic',
    href: '/docs',
  })),
  ...ARTICLES.flatMap((a): SearchEntry[] =>
    a.href ? [{ id: `article-${a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, title: a.title, group: 'Article', href: a.href }] : [],
  ),
];

/**
 * Entries matching every word of the query, best first: titles that start with it, then titles that
 * contain it, then description-only matches. With nothing typed, the pages are the suggestions.
 */
export function searchEntries(query: string, entries: readonly SearchEntry[] = SEARCH_ENTRIES): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return entries.filter((e) => e.group === 'Page');
  const words = q.split(/\s+/);
  return entries
    .map((e, index) => ({ e, index, title: e.title.toLowerCase(), text: `${e.title} ${e.description ?? ''}`.toLowerCase() }))
    .filter(({ text }) => words.every((w) => text.includes(w)))
    .sort((a, b) => rank(a.title, q) - rank(b.title, q) || a.index - b.index)
    .map(({ e }) => e);
}

const rank = (title: string, q: string) => (title.startsWith(q) ? 0 : title.includes(q) ? 1 : 2);

type KeyLike = Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey'>;

/** Cmd+K or Ctrl+K, and nothing extra held. */
export function isPaletteShortcut(e: KeyLike): boolean {
  return e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey;
}

export const shortcutLabel = (apple: boolean) => (apple ? '⌘K' : 'Ctrl K');

export function isApplePlatform(): boolean {
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}
