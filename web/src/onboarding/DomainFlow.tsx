'use client';

import { useEffect, useRef, useState } from 'react';
import { Banner } from '../ui/Banner.tsx';
import { Icon } from '../ui/Icon.tsx';
import { DomainStatusRow } from './DomainStatusRow.tsx';
import { SiteConfirmCard } from './SiteConfirmCard.tsx';
import { TextField } from './TextField.tsx';
import { WizardFooter } from './WizardActions.tsx';
import { WizardShell } from './WizardShell.tsx';

/** Stand-in for the real DNS check: `ok` finds the record, `wrong-record` finds another service. */
export type DomainScenario = 'ok' | 'wrong-record';

type Phase = 'address' | 'record' | 'checking' | 'wrong' | 'securing' | 'ready' | 'live';

type Props = {
  scenario?: DomainScenario | undefined;
  siteName?: string;
  /** How long a check takes, and how long securing takes. */
  checkMs?: number;
  secureMs?: number;
  onDone: () => void;
  onLater: () => void;
  onSaveAndExit?: (() => void) | undefined;
};

const RECORD = { type: 'CNAME', name: 'www', value: 'sites.wursor.site' };
const PROVIDERS = ['GoDaddy', 'Namecheap', 'Cloudflare'] as const;
const ADDRESS = /^[^\s/]+\.[a-z]{2,}$/i;
const clean = (v: string) => v.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '');

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="ob-wizard-heading">
      <h1 className="t-display-m">{title}</h1>
      <p className="t-body-l">{sub}</p>
    </div>
  );
}

function Cta({ label, ready = true, onClick }: { label: string; ready?: boolean; onClick: () => void }) {
  return (
    <button type="button" className="ob-continue ob-continue-auto t-body-m-strong" aria-disabled={!ready} onClick={() => ready && onClick()}>
      {label}
    </button>
  );
}

function RecordTable() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(RECORD.value);
      setCopied(true);
    } catch {
      /* Clipboard blocked: the value is on screen to type. */
    }
  };
  return (
    <div className="ob-dns">
      <div className="ob-dns-row ob-dns-head" aria-hidden="true">
        <span>Type</span>
        <span>Name</span>
        <span>Points to</span>
      </div>
      <div className="ob-dns-row ob-dns-value">
        <span className="ob-dns-type">{RECORD.type}</span>
        <span className="ob-dns-name">{RECORD.name}</span>
        <span className="ob-dns-points">{RECORD.value}</span>
        <button type="button" className="ob-dns-copy" aria-label={copied ? 'Copied' : 'Copy record value'} onClick={copy}>
          <Icon name={copied ? 'check' : 'copy'} size={16} />
        </button>
      </div>
    </div>
  );
}

