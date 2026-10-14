'use client';

import { useMemo, useState } from 'react';
import { AppShell } from '../shell/AppShell.tsx';
import { Button } from '../product/Button.tsx';
import { IconButton } from '../product/IconButton.tsx';
import { StatusPill } from '../product/StatusPill.tsx';
import { Banner } from '../ui/Banner.tsx';
import { Icon } from '../ui/Icon.tsx';
import { PageHeader } from '../home/parts.tsx';
import { ScanFinding } from '../onboarding/ScanFinding.tsx';
import { Select } from '../settings/controls.tsx';
import { sidebarChanges } from '../workspace/scenario.ts';
import { EVENTS, FILTERS, type ActivityEvent, type Kind } from './data.ts';

export type ActivityState = 'feed' | 'loading' | 'empty' | 'error' | 'offline';

type Props = {
  state?: ActivityState;
  scope?: 'site' | 'all';
  initialFilter?: Kind | 'all';
  initialQuery?: string;
  initialOpen?: string;
  onAskForChange?: (() => void) | undefined;
};

const RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days'];
const SITE_OPTIONS = ['All 7 sites', 'Northline Studio', 'Kestrel Coffee', 'Harbor Bakery', 'Ridgeway Dental', 'Greenfield Florist', 'Oyelaran Law', 'Atlas Bikes'];

function DayHeader({ label }: { label: string }) {
  return (
    <div className="act-dayheader">
      <h2>{label}</h2>
      <span aria-hidden="true" />
    </div>
  );
}

function EmptyCard({ title, text, action, onAction }: { title: string; text: string; action: string; onAction?: (() => void) | undefined }) {
  return (
    <div className="act-empty">
      <span className="act-empty-tile" aria-hidden="true">
        <Icon name="sparkles" size={20} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      <Button variant="secondary" size="md" onClick={onAction}>
        {action}
      </Button>
    </div>
  );
}

function ProofDrawer({ event, onClose }: { event: ActivityEvent; onClose: () => void }) {
  const published = event.kind === 'published' && event.id === 'pub1';
  return (
    <aside aria-label="Proof" className="act-drawer">
      <div className="act-drawer-head">
        <h2>{event.text}</h2>
        <IconButton icon="x" label="Close" onClick={onClose} />
      </div>
      {published && <StatusPill status="live" />}
      <p className="act-drawer-meta">{published ? 'Contact page and footer · 9:41 AM today · Everyday risk' : `${event.day} · ${event.time}`}</p>
      <p className="act-drawer-section">Who and when</p>
      <div className="app-rows">
        <div className="app-settingrow">
          <div className="app-settingrow-text">
            <p>Asked by</p>
            <p>Amara Okoye · 9:12</p>
          </div>
        </div>
        <div className="app-settingrow">
          <div className="app-settingrow-text">
            <p>Approved by</p>
            <p>Amara Okoye · 9:33</p>
          </div>
        </div>
        <div className="app-settingrow">
          <div className="app-settingrow-text">
            <p>Published</p>
            <p>9:41 AM, to harborbakery.com</p>
          </div>
        </div>
      </div>
      {published && (
        <>
          <p className="act-drawer-section">Checks</p>
          <div className="act-drawer-checks">
            <ScanFinding icon="file" title="Links still work" detail="All 48 links answered" state="done" value="Pass" />
            <ScanFinding icon="file" title="Mobile layout unchanged" detail="Compared 3 screen sizes" state="done" value="Pass" />
            <ScanFinding icon="file" title="No new errors" detail="Watched for 10 minutes" state="done" value="Pass" />
          </div>
          <p className="act-drawer-section">Evidence</p>
          <p className="act-drawer-hash">Safe copy a91f…c3e2 · Plan 7b20…19d4</p>
        </>
      )}
      <span className="p-spacer" />
      <div className="act-drawer-actions">
        <Button variant="secondary" size="md">
          Undo this change
        </Button>
        <Button variant="primary" size="md">
          Open proof
        </Button>
      </div>
    </aside>
  );
}

