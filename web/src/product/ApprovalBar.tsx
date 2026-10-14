import { Icon } from '../ui/Icon.tsx';
import { Button } from './Button.tsx';

type Props = {
  title: string;
  meta: string;
  /** Ready asks for approval; publishing shows progress; published confirms, with Undo one click away. */
  state?: 'ready' | 'publishing' | 'published';
  /** 0 to 1, shown while publishing. */
  progress?: number;
  onApprove?: (() => void) | undefined;
  onAskChanges?: (() => void) | undefined;
  onUndo?: (() => void) | undefined;
  liveUrl?: string;
};

/** The decision point. Ready: approve or ask for changes. Publishing: progress. Published: confirmation with Undo always one click away. */
export function ApprovalBar({ title, meta, state = 'ready', progress = 0, onApprove, onAskChanges, onUndo, liveUrl = '#' }: Props) {
  return (
    <div className="p-approval" data-state={state}>
      <span className="p-approval-icon" data-state={state}>
        <Icon name={state === 'publishing' ? 'loader' : state === 'published' ? 'rocket' : 'check-circle'} size={20} className={state === 'publishing' ? 'p-spin' : undefined} />
      </span>
      <div className="p-approval-text">
        <p className="p-approval-title">{title}</p>
        <p className="p-approval-meta">{meta}</p>
      </div>
      {state === 'ready' && (
        <>
          {onAskChanges && (
            <Button variant="secondary" size="md" onClick={onAskChanges}>
              Ask for changes
            </Button>
          )}
          <Button variant="primary" size="md" trailingIcon="arrow-right" onClick={onApprove}>
            Approve and publish
          </Button>
        </>
      )}
      {state === 'publishing' && (
        <div role="progressbar" aria-label="Publishing" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} className="p-approval-progress">
          <span style={{ width: `${progress * 100}%` }} />
        </div>
      )}
      {state === 'published' && (
        <>
          <a href={liveUrl} className="p-btn p-btn-ghost p-btn-md">
            <Icon name="external-link-16" size={16} />
            <span>View live site</span>
          </a>
          <Button variant="secondary" size="md" leadingIcon="undo-16" onClick={onUndo}>
            Undo
          </Button>
        </>
      )}
    </div>
  );
}
