import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from '../../src/system/ConfirmDialog.tsx';
import { EmptyState } from '../../src/system/EmptyState.tsx';
import { SystemScreen } from '../../src/system/SystemScreen.tsx';
import { Toast } from '../../src/ui/Toast.tsx';
import { AppShell } from '../../src/shell/AppShell.tsx';
import { MoreScreen } from '../../src/mobile/MoreScreen.tsx';
import { NotificationsSheet, SiteSwitcherSheet } from '../../src/mobile/Sheets.tsx';

describe('Toast', () => {
  it('says what happened, in the tone of what happened', () => {
    const { container, rerender } = render(<Toast tone="info">Change moved to Plan ready</Toast>);
    expect(screen.getByText('Change moved to Plan ready')).toBeInTheDocument();
    expect(container.querySelector('.ui-toast')).toHaveAttribute('data-tone', 'info');
    rerender(<Toast tone="warning">Couldn’t publish. Nothing changed.</Toast>);
    expect(container.querySelector('.ui-toast')).toHaveAttribute('data-tone', 'warning');
    rerender(<Toast>Published to harborbakery.com</Toast>);
    expect(container.querySelector('.ui-toast')).toHaveAttribute('data-tone', 'success');
  });
});

describe('ConfirmDialog', () => {
  it('asks, and lets them cancel or go ahead', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog title="Publish this change?" confirmLabel="Publish" onConfirm={onConfirm} onCancel={onCancel}>
        This goes live on harborbakery.com. You can undo it for 30 days.
      </ConfirmDialog>,
    );
    expect(screen.getByRole('alertdialog', { name: 'Publish this change?' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Publish' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('closes on Escape, and a risky one has a danger button', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog title="Disconnect Harbor Bakery?" confirmLabel="Disconnect" tone="danger" onConfirm={() => {}} onCancel={onCancel}>
        Your site stays exactly as it is.
      </ConfirmDialog>,
    );
    expect(screen.getByRole('button', { name: 'Disconnect' })).toHaveClass('p-btn-danger');
    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledOnce();
  });
});

describe('EmptyState', () => {
  it('shows a title, a line, and an optional action', async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();
    render(<EmptyState title="No sites yet" action={{ label: 'Add a site', onClick: onAction }}>Add your first site and Wursor will start watching it.</EmptyState>);
    expect(screen.getByRole('heading', { name: 'No sites yet' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add a site' }));
    expect(onAction).toHaveBeenCalledOnce();
  });
  it('has no button without an action', () => {
    render(<EmptyState title="No results">Try a different word.</EmptyState>);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('SystemScreen', () => {
  it('content only: names the limit and offers the change', async () => {
    const onAction = vi.fn();
    render(<SystemScreen kind="content-only" onAction={onAction} />);
    expect(screen.getByRole('heading', { name: 'This change needs Full access' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Change access' }));
    expect(onAction).toHaveBeenCalledOnce();
  });
  it('error: gives a reference to send us', () => {
    render(<SystemScreen kind="error" onAction={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Something went wrong on our side' })).toBeInTheDocument();
    expect(screen.getByText('Reference WUR-4F2K9 · 14:02 UTC')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
  it('limit: banner with upgrade, and a full meter', () => {
    render(<SystemScreen kind="limit" onAction={() => {}} />);
    expect(screen.getByText(/You’ve used all 40 changes in your plan this month/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upgrade plan' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Changes this month' })).toHaveAttribute('aria-valuenow', '100');
  });
  it('session: a dialog that keeps drafts safe', () => {
    render(<SystemScreen kind="session" onAction={() => {}} />);
    expect(screen.getByRole('alertdialog', { name: 'Your session expired' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Not now' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });
  it('maintenance and 404 stand alone', () => {
    const { unmount } = render(<SystemScreen kind="maintenance" onAction={() => {}} />);
    expect(screen.getByRole('heading', { name: 'Wursor is getting a tune-up' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check status' })).toBeInTheDocument();
    unmount();
    render(<SystemScreen kind="not-found" onAction={() => {}} />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'We can’t find that page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to Home' })).toBeInTheDocument();
  });
  it('unreachable: says nothing was lost, and shows three facts', () => {
    render(<SystemScreen kind="unreachable" onAction={() => {}} />);
    expect(screen.getByText('Wursor can’t reach harborbakery.com. Changes are paused and nothing was lost.')).toBeInTheDocument();
    expect(screen.getByText('Lost 14:02 · retrying every minute')).toBeInTheDocument();
    expect(screen.getByText('Last good check')).toBeInTheDocument();
    expect(screen.getAllByText('Full access')).toHaveLength(2);
  });
  it('loading is a busy region', () => {
    render(<SystemScreen kind="loading" onAction={() => {}} />);
    expect(screen.getByRole('status', { name: 'Loading' })).toHaveAttribute('aria-busy', 'true');
  });
});

describe('mobile navigation', () => {
  it('More lists the account, settings, help and sign out', () => {
    render(<MoreScreen />);
    const main = within(screen.getByRole('main'));
    expect(main.getByText('Amara Okoye')).toBeInTheDocument();
    for (const l of ['Settings', 'Team', 'Billing', 'Notifications', 'Safety and approvals', 'Help and docs', 'What is new', 'Contact support', 'Sign out']) {
      expect(main.getByRole('link', { name: l })).toBeInTheDocument();
    }
    expect(main.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings');
  });
  it('the switcher marks the current site and can add one', async () => {
    const onPick = vi.fn();
    const onClose = vi.fn();
    render(<SiteSwitcherSheet current="Harbor Bakery" onPick={onPick} onClose={onClose} />);
    expect(screen.getByRole('dialog', { name: 'Switch site' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Harbor Bakery/ })).toHaveAttribute('aria-current', 'true');
    await userEvent.click(screen.getByRole('button', { name: /Lumen Studio/ }));
    expect(onPick).toHaveBeenCalledWith('Lumen Studio');
    expect(screen.getByRole('link', { name: 'Add a site' })).toHaveAttribute('href', '/start');
  });
  it('notifications list four things with their times, and Escape closes', async () => {
    const onClose = vi.fn();
    render(<NotificationsSheet onClose={onClose} />);
    expect(screen.getByRole('dialog', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByText('Wursor has a question about opening hours')).toBeInTheDocument();
    expect(screen.getByText('12 min ago')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe('the phone top bar', () => {
  it('opens the site switcher, changes the site, and closes it', async () => {
    const user = userEvent.setup();
    render(<AppShell active="home">content</AppShell>);
    await user.click(screen.getByRole('button', { name: 'Switch site, now Harbor Bakery' }));
    await user.click(screen.getByRole('button', { name: /Lumen Studio/ }));
    expect(screen.queryByRole('dialog', { name: 'Switch site' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Switch site, now Lumen Studio' })).toBeInTheDocument();
  });
  it('opens the notifications', async () => {
    const user = userEvent.setup();
    render(<AppShell active="home">content</AppShell>);
    const bar = document.querySelector('.ws-mtop') as HTMLElement;
    await user.click(within(bar).getByRole('button', { name: 'Notifications' }));
    expect(screen.getByRole('dialog', { name: 'Notifications' })).toBeInTheDocument();
  });
});
