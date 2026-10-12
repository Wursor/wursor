import type { ReactNode } from 'react';
import '../../../src/styles/global.css';

export const metadata = { title: 'Wursor' };

// Interim product shell from Sprint 1. Its own root layout keeps its dark theme
// from leaking into the marketing site. Replaced by the designed screens.
export default function LegacyLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
