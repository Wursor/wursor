import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { themeInitScript } from '../../src/marketing/theme.ts';
import '../../src/styles/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/product.css';
import '../../src/styles/onboarding.css';

export const metadata: Metadata = {
  title: { default: 'Wursor', template: '%s · Wursor' },
  robots: { index: false },
};

/** Root layout for sign-up, sign-in and first-run screens. Same fonts, tokens and theme switch as the marketing site. */
export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the head script sets data-theme on <html> before React hydrates.
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
