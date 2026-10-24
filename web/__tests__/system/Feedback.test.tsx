import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FeedbackProvider, useFeedback } from '../../src/system/Feedback.tsx';

function Demo({ onConfirm }: { onConfirm?: () => void }) {
  const { notify, confirm } = useFeedback();
  return (
    <>
      <button onClick={() => notify('Saved your change')}>Say</button>
      <button onClick={() => notify('Could not save', 'warning')}>Warn</button>
      <button onClick={() => confirm({ title: 'Delete this?', body: 'It goes away.', confirmLabel: 'Delete', tone: 'danger', ...(onConfirm ? { onConfirm } : {}), done: 'Deleted' })}>Ask</button>
    </>
  );
}

describe('feedback', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it('shows a toast and takes it away by itself', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FeedbackProvider><Demo /></FeedbackProvider>);
    await user.click(screen.getByRole('button', { name: 'Say' }));
    expect(screen.getByRole('status')).toHaveTextContent('Saved your change');
    act(() => void vi.advanceTimersByTime(5000));
    expect(screen.getByRole('status')).not.toHaveTextContent('Saved your change');
  });

  it('keeps at most three toasts', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<FeedbackProvider><Demo /></FeedbackProvider>);
    for (let i = 0; i < 4; i++) await user.click(screen.getByRole('button', { name: i % 2 ? 'Say' : 'Warn' }));
    expect(document.querySelectorAll('.ui-toast')).toHaveLength(3);
  });

  it('asks first, then does it and says so; Cancel does nothing', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onConfirm = vi.fn();
    render(<FeedbackProvider><Demo onConfirm={onConfirm} /></FeedbackProvider>);
    await user.click(screen.getByRole('button', { name: 'Ask' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Ask' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent('Deleted');
  });

  it('does nothing, quietly, without a provider', async () => {
    render(<Demo />);
    await userEvent.click(screen.getByRole('button', { name: 'Say' }));
    expect(screen.queryByRole('status')).toBeNull();
  });
});

describe('focus around the question', () => {
  it('lands on Cancel, and returns to the asking button when closed', async () => {
    const user = userEvent.setup();
    function Asker() {
      const { confirm } = useFeedback();
      return (
        <button type="button" onClick={() => confirm({ title: 'Sure?', body: 'b', confirmLabel: 'Yes' })}>
          Ask
        </button>
      );
    }
    render(
      <FeedbackProvider>
        <Asker />
      </FeedbackProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Ask' }));
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Ask' })).toHaveFocus();
  });
});
