'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Banner } from '../ui/Banner.tsx';
import { Icon } from '../ui/Icon.tsx';
import { AccessRow } from './AccessRow.tsx';
import { Checklist, type CheckItem } from './Checklist.tsx';
import { ProblemCard } from './ProblemCard.tsx';
import { RadioCard } from './RadioCard.tsx';
import { RadioGroupLabel } from './RadioGroupLabel.tsx';
import { SiteConfirmCard } from './SiteConfirmCard.tsx';
import { TextField } from './TextField.tsx';
import { WizardActions, WizardFooter } from './WizardActions.tsx';
import { WizardShell } from './WizardShell.tsx';

/** Every connect screen is step 6 of 8, "Connect your site", in the 600px column. */
function Step({ heading, subheading, onSaveAndExit, children }: { heading: string; subheading: string; onSaveAndExit?: (() => void) | undefined; children: ReactNode }) {
  return (
    <WizardShell step={6} label="Connect your site" onSaveAndExit={onSaveAndExit} size="medium">
      <div className="ob-wizard-heading">
        <h1 className="t-display-m">{heading}</h1>
        <p className="t-body-l">{subheading}</p>
      </div>
      {children}
    </WizardShell>
  );
}

type Common = { onBack?: (() => void) | undefined; onSaveAndExit?: (() => void) | undefined; onAsk?: (() => void) | undefined };

// ---------------------------------------------------------------- 4a, 4b, 4h, 4i: the address

export type SiteCheck = 'ok' | 'unreachable' | 'not-wordpress';

const ADDRESS = /^[^\s/]+\.[a-z]{2,}(\/.*)?$/i;
const clean = (v: string) => v.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');

type AddressProps = Common & {
  check: (address: string) => Promise<SiteCheck>;
  onRecognised: (address: string) => void;
};

export function AddressStep({ check, onRecognised, onBack, onSaveAndExit, onAsk }: AddressProps) {
  const [value, setValue] = useState('');
  const [phase, setPhase] = useState<'idle' | 'checking' | 'unreachable' | 'not-wordpress'>('idle');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);

  const address = clean(value);
  const ready = ADDRESS.test(address);
  const problem = phase === 'unreachable' || phase === 'not-wordpress';

  const submit = async () => {
    if (!ready || phase === 'checking') return;
    setPhase('checking');
    const result = await check(address);
    if (result === 'ok') {
      setPhase('idle');
      onRecognised(address);
    } else {
      setPhase(result);
    }
  };

  return (
    <Step heading="Connect your site" subheading="Enter your site’s address. Wursor only looks at what any visitor can see." onSaveAndExit={onSaveAndExit}>
      <div className="ob-fork-content ob-live">
        <form
          className="ob-addressform"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <TextField
            id="address"
            label="Site address"
            placeholder="harborbakery.com"
            value={value}
            inputRef={input}
            readOnly={phase === 'checking'}
            invalid={problem}
            leading={<Icon name="globe" size={16} />}
            helper={phase === 'idle' ? 'Example: yourbusiness.com' : undefined}
            error={phase === 'unreachable' ? 'We couldn’t reach this address.' : phase === 'not-wordpress' ? 'This doesn’t look like WordPress.' : undefined}
            onChange={(v) => {
              setValue(v);
              if (problem) setPhase('idle');
            }}
          />
        </form>
        {phase === 'idle' && (
          <p className="ob-note t-body-m ob-note-success">
            <Icon name="shield-check" size={20} />
            <span>Wursor can see your site but cannot change it without your approval.</span>
          </p>
        )}
        {phase === 'checking' && (
          <p className="ob-note t-body-m ob-statusline">
            <Icon name="loader" size={20} className="ob-spin" />
            <span>Checking that {address} is a WordPress site…</span>
          </p>
        )}
        {phase === 'unreachable' && (
          <ProblemCard
            icon="alert-triangle"
            title="We can't reach your site"
            body={`${address} didn't respond. Check the address and that the site is online, then try again.`}
            primary="Try again"
            onPrimary={() => void submit()}
            secondary="Ask a person"
            onSecondary={onAsk ?? (() => {})}
          />
        )}
        {phase === 'not-wordpress' && (
          <ProblemCard
            icon="info"
            title="This doesn't look like a WordPress site"
            body="Wursor works with WordPress for now. If this is WordPress, it may sit behind a custom setup we can't see."
            primary="Use another address"
            onPrimary={() => {
              setValue('');
              setPhase('idle');
              input.current?.focus();
            }}
            secondary="Ask a person"
            onSecondary={onAsk ?? (() => {})}
          />
        )}
      </div>
      <WizardActions
        ready={ready && phase === 'idle'}
        canSkip={false}
        continueLabel={phase === 'checking' ? 'Checking…' : 'Continue'}
        onBack={onBack}
        onContinue={() => void submit()}
      />
    </Step>
  );
}

// ---------------------------------------------------------------- 4c: choose a route

export type Route = 'approve' | 'pair';

type SiteProps = { siteName: string; url: string };

