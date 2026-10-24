'use client';

import { useEffect, useState } from 'react';
import { Banner } from '../ui/Banner.tsx';
import { Icon } from '../ui/Icon.tsx';
import { Checklist, type CheckItem } from '../onboarding/Checklist.tsx';
import { RadioCard } from '../onboarding/RadioCard.tsx';
import { ScanFinding } from '../onboarding/ScanFinding.tsx';
import { SiteConfirmCard } from '../onboarding/SiteConfirmCard.tsx';
import { WizardFooter } from '../onboarding/WizardActions.tsx';
import { WizardShell } from '../onboarding/WizardShell.tsx';

export type MovePhase = 'choose' | 'gate' | 'what' | 'copying' | 'ready' | 'review' | 'moved' | 'hosted' | 'problem';

type Props = {
  /** `out` moves a Cloud site to the owner's own WordPress; `in` hosts a WordPress site on Wursor Cloud. */
  direction: 'out' | 'in';
  /** Moving out: `problem` makes the copy stop before switching. */
  scenario?: 'ok' | 'problem';
  /** Hosting in: Content only means full access is asked for first. */
  access?: 'full' | 'content';
  siteName?: string;
  /** Time between one task finishing and the next, in ms. */
  stepMs?: number;
  /** Opens a screen straight away, for the fixed design states. */
  initialPhase?: MovePhase;
  onDone: () => void;
  onCancel: () => void;
  onSaveAndExit?: (() => void) | undefined;
};

const OUT_STEPS = ['Checking your WordPress is ready', 'Copying pages and posts', 'Copying media', 'Copying theme, plugins and settings', 'Comparing the copy with your site'];
const IN_STEPS = ['Reading your WordPress', 'Copying pages, media and theme', 'Checking the copy on a preview address'];

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="ob-wizard-heading">
      <h1 className="t-display-m">{title}</h1>
      <p className="t-body-l">{sub}</p>
    </div>
  );
}

function Cta({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="ob-continue ob-continue-auto t-body-m-strong" onClick={onClick}>
      {label}
    </button>
  );
}

function End({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="ob-wizard-actions ob-actions-end">
      <Cta label={label} onClick={onClick} />
    </div>
  );
}

