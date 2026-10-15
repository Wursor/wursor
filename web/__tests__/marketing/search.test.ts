import { describe, expect, it } from 'vitest';
import { SEARCH_ENTRIES, isPaletteShortcut, searchEntries, shortcutLabel, type SearchEntry } from '../../src/marketing/search.ts';

const entry = (id: string, title: string, description = '', group: SearchEntry['group'] = 'Page'): SearchEntry => ({
  id, title, description, group, href: `/${id}`,
});

describe('searchEntries', () => {
  const entries = [
    entry('a', 'Pricing', 'Plans for every size'),
    entry('b', 'Review and approve', 'Compare before and after, then publish', 'Docs topic'),
    entry('c', 'Trust', 'We never publish without approval'),
  ];

  it('shows the pages when nothing has been typed', () => {
    expect(searchEntries('', entries).map((e) => e.id)).toEqual(['a', 'c']);
  });

  it('ignores case and surrounding spaces', () => {
    expect(searchEntries('  PRICING ', entries).map((e) => e.id)).toEqual(['a']);
  });

  it('finds an entry by its description', () => {
    expect(searchEntries('compare', entries).map((e) => e.id)).toEqual(['b']);
  });

  it('needs every word to match', () => {
    expect(searchEntries('pricing banana', entries)).toEqual([]);
  });

  it('puts title matches before description-only matches', () => {
    expect(searchEntries('approv', entries).map((e) => e.id)).toEqual(['b', 'c']);
  });

  it('puts titles that start with the query first', () => {
    const list = [entry('x', 'Undo a change'), entry('y', 'How to undo')];
    expect(searchEntries('undo', list).map((e) => e.id)).toEqual(['x', 'y']);
  });
});

describe('SEARCH_ENTRIES', () => {
  it('only holds results that go somewhere', () => {
    expect(SEARCH_ENTRIES.length).toBeGreaterThan(0);
    for (const e of SEARCH_ENTRIES) expect(e.href).toMatch(/^\//);
  });

  it('has unique ids', () => {
    const ids = SEARCH_ENTRIES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('lists every navigation page', () => {
    const titles = searchEntries('').map((e) => e.title);
    expect(titles).toEqual(expect.arrayContaining(['Product', 'How it works', 'Trust and safety', 'Pricing', 'Docs']));
  });

  it('finds a docs topic by what it covers', () => {
    expect(searchEntries('invite').map((e) => e.title)).toContain('Team and billing');
  });
});

describe('isPaletteShortcut', () => {
  const key = (k: string, mods: { metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean } = {}) =>
    isPaletteShortcut({ key: k, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, ...mods });

  it('accepts Cmd+K and Ctrl+K', () => {
    expect(key('k', { metaKey: true })).toBe(true);
    expect(key('k', { ctrlKey: true })).toBe(true);
  });

  it('accepts a capital K (Caps Lock)', () => {
    expect(key('K', { metaKey: true })).toBe(true);
  });

  it('rejects K alone, other letters, and extra modifiers', () => {
    expect(key('k')).toBe(false);
    expect(key('j', { metaKey: true })).toBe(false);
    expect(key('k', { metaKey: true, shiftKey: true })).toBe(false);
    expect(key('k', { ctrlKey: true, altKey: true })).toBe(false);
  });
});

describe('shortcutLabel', () => {
  it('shows the Command symbol on Apple devices and Ctrl elsewhere', () => {
    expect(shortcutLabel(true)).toBe('⌘K');
    expect(shortcutLabel(false)).toBe('Ctrl K');
  });
});
