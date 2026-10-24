import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { AuthClient } from '../../src/onboarding/auth-client.ts';
import { AuthFlow } from '../../src/onboarding/AuthFlow.tsx';

function client(overrides: Partial<AuthClient> = {}): AuthClient {
  return {
    requestCode: vi.fn().mockResolvedValue({ ok: true }),
    continueWithGoogle: vi.fn().mockResolvedValue(undefined),
    verifyCode: vi.fn().mockResolvedValue({ ok: true }),
    resendCode: vi.fn().mockResolvedValue({ ok: true }),
    ...overrides,
  };
}

const setup = (mode: 'signup' | 'signin', c: AuthClient = client(), onCodeSent = vi.fn(), onGoogle = vi.fn()) => {
  render(<AuthFlow mode={mode} client={c} onCodeSent={onCodeSent} onGoogleDone={onGoogle} />);
  return { c, onCodeSent, onGoogle };
};

const toEmailStep = async () => userEvent.click(screen.getByRole('button', { name: 'Continue with email' }));
const emailField = () => screen.getByRole('textbox', { name: 'Email' });
const continueButton = () => screen.getByRole('button', { name: /Continue|Sending code/ });

describe('sign up: welcome (1a)', () => {
  it('invites the visitor to create an account and offers Google and email', () => {
    setup('signup');
    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
    expect(screen.getByText(/Tell Wursor what to change on your WordPress site/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with email' })).toBeInTheDocument();
  });

  it('states the terms and points existing users to sign in', () => {
    setup('signup');
    expect(screen.getByText('By continuing, you agree to the Terms of Service and Privacy Policy.')).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    const links = screen.getAllByRole('link', { name: 'Sign in' });
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['/signin', '/signin']);
  });

  it('has Help in the header', () => {
    setup('signup');
    expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute('href', '/docs');
  });
});

describe('sign in: welcome (1e)', () => {
  it('welcomes the visitor back and offers Google and email', () => {
    setup('signin');
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(screen.getByText('Sign in to pick up where Wursor left off. Wursor still asks before anything goes live.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument();
  });

  it('points new users to create an account, and shows Sign in as the current page', () => {
    setup('signin');
    expect(screen.getByText('New to Wursor?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create an account' })).toHaveAttribute('href', '/signup');
    expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument();
    expect(screen.getByText('Sign in', { selector: '[aria-current="page"]' })).toBeInTheDocument();
  });
});

describe('email entry (1b, 1f)', () => {
  it('asks for the email on sign up, with no password', async () => {
    setup('signup');
    await toEmailStep();
    expect(screen.getByRole('heading', { name: "What's your email?" })).toBeInTheDocument();
    expect(screen.getByText("We'll send you a code. No password to remember.")).toBeInTheDocument();
    expect(emailField()).toHaveAttribute('placeholder', 'you@harborbakery.com');
    expect(emailField()).toHaveFocus();
  });

  it('asks for the email on sign in with its own wording', async () => {
    setup('signin');
    await toEmailStep();
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(screen.getByText("Enter your email and we'll send you a code to sign in.")).toBeInTheDocument();
  });

  it('keeps Continue unavailable until the email is complete', async () => {
    setup('signup');
    await toEmailStep();
    expect(continueButton()).toHaveAttribute('aria-disabled', 'true');
    await userEvent.type(emailField(), 'amara@harborbakery.com');
    expect(continueButton()).toHaveAttribute('aria-disabled', 'false');
  });

  it('goes back to the welcome screen', async () => {
    setup('signup');
    await toEmailStep();
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
  });

  it('offers Google as the alternative', async () => {
    const { c, onGoogle } = setup('signup');
    await toEmailStep();
    await userEvent.click(screen.getByRole('button', { name: 'Use Google instead' }));
    expect(c.continueWithGoogle).toHaveBeenCalledWith('signup');
    expect(onGoogle).toHaveBeenCalled();
  });
});

describe('email not valid (1c)', () => {
  it('explains what is wrong once the visitor leaves the field', async () => {
    setup('signup');
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harbor');
    expect(screen.queryByText(/Enter a full email address/)).not.toBeInTheDocument();
    await userEvent.tab();
    expect(screen.getByText('Enter a full email address, like you@company.com')).toBeInTheDocument();
    expect(emailField()).toHaveAttribute('aria-invalid', 'true');
    expect(emailField()).toHaveAccessibleDescription('Enter a full email address, like you@company.com');
    expect(continueButton()).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows the same message when Enter is pressed on an incomplete email, and sends nothing', async () => {
    const { c } = setup('signup');
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harbor{Enter}');
    expect(screen.getByText('Enter a full email address, like you@company.com')).toBeInTheDocument();
    expect(c.requestCode).not.toHaveBeenCalled();
  });

  it('clears the message as soon as the email becomes valid', async () => {
    setup('signup');
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harbor');
    await userEvent.tab();
    await userEvent.click(emailField());
    await userEvent.type(emailField(), 'bakery.com');
    expect(screen.queryByText(/Enter a full email address/)).not.toBeInTheDocument();
    expect(emailField()).toHaveAttribute('aria-invalid', 'false');
  });
});

describe('sending the code (1d, 1h)', () => {
  it('shows Sending code… while the request is in flight, keeping the email', async () => {
    let finish: (r: { ok: true }) => void = () => {};
    const c = client({ requestCode: vi.fn().mockReturnValue(new Promise((r) => { finish = r; })) });
    setup('signup', c);
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harborbakery.com{Enter}');
    const busy = screen.getByRole('button', { name: 'Sending code…' });
    expect(busy).toHaveAttribute('aria-disabled', 'true');
    expect(busy).toHaveAttribute('aria-busy', 'true');
    expect(emailField()).toHaveValue('amara@harborbakery.com');
    expect(emailField()).toHaveAttribute('readonly');
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    finish({ ok: true });
  });

  it('does not send twice if Enter is pressed again while sending', async () => {
    const c = client({ requestCode: vi.fn().mockReturnValue(new Promise(() => {})) });
    setup('signup', c);
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harborbakery.com{Enter}{Enter}');
    expect(c.requestCode).toHaveBeenCalledTimes(1);
  });

  it('hands the trimmed email on once the code is sent', async () => {
    const { c, onCodeSent } = setup('signin');
    await toEmailStep();
    await userEvent.type(emailField(), ' amara@harborbakery.com {Enter}');
    expect(c.requestCode).toHaveBeenCalledWith('amara@harborbakery.com', 'signin');
    await vi.waitFor(() => expect(onCodeSent).toHaveBeenCalledWith('amara@harborbakery.com'));
  });

  it('keeps the sign-in wording while the sign-in code is sending', async () => {
    const c = client({ requestCode: vi.fn().mockReturnValue(new Promise(() => {})) });
    setup('signin', c);
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harborbakery.com{Enter}');
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
  });
});

describe('no account with that email (1g)', () => {
  it('says so and offers to create one, on sign in only', async () => {
    const c = client({ requestCode: vi.fn().mockResolvedValue({ ok: false, reason: 'no-account' }) });
    setup('signin', c);
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harbor.com{Enter}');
    const link = await screen.findByRole('link', { name: 'No account with that email. Create one instead.' });
    expect(link).toHaveAttribute('href', '/signup');
    expect(emailField()).toHaveAttribute('aria-invalid', 'true');
    expect(emailField()).toHaveValue('amara@harbor.com');
    expect(within(screen.getByRole('button', { name: 'Continue' }).parentElement!).getByRole('link')).toBeInTheDocument();
  });

  it('lets the visitor fix the email and try again', async () => {
    const requestCode = vi.fn().mockResolvedValueOnce({ ok: false, reason: 'no-account' }).mockResolvedValueOnce({ ok: true });
    setup('signin', client({ requestCode }));
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harbor.com{Enter}');
    await screen.findByRole('link', { name: /No account/ });
    await userEvent.clear(emailField());
    await userEvent.type(emailField(), 'amara@harborbakery.com');
    expect(screen.queryByRole('link', { name: /No account/ })).not.toBeInTheDocument();
    await userEvent.keyboard('{Enter}');
    expect(requestCode).toHaveBeenCalledTimes(2);
  });

  it('shows a plain retry message if sending fails for another reason', async () => {
    const c = client({ requestCode: vi.fn().mockResolvedValue({ ok: false, reason: 'unavailable' }) });
    setup('signup', c);
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harborbakery.com{Enter}');
    expect(await screen.findByText("We couldn't send the code. Check your connection and try again.")).toBeInTheDocument();
    expect(continueButton()).toHaveAttribute('aria-disabled', 'false');
  });
});

describe('Google', () => {
  it('continues with Google from the welcome screen', async () => {
    const { c, onGoogle } = setup('signin');
    await userEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));
    expect(c.continueWithGoogle).toHaveBeenCalledWith('signin');
    await vi.waitFor(() => expect(onGoogle).toHaveBeenCalled());
  });
});

