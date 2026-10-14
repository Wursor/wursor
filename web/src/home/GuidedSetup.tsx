import { Icon } from '../ui/Icon.tsx';
import { Button } from '../product/Button.tsx';

export type GuidedStep = { state: 'done' | 'next' | 'todo'; title: string; detail: string };
const STATE_LABEL = { done: 'Done', next: 'Next', todo: 'To do' } as const;

/** The first-run checklist on Home: how far along the owner is, and the one thing to do next. */
export function GuidedSetup({ steps, onContinue }: { steps: readonly GuidedStep[]; onContinue?: (() => void) | undefined }) {
  const done = steps.filter((s) => s.state === 'done').length;
  return (
    <section aria-label="Guided setup" className="app-guided">
      <div className="app-guided-head">
        <div className="app-guided-row">
          <h2>Guided setup</h2>
          <span>
            {done} of {steps.length} done
          </span>
        </div>
        <div className="app-guided-track" role="progressbar" aria-label="Setup progress" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={done}>
          <span style={{ width: `calc(${done / steps.length} * 316px)` }} />
        </div>
      </div>
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
    </section>
  );
}
