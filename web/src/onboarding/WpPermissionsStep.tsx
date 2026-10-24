import { Icon, type IconName } from '../ui/Icon.tsx';
import { WizardShell } from './WizardShell.tsx';

type Props = { onContinue: () => void; onBack?: () => void; onSaveAndExit?: () => void };

const ASKS: ReadonlyArray<{ icon: IconName; title: string; detail: string }> = [
  { icon: 'eye', title: 'See your pages, posts and media', detail: 'So Wursor can learn how your site is put together.' },
  { icon: 'pencil', title: 'Change them, only after you approve', detail: 'Every change is made on a safe copy first.' },
  { icon: 'lock', title: 'Never see your password', detail: 'You sign in on WordPress.com, not in Wursor.' },
];

/** Step 6, WordPress.com: what Wursor will ask WordPress.com for, in plain words, before the sign-in window opens. */
export function WpPermissionsStep({ onContinue, onBack, onSaveAndExit }: Props) {
  return (
    <WizardShell step={6} label="Connect your site" onSaveAndExit={onSaveAndExit} size="medium">
      <div className="ob-wizard-heading">
        <h1 className="t-display-m">Sign in with WordPress.com</h1>
        <p className="t-body-l">You will sign in on WordPress.com and choose your site. Wursor asks to:</p>
      </div>
      <div className="ob-fork-content ob-live">
        <ul aria-label="What Wursor asks for" className="ob-asks">
          {ASKS.map((a) => (
            <li key={a.title} className="ob-ask">
              <Icon name={a.icon} size={20} />
              <span className="ob-ask-text">
                <span className="t-body-m-strong">{a.title}</span>
                <span className="t-caption">{a.detail}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="ob-note t-body-m">
          <Icon name="undo" size={20} />
          <span>You can revoke this any time, in WordPress.com or in Wursor.</span>
        </p>
      </div>
      <div className="ob-wizard-actions">
        <div className="ob-wizard-left">
          <button type="button" className="ob-wizard-back t-body-m-strong" onClick={onBack}>
            <Icon name="arrow-left-20" size={20} />
            Back
          </button>
        </div>
        <button type="button" className="ob-continue ob-continue-auto t-body-m-strong" onClick={onContinue}>
          Continue to WordPress.com
          <Icon name="external-link" size={20} />
        </button>
      </div>
    </WizardShell>
  );
}
