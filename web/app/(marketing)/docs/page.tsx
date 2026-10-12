import type { Metadata } from 'next';
import { SearchField } from '../../../src/product/SearchField.tsx';
import { ClosingCta } from '../../../src/marketing/home/ClosingCta.tsx';
import { FeatureGrid } from '../../../src/marketing/pages/FeatureGrid.tsx';
import { PageHero } from '../../../src/marketing/pages/PageHero.tsx';
import { PopularArticles } from '../../../src/marketing/pages/PopularArticles.tsx';
import { Shell } from '../../../src/marketing/Shell.tsx';

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
          {/* Search is shown as in the design but not usable until the docs exist. */}
          <SearchField label="Search the docs" shortcut="⌘K" disabled />
        </div>
      </PageHero>
      <FeatureGrid
        title="Browse by topic"
        cards={[
          { icon: 'rocket', title: 'Getting started', body: 'Start or connect your site and make your first change.' },
          { icon: 'plug', title: 'Start or connect a site', body: 'Start on Wursor Cloud, link WordPress, move between hosts and manage access.' },
          { icon: 'sparkles', title: 'Asking for changes', body: 'Write a request, point at the page and follow the work.' },
          { icon: 'shield-check', title: 'Review and approve', body: 'Compare before and after, read the checks and publish.' },
          { icon: 'credit-card', title: 'Team and billing', body: 'Invite people, set roles and manage your plan.' },
          { icon: 'help', title: 'Troubleshooting', body: 'Fixes for the most common connection and preview problems.' },
        ]}
      />
      <PopularArticles />
      <ClosingCta />
    </Shell>
  );
}
