import type { KeyboardEvent } from 'react';
import { Icon } from '../ui/Icon.tsx';
import { Kbd } from './Kbd.tsx';

type Props = {
  /** The accessible name. The placeholder is not a label. */
  label: string;
  shortcut?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Makes the field a launcher: it cannot be typed in, and click, Enter or Space calls this instead. */
  onActivate?: () => void;
};

/** Pill search field with a shortcut hint. Used in the top bar, the command palette and the docs. */
export function SearchField({ label, shortcut, placeholder = 'Search or ask…', disabled = false, onActivate }: Props) {
  return (
    <div className={`p-search${disabled ? ' p-search-disabled' : ''}`}>
      <Icon name="search" size={16} />
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        disabled={disabled}
        className="p-search-input"
        {...(onActivate && {
          readOnly: true,
          'aria-haspopup': 'dialog' as const,
          onClick: onActivate,
          onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onActivate();
            }
          },
        })}
      />
      {shortcut && <Kbd>{shortcut}</Kbd>}
    </div>
  );
}
