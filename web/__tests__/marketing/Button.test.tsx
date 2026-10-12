import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../../src/marketing/Button.tsx';

describe('Button', () => {
  it('renders a link with its label and destination', () => {
    render(<Button href="/signup">Get started</Button>);
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/signup');
  });

  it('is the primary (inverse) pill by default', () => {
    render(<Button href="/signup">Get started</Button>);
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveClass('btn', 'btn-primary', 'btn-md');
  });

  it('supports the ghost and secondary variants and the large size', () => {
    const { rerender } = render(<Button href="/product" variant="ghost" size="lg">See how it works</Button>);
    expect(screen.getByRole('link', { name: 'See how it works' })).toHaveClass('btn-ghost', 'btn-lg');
    rerender(<Button href="/trust" variant="secondary">How approval works</Button>);
    expect(screen.getByRole('link', { name: 'How approval works' })).toHaveClass('btn-secondary');
  });

  it('supports a light variant for use on the dark panel', () => {
    render(<Button href="/signup" variant="light" size="lg">Get started</Button>);
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveClass('btn-light');
  });

  it('can end with an arrow that is not announced', () => {
    render(<Button href="/how-it-works" variant="ghost" size="lg" trailingIcon="arrow-right">See how it works</Button>);
    const link = screen.getByRole('link', { name: 'See how it works' });
    expect(link.querySelector('.icon')).toHaveAttribute('aria-hidden', 'true');
  });
});
