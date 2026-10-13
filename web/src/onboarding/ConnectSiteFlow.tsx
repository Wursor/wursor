'use client';

import { useEffect, useState } from 'react';
import type { CheckItem } from './Checklist.tsx';
import { ConnectProblemStep } from './ConnectProblemStep.tsx';
import {
  AddressStep, AdminNeededStep, ApprovalStep, ConnectedStep, ExistingPagesStep, PairingStep, RouteStep, SecureStep, type Route, type SiteCheck,
} from './ConnectSteps.tsx';

/**
 * Which outcome the stand-in site gives, since there is no real site to fail. In the product these come from the
 * connection service; here they let every state in the design be reached by hand with `?scenario=`.
 */
export type Scenario = 'ok' | 'unreachable' | 'not-wordpress' | 'admin' | 'blocked' | 'expired' | 'noplugins' | 'content' | 'empty' | 'pages';
export type ConnectDone = 'first-look' | 'content-only' | 'empty';

type Phase = 'address' | 'pages' | 'route' | 'approving' | 'pairing' | 'connecting' | 'connected' | 'admin' | 'blocked' | 'expired' | 'noplugins';

type Props = {
  scenario?: Scenario;
  /** Connect an existing site, or build a new one here and publish to it. */
  purpose?: 'connect' | 'build';
  stepMs?: number;
  checkMs?: number;
  onDone: (how: ConnectDone) => void;
  onChooseCloud: () => void;
  onBackOut?: () => void;
  onSaveAndExit?: () => void;
};

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const SITE_NAME = 'Harbor Bakery';

