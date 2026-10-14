import { Button } from '../product/Button.tsx';
import { RiskChip } from '../product/RiskChip.tsx';

type Props = { steps: readonly string[]; meta: string; onStart?: (() => void) | undefined; onEdit?: (() => void) | undefined };

/** What Wursor will do, in the order it will do it. Nothing starts until the owner presses Start. */
export function PlanCard({ steps, meta, onStart, onEdit }: Props) {
  return (
    <section className="p-plan" aria-label="The plan">
      <p className="p-plan-eyebrow">The plan</p>
      <ol className="p-plan-steps">
        {steps.map((s, i) => (
          <li key={s}>
            <span className="p-plan-num">{i + 1}</span>
            <span className="p-plan-text">{s}</span>
          </li>
        ))}
      </ol>
      <div className="p-plan-meta">
        <RiskChip level="everyday" />
        <span>{meta}</span>
      </div>
      <div className="p-plan-actions">
        <Button variant="primary" size="md" leadingIcon="play" onClick={onStart}>
          Start
        </Button>
        <Button variant="secondary" size="md" leadingIcon="pencil" onClick={onEdit}>
          Edit plan
        </Button>
      </div>
    </section>
  );
}
