import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApproveBar } from '../src/components/ApproveBar.tsx';

describe('ApproveBar', () => {
  it('renders apply and reject buttons when visible', () => {
    render(<ApproveBar visible onApprove={vi.fn()} onReject={vi.fn()} />);
    expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument();
  });

  it('calls onApprove and onReject', async () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    render(<ApproveBar visible onApprove={onApprove} onReject={onReject} />);

    await userEvent.click(screen.getByRole('button', { name: /apply/i }));
    expect(onApprove).toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: /reject/i }));
    expect(onReject).toHaveBeenCalled();
  });

  it('renders nothing when not visible', () => {
    const { container } = render(<ApproveBar visible={false} onApprove={vi.fn()} onReject={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
