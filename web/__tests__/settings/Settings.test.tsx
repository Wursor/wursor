import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RiskChip } from '../../src/product/RiskChip.tsx';
import { SettingsScreen, type SettingsSection } from '../../src/settings/SettingsScreen.tsx';

const open = (section: SettingsSection) => {
  render(<SettingsScreen section={section} />);
  return userEvent.setup();
};

describe('RiskChip levels', () => {
  it('names each level of risk in plain words', () => {
    const { rerender } = render(<RiskChip level="noticeable" />);
    expect(screen.getByText('Noticeable')).toBeInTheDocument();
    rerender(<RiskChip level="sensitive" />);
    expect(screen.getByText('Sensitive')).toBeInTheDocument();
    rerender(<RiskChip level="careful" />);
    expect(screen.getByText('Careful')).toBeInTheDocument();
  });
});

describe('Settings frame', () => {
  it('has a title, a nav of six places with the current one marked', () => {
    open('safety');
    expect(screen.getByRole('heading', { name: 'Settings', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Everything about how Wursor works for you and Harbor Bakery.')).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Settings' });
    expect(within(nav).getAllByRole('link').map((a) => a.textContent)).toEqual(['Workspace', 'Safety and approvals', 'Team', 'Billing', 'Notifications', 'Account']);
    expect(within(nav).getByRole('link', { name: 'Safety and approvals' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Team' })).toHaveAttribute('href', '/settings/team');
  });

  it('marks Sites, Home and the rest of the sidebar as not current', () => {
    open('workspace');
    const side = screen.getByRole('navigation', { name: 'Workspace' });
    expect(within(side).queryByRole('link', { current: 'page' })).not.toBeInTheDocument();
  });
});

describe('Workspace (T1)', () => {
  it('shows the name, the role, time zone and language, and a way to delete', async () => {
    const user = open('workspace');
    expect(screen.getByRole('textbox', { name: 'Workspace name' })).toHaveValue('Harbor Bakery');
    expect(screen.getByText('Shown to teammates and on safe copies.')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'I use Wursor as' })).toHaveValue('Owner');
    expect(screen.getByRole('combobox', { name: 'Time zone' })).toHaveValue('Central Time (Austin)');
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('English');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Language' }), 'Español');
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('Español');
    const danger = screen.getByText('Delete this workspace').closest('section') as HTMLElement;
    expect(within(danger).getByRole('button', { name: 'Delete workspace' })).toBeInTheDocument();
  });
});

describe('Safety and approvals (T2)', () => {
  it('says when Wursor can act, what it always asks first, and how it rates a change', async () => {
    const user = open('safety');
    expect(screen.getByText('You are always in charge of what goes live.')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Default mode' })).toHaveValue('Ask first');
    expect(screen.getAllByText('Always on')).toHaveLength(4);
    const plugins = screen.getByRole('switch', { name: 'Updating plugins or themes' });
    expect(plugins).toHaveAttribute('aria-checked', 'true');
    await user.click(plugins);
    expect(plugins).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('combobox', { name: 'Keep safe copies for' })).toHaveValue('30 days');
    const ratings = screen.getByRole('list', { name: 'Risk levels' });
    expect(within(ratings).getAllByRole('listitem')).toHaveLength(4);
    expect(within(ratings).getByText('Wording, images and small layout tweaks.')).toBeInTheDocument();
  });
});

describe('Team (T3)', () => {
  it('lists teammates with their role and who is still invited', () => {
    open('team');
    expect(screen.getByRole('heading', { name: 'Teammates' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Invite' })).toBeInTheDocument();
    const people = screen.getByRole('list', { name: 'Teammates' });
    expect(within(people).getAllByRole('listitem')).toHaveLength(3);
    expect(within(people).getByText('chidi@harborbakery.com')).toBeInTheDocument();
    expect(within(people).getByText('Invited')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Let an approver publish when I’m away' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('combobox', { name: 'Changes that need two people' })).toHaveValue('Off');
    const roles = screen.getByRole('list', { name: 'Roles' });
    expect(within(roles).getAllByRole('listitem')).toHaveLength(4);
    expect(within(roles).getByText('Reviews and publishes changes.')).toBeInTheDocument();
  });
});

describe('Billing (T4)', () => {
  it('compares three plans, marks the current one, and shows this month’s use and the invoices', () => {
    open('billing');
    for (const [name, price] of [['Starter', '$19'], ['Studio', '$49'], ['Agency', '$149']]) {
      const card = screen.getByRole('region', { name: `${name} plan` });
      expect(within(card).getByText(price!)).toBeInTheDocument();
      expect(within(card).getAllByRole('listitem')).toHaveLength(4);
    }
    expect(within(screen.getByRole('region', { name: 'Studio plan' })).getByText('Current plan')).toBeInTheDocument();
    expect(within(screen.getByRole('region', { name: 'Starter plan' })).getByRole('button', { name: 'Choose plan' })).toBeInTheDocument();
    expect(screen.getByText('This month on Studio')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Cloud hosting' })).toBeInTheDocument();
    expect(screen.getByText('4 of 20 GB')).toBeInTheDocument();
    expect(screen.getByText('Visa ending 4242.')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Download' })).toHaveLength(2);
  });
});

describe('Notifications (T5)', () => {
  it('lets each kind of message be turned on or off, and sets quiet hours', async () => {
    const user = open('notifications');
    expect(screen.getByRole('switch', { name: 'A change is published' })).toHaveAttribute('aria-checked', 'false');
    await user.click(screen.getByRole('switch', { name: 'A change is published' }));
    expect(screen.getByRole('switch', { name: 'A change is published' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('heading', { name: 'Phone and desktop' })).toBeInTheDocument();
    expect(screen.getByText('Nothing is pushed to your phone during quiet hours, except if your site goes down.')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Quiet hours' })).toHaveValue('8 pm to 7 am');
  });
});

describe('Account (T6)', () => {
  it('shows who you are, how you sign in, and how the app looks', () => {
    open('account');
    expect(screen.getByRole('textbox', { name: 'Your name' })).toHaveValue('Amara Okoye');
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue('amara@harborbakery.com');
    expect(screen.getByText('To change your email, we’ll send a code to both addresses.')).toBeInTheDocument();
    expect(screen.getByText('Signed in with amara@harborbakery.com.')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Two-step sign-in' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('combobox', { name: 'Theme' })).toHaveValue('System');
    expect(screen.getByRole('button', { name: 'Delete account' })).toBeInTheDocument();
  });
});
