export type Status = 'idea' | 'working' | 'needs-you' | 'done';

export const STATUS_LABEL: Record<Status, string> = {
  idea: 'Idea',
  working: 'Working',
  'needs-you': 'Needs you',
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
