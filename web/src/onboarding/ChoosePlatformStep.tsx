'use client';

import { useState } from 'react';
import { Icon } from '../ui/Icon.tsx';
import { RadioCard } from './RadioCard.tsx';
import { RadioGroupLabel } from './RadioGroupLabel.tsx';
import { WizardActions } from './WizardActions.tsx';
import { WizardShell } from './WizardShell.tsx';

export type Platform = 'wpcom' | 'other';

type Props = {
  onContinue: (platform: Platform) => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
};

/** Step 5, connect path: is the site on WordPress.com (sign in) or somewhere else (address, then approve or a code)? */
export function ChoosePlatformStep({ onContinue, onBack, onSaveAndExit }: Props) {
  const [platform, setPlatform] = useState<Platform | null>(null);
  return (
    <WizardShell step={5} label="Where is your site?" onSaveAndExit={onSaveAndExit} size="medium">
      <div className="ob-wizard-heading">
        <h1 className="t-display-m">Where is your site?</h1>
        <p className="t-body-l">This tells Wursor how to connect. If you are not sure, choose somewhere else and we will check.</p>
      </div>
      <div className="ob-fork-content ob-live">
        <RadioGroupLabel label="Where is your site?" className="ob-radio-stack ob-radio-stack-lg">
          <RadioCard
            name="platform"
            value="wpcom"
            title="My site is on WordPress.com"
            description="You sign in with WordPress.com and choose the site. No plugin to install."
            checked={platform === 'wpcom'}
            onChange={() => setPlatform('wpcom')}
          />
          <RadioCard
            name="platform"
            value="other"
            title="My site is somewhere else"
            description="On another host. You enter the address, then approve the connection or enter a short code."
            checked={platform === 'other'}
            onChange={() => setPlatform('other')}
          />
        </RadioGroupLabel>
        <p className="ob-note t-body-m ob-note-success">
          <Icon name="shield-check" size={20} />
          <span>Wursor can see your site but cannot change it without your approval.</span>
        </p>
      </div>
      <WizardActions ready={platform !== null} canSkip={false} onBack={onBack} onContinue={() => platform && onContinue(platform)} />
    </WizardShell>
  );
}
