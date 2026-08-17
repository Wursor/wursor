type ApproveBarProps = {
  visible: boolean;
  onApprove: () => void;
  onReject: () => void;
};

export function ApproveBar({ visible, onApprove, onReject }: ApproveBarProps) {
  if (!visible) return null;

  return (
    <div className="approve-bar">
      <span className="approve-copy">Looks good?</span>
      <button className="wursor-approve-button" type="button" onClick={onApprove}>
        Looks good → Apply
      </button>
      <button className="wursor-reject-button" type="button" onClick={onReject}>
        Not right → Reject
      </button>
    </div>
  );
}
