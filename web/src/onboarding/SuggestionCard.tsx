import { RiskChip } from '../product/RiskChip.tsx';
import { Icon } from '../ui/Icon.tsx';

type Props = {
  name: string;
  value: string;
  title: string;
  body: string;
  /** For example "About 2 minutes  ·  Changes 1 page". */
  meta: string;
  checked: boolean;
  onChange: (value: string) => void;
};

/** A first-change suggestion drawn from the scan (Figma "Suggestion Card"). Always Everyday risk during onboarding. A real radio underneath, so the keyboard works. */
export function SuggestionCard({ name, value, title, body, meta, checked, onChange }: Props) {
  return (
    <label className="ob-suggestion" data-checked={checked ? 'true' : 'false'}>
      <input type="radio" className="sr-only" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      <span className="ob-suggestion-top">
        <span className="ob-suggestion-title t-body-l-strong">{title}</span>
        <RiskChip level="everyday" />
      </span>
      <span className="ob-suggestion-body t-body-m">{body}</span>
      <span className="ob-suggestion-meta t-caption">
        <Icon name="clock" size={20} />
        <span>{meta}</span>
      </span>
    </label>
  );
}