function ProviderPicker() {
  const [provider, setProvider] = useState<(typeof PROVIDERS)[number]>('GoDaddy');
  return (
    <div className="ob-provider-pick">
      <p className="t-label-m" id="provider-label">How to do this at</p>
      <div className="p-segmented ob-provider-seg" role="radiogroup" aria-labelledby="provider-label">
        {PROVIDERS.map((p) => (
          <button key={p} type="button" role="radio" aria-checked={provider === p} className="p-segment" onClick={() => setProvider(p)}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Section D: connect a web address you own. Address, the record to add, securing, the switch, and live. */
export function DomainFlow({ scenario = 'ok', siteName = 'Harbor Bakery', checkMs = 1500, secureMs = 3000, onDone, onLater, onSaveAndExit }: Props) {
  const [phase, setPhase] = useState<Phase>('address');
  const [value, setValue] = useState('');
  const [checkedOnce, setCheckedOnce] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (phase === 'address') input.current?.focus(); }, [phase]);

  const address = clean(value);
  const valid = ADDRESS.test(address);

  useEffect(() => {
    if (phase !== 'checking') return;
    const id = setTimeout(() => {
      setCheckedOnce(true);
      setPhase(scenario === 'wrong-record' ? 'wrong' : 'securing');
    }, checkMs);
    return () => clearTimeout(id);
  }, [phase, scenario, checkMs]);

  useEffect(() => {
    if (phase !== 'securing') return;
    const id = setTimeout(() => setPhase('ready'), secureMs);
    return () => clearTimeout(id);
  }, [phase, secureMs]);

  const shell = (children: React.ReactNode) => (
    <WizardShell step={8} label="Connect your web address" onSaveAndExit={onSaveAndExit} size="medium">
      {children}
    </WizardShell>
  );
  const note = checkedOnce ? 'Checked just now' : 'Not checked yet';

  if (phase === 'address') {
    return shell(
      <>
        <Heading title="Connect your web address" sub="Enter the address you own. We will show you what to change where you bought it." />
        <div className="ob-fork-content ob-live">
          <TextField
            id="domain"
            label="Web address"
            value={value}
            onChange={setValue}
            placeholder="harborbakery.com"
            autoComplete="off"
            inputRef={input}
            helper="Example: yourbusiness.com"
          />
          <p className="ob-note t-body-m">
            <Icon name="info" size={20} />
            <span>Your site stays at harborbakery.wursor.site until you switch.</span>
          </p>
        </div>
        <WizardFooter onBack={onLater} backLabel="Do this later">
          <Cta label="Check this address" ready={valid} onClick={() => setPhase('record')} />
        </WizardFooter>
      </>,
    );
  }

  if (phase === 'record' || phase === 'checking' || phase === 'wrong') {
    const checking = phase === 'checking';
    return shell(
      <>
        <Heading title="Add this record where you bought it" sub="Sign in to your domain provider, open DNS settings, and add the record below." />
        <div className="ob-fork-content ob-live">
          <RecordTable />
          {phase !== 'wrong' && <ProviderPicker />}
          <DomainStatusRow state={phase === 'wrong' ? 'wrong' : 'waiting'} note={checking ? 'Checking now' : note} />
        </div>
        <WizardFooter onBack={() => setPhase('address')}>
          <Cta label={checking ? 'Checking…' : phase === 'wrong' ? 'Check again' : 'Check now'} ready={!checking} onClick={() => setPhase('checking')} />
        </WizardFooter>
      </>,
    );
  }

  if (phase === 'securing') {
    return shell(
      <>
        <Heading title="Your address is pointing here" sub="We are securing the connection so visitors see the padlock." />
        <div className="ob-fork-content ob-live">
          <DomainStatusRow state="securing" note="Started just now" />
          <p className="ob-note t-body-m">
            <Icon name="lock" size={20} />
            <span>This usually takes about a minute.</span>
          </p>
        </div>
        <WizardFooter onBack={() => setPhase('record')}>
          <Cta label={`Switch to ${address}`} ready={false} onClick={() => undefined} />
        </WizardFooter>
      </>,
    );
  }

  if (phase === 'ready') {
    return shell(
      <>
        <Heading title="Your address is connected" sub={`Switch now to make ${address} show your site. You can undo it until you confirm.`} />
        <div className="ob-fork-content ob-live">
          <DomainStatusRow state="secure" address={address} note="Checked just now" />
          <Banner>{`Visitors on ${address} will see your new site. Search engines will start to find it.`}</Banner>
        </div>
        <WizardFooter onBack={onLater} backLabel="Not yet">
          <Cta label={`Switch to ${address}`} onClick={() => setPhase('live')} />
        </WizardFooter>
      </>,
    );
  }

  return shell(
    <>
      <Heading title={`${siteName} is live on ${address}`} sub="Your temporary address now redirects here." />
      <div className="ob-fork-content ob-live">
        <SiteConfirmCard name={siteName} url={address} state="live" />
        <DomainStatusRow state="secure" address={address} note="Checked just now" />
      </div>
      <div className="ob-wizard-actions">
        <div className="ob-wizard-left">
          <button type="button" className="ob-pill ob-pill-ghost t-label-m" onClick={() => setPhase('ready')}>
            <Icon name="undo-16" size={16} />
            Undo the switch
          </button>
        </div>
        <Cta label="Go to your site" onClick={onDone} />
      </div>
    </>,
  );
}
