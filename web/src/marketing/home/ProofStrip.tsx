const STATS = [
  { value: '9', label: 'checks before anything goes live' },
  { value: '1 click', label: 'to undo any change, any time' },
  { value: 'Every step', label: 'on the record, in plain words' },
] as const;

export function ProofStrip() {
  return (
    <section aria-label="Proof" className="m-proof">
      {STATS.map((s) => (
        <div key={s.value} className="m-proof-stat">
          <p className="t-display-l">{s.value}</p>
          <p className="t-body-l m-section-sub">{s.label}</p>
        </div>
      ))}
    </section>
  );
}
