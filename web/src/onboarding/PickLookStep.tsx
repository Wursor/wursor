'use client';

import { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon.tsx';
import { LOOKS, LookPreview, type LookId } from './LookPreview.tsx';
import { RadioGroupLabel } from './RadioGroupLabel.tsx';
import { WizardActions } from './WizardActions.tsx';
import { WizardShell } from './WizardShell.tsx';

type Props = {
  onContinue: (look: LookId) => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
  /** How long each further look takes to be designed. The first is ready at once. */
  stepMs?: number;
};

/** Step 6, Cloud path: three real previews of the homepage; the first appears at once, the others as they are designed. */
export function PickLookStep({ onContinue, onBack, onSaveAndExit, stepMs = 1800 }: Props) {
  const [ready, setReady] = useState(1);
  const [look, setLook] = useState<LookId | null>(null);

  useEffect(() => {
    if (ready >= LOOKS.length) return;
    const id = setTimeout(() => setReady((n) => n + 1), stepMs);
    return () => clearTimeout(id);
  }, [ready, stepMs]);

  // A stand-in: asking for more looks designs the same three again until the designer service exists.
  const more = () => {
    setLook(null);
    setReady(1);
  };

  return (
    <WizardShell step={6} label="Pick a look" onSaveAndExit={onSaveAndExit} size="wide">
      <div className="ob-wizard-heading ob-wizard-heading-center">
        <h1 className="t-display-m">Pick a look</h1>
        <p className="t-body-l">These are real previews of your homepage. You can change everything later.</p>
      </div>
      <div className="ob-fork-content">
        <RadioGroupLabel label="Pick a look" className="ob-paths ob-looks">
          {LOOKS.map((l, i) =>
            i < ready ? (
              <label key={l.id} className="ob-lookcard" data-checked={look === l.id ? 'true' : 'false'}>
                <input type="radio" className="sr-only" name="look" value={l.id} checked={look === l.id} onChange={() => setLook(l.id)} />
                <span className="ob-look-wrap">
                  <LookPreview look={l.id} />
                </span>
                <span className="ob-lookcard-text">
                  <span className="ob-lookcard-copy">
                    <span className="t-body-m-strong">{l.title}</span>
                    <span className="t-caption">{l.description}</span>
                  </span>
                  {look === l.id && <Icon name="check-circle" size={20} />}
                </span>
              </label>
            ) : (
              <div key={l.id} className="ob-lookcard" aria-busy="true">
                <span className="ob-look-wrap ob-look-wrap-loading">
                  <Icon name="loader" size={20} className="ob-spin" />
                  <span className="t-caption">Designing this look…</span>
                </span>
                <span className="ob-lookcard-text">
                  <span className="ob-lookcard-copy">
                    <span className="t-body-m-strong">Look in progress</span>
                    <span className="t-caption">This takes a few seconds.</span>
                  </span>
                </span>
              </div>
            ),
          )}
        </RadioGroupLabel>
        {ready >= LOOKS.length && (
          <button type="button" className="ob-link-inline t-label-m" onClick={more}>
            Show me three more looks
          </button>
        )}
      </div>
      <WizardActions ready={look !== null} canSkip={false} continueLabel="Use this look" onBack={onBack} onContinue={() => look && onContinue(look)} />
    </WizardShell>
  );
}
