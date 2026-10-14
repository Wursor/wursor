import { Icon } from '../ui/Icon.tsx';
import { Button } from './Button.tsx';
import { RiskChip } from './RiskChip.tsx';

type Props = {
  title: string;
  meta: string;
  risk: 'everyday';
  added: number;
  removed: number;
  onSeeChanges?: (() => void) | undefined;
};

/** A change Wursor made to the draft copy. Always shows the risk, how much changed, and a route to the full comparison. */
export function ChangeEvent({ title, meta, risk, added, removed, onSeeChanges }: Props) {
  return (
    <div className="p-change">
      <div className="p-change-top">
        <span className="p-change-tile">
          <Icon name="pencil" size={20} />
        </span>
        <div className="p-change-text">
          <p className="p-change-title">{title}</p>
          <p className="p-change-meta">{meta}</p>
        </div>
        <RiskChip level={risk} />
      </div>
      <div className="p-change-diff">
        <span className="p-diff-add">+{added} lines</span>
        <span className="p-diff-remove">−{removed} lines</span>
        <span className="p-spacer" />
        <Button leadingIcon="split" onClick={onSeeChanges}>
          See what changed
        </Button>
      </div>
    </div>
  );
}
