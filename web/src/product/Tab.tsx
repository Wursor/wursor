import { Counter } from './Counter.tsx';

type Props = { label: string; selected?: boolean; count?: number; onSelect?: () => void };

/** A tab with an underline indicator for the selected one. Put tabs inside an element with role="tablist". */
export function Tab({ label, selected = false, count, onSelect }: Props) {
  return (
    <button type="button" role="tab" aria-selected={selected} className="p-tab" onClick={onSelect}>
      <span className="p-tab-row">
        <span>{label}</span>
        {count !== undefined && <Counter count={count} />}
      </span>
      <span className="p-tab-indicator" aria-hidden="true" />
    </button>
  );
}
