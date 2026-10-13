import Link from 'next/link';
import type { ReactNode } from 'react';
import { BrandMark } from '../marketing/BrandMark.tsx';

type Props = {
  /** Right of the header, after Help: the Sign in link, or Sign in marked as the current page. */
  signIn?: 'link' | 'current' | undefined;
  children: ReactNode;
};

/** The page every pre-workspace screen sits on: header with the brand, then one centred column. */
export function AuthShell({ signIn, children }: Props) {
  return (
    <div className="ob-page">
      <header className="ob-header">
        <Link href="/" className="ob-brand t-title-s">
          <BrandMark />
          Wursor
        </Link>
        <nav aria-label="Account" className="ob-header-right t-label-m">
          <Link href="/docs" className="ob-help">
            Help
          </Link>
          {signIn === 'link' && <Link href="/signin">Sign in</Link>}
          {signIn === 'current' && <span aria-current="page">Sign in</span>}
        </nav>
      </header>
      <main className="ob-column">{children}</main>
    </div>
  );
}
