import type { Metadata } from 'next';
import { ClosingCta } from '../../../src/marketing/home/ClosingCta.tsx';
import { FeatureGrid } from '../../../src/marketing/pages/FeatureGrid.tsx';
import { PageHero } from '../../../src/marketing/pages/PageHero.tsx';
import { PopularArticles } from '../../../src/marketing/pages/PopularArticles.tsx';
import { DocsSearch } from '../../../src/marketing/pages/DocsSearch.tsx';
import { Shell } from '../../../src/marketing/Shell.tsx';
import { DOCS_TOPICS } from '../../../src/marketing/content.ts';

export const metadata: Metadata = { title: 'Docs' };

export default function DocsPage() {
  return (
    <Shell page>
      <PageHero
        eyebrow="Docs"
        title="Find an answer fast."
        subtitle="Guides for starting or connecting a site, moving between hosts, asking for changes and staying in control."
      >
        <div className="m-docs-search">
          {/* Opens the site search; it covers pages and topics until the articles are written. */}
          <DocsSearch />
        </div>
      </PageHero>
      <FeatureGrid
        title="Browse by topic"
        cards={DOCS_TOPICS}
      />
      <PopularArticles />
      <ClosingCta />
    </Shell>
  );
}
