import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WorkspaceApp } from '../../src/workspace/WorkspaceApp.tsx';

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());
const tick = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
const setup = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
const topStatus = () => within(document.querySelector('.p-topbar') as HTMLElement);

describe('the life of a change', () => {
  it('opens on a plan that waits for the owner to press Start', () => {
    render(<WorkspaceApp />);
    expect(topStatus().getByText('Plan ready')).toBeInTheDocument();
    expect(screen.getByText('The plan')).toBeInTheDocument();
    expect(screen.getByRole('separator', { name: 'Plan ready' })).toBeInTheDocument();
  });

  it('starts work, asks a question it cannot answer alone, and carries on once answered', async () => {
    const user = setup();
    render(<WorkspaceApp autoplay workMs={100} />);
    await user.click(screen.getByRole('button', { name: 'Start' }));
    expect(topStatus().getByText('Working')).toBeInTheDocument();
    tick(100);
    expect(topStatus().getByText('Needs you')).toBeInTheDocument();
    expect(screen.getByText('Wursor needs a decision')).toBeInTheDocument();
    expect(screen.getByText('Your header and footer both show the phone number. Change both?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Change both' }));
    expect(topStatus().getByText('Working')).toBeInTheDocument();
    tick(100);
    expect(topStatus().getByText('Ready for you')).toBeInTheDocument();
  });

  it('shows the comparison, what changed, and the approval bar when it is ready', () => {
    render(<WorkspaceApp initialPhase="ready" />);
    expect(screen.getByRole('slider', { name: 'Compare before and after' })).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'What changed' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Approve and publish' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ask for changes' })).toBeInTheDocument();
    expect(screen.getByText('Checked 9 things. All passed.', { selector: '.p-check-title' })).toBeInTheDocument();
  });

  it('publishes on approval, then confirms it is live with Undo one click away', async () => {
    const user = setup();
    render(<WorkspaceApp initialPhase="ready" autoplay publishMs={100} />);
    await user.click(screen.getByRole('button', { name: 'Approve and publish' }));
    expect(topStatus().getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Publishing to harborbakery.com…')).toBeInTheDocument();
    tick(100);
    expect(topStatus().getByText('Live')).toBeInTheDocument();
    expect(screen.getByText('Live on harborbakery.com')).toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: 'What changed' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(topStatus().getByText('Ready for you')).toBeInTheDocument();
  });

  it('closes the What changed drawer', async () => {
    const user = setup();
    render(<WorkspaceApp initialPhase="ready" />);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('complementary', { name: 'What changed' })).not.toBeInTheDocument();
  });

  it('opens the proof on the Proof tab', async () => {
    const user = setup();
    render(<WorkspaceApp initialPhase="ready" />);
    await user.click(screen.getByRole('tab', { name: 'Proof' }));
    expect(screen.getByRole('heading', { name: 'Proof from Wursor’s own checks' })).toBeInTheDocument();
    expect(screen.getByText('Looked at the footer on small phones')).toBeInTheDocument();
    expect(screen.queryByRole('complementary', { name: 'What changed' })).not.toBeInTheDocument();
  });
});

