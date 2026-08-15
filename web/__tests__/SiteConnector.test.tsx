import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteConnector } from '../src/components/SiteConnector.tsx';

describe('SiteConnector', () => {
  it('shows the pairing code', () => {
    render(<SiteConnector code="ABCD1234" checkConnected={vi.fn().mockResolvedValue({ connected: false })} />);
    expect(screen.getByText('ABCD1234')).toBeInTheDocument();
  });

  it('shows success state when connected', async () => {
    render(<SiteConnector code="ABCD1234" checkConnected={vi.fn().mockResolvedValue({ connected: true })} />);
    expect(await screen.findByText('Site connected')).toBeInTheDocument();
  });

  it('shows error state when the check fails', async () => {
    render(<SiteConnector code="ABCD1234" checkConnected={vi.fn().mockRejectedValue(new Error('nope'))} />);
    expect(await screen.findByText('Connection failed')).toBeInTheDocument();
  });

  it('polls until the site is connected', async () => {
    const checkConnected = vi
      .fn()
      .mockResolvedValueOnce({ connected: false })
      .mockResolvedValueOnce({ connected: true });
    render(<SiteConnector code="ABCD1234" checkConnected={checkConnected} pollIntervalMs={5} />);

    expect(await screen.findByText('Site connected')).toBeInTheDocument();
    expect(checkConnected).toHaveBeenCalledTimes(2);
  });
});
