import { Icon } from '../ui/Icon.tsx';
import { Kbd } from './Kbd.tsx';

type Props = {
  /** The accessible name. The placeholder is not a label. */
  label: string;
  shortcut?: string;
  placeholder?: string;
  disabled?: boolean;
};

/** Pill search field with a shortcut hint. Used in the top bar, the command palette and the docs. */
export function SearchField({ label, shortcut, placeholder = 'Search or ask…', disabled = false }: Props) {
  return (
    <div className={`p-search${disabled ? ' p-search-disabled' : ''}`}>
      <Icon name="search" size={16} />
      <input type="search" aria-label={label} placeholder={placeholder} disabled={disabled} className="p-search-input" />
      {shortcut && <Kbd>{shortcut}</Kbd>}
    </div>
  );
}
