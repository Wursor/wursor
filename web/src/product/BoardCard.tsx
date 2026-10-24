import { RiskChip } from './RiskChip.tsx';
import { StatusPill, type Status } from './StatusPill.tsx';

type Props = {
  status: Status;
  title: string;
  meta: string;
  risk?: 'everyday';
  /** 0 to 1. Shown on a working change. */
  progress?: number;
  /** Where the card goes when pressed. Without it the card is just a picture of a change. */
  href?: string;
};

/** One change on the board. A change that needs the owner is outlined in the accent colour and says why. */
export function BoardCard({ status, title, meta, risk, progress, href }: Props) {
  const Tag = href ? 'a' : 'div';
  return (
    <Tag className="p-boardcard" data-status={status} {...(href ? { href } : {})}>
      <p className="p-boardcard-title">{title}</p>
      <p className="p-boardcard-meta">{meta}</p>
      <div className="p-boardcard-footer">
        <StatusPill status={status} />
        {status === 'working' && risk && <RiskChip level={risk} />}
      </div>
      {status === 'working' && progress !== undefined && (
        <div
          role="progressbar"
          aria-label={title}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          className="p-progress"
        >
          <span className="p-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      )}
      {status === 'needs-you' && <p className="p-boardcard-ask">Wursor is waiting for your answer</p>}
    </Tag>
  );
}
