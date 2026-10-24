'use client';

import { useState, type DragEvent } from 'react';
import { AppShell } from '../shell/AppShell.tsx';
import { BoardCard } from '../product/BoardCard.tsx';
import { Button } from '../product/Button.tsx';
import { IconButton } from '../product/IconButton.tsx';
import { RiskChip } from '../product/RiskChip.tsx';
import { SegmentedControl } from '../product/SegmentedControl.tsx';
import { StatusPill } from '../product/StatusPill.tsx';
import { Banner } from '../ui/Banner.tsx';
import { Icon } from '../ui/Icon.tsx';
import { PageHeader } from '../home/parts.tsx';
import { useFeedback } from '../system/Feedback.tsx';
import { sidebarChanges } from '../workspace/scenario.ts';
import { ChangeDrawer } from './ChangeDrawer.tsx';
import { CHANGES, LANES, LIST_ORDER, SCHEDULED, SITE_ROWS, type Change, type LaneId } from './data.ts';
import { NewChangeDialog, type NewChange } from './NewChangeDialog.tsx';

export type BoardState = 'board' | 'empty' | 'loading' | 'offline' | 'nothing-matches';
type View = 'board' | 'list' | 'calendar';
type Filter = 'all' | 'needs-you' | 'mine';

type Props = {
  state?: BoardState;
  scope?: 'site' | 'all';
  initialView?: View;
  initialOpen?: string;
  /** Words already in the new-change box, for example a suggestion the owner picked. */
  initialText?: string;
  /** The lane a new change is added to when the box opens. */
  initialStage?: LaneId;
  /** Opens the new-change dialog straight away. */
  initialComposer?: boolean;
  /** Shows a card mid-drag, for the fixed design state. */
  dragDemo?: boolean;
  onStart?: ((change: NewChange) => void) | undefined;
};

const VIEWS = [
  { value: 'board', label: 'Board' },
  { value: 'list', label: 'List' },
  { value: 'calendar', label: 'Calendar' },
] as const;
const FILTERS: ReadonlyArray<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'needs-you', label: 'Needs you' },
  { id: 'mine', label: 'Mine' },
];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOT: Record<LaneId, string> = { idea: 'var(--color-text-tertiary)', 'plan-ready': 'var(--color-border-strong)', working: 'var(--color-status-working-dot)', 'needs-you': 'var(--color-status-needs-you-dot)', ready: 'var(--color-status-success-dot)', done: 'var(--color-text-tertiary)' };

function LaneHeader({ lane, count, onAdd, disabled }: { lane: (typeof LANES)[number]; count: number; onAdd: () => void; disabled?: boolean }) {
  return (
    <div className="bd-laneheader">
      <i style={{ background: DOT[lane.id] }} aria-hidden="true" />
      <h2>{lane.title}</h2>
      <span>{count}</span>
      <span className="p-spacer" />
      <IconButton icon="plus" label={`Add to ${lane.title}`} onClick={disabled ? undefined : onAdd} />
    </div>
  );
}

function Card({ change, onOpen, onDragStart, offline }: { change: Change; onOpen: () => void; onDragStart: () => void; offline: boolean }) {
  const lane = LANES.find((l) => l.id === change.lane)!;
  return (
    <article className="bd-card" draggable={!offline} onDragStart={(e: DragEvent) => { e.dataTransfer?.setData('text/plain', change.id); onDragStart(); }}>
      <BoardCard status={lane.status} title={change.title} meta={change.meta} {...(lane.id === 'working' ? { risk: 'everyday' as const, ...(change.progress !== undefined ? { progress: change.progress } : {}) } : {})} />
      <button type="button" className="bd-card-open" aria-label={change.title} onClick={onOpen} />
    </article>
  );
}

