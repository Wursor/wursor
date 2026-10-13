'use client';

import { useEffect, useRef, useState } from 'react';
import { Banner } from '../ui/Banner.tsx';
import { SegmentedControl } from '../product/SegmentedControl.tsx';
import { RadioCard } from './RadioCard.tsx';
import { WizardActions } from './WizardActions.tsx';
import { WizardShell } from './WizardShell.tsx';

export type Role = 'owner' | 'agency' | 'in-house';
export type SiteCount = '1' | '2-5' | '6+';
export type WorkspaceAnswers = { name: string; role: Role; sites: SiteCount };

type Props = {
  onContinue: (answers: WorkspaceAnswers) => void;
  onSkip?: () => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
};

const ROLES: ReadonlyArray<{ value: Role; title: string; description: string }> = [
  { value: 'owner', title: 'Owner', description: 'I run the business and approve changes myself.' },
  { value: 'agency', title: 'Agency', description: 'I manage WordPress sites for clients.' },
  { value: 'in-house', title: 'In-house', description: 'I look after my company’s site as part of a team.' },
];

const SITE_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2-5', label: '2 to 5' },
  { value: '6+', label: '6 or more' },
] as const;

/** Step 3: name the workspace, say who you are, say how many sites. Two quick questions with sensible defaults. */
export function WorkspaceStep({ onContinue, onSkip, onBack, onSaveAndExit }: Props) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [sites, setSites] = useState<SiteCount>('1');
  const nameRef = useRef<HTMLInputElement>(null);
  useEffect(() => nameRef.current?.focus(), []);

  const trimmed = name.trim();
  const ready = trimmed !== '' && role !== null;
  const agency = role === 'agency';

  return (
    <WizardShell step={3} label="Name your workspace" onSaveAndExit={onSaveAndExit} compact={agency}>
      <div className="ob-wizard-heading">
        <h1 className="t-display-m">Name your workspace</h1>
        <p className="t-body-l">Two quick questions so Wursor starts with the right defaults. You can change both later.</p>
      </div>
      <div className="ob-form" data-compact={agency ? 'true' : undefined}>
        <div className="ob-textfield">
          <label htmlFor="business" className="t-label-m">
            What&apos;s your business called?
          </label>
          <div className="ob-field">
            <input
              ref={nameRef}
              id="business"
              type="text"
              value={name}
              placeholder="Harbor Bakery"
              autoComplete="organization"
              className="ob-input t-body-m"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="ob-group">
          <p id="role-label" className="t-body-m-strong">
            What best describes you?
          </p>
          <div role="radiogroup" aria-labelledby="role-label" className="ob-radio-stack">
            {ROLES.map((r) => (
              <RadioCard key={r.value} name="role" {...r} checked={role === r.value} onChange={() => setRole(r.value)} />
            ))}
          </div>
        </div>
        <div className="ob-group ob-sites">
          <p className="t-body-m-strong">How many sites will you connect?</p>
          <SegmentedControl label="How many sites will you connect?" options={SITE_OPTIONS} value={sites} onChange={setSites} />
        </div>
        {agency && <Banner>As an agency, your sites will be grouped by client. Every feature stays the same.</Banner>}
      </div>
      <WizardActions
        ready={ready}
        onBack={onBack}
        onSkip={onSkip}
        onContinue={() => role && onContinue({ name: trimmed, role, sites })}
      />
    </WizardShell>
  );
}
