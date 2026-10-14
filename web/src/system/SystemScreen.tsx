'use client';

import { AppShell } from '../shell/AppShell.tsx';
import { Button } from '../product/Button.tsx';
import { Banner } from '../ui/Banner.tsx';
import { BrandMark } from '../marketing/BrandMark.tsx';
import { PageHeader } from '../home/parts.tsx';
import { SettingRow } from '../settings/controls.tsx';
import { UsageMeter } from '../sites/UsageMeter.tsx';
import { ConfirmDialog } from './ConfirmDialog.tsx';
import { EmptyState } from './EmptyState.tsx';

export type SystemKind = 'content-only' | 'error' | 'limit' | 'session' | 'maintenance' | 'not-found' | 'unreachable' | 'loading';

const FACTS = [
  { title: 'Connection', detail: 'Lost 14:02 · retrying every minute', state: 'Reconnecting' },
  { title: 'Last good check', detail: '14:01 today', state: 'Healthy' },
  { title: 'Access', detail: 'Full access', state: 'Full access' },
] as const;

/** The screens for when things are not as usual (Figma SY1–SY8). Every one says what happened, what is safe, and the one next step. */
export function SystemScreen({ kind, onAction }: { kind: SystemKind; onAction: () => void }) {
  switch (kind) {
    case 'content-only':
      return (
        <AppShell active="home">
          <div className="sy-stack">
            <PageHeader title="Harbor Bakery" sub="This site is set to Content only." />
            <EmptyState title="This change needs Full access" action={{ label: 'Change access', onClick: onAction }}>
              Wursor can edit text, images and menus on this site. It can’t change theme or plugin code until you switch access to Full access.
            </EmptyState>
          </div>
        </AppShell>
      );
    case 'error':
      return (
        <AppShell active="home">
          <div className="sy-stack">
            <EmptyState title="Something went wrong on our side" action={{ label: 'Try again', onClick: onAction }}>
              Nothing on your site was changed. Try again, and if it keeps happening, send us the reference below.
            </EmptyState>
            <p className="sy-ref">Reference WUR-4F2K9 · 14:02 UTC</p>
          </div>
        </AppShell>
      );
    case 'limit':
      return (
        <AppShell active="home">
          <div className="sy-stack">
            <PageHeader title="Home" sub="Harbor Bakery is live." />
            <Banner tone="warning" action={{ label: 'Upgrade plan', onClick: onAction }}>
              You’ve used all 40 changes in your plan this month. Running changes will finish; new ones start on 1 November, or sooner if you upgrade.
            </Banner>
            <UsageMeter label="Changes this month" value="40 of 40" fill={1} />
          </div>
        </AppShell>
      );
    case 'session':
      return (
        <>
          <div aria-hidden="true" className="sy-dim">
            <AppShell active="home">
              <PageHeader title="Home" sub="Harbor Bakery is live." />
            </AppShell>
          </div>
          <div className="sy-scrim">
            <ConfirmDialog title="Your session expired" confirmLabel="Sign in" cancelLabel="Not now" onConfirm={onAction} onCancel={() => {}}>
              For your security, sign in again. Your changes and drafts are safe.
            </ConfirmDialog>
          </div>
        </>
      );
    case 'maintenance':
      return (
        <Standalone title="Wursor is getting a tune-up" action="Check status" onAction={onAction}>
          We’re making things faster. Your sites are fine and any running change is paused safely. We’ll be back by 14:30 UTC.
        </Standalone>
      );
    case 'not-found':
      return (
        <Standalone code="404" title="We can’t find that page" action="Go to Home" onAction={onAction}>
          It may have moved, or the link may be wrong.
        </Standalone>
      );
    case 'unreachable':
      return (
        <AppShell active="sites">
          <div className="sy-stack">
            <PageHeader title="Harbor Bakery" sub="harborbakery.com" />
            <Banner tone="danger" action={{ label: 'Try again', onClick: onAction }}>
              Wursor can’t reach harborbakery.com. Changes are paused and nothing was lost.
            </Banner>
            <div role="group" aria-label="Connection" className="sy-facts">
              {FACTS.map((f) => (
                <SettingRow key={f.title} title={f.title} detail={f.detail} control="state" text={f.state} />
              ))}
            </div>
          </div>
        </AppShell>
      );
    case 'loading':
      return (
        <AppShell active="home">
          <div role="status" aria-label="Loading" aria-busy="true" className="sy-stack">
            <div className="sy-heading-skeleton">
              <i className="sy-bar sy-bar-title" />
              <i className="sy-bar sy-bar-sub" />
            </div>
            <div className="sy-list-skeleton">
              {Array.from({ length: 6 }, (_, n) => (
                <i key={n} className="sy-bar sy-bar-row" />
              ))}
            </div>
          </div>
        </AppShell>
      );
  }
}

function Standalone({ code, title, children, action, onAction }: { code?: string; title: string; children: string; action: string; onAction: () => void }) {
  return (
    <main className="sy-standalone">
      <BrandMark size={64} />
      {code && <span className="sy-code">{code}</span>}
      <h1>{title}</h1>
      <p>{children}</p>
      <Button size="md" variant={code ? 'primary' : 'secondary'} onClick={onAction}>
        {action}
      </Button>
    </main>
  );
}
