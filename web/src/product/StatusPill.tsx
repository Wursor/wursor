export type Status = 'idea' | 'plan-ready' | 'working' | 'needs-you' | 'ready' | 'approved' | 'live' | 'done';

export const STATUS_LABEL: Record<Status, string> = {
  idea: 'Idea',
  'plan-ready': 'Plan ready',
  working: 'Working',
  'needs-you': 'Needs you',
  ready: 'Ready for you',
  approved: 'Approved',
  live: 'Live',
  done: 'Done',
};

/** Where a change is, in plain words. The colour is never the only signal; the label is always shown. */
export function StatusPill({ status, dot = true }: { status: Status; dot?: boolean }) {
  return (
    <span className="p-status" data-status={status}>
      {dot && <span className="p-dot" aria-hidden="true" />}
      <span>{STATUS_LABEL[status]}</span>
    </span>
  );
}
