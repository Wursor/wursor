import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApprovalBar } from '../../src/product/ApprovalBar.tsx';
import { BoardCard } from '../../src/product/BoardCard.tsx';
import { BoardStrip } from '../../src/product/BoardStrip.tsx';
import { CompareSlider } from '../../src/product/CompareSlider.tsx';
import { DeviceFrame } from '../../src/product/DeviceFrame.tsx';
import { PreviewToolbar } from '../../src/product/PreviewToolbar.tsx';
import { Sidebar } from '../../src/product/Sidebar.tsx';
import { SiteMock } from '../../src/product/SiteMock.tsx';
import { TopBar } from '../../src/product/TopBar.tsx';
import { Workspace } from '../../src/product/Workspace.tsx';
import { HARBOR } from '../../src/product/harbor-bakery.ts';

describe('TopBar', () => {
  it('shows the site, the current change and its status', () => {
    render(<TopBar site="Harbor Bakery" siteInitial="H" change="Make phone number tappable" status="working" autonomy="Ask first" account={{ initials: 'AO', name: 'Amara Okoye' }} />);
    expect(screen.getByRole('button', { name: /Harbor Bakery/ })).toBeInTheDocument();
    expect(screen.getByText('Make phone number tappable')).toBeInTheDocument();
    expect(screen.getByText('Working')).toBeInTheDocument();
    for (const name of ['Toggle sidebar', 'Search', 'Notifications']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
  });
});

describe('Sidebar', () => {
  const changes = [
    { title: 'Make phone number tappable', status: 'working' as const, active: true },
    { title: 'Update opening hours', status: 'needs-you' as const },
    { title: 'Describe 3 images', status: 'idea' as const },
    { title: 'Refresh footer links', status: 'done' as const },
  ];

  it('has the four places and the list of changes', () => {
    render(<Sidebar changes={changes} account={{ initials: 'AO', name: 'Amara Okoye', role: 'Owner' }} />);
    const nav = screen.getByRole('navigation', { name: 'Workspace' });
    expect(within(nav).getAllByRole('link').map((a) => a.textContent)).toEqual(['Home', 'Board', 'Activity', 'Sites']);
    expect(screen.getByRole('list', { name: 'Changes' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  it('marks the open change', () => {
    render(<Sidebar changes={changes} account={{ initials: 'AO', name: 'Amara Okoye', role: 'Owner' }} />);
    expect(screen.getByText('Make phone number tappable').closest('[aria-current]')).toHaveAttribute('aria-current', 'true');
  });

  it('shows the account', () => {
    render(<Sidebar changes={changes} account={{ initials: 'AO', name: 'Amara Okoye', role: 'Owner' }} />);
    expect(screen.getByText('Amara Okoye')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
  });
});

describe('PreviewToolbar', () => {
  it('has Preview, Compare and Proof tabs with the draft tag and device buttons', () => {
    render(<PreviewToolbar selected="preview" tag="Draft copy" />);
    expect(screen.getByRole('tablist', { name: 'View' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Compare' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Proof' })).toBeInTheDocument();
    expect(screen.getByText('Draft copy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desktop' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Phone' })).toBeInTheDocument();
  });
});

describe('SiteMock and DeviceFrame', () => {
  it('shows the Harbor Bakery contact page', () => {
    render(<SiteMock state="after" />);
    expect(screen.getByText('Find us on Quay Street')).toBeInTheDocument();
    expect(screen.getByText('Fresh bread from 6:30, every morning.')).toBeInTheDocument();
  });

  it('before the change the number is plain text, after it is a tap-to-call link', () => {
    const { rerender } = render(<SiteMock state="before" />);
    expect(screen.queryByRole('link', { name: /Call \(555\) 014-2290/ })).not.toBeInTheDocument();
    rerender(<SiteMock state="after" />);
    expect(screen.getByRole('link', { name: /Call \(555\) 014-2290/ })).toHaveAttribute('href', 'tel:+55550142290');
  });

  it('frames the page in a browser bar with its address', () => {
    render(<DeviceFrame url="harborbakery.com/contact"><SiteMock state="after" /></DeviceFrame>);
    expect(screen.getByText('harborbakery.com/contact')).toBeInTheDocument();
  });
});

describe('BoardCard and BoardStrip', () => {
  it('asks for the owner when a change needs them', () => {
    render(<BoardCard status="needs-you" title="Update opening hours" meta="Home page · 1 hour ago" />);
    expect(screen.getByText('Wursor is waiting for your answer')).toBeInTheDocument();
    expect(screen.getByText('Needs you')).toBeInTheDocument();
  });

  it('shows risk and progress on a working change', () => {
    render(<BoardCard status="working" title="Make phone number tappable" meta="Contact page · 1 min ago" risk="everyday" progress={0.62} />);
    expect(screen.getByText('Everyday')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Make phone number tappable' })).toHaveAttribute('aria-valuenow', '62');
  });

  it('groups cards into the four lanes with counts', () => {
    render(<BoardStrip lanes={HARBOR.board} />);
    for (const lane of ['Needs you', 'Working', 'Idea', 'Done']) {
      expect(screen.getByRole('group', { name: lane })).toBeInTheDocument();
    }
    expect(screen.getByText('Open board')).toBeInTheDocument();
  });
});

describe('CompareSlider', () => {
  it('is a slider the keyboard can move, labelled in plain words', async () => {
    render(<CompareSlider before={<span>old</span>} after={<span>new</span>} defaultPosition={50} />);
    const slider = screen.getByRole('slider', { name: 'Compare before and after' });
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '55');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(slider).toHaveAttribute('aria-valuenow', '45');
  });

  it('labels both sides', () => {
    render(<CompareSlider before={<span>old</span>} after={<span>new</span>} />);
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });
});

describe('ApprovalBar', () => {
  it('says what is ready and offers one clear action', async () => {
    const onApprove = vi.fn();
    render(<ApprovalBar title="Ready for you" meta="2 changes · Everyday risk" onApprove={onApprove} />);
    expect(screen.getByText('Ready for you')).toBeInTheDocument();
    expect(screen.getByText('2 changes · Everyday risk')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Approve and publish' }));
    expect(onApprove).toHaveBeenCalledOnce();
  });
});

describe('Workspace', () => {
  it('assembles the top bar, sidebar, conversation, preview and board', () => {
    render(<Workspace defaultDensity="steps" />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Conversation' })).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: 'View' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Board' })).toBeInTheDocument();
  });

  it('changes what it shows when the owner picks another detail level', async () => {
    render(<Workspace defaultDensity="steps" />);
    expect(screen.queryByText('Looked at home page')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: 'Everything' }));
    expect(screen.getByText('Looked at home page')).toBeInTheDocument();
  });

  it('shows less at the headline level and more at everything', () => {
    const { unmount } = render(<Workspace defaultDensity="headline" />);
    expect(screen.getByRole('separator', { name: 'Plan ready' })).toBeInTheDocument();
    expect(screen.queryByText('Looked at home page')).not.toBeInTheDocument();
    unmount();
    render(<Workspace defaultDensity="everything" />);
    expect(screen.getByText('Looked at home page')).toBeInTheDocument();
  });
});
