type Props = { label: string; value: string; /** 0 to 1: how much of the bar is filled. */ fill: number };

/** How much of a monthly allowance is used. */
export function UsageMeter({ label, value, fill }: Props) {
  return (
    <div className="app-meter">
      <div className="app-meter-row">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="app-meter-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(fill * 100)}>
        <span style={{ width: `${fill * 100}%` }} />
      </div>
    </div>
  );
}
