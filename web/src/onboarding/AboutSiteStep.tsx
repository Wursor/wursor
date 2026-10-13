'use client';

import { useState } from 'react';
import { SegmentedControl } from '../product/SegmentedControl.tsx';
import { WizardActions } from './WizardActions.tsx';
import { WizardShell } from './WizardShell.tsx';

export type Tone = 'warm' | 'clean' | 'bold';
export type SiteBrief = { business: string; audience: string; action: string; pages: string[]; tone: Tone };

type Props = {
  onContinue: (brief: SiteBrief) => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
};

const PAGES = ['Home', 'Menu', 'About', 'Contact', 'Shop', 'Blog', 'Gallery'] as const;
const TONES = [
  { value: 'warm', label: 'Warm and friendly' },
  { value: 'clean', label: 'Clean and simple' },
  { value: 'bold', label: 'Bold and modern' },
] as const;

function Field({ id, label, placeholder, value, onChange }: { id: string; label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="ob-textfield">
      <label htmlFor={id} className="t-label-m">
        {label}
      </label>
      <div className="ob-field ob-field-md">
        <input id={id} type="text" value={value} placeholder={placeholder} className="ob-input t-body-m" onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

/** Step 5, Cloud path: a short brief (what, who, what to do, which pages, what feel) so Wursor can design three looks. */
export function AboutSiteStep({ onContinue, onBack, onSaveAndExit }: Props) {
  const [business, setBusiness] = useState('');
  const [audience, setAudience] = useState('');
  const [action, setAction] = useState('');
  const [pages, setPages] = useState<string[]>(['Home']);
  const [tone, setTone] = useState<Tone>('warm');

  const answered = [business, audience, action].some((v) => v.trim() !== '');
  const togglePage = (p: string) => setPages((cur) => PAGES.filter((x) => (x === p ? !cur.includes(p) : cur.includes(x))));

  return (
    <WizardShell step={5} label="About your site" onSaveAndExit={onSaveAndExit} size="medium">
      <div className="ob-wizard-heading">
        <h1 className="t-display-m">Tell us about your site</h1>
        <p className="t-body-l">Five short questions. You can skip any of them.</p>
      </div>
      <div className="ob-form ob-form-tight">
        <Field id="business" label="What does your business do?" placeholder="For example: a neighbourhood bakery" value={business} onChange={setBusiness} />
        <Field id="audience" label="Who is it for?" placeholder="For example: people who live nearby" value={audience} onChange={setAudience} />
        <Field id="action" label="What should visitors do?" placeholder="For example: call us, or book a table" value={action} onChange={setAction} />
        <div className="ob-group ob-group-tight">
          <p id="pages-label" className="t-label-m">
            Which pages do you want?
          </p>
          <div role="group" aria-labelledby="pages-label" className="ob-chips">
            {PAGES.map((p) => (
              <button key={p} type="button" aria-pressed={pages.includes(p)} className="ob-chip t-label-m" onClick={() => togglePage(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="ob-group ob-group-tight ob-tone">
          <p className="t-label-m">What should it feel like?</p>
          <SegmentedControl label="What should it feel like?" options={TONES} value={tone} onChange={setTone} />
        </div>
      </div>
      <WizardActions
        ready={answered}
        canSkip={false}
        continueLabel="Show me three looks"
        onBack={onBack}
        onContinue={() => onContinue({ business: business.trim(), audience: audience.trim(), action: action.trim(), pages, tone })}
      />
    </WizardShell>
  );
}