function Calendar({ today }: { today: Date }) {
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const first = (month.getDay() + 6) % 7;
  const start = new Date(month.getFullYear(), month.getMonth(), 1 - first);
  const days = Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
  const isOct26 = month.getFullYear() === 2026 && month.getMonth() === 9;
  const eventsOn = (d: Date) => {
    if (!isOct26 || d.getMonth() !== 9) return [];
    return [
      ...CHANGES.filter((c) => c.day === d.getDate()).map((c) => ({ id: c.id, title: c.title, lane: c.lane })),
      ...SCHEDULED.filter((c) => c.day === d.getDate()).map((c) => ({ id: c.id, title: c.title, lane: 'plan-ready' as LaneId })),
    ];
  };
  const same = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  return (
    <div className="bd-cal">
      <div className="bd-cal-head">
        <IconButton icon="chevron-right" label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} />
        <IconButton icon="chevron-right" label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} />
        <h2>
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </h2>
        <span className="p-spacer" />
        <button type="button" onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>
          Today
        </button>
      </div>
      <div className="bd-cal-grid" role="grid" aria-label={`${MONTHS[month.getMonth()]} ${month.getFullYear()}`}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} role="columnheader" className="bd-cal-dow">
            {d}
          </div>
        ))}
        {days.map((d) => {
          const out = d.getMonth() !== month.getMonth();
          return (
            <div key={d.toISOString()} role="gridcell" className="bd-cal-cell" data-out={out ? 'true' : undefined}>
              <span className="bd-cal-num" data-today={same(d, today) ? 'true' : undefined} aria-label={same(d, today) ? `Today, ${d.getDate()} ${MONTHS[d.getMonth()]}` : undefined}>
                {d.getDate()}
              </span>
              {eventsOn(d).map((e) => (
                <span key={e.id} className="bd-chip" data-lane={e.lane}>
                  <i aria-hidden="true" />
                  {e.title}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function List({ changes, onOpen }: { changes: Change[]; onOpen: (id: string) => void }) {
  const sorted = [...changes].sort((a, b) => LIST_ORDER.indexOf(a.lane) - LIST_ORDER.indexOf(b.lane));
  return (
    <ul aria-label="All changes" className="bd-list">
      {sorted.map((c) => {
        const lane = LANES.find((l) => l.id === c.lane)!;
        return (
          <li key={c.id}>
            <button type="button" className="bd-listrow" onClick={() => onOpen(c.id)}>
              <span className="bd-listrow-status">
                <StatusPill status={lane.status} />
              </span>
              <span className="bd-listrow-title" data-testid="change-title">
                {c.title}
              </span>
              <span className="bd-listrow-page">{c.page}</span>
              <RiskChip level={c.risk} />
              <span className="bd-listrow-when">{c.when}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function AllSites() {
  const counts = (lane: LaneId) => SITE_ROWS.reduce((n, r) => n + r.cards.filter((c) => c.lane === lane).length, 0);
  return (
    <div role="table" aria-label="Changes on every site" className="bd-sites">
      <div className="bd-sites-head" role="row" aria-hidden="true">
        <span />
        {LANES.map((l) => (
          <div key={l.id} className="bd-laneheader">
            <i style={{ background: DOT[l.id] }} />
            <h2>{l.title}</h2>
            <span>{counts(l.id)}</span>
            <span className="p-spacer" />
            {(l.id === 'idea' || l.id === 'working' || l.id === 'done') && <Icon name="plus" size={20} />}
          </div>
        ))}
      </div>
      {SITE_ROWS.map((r) => (
        <div key={r.site} role="row" aria-label={r.site} className="bd-sites-row">
          <div className="bd-sites-name" role="rowheader">
            <span aria-hidden="true">{r.initial}</span>
            {r.site}
          </div>
          {LANES.map((l) => (
            <div key={l.id} role="cell" className="bd-sites-cell">
              {r.cards
                .filter((c) => c.lane === l.id)
                .map((c) => (
                  <BoardCard key={c.id} status={l.status} title={c.title} meta="Just now" {...(l.id === 'working' ? { risk: 'everyday' as const, ...(c.progress !== undefined ? { progress: c.progress } : {}) } : {})} />
                ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** The board: every change as a card that moves from idea to done, as lanes, a list, or a calendar (Figma BD1 to BD11). */
export function BoardScreen({ state = 'board', scope = 'site', initialView = 'board', initialOpen, initialText, initialStage, initialComposer = false, dragDemo = false, onStart }: Props) {
  const [view, setView] = useState<View>(initialView);
  const [filter, setFilter] = useState<Filter>(state === 'nothing-matches' ? 'needs-you' : 'all');
  const [changes, setChanges] = useState<Change[]>(CHANGES);
  const [open, setOpen] = useState<string | null>(initialOpen ?? null);
  const [composer, setComposer] = useState(initialComposer);
  const [stage, setStage] = useState<LaneId | undefined>(initialStage);
  const { notify } = useFeedback();
  const addChange = (c: NewChange) => {
    const when = c.due ? new Date(`${c.due}T12:00:00`) : null;
    const title = c.text.length > 70 ? `${c.text.slice(0, 67).trimEnd()}…` : c.text;
    const added: Change = {
      id: `new-${Date.now()}`,
      title,
      meta: `${c.page} · Just now`,
      lane: c.stage,
      risk: 'everyday',
      when: 'Just now',
      page: c.page,
      mine: true,
      site: c.site,
      ...(c.stage === 'working' ? { progress: 0.05 } : {}),
      ...(when && when.getFullYear() === 2026 && when.getMonth() === 9 ? { day: when.getDate() } : {}),
    };
    setChanges((cs) => [added, ...cs]);
    notify(`Added to ${LANES.find((l) => l.id === c.stage)!.title}`);
  };
  const openComposer = (lane?: LaneId) => {
    setStage(lane);
    setComposer(true);
  };
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<LaneId | null>(null);
  const offline = state === 'offline';
  const all = scope === 'all';

  const nothing = state === 'nothing-matches';
  const shown = state === 'empty' ? [] : nothing ? [] : changes.filter((c) => filter === 'all' || (filter === 'needs-you' ? c.lane === 'needs-you' : c.mine));
  const selected = changes.find((c) => c.id === open);

  const drop = (lane: LaneId) => {
    if (dragging && !offline) setChanges((cs) => cs.map((c) => (c.id === dragging ? { ...c, lane } : c)));
    setDragging(null);
    setOver(null);
  };

  const newChange = (
    <Button
      variant="primary"
      size="md"
      leadingIcon="plus"
      onClick={() => openComposer()}
    >
      New change
    </Button>
  );

  return (
    <AppShell active="board" changes={sidebarChanges('working')}>
      <div className="bd-page">
        <PageHeader title={all ? 'All sites' : 'Board'} sub={all ? 'Every change across the 8 sites you manage.' : 'Every change on Harbor Bakery, from idea to done.'} action={newChange} />
        {offline && (
          <div className="bd-banner">
            <Banner tone="warning" action={{ label: 'Retry', onClick: () => undefined }}>
              You’re offline. Changes already running keep going; you can’t start or move changes until you’re back.
            </Banner>
          </div>
        )}
        <div className="bd-toolbar">
          <SegmentedControl label="View" options={VIEWS} value={view} onChange={setView} />
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className="app-filter" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>

        {state === 'loading' && (
          <div role="status" aria-label="Loading the board" className="bd-skeleton">
            {[3, 1, 2, 1, 1].map((n, i) => (
              <div key={i}>
                <span />
                {Array.from({ length: n }, (_, k) => (
                  <div key={k}>
                    <span />
                    <span />
                    <span />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {state === 'empty' && (
          <div className="act-empty bd-empty">
            <span className="act-empty-tile" aria-hidden="true">
              <Icon name="sparkles" size={20} />
            </span>
            <h3>Your board is empty</h3>
            <p>Ask Wursor for a change, or pick one of its suggestions. Each change gets a card that moves from idea to done.</p>
            <Button variant="secondary" size="md" onClick={() => openComposer()}>
              New change
            </Button>
          </div>
        )}

        {nothing && (
          <div className="bd-nothing">
            <span className="act-empty-tile" aria-hidden="true">
              <Icon name="sparkles" size={20} />
            </span>
            <h3>Nothing needs you right now</h3>
            <p>Wursor will tell you here when a change needs your answer. Clear the filter to see every change.</p>
            <Button variant="secondary" size="md" onClick={() => setFilter('all')}>
              Show all changes
            </Button>
          </div>
        )}

        {(state === 'board' || offline) && all && view === 'board' && <AllSites />}

        {(state === 'board' || offline) && !all && view === 'board' && (
          <div className="bd-lanes" data-offline={offline ? 'true' : undefined}>
            {LANES.map((lane) => {
              const cards = shown.filter((c) => c.lane === lane.id);
              if (filter !== 'all' && cards.length === 0) return null;
              return (
                <section
                  key={lane.id}
                  role="group"
                  aria-label={lane.title}
                  className="bd-lane"
                  data-over={over === lane.id ? 'true' : undefined}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={() => dragging && setOver(lane.id)}
                  onDrop={() => drop(lane.id)}
                >
                  <LaneHeader lane={lane} count={cards.length} onAdd={() => openComposer(lane.id)} disabled={offline} />
                  {cards.map((c) => (
                    <Card key={c.id} change={c} offline={offline} onOpen={() => setOpen(c.id)} onDragStart={() => setDragging(c.id)} />
                  ))}
                  {dragDemo && lane.id === 'plan-ready' && (
                    <>
                      <div data-testid="drop-slot" className="bd-slot" />
                      <div data-testid="drag-ghost" className="bd-ghost">
                        <BoardCard status="idea" title="Add Sunday hours to the footer" meta="Footer · Suggested" />
                      </div>
                    </>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {(state === 'board' || offline) && view === 'list' && <List changes={shown} onOpen={setOpen} />}
        {(state === 'board' || offline) && view === 'calendar' && <Calendar today={new Date(2026, 9, 14)} />}
      </div>
      {selected && <ChangeDrawer change={selected} onClose={() => setOpen(null)} />}
      {composer && (
        <NewChangeDialog
          {...(initialText ? { initialText } : {})}
          {...(stage ? { initialStage: stage } : {})}
          onStart={(c) => {
            addChange(c);
            onStart?.(c);
          }}
          onClose={() => setComposer(false)}
        />
      )}
    </AppShell>
  );
}
