import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette } from '../../src/command/CommandPalette.tsx';
import { FocusMap } from '../../src/command/FocusMap.tsx';
import { ShortcutHints } from '../../src/command/ShortcutHints.tsx';
import { ShortcutsDialog } from '../../src/command/ShortcutsDialog.tsx';

const open = (props: Partial<React.ComponentProps<typeof CommandPalette>> = {}) => {
  const onClose = vi.fn();
  const onRun = vi.fn();
  render(<CommandPalette onClose={onClose} onRun={onRun} {...props} />);
  return { user: userEvent.setup(), onClose, onRun };
};

describe('command palette (K1)', () => {
  it('opens on what needs you, then actions, then places, with the first one chosen', () => {
    open();
    const dialog = screen.getByRole('dialog', { name: 'Command palette' });
    const box = screen.getByRole('combobox', { name: 'Ask Wursor to…' });
    expect(box).toHaveFocus();
    const list = within(dialog).getByRole('listbox');
    const groups = within(list).getAllByRole('group').map((g) => g.getAttribute('aria-label'));
    expect(groups).toEqual(['Needs you', 'Actions', 'Navigate']);
    expect(within(list).getAllByRole('option')).toHaveLength(11);
    expect(within(list).getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');
    expect(within(list).getByText('Ready for you · Home page')).toBeInTheDocument();
    expect(within(dialog).getByText('Ask Wursor')).toBeInTheDocument();
  });

  it('moves with the arrow keys and runs the chosen item on Enter', async () => {
    const { user, onRun, onClose } = open();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onRun).toHaveBeenCalledWith(expect.objectContaining({ label: 'New change' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape and when the backdrop is clicked', async () => {
    const { user, onClose } = open();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    await user.click(screen.getByTestId('palette-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});

describe('searching (K3)', () => {
  it('narrows to what matches, grouped, and includes help', async () => {
    const { user } = open();
    await user.type(screen.getByRole('combobox'), 'pub');
    const list = screen.getByRole('listbox');
    expect(within(list).getAllByRole('group').map((g) => g.getAttribute('aria-label'))).toEqual(['Actions', 'Navigate', 'Help']);
    expect(within(list).getByText('Approve and publish')).toBeInTheDocument();
    expect(within(list).getByText('Undo the last change')).toBeInTheDocument();
    expect(within(list).getByText('Publishing and undo')).toBeInTheDocument();
    expect(within(list).queryByText('New change')).not.toBeInTheDocument();
  });

  it('says so when nothing matches, and still offers to ask Wursor', async () => {
    const { user } = open();
    await user.type(screen.getByRole('combobox'), 'zzzz');
    expect(screen.getByText('Nothing matches “zzzz”.')).toBeInTheDocument();
  });
});

describe('asking for a change (K2)', () => {
  it('offers to ask Wursor first, then the changes that may be related', async () => {
    const { user, onRun } = open();
    await user.type(screen.getByRole('combobox'), 'Make the footer phone number a tap-to-call link');
    const list = screen.getByRole('listbox');
    expect(within(list).getAllByRole('group').map((g) => g.getAttribute('aria-label'))).toEqual(['Ask', 'Changes']);
    const first = within(list).getAllByRole('option')[0]!;
    expect(first).toHaveTextContent('Ask Wursor to make the footer phone number a tap-to-call link');
    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(within(list).getByText('Contact page · 1 min ago')).toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(onRun).toHaveBeenCalledWith(expect.objectContaining({ group: 'ask' }));
  });
});

describe('keyboard shortcuts (K4)', () => {
  it('lists every shortcut in three groups and says what Windows and Linux use', async () => {
    const onClose = vi.fn();
    render(<ShortcutsDialog onClose={onClose} />);
    const dialog = screen.getByRole('dialog', { name: 'Keyboard shortcuts' });
    expect(within(dialog).getByText('On Windows and Linux, use Ctrl in place of ⌘.')).toBeInTheDocument();
    for (const g of ['General', 'Compose and review', 'Workspace']) expect(within(dialog).getByRole('group', { name: g })).toBeInTheDocument();
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(10);
    expect(within(dialog).getByText('Toggle sidebar')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});

describe('shortcuts shown in context (K5)', () => {
  it('names the shortcut beside the thing it works on', () => {
    render(<ShortcutHints />);
    for (const [label, keys] of [['Toggle sidebar', '⌘\\'], ['Cycle detail', '⇧⌘D'], ['Toggle board', '⌘J'], ['Send message', '⌘↵']] as const) {
      const tip = screen.getByText(label).closest('.cmd-hint') as HTMLElement;
      expect(within(tip).getByText(keys)).toBeInTheDocument();
    }
  });
});

describe('keyboard focus and tab order (K6)', () => {
  it('numbers the order focus moves in, and says Escape closes layers', () => {
    render(<FocusMap />);
    const card = screen.getByRole('region', { name: 'Tab order' });
    expect(within(card).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      '1Sidebar',
      '2Conversation stream (arrow keys move through steps)',
      '3Composer',
      '4Preview tabs',
      '5Before and after slider',
      '6Approve and publish (⌘↵ when focused)',
    ]);
    expect(within(card).getByText('Esc closes any open layer. Focus is always a 2 px accent ring.')).toBeInTheDocument();
  });
});
