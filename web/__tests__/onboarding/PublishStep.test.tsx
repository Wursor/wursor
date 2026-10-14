import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PublishStep } from '../../src/onboarding/PublishStep.tsx';

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());
const tick = (ms: number, n = 1) => { for (let i = 0; i < n; i++) act(() => void vi.advanceTimersByTime(ms)); };

const start = () => {
  const h = { onOpenSite: vi.fn(), onUndo: vi.fn(), onSaveAndExit: vi.fn() };
  render(<PublishStep stepMs={100} {...h} />);
  return { user: userEvent.setup({ advanceTimers: vi.advanceTimersByTime }), ...h };
};

describe('publishing to your WordPress', () => {
  it('backs up first, then sends the site, checks it, and keeps a way back', () => {
    start();
    expect(screen.getByRole('heading', { name: 'Publishing to your WordPress' })).toBeInTheDocument();
    expect(screen.getByText('Taking a backup of your empty site first, then sending your new site.')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Publish, step 8 of 8');
    const list = screen.getByRole('list', { name: 'Publishing progress' });
    expect(list).toHaveTextContent('Backed up your WordPress');
    expect(list).toHaveTextContent('Sending pages and images');
    expect(list).toHaveTextContent('Checking every page on harborbakery.com');
    expect(list).toHaveTextContent('Keeping a way back');
  });

  it('says it is live, and what was kept, when it finishes', async () => {
    const { user, onOpenSite } = start();
    tick(100, 6);
    expect(await screen.findByRole('heading', { name: 'Your site is live on your WordPress' })).toBeInTheDocument();
    expect(screen.getByText('You can keep editing in WordPress, or ask Wursor for changes. Either way, Wursor checks first.')).toBeInTheDocument();
    expect(screen.getByText('Harbor Bakery')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByText('Published just now · Backup taken before')).toBeInTheDocument();
    expect(screen.getByText('Full access')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open your site' }));
    expect(onOpenSite).toHaveBeenCalledOnce();
  });

  it('offers to undo the publish', async () => {
    const { user, onUndo } = start();
    tick(100, 6);
    await user.click(await screen.findByRole('button', { name: 'Undo this publish' }));
    expect(onUndo).toHaveBeenCalledOnce();
  });
});
