'use client';

import { useEffect, useState } from 'react';
import { ApprovalBar } from '../product/ApprovalBar.tsx';
import { BoardStrip } from '../product/BoardStrip.tsx';
import { Button } from '../product/Button.tsx';
import { Composer } from '../product/Composer.tsx';
import { ConversationPanel, type Density } from '../product/ConversationPanel.tsx';
import { HARBOR } from '../product/harbor-bakery.ts';
import { PreviewToolbar, type PreviewView } from '../product/PreviewToolbar.tsx';
import { Sidebar } from '../product/Sidebar.tsx';
import { TopBar } from '../product/TopBar.tsx';
import { MobileTopBar } from './MobileTopBar.tsx';
import { useCommandLayers, type Layer } from '../command/useCommandLayers.tsx';
import { PreviewStage } from './PreviewStage.tsx';
import {
  boardLanes, CHANGES, CHANGE_TITLE, LIVE_URL, PHASE_STATUS, PHASE_VIEW, PREVIEW_TAG, sidebarChanges, SITE, USER_REQUEST, WIDE_PHASES,
  type Phase, type Variant,
} from './scenario.ts';
import { SidebarRail } from './SidebarRail.tsx';
import { Stream } from './Stream.tsx';
import { TourLayer } from './TourLayer.tsx';
import { useMediaQuery, PHONE } from './useMediaQuery.ts';
import { WhatChangedDrawer } from './WhatChangedDrawer.tsx';

type Props = {
  initialPhase?: Phase;
  /** `site` is building a whole new site to publish to the owner's WordPress; `change` is one change to a live site. */
  variant?: Variant;
  /** Where Approve and publish goes, when it leaves the workspace (a new site publishes in its own screens). */
  onApprove?: () => void;
  initialDensity?: Density;
  initialView?: PreviewView;
  /** Starts the guided tour at this step (1 to 4). Steps 1 to 3 happen while Wursor works; step 4 at the decision point. */
  tourStep?: 1 | 2 | 3 | 4;
  /** Opens a layer over the workspace: the command palette (and its asking and searching states), the shortcuts, the hints, or the tab order. */
  overlay?: Layer;
  /** Where a chosen palette item that goes elsewhere is sent. */
  onNavigate?: (href: string) => void;
  /** Moves a change along by itself, so the whole life of a change can be watched. Off for fixed states. */
  autoplay?: boolean;
  /** How long the demo spends working and publishing, in ms. */
  workMs?: number;
  publishMs?: number;
};

const HREFS = { Home: '/home', Board: '/board', Activity: '/activity', Sites: '/sites' } as const;

