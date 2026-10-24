'use client';

import { useState } from 'react';
import { RadioCard } from './RadioCard.tsx';
import { RadioGroupLabel } from './RadioGroupLabel.tsx';
import { WizardActions } from './WizardActions.tsx';
import { WizardShell } from './WizardShell.tsx';

export type WpSite = { id: string; name: string; detail: string };

type Props = {
  sites: readonly WpSite[];
  onContinue: (siteId: string) => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
};

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

/** Step 6, WordPress.com: pick which of the person's sites Wursor should work on. The first is chosen to begin with. */
export function ChooseWpSiteStep({ sites, onContinue, onBack, onSaveAndExit }: Props) {
  const [chosen, setChosen] = useState(sites[0]?.id ?? '');
  const count = sites.length < WORDS.length ? WORDS[sites.length] : String(sites.length);
  return (
    <WizardShell step={6} label="Connect your site" onSaveAndExit={onSaveAndExit} size="medium">
      <div className="ob-wizard-heading">
        <h1 className="t-display-m">Choose your site</h1>
        <p className="t-body-l">You have {count} sites on WordPress.com. Wursor will work on the one you pick.</p>
      </div>
      <div className="ob-fork-content ob-live">
        <RadioGroupLabel label="Choose your site" className="ob-radio-stack ob-radio-stack-lg">
          {sites.map((s) => (
            <RadioCard key={s.id} name="wpsite" value={s.id} title={s.name} description={s.detail} checked={chosen === s.id} onChange={setChosen} />
          ))}
        </RadioGroupLabel>
      </div>
      <WizardActions ready={chosen !== ''} canSkip={false} continueLabel="Connect this site" onBack={onBack} onContinue={() => onContinue(chosen)} />
    </WizardShell>
  );
}
