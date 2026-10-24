import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectSiteFlow, type Scenario } from '../../src/onboarding/ConnectSiteFlow.tsx';

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());

const tick = (ms: number, n: number) => { for (let i = 0; i < n; i++) act(() => void vi.advanceTimersByTime(ms)); };

const start = async (scenario: Scenario = 'ok', purpose: 'connect' | 'build' = 'connect') => {
  const h = { onDone: vi.fn(), onChooseCloud: vi.fn(), onBackOut: vi.fn(), onSaveAndExit: vi.fn() };
  render(<ConnectSiteFlow scenario={scenario} purpose={purpose} stepMs={100} checkMs={50} {...h} />);
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  await user.type(screen.getByRole('textbox', { name: 'Site address' }), 'harborbakery.com{Enter}');
  tick(50, 2);
  return { user, ...h };
};

describe('connect flow', () => {
  it('goes from the address to the choice of route', async () => {
    await start();
    expect(await screen.findByRole('heading', { name: 'We found your site' })).toBeInTheDocument();
  });

  it('reaches connected by the approval route, ending in a first look', async () => {
    const { user, onDone } = await start();
    await user.click(await screen.findByRole('button', { name: 'Open WordPress to approve' }));
    expect(screen.getByRole('heading', { name: 'Approve in WordPress' })).toBeInTheDocument();
    tick(100, 6);
    expect(await screen.findByRole('heading', { name: 'You’re connected' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Take a first look' }));
    expect(onDone).toHaveBeenCalledWith('first-look');
  });

  it('stops for an account that cannot approve', async () => {
    const { user } = await start('admin');
    await user.click(await screen.findByRole('button', { name: 'Open WordPress to approve' }));
    tick(100, 3);
    expect(await screen.findByText('You need to be an administrator')).toBeInTheDocument();
  });

  it('explains a code that expired and offers a new one', async () => {
    const { user } = await start('expired');
    await user.click(await screen.findByRole('radio', { name: /Install the Wursor helper plugin/ }));
    await user.click(screen.getByRole('button', { name: 'Get a pairing code' }));
    await user.click(screen.getByRole('button', { name: 'I’ve entered the code' }));
    tick(100, 3);
    expect(await screen.findByText('That code has expired')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Get a new code' }));
    expect(screen.getByRole('heading', { name: 'Pair with a code' })).toBeInTheDocument();
  });

  it('explains a security plugin that blocked the helper', async () => {
    const { user } = await start('blocked');
    await user.click(await screen.findByRole('button', { name: 'Open WordPress to approve' }));
    tick(100, 3);
    expect(await screen.findByText('Your security plugin blocked the helper')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Use pairing code' }));
    expect(screen.getByRole('heading', { name: 'Pair with a code' })).toBeInTheDocument();
  });

  it('offers Content only or Wursor Cloud when the host blocks plugins', async () => {
    const { user, onChooseCloud } = await start('noplugins');
    await user.click(await screen.findByRole('radio', { name: /Install the Wursor helper plugin/ }));
    await user.click(screen.getByRole('button', { name: 'Get a pairing code' }));
    await user.click(screen.getByRole('button', { name: 'I’ve entered the code' }));
    tick(100, 3);
    expect(await screen.findByText('Your host does not allow plugins')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Move to Wursor Cloud' }));
    expect(onChooseCloud).toHaveBeenCalledOnce();
  });

  it('connects with content only access when the host allows no more', async () => {
    const { user } = await start('content');
    await user.click(await screen.findByRole('button', { name: 'Open WordPress to approve' }));
    tick(100, 6);
    expect(await screen.findByText('Wursor can work on your pages, posts and images.')).toBeInTheDocument();
  });

  it('on the build path, an empty site goes on to the brief', async () => {
    const { user, onDone } = await start('empty', 'build');
    await user.click(await screen.findByRole('button', { name: 'Open WordPress to approve' }));
    tick(100, 6);
    expect(await screen.findByRole('heading', { name: 'This site is empty' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tell us about your site' }));
    expect(onDone).toHaveBeenCalledWith('empty');
  });

  it('on the build path, a site with pages is never published over', async () => {
    await start('pages', 'build');
    expect(await screen.findByRole('heading', { name: 'This site already has pages' })).toBeInTheDocument();
  });
});
