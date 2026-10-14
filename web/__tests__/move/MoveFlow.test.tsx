import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MoveFlow } from '../../src/move/MoveFlow.tsx';

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());
const tick = (ms: number, n = 1) => { for (let i = 0; i < n; i++) act(() => void vi.advanceTimersByTime(ms)); };

const out = (scenario: 'ok' | 'problem' = 'ok') => {
  const h = { onDone: vi.fn(), onCancel: vi.fn(), onSaveAndExit: vi.fn() };
  render(<MoveFlow direction="out" scenario={scenario} stepMs={100} {...h} />);
  return { user: userEvent.setup({ advanceTimers: vi.advanceTimersByTime }), ...h };
};
const into = (access: 'full' | 'content' = 'full') => {
  const h = { onDone: vi.fn(), onCancel: vi.fn(), onSaveAndExit: vi.fn() };
  render(<MoveFlow direction="in" access={access} stepMs={100} {...h} />);
  return { user: userEvent.setup({ advanceTimers: vi.advanceTimersByTime }), ...h };
};

describe('moving out to your own WordPress (M1 to M6)', () => {
  it('asks where it should live, with no step indicator', async () => {
    const { user, onCancel } = out();
    expect(screen.getByRole('heading', { name: 'Where should Harbor Bakery live?' })).toBeInTheDocument();
    expect(screen.getByText('Wursor copies everything to your WordPress. Your site stays on Wursor Cloud and live until you confirm.')).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /A WordPress.com site/ })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: /Self-hosted WordPress/ }));
    expect(screen.getByRole('radio', { name: /Self-hosted WordPress/ })).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('shows what will move, and what needs a look', async () => {
    const { user } = out();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('heading', { name: 'Here is what will move' })).toBeInTheDocument();
    for (const t of ['Pages and posts', 'Media', 'Theme, plugins and settings', 'Forms and email']) expect(screen.getByText(t)).toBeInTheDocument();
    expect(screen.getByText('112')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Your site stays live on Wursor Cloud until you approve the switch.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('heading', { name: 'Where should Harbor Bakery live?' })).toBeInTheDocument();
  });

  it('copies, compares, and waits for the owner to approve the switch', async () => {
    const { user } = out();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Start the move' }));
    expect(screen.getByRole('heading', { name: 'Copying to your WordPress' })).toBeInTheDocument();
    expect(screen.getByText('You can leave this page. We will tell you when it is ready to review.')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Move progress' })).toHaveTextContent('Comparing the copy with your site');
    tick(100, 7);
    expect(await screen.findByRole('heading', { name: 'The copy matches your site' })).toBeInTheDocument();
    expect(screen.getByText('Copy at harborbakery-copy.example.com')).toBeInTheDocument();
    expect(screen.getByText('24 of 24 match')).toBeInTheDocument();
    expect(screen.getByText('Switching points harborbakery.com at your WordPress. Your Cloud copy is kept for 30 days.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Approve and switch' }));
    expect(await screen.findByRole('heading', { name: 'Harbor Bakery now lives on your WordPress' })).toBeInTheDocument();
    expect(screen.getByText('Wursor works on a safe copy and asks before it publishes.')).toBeInTheDocument();
    expect(screen.getByText('Your Cloud copy is kept for 30 days, then removed. You can download it any time.')).toBeInTheDocument();
  });

  it('stops before switching when something goes wrong, and says nothing changed', async () => {
    const { user, onCancel } = out('problem');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Start the move' }));
    tick(100, 4);
    expect(await screen.findByRole('heading', { name: 'We stopped before switching' })).toBeInTheDocument();
    expect(screen.getByText('Your site on Wursor Cloud is untouched and still live.')).toBeInTheDocument();
    expect(screen.getByText('Needs attention')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Your WordPress host blocked the plugin upload. Allow plugin installs, or move content only.');
    await user.click(screen.getByRole('button', { name: 'Cancel the move' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('tries again from the start', async () => {
    const { user } = out('problem');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Start the move' }));
    tick(100, 4);
    await user.click(await screen.findByRole('button', { name: 'Try again' }));
    expect(screen.getByRole('heading', { name: 'Copying to your WordPress' })).toBeInTheDocument();
  });
});

describe('hosting on Wursor Cloud (M7 to M10)', () => {
  it('shows what will be copied, then copies, then offers the preview', async () => {
    const { user } = into();
    expect(screen.getByRole('heading', { name: 'Host Harbor Bakery on Wursor Cloud' })).toBeInTheDocument();
    expect(screen.getByText('We copy your site to WeOwn Cloud. Your current site is not changed until you confirm.')).toBeInTheDocument();
    expect(screen.getByText('Needs Full access, which this site has')).toBeInTheDocument();
    expect(screen.getByText('Wursor Cloud looks after updates, backups and the certificate. Your plan covers it.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Copy to Wursor Cloud' }));
    expect(screen.getByRole('heading', { name: 'Copying to Wursor Cloud' })).toBeInTheDocument();
    tick(100, 5);
    expect(await screen.findByRole('heading', { name: 'Your copy is ready on a preview address' })).toBeInTheDocument();
    expect(screen.getByText('harbor-bakery.wursor.site')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Connect my web address' }));
    expect(await screen.findByRole('heading', { name: 'Harbor Bakery is hosted on Wursor Cloud' })).toBeInTheDocument();
    expect(screen.getByText('Your old WordPress is untouched. You can move back out any time.')).toBeInTheDocument();
  });

  it('on Content only, asks for full access or offers to host the content only', async () => {
    const { user, onCancel } = into('content');
    expect(screen.getByRole('heading', { name: 'Full access is needed to host this site' })).toBeInTheDocument();
    expect(screen.getByText('You can also host the content only. Your theme would be replaced with a Wursor theme.')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Give Wursor full access/ })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: /Host the content only/ }));
    await user.click(screen.getByRole('button', { name: 'Give Wursor full access' }));
    expect(screen.getByRole('heading', { name: 'Host Harbor Bakery on Wursor Cloud' })).toBeInTheDocument();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('can be put off', async () => {
    const { user, onCancel } = into('content');
    await user.click(screen.getByRole('button', { name: 'Not now' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});
