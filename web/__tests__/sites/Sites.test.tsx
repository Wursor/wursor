import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SiteDetail, type DetailHost, type DetailTab } from '../../src/sites/SiteDetail.tsx';
import { SitesScreen, type SitesVariant } from '../../src/sites/SitesScreen.tsx';
import { Toggle } from '../../src/sites/Toggle.tsx';
import { UsageMeter } from '../../src/sites/UsageMeter.tsx';

const list = (variant: SitesVariant) => {
  const onAdd = vi.fn();
  render(<SitesScreen variant={variant} onAddSite={onAdd} />);
  return { user: userEvent.setup(), onAdd };
};
const detail = (tab: DetailTab, host: DetailHost = 'wordpress') => {
  render(<SiteDetail tab={tab} host={host} />);
  return userEvent.setup();
};

describe('Toggle and UsageMeter', () => {
  it('is a switch that says what it does and can be flipped', async () => {
    const onChange = vi.fn();
    render(<Toggle label="Edit pages and posts" checked={false} onChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'Edit pages and posts' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('shows how much of an allowance is used', () => {
    render(<UsageMeter label="Changes" value="12 of 50" fill={0.82} />);
    expect(screen.getByText('Changes')).toBeInTheDocument();
    expect(screen.getByText('12 of 50')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Changes' })).toHaveAttribute('aria-valuenow', '82');
  });
});

describe('Sites (S1, S2, S5)', () => {
  it('lists the one site and invites a second', async () => {
    const { user, onAdd } = list('one');
    expect(screen.getByRole('heading', { name: 'Sites' })).toBeInTheDocument();
    expect(screen.getByText('The sites Wursor looks after.')).toBeInTheDocument();
    const rows = screen.getByRole('list', { name: 'Sites' });
    expect(within(rows).getAllByRole('listitem')).toHaveLength(1);
    expect(within(rows).getByText('Lives on your WordPress')).toBeInTheDocument();
    expect(screen.getByText('Looking after more than one site?')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Add a site' })[0]!);
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it('for an agency, summarises, filters and lists every site', async () => {
    const { user } = list('many');
    expect(screen.getByText('7 sites across 6 clients. 2 need attention.')).toBeInTheDocument();
    const stats = screen.getByRole('list', { name: 'At a glance' });
    expect(within(stats).getByText('Published this week')).toBeInTheDocument();
    const rows = screen.getByRole('list', { name: 'Sites' });
    expect(within(rows).getAllByRole('listitem')).toHaveLength(7);
    expect(within(rows).getByText('Disconnected 4 days ago')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Needs attention' }));
    expect(within(screen.getByRole('list', { name: 'Sites' })).getAllByRole('listitem')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Live' }));
    expect(within(screen.getByRole('list', { name: 'Sites' })).getAllByRole('listitem')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: 'All 7' }));
    expect(within(screen.getByRole('list', { name: 'Sites' })).getAllByRole('listitem')).toHaveLength(7);
  });

  it('narrows the list as you search', async () => {
    const { user } = list('many');
    await user.type(screen.getByRole('searchbox', { name: 'Search sites' }), 'kestrel');
    expect(within(screen.getByRole('list', { name: 'Sites' })).getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('Kestrel Coffee')).toBeInTheDocument();
  });

  it('explains an empty account and how to start', () => {
    list('empty');
    expect(screen.getByText('No sites yet')).toBeInTheDocument();
    expect(screen.getByText(/Start a site on Wursor Cloud, connect your WordPress/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'How it works' })).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Sites' })).not.toBeInTheDocument();
  });
});

describe('Site detail, overview (S3)', () => {
  it('has a breadcrumb, the site, its tabs, and what happened lately', () => {
    detail('overview');
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveTextContent('Sites');
    expect(screen.getByRole('heading', { name: 'Harbor Bakery' })).toBeInTheDocument();
    expect(screen.getByText('harborbakery.com · Connected 12 days ago · WordPress 6.8')).toBeInTheDocument();
    const tabs = screen.getByRole('tablist', { name: 'Site' });
    expect(within(tabs).getAllByRole('tab').map((t) => t.textContent)).toEqual(['Overview', 'Changes', 'Where it lives', 'Settings']);
    expect(within(tabs).getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('list', { name: 'Recent changes' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Safe copies' })).toBeInTheDocument();
    expect(screen.getByText('Before “Make phone number tappable”')).toBeInTheDocument();
    expect(screen.getByText('12 of 50')).toBeInTheDocument();
    expect(screen.getByText('9 of 30')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open workspace' })).toBeInTheDocument();
  });

  it('switches to where it lives', async () => {
    const user = detail('overview');
    await user.click(screen.getByRole('tab', { name: 'Where it lives' }));
    expect(screen.getByRole('tab', { name: 'Where it lives' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Connection')).toBeInTheDocument();
  });
});

describe('Site detail, where it lives (S4, S6, S7, S8)', () => {
  it('own WordPress: the connection, what Wursor may do, and disconnecting', async () => {
    const user = detail('where', 'wordpress');
    expect(screen.getByText('The Wursor helper on harborbakery.com is one version behind. Update it to keep checks accurate.')).toBeInTheDocument();
    expect(screen.getByText('Version 1.4.2. The latest is 1.5.0.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Pair again' }));
    const edit = screen.getByRole('switch', { name: 'Edit pages and posts' });
    expect(edit).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('switch', { name: 'Install or update plugins' })).toHaveAttribute('aria-checked', 'false');
    await user.click(screen.getByRole('switch', { name: 'Install or update plugins' }));
    expect(screen.getByRole('switch', { name: 'Install or update plugins' })).toHaveAttribute('aria-checked', 'true');
    const danger = screen.getByText('Disconnect this site').closest('section') as HTMLElement;
    expect(within(danger).getByText(/Wursor stops watching this site/)).toBeInTheDocument();
    expect(within(danger).getByRole('button', { name: 'Disconnect harborbakery.com' })).toBeInTheDocument();
  });

  it('Cloud: where it lives, looked after, moves out, and the address', () => {
    detail('where', 'cloud');
    expect(screen.getByText('Hosted on Wursor Cloud · harborbakery.com')).toBeInTheDocument();
    expect(screen.getByText('Hosted for you on WeOwn Cloud. Updates, backups and the certificate are handled.')).toBeInTheDocument();
    expect(screen.getByText('Backed up today at 3:02 am')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move to my own WordPress' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download everything' })).toBeInTheDocument();
    expect(screen.getByText('Moving out is free. Your site stays live until you confirm.')).toBeInTheDocument();
    expect(screen.getByText('Address and email')).toBeInTheDocument();
    expect(screen.getByText('Valid until 14 Jan · renews automatically')).toBeInTheDocument();
  });

  it('Content only: says what is allowed and offers more', () => {
    detail('where', 'content');
    expect(screen.getByText('Your WordPress · harborbakery.com · Content only')).toBeInTheDocument();
    expect(screen.getByText('Wursor can change pages, posts and images, but not your theme, plugins or settings. Your WordPress account didn’t grant more.')).toBeInTheDocument();
    expect(screen.getByText('Content only', { selector: '.app-badge span' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'What would change this' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Host on Wursor Cloud' })).toBeInTheDocument();
    expect(screen.getByText('Give Wursor full access')).toBeInTheDocument();
  });

  it('Cloud on a preview address: points to going live on a domain', () => {
    detail('where', 'preview');
    expect(screen.getByText('Hosted on Wursor Cloud · harbor-bakery.wursor.site')).toBeInTheDocument();
    expect(screen.getByText('This site is on a preview address. Connect your own domain to take it live.')).toBeInTheDocument();
    expect(screen.getByText('Go live on your domain')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    expect(screen.getByText('Point harborbakery.com at WeOwn Cloud')).toBeInTheDocument();
  });
});