export function RouteStep({ siteName, url, onContinue, onBack, onSaveAndExit }: Common & SiteProps & { onContinue: (route: Route) => void }) {
  const [route, setRoute] = useState<Route>('approve');
  return (
    <Step heading="We found your site" subheading="Choose how you’d like to connect it. The first option is the quickest." onSaveAndExit={onSaveAndExit}>
      <div className="ob-fork-content ob-live">
        <SiteConfirmCard name={siteName} url={url} state="recognised" />
        <RadioGroupLabel label="How to connect" className="ob-radio-stack">
          <RadioCard
            name="route"
            value="approve"
            title="Log in to WordPress and approve"
            description="Opens your site’s own approval screen in a new tab. Nothing to install by hand."
            checked={route === 'approve'}
            onChange={() => setRoute('approve')}
          />
          <RadioCard
            name="route"
            value="pair"
            title="Install the Wursor helper plugin"
            description="Use a pairing code if you can’t log in to WordPress right now."
            checked={route === 'pair'}
            onChange={() => setRoute('pair')}
          />
        </RadioGroupLabel>
      </div>
      <WizardFooter onBack={onBack}>
        <button type="button" className="ob-continue ob-continue-auto t-body-m-strong" onClick={() => onContinue(route)}>
          {route === 'approve' ? 'Open WordPress to approve' : 'Get a pairing code'}
          {route === 'approve' && <Icon name="external-link" size={20} />}
        </button>
      </WizardFooter>
    </Step>
  );
}

// ---------------------------------------------------------------- 4d, 4l: approve in WordPress

export function ApprovalStep({ siteName, url, items, onReopen, onBack, onSaveAndExit }: Common & SiteProps & { items: readonly CheckItem[]; onReopen: () => void }) {
  return (
    <Step heading="Approve in WordPress" subheading={`We opened ${url}/wp-admin in a new tab. Approve the connection there, then come back here.`} onSaveAndExit={onSaveAndExit}>
      <div className="ob-fork-content ob-live">
        <SiteConfirmCard name={siteName} url={url} state="recognised" />
        <Checklist label="Connection progress" items={items} />
      </div>
      <WizardFooter onBack={onBack}>
        <button type="button" className="ob-continue ob-continue-auto t-body-m-strong" onClick={onReopen}>
          Open it again
          <Icon name="external-link" size={20} />
        </button>
      </WizardFooter>
    </Step>
  );
}

export function AdminNeededStep({ siteName, url, onLogin, onAsk, onSaveAndExit }: Common & SiteProps & { onLogin: () => void }) {
  return (
    <Step heading="Approve in WordPress" subheading="WordPress told us your account can’t approve connections." onSaveAndExit={onSaveAndExit}>
      <div className="ob-fork-content ob-live">
        <SiteConfirmCard name={siteName} url={url} state="recognised" />
        <ProblemCard
          icon="lock"
          title="You need to be an administrator"
          body="Only administrators can approve a connection. Log in with an admin account, or ask the site’s administrator."
          primary="Log in as admin"
          onPrimary={onLogin}
          secondary="Ask a person"
          onSecondary={onAsk ?? (() => {})}
        />
      </div>
    </Step>
  );
}

// ---------------------------------------------------------------- 4e: pair with a code

function PairStepRow({ n, title, children }: { n: number; title: string; children?: ReactNode }) {
  return (
    <div className="ob-pairstep">
      <span className="ob-pairstep-n t-label-s" aria-hidden="true">
        {n}
      </span>
      <div className="ob-pairstep-text">
        <p className="t-body-m-strong">{title}</p>
        {children}
      </div>
    </div>
  );
}

export function PairingStep({ code, onContinue, onDownload, onBack, onSaveAndExit }: Common & { code: string; onContinue: () => void; onDownload: () => void }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.replace(/\s/g, ''));
      setCopied(true);
    } catch {
      /* Clipboard blocked: the code is on screen to type. */
    }
  };
  return (
    <Step heading="Pair with a code" subheading="Three small steps. Wursor keeps checking, so you can do them in any order." onSaveAndExit={onSaveAndExit}>
      <div className="ob-fork-content ob-live">
        <PairStepRow n={1} title="Download the Wursor helper">
          <p className="t-body-m">A small plugin that lets Wursor see your site securely.</p>
          <button type="button" className="ob-pill ob-pill-secondary t-label-m ob-reopen" onClick={onDownload}>
            <span className="ob-dl-icon" aria-hidden="true">
              <Icon name="download" size={17.25} />
            </span>
            Download helper
          </button>
        </PairStepRow>
        <PairStepRow n={2} title="Upload and activate it in WordPress">
          <p className="t-body-m">Plugins, then Add New, then Upload Plugin.</p>
        </PairStepRow>
        <PairStepRow n={3} title="Enter this code when asked">
          <p className="t-body-m">It expires in ten minutes.</p>
        </PairStepRow>
        <div className="ob-paircode">
          <div className="ob-paircode-text">
            <p className="ob-paircode-label">Pairing code</p>
            <p className="ob-paircode-value">{code}</p>
          </div>
          <button type="button" className="ob-pill ob-pill-secondary t-label-m" onClick={() => void copy()}>
            <Icon name="copy" size={16} />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="ob-note t-body-m ob-statusline">
          <Icon name="loader" size={20} className="ob-spin" />
          <span>Waiting for the helper to check in…</span>
        </p>
      </div>
      <WizardFooter onBack={onBack}>
        <button type="button" className="ob-continue ob-continue-auto t-body-m-strong" onClick={onContinue}>
          I’ve entered the code
        </button>
      </WizardFooter>
    </Step>
  );
}

