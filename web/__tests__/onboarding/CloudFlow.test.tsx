import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AboutSiteStep } from '../../src/onboarding/AboutSiteStep.tsx';
import { PickLookStep } from '../../src/onboarding/PickLookStep.tsx';
import { SetupStep } from '../../src/onboarding/SetupStep.tsx';

describe('About your site (A1a, A1b)', () => {
  const setup = () => {
    const h = { onContinue: vi.fn(), onBack: vi.fn(), onSaveAndExit: vi.fn() };
    render(<AboutSiteStep {...h} />);
    return h;
  };
  const cta = () => screen.getByRole('button', { name: 'Show me three looks' });

  it('is step 5 of 8 and says there are five short questions', () => {
    setup();
    expect(screen.getByText('5 of 8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tell us about your site' })).toBeInTheDocument();
    expect(screen.getByText('Five short questions. You can skip any of them.')).toBeInTheDocument();
  });

  it('asks the three open questions with examples', () => {
    setup();
    expect(screen.getByRole('textbox', { name: 'What does your business do?' })).toHaveAttribute('placeholder', 'For example: a neighbourhood bakery');
    expect(screen.getByRole('textbox', { name: 'Who is it for?' })).toHaveAttribute('placeholder', 'For example: people who live nearby');
    expect(screen.getByRole('textbox', { name: 'What should visitors do?' })).toHaveAttribute('placeholder', 'For example: call us, or book a table');
  });

  it('offers seven pages, with Home already chosen, and lets each be toggled', async () => {
    setup();
    const chips = within(screen.getByRole('group', { name: 'Which pages do you want?' })).getAllByRole('button');
    expect(chips.map((c) => c.textContent)).toEqual(['Home', 'Menu', 'About', 'Contact', 'Shop', 'Blog', 'Gallery']);
    expect(chips.map((c) => c.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false', 'false', 'false', 'false', 'false']);
    await userEvent.click(chips[1]!);
    expect(chips[1]).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(chips[1]!);
    expect(chips[1]).toHaveAttribute('aria-pressed', 'false');
  });

  it('offers three tones, warm to begin with', () => {
    setup();
    const tones = within(screen.getByRole('radiogroup', { name: 'What should it feel like?' })).getAllByRole('radio');
    expect(tones.map((t) => t.textContent)).toEqual(['Warm and friendly', 'Clean and simple', 'Bold and modern']);
    expect(tones.map((t) => t.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false']);
  });

  it('keeps the button quiet until something has been written', async () => {
    setup();
    expect(cta()).toHaveAttribute('aria-disabled', 'true');
    await userEvent.type(screen.getByRole('textbox', { name: 'What does your business do?' }), 'A neighbourhood bakery');
    expect(cta()).toHaveAttribute('aria-disabled', 'false');
  });

  it('passes the answers on', async () => {
    const { onContinue } = setup();
    await userEvent.type(screen.getByRole('textbox', { name: 'What does your business do?' }), 'A bakery');
    await userEvent.type(screen.getByRole('textbox', { name: 'Who is it for?' }), 'Locals');
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
    await userEvent.click(screen.getByRole('radio', { name: 'Bold and modern' }));
    await userEvent.click(cta());
    expect(onContinue).toHaveBeenCalledWith({ business: 'A bakery', audience: 'Locals', action: '', pages: ['Home', 'Menu'], tone: 'bold' });
  });

  it('goes back or saves and exits', async () => {
    const { onBack, onSaveAndExit } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save and exit' }));
    expect(onBack).toHaveBeenCalledOnce();
    expect(onSaveAndExit).toHaveBeenCalledOnce();
  });
});

/** Advance fake time one step at a time, as real time does: each tick schedules the next after a re-render. */
const tick = (ms: number, times: number) => {
  for (let i = 0; i < times; i++) act(() => void vi.advanceTimersByTime(ms));
};

describe('Pick a look (A2a to A2c)', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());
  const setup = (readyAfterMs?: number) => {
    const h = { onContinue: vi.fn(), onBack: vi.fn(), onSaveAndExit: vi.fn() };
    render(<PickLookStep {...h} {...(readyAfterMs !== undefined && { stepMs: readyAfterMs })} />);
    return { ...h, user: userEvent.setup({ advanceTimers: vi.advanceTimersByTime }) };
  };
  const looks = () => within(screen.getByRole('radiogroup', { name: 'Pick a look' }));

  it('is step 6 of 8 with real homepage previews promised', () => {
    setup();
    expect(screen.getByText('6 of 8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pick a look' })).toBeInTheDocument();
    expect(screen.getByText('These are real previews of your homepage. You can change everything later.')).toBeInTheDocument();
  });

  it('shows the first look at once while the others are still being designed', () => {
    setup();
    expect(looks().getByText('Warm and local')).toBeInTheDocument();
    expect(looks().getAllByText('Look in progress')).toHaveLength(2);
    expect(looks().getAllByText('Designing this look…')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: 'Show me three more looks' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Use this look' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('fills in the other two looks as they finish', () => {
    setup(1000);
    act(() => void vi.advanceTimersByTime(1000));
    expect(looks().getByText('Clean and calm')).toBeInTheDocument();
    expect(looks().getAllByText('Look in progress')).toHaveLength(1);
    act(() => void vi.advanceTimersByTime(1000));
    expect(looks().getByText('Bold and modern')).toBeInTheDocument();
    expect(looks().queryByText('Look in progress')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show me three more looks' })).toBeInTheDocument();
  });

  it('describes each look in a line', () => {
    setup(10);
    tick(10, 3);
    expect(looks().getByText('Peach tones, big friendly headline, photos first.')).toBeInTheDocument();
    expect(looks().getByText('Lots of white space and quiet type.')).toBeInTheDocument();
    expect(looks().getByText('Dark header, strong contrast, large buttons.')).toBeInTheDocument();
  });

  it('lets one look be chosen and carries it on', async () => {
    const { onContinue, user } = setup(10);
    tick(10, 3);
    await user.click(looks().getByRole('radio', { name: /Clean and calm/ }));
    expect(looks().getByRole('radio', { name: /Clean and calm/ })).toBeChecked();
    const use = screen.getByRole('button', { name: 'Use this look' });
    expect(use).toHaveAttribute('aria-disabled', 'false');
    await user.click(use);
    expect(onContinue).toHaveBeenCalledWith('clean');
  });

  it('cannot choose a look that is still being designed', () => {
    setup();
    expect(looks().getAllByRole('radio')).toHaveLength(1);
  });

  it('goes back', async () => {
    const { onBack, user } = setup();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});

describe('Setting up your site, then live (A4a, A4b)', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());
  const setup = () => {
    const h = { onConnectDomain: vi.fn(), onLater: vi.fn(), onSaveAndExit: vi.fn() };
    render(<SetupStep siteName="Harbor Bakery" address="harborbakery.wursor.site" stepMs={1000} {...h} />);
    return h;
  };

  it('is step 8 of 8 and lists what is being done, one thing at a time', () => {
    setup();
    expect(screen.getByText('8 of 8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Setting up your site' })).toBeInTheDocument();
    expect(screen.getByText('Your site is approved. We are getting its home ready.')).toBeInTheDocument();
    const items = within(screen.getByRole('list', { name: 'Setup progress' })).getAllByRole('listitem');
    expect(items.map((i) => i.getAttribute('data-state'))).toEqual(['running', 'pending', 'pending', 'pending']);
    expect(items.map((i) => within(i).getByText(/Creating|Installing|Securing|Taking/).textContent)).toEqual([
      'Creating your site', 'Installing your look', 'Securing the connection', 'Taking the first backup',
    ]);
    expect(screen.getByText('This usually takes a few minutes. You can close this page; we will email you when it is ready.')).toBeInTheDocument();
  });

  it('ticks each thing off in turn', () => {
    setup();
    act(() => void vi.advanceTimersByTime(1000));
    const items = within(screen.getByRole('list', { name: 'Setup progress' })).getAllByRole('listitem');
    expect(items.map((i) => i.getAttribute('data-state'))).toEqual(['done', 'running', 'pending', 'pending']);
    expect(within(items[0]!).getByText('Done')).toBeInTheDocument();
    expect(within(items[1]!).getByText('Working…')).toBeInTheDocument();
    expect(within(items[2]!).getByText('Waiting')).toBeInTheDocument();
  });

  it('then says the site is live, on a temporary address', () => {
    setup();
    tick(1000, 4);
    expect(screen.getByRole('heading', { name: 'Your site is live' })).toBeInTheDocument();
    expect(screen.getByText('It is on a temporary address for now. Connect your own web address when you are ready.')).toBeInTheDocument();
    expect(screen.getByText('Harbor Bakery')).toBeInTheDocument();
    expect(screen.getByText('harborbakery.wursor.site')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByText('Hosted by Wursor Cloud. Backed up daily and kept up to date.')).toBeInTheDocument();
    expect(screen.getByText('Search engines cannot see this address yet. They will once your own web address is connected.')).toBeInTheDocument();
  });

  it('offers to connect a web address now or later', async () => {
    const { onConnectDomain, onLater } = setup();
    tick(1000, 4);
    await userEvent.setup({ advanceTimers: vi.advanceTimersByTime }).click(screen.getByRole('button', { name: 'Connect your web address' }));
    await userEvent.setup({ advanceTimers: vi.advanceTimersByTime }).click(screen.getByRole('button', { name: 'Do this later' }));
    expect(onConnectDomain).toHaveBeenCalledOnce();
    expect(onLater).toHaveBeenCalledOnce();
  });
});
