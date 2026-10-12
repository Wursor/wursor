import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '../../src/marketing/Footer.tsx';

describe('Footer', () => {
  it('shows the brand and tagline', () => {
    render(<Footer />);
    expect(screen.getByText('Your website, handled.')).toBeInTheDocument();
  });

  it('has the four link columns from the design', () => {
    render(<Footer />);
    for (const heading of ['Product', 'Company', 'Resources', 'Legal']) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    }
  });

  it('links only to pages that exist', () => {
    render(<Footer />);
    const nav = screen.getByRole('navigation', { name: 'Footer' });
    const links = within(nav).getAllByRole('link').map((a) => [a.textContent, a.getAttribute('href')]);
    expect(links).toEqual([
      ['Overview', '/product'],
      ['How it works', '/how-it-works'],
      ['Trust and safety', '/trust'],
      ['Pricing', '/pricing'],
      ['Docs', '/docs'],
    ]);
  });

  it('shows pages not built yet as plain text, not dead links (D-HL-17)', () => {
    render(<Footer />);
    for (const label of ['Changelog', 'About', 'Blog', 'Contact', 'Terms', 'Privacy']) {
      expect(screen.getByText(label).closest('a')).toBeNull();
    }
  });

  it('shows the copyright line', () => {
    render(<Footer />);
    expect(screen.getByText('© 2026 Wursor')).toBeInTheDocument();
  });
});
