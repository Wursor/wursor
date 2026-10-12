import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ApproveWithProof } from '../../src/marketing/home/ApproveWithProof.tsx';
import { ClosingCta } from '../../src/marketing/home/ClosingCta.tsx';
import { Examples } from '../../src/marketing/home/Examples.tsx';
import { Faq } from '../../src/marketing/home/Faq.tsx';
import { Hero } from '../../src/marketing/home/Hero.tsx';
import { PricingTeaser } from '../../src/marketing/home/PricingTeaser.tsx';
import { ProofStrip } from '../../src/marketing/home/ProofStrip.tsx';
import { SafeByDesign } from '../../src/marketing/home/SafeByDesign.tsx';
import { SectionHeader } from '../../src/marketing/home/SectionHeader.tsx';
import { SurfacesShowcase } from '../../src/marketing/home/SurfacesShowcase.tsx';
import { WatchTheWork } from '../../src/marketing/home/WatchTheWork.tsx';
import HomePage from '../../app/(marketing)/page.tsx';
import { PRICING_CONFIRMED } from '../../src/marketing/content.ts';

describe('SectionHeader', () => {
  it('has an eyebrow, a heading and a supporting sentence', () => {
    render(<SectionHeader eyebrow="One screen" title="Talk. Watch. Decide." subtitle="All in one place." />);
    expect(screen.getByRole('heading', { level: 2, name: 'Talk. Watch. Decide.' })).toBeInTheDocument();
    expect(screen.getByText('One screen')).toBeInTheDocument();
    expect(screen.getByText('All in one place.')).toBeInTheDocument();
  });
});

describe('Hero', () => {
  it('leads with the promise as the page heading', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: 'Your website, handled.' })).toBeInTheDocument();
    expect(screen.getByText('Tell Wursor what to change. Watch it work. Approve what you like.')).toBeInTheDocument();
  });

  it('sends Get started to sign-up and See how it works to the how-it-works page (PX-13)', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/signup');
    expect(screen.getByRole('link', { name: 'See how it works' })).toHaveAttribute('href', '/how-it-works');
  });

  it('announces the approval feature, linking to how approval works', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /Approve with proof: nine checks on every change/ })).toHaveAttribute('href', '/trust');
  });

  it('says who it is for', () => {
    render(<Hero />);
    expect(screen.getByText('For WordPress sites · We host it, or you do')).toBeInTheDocument();
  });

  it('shows the product as a picture, hidden from assistive technology and not focusable', () => {
    const { container } = render(<Hero />);
    const visual = container.querySelector('.m-hero-visual [aria-hidden="true"]');
    expect(visual).not.toBeNull();
    expect(visual).toHaveAttribute('inert');
  });
});

describe('ProofStrip', () => {
  it('shows the three proof points', () => {
    render(<ProofStrip />);
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('checks before anything goes live')).toBeInTheDocument();
    expect(screen.getByText('1 click')).toBeInTheDocument();
    expect(screen.getByText('to undo any change, any time')).toBeInTheDocument();
    expect(screen.getByText('Every step')).toBeInTheDocument();
    expect(screen.getByText('on the record, in plain words')).toBeInTheDocument();
  });
});