describe('what is around the conversation', () => {
  it('shows the sidebar with every change while planning and working, and the board under the preview', () => {
    render(<WorkspaceApp />);
    expect(screen.getByRole('list', { name: 'Changes' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Board' })).toBeInTheDocument();
    expect(document.querySelector('.ws')).toHaveAttribute('data-board', 'true');
  });

  it('keeps only the icon rail once there is something to review, and drops the board', () => {
    render(<WorkspaceApp initialPhase="ready" />);
    expect(screen.queryByRole('list', { name: 'Changes' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'New change' })).toBeInTheDocument();
    expect(document.querySelector('.ws')).toHaveAttribute('data-board', 'false');
  });

  it('moves the change itself to Needs you on the board while a question is open', () => {
    render(<WorkspaceApp initialPhase="needs-you" />);
    const lane = screen.getByRole('group', { name: 'Needs you' });
    expect(within(lane).getByText('Make phone number tappable')).toBeInTheDocument();
    expect(within(lane).getByText('Footer · Waiting for you')).toBeInTheDocument();
  });

  it('trims the conversation to headlines on request', async () => {
    const user = setup();
    render(<WorkspaceApp initialPhase="needs-you" />);
    expect(screen.getByText('Made the Contact page number a tap-to-call link')).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Headline' }));
    expect(screen.queryByText('Made the Contact page number a tap-to-call link')).not.toBeInTheDocument();
    expect(screen.getByRole('separator', { name: 'Needs you' })).toBeInTheDocument();
  });

  it('lets the owner collapse and expand the sidebar', async () => {
    const user = setup();
    render(<WorkspaceApp />);
    await user.click(screen.getByRole('button', { name: 'Toggle sidebar' }));
    expect(screen.queryByRole('list', { name: 'Changes' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Toggle sidebar' }));
    expect(screen.getByRole('list', { name: 'Changes' })).toBeInTheDocument();
  });
});

describe('building a whole new site (section C)', () => {
  it('shows what was built, the checks, and the approval for publishing to the owner’s WordPress', () => {
    const onApprove = vi.fn();
    render(<WorkspaceApp variant="site" initialPhase="ready" initialView="preview" onApprove={onApprove} />);
    expect(topStatus().getByText('Build your site')).toBeInTheDocument();
    expect(topStatus().getByText('Ready for you')).toBeInTheDocument();
    expect(screen.getByText('Planned 4 pages')).toBeInTheDocument();
    expect(screen.getByText('Checked 12 things. All passed.', { selector: '.p-check-title' })).toBeInTheDocument();
    expect(screen.getByText('Your site is ready. Have a look around, then approve to publish it to your WordPress.')).toBeInTheDocument();
    const drawer = screen.getByRole('complementary', { name: 'What was built' });
    expect(within(drawer).getByText('4 pages')).toBeInTheDocument();
    expect(within(drawer).getByText('Your WordPress is not changed until you approve. A backup is taken first.')).toBeInTheDocument();
    expect(screen.getByText('4 pages · Publishes to harborbakery.com')).toBeInTheDocument();
  });

  it('hands over to the publish screens when approved', async () => {
    const onApprove = vi.fn();
    render(<WorkspaceApp variant="site" initialPhase="ready" initialView="preview" onApprove={onApprove} />);
    await setup().click(screen.getByRole('button', { name: 'Approve and publish' }));
    expect(onApprove).toHaveBeenCalledOnce();
    expect(topStatus().getByText('Ready for you')).toBeInTheDocument();
  });
});

describe('keyboard and the command palette', () => {
  it('opens the palette with Cmd+K and closes it with Escape', async () => {
    const user = setup();
    render(<WorkspaceApp initialPhase="plan" />);
    await user.keyboard('{Meta>}k{/Meta}');
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument();
  });

  it('opens the palette from the search button, and runs an action', async () => {
    const user = setup();
    render(<WorkspaceApp initialPhase="ready" />);
    await user.click(screen.getAllByRole('button', { name: 'Search' })[0]!);
    await user.click(screen.getByRole('option', { name: /Approve and publish/ }));
    expect(topStatus().getByText('Approved')).toBeInTheDocument();
  });

  it('sends a navigation item where it goes', async () => {
    const user = setup();
    const onNavigate = vi.fn();
    render(<WorkspaceApp initialPhase="plan" onNavigate={onNavigate} />);
    await user.keyboard('{Meta>}k{/Meta}');
    await user.click(screen.getByRole('option', { name: /Sites/ }));
    expect(onNavigate).toHaveBeenCalledWith('/sites');
  });

  it('lists the shortcuts when ? is pressed, but not while typing', async () => {
    const user = setup();
    render(<WorkspaceApp initialPhase="plan" />);
    await user.click(screen.getByRole('textbox', { name: 'Message to Wursor' }));
    await user.keyboard('?');
    expect(screen.queryByRole('dialog', { name: 'Keyboard shortcuts' })).not.toBeInTheDocument();
    await user.click(document.body);
    await user.keyboard('?');
    expect(screen.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeInTheDocument();
  });

  it('toggles the board with Cmd+J and cycles the detail with Shift+Cmd+D', async () => {
    const user = setup();
    render(<WorkspaceApp initialPhase="plan" />);
    expect(document.querySelector('.ws')).toHaveAttribute('data-board', 'true');
    await user.keyboard('{Meta>}j{/Meta}');
    expect(document.querySelector('.ws')).toHaveAttribute('data-board', 'false');
    await user.keyboard('{Meta>}{Shift>}d{/Shift}{/Meta}');
    expect(screen.getByRole('radio', { name: 'Everything' })).toBeChecked();
  });

  it('approves with Cmd+Enter when the change is ready', async () => {
    const user = setup();
    render(<WorkspaceApp initialPhase="ready" />);
    await user.keyboard('{Meta>}{Enter}{/Meta}');
    expect(topStatus().getByText('Approved')).toBeInTheDocument();
  });

  it('shows the shortcut hints while the shortcut key is held', async () => {
    const user = setup();
    render(<WorkspaceApp initialPhase="plan" />);
    await user.keyboard('{Control>}');
    tick(700);
    expect(screen.getByText('Toggle sidebar')).toBeInTheDocument();
    await user.keyboard('{/Control}');
    expect(screen.queryByText('Toggle sidebar')).not.toBeInTheDocument();
  });

  it('opens a layer straight away for the fixed states', () => {
    render(<WorkspaceApp initialPhase="ready" overlay="tab-order" />);
    expect(screen.getByRole('region', { name: 'Tab order' })).toBeInTheDocument();
  });
});
