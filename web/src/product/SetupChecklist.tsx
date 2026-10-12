import { Icon } from '../ui/Icon.tsx';
import { Button } from './Button.tsx';

export type SetupStepData = { state: 'done' | 'next' | 'todo'; title: string; detail: string };

const STATE_LABEL = { done: 'Done', next: 'Next', todo: 'To do' } as const;

type Props = { steps: readonly SetupStepData[]; onContinue?: (() => void) | undefined };

/** The first-run checklist: what is done, what is next (with Continue), and what is still to do. */
export function SetupChecklist({ steps, onContinue }: Props) {
  return (
    <div className="p-card">
      <ol aria-label="Setup steps" className="p-setup">
        {steps.map((s) => (
          <li key={s.title} className="p-setupstep" data-state={s.state} aria-current={s.state === 'next' ? 'step' : undefined}>
            <span className="p-setup-marker" aria-hidden="true">
              {s.state === 'done' && <Icon name="check" size={20} />}
            </span>
            <span className="p-setup-text">
              <span className="sr-only">{STATE_LABEL[s.state]}</span>
              <span className="p-setup-title">{s.title}</span>
              <span className="p-setup-detail">{s.detail}</span>
            </span>
            {s.state === 'next' && (
              <Button variant="primary" onClick={onContinue}>
                Continue
              </Button>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