describe('SurfacesShowcase', () => {
  it('starts on the Conversation tab with its caption', () => {
    render(<SurfacesShowcase />);
    expect(screen.getByRole('tab', { name: 'Conversation' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Conversation: ask in plain words. Wursor explains each step as it goes.')).toBeInTheDocument();
  });

  it('switches to the Preview and Board views and their captions', async () => {
    render(<SurfacesShowcase />);
    await userEvent.click(screen.getByRole('tab', { name: 'Preview' }));
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Preview: see the real page on a phone, tablet and laptop before anything goes live.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: 'Board' }));
    expect(screen.getByText('Board: every change in one place, from idea to published.')).toBeInTheDocument();
  });

  it('moves between tabs with the arrow keys', async () => {
    render(<SurfacesShowcase />);
    screen.getByRole('tab', { name: 'Conversation' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe('WatchTheWork', () => {
  it('shows the same change at three levels of detail', () => {
    render(<WatchTheWork />);
    expect(screen.getByRole('heading', { level: 2, name: /Watch the work, your way\./ })).toBeInTheDocument();
    // The design words the heading more briefly on a phone; both are in the page and CSS shows one.
    expect(screen.getByText('Watch every step.')).toHaveClass('m-m');
    for (const [name, text] of [
      ['Headline', 'Only what changed and what needs you.'],
      ['Steps', 'Each step, in a sentence. The default.'],
      ['Everything', 'Every look, edit, check and decision.'],
    ] as const) {
      expect(screen.getByRole('heading', { level: 3, name })).toBeInTheDocument();
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });
});

describe('ApproveWithProof', () => {
  it('lists what the owner gets and links to how approval works', () => {
    render(<ApproveWithProof />);
    expect(screen.getByRole('heading', { level: 2, name: 'See it before it’s real.' })).toBeInTheDocument();
    expect(screen.getByText('Nine checks, written in plain words')).toBeInTheDocument();
    expect(screen.getByText('Looks right on a phone, a tablet and a laptop')).toBeInTheDocument();
    expect(screen.getByText('One click to approve and publish, one click to undo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'How approval works' })).toHaveAttribute('href', '/trust');
  });
});

describe('SafeByDesign', () => {
  it('states the four rules', () => {
    render(<SafeByDesign />);
    expect(screen.getByRole('heading', { level: 2, name: 'Nothing goes live until you say so.' })).toBeInTheDocument();
    for (const rule of ['Works on a safe copy', 'Nothing goes live without you', 'Everything is recorded', 'Undo in one click']) {
      expect(screen.getByRole('heading', { level: 3, name: rule })).toBeInTheDocument();
    }
  });
});

describe('Examples', () => {
  it('shows five small jobs, each with a before and after', () => {
    render(<Examples />);
    const list = screen.getByRole('list', { name: 'Examples' });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(within(items[0]!).getByText('Update the holiday hours')).toBeInTheDocument();
    expect(within(items[0]!).getByText('Page · 2 min')).toBeInTheDocument();
    expect(within(items[0]!).getByText('Before')).toBeInTheDocument();
    expect(within(items[0]!).getByText('After')).toBeInTheDocument();
  });
});

describe('PricingTeaser', () => {
  it('does not show prices or allowances until they are decided (PRD PX-13, D-HL-8)', () => {
    expect(PRICING_CONFIRMED).toBe(false);
    render(<PricingTeaser />);
    expect(screen.getByRole('heading', { level: 2, name: 'Simple plans. No surprises.' })).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(screen.queryByText(/free for 14 days/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sites ·/)).not.toBeInTheDocument();
    expect(screen.getByText('Plans and prices will be published before launch.')).toBeInTheDocument();
  });

  it('still leads to sign-up and the pricing page', () => {
    render(<PricingTeaser />);
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/signup');
    expect(screen.getByRole('link', { name: 'See pricing' })).toHaveAttribute('href', '/pricing');
  });

  it('shows the plan cards when pricing is confirmed', () => {
    render(<PricingTeaser confirmed />);
    for (const plan of ['Starter', 'Studio', 'Agency']) {
      expect(screen.getByRole('heading', { level: 3, name: plan })).toBeInTheDocument();
    }
    expect(screen.getAllByRole('link', { name: 'Choose plan' })).toHaveLength(3);
  });
});

describe('Faq', () => {
  it('lists the questions, with the first answered and open', () => {
    render(<Faq />);
    expect(screen.getByRole('heading', { level: 2, name: 'Questions, answered.' })).toBeInTheDocument();
    const first = screen.getByText('Will Wursor change my live site without asking?').closest('details');
    expect(first).toHaveAttribute('open');
    expect(screen.getByText(/Nothing goes live until you review the preview and approve it\./)).toBeInTheDocument();
    for (const q of ['Do I need my own hosting?', 'Can I undo a change?', 'Does it work with my theme and plugins?', 'How is my site kept safe?']) {
      expect(screen.getByText(q).closest('details')).not.toHaveAttribute('open');
    }
  });

  it('opens an item to show its answer', async () => {
    render(<Faq />);
    await userEvent.click(screen.getByText('Do I need my own hosting?'));
    expect(screen.getByText('Do I need my own hosting?').closest('details')).toHaveAttribute('open');
  });
});

describe('ClosingCta', () => {
  it('ends with one clear action', () => {
    render(<ClosingCta />);
    expect(screen.getByRole('heading', { level: 2, name: 'Hand off the busywork. Keep the final say.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/signup');
  });
});

describe('HomePage', () => {
  it('has one page heading, a nav and a footer', () => {
    render(<HomePage />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('routes every call to action to sign-up or sign-in (PX-13)', () => {
    render(<HomePage />);
    const ctas = [...screen.getAllByRole('link', { name: /^(Get started|Sign in)$/ })];
    expect(ctas.length).toBeGreaterThanOrEqual(3);
    for (const a of ctas) expect(['/signup', '/signin']).toContain(a.getAttribute('href'));
  });
});
