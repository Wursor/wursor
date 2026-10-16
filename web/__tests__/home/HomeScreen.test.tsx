import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HomeScreen, type HomeVariant } from '../../src/home/HomeScreen.tsx';

const handlers = () => ({ onContinue: vi.fn(), onNewChange: vi.fn(), onAnswer: vi.fn(), onLook: vi.fn(), onFix: vi.fn(), onSeeAll: vi.fn(), onOpenActivity: vi.fn() });
const show = (variant: HomeVariant, host: 'wordpress' | 'cloud' = 'wordpress', part: 'morning' | 'afternoon' = 'morning') => {
  const h = handlers();
  render(<HomeScreen variant={variant} host={host} part={part} {...h} />);
  return { user: userEvent.setup(), ...h };
};

describe('Home, first run (H1, H5)', () => {
  it('welcomes by name and shows the guided setup with one next step', async () => {
    const { user, onContinue } = show('first-run');
    expect(screen.getByRole('heading', { name: 'Welcome, Amara' })).toBeInTheDocument();
    expect(screen.getByText('Harbor Bakery is connected. Let’s make your first change together.')).toBeInTheDocument();
    expect(screen.getByText('Guided setup')).toBeInTheDocument();
    expect(screen.getByText('3 of 5 done')).toBeInTheDocument();
    const steps = screen.getByRole('list', { name: 'Setup steps' });
    expect(within(steps).getAllByRole('listitem')).toHaveLength(5);
    expect(within(steps).getByText('harborbakery.com is paired and watching.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onContinue).toHaveBeenCalledOnce();
    expect(within(screen.getByRole('main')).queryByRole('button', { name: 'New change' })).not.toBeInTheDocument();
    expect(screen.getByText('Wursor is watching for errors. Nothing has changed yet.')).toBeInTheDocument();
    expect(screen.getByText('Watching')).toBeInTheDocument();
  });

  it('says a Cloud site is still on its preview address', () => {
    show('first-run', 'cloud');
    expect(screen.getByText('Wursor is building Harbor Bakery. We will show you each step.')).toBeInTheDocument();
    expect(screen.getByText('Go live on your web address')).toBeInTheDocument();
    expect(screen.getByText('harbor-bakery.wursor.site')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Hosted on Wursor Cloud. Not live on your web address yet.')).toBeInTheDocument();
  });

  it('offers things to try asking', () => {
    show('first-run');
    const card = screen.getByRole('region', { name: 'Try asking' });
    expect(within(card).getAllByRole('listitem')).toHaveLength(3);
    expect(within(card).getByText('Add Sunday hours to the footer')).toBeInTheDocument();
  });
});

describe('Home, active (H2)', () => {
  it('greets, summarises in four tiles, and lists what needs the owner', async () => {
    const { user, onAnswer, onLook, onNewChange } = show('active');
    expect(screen.getByRole('heading', { name: 'Good morning, Amara' })).toBeInTheDocument();
    expect(screen.getByText('Harbor Bakery is live. Wursor has one question and one change ready for you.')).toBeInTheDocument();
    const stats = screen.getByRole('list', { name: 'At a glance' });
    expect(within(stats).getByText('Waiting for you')).toBeInTheDocument();
    expect(within(stats).getByText('1 question · 1 to approve')).toBeInTheDocument();
    expect(within(stats).getByText('2 h ago')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Needs you' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Answer' }));
    await user.click(screen.getByRole('button', { name: 'Look' }));
    await user.click(within(screen.getByRole('main')).getByRole('button', { name: 'New change' }));
    expect(onAnswer).toHaveBeenCalledOnce();
    expect(onLook).toHaveBeenCalledOnce();
    expect(onNewChange).toHaveBeenCalledOnce();
    expect(screen.getByText('Which opening hours should Wursor use?')).toBeInTheDocument();
    expect(screen.getByText('Make phone number tappable is ready')).toBeInTheDocument();
  });

  it('keeps a short log of what just happened, with a way into all of it', async () => {
    const { user, onOpenActivity, onSeeAll } = show('active');
    const log = screen.getByRole('list', { name: 'Recent activity' });
    expect(within(log).getAllByRole('listitem')).toHaveLength(5);
    expect(within(log).getByText('Published “Make phone number tappable”')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open activity' }));
    await user.click(screen.getByRole('button', { name: 'See all' }));
    expect(onOpenActivity).toHaveBeenCalledOnce();
    expect(onSeeAll).toHaveBeenCalledOnce();
  });

  it('shows the live site with a way to open it', () => {
    show('active');
    const card = screen.getByRole('region', { name: 'Your site' });
    const name = card.querySelector('.app-sitecard-name') as HTMLElement;
    expect(within(name).getByText('Harbor Bakery')).toBeInTheDocument();
    expect(within(name).getByText('harborbakery.com')).toBeInTheDocument();
    expect(within(card).getByText('Live')).toBeInTheDocument();
    expect(within(card).getByText('Published 9:41 AM · Wursor is watching for errors.')).toBeInTheDocument();
    expect(within(card).getByRole('link', { name: 'Open site' })).toHaveAttribute('href', 'https://harborbakery.com');
  });
});

describe('Home, all caught up (H3)', () => {
  it('says so, and nothing is waiting', async () => {
    const { user, onNewChange } = show('caught-up', 'wordpress', 'afternoon');
    expect(screen.getByText('Everything is up to date. Nothing needs you right now.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Good afternoon, Amara' })).toBeInTheDocument();
    expect(screen.getByText('Harbor Bakery is live and Wursor is watching it.')).toBeInTheDocument();
    expect(screen.getByText('You’re all caught up')).toBeInTheDocument();
    expect(screen.getByText('When Wursor has a question or a change to approve, it will appear here and in your notifications.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ask Wursor for a change' }));
    expect(onNewChange).toHaveBeenCalledOnce();
    expect(screen.getByText('Nothing to review')).toBeInTheDocument();
  });
});

