import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BoardScreen, type BoardState } from '../../src/board/BoardScreen.tsx';

const show = (props: Partial<React.ComponentProps<typeof BoardScreen>> = {}) => {
  render(<BoardScreen state="board" {...props} />);
  return { user: userEvent.setup() };
};
const lane = (name: string) => within(screen.getByRole('group', { name }));

describe('Board (BD1)', () => {
  it('shows every change in the lane for where it is, with a count on each', () => {
    show();
    expect(screen.getByRole('heading', { name: 'Board', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Every change on Harbor Bakery, from idea to done.')).toBeInTheDocument();
    const names = screen.getAllByRole('group').map((g) => g.getAttribute('aria-label'));
    expect(names).toEqual(['Idea', 'Plan ready', 'Working', 'Needs you', 'Ready for you', 'Done']);
    expect(lane('Idea').getAllByRole('article')).toHaveLength(3);
    expect(lane('Done').getAllByRole('article')).toHaveLength(2);
    expect(lane('Needs you').getByText('Wursor is waiting for your answer')).toBeInTheDocument();
    expect(lane('Working').getByRole('progressbar')).toBeInTheDocument();
    expect(lane('Idea').getByText('3')).toBeInTheDocument();
  });

  it('keeps Board as the current place in the sidebar', () => {
    show();
    expect(within(screen.getByRole('navigation', { name: 'Workspace' })).getByRole('link', { name: 'Board' })).toHaveAttribute('aria-current', 'page');
  });

  it('opens the new-change dialog from the button and from a lane', async () => {
    const { user } = show();
    await user.click(within(screen.getByRole('main')).getAllByRole('button', { name: 'New change' })[0]!);
    await user.click(screen.getByRole('button', { name: 'Add to Idea' }));
    expect(screen.getAllByRole('dialog', { name: 'New change' }).length).toBeGreaterThan(0);
  });
});

describe('moving a card (BD6)', () => {
  it('drags a card into another lane', () => {
    show();
    const card = within(screen.getByRole('group', { name: 'Idea' })).getByText('Add Sunday hours to the footer').closest('article') as HTMLElement;
    const target = screen.getByRole('group', { name: 'Plan ready' });
    fireEvent.dragStart(card);
    fireEvent.dragEnter(target);
    expect(target).toHaveAttribute('data-over', 'true');
    fireEvent.drop(target);
    expect(lane('Plan ready').getByText('Add Sunday hours to the footer')).toBeInTheDocument();
    expect(lane('Idea').queryByText('Add Sunday hours to the footer')).not.toBeInTheDocument();
  });

  it('shows the floating card and a dashed place for it when drawn mid-drag', () => {
    show({ dragDemo: true });
    expect(screen.getByTestId('drag-ghost')).toBeInTheDocument();
    expect(screen.getByTestId('drop-slot')).toBeInTheDocument();
  });
});

describe('views and filters', () => {
  it('switches to a list, ordered by what needs the owner first', async () => {
    const { user } = show();
    await user.click(screen.getByRole('radio', { name: 'List' }));
    const rows = screen.getByRole('list', { name: 'All changes' });
    const titles = within(rows).getAllByRole('listitem').map((r) => within(r).getByTestId('change-title').textContent);
    expect(titles.slice(0, 3)).toEqual(['Update opening hours', 'Fix broken order link', 'Make phone number tappable']);
    expect(within(rows).getByText('Noticeable')).toBeInTheDocument();
  });

  it('switches to a calendar of the month, marking today', async () => {
    const { user } = show();
    await user.click(screen.getByRole('radio', { name: 'Calendar' }));
    expect(screen.getByText('October 2026')).toBeInTheDocument();
    expect(screen.getByLabelText('Today, 14 October')).toBeInTheDocument();
    expect(within(screen.getByRole('main')).getByText('Make phone number tappable')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('November 2026')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Today' }));
    expect(screen.getByText('October 2026')).toBeInTheDocument();
  });

  it('filters to what needs the owner, and says so when nothing does', async () => {
    const { user } = show();
    await user.click(screen.getByRole('button', { name: 'Needs you' }));
    expect(lane('Needs you').getAllByRole('article')).toHaveLength(1);
    expect(screen.queryByRole('group', { name: 'Idea' })).not.toBeInTheDocument();
  });

  it('offers to show everything when the filter leaves nothing', () => {
    show({ state: 'nothing-matches' });
    expect(screen.getByText('Nothing needs you right now')).toBeInTheDocument();
    expect(screen.getByText('Wursor will tell you here when a change needs your answer. Clear the filter to see every change.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show all changes' })).toBeInTheDocument();
  });
});

describe('a change in detail (BD5)', () => {
  it('opens what was asked, the plan, progress and safety, with Stop and Open preview', async () => {
    const { user } = show();
    await user.click(screen.getByRole('button', { name: /Make phone number tappable/ }));
    const drawer = screen.getByRole('complementary', { name: 'Change' });
    expect(within(drawer).getByRole('heading', { name: 'Make phone number tappable' })).toBeInTheDocument();
    expect(within(drawer).getByText('Contact page · started 2 min ago')).toBeInTheDocument();
    expect(within(drawer).getByText('Make the phone number on the Contact page tappable on phones.')).toBeInTheDocument();
    expect(within(drawer).getAllByRole('listitem').length).toBeGreaterThanOrEqual(6);
    expect(within(drawer).getByText('Checking the footer on a phone width')).toBeInTheDocument();
    expect(within(drawer).getByText('Everyday change. A copy of the page is saved first, and you can undo this from Activity.')).toBeInTheDocument();
    expect(within(drawer).getByRole('button', { name: 'Stop' })).toBeInTheDocument();
    expect(within(drawer).getByRole('button', { name: 'Open preview' })).toBeInTheDocument();
    await user.click(within(drawer).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('complementary', { name: 'Change' })).not.toBeInTheDocument();
  });
});

describe('a new change (BD8)', () => {
  it('asks in your own words, for which site, and how to work, and starts it', async () => {
    const onStart = vi.fn();
    const { user } = show({ initialComposer: true, onStart });
    const dialog = screen.getByRole('dialog', { name: 'New change' });
    expect(within(dialog).getByPlaceholderText('Say it in your own words, like: “Add our Sunday hours to the footer”')).toBeInTheDocument();
    expect(within(dialog).getByRole('combobox', { name: 'Site' })).toHaveValue('Harbor Bakery');
    expect(within(dialog).getByRole('radio', { name: 'Ask first' })).toBeChecked();
    expect(within(dialog).getByText('Wursor will show you a plan before it changes anything on Harbor Bakery.')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Start' })).toHaveAttribute('aria-disabled', 'true');
    await user.type(within(dialog).getByRole('textbox'), 'Add our Sunday hours to the footer');
    await user.click(within(dialog).getByRole('radio', { name: 'Plan only' }));
    expect(within(dialog).getByText('Wursor will only write a plan for Harbor Bakery. Nothing changes.')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Start' }));
    expect(onStart).toHaveBeenCalledWith({ text: 'Add our Sunday hours to the footer', site: 'Harbor Bakery', mode: 'Plan only', stage: 'working', page: 'Whole site', assignee: 'Me', due: '', files: [] });
    expect(screen.queryByRole('dialog', { name: 'New change' })).not.toBeInTheDocument();
  });

  it('can be cancelled', async () => {
    const { user } = show({ initialComposer: true });
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog', { name: 'New change' })).not.toBeInTheDocument();
  });
});

describe('every site (BD7)', () => {
  it('lays each site out in its own row of lanes', () => {
    show({ scope: 'all' });
    expect(screen.getByRole('heading', { name: 'All sites', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Every change across the 8 sites you manage.')).toBeInTheDocument();
    const rows = screen.getAllByRole('row');
    expect(rows.map((r) => r.getAttribute('aria-label'))).toEqual(['Harbor Bakery', 'Lumen Studio', 'North Fork Dental', 'Bright Path Tutors']);
    expect(within(rows[0]!).getByText('Update opening hours')).toBeInTheDocument();
  });
});

describe('the other states (BD2, BD3, BD10)', () => {
  it.each<[BoardState]>([['loading']])('shows a placeholder while it loads', () => {
    show({ state: 'loading' });
    expect(screen.getByRole('status', { name: 'Loading the board' })).toBeInTheDocument();
  });

  it('explains an empty board and offers a first change', () => {
    show({ state: 'empty' });
    expect(screen.getByText('Your board is empty')).toBeInTheDocument();
    expect(screen.getByText('Ask Wursor for a change, or pick one of its suggestions. Each change gets a card that moves from idea to done.')).toBeInTheDocument();
  });

  it('when offline, says what still works and stops cards being moved', () => {
    show({ state: 'offline' });
    expect(screen.getByText('You’re offline. Changes already running keep going; you can’t start or move changes until you’re back.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    const card = screen.getAllByRole('article')[0]!;
    expect(card).toHaveAttribute('draggable', 'false');
  });
});


describe('the new change box is complete', () => {
  it('lets you pick the stage, the page, who it is for, a due date and files', async () => {
    const onStart = vi.fn();
    const { user } = show({ initialComposer: true, onStart });
    const dialog = screen.getByRole('dialog', { name: 'New change' });
    const stage = within(dialog).getByRole('combobox', { name: 'Stage' });
    expect(Array.from((stage as HTMLSelectElement).options).map((o) => o.text)).toEqual(['Idea', 'Plan ready', 'Working', 'Needs you', 'Ready for you', 'Done']);
    await user.type(within(dialog).getByRole('textbox', { name: 'What should change' }), 'Describe the gallery photos');
    await user.selectOptions(stage, 'Idea');
    expect(within(dialog).getByRole('button', { name: 'Add idea' })).toBeInTheDocument();
    await user.selectOptions(within(dialog).getByRole('combobox', { name: 'Page' }), 'Gallery');
    await user.selectOptions(within(dialog).getByRole('combobox', { name: 'Assigned to' }), 'Chidi Eze');
    await user.type(within(dialog).getByLabelText('Due date (optional)'), '2026-10-22');
    await user.upload(within(dialog).getByLabelText('Attach files', { selector: 'input' }), new File(['x'], 'photos.zip'));
    expect(within(dialog).getByText('photos.zip')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Add idea' }));
    expect(onStart).toHaveBeenCalledWith({ text: 'Describe the gallery photos', site: 'Harbor Bakery', mode: 'Ask first', stage: 'idea', page: 'Gallery', assignee: 'Chidi Eze', due: '2026-10-22', files: ['photos.zip'] });
  });

  it('removes an attached file before sending', async () => {
    const { user } = show({ initialComposer: true });
    const dialog = screen.getByRole('dialog', { name: 'New change' });
    await user.upload(within(dialog).getByLabelText('Attach files', { selector: 'input' }), new File(['x'], 'menu.pdf'));
    await user.click(within(dialog).getByRole('button', { name: 'Remove menu.pdf' }));
    expect(within(dialog).queryByText('menu.pdf')).not.toBeInTheDocument();
  });

  it('puts the new card in the stage you chose, on the board', async () => {
    const { user } = show({ initialComposer: true });
    const dialog = screen.getByRole('dialog', { name: 'New change' });
    await user.type(within(dialog).getByRole('textbox', { name: 'What should change' }), 'Add a holiday banner');
    await user.selectOptions(within(dialog).getByRole('combobox', { name: 'Stage' }), 'Plan ready');
    await user.click(within(dialog).getByRole('button', { name: 'Add to board' }));
    const lane = screen.getByRole('group', { name: /Plan ready/ });
    expect(within(lane).getByText('Add a holiday banner')).toBeInTheDocument();
  });

  it('can open on a stage already chosen, from that lane', () => {
    show({ initialComposer: true, initialStage: 'needs-you' });
    expect(within(screen.getByRole('dialog', { name: 'New change' })).getByRole('combobox', { name: 'Stage' })).toHaveValue('Needs you');
  });
});
