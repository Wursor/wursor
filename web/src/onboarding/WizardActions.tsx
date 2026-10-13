import { Icon } from '../ui/Icon.tsx';

type Props = {
  onBack?: (() => void) | undefined;
  onSkip?: (() => void) | undefined;
  /** Hide Skip for steps that cannot be skipped. */
  canSkip?: boolean;
  onContinue: () => void;
  /** False shows Continue quiet; pressing it does nothing. */
  ready: boolean;
  continueLabel?: string;
};

/** Back and Skip on the left, Continue on the right. On a phone Continue goes on top at full width. */
export function WizardActions({ onBack, onSkip, canSkip = true, onContinue, ready, continueLabel = 'Continue' }: Props) {
  return (
    <div className="ob-wizard-actions">
      <div className="ob-wizard-left">
        <button type="button" className="ob-wizard-back t-body-m-strong" onClick={onBack}>
          <Icon name="arrow-left-20" size={20} />
          Back
        </button>
        {canSkip && (
          <button type="button" className="ob-skip t-label-m" onClick={onSkip}>
            Skip for now
          </button>
        )}
      </div>
      <button
        type="button"
        className="ob-continue ob-continue-auto t-body-m-strong"
        aria-disabled={!ready}
        onClick={() => {
          if (ready) onContinue();
        }}
      >
        {continueLabel}
      </button>
    </div>
  );
}

/** Back on the left and anything on the right: for screens whose main action is not a plain Continue. */
export function WizardFooter({ onBack, backLabel = 'Back', children }: { onBack?: (() => void) | undefined; backLabel?: string; children?: React.ReactNode }) {
  return (
    <div className="ob-wizard-actions">
      <div className="ob-wizard-left">
        <button type="button" className="ob-wizard-back t-body-m-strong" onClick={onBack}>
          <Icon name="arrow-left-20" size={20} />
          {backLabel}
        </button>
      </div>
      {children}
    </div>
  );
}
