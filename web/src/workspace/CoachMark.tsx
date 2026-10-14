import type { CSSProperties } from 'react';

type Props = {
  step: number;
  total: number;
  title: string;
  body: string;
  /** Which side the arrow is on, pointing at the surface being introduced. */
  arrow: 'left' | 'up' | 'down';
  onNext: () => void;
  onSkip: () => void;
  style?: CSSProperties;
};

/** A dismissible callout that introduces one part of the workspace. It never blocks the page, and Skip tour is always there. */
export function CoachMark({ step, total, title, body, arrow, onNext, onSkip, style }: Props) {
  return (
    <div role="dialog" aria-modal="false" aria-label={title} className="ws-coach" data-arrow={arrow} style={style}>
      <p className="ws-coach-step">
        {step} of {total}
      </p>
      <h2 className="ws-coach-title">{title}</h2>
      <p className="ws-coach-body">{body}</p>
      <div className="ws-coach-actions">
        <button type="button" className="ws-coach-skip" onClick={onSkip}>
          Skip tour
        </button>
        <button type="button" className="ws-coach-next" onClick={onNext}>
          Next
        </button>
      </div>
      <span className="ws-coach-arrow" aria-hidden="true" />
    </div>
  );
}
