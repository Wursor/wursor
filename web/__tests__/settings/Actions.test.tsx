import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FeedbackProvider } from '../../src/system/Feedback.tsx';
import { SettingsScreen, type SettingsSection } from '../../src/settings/SettingsScreen.tsx';

const open = (section: SettingsSection) => {
  render(
    <FeedbackProvider>
      <SettingsScreen section={section} />
    </FeedbackProvider>,
  );
  return userEvent.setup();
};

describe('Settings actions answer when pressed', () => {
  it('asks before deleting the workspace, and does nothing if they back out', async () => {
    const user = open('workspace');
    await user.click(screen.getByRole('button', { name: 'Delete workspace' }));
    const dialog = screen.getByRole('alertdialog');
    expect(within(dialog).getByText(/Delete this workspace\?/)).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('asks before deleting the account', async () => {
    const user = open('account');
    await user.click(screen.getByRole('button', { name: 'Delete account' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('invites a teammate: form opens, invite lands in the list with a toast', async () => {
    const user = open('team');
    await user.click(screen.getByRole('button', { name: 'Invite' }));
    await user.type(screen.getByLabelText('Email to invite'), 'sam@harborbakery.com');
    await user.click(screen.getByRole('button', { name: 'Send invite' }));
    expect(screen.getByText('sam@harborbakery.com')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Invite sent to sam@harborbakery.com');
  });

  it('will not send an invite without a plausible email', async () => {
    const user = open('team');
    await user.click(screen.getByRole('button', { name: 'Invite' }));
    await user.type(screen.getByLabelText('Email to invite'), 'nope');
    await user.click(screen.getByRole('button', { name: 'Send invite' }));
    expect(screen.getByText('Enter a full email address, like name@company.com.')).toBeInTheDocument();
  });

  it('removes a teammate only after confirming', async () => {
    const user = open('team');
    await user.click(screen.getByRole('button', { name: 'More for Chidi Eze' }));
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(screen.getByText('chidi@harborbakery.com')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove Chidi' }));
    expect(screen.queryByText('chidi@harborbakery.com')).not.toBeInTheDocument();
  });

  it('switching plan asks first, then moves the "Current plan" marker', async () => {
    const user = open('billing');
    await user.click(within(screen.getByRole('region', { name: 'Agency plan' })).getByRole('button', { name: 'Choose plan' }));
    await user.click(screen.getByRole('button', { name: 'Switch to Agency' }));
    expect(within(screen.getByRole('region', { name: 'Agency plan' })).getByText('Current plan')).toBeInTheDocument();
  });

  it('billing buttons say what happened', async () => {
    const user = open('billing');
    await user.click(screen.getAllByRole('button', { name: 'Download' })[0]!);
    expect(screen.getByRole('status')).toHaveTextContent(/invoice/i);
  });
});
