type Props = { label: string; checked: boolean; onChange: (checked: boolean) => void };

/** An on/off switch. The label is its name for people who cannot see it. */
export function Toggle({ label, checked, onChange }: Props) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className="app-toggle" onClick={() => onChange(!checked)}>
      <span aria-hidden="true" />
    </button>
  );
}
