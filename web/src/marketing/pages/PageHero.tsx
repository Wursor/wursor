import type { ReactNode } from 'react';
import { SectionHeader } from '../home/SectionHeader.tsx';

type Props = { eyebrow: string; title: string; subtitle?: string; children?: ReactNode };

/** The top of a marketing page: eyebrow, the page heading, one supporting sentence and the page's actions. */
export function PageHero({ eyebrow, title, subtitle, children }: Props) {
  return (
    <section className="m-pagehero">
      <SectionHeader as="h1" eyebrow={eyebrow} title={title} {...(subtitle ? { subtitle } : {})} />
      {children && <div className="m-hero-actions">{children}</div>}
    </section>
  );
}
