import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ScanFinding } from '../../src/onboarding/ScanFinding.tsx';
import { ScanStep } from '../../src/onboarding/ScanStep.tsx';

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());

const tick = (ms: number, n = 1) => { for (let i = 0; i < n; i++) act(() => void vi.advanceTimersByTime(ms)); };

const start = (access: 'full' | 'content' = 'full') => {
  const h = { onContinue: vi.fn(), onBack: vi.fn(), onSaveAndExit: vi.fn() };
  render(<ScanStep access={access} stepMs={100} {...h} />);
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  return { user, ...h };
};

describe('ScanFinding', () => {
  it('shows a spinner and "Looking…" while it works', () => {
    render(<ScanFinding icon="plug" title="Plugins" detail="3 are out of date" state="running" />);
    expect(screen.getByText('Looking…')).toBeInTheDocument();
    expect(screen.getByText('Plugins')).toBeInTheDocument();
  });

  it('shows the result, and says when something is worth fixing', () => {
    const { rerender } = render(<ScanFinding icon="file" title="Pages" detail="Found by reading your sitemap" state="done" value="14" />);
    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.queryByText('Worth fixing')).not.toBeInTheDocument();
    rerender(<ScanFinding icon="plug" title="Plugins" detail="3 are out of date" state="attention" value="11" />);
    expect(screen.getByText('Worth fixing')).toBeInTheDocument();
  });
});

describe('scan step', () => {
  it('starts with a read-only scan, Continue quiet', () => {
    const { onContinue } = start();
    expect(screen.getByRole('heading', { name: 'Wursor is taking a look' })).toBeInTheDocument();
    expect(screen.getByText('A read-only first scan. Nothing on your site is changed, and you can watch every step.')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'What Wursor can do here, step 7 of 8');
    const cta = screen.getByRole('button', { name: 'Looking…' });
    expect(cta).toHaveAttribute('aria-disabled', 'true');
    act(() => cta.click());
    expect(onContinue).not.toHaveBeenCalled();
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('shows findings as they come in, one at a time', () => {
    start();
    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.queryByText('Forms')).not.toBeInTheDocument();
    tick(100);
    expect(screen.getByText('Forms')).toBeInTheDocument();
    expect(screen.getByText('Looked at 14 pages')).toBeInTheDocument();
  });

  it('finishes with what it found and a safe copy', async () => {
    const { user, onContinue } = start();
    tick(100, 8);
    expect(await screen.findByRole('heading', { name: 'Here is what I know about your site' })).toBeInTheDocument();
    expect(screen.getByText('Harbor Bakery is healthy. I found three things worth fixing, and a safe copy is ready.')).toBeInTheDocument();
    expect(screen.getByText('Full access')).toBeInTheDocument();
    for (const t of ['Pages', 'Forms', 'Plugins', 'Speed on phones', 'Accessibility', 'Safe copy']) expect(screen.getByText(t)).toBeInTheDocument();
    expect(screen.getByText('3 to fix')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getAllByText('Worth fixing')).toHaveLength(3);
    expect(screen.getByText('Finished')).toBeInTheDocument();
    expect(screen.getByText('Took a safe copy of your site')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Pick a first change' }));
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it('says what a Content only plan could not read', async () => {
    start('content');
    tick(100, 8);
    expect(await screen.findByRole('heading', { name: 'Here is what I know about your site' })).toBeInTheDocument();
    expect(screen.getByText('I could read the pages and content. The theme and plugins are off limits on this plan.')).toBeInTheDocument();
    expect(screen.getByText('Content only')).toBeInTheDocument();
    expect(screen.getByText('Your host allows Content only. I can read and change pages, posts and images, but not the theme or plugins.')).toBeInTheDocument();
    expect(screen.queryByText('Forms')).not.toBeInTheDocument();
    expect(screen.getByText('Finished with a note')).toBeInTheDocument();
    expect(screen.getByText(/security plugin blocked me/)).toBeInTheDocument();
    expect(screen.getByText('Tried to open the Contact form')).toBeInTheDocument();
    expect(screen.getByText('blocked')).toBeInTheDocument();
  });

  it('goes back', async () => {
    const { user, onBack } = start();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('opens a group of steps to show them', async () => {
    const { user } = start();
    tick(100, 8);
    const group = await screen.findByRole('button', { name: /Looked at 14 pages/ });
    expect(group).toHaveAttribute('aria-expanded', 'false');
    await user.click(group);
    expect(within(group.closest('.p-stepgroup') as HTMLElement).getByText(/Read 14 pages/)).toBeInTheDocument();
  });
});
