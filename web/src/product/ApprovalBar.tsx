import { Icon } from '../ui/Icon.tsx';
import { Button } from './Button.tsx';

type Props = { title: string; meta: string; onApprove?: () => void };

/** The decision point. Ready state only: approve, or (later) ask for changes. Publishing and Published are not designed here yet. */
export function ApprovalBar({ title, meta, onApprove }: Props) {
  return (
    <div className="p-approval">
      <span className="p-approval-icon">
        <Icon name="check-circle" size={20} />
      </span>
      <div className="p-approval-text">
        <p className="p-approval-title">{title}</p>
        <p className="p-approval-meta">{meta}</p>
      </div>
      <Button variant="primary" size="md" trailingIcon="arrow-right" onClick={onApprove}>
        Approve and publish
      </Button>
    </div>
  );
}
