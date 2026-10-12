import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '../ui/Icon.tsx';

type Props = {
  href: string;
  children: ReactNode;
  /** `light` is for use on the dark closing panel. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'light';
  size?: 'sm' | 'md' | 'lg';
  trailingIcon?: IconName;
  className?: string;
};

/** Figma "Button": primary is the one main action on a screen. Heights 28, 36, 44. */
export function Button({ href, children, variant = 'primary', size = 'md', trailingIcon, className }: Props) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, className].filter(Boolean).join(' ');
  return (
    <Link href={href} className={classes}>
      {children}
      {trailingIcon && <Icon name={trailingIcon} size={20} />}
    </Link>
  );
}
