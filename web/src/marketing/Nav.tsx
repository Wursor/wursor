'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BrandMark } from './BrandMark.tsx';
import { Button } from './Button.tsx';
import { NAV_LINKS, ROUTES } from './content.ts';
import { Icon } from './Icon.tsx';

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="nav">
      <div className="nav-bar">
        <Link href="/" className="nav-brand" onClick={() => setOpen(false)}>
          <BrandMark />
          <span className="t-title-s">Wursor</span>
        </Link>

        <nav aria-label="Primary" className="nav-links t-body-m">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link href={ROUTES.signIn} className="nav-signin t-label-m">
            Sign in
          </Link>
          <Button href={ROUTES.signUp} size="md" className="nav-cta">
            Get started
          </Button>
          <button
            type="button"
            className="nav-menu-button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="nav-menu">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="t-title-m" onClick={() => setOpen(false)}>
              {l.mobileLabel ?? l.label}
            </Link>
          ))}
          <Button href={ROUTES.signUp} size="lg" className="nav-menu-cta" >
            Get started
          </Button>
        </nav>
      )}
    </header>
  );
}
