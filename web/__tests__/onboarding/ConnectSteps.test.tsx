import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AccessRow } from '../../src/onboarding/AccessRow.tsx';
import { Checklist } from '../../src/onboarding/Checklist.tsx';
import {
  AddressStep, AdminNeededStep, ApprovalStep, ConnectedStep, ExistingPagesStep, PairingStep, RouteStep, SecureStep,
} from '../../src/onboarding/ConnectSteps.tsx';
import { SiteConfirmCard } from '../../src/onboarding/SiteConfirmCard.tsx';
import { Banner } from '../../src/ui/Banner.tsx';

const fns = () => ({ onBack: vi.fn(), onSaveAndExit: vi.fn(), onAsk: vi.fn() });

describe('SiteConfirmCard, AccessRow, Banner, Checklist', () => {
  it('shows a recognised site with its WordPress version', () => {
    render(<SiteConfirmCard name="Harbor Bakery" url="harborbakery.com" state="recognised" />);
    expect(screen.getByText('Harbor Bakery')).toBeInTheDocument();
    expect(screen.getByText('harborbakery.com')).toBeInTheDocument();
    expect(screen.getByText('WordPress 6.8')).toBeInTheDocument();
    expect(screen.queryByText(/cannot change it/)).not.toBeInTheDocument();
  });

  it('shows a connected site with the read-only reassurance', () => {
    render(<SiteConfirmCard name="Harbor Bakery" url="harborbakery.com" state="connected" />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Wursor can see your site but cannot change it without your approval.')).toBeInTheDocument();
  });

  it('says where the site lives and how much access it has', () => {
    const { rerender } = render(<AccessRow access="full" />);
    expect(screen.getByText('Lives on your WordPress')).toBeInTheDocument();
    expect(screen.getByText('Full access')).toBeInTheDocument();
    rerender(<AccessRow access="content" />);
    expect(screen.getByText('Content only')).toBeInTheDocument();
  });

  it('shows a banner with an optional action', async () => {
    const onAction = vi.fn();
    render(<Banner action={{ label: 'Details', onClick: onAction }}>Changing your theme needs Full access.</Banner>);
    await userEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('shows a warning banner', () => {
    render(<Banner tone="warning">Wursor never publishes a new site over existing pages.</Banner>);
    expect(screen.getByText('Wursor never publishes a new site over existing pages.').closest('.ui-banner')).toHaveAttribute('data-tone', 'warning');
  });

  it('shows a failed line with its plain reason', () => {
    render(<Checklist label="Progress" items={[{ label: 'Helper found', state: 'failed', detail: 'Blocked by a security plugin' }]} />);
    const item = screen.getByRole('listitem');
    expect(item).toHaveAttribute('data-state', 'failed');
    expect(within(item).getByText('Blocked by a security plugin')).toBeInTheDocument();
  });

  it('lets a line say more than Done or Waiting', () => {
    render(<Checklist label="Progress" items={[{ label: 'Safe copy ready', state: 'done', detail: 'Backup taken just now' }]} />);
    expect(screen.getByText('Backup taken just now')).toBeInTheDocument();
  });
});

describe('Connect your site: address (4a, 4b, 4h, 4i)', () => {
  const setup = (check: (a: string) => Promise<'ok' | 'unreachable' | 'not-wordpress'> = () => Promise.resolve('ok')) => {
    const h = { ...fns(), onRecognised: vi.fn() };
    render(<AddressStep check={check} {...h} />);
    return h;
  };
  const field = () => screen.getByRole('textbox', { name: 'Site address' });
  const go = () => screen.getByRole('button', { name: /Continue|Checking/ });

  it('asks for the address and promises to look only at what a visitor can see', () => {
    setup();
    expect(screen.getByText('6 of 8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Connect your site' })).toBeInTheDocument();
    expect(screen.getByText('Enter your site’s address. Wursor only looks at what any visitor can see.')).toBeInTheDocument();
    expect(field()).toHaveAttribute('placeholder', 'harborbakery.com');
    expect(field()).toHaveFocus();
    expect(screen.getByText('Example: yourbusiness.com')).toBeInTheDocument();
    expect(screen.getByText('Wursor can see your site but cannot change it without your approval.')).toBeInTheDocument();
  });

  it('keeps Continue quiet until the address looks like one', async () => {
    setup();
    expect(go()).toHaveAttribute('aria-disabled', 'true');
    await userEvent.type(field(), 'harborbakery');
    expect(go()).toHaveAttribute('aria-disabled', 'true');
    await userEvent.type(field(), '.com');
    expect(go()).toHaveAttribute('aria-disabled', 'false');
  });

  it('checks the address, says it is checking, then hands on the recognised site', async () => {
    let finish: (v: 'ok') => void = () => {};
    const { onRecognised } = setup(() => new Promise((r) => { finish = r; }));
    await userEvent.type(field(), 'harborbakery.com{Enter}');
    expect(screen.getByText('Checking that harborbakery.com is a WordPress site…')).toBeInTheDocument();
    expect(go()).toHaveTextContent('Checking…');
    finish('ok');
    await vi.waitFor(() => expect(onRecognised).toHaveBeenCalledWith('harborbakery.com'));
  });

  it('cleans up what was typed: no https, no trailing slash', async () => {
    const check = vi.fn().mockResolvedValue('ok');
    setup(check);
    await userEvent.type(field(), ' https://harborbakery.com/ {Enter}');
    expect(check).toHaveBeenCalledWith('harborbakery.com');
  });

  it('explains when the site cannot be reached', async () => {
    setup(() => Promise.resolve('unreachable'));
    await userEvent.type(field(), 'harborbakery.com{Enter}');
    expect(await screen.findByText('We couldn’t reach this address.')).toBeInTheDocument();
    expect(screen.getByText('We can\'t reach your site')).toBeInTheDocument();
    expect(screen.getByText('harborbakery.com didn\'t respond. Check the address and that the site is online, then try again.')).toBeInTheDocument();
    expect(field()).toHaveAttribute('aria-invalid', 'true');
    expect(go()).toHaveAttribute('aria-disabled', 'true');
  });

  it('tries again from the problem card', async () => {
    const check = vi.fn().mockResolvedValueOnce('unreachable').mockResolvedValueOnce('ok');
    const { onRecognised } = setup(check);
    await userEvent.type(field(), 'harborbakery.com{Enter}');
    await userEvent.click(await screen.findByRole('button', { name: 'Try again' }));
    await vi.waitFor(() => expect(onRecognised).toHaveBeenCalled());
  });

  it('says when it does not look like WordPress and offers another address', async () => {
    const { onAsk } = setup(() => Promise.resolve('not-wordpress'));
    await userEvent.type(field(), 'harborbakery.shop{Enter}');
    expect(await screen.findByText('This doesn’t look like WordPress.')).toBeInTheDocument();
    expect(screen.getByText('This doesn\'t look like a WordPress site')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Use another address' }));
    expect(field()).toHaveValue('');
    expect(field()).toHaveFocus();
    expect(onAsk).not.toHaveBeenCalled();
  });

  it('asks a person from either problem', async () => {
    const { onAsk } = setup(() => Promise.resolve('unreachable'));
    await userEvent.type(field(), 'harborbakery.com{Enter}');
    await userEvent.click(await screen.findByRole('button', { name: 'Ask a person' }));
    expect(onAsk).toHaveBeenCalledOnce();
  });
});

describe('We found your site (4c)', () => {
  it('offers two routes, the quickest chosen, and opens WordPress to approve', async () => {
    const h = { ...fns(), onContinue: vi.fn() };
    render(<RouteStep siteName="Harbor Bakery" url="harborbakery.com" {...h} />);
    expect(screen.getByRole('heading', { name: 'We found your site' })).toBeInTheDocument();
    expect(screen.getByText('Choose how you’d like to connect it. The first option is the quickest.')).toBeInTheDocument();
    expect(screen.getByText('WordPress 6.8')).toBeInTheDocument();
    const routes = within(screen.getByRole('radiogroup', { name: 'How to connect' })).getAllByRole('radio');
    expect(routes.map((r) => (r as HTMLInputElement).checked)).toEqual([true, false]);
    expect(screen.getByText('Opens your site’s own approval screen in a new tab. Nothing to install by hand.')).toBeInTheDocument();
    expect(screen.getByText('Use a pairing code if you can’t log in to WordPress right now.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Open WordPress to approve' }));
    expect(h.onContinue).toHaveBeenCalledWith('approve');
  });

  it('carries on with the helper plugin when that is chosen', async () => {
    const h = { ...fns(), onContinue: vi.fn() };
    render(<RouteStep siteName="Harbor Bakery" url="harborbakery.com" {...h} />);
    await userEvent.click(screen.getByRole('radio', { name: /Install the Wursor helper plugin/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Get a pairing code' }));
    expect(h.onContinue).toHaveBeenCalledWith('pair');
  });
});

describe('Approve in WordPress (4d, 4l)', () => {
  it('says where the approval tab is and shows progress, with a way to open it again', async () => {
    const h = { ...fns(), onReopen: vi.fn() };
    render(<ApprovalStep siteName="Harbor Bakery" url="harborbakery.com" items={[
      { label: 'Reaching your site', state: 'done' }, { label: 'Helper found', state: 'running' },
      { label: 'Paired securely', state: 'pending' }, { label: 'Safe copy ready', state: 'pending' },
    ]} {...h} />);
    expect(screen.getByRole('heading', { name: 'Approve in WordPress' })).toBeInTheDocument();
    expect(screen.getByText('We opened harborbakery.com/wp-admin in a new tab. Approve the connection there, then come back here.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Open it again' }));
    expect(h.onReopen).toHaveBeenCalledOnce();
  });

  it('explains when the account cannot approve', async () => {
    const h = { ...fns(), onLogin: vi.fn() };
    render(<AdminNeededStep siteName="Harbor Bakery" url="harborbakery.com" {...h} />);
    expect(screen.getByText('WordPress told us your account can’t approve connections.')).toBeInTheDocument();
    expect(screen.getByText('You need to be an administrator')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Log in as admin' }));
    expect(h.onLogin).toHaveBeenCalledOnce();
  });
});

describe('Pair with a code (4e)', () => {
  it('walks through three steps with the code shown large and a Copy button', async () => {
    const h = { ...fns(), onContinue: vi.fn(), onDownload: vi.fn() };
    render(<PairingStep code="H7K 29Q" {...h} />);
    expect(screen.getByRole('heading', { name: 'Pair with a code' })).toBeInTheDocument();
    expect(screen.getByText('Three small steps. Wursor keeps checking, so you can do them in any order.')).toBeInTheDocument();
    expect(screen.getByText('Download the Wursor helper')).toBeInTheDocument();
    expect(screen.getByText('Upload and activate it in WordPress')).toBeInTheDocument();
    expect(screen.getByText('Plugins, then Add New, then Upload Plugin.')).toBeInTheDocument();
    expect(screen.getByText('Enter this code when asked')).toBeInTheDocument();
    expect(screen.getByText('It expires in ten minutes.')).toBeInTheDocument();
    expect(screen.getByText('Pairing code')).toBeInTheDocument();
    expect(screen.getByText('H7K 29Q')).toBeInTheDocument();
    expect(screen.getByText('Waiting for the helper to check in…')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Download helper' }));
    expect(h.onDownload).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole('button', { name: 'I’ve entered the code' }));
    expect(h.onContinue).toHaveBeenCalledOnce();
  });

  it('copies the code without the space and says so', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<PairingStep code="H7K 29Q" {...fns()} onContinue={vi.fn()} onDownload={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith('H7K29Q');
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});

describe('Connecting securely, and what can go wrong (4f, 4j, 4k, 4n)', () => {
  it('shows the live steps and the reassurance', () => {
    render(<SecureStep heading="Connecting securely" subheading="This usually takes under a minute. You don’t need to do anything." reassurance items={[
      { label: 'Reaching your site', state: 'done' }, { label: 'Helper found', state: 'done' },
      { label: 'Paired securely', state: 'running', detail: 'Exchanging a one-time key' }, { label: 'Safe copy ready', state: 'pending' },
    ]} {...fns()} />);
    expect(screen.getByText('Exchanging a one-time key')).toBeInTheDocument();
    expect(screen.getByText('Wursor can see your site but cannot change it without your approval.')).toBeInTheDocument();
  });

  it('puts the problem card after the steps when a helper is blocked (4j)', async () => {
    const onPrimary = vi.fn();
    render(<SecureStep heading="Connecting securely" subheading="Something on your site stopped the connection." items={[
      { label: 'Reaching your site', state: 'done' }, { label: 'Helper found', state: 'failed', detail: 'Blocked by a security plugin' },
      { label: 'Paired securely', state: 'pending' }, { label: 'Safe copy ready', state: 'pending' },
    ]} problem={{ icon: 'shield', title: 'Your security plugin blocked the helper', body: 'A firewall on your site stopped the connection. Allow Wursor, or use the pairing code instead.', primary: 'Use pairing code', onPrimary, secondary: 'Ask a person', onSecondary: vi.fn() }} {...fns()} />);
    const list = screen.getByRole('list');
    const card = screen.getByText('Your security plugin blocked the helper');
    expect(list.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Use pairing code' }));
    expect(onPrimary).toHaveBeenCalledOnce();
  });

  it('puts the problem card before the steps when a code expired (4k)', () => {
    render(<SecureStep heading="Pair with a code" subheading="Enter the code on your site within ten minutes." problemFirst items={[
      { label: 'Reaching your site', state: 'done' }, { label: 'Helper found', state: 'done' },
      { label: 'Paired securely', state: 'failed', detail: 'The code ran out of time' }, { label: 'Safe copy ready', state: 'pending' },
    ]} problem={{ icon: 'clock', title: 'That code has expired', body: 'Codes last ten minutes. We can make a new one for you.', primary: 'Get a new code', onPrimary: vi.fn(), secondary: 'Ask a person', onSecondary: vi.fn() }} {...fns()} />);
    const list = screen.getByRole('list');
    const card = screen.getByText('That code has expired');
    expect(list.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });
});

describe('Connected (4g, 4m, 4o) and already has pages (4p)', () => {
  const base = { siteName: 'Harbor Bakery', url: 'harborbakery.com', ...fns(), onContinue: vi.fn() };

  it('connected with full access: lists the checks and offers a first look', async () => {
    render(<ConnectedStep {...base} variant="first-look" />);
    expect(screen.getByRole('heading', { name: 'You’re connected' })).toBeInTheDocument();
    expect(screen.getByText('Wursor has a safe copy of your site and can start with a first look.')).toBeInTheDocument();
    expect(screen.getByText('Full access')).toBeInTheDocument();
    expect(screen.getByText('Backup taken just now')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Take a first look' }));
    expect(base.onContinue).toHaveBeenCalled();
  });

  it('connected with content only: says what that means', async () => {
    const onDetails = vi.fn();
    render(<ConnectedStep {...base} variant="content-only" onDetails={onDetails} />);
    expect(screen.getByText('Wursor can work on your pages, posts and images.')).toBeInTheDocument();
    expect(screen.getByText('Content only')).toBeInTheDocument();
    expect(screen.getByText('Changing your theme or plugins needs Full access. Your host does not allow that on this plan.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(onDetails).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('an empty site: says nothing changes until approved, and moves to the brief', () => {
    render(<ConnectedStep {...base} variant="empty" />);
    expect(screen.getByRole('heading', { name: 'This site is empty' })).toBeInTheDocument();
    expect(screen.getByText('We will build your site here and publish it to this WordPress when you approve.')).toBeInTheDocument();
    expect(screen.getByText('Nothing on your WordPress changes until you approve.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tell us about your site' })).toBeInTheDocument();
  });

  it('a site that already has pages: never publishes over them', async () => {
    const h = { ...fns(), onConnectAsIs: vi.fn(), onChooseAnother: vi.fn() };
    render(<ExistingPagesStep siteName="Harbor Bakery" url="harborbakery.com" {...h} />);
    expect(screen.getByRole('heading', { name: 'This site already has pages' })).toBeInTheDocument();
    expect(screen.getByText('Wursor never publishes a new site over existing pages.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Connect it as it is' }));
    await userEvent.click(screen.getByRole('button', { name: 'Choose another site' }));
    expect([h.onConnectAsIs, h.onChooseAnother].map((f) => f.mock.calls.length)).toEqual([1, 1]);
  });
});
