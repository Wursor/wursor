import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUp } from '../src/components/SignUp.tsx';

describe('SignUp', () => {
  it('submits the email and password', async () => {
    const onSignUp = vi.fn().mockResolvedValue(undefined);
    render(<SignUp onSignUp={onSignUp} />);

    await userEvent.type(screen.getByLabelText('Email'), 'a@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(onSignUp).toHaveBeenCalledWith('a@example.com', 'password123');
  });

  it('shows an error when signup fails', async () => {
    const onSignUp = vi.fn().mockRejectedValue(new Error('email_exists'));
    render(<SignUp onSignUp={onSignUp} />);

    await userEvent.type(screen.getByLabelText('Email'), 'a@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('email_exists');
  });
});
