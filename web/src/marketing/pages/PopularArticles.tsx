import Link from 'next/link';
import { Icon } from '../../ui/Icon.tsx';
import { ARTICLES } from '../content.ts';
import { SectionHeader } from '../home/SectionHeader.tsx';

/** Docs articles. Only those that have a page are links; the others are shown as plain rows until they are written. */
export function PopularArticles() {
  return (
    <section className="m-grid-section">
      <SectionHeader title="Popular articles" />
      <ul className="m-articles">
        {ARTICLES.map((a) => (
          <li key={a.title} className="t-body-m">
            {a.href ? <Link href={a.href}>{a.title}</Link> : <span>{a.title}</span>}
            <Icon name="chevron-right" size={20} />
          </li>
        ))}
      </ul>
    </section>
  );
}
