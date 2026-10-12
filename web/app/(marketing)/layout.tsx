import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../../src/styles/tokens.css';
import '../../src/styles/marketing.css';

export const metadata: Metadata = {
  title: { default: 'Wursor', template: '%s · Wursor' },
  description: 'Your website, handled. Tell Wursor what to change. Watch it work. Approve what you like.',
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