/** The workspace: the conversation about one change, the preview, the board, and the decision point. */
export function WorkspaceApp({ initialPhase = 'plan', variant = 'change', onApprove, initialDensity = 'steps', initialView, tourStep, overlay, onNavigate = (href) => window.location.assign(href), autoplay = false, workMs = 6000, publishMs = 3000 }: Props) {
  const [phase, setPhaseState] = useState<Phase>(initialPhase);
  const [density, setDensity] = useState<Density>(initialDensity);
  const [view, setView] = useState<PreviewView>(initialView ?? PHASE_VIEW[initialPhase]);
  const [answer, setAnswer] = useState<string | undefined>();
  const [drawer, setDrawer] = useState(true);
  const [progress, setProgress] = useState(0.6);
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview' | 'board'>('chat');
  const compact = useMediaQuery(PHONE);
  const [tour, setTour] = useState<1 | 2 | 3 | 4 | null>(tourStep ?? null);
  const [boardOpen, setBoardOpen] = useState(true);
  const layers = useCommandLayers({
    initial: overlay,
    onRun: (item) => {
      if (item.group === 'ask' || item.id === 'new') return go('plan');
      if (item.id === 'approve') return go(phase === 'ready' ? 'publishing' : 'ready');
      if (item.id === 'undo') return go(phase === 'published' ? 'ready' : phase);
      if (item.id === 'pause') return go('plan');
      if (item.href) onNavigate(item.href);
    },
  });

  const go = (next: Phase, nextView?: PreviewView) => {
    setPhaseState(next);
    setView(nextView ?? PHASE_VIEW[next]);
    if (next === 'ready') setDrawer(true);
  };

  useEffect(() => {
    if (!autoplay) return;
    if (phase === 'working') {
      const id = setTimeout(() => go(answer ? 'ready' : 'needs-you'), workMs);
      return () => clearTimeout(id);
    }
    if (phase === 'publishing') {
      setProgress(0.6);
      const id = setTimeout(() => go('published'), publishMs);
      return () => clearTimeout(id);
    }
    return undefined;
    // `go` only sets state; the effect restarts when the phase changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, phase, answer, workMs, publishMs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === '\\') {
        e.preventDefault();
        setCollapsed((c) => (c === null ? WIDE_PHASES.has(phase) : !c));
      } else if (key === 'j') {
        e.preventDefault();
        setBoardOpen((b) => !b);
      } else if (key === 'd' && e.shiftKey) {
        e.preventDefault();
        setDensity((d) => (d === 'headline' ? 'steps' : d === 'steps' ? 'everything' : 'headline'));
      } else if (key === 'n') {
        e.preventDefault();
        go('plan');
      } else if (key === 'enter' && phase === 'ready' && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        if (onApprove) onApprove();
        else go('publishing');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // `go` only sets state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, onApprove]);

  const wide = collapsed === null ? WIDE_PHASES.has(phase) : !collapsed;
  const site = variant === 'site';
  const showDrawer = (phase === 'ready' || phase === 'publishing') && (site ? view !== 'proof' : view === 'compare') && drawer;
  const showBoard = WIDE_PHASES.has(phase) && boardOpen;

  const approval =
    phase === 'ready' ? (
      <ApprovalBar state="ready" title="Ready for you" meta={site ? SITE.approval.meta : view === 'proof' ? '2 changes · Everyday risk · Easy to undo' : '2 changes · Easy to undo'} onApprove={() => (onApprove ? onApprove() : go('publishing'))} onAskChanges={() => go('working')} />
    ) : phase === 'publishing' ? (
      <ApprovalBar state="publishing" title={`Publishing to ${LIVE_URL}…`} meta="Wursor takes a safe copy first, then publishes." progress={progress} />
    ) : phase === 'published' ? (
      <ApprovalBar state="published" title={`Live on ${LIVE_URL}`} meta="Published 9:41 AM · Wursor is watching for errors for 30 minutes" onUndo={() => go('ready')} liveUrl={`https://${LIVE_URL}`} />
    ) : null;

  const composer =
    phase === 'working' ? (
      <Composer key="working" state="working" autonomy={HARBOR.autonomy} onStop={() => go('plan')} />
    ) : phase === 'needs-you' ? (
      <Composer key="typing" state="empty" autonomy={HARBOR.autonomy} defaultValue={USER_REQUEST} />
    ) : (
      <Composer key="empty" state="empty" autonomy={HARBOR.autonomy} />
    );

  return (
    <div className="ws" data-phase={phase} data-wide={wide ? 'true' : 'false'} data-board={showBoard ? 'true' : 'false'} data-tab={mobileTab}>
      <TopBar
        site={HARBOR.site.name}
        siteInitial={HARBOR.site.initial}
        change={site ? SITE.title : CHANGE_TITLE}
        status={PHASE_STATUS[phase]}
        autonomy={HARBOR.autonomy}
        account={HARBOR.account}
        onToggleSidebar={() => setCollapsed(wide)}
        onSearch={() => layers.open('palette')}
      />
      <MobileTopBar site={HARBOR.site.name} siteInitial={HARBOR.site.initial} onSearch={() => layers.open('palette')} />
      <div className="ws-tabs" role="tablist" aria-label="Workspace">
        {(['chat', 'preview', 'board'] as const).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={mobileTab === t} className="ws-tab" onClick={() => setMobileTab(t)}>
            {t === 'chat' ? 'Chat' : t === 'preview' ? 'Preview' : 'Board'}
          </button>
        ))}
      </div>
      <div className="ws-body">
        {wide ? <Sidebar changes={sidebarChanges(phase)} account={HARBOR.account} hrefs={HREFS} /> : <SidebarRail account={HARBOR.account} hrefs={HREFS} />}
        <div className="ws-convo" data-panel="chat">
          <ConversationPanel
            density={density}
            onDensityChange={setDensity}
            anchor={wide ? 'top' : 'bottom'}
            composer={composer}
            headerExtra={
              phase === 'ready' ? (
                <span className="ws-publish-mobile">
                  <Button variant="primary" onClick={() => (onApprove ? onApprove() : go('publishing'))}>
                    Publish
                  </Button>
                </span>
              ) : undefined
            }
          >
            <Stream
              phase={phase}
              variant={variant}
              density={density}
              answer={answer}
              onStart={() => go('working')}
              onEditPlan={() => setCollapsed(null)}
              onAnswer={(a) => {
                setAnswer(a);
                go('working');
              }}
              onSeeChanges={() => setView('compare')}
            />
          </ConversationPanel>
        </div>
        <div className="ws-preview" data-panel="preview">
          <PreviewToolbar
            selected={view}
            tag={site ? SITE.tag : PREVIEW_TAG[phase]}
            onSelect={setView}
            trailing={
              phase === 'ready' && view === 'compare' ? (
                <Button variant="primary" onClick={() => (onApprove ? onApprove() : go('publishing'))}>
                  Publish
                </Button>
              ) : undefined
            }
          />
          <div className="ws-stage">
            <PreviewStage phase={phase} view={view} compact={compact} variant={variant} />
            {approval && <div className="ws-approval">{approval}</div>}
          </div>
          <div className="ws-board" data-panel="board">
            <BoardStrip lanes={boardLanes(phase)} />
          </div>
        </div>
        {showDrawer &&
          (site ? (
            <WhatChangedDrawer {...SITE.drawer} changes={SITE.drawer.rows} onClose={() => setDrawer(false)} />
          ) : (
            <WhatChangedDrawer verdict="Wursor checked 9 things. All passed." changes={CHANGES} onClose={() => setDrawer(false)} />
          ))}
      </div>
      {layers.element}
      {tour && (
        <TourLayer
          step={tour}
          onSkip={() => setTour(null)}
          onNext={() => {
            if (tour === 4) return setTour(null);
            const next = (tour + 1) as 2 | 3 | 4;
            if (next === 4) go('ready');
            setTour(next);
          }}
        />
      )}
    </div>
  );
}
