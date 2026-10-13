type Props = { step: number; total?: number; label: string };

/** Setup progress (Figma "Step Indicator"): one segment per step, filled with the accent up to the current one. */
export function StepIndicator({ step, total = 8, label }: Props) {
  return (
    <div
      className="ob-steps"
      role="progressbar"
      aria-label="Setup progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-valuetext={`${label}, step ${step} of ${total}`}
    >
      <div className="ob-steps-bar" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} data-segment="" data-filled={i < step ? 'true' : 'false'} className="ob-step-seg" />
        ))}
      </div>
      <div className="ob-steps-label" aria-hidden="true">
        <span className="t-label-m">{label}</span>
        <span className="t-caption">
          {step} of {total}
        </span>
      </div>
    </div>
  );
}