// ---------------------------------------------------------------- 4f, 4j, 4k: connecting, and what can go wrong

type ProblemSpec = { icon: 'lock' | 'clock' | 'shield' | 'plug' | 'alert-triangle' | 'info'; title: string; body: string; primary: string; onPrimary: () => void; secondary?: string; onSecondary?: () => void };

export function SecureStep({
  heading, subheading, items, reassurance, problem, problemFirst, onSaveAndExit,
}: Common & { heading: string; subheading: string; items: readonly CheckItem[]; reassurance?: boolean; problem?: ProblemSpec; problemFirst?: boolean }) {
  const card = problem && <ProblemCard {...problem} />;
  return (
    <Step heading={heading} subheading={subheading} onSaveAndExit={onSaveAndExit}>
      <div className="ob-fork-content ob-live">
        {problemFirst && card}
        <Checklist label="Connection progress" items={items} />
        {!problemFirst && card}
        {reassurance && (
          <p className="ob-note t-body-m ob-note-success">
            <Icon name="shield-check" size={20} />
            <span>Wursor can see your site but cannot change it without your approval.</span>
          </p>
        )}
      </div>
    </Step>
  );
}

// ---------------------------------------------------------------- 4g, 4m, 4o: connected

const DONE_ITEMS: CheckItem[] = [
  { label: 'Reaching your site', state: 'done' },
  { label: 'Helper found', state: 'done' },
  { label: 'Paired securely', state: 'done' },
  { label: 'Safe copy ready', state: 'done', detail: 'Backup taken just now' },
];

type ConnectedProps = Common & SiteProps & { variant: 'first-look' | 'content-only' | 'empty'; onContinue: () => void; onDetails?: () => void };

export function ConnectedStep({ variant, siteName, url, onContinue, onDetails, onBack, onSaveAndExit }: ConnectedProps) {
  const heading = variant === 'empty' ? 'This site is empty' : 'You’re connected';
  const sub =
    variant === 'first-look'
      ? 'Wursor has a safe copy of your site and can start with a first look.'
      : variant === 'content-only'
        ? 'Wursor can work on your pages, posts and images.'
        : 'We will build your site here and publish it to this WordPress when you approve.';
  const cta = variant === 'first-look' ? 'Take a first look' : variant === 'empty' ? 'Tell us about your site' : 'Continue';
  return (
    <Step heading={heading} subheading={sub} onSaveAndExit={onSaveAndExit}>
      <div className="ob-fork-content ob-live">
        <SiteConfirmCard name={siteName} url={url} state="connected" />
        <AccessRow access={variant === 'content-only' ? 'content' : 'full'} />
        {variant === 'first-look' && <Checklist label="Connection progress" items={DONE_ITEMS} />}
        {variant === 'content-only' && (
          <Banner action={onDetails ? { label: 'Details', onClick: onDetails } : undefined}>
            Changing your theme or plugins needs Full access. Your host does not allow that on this plan.
          </Banner>
        )}
        {variant === 'empty' && (
          <p className="ob-note t-body-m ob-note-success">
            <Icon name="shield-check" size={20} />
            <span>Nothing on your WordPress changes until you approve.</span>
          </p>
        )}
      </div>
      <WizardFooter onBack={onBack}>
        <button type="button" className="ob-continue ob-continue-auto t-body-m-strong" onClick={onContinue}>
          {cta}
          {variant === 'first-look' && <Icon name="arrow-right" size={20} />}
        </button>
      </WizardFooter>
    </Step>
  );
}

// ---------------------------------------------------------------- 4p: this site already has pages

export function ExistingPagesStep({ siteName, url, onConnectAsIs, onChooseAnother, onSaveAndExit }: Common & SiteProps & { onConnectAsIs: () => void; onChooseAnother: () => void }) {
  return (
    <Step heading="This site already has pages" subheading="To keep them safe, connect it and work on a safe copy instead of publishing a new site over it." onSaveAndExit={onSaveAndExit}>
      <div className="ob-fork-content ob-live">
        <SiteConfirmCard name={siteName} url={url} state="recognised" />
        <Banner tone="warning">Wursor never publishes a new site over existing pages.</Banner>
      </div>
      <WizardFooter onBack={onChooseAnother} backLabel="Choose another site">
        <button type="button" className="ob-continue ob-continue-auto t-body-m-strong" onClick={onConnectAsIs}>
          Connect it as it is
        </button>
      </WizardFooter>
    </Step>
  );
}
