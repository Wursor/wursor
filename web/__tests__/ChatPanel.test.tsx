import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatPanel } from '../src/components/ChatPanel.tsx';

describe('ChatPanel', () => {
  it('renders user and agent messages', () => {
    render(
      <ChatPanel
        messages={[
          { id: '1', role: 'user', text: 'Change the heading' },
          { id: '2', role: 'agent', text: 'Done' },
        ]}
        status="done"
        onSend={vi.fn()}
      />,
    );
    expect(screen.getByText('Change the heading')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('calls onSend with the typed message', async () => {
    const onSend = vi.fn();
    render(<ChatPanel messages={[]} status="idle" onSend={onSend} />);

    await userEvent.type(screen.getByPlaceholderText('Describe what you want…'), 'Change the heading');
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(onSend).toHaveBeenCalledWith('Change the heading');
  });

  it('shows a working indicator while the agent works', () => {
    render(<ChatPanel messages={[]} status="working" onSend={vi.fn()} />);
    expect(screen.getByText(/working/i)).toBeInTheDocument();
  });
});
