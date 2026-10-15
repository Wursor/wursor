type Option<V extends string> = { value: V; label: string };
type Props<V extends string> = {
  label: string;
  options: readonly Option<V>[];
  value: V;
  onChange: (value: V) => void;
};

/** Three-way (or n-way) choice, for example the play-by-play detail: Headline, Steps, Everything. */
export function SegmentedControl<V extends string>({ label, options, value, onChange }: Props<V>) {
  return (
    <div role="radiogroup" aria-label={label} className="p-segmented">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className="p-segment"
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
