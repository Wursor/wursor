import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DomainFlow, type DomainScenario } from '../../src/onboarding/DomainFlow.tsx';
import { DomainStatusRow } from '../../src/onboarding/DomainStatusRow.tsx';

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());

const tick = (ms: number, n = 1) => { for (let i = 0; i < n; i++) act(() => void vi.advanceTimersByTime(ms)); };

const start = (scenario: DomainScenario = 'ok') => {
  const h = { onDone: vi.fn(), onLater: vi.fn(), onBackOut: vi.fn(), onSaveAndExit: vi.fn() };
  render(<DomainFlow scenario={scenario} checkMs={50} secureMs={100} {...h} />);
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  return { user, ...h };
};

const enterAddress = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByRole('textbox', { name: 'Web address' }), 'harborbakery.com');
  await user.click(screen.getByRole('button', { name: 'Check this address' }));
};

describe('DomainStatusRow', () => {
  it('says what is happening in each state', () => {
    const { rerender } = render(<DomainStatusRow state="waiting" note="Checked 12 s ago" />);
    expect(screen.getByText('Waiting for the record')).toBeInTheDocument();
    expect(screen.getByText('We are checking every 30 seconds. This can take up to an hour.')).toBeInTheDocument();
    expect(screen.getByText('Checked 12 s ago')).toBeInTheDocument();
    rerender(<DomainStatusRow state="wrong" note="Checked 12 s ago" />);
    expect(screen.getByText('The record points somewhere else')).toBeInTheDocument();
    rerender(<DomainStatusRow state="securing" note="Started just now" />);
    expect(screen.getByText('Securing the connection')).toBeInTheDocument();
    rerender(<DomainStatusRow state="secure" address="harborbakery.com" note="Checked just now" />);
    expect(screen.getByText('Connected and secure')).toBeInTheDocument();
    expect(screen.getByText('harborbakery.com now shows your site with a valid certificate.')).toBeInTheDocument();
  });

  it('announces changes politely', () => {
    render(<DomainStatusRow state="waiting" note="Checked just now" />);
    expect(screen.getByRole('status')).toHaveTextContent('Waiting for the record');
  });
});

describe('domain flow', () => {
  it('starts with the address, the CTA quiet until it looks like an address', async () => {
    const { user } = start();
    expect(screen.getByRole('heading', { name: 'Connect your web address' })).toBeInTheDocument();
    expect(screen.getByText('Example: yourbusiness.com')).toBeInTheDocument();
    expect(screen.getByText('Your site stays at harborbakery.wursor.site until you switch.')).toBeInTheDocument();
    const cta = screen.getByRole('button', { name: 'Check this address' });
    expect(cta).toHaveAttribute('aria-disabled', 'true');
    await user.type(screen.getByRole('textbox', { name: 'Web address' }), 'harborbakery');
    expect(cta).toHaveAttribute('aria-disabled', 'true');
    await user.type(screen.getByRole('textbox', { name: 'Web address' }), '.com');
    expect(cta).toHaveAttribute('aria-disabled', 'false');
  });

  it('lets them do it later', async () => {
    const { user, onLater } = start();
    await user.click(screen.getByRole('button', { name: 'Do this later' }));
    expect(onLater).toHaveBeenCalledOnce();
  });

  it('shows the one record to add, and says it is waiting', async () => {
    const { user } = start();
    await enterAddress(user);
    expect(screen.getByRole('heading', { name: 'Add this record where you bought it' })).toBeInTheDocument();
    expect(screen.getByText('CNAME')).toBeInTheDocument();
    expect(screen.getByText('www')).toBeInTheDocument();
    expect(screen.getByText('sites.wursor.site')).toBeInTheDocument();
    expect(screen.getByText('Waiting for the record')).toBeInTheDocument();
  });

  it('copies the record value and says so', async () => {
    const { user } = start();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    await enterAddress(user);
    await user.click(screen.getByRole('button', { name: 'Copy record value' }));
    expect(writeText).toHaveBeenCalledWith('sites.wursor.site');
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('offers instructions for GoDaddy, Namecheap and Cloudflare, GoDaddy first', async () => {
    const { user } = start();
    await enterAddress(user);
    expect(screen.getByRole('radio', { name: 'GoDaddy' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: 'Cloudflare' }));
    expect(screen.getByRole('radio', { name: 'Cloudflare' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'GoDaddy' })).not.toBeChecked();
  });

  it('goes back to the address from the record', async () => {
    const { user } = start();
    await enterAddress(user);
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('heading', { name: 'Connect your web address' })).toBeInTheDocument();
  });

  it('secures the connection once the record is found, then offers the switch', async () => {
    const { user } = start();
    await enterAddress(user);
    await user.click(screen.getByRole('button', { name: 'Check now' }));
    tick(50, 2);
    expect(await screen.findByRole('heading', { name: 'Your address is pointing here' })).toBeInTheDocument();
    expect(screen.getByText('Securing the connection')).toBeInTheDocument();
    expect(screen.getByText('This usually takes about a minute.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch to harborbakery.com' })).toHaveAttribute('aria-disabled', 'true');
    tick(100, 2);
    expect(await screen.findByRole('heading', { name: 'Your address is connected' })).toBeInTheDocument();
    expect(screen.getByText('Connected and secure')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch to harborbakery.com' })).toHaveAttribute('aria-disabled', 'false');
  });

  it('says plainly when the record points somewhere else', async () => {
    const { user } = start('wrong-record');
    await enterAddress(user);
    await user.click(screen.getByRole('button', { name: 'Check now' }));
    tick(50, 2);
    expect(await screen.findByText('The record points somewhere else')).toBeInTheDocument();
    expect(screen.getByText('Your address points to another service. Change the record to the one shown.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check again' })).toBeInTheDocument();
  });

  it('goes live on the switch, and can be undone until they leave', async () => {
    const { user, onDone } = start();
    await enterAddress(user);
    await user.click(screen.getByRole('button', { name: 'Check now' }));
    tick(50, 2);
    tick(100, 3);
    await user.click(await screen.findByRole('button', { name: 'Switch to harborbakery.com' }));
    expect(await screen.findByRole('heading', { name: 'Harbor Bakery is live on harborbakery.com' })).toBeInTheDocument();
    expect(screen.getByText('Secure connection · Hosted by Wursor Cloud')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Undo the switch' }));
    expect(await screen.findByRole('heading', { name: 'Your address is connected' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Switch to harborbakery.com' }));
    await user.click(await screen.findByRole('button', { name: 'Go to your site' }));
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('lets them step back from the connected screen without switching', async () => {
    const { user, onLater } = start();
    await enterAddress(user);
    await user.click(screen.getByRole('button', { name: 'Check now' }));
    tick(50, 2);
    tick(100, 3);
    await user.click(await screen.findByRole('button', { name: 'Not yet' }));
    expect(onLater).toHaveBeenCalledOnce();
  });
});
