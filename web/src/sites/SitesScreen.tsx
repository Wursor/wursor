'use client';

import { useState } from 'react';
import { AppShell } from '../shell/AppShell.tsx';
import { Button } from '../product/Button.tsx';
import { Icon } from '../ui/Icon.tsx';
import { sidebarChanges } from '../workspace/scenario.ts';
import { PageHeader, Stats } from '../home/parts.tsx';
import { OWN_SITE, SITES, type SiteInfo } from './data.ts';
import { SiteRow } from './SiteRow.tsx';

export type SitesVariant = 'one' | 'many' | 'empty';
type Filter = 'all' | 'attention' | 'waiting' | 'live';

const FILTERS: ReadonlyArray<{ id: Filter; label: (n: number) => string }> = [
  { id: 'all', label: (n) => `All ${n}` },
  { id: 'attention', label: () => 'Needs attention' },
  { id: 'waiting', label: () => 'Waiting for you' },
  { id: 'live', label: () => 'Live' },
];

const detailHref = (s: SiteInfo) => (s.name === 'Harbor Bakery' ? `/sites/harbor-bakery${s.home === 'cloud' ? '?tab=where&host=cloud' : ''}` : '/sites/harbor-bakery');

/** Sites: the one site you have, an agency's many, or none yet (Figma S1, S2, S5). */
export function SitesScreen({ variant, onAddSite }: { variant: SitesVariant; onAddSite?: (() => void) | undefined }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const add = (
    <Button variant="primary" size="md" leadingIcon="plus" onClick={onAddSite}>
      Add a site
    </Button>
  );

  if (variant === 'empty') {
    return (
      <AppShell active="sites">
        <PageHeader title="Sites" sub="The sites Wursor looks after." />
        <div className="app-bigempty">
          <Icon name="globe" size={20} />
          <h2>No sites yet</h2>
          <p>Start a site on Wursor Cloud, connect your WordPress, or build here and publish to your WordPress. Wursor takes a look, then suggests a first change.</p>
          <div>
            <Button variant="primary" size="md" leadingIcon="plus" onClick={onAddSite}>
              Add a site
            </Button>
            <Button variant="secondary" size="md">
              How it works
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (variant === 'one') {
    return (
      <AppShell active="sites" changes={sidebarChanges('working')}>
        <PageHeader title="Sites" sub="The sites Wursor looks after." action={add} />
        <ul aria-label="Sites" className="app-sitelist">
          <li>
            <SiteRow site={OWN_SITE} href="/sites/harbor-bakery" />
          </li>
        </ul>
        <div className="app-dashed">
          <Icon name="plus" size={20} />
          <h2>Looking after more than one site?</h2>
          <p>Add each client’s site and Wursor keeps their changes, safe copies and approvals separate.</p>
          <Button variant="secondary" size="md" leadingIcon="plus" onClick={onAddSite}>
            Add a site
          </Button>
        </div>
      </AppShell>
    );
  }

  const q = query.trim().toLowerCase();
  const shown = SITES.filter((s) => (filter === 'all' || s.group === filter || (filter === 'live' && s.status === 'live')) && (q === '' || s.name.toLowerCase().includes(q) || s.url.includes(q)));
  const counts: Record<Filter, number> = { all: SITES.length, attention: SITES.filter((s) => s.group === 'attention').length, waiting: SITES.filter((s) => s.group === 'waiting').length, live: SITES.filter((s) => s.status === 'live').length };

  return (
    <AppShell active="sites" changes={sidebarChanges('working')}>
      <PageHeader title="Sites" sub="7 sites across 6 clients. 2 need attention." action={add} />
      <Stats
        stats={[
          { label: 'Sites', value: '7', hint: '6 clients' },
          { label: 'Need attention', value: '2', hint: 'Helper update · Not reachable', tone: 'attention' },
          { label: 'Waiting for you', value: '3', hint: 'Across 3 sites' },
          { label: 'Published this week', value: '9', hint: 'None undone' },
        ]}
      />
      <div className="app-filters">
        <label className="p-search app-filters-search">
          <Icon name="search" size={16} />
          <input type="search" aria-label="Search sites" placeholder="Search or ask…" className="p-search-input" value={query} onChange={(e) => setQuery(e.target.value)} />
          <kbd className="p-kbd">⌘K</kbd>
        </label>
        {FILTERS.map((f) => (
          <button key={f.id} type="button" className="app-filter" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label(counts[f.id])}
          </button>
        ))}
      </div>
      <ul aria-label="Sites" className="app-sitelist">
        {shown.map((s) => (
          <li key={s.name}>
            <SiteRow site={s} href={detailHref(s)} />
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