describe('Home, site problem (H4, H6)', () => {
  it('leads with the problem, what Wursor checked, and what the owner can do', async () => {
    const { user, onFix } = show('problem', 'wordpress', 'afternoon');
    expect(screen.getByRole('alert')).toHaveTextContent('harborbakery.com isn’t responding. Wursor paused publishing and is checking every minute.');
    expect(screen.getByText('Your site needs attention before anything else goes live.')).toBeInTheDocument();
    expect(screen.getByText('Down')).toBeInTheDocument();
    expect(screen.getByText('Since 2:14 PM')).toBeInTheDocument();
    expect(screen.getByText('Your site stopped responding at 2:14 PM')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Fix' }));
    expect(onFix).toHaveBeenCalledOnce();
    const checks = screen.getByRole('list', { name: 'What Wursor has checked' });
    expect(within(checks).getByText('Safe copy from 2:01 PM is ready to restore')).toBeInTheDocument();
    expect(within(checks).getByText('Failing')).toBeInTheDocument();
    expect(screen.getByText('Stopped')).toBeInTheDocument();
    expect(screen.getByText('Last seen working at 2:13 PM.')).toBeInTheDocument();
    const options = screen.getByRole('region', { name: 'What you can do' });
    expect(within(options).getByRole('button', { name: 'Undo today’s change' })).toBeInTheDocument();
    expect(within(options).getByRole('button', { name: 'Restore the safe copy' })).toBeInTheDocument();
    expect(within(options).getByRole('button', { name: 'Contact your host' })).toBeInTheDocument();
  });

  it('on Cloud, says Wursor is looking at the hosting side and offers support', () => {
    show('problem', 'cloud', 'afternoon');
    expect(screen.getByRole('alert')).toHaveTextContent('harborbakery.com isn’t responding. Wursor is checking it on WeOwn Cloud and paused publishing.');
    expect(screen.getByText('Wursor can undo today’s change, or keep waiting. Wursor is already looking at the hosting side.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact Wursor support' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Contact your host' })).not.toBeInTheDocument();
  });
});

describe('the app shell around Home', () => {
  it('marks Home as the current place in the sidebar and lists the changes', () => {
    show('active');
    const nav = screen.getByRole('navigation', { name: 'Workspace' });
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('list', { name: 'Changes' })).toBeInTheDocument();
  });

  it('shows no changes list on the first run', () => {
    show('first-run');
    expect(screen.queryByRole('list', { name: 'Changes' })).not.toBeInTheDocument();
  });

  it('has the five tabs a phone needs', () => {
    show('active');
    const tabs = screen.getByRole('navigation', { name: 'Main' });
    expect(within(tabs).getAllByRole('link').map((a) => a.textContent)).toEqual(['Home', 'Board', 'Activity', 'Sites', 'More']);
    expect(within(tabs).getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });
});