export function ConnectSiteFlow({ scenario = 'ok', purpose = 'connect', stepMs = 1800, checkMs = 1200, onDone, onChooseCloud, onBackOut, onSaveAndExit }: Props) {
  const [phase, setPhase] = useState<Phase>('address');
  const [url, setUrl] = useState('harborbakery.com');
  const [route, setRoute] = useState<Route>('approve');
  const [n, setN] = useState(0);

  // One shared clock for the approving and connecting phases: each tick moves the checklist on.
  useEffect(() => {
    if (phase !== 'approving' && phase !== 'connecting') return;
    const id = setTimeout(() => setN((v) => v + 1), stepMs);
    return () => clearTimeout(id);
  }, [phase, n, stepMs]);

  const go = (next: Phase) => {
    setN(0);
    setPhase(next);
  };

  useEffect(() => {
    if (phase === 'approving') {
      if (scenario === 'admin' && n === 1) go('admin');
      else if (scenario === 'blocked' && n === 1) go('blocked');
      else if (n >= 3) go('connecting');
    } else if (phase === 'connecting' && n >= 3) {
      setPhase('connected');
    }
  }, [phase, n, scenario]);

  const check = async (): Promise<SiteCheck> => {
    await wait(checkMs);
    return scenario === 'unreachable' ? 'unreachable' : scenario === 'not-wordpress' ? 'not-wordpress' : 'ok';
  };

  const ask = () => window.open('/docs', '_blank');
  const common = { onSaveAndExit };

  if (phase === 'address')
    return (
      <AddressStep
        check={check}
        onRecognised={(a) => {
          setUrl(a);
          go(purpose === 'build' && scenario === 'pages' ? 'pages' : 'route');
        }}
        onBack={onBackOut}
        onAsk={ask}
        {...common}
      />
    );

  if (phase === 'pages')
    return <ExistingPagesStep siteName={SITE_NAME} url={url} onConnectAsIs={() => go('route')} onChooseAnother={() => go('address')} {...common} />;

  if (phase === 'route')
    return (
      <RouteStep
        siteName={SITE_NAME}
        url={url}
        onContinue={(r) => {
          setRoute(r);
          go(r === 'approve' ? 'approving' : 'pairing');
        }}
        onBack={() => go('address')}
        {...common}
      />
    );

  if (phase === 'approving') {
    const items: CheckItem[] = ['Reaching your site', 'Helper found', 'Paired securely', 'Safe copy ready'].map((label, i) => ({
      label,
      state: i <= n ? (i === n && n < 3 ? 'running' : 'done') : 'pending',
    }));
    items[0] = { label: 'Reaching your site', state: 'done' };
    return <ApprovalStep siteName={SITE_NAME} url={url} items={items} onReopen={() => window.open(`https://${url}/wp-admin`, '_blank')} onBack={() => go('route')} {...common} />;
  }

  if (phase === 'pairing')
    return (
      <PairingStep
        code="H7K 29Q"
        onDownload={() => {}}
        onContinue={() => go(scenario === 'expired' ? 'expired' : scenario === 'noplugins' ? 'noplugins' : scenario === 'blocked' ? 'blocked' : 'connecting')}
        onBack={() => go('route')}
        {...common}
      />
    );

  if (phase === 'connecting') {
    const labels = ['Reaching your site', 'Helper found', 'Paired securely', 'Safe copy ready'];
    const items: CheckItem[] = labels.map((label, i) => ({
      label,
      state: i < n + 1 ? 'done' : i === n + 1 ? 'running' : 'pending',
      ...(i === n + 1 && i === 2 ? { detail: 'Exchanging a one-time key' } : {}),
    }));
    return <SecureStep heading="Connecting securely" subheading="This usually takes under a minute. You don’t need to do anything." items={items} reassurance {...common} />;
  }

  if (phase === 'admin') return <AdminNeededStep siteName={SITE_NAME} url={url} onLogin={() => go('approving')} onAsk={ask} {...common} />;

  if (phase === 'blocked')
    return (
      <SecureStep
        heading="Connecting securely"
        subheading="Something on your site stopped the connection."
        items={[
          { label: 'Reaching your site', state: 'done' },
          { label: 'Helper found', state: 'failed', detail: 'Blocked by a security plugin' },
          { label: 'Paired securely', state: 'pending' },
          { label: 'Safe copy ready', state: 'pending' },
        ]}
        problem={{
          icon: 'shield',
          title: 'Your security plugin blocked the helper',
          body: 'A firewall on your site stopped the connection. Allow Wursor, or use the pairing code instead.',
          primary: 'Use pairing code',
          onPrimary: () => go('pairing'),
          secondary: 'Ask a person',
          onSecondary: ask,
        }}
        {...common}
      />
    );

  if (phase === 'expired')
    return (
      <SecureStep
        heading="Pair with a code"
        subheading="Enter the code on your site within ten minutes."
        problemFirst
        items={[
          { label: 'Reaching your site', state: 'done' },
          { label: 'Helper found', state: 'done' },
          { label: 'Paired securely', state: 'failed', detail: 'The code ran out of time' },
          { label: 'Safe copy ready', state: 'pending' },
        ]}
        problem={{
          icon: 'clock',
          title: 'That code has expired',
          body: 'Codes last ten minutes. We can make a new one for you.',
          primary: 'Get a new code',
          onPrimary: () => go('pairing'),
          secondary: 'Ask a person',
          onSecondary: ask,
        }}
        {...common}
      />
    );

  if (phase === 'noplugins')
    return (
      <ConnectProblemStep
        heading="We could not install the helper"
        subheading="Some hosts do not allow plugins. You still have good options."
        icon="plug"
        title="Your host does not allow plugins"
        body="Wursor can still work on your pages and posts with Content only access. Or move your site to Wursor Cloud for full access."
        primary="Use Content only"
        onPrimary={() => onDone('content-only')}
        secondary="Move to Wursor Cloud"
        onSecondary={onChooseCloud}
        {...common}
      />
    );

  const variant = scenario === 'content' ? 'content-only' : purpose === 'build' && scenario === 'empty' ? 'empty' : 'first-look';
  void route;
  return <ConnectedStep variant={variant} siteName={SITE_NAME} url={url} onContinue={() => onDone(variant)} onBack={() => go('route')} {...common} />;
}
