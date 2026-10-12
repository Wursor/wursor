import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Nav } from '../../src/marketing/Nav.tsx';

describe('Nav', () => {
  it('links the brand to the home page', () => {
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'Wursor' })).toHaveAttribute('href', '/');
  });

  it('lists the five page links', () => {
    render(<Nav />);
    const primary = screen.getByRole('navigation', { name: 'Primary' });
    const hrefs = within(primary).getAllByRole('link').map((a) => [a.textContent, a.getAttribute('href')]);
    expect(hrefs).toEqual([
      ['Product', '/product'],
      ['How it works', '/how-it-works'],
      ['Trust', '/trust'],
      ['Pricing', '/pricing'],
      ['Docs', '/docs'],
    ]);
  });

  it('sends Sign in to sign-in and Get started to sign-up (PX-13)', () => {
    render(<Nav />);
    expect(screen.getAllByRole('link', { name: 'Sign in' })[0]).toHaveAttribute('href', '/signin');
    expect(screen.getAllByRole('link', { name: 'Get started' })[0]).toHaveAttribute('href', '/signup');
  });

  it('keeps the mobile menu closed until the menu button is pressed', async () => {
    render(<Nav />);
    const button = screen.getByRole('button', { name: 'Open menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument();

    await userEvent.click(button);

    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('navigation', { name: 'Mobile' });
    expect(within(menu).getAllByRole('link').map((a) => a.textContent)).toEqual([
      'Product', 'How it works', 'Trust and safety', 'Pricing', 'Docs', 'Get started',
    ]);
  });

  it('closes the mobile menu with Escape', async () => {
    render(<Nav />);
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument();
  });

  it('closes the mobile menu after a link is chosen', async () => {
    render(<Nav />);
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const menu = screen.getByRole('navigation', { name: 'Mobile' });
    await userEvent.click(within(menu).getByRole('link', { name: 'Pricing' }));
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument();
  });
});
