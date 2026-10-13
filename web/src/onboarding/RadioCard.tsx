type Props = {
  name: string;
  value: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: string) => void;
};

/** The selected radio from the design: a ring and a 4px-radius dot. Same geometry as the Figma "Circle", themed by colour. */
function RadioMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ob-radio-mark">
      <circle cx="8" cy="8" r="7.25" fill="var(--color-bg-surface)" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="4" fill="currentColor" />
    </svg>
  );
}

/** Selectable card for roles and choices (Figma "Radio Card"). A real radio input underneath, so the keyboard works. */
export function RadioCard({ name, value, title, description, checked, onChange }: Props) {
  return (
    <label className="ob-radiocard" data-checked={checked ? 'true' : 'false'}>
      <input type="radio" className="sr-only" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      <span className="ob-radio-slot" aria-hidden="true">
        {checked ? <RadioMark /> : <span className="ob-radio-circle" />}
      </span>
      <span className="ob-radiocard-text">
        <span className="t-body-m-strong">{title}</span>
        <span className="t-caption">{description}</span>
      </span>
    </label>
  );
}
