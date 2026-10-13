'use client';

import { useState } from 'react';
import { Icon, type IconName } from '../ui/Icon.tsx';
import { RadioMark } from './RadioMark.tsx';
import { WizardActions } from './WizardActions.tsx';
import { WizardShell } from './WizardShell.tsx';

export type Path = 'cloud' | 'connect' | 'build';

type Props = {
  onContinue: (path: Path) => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
};

const PATHS: ReadonlyArray<{ value: Path; icon: IconName; iconSize: number; tag: string; title: string; body: string; footer: string }> = [
  {
    value: 'cloud', icon: 'cloud', iconSize: 18.5, tag: 'Recommended for new sites', title: 'Start on Wursor Cloud',
    body: 'We host it for you. We handle the address, security, updates and backups. Best if you do not have a site yet.',
    footer: 'Move out any time. It is free.',
  },
  {
    value: 'connect', icon: 'plug', iconSize: 20, tag: 'For a site you already have', title: 'Connect my WordPress',
    body: 'Keep your site where it is. Wursor works on a safe copy and publishes changes to it after you approve.',
    footer: 'Your site stays where it is.',
  },
  {
    value: 'build', icon: 'rocket', iconSize: 20, tag: 'For a new site on your WordPress', title: 'Build here, publish to my WordPress',
    body: 'Start from a short brief and publish to a WordPress you own, such as an empty or new WordPress.com site.',
    footer: 'You keep your own host.',
  },
];

/** Step 4: where the site lives. Three starting paths; the choice can be changed later. */
export function ForkStep({ onContinue, onBack, onSaveAndExit }: Props) {
  const [path, setPath] = useState<Path | null>(null);
  return (
    <WizardShell step={4} label="Where should your site live?" onSaveAndExit={onSaveAndExit} size="wide">
      <div className="ob-wizard-heading ob-wizard-heading-center">
        <h1 className="t-display-m">Where should your site live?</h1>
        <p className="t-body-l">You can change your mind later. Moving out is free.</p>
      </div>
      <div className="ob-fork-content">
        <div role="radiogroup" aria-label="Where should your site live?" className="ob-paths">
          {PATHS.map((p) => (
            <label key={p.value} className="ob-pathcard" data-checked={path === p.value ? 'true' : 'false'}>
              <input type="radio" className="sr-only" name="path" value={p.value} checked={path === p.value} onChange={() => setPath(p.value)} />
              <span className="ob-path-top">
                <span className="ob-icon-wrap" aria-hidden="true">
                  <Icon name={p.icon} size={p.iconSize} />
                </span>
                <span className="ob-path-radio" aria-hidden="true">
                  {path === p.value ? <RadioMark /> : <span className="ob-radio-circle" />}
                </span>
              </span>
              <span className="ob-tag t-label-s">{p.tag}</span>
              <span className="ob-path-title t-title-s">{p.title}</span>
              <span className="ob-path-body t-body-m">{p.body}</span>
              <span className="ob-divider" aria-hidden="true" />
              <span className="ob-path-foot">
                <Icon name="undo-16" size={16} />
                <span className="t-caption">{p.footer}</span>
              </span>
            </label>
          ))}
        </div>
        <button type="button" className="ob-link-inline t-label-m" onClick={() => setPath('cloud')}>
          Not sure? Start on Wursor Cloud and move later.
        </button>
      </div>
      <WizardActions ready={path !== null} canSkip={false} onBack={onBack} onContinue={() => path && onContinue(path)} />
    </WizardShell>
  );
}
