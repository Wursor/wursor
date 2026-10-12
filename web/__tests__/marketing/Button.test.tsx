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

  it('supports the ghost variant and the large size', () => {
    render(<Button href="/product" variant="ghost" size="lg">See how it works</Button>);
    expect(screen.getByRole('link', { name: 'See how it works' })).toHaveClass('btn-ghost', 'btn-lg');
  });
});
