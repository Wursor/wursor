'use client';

import { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon.tsx';
import { Checklist, type CheckItem } from './Checklist.tsx';
import { WizardActions } from './WizardActions.tsx';
import { WizardShell } from './WizardShell.tsx';

type Props = {
  /** What the sign-in window ends up doing. The real signal comes from the service; this stands in for it. */
  outcome?: 'approved' | 'closed';
  stepMs?: number;
  onApproved: () => void;
  onClosed?: () => void;
  onReopen?: () => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
};

const TASKS = ['Opened WordPress.com', 'Waiting for your approval', 'Reading your site', 'Safe copy ready'] as const;

/** Step 6, WordPress.com: the sign-in window is open; Wursor waits for approval, then reads the site and makes a safe copy. */
export function WpWaitingStep({ outcome = 'approved', stepMs = 2000, onApproved, onClosed, onReopen, onBack, onSaveAndExit }: Props) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= TASKS.length - 1) return;
    const id = setTimeout(() => setN((v) => v + 1), stepMs);
    return () => clearTimeout(id);
  }, [n, stepMs]);
  useEffect(() => {
    if (outcome === 'closed' && n === 2) onClosed?.();
  }, [outcome, n, onClosed]);

  const items: CheckItem[] = TASKS.map((label, i) => ({ label, state: i < n + 1 ? 'done' : i === n + 1 ? 'running' : 'pending' }));
  const approved = outcome === 'approved' && n >= TASKS.length - 1;

  return (
    <WizardShell step={6} label="Connect your site" onSaveAndExit={onSaveAndExit} size="medium">
      <div className="ob-wizard-heading">
        <h1 className="t-display-m">Finish signing in on WordPress.com</h1>
        <p className="t-body-l">A new window is open. Choose your site there, approve, and come back here.</p>
      </div>
      <div className="ob-fork-content ob-setup">
        <Checklist label="Connection progress" items={items} />
        <button type="button" className="ob-pill ob-pill-secondary t-label-m ob-reopen" onClick={onReopen}>
          <Icon name="external-link-16" size={16} />
          Open the window again
        </button>
      </div>
      <WizardActions ready={approved} canSkip={false} continueLabel="I have approved it" onBack={onBack} onContinue={onApproved} />
    </WizardShell>
  );
}
