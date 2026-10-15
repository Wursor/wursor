import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DocsPage from '../../app/(marketing)/docs/page.tsx';
import HowItWorksPage from '../../app/(marketing)/how-it-works/page.tsx';
import PricingPage from '../../app/(marketing)/pricing/page.tsx';
import ProductPage from '../../app/(marketing)/product/page.tsx';
import TrustPage from '../../app/(marketing)/trust/page.tsx';
import { AlwaysNever } from '../../src/marketing/pages/AlwaysNever.tsx';
import { ComparePlans } from '../../src/marketing/pages/ComparePlans.tsx';
import { FeatureGrid } from '../../src/marketing/pages/FeatureGrid.tsx';
import { FeatureRow } from '../../src/marketing/pages/FeatureRow.tsx';
import { PageHero } from '../../src/marketing/pages/PageHero.tsx';
import { PopularArticles } from '../../src/marketing/pages/PopularArticles.tsx';
import { PricingContent } from '../../src/marketing/pages/PricingContent.tsx';
import { Button } from '../../src/marketing/Button.tsx';

const PAGES = [
  ['Product', ProductPage, 'One workspace for every change.'],
  ['How it works', HowItWorksPage, 'Four steps. You stay in charge.'],
  ['Trust', TrustPage, 'Safe by design, not by promise.'],
  ['Pricing', PricingPage, 'Simple plans. No surprises.'],
  ['Docs', DocsPage, 'Find an answer fast.'],
] as const;

describe.each(PAGES)('%s page', (_name, Page, heading) => {
  it('has one page heading, the navigation and the footer', () => {
    render(<Page />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('sends every Get started and Sign in to sign-up or sign-in (PX-13)', () => {
    render(<Page />);
    const ctas = screen.getAllByRole('link', { name: /^(Get started|Sign in)$/ });
    expect(ctas.length).toBeGreaterThanOrEqual(2);
    for (const a of ctas) expect(['/signup', '/signin']).toContain(a.getAttribute('href'));
  });

  it('marks its own link in the navigation', () => {
    render(<Page />);
    const current = within(screen.getByRole('navigation', { name: 'Primary' })).queryAllByRole('link', { current: 'page' });
    expect(current.length).toBeLessThanOrEqual(1);
  });
});

describe('PageHero', () => {
  it('has the page heading, a supporting sentence and its actions', () => {
    render(
      <PageHero eyebrow="Product" title="One workspace for every change." subtitle="Talk to Wursor.">
        <Button href="/signup" size="lg">Get started</Button>
      </PageHero>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'One workspace for every change.' })).toBeInTheDocument();
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get started' })).toBeInTheDocument();
  });
});

describe('FeatureRow', () => {
  it('has a heading, bullets and a picture that is hidden from assistive technology', () => {
    const { container } = render(
      <FeatureRow eyebrow="Step 1" title="Start or connect your site" subtitle="Start on Cloud." bullets={['No jargon', 'Undo any time']}>
        <p>card</p>
      </FeatureRow>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Start or connect your site' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').map((i) => i.textContent)).toEqual(['No jargon', 'Undo any time']);
    expect(container.querySelector('[aria-hidden="true"][inert]')).not.toBeNull();
  });

  it('can put the picture first', () => {
    const { container } = render(
      <FeatureRow eyebrow="Step 2" title="Ask" subtitle="x" bullets={[]} reverse>
        <p>card</p>
      </FeatureRow>,
    );
    expect(container.querySelector('.m-row')).toHaveClass('m-row-reverse');
  });
});

describe('FeatureGrid', () => {
  it('shows a heading and one card per feature', () => {
    render(
      <FeatureGrid
        eyebrow="What you get"
        title="Everything you need."
        cards={[
          { icon: 'sparkles', title: 'Ask in plain words', body: 'Describe the change.' },
          { icon: 'undo', title: 'One-click undo', body: 'Take it back.' },
        ]}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Everything you need.' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Ask in plain words', 'One-click undo']);
  });
});

describe('AlwaysNever', () => {
  it('lists what Wursor always does and never does', () => {
    render(<AlwaysNever />);
    expect(screen.getByRole('list', { name: 'Always' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Never' })).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: 'Always' })).getAllByRole('listitem')).toHaveLength(5);
    expect(within(screen.getByRole('list', { name: 'Never' })).getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByText('Publishes without your approval')).toBeInTheDocument();
  });
});

describe('ComparePlans', () => {
  it('compares the three plans in a table', () => {
    render(<ComparePlans />);
    const table = screen.getByRole('table', { name: 'Compare plans' });
    expect(within(table).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Feature', 'Starter', 'Studio', 'Agency']);
    expect(within(table).getAllByRole('row').length).toBeGreaterThan(8);
  });
});

describe('PopularArticles', () => {
  it('lists articles; only those with a page are links', () => {
    render(<PopularArticles />);
    expect(screen.getByRole('heading', { level: 2, name: 'Popular articles' })).toBeInTheDocument();
    expect(screen.getByText('Undo a published change')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'How approval works' })).toHaveAttribute('href', '/trust');
    expect(screen.queryByRole('link', { name: 'Invite your team' })).not.toBeInTheDocument();
  });
});

describe('Pricing page content', () => {
  it('does not show prices, allowances or the free trial until they are decided (PX-13)', () => {
    render(<PricingPage />);
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(screen.queryByText(/free for 14 days/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByText('Plans and prices will be published before launch.')).toBeInTheDocument();
  });
});

describe('PricingContent when pricing is confirmed', () => {
  it('shows the free trial, the plan cards and the comparison table', () => {
    render(<PricingContent confirmed />);
    expect(screen.getByText(/Start free for 14 days/)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3, name: /Starter|Studio|Agency/ })).toHaveLength(3);
    expect(screen.getByRole('table', { name: 'Compare plans' })).toBeInTheDocument();
    expect(screen.getByText('Draft pricing. Final plans and prices will be confirmed before launch.')).toBeInTheDocument();
  });
});

describe('Docs page content', () => {
  it('has a search field, six topics and the popular articles', () => {
    render(<DocsPage />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Browse by topic' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(6);
    expect(screen.getByRole('heading', { level: 2, name: 'Popular articles' })).toBeInTheDocument();
  });
});

describe('How it works page content', () => {
  it('walks through the four steps', () => {
    render(<HowItWorksPage />);
    for (const step of ['Start or connect your site', 'Ask for a change', 'Review the proof', 'Publish, or undo']) {
      expect(screen.getByRole('heading', { level: 2, name: step })).toBeInTheDocument();
    }
  });
});

describe('Trust page content', () => {
  it('shows the four rules, the boundaries, the record and the controls', () => {
    render(<TrustPage />);
    expect(screen.getByRole('heading', { level: 3, name: 'Works on a safe copy' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'What Wursor does, and what it never does.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'A record you can read.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'You decide who can do what.' })).toBeInTheDocument();
  });
});

describe('Product page content', () => {
  it('shows the workspace, six features and where the site lives', () => {
    render(<ProductPage />);
    expect(screen.getByRole('tab', { name: 'Conversation' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Everything you need to hand off the work.' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(6);
    expect(screen.getByRole('heading', { level: 2, name: 'Choose where it lives. Keep your hands free.' })).toBeInTheDocument();
  });
});
