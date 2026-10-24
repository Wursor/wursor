import type { IconName } from '../ui/Icon.tsx';
import { ProblemCard } from './ProblemCard.tsx';
import { WizardShell } from './WizardShell.tsx';

type Props = {
  heading: string;
  subheading: string;
  icon: IconName;
  title: string;
  body: string;
  primary: string;
  onPrimary: () => void;
  secondary?: string;
  onSecondary?: () => void;
  onSaveAndExit?: (() => void) | undefined;
};

/** A step-6 screen that stopped on a problem: the heading says what happened to the site, the card says why and what to do. */
export function ConnectProblemStep({ heading, subheading, onSaveAndExit, ...card }: Props) {
  return (
    <WizardShell step={6} label="Connect your site" onSaveAndExit={onSaveAndExit} size="medium">
      <div className="ob-wizard-heading">
        <h1 className="t-display-m">{heading}</h1>
        <p className="t-body-l">{subheading}</p>
      </div>
      <div className="ob-fork-content ob-live">
        <ProblemCard {...card} />
      </div>
    </WizardShell>
  );
}
