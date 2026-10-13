import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChoosePlatformStep } from '../../src/onboarding/ChoosePlatformStep.tsx';
import { ChooseWpSiteStep } from '../../src/onboarding/ChooseWpSiteStep.tsx';
import { WpPermissionsStep } from '../../src/onboarding/WpPermissionsStep.tsx';
import { WpWaitingStep } from '../../src/onboarding/WpWaitingStep.tsx';
import { ProblemCard } from '../../src/onboarding/ProblemCard.tsx';
import { Checklist } from '../../src/onboarding/Checklist.tsx';

describe('Where is your site? (5a to 5c)', () => {
  const setup = () => {
    const h = { onContinue: vi.fn(), onBack: vi.fn(), onSaveAndExit: vi.fn() };
    render(<ChoosePlatformStep {...h} />);
    return h;
  };
  const choices = () => within(screen.getByRole('radiogroup', { name: 'Where is your site?' }));

  it('is step 5 of 8 and says how to choose when unsure', () => {
    setup();
    expect(screen.getByText('5 of 8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Where is your site?' })).toBeInTheDocument();
    expect(screen.getByText('This tells Wursor how to connect. If you are not sure, choose somewhere else and we will check.')).toBeInTheDocument();
  });

  it('offers WordPress.com or somewhere else, with what happens next', () => {
    setup();
    expect(choices().getByText('My site is on WordPress.com')).toBeInTheDocument();
    expect(choices().getByText('You sign in with WordPress.com and choose the site. No plugin to install.')).toBeInTheDocument();
    expect(choices().getByText('My site is somewhere else')).toBeInTheDocument();
    expect(choices().getByText('On another host. You enter the address, then approve the connection or enter a short code.')).toBeInTheDocument();
    expect(screen.getByText('Wursor can see your site but cannot change it without your approval.')).toBeInTheDocument();
  });

  it('keeps Continue quiet until one is chosen, then carries the choice on', async () => {
    const { onContinue } = setup();
    const go = screen.getByRole('button', { name: 'Continue' });
    expect(go).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(choices().getByRole('radio', { name: /WordPress.com/ }));
    expect(go).toHaveAttribute('aria-disabled', 'false');
    await userEvent.click(go);
    expect(onContinue).toHaveBeenCalledWith('wpcom');
  });

  it('passes on somewhere else', async () => {
    const { onContinue } = setup();
    await userEvent.click(choices().getByRole('radio', { name: /somewhere else/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onContinue).toHaveBeenCalledWith('other');
  });
});

describe('Sign in with WordPress.com (5d)', () => {
  it('lists what Wursor asks for, and that it can be revoked', async () => {
    const h = { onContinue: vi.fn(), onBack: vi.fn(), onSaveAndExit: vi.fn() };
    render(<WpPermissionsStep {...h} />);
    expect(screen.getByText('6 of 8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sign in with WordPress.com' })).toBeInTheDocument();
    expect(screen.getByText('You will sign in on WordPress.com and choose your site. Wursor asks to:')).toBeInTheDocument();
    const rows = within(screen.getByRole('list', { name: 'What Wursor asks for' })).getAllByRole('listitem');
    expect(rows.map((r) => r.textContent)).toEqual([
      'See your pages, posts and mediaSo Wursor can learn how your site is put together.',
      'Change them, only after you approveEvery change is made on a safe copy first.',
      'Never see your passwordYou sign in on WordPress.com, not in Wursor.',
    ]);
    expect(screen.getByText('You can revoke this any time, in WordPress.com or in Wursor.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Continue to WordPress.com' }));
    expect(h.onContinue).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(h.onBack).toHaveBeenCalledOnce();
  });
});

