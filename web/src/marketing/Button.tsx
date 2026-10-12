import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

/** Figma "Button": primary is the one main action on a screen; secondary and danger are added when a screen needs them. Heights 28, 36, 44. */
export function Button({ href, children, variant = 'primary', size = 'md', className }: Props) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, className].filter(Boolean).join(' ');
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
