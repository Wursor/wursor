import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActivityScreen, type ActivityState } from '../../src/activity/ActivityScreen.tsx';

const show = (props: Partial<React.ComponentProps<typeof ActivityScreen>> = {}) => {
  const onAskForChange = vi.fn();
  render(<ActivityScreen state="feed" onAskForChange={onAskForChange} {...props} />);
  return { user: userEvent.setup(), onAskForChange };
};
const feedRows = () => within(screen.getByRole('main')).getAllByRole('listitem');

describe('Activity feed (AC1)', () => {
  it('lists what Wursor did, newest first, under the day it happened', () => {
    show();
    expect(screen.getByRole('heading', { name: 'Activity', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Everything Wursor did on Harbor Bakery, with proof.')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Today', 'Yesterday', 'Monday 5 Oct']);
    expect(feedRows()).toHaveLength(10);
    expect(screen.getByText('Published “Make phone number tappable”')).toBeInTheDocument();
    expect(screen.getByText('Undid “Add menu PDF”, restored the safe copy from 4:02 PM')).toBeInTheDocument();
    expect(screen.getByText('Moved Harbor Bakery to Wursor Cloud')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load earlier activity' })).toBeInTheDocument();
  });

  it('keeps Activity as the current place in the sidebar', () => {
    show();
    expect(within(screen.getByRole('navigation', { name: 'Workspace' })).getByRole('link', { name: 'Activity' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('filtering and searching (AC2, AC6)', () => {
  it('narrows to one kind of thing, including routine checks the full feed leaves out', async () => {
    const { user } = show();
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Checks' }));
    expect(screen.getByRole('button', { name: 'Checks' })).toHaveAttribute('aria-pressed', 'true');
    expect(feedRows()).toHaveLength(4);
    expect(screen.getByText('Checked “Update opening hours” plan. 2 things to confirm.')).toBeInTheDocument();
    expect(screen.getByText('Watching for errors. All clear.')).toBeInTheDocument();
    expect(screen.queryByText('Moved Harbor Bakery to Wursor Cloud')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Monday 5 Oct' })).not.toBeInTheDocument();
  });

  it('searches the words on each line', async () => {
    const { user } = show();
    await user.type(screen.getByRole('searchbox', { name: 'Search activity' }), 'saturday');
    expect(feedRows()).toHaveLength(1);
    expect(screen.getByText('Published “Update Saturday hours”')).toBeInTheDocument();
  });

  it('says so when nothing matches, and clears the search', async () => {
    const { user } = show();
    await user.type(screen.getByRole('searchbox', { name: 'Search activity' }), 'invoice');
    expect(screen.getByText('Nothing matches “invoice”')).toBeInTheDocument();
    expect(screen.getByText('Try another word, a different filter, or a longer time range.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(feedRows()).toHaveLength(10);
  });

  it('offers three time ranges', () => {
    show();
    const range = screen.getByRole('combobox', { name: 'Time range' });
    expect(range).toHaveValue('Last 30 days');
  });
});

describe('proof for one event (AC5)', () => {
  it('opens who asked, who approved, what was checked and the evidence', async () => {
    const { user } = show();
    await user.click(screen.getByRole('button', { name: /Published “Make phone number tappable”/ }));
    const drawer = screen.getByRole('complementary', { name: 'Proof' });
    expect(within(drawer).getByRole('heading', { name: 'Published “Make phone number tappable”' })).toBeInTheDocument();
    expect(within(drawer).getByText('Live')).toBeInTheDocument();
    expect(within(drawer).getByText('Contact page and footer · 9:41 AM today · Everyday risk')).toBeInTheDocument();
    expect(within(drawer).getByText('Amara Okoye · 9:12')).toBeInTheDocument();
    expect(within(drawer).getByText('Links still work')).toBeInTheDocument();
    expect(within(drawer).getAllByText('Pass')).toHaveLength(3);
    expect(within(drawer).getByText('Safe copy a91f…c3e2 · Plan 7b20…19d4')).toBeInTheDocument();
    expect(within(drawer).getByRole('button', { name: 'Undo this change' })).toBeInTheDocument();
    expect(within(drawer).getByRole('button', { name: 'Open proof' })).toBeInTheDocument();
    await user.click(within(drawer).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('complementary', { name: 'Proof' })).not.toBeInTheDocument();
  });
});

describe('the other states (AC3, AC4, AC7, AC8, AC9)', () => {
  it.each<[ActivityState]>([['loading']])('shows a quiet placeholder while it loads', () => {
    show({ state: 'loading' });
    expect(screen.getByRole('status', { name: 'Loading activity' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Today' })).toBeInTheDocument();
  });

  it('explains an empty history and offers a first change', async () => {
    const { user, onAskForChange } = show({ state: 'empty' });
    expect(screen.getByText('No activity yet')).toBeInTheDocument();
    expect(screen.getByText('Everything Wursor does on this site shows up here: changes, checks, safe copies and approvals. Ask for your first change to start.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'All' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ask for a change' }));
    expect(onAskForChange).toHaveBeenCalledOnce();
  });

  it('says plainly when it could not load, and that nothing was lost', () => {
    show({ state: 'error' });
    expect(screen.getByRole('alert')).toHaveTextContent('We could not load your activity. Your site is not affected. Check your connection and try again.');
    expect(screen.getByText('Activity did not load')).toBeInTheDocument();
    expect(screen.getByText('Nothing was lost. Everything Wursor did is still recorded.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('when offline, shows what was saved and says what cannot be done', () => {
    show({ state: 'offline' });
    expect(screen.getByText('You are offline. Showing what was saved at 9:41 AM. You cannot approve or publish until you are back online.')).toBeInTheDocument();
    expect(feedRows().length).toBeGreaterThan(0);
  });

  it('for an agency, names the site on each line', () => {
    show({ scope: 'all' });
    expect(screen.getByText('Everything Wursor did across your 7 sites, with proof.')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Site' })).toHaveValue('All 7 sites');
    expect(screen.queryByRole('combobox', { name: 'Time range' })).not.toBeInTheDocument();
    expect(screen.getByText('Northline Studio · Published “Make phone number tappable”')).toBeInTheDocument();
    expect(screen.getByText('Greenfield Florist · Amara approved “Make phone number tappable”')).toBeInTheDocument();
  });
});
