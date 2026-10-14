import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { themeInitScript } from '../../src/marketing/theme.ts';
import '../../src/styles/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/product.css';
import '../../src/styles/workspace.css';
import '../../src/styles/app.css';

export const metadata: Metadata = {
  title: { default: 'Wursor', template: '%s · Wursor' },
  robots: { index: false },
};

/** Root layout for the signed-in app. Same fonts, tokens and theme switch as the rest of the site. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
