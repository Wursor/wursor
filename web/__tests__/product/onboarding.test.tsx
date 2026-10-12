import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActivityCard } from '../../src/product/ActivityCard.tsx';
import { Kbd } from '../../src/product/Kbd.tsx';
import { SearchField } from '../../src/product/SearchField.tsx';
import { SetupChecklist } from '../../src/product/SetupChecklist.tsx';

const STEPS = [
  { state: 'done', title: 'Site address added', detail: 'harborbakery.com' },
  { state: 'done', title: 'Connection verified', detail: 'Secure, read and write' },
  { state: 'next', title: 'Safe copy ready', detail: 'Wursor is creating it' },
  { state: 'todo', title: 'Make your first change', detail: 'Pick a suggestion' },
] as const;

describe('SetupChecklist', () => {
  it('lists the steps in order, saying which is done, which is next and which is to do', () => {
    render(<SetupChecklist steps={STEPS} />);
    const items = within(screen.getByRole('list', { name: 'Setup steps' })).getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(items.map((i) => i.getAttribute('data-state'))).toEqual(['done', 'done', 'next', 'todo']);
    expect(within(items[0]!).getByText('Done')).toBeInTheDocument();
    expect(within(items[2]!).getByText('Next')).toBeInTheDocument();
    expect(within(items[3]!).getByText('To do')).toBeInTheDocument();
  });

  it('marks the next step as the current one', () => {
    render(<SetupChecklist steps={STEPS} />);
    expect(screen.getByText('Safe copy ready').closest('li')).toHaveAttribute('aria-current', 'step');
  });

  it('offers Continue on the next step only', async () => {
    const onContinue = vi.fn();
    render(<SetupChecklist steps={STEPS} onContinue={onContinue} />);
    expect(screen.getAllByRole('button', { name: 'Continue' })).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onContinue).toHaveBeenCalledOnce();
  });
});

describe('ActivityCard', () => {
  const rows = [
    { kind: 'published', text: 'Published the Contact page', time: 'Just now' },
    { kind: 'check', text: 'Checked 9 things, all passed', time: '2 min ago' },
    { kind: 'change', text: 'Changed the Contact page', time: '3 min ago' },
    { kind: 'safe-copy', text: 'Made a safe copy of your site', time: '5 min ago' },
  ] as const;

  it('shows what happened and when, newest first', () => {
    render(<ActivityCard rows={rows} />);
    const items = within(screen.getByRole('list', { name: 'Activity' })).getAllByRole('listitem');
    expect(items.map((i) => i.querySelector('.p-activity-text')?.textContent)).toEqual(rows.map((r) => r.text));
    expect(within(items[0]!).getByText('Just now')).toBeInTheDocument();
  });

  it('gives each kind its own icon', () => {
    render(<ActivityCard rows={rows} />);
    const kinds = screen.getAllByRole('listitem').map((i) => i.getAttribute('data-kind'));
    expect(kinds).toEqual(['published', 'check', 'change', 'safe-copy']);
  });
});

describe('Kbd and SearchField', () => {
  it('shows a key cap', () => {
    render(<Kbd>⌘K</Kbd>);
    expect(screen.getByText('⌘K').tagName).toBe('KBD');
  });

  it('is a labelled search box with a shortcut hint', async () => {
    render(<SearchField label="Search the docs" shortcut="⌘K" />);
    const box = screen.getByRole('searchbox', { name: 'Search the docs' });
    expect(box).toHaveAttribute('placeholder', 'Search or ask…');
    expect(screen.getByText('⌘K')).toBeInTheDocument();
    await userEvent.type(box, 'undo');
    expect(box).toHaveValue('undo');
  });

  it('can be shown but not used until search exists', () => {
    render(<SearchField label="Search the docs" disabled />);
    expect(screen.getByRole('searchbox', { name: 'Search the docs' })).toBeDisabled();
  });
});
