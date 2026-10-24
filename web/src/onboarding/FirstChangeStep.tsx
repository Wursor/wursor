'use client';

import { useState } from 'react';
import type { ScanAccess } from './scan-data.ts';
import { SuggestionCard } from './SuggestionCard.tsx';
import { TextField } from './TextField.tsx';
import { WizardFooter } from './WizardActions.tsx';
import { WizardShell } from './WizardShell.tsx';

export type FirstChange = { kind: 'suggestion'; id: string } | { kind: 'own'; text: string };

const SUGGESTIONS: Record<ScanAccess, { id: string; title: string; body: string; meta: string }[]> = {
  full: [
    { id: 'phone-number', title: 'Make your phone number easy to tap', body: 'On phones your number is plain text, so visitors have to copy it to call you.', meta: 'About 2 minutes  ·  Changes 2 places' },
    { id: 'opening-hours', title: 'Show today’s opening hours on the home page', body: 'Visitors currently have to open the Contact page to find out if you’re open.', meta: 'About 3 minutes  ·  Changes 1 page' },
    { id: 'image-descriptions', title: 'Describe 3 images for screen readers', body: 'Three photos have no description, so blind visitors hear only a file name.', meta: 'About 2 minutes  ·  Changes 3 pages' },
  ],
  content: [
    { id: 'image-alt', title: 'Fix the missing description on 3 images', body: 'Screen readers cannot describe them, and search engines miss them.', meta: 'About 3 minutes  ·  Changes 3 images' },
    { id: 'hours-everywhere', title: 'Update your opening hours everywhere', body: 'Your Saturday hours differ on two pages.', meta: 'About 2 minutes  ·  Changes 2 pages' },
    { id: 'holiday-notice', title: 'Add a holiday notice to the Contact page', body: 'A short banner for the festive week.', meta: 'About 2 minutes  ·  Changes 1 page' },
  ],
};

type Props = {
  access: ScanAccess;
  onStart: (change: FirstChange) => void;
  onBack?: (() => void) | undefined;
  onSaveAndExit?: (() => void) | undefined;
};

/** Section 6: choose one safe change to begin with, or describe your own (Figma 6a to 6d). */
export function FirstChangeStep({ access, onStart, onBack, onSaveAndExit }: Props) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [own, setOwn] = useState('');
  const ownText = own.trim();
  const ready = chosen !== null || ownText !== '';

  const start = () => {
    if (chosen) onStart({ kind: 'suggestion', id: chosen });
    else if (ownText) onStart({ kind: 'own', text: ownText });
  };

  return (
    <WizardShell step={8} label="Pick a first change" onSaveAndExit={onSaveAndExit} size="medium">
      <div className="ob-wizard-heading">
        <h1 className="t-display-m">Pick a first change</h1>
        <p className="t-body-l">
          {access === 'content'
            ? 'Your site allows Content only, so these are all changes to pages, posts and images. Each is low risk.'
            : 'Taken from the first look. Each one is low risk, so your first approval is quick and safe.'}
        </p>
      </div>
      <div className="ob-suggestions">
        {SUGGESTIONS[access].map((s) => (
          <SuggestionCard
            key={s.id}
            name="first-change"
            value={s.id}
            title={s.title}
            body={s.body}
            meta={s.meta}
            checked={chosen === s.id}
            onChange={(id) => {
              setChosen(id);
              setOwn('');
            }}
          />
        ))}
        <div className="ob-ownchange">
          <TextField
            id="own-change"
            label="Or describe your own change"
            value={own}
            onChange={(v) => {
              setOwn(v);
              if (v.trim() !== '') setChosen(null);
            }}
            placeholder="For example: add a gluten-free section to the menu page"
            autoComplete="off"
          />
        </div>
      </div>
      <WizardFooter onBack={onBack}>
        <button type="button" className="ob-continue ob-continue-auto t-body-m-strong" aria-disabled={!ready} onClick={() => ready && start()}>
          Start this change
        </button>
      </WizardFooter>
    </WizardShell>
  );
}