/** Moving a site between Wursor Cloud and the owner's own WordPress, in either direction (Figma M1 to M11). Nothing is switched until the owner approves. */
export function MoveFlow({ direction, scenario = 'ok', access = 'full', siteName = 'Harbor Bakery', stepMs = 2500, initialPhase, onDone, onCancel, onSaveAndExit }: Props) {
  const out = direction === 'out';
  const [phase, setPhase] = useState<MovePhase>(initialPhase ?? (out ? 'choose' : access === 'content' ? 'gate' : 'what'));
  const [where, setWhere] = useState('wpcom');
  const [mode, setMode] = useState('full');
  const [done, setDone] = useState(0);
  const [failing, setFailing] = useState(scenario === 'problem');
  const steps = out ? OUT_STEPS : IN_STEPS;

  const start = () => {
    setDone(0);
    setPhase('copying');
  };

  useEffect(() => {
    if (phase !== 'copying') return;
    if (out && failing && done >= 3) {
      setPhase('problem');
      return;
    }
    if (done >= steps.length) {
      setPhase(out ? 'ready' : 'review');
      return;
    }
    const id = setTimeout(() => setDone((n) => n + 1), stepMs);
    return () => clearTimeout(id);
  }, [phase, done, steps.length, stepMs, out, failing]);

  const shell = (children: React.ReactNode) => (
    <WizardShell onSaveAndExit={onSaveAndExit} size="medium">
      {children}
    </WizardShell>
  );
  const items: CheckItem[] = steps.map((label, i) => ({ label, state: i < done ? 'done' : i === done ? 'running' : 'pending' }));

  if (phase === 'choose') {
    return shell(
      <>
        <Heading title={`Where should ${siteName} live?`} sub="Wursor copies everything to your WordPress. Your site stays on Wursor Cloud and live until you confirm." />
        <div className="ob-fork-content ob-live ob-radios">
          <RadioCard name="where" value="wpcom" title="A WordPress.com site" description="Sign in with WordPress.com and choose a site." checked={where === 'wpcom'} onChange={setWhere} />
          <RadioCard name="where" value="self" title="Self-hosted WordPress" description="Use the Wursor plugin or an application password." checked={where === 'self'} onChange={setWhere} />
        </div>
        <WizardFooter onBack={onCancel} backLabel="Cancel">
          <Cta label="Continue" onClick={() => setPhase('what')} />
        </WizardFooter>
      </>,
    );
  }

  if (phase === 'gate') {
    return shell(
      <>
        <Heading title="Full access is needed to host this site" sub="Wursor can only change content on this site, so it cannot copy your theme and plugins." />
        <div className="ob-fork-content ob-live ob-radios">
          <Banner tone="warning">You can also host the content only. Your theme would be replaced with a Wursor theme.</Banner>
          <RadioCard name="mode" value="full" title="Give Wursor full access" description="Move everything exactly as it is." checked={mode === 'full'} onChange={setMode} />
          <RadioCard name="mode" value="content" title="Host the content only" description="Pages, posts and images move. A new theme is designed." checked={mode === 'content'} onChange={setMode} />
        </div>
        <WizardFooter onBack={onCancel} backLabel="Not now">
          <Cta label="Give Wursor full access" onClick={() => setPhase('what')} />
        </WizardFooter>
      </>,
    );
  }

  if (phase === 'what') {
    return shell(
      <>
        <Heading
          title={out ? 'Here is what will move' : `Host ${siteName} on Wursor Cloud`}
          sub={out ? 'Wursor checked your site and found everything it can carry across.' : 'We copy your site to WeOwn Cloud. Your current site is not changed until you confirm.'}
        />
        <div className="ob-fork-content ob-live ob-findings">
          <ScanFinding icon="file" title="Pages and posts" detail={out ? 'All published and draft content' : 'Read from your WordPress'} state="done" value="24" />
          <ScanFinding icon="file" title="Media" detail={out ? 'Images and files with their descriptions' : 'Images and files'} state="done" value="112" />
          <ScanFinding icon="file" title="Theme, plugins and settings" detail={out ? 'Same versions, same options' : 'Needs Full access, which this site has'} state="done" value="9" />
          {out && <ScanFinding icon="file" title="Forms and email" detail="Your form inbox moves to your WordPress; email stays with your domain host" state="attention" value="Review" />}
          <Banner>{out ? 'Your site stays live on Wursor Cloud until you approve the switch.' : 'Wursor Cloud looks after updates, backups and the certificate. Your plan covers it.'}</Banner>
        </div>
        <WizardFooter onBack={() => setPhase(out ? 'choose' : access === 'content' ? 'gate' : 'what')} backLabel="Back">
          <Cta label={out ? 'Start the move' : 'Copy to Wursor Cloud'} onClick={start} />
        </WizardFooter>
      </>,
    );
  }

  if (phase === 'copying') {
    return shell(
      <>
        <Heading title={out ? 'Copying to your WordPress' : 'Copying to Wursor Cloud'} sub="You can leave this page. We will tell you when it is ready to review." />
        <Checklist label="Move progress" items={items} />
      </>,
    );
  }

  if (phase === 'problem') {
    return shell(
      <>
        <Heading title="We stopped before switching" sub="Your site on Wursor Cloud is untouched and still live." />
        <Checklist
          label="Move progress"
          items={[
            { label: 'Copying pages and posts', state: 'done' },
            { label: 'Copying theme and plugins', state: 'failed', detail: 'Needs attention' },
          ]}
        />
        <div role="alert">
          <Banner tone="danger">Your WordPress host blocked the plugin upload. Allow plugin installs, or move content only.</Banner>
        </div>
        <WizardFooter onBack={onCancel} backLabel="Cancel the move">
          <Cta
            label="Try again"
            onClick={() => {
              setFailing(false);
              start();
            }}
          />
        </WizardFooter>
      </>,
    );
  }

  if (phase === 'ready' || phase === 'review') {
    const isReady = phase === 'ready';
    return shell(
      <>
        <Heading
          title={isReady ? 'The copy matches your site' : 'Your copy is ready on a preview address'}
          sub={isReady ? 'We compared every page. Review it, then approve the switch.' : 'Look it over. Then connect your web address to take it live.'}
        />
        <div className="ob-fork-content ob-live ob-findings">
          <SiteConfirmCard name={siteName} url={isReady ? 'Copy at harborbakery-copy.example.com' : 'harbor-bakery.wursor.site'} state="recognised" />
          <ScanFinding icon="file" title="Pages compared" detail="24 of 24 match" state="done" value="Match" />
          {isReady && <ScanFinding icon="file" title="Forms tested" detail="Contact form delivers" state="done" value="Pass" />}
          {isReady && <Banner tone="warning">Switching points harborbakery.com at your WordPress. Your Cloud copy is kept for 30 days.</Banner>}
        </div>
        <WizardFooter onBack={() => undefined} backLabel={isReady ? 'Review the copy' : 'Open preview'}>
          <Cta label={isReady ? 'Approve and switch' : 'Connect my web address'} onClick={() => setPhase(isReady ? 'moved' : 'hosted')} />
        </WizardFooter>
      </>,
    );
  }

  const moved = phase === 'moved';
  return shell(
    <>
      <Heading
        title={moved ? `${siteName} now lives on your WordPress` : `${siteName} is hosted on Wursor Cloud`}
        sub={moved ? 'Wursor still works on a safe copy and publishes here after you approve.' : 'Your old WordPress is untouched. You can move back out any time.'}
      />
      <div className="ob-fork-content ob-live">
        <SiteConfirmCard name={siteName} url="harborbakery.com" state="connected" note="Wursor works on a safe copy and asks before it publishes." />
        {moved && (
          <p className="ob-note t-body-m">
            <Icon name="clock" size={20} />
            <span>Your Cloud copy is kept for 30 days, then removed. You can download it any time.</span>
          </p>
        )}
      </div>
      <End label={`Open ${siteName}`} onClick={onDone} />
    </>,
  );
}