describe('on to the code (section 2)', () => {
  it('moves to Check your email once the code is sent, naming the address', async () => {
    setup('signup');
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harborbakery.com{Enter}');
    expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
    expect(screen.getByText(/We sent an eight-digit code to amara@harborbakery.com/)).toBeInTheDocument();
  });

  it('Back from the code returns to the email, still filled in', async () => {
    setup('signup');
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harborbakery.com{Enter}');
    await userEvent.click(await screen.findByRole('button', { name: 'Back' }));
    expect(emailField()).toHaveValue('amara@harborbakery.com');
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveAttribute('aria-disabled', 'false');
  });

  it('Use a different email returns to an empty email field', async () => {
    setup('signup');
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harborbakery.com{Enter}');
    await userEvent.click(await screen.findByRole('button', { name: 'Use a different email' }));
    expect(emailField()).toHaveValue('');
    expect(emailField()).toHaveFocus();
  });

  it('tells the caller once the code is verified', async () => {
    const onVerified = vi.fn();
    render(<AuthFlow mode="signin" client={client()} onVerified={onVerified} />);
    await toEmailStep();
    await userEvent.type(emailField(), 'amara@harborbakery.com{Enter}');
    await screen.findByRole('heading', { name: 'Check your email' });
    await userEvent.click(screen.getAllByRole('textbox')[0]!);
    await userEvent.keyboard('12345678');
    await vi.waitFor(() => expect(onVerified).toHaveBeenCalledWith('amara@harborbakery.com'));
  });
});