/** Activity: everything Wursor did, by day, with the proof behind each line (Figma AC1 to AC9). */
export function ActivityScreen({ state = 'feed', scope = 'site', initialFilter = 'all', initialQuery = '', initialOpen, onAskForChange }: Props) {
  const [filter, setFilter] = useState<Kind | 'all'>(initialFilter);
  const [query, setQuery] = useState(initialQuery);
  const [range, setRange] = useState('Last 30 days');
  const [site, setSite] = useState('All 7 sites');
  const [open, setOpen] = useState<string | null>(initialOpen ?? null);

  const q = query.trim().toLowerCase();
  const shown = useMemo(
    () => EVENTS.filter((e) => (filter === 'all' ? !e.quiet : e.kind === filter)).filter((e) => q === '' || e.text.toLowerCase().includes(q) || (scope === 'all' && e.site.toLowerCase().includes(q))),
    [filter, q, scope],
  );
  const days = [...new Set(shown.map((e) => e.day))];
  const selected = EVENTS.find((e) => e.id === open);
  const sub = scope === 'all' ? 'Everything Wursor did across your 7 sites, with proof.' : 'Everything Wursor did on Harbor Bakery, with proof.';
  const label = (e: ActivityEvent) => (scope === 'all' ? `${e.site} · ${e.text}` : e.text);

  return (
    <AppShell active="activity" changes={sidebarChanges('working')}>
      <PageHeader title="Activity" sub={sub} />
      <div className="act-stack">
      {state !== 'empty' && (
        <div className="act-filters">
          <div className="act-chips">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" className="app-filter" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
          <span className="p-spacer" />
          <label className="p-search act-search">
            <Icon name="search" size={16} />
            <input type="search" aria-label="Search activity" placeholder="Search activity" className="p-search-input" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          {scope === 'all' ? (
            <Select label="Site" options={SITE_OPTIONS} value={site} onChange={setSite} narrow />
          ) : (
            <Select label="Time range" options={RANGES} value={range} onChange={setRange} narrow />
          )}
        </div>
      )}

      {state === 'empty' && <EmptyCard title="No activity yet" text="Everything Wursor does on this site shows up here: changes, checks, safe copies and approvals. Ask for your first change to start." action="Ask for a change" onAction={onAskForChange} />}

      {state === 'loading' && (
        <div className="act-day">
          <DayHeader label="Today" />
          <div role="status" aria-label="Loading activity" className="act-skeleton">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i}>
                <span />
                <span />
                <span />
              </div>
            ))}
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="act-day">
          <DayHeader label="Today" />
          <div role="alert">
            <Banner tone="danger" action={{ label: 'Details', onClick: () => undefined }}>
              We could not load your activity. Your site is not affected. Check your connection and try again.
            </Banner>
          </div>
          <EmptyCard title="Activity did not load" text="Nothing was lost. Everything Wursor did is still recorded." action="Try again" />
        </div>
      )}

      {state === 'offline' && <Banner tone="warning">You are offline. Showing what was saved at 9:41 AM. You cannot approve or publish until you are back online.</Banner>}

      {(state === 'feed' || state === 'offline') &&
        (shown.length === 0 ? (
          <div className="act-day">
            <DayHeader label="Today" />
            <EmptyCard title={`Nothing matches “${query.trim()}”`} text="Try another word, a different filter, or a longer time range." action="Clear search" onAction={() => setQuery('')} />
          </div>
        ) : (
          <>
            {days.map((day) => (
              <div key={day} className="act-day">
                <DayHeader label={day} />
                <ul className="app-log">
                  {shown
                    .filter((e) => e.day === day)
                    .map((e) => (
                      <li key={e.id}>
                        <button type="button" className="app-logrow act-row" onClick={() => setOpen(e.id)}>
                          <span className="app-logrow-icon" data-tone={e.tone} aria-hidden="true">
                            <Icon name={e.icon} size={20} />
                          </span>
                          <span className="app-logrow-text">{label(e)}</span>
                          <span className="app-logrow-trailing">{e.time}</span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
            <div className="act-more">
              <Button variant="secondary" size="md">
                Load earlier activity
              </Button>
            </div>
          </>
        ))}
      </div>
      {selected && <ProofDrawer event={selected} onClose={() => setOpen(null)} />}
    </AppShell>
  );
}