describe('Finish signing in on WordPress.com (5e)', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());
  const tick = (ms: number, n: number) => { for (let i = 0; i < n; i++) act(() => void vi.advanceTimersByTime(ms)); };
  const setup = (outcome: 'approved' | 'closed' = 'approved') => {
    const h = { onApproved: vi.fn(), onClosed: vi.fn(), onBack: vi.fn(), onReopen: vi.fn(), onSaveAndExit: vi.fn() };
    render(<WpWaitingStep outcome={outcome} stepMs={1000} {...h} />);
    return h;
  };
  const states = () => within(screen.getByRole('list', { name: 'Connection progress' })).getAllByRole('listitem').map((i) => i.getAttribute('data-state'));

  it('says a window is open and lists where things are', () => {
    setup();
    expect(screen.getByRole('heading', { name: 'Finish signing in on WordPress.com' })).toBeInTheDocument();
    expect(screen.getByText('A new window is open. Choose your site there, approve, and come back here.')).toBeInTheDocument();
    expect(states()).toEqual(['done', 'running', 'pending', 'pending']);
    expect(screen.getByText('Opened WordPress.com')).toBeInTheDocument();
    expect(screen.getByText('Waiting for your approval')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'I have approved it' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('can open the window again', async () => {
    const { onReopen } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Open the window again' }));
    expect(onReopen).toHaveBeenCalledOnce();
  });

  it('moves on once approval is seen', async () => {
    const { onApproved } = setup();
    tick(1000, 2);
    expect(states()).toEqual(['done', 'done', 'done', 'running']);
    tick(1000, 1);
    const go = screen.getByRole('button', { name: 'I have approved it' });
    expect(go).toHaveAttribute('aria-disabled', 'false');
    await userEvent.setup({ advanceTimers: vi.advanceTimersByTime }).click(go);
    expect(onApproved).toHaveBeenCalledOnce();
  });

  it('reports a closed window instead', () => {
    const { onClosed, onApproved } = setup('closed');
    tick(1000, 2);
    expect(onClosed).toHaveBeenCalledOnce();
    expect(onApproved).not.toHaveBeenCalled();
  });
});

describe('Choose your site (5f)', () => {
  const SITES = [
    { id: 'a', name: 'harborbakery.com', detail: 'Business plan · Full access likely' },
    { id: 'b', name: 'harborbakery.wordpress.com', detail: 'Free plan · Content only likely' },
    { id: 'c', name: 'bakeryclub.blog', detail: 'Personal plan · Content only likely' },
  ];
  it('lists the sites with the first chosen, and connects the chosen one', async () => {
    const h = { onContinue: vi.fn(), onBack: vi.fn(), onSaveAndExit: vi.fn() };
    render(<ChooseWpSiteStep sites={SITES} {...h} />);
    expect(screen.getByRole('heading', { name: 'Choose your site' })).toBeInTheDocument();
    expect(screen.getByText('You have three sites on WordPress.com. Wursor will work on the one you pick.')).toBeInTheDocument();
    const radios = within(screen.getByRole('radiogroup', { name: 'Choose your site' })).getAllByRole('radio');
    expect(radios.map((r) => (r as HTMLInputElement).checked)).toEqual([true, false, false]);
    expect(screen.getByText('Business plan · Full access likely')).toBeInTheDocument();
    await userEvent.click(radios[2]!);
    await userEvent.click(screen.getByRole('button', { name: 'Connect this site' }));
    expect(h.onContinue).toHaveBeenCalledWith('c');
  });
});

describe('ProblemCard and Checklist (shared)', () => {
  it('explains one problem and offers one fix and a person', async () => {
    const onPrimary = vi.fn();
    const onAsk = vi.fn();
    render(<ProblemCard icon="lock" title="The WordPress.com window was closed" body="Nothing was connected." primary="Try again" onPrimary={onPrimary} secondary="Ask a person" onSecondary={onAsk} />);
    expect(screen.getByText('The WordPress.com window was closed')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await userEvent.click(screen.getByRole('button', { name: 'Ask a person' }));
    expect([onPrimary, onAsk].map((f) => f.mock.calls.length)).toEqual([1, 1]);
  });

  it('shows each line done, working or waiting', () => {
    render(<Checklist label="Progress" items={[{ label: 'A', state: 'done' }, { label: 'B', state: 'running' }, { label: 'C', state: 'pending' }]} />);
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Working…')).toBeInTheDocument();
    expect(screen.getByText('Waiting')).toBeInTheDocument();
  });
});
