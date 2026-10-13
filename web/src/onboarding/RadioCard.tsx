import { RadioMark } from './RadioMark.tsx';

type Props = {
  name: string;
  value: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: string) => void;
};

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
