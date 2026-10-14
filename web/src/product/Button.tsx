import type { ReactNode } from 'react';
import { Icon, type IconName } from '../ui/Icon.tsx';

type Props = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  onClick?: (() => void) | undefined;
};

/** Product button. Primary (black pill) is the one main action on a screen; secondary is the alternative; ghost is tertiary. */
export function Button({ children, variant = 'secondary', size = 'sm', leadingIcon, trailingIcon, onClick }: Props) {
  const iconSize = 16;
  return (
    <button type="button" className={`p-btn p-btn-${variant} p-btn-${size}`} onClick={onClick}>
      {leadingIcon && <Icon name={leadingIcon} size={iconSize} />}
      <span>{children}</span>
      {trailingIcon && <Icon name={trailingIcon} size={iconSize} />}
    </button>
  );
}
