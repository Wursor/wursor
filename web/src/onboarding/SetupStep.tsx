'use client';

import { useEffect, useState } from 'react';
import { Banner } from '../ui/Banner.tsx';
import { Icon } from '../ui/Icon.tsx';
import { Checklist } from './Checklist.tsx';
import { WizardShell } from './WizardShell.tsx';

type Props = {
  siteName: string;
  address: string;
  /** How long each setup task takes. */
  stepMs?: number;
  onConnectDomain: () => void;
  onLater: () => void;
  onSaveAndExit?: () => void;
};

const TASKS = ['Creating your site', 'Installing your look', 'Securing the connection', 'Taking the first backup'] as const;


/** Step 8, Cloud path: the site is set up task by task, then it is live on a temporary address. */
export function SetupStep({ siteName, address, stepMs = 2500, onConnectDomain, onLater, onSaveAndExit }: Props) {
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (done >= TASKS.length) return;
    const id = setTimeout(() => setDone((n) => n + 1), stepMs);
    return () => clearTimeout(id);
  }, [done, stepMs]);

  const live = done >= TASKS.length;

  return (
    <WizardShell step={8} label="Go live" onSaveAndExit={onSaveAndExit} size="medium">
      {live ? (
        <>
          <div className="ob-wizard-heading">
            <h1 className="t-display-m">Your site is live</h1>
            <p className="t-body-l">It is on a temporary address for now. Connect your own web address when you are ready.</p>
          </div>
          <div className="ob-fork-content ob-live">
            <div className="ob-sitecard">
              <div className="ob-sitecard-top">
                <span className="ob-sitecard-avatar t-title-s" aria-hidden="true">
                  {siteName.charAt(0).toUpperCase()}
                </span>
                <span className="ob-sitecard-text">
                  <span className="t-title-s">{siteName}</span>
                  <span className="t-caption">{address}</span>
                </span>
                <span className="ob-sitecard-status t-label-m">
                  <Icon name="check-circle" size={20} />
                  Live
                </span>
              </div>
              <div className="ob-sitecard-foot t-body-m">
                <Icon name="shield-check" size={20} />
                Hosted by Wursor Cloud. Backed up daily and kept up to date.
              </div>
            </div>
            <Banner>Search engines cannot see this address yet. They will once your own web address is connected.</Banner>
          </div>
          <div className="ob-wizard-actions">
            <button type="button" className="ob-later t-body-m-strong" onClick={onLater}>
              Do this later
            </button>
            <button type="button" className="ob-continue ob-continue-auto t-body-m-strong" onClick={onConnectDomain}>
              Connect your web address
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="ob-wizard-heading">
            <h1 className="t-display-m">Setting up your site</h1>
            <p className="t-body-l">Your site is approved. We are getting its home ready.</p>
          </div>
          <div className="ob-fork-content ob-setup">
            <Checklist
              label="Setup progress"
              items={TASKS.map((label, i) => ({ label, state: i < done ? 'done' : i === done ? 'running' : 'pending' }))}
            />
            <p className="ob-note t-body-m">
              <Icon name="info" size={20} />
              <span>This usually takes a few minutes. You can close this page; we will email you when it is ready.</span>
            </p>
          </div>
        </>
      )}
    </WizardShell>
  );
}
