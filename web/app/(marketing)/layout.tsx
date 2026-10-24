import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CommandPaletteProvider } from '../../src/marketing/CommandPalette.tsx';
import { themeInitScript } from '../../src/marketing/theme.ts';
import '../../src/styles/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/marketing.css';
import '../../src/styles/product.css';

export const metadata: Metadata = {
  title: { default: 'Wursor', template: '%s · Wursor' },
  description: 'Your website, handled. Tell Wursor what to change. Watch it work. Approve what you like.',
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the head script sets data-theme on <html> before React hydrates.
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <CommandPaletteProvider>{children}</CommandPaletteProvider>
      </body>
    </html>
  );
}
