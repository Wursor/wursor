'use client';

import { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon.tsx';
import { AccessRow } from './AccessRow.tsx';
import { Checklist, type CheckItem } from './Checklist.tsx';
import { SiteConfirmCard } from './SiteConfirmCard.tsx';
import { WizardShell } from './WizardShell.tsx';

type Props = {
  siteName?: string;
  address?: string;
  /** Time between one task finishing and the next, in ms. */
  stepMs?: number;
  onOpenSite: () => void;
  onUndo: () => void;
  onSaveAndExit?: (() => void) | undefined;
};

/** Section C, last step: a new site is sent to the owner's WordPress, with a backup first and a way back after (Figma C5a, C5b). */
export function PublishStep({ siteName = 'Harbor Bakery', address = 'harborbakery.com', stepMs = 2500, onOpenSite, onUndo, onSaveAndExit }: Props) {
  const [done, setDone] = useState(1);
  const live = done >= 4;

  useEffect(() => {
    if (live) return;
    const id = setTimeout(() => setDone((n) => n + 1), stepMs);
    return () => clearTimeout(id);
  }, [done, live, stepMs]);

  const labels = ['Backed up your WordPress', 'Sending pages and images', `Checking every page on ${address}`, 'Keeping a way back'];
  const items: CheckItem[] = labels.map((label, i) => ({ label, state: i < done ? 'done' : i === done ? 'running' : 'pending' }));

  return (
    <WizardShell step={8} label="Publish" onSaveAndExit={onSaveAndExit} size="medium">
      <div className="ob-wizard-heading">
        <h1 className="t-display-m">{live ? 'Your site is live on your WordPress' : 'Publishing to your WordPress'}</h1>
        <p className="t-body-l">
          {live ? 'You can keep editing in WordPress, or ask Wursor for changes. Either way, Wursor checks first.' : 'Taking a backup of your empty site first, then sending your new site.'}
        </p>
      </div>
      {live ? (
        <>
          <div className="ob-fork-content ob-live">
            <SiteConfirmCard name={siteName} url={address} state="live" note="Published just now · Backup taken before" />
            <AccessRow access="full" />
            <div className="ob-undo-row">
              <button type="button" className="ob-pill ob-pill-ghost t-label-m" onClick={onUndo}>
                <Icon name="undo-16" size={16} />
                Undo this publish
              </button>
            </div>
          </div>
          <div className="ob-wizard-actions ob-actions-end">
            <button type="button" className="ob-continue ob-continue-auto t-body-m-strong" onClick={onOpenSite}>
              Open your site
            </button>
          </div>
        </>
      ) : (
        <Checklist label="Publishing progress" items={items} />
      )}
    </WizardShell>
  );
}
