import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuthClient, VerifyResult } from '../../src/onboarding/auth-client.ts';
import { VerifyStep } from '../../src/onboarding/VerifyStep.tsx';

const EMAIL = 'amara@harborbakery.com';

function client(verify: VerifyResult | (() => Promise<VerifyResult>) = { ok: true }): AuthClient {
  return {
    requestCode: vi.fn().mockResolvedValue({ ok: true }),
    continueWithGoogle: vi.fn().mockResolvedValue(undefined),
    verifyCode: vi.fn().mockImplementation(typeof verify === 'function' ? verify : () => Promise.resolve(verify)),
    resendCode: vi.fn().mockResolvedValue({ ok: true }),
  };
}

type Setup = { mode?: 'signup' | 'signin'; c?: AuthClient };
function setup({ mode = 'signup', c = client() }: Setup = {}) {
  const handlers = { onVerified: vi.fn(), onBack: vi.fn(), onChangeEmail: vi.fn() };
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  render(<VerifyStep mode={mode} email={EMAIL} client={c} {...handlers} />);
  return { c, user, ...handlers };
}

const boxes = () => screen.getAllByRole('textbox') as HTMLInputElement[];
const typeCode = async (user: ReturnType<typeof userEvent.setup>, code = '48291735') => {
  await user.click(boxes()[0]!);
  await user.keyboard(code);
};

beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());

describe('enter code (2a, 2g)', () => {
  it('tells the visitor where the code went and how long it lasts', () => {
    setup();
    expect(screen.getByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
    expect(screen.getByText(`We sent an eight-digit code to ${EMAIL}. It works for ten minutes.`)).toBeInTheDocument();
  });

  it('adds that entering the code signs in, on sign in', () => {
    setup({ mode: 'signin' });
    expect(screen.getByText(`We sent an eight-digit code to ${EMAIL}. It works for ten minutes. Entering it signs you in.`)).toBeInTheDocument();
  });

  it('starts with the first box ready for typing', () => {
    setup();
    expect(boxes()[0]).toHaveFocus();
    expect(boxes().every((b) => b.value === '')).toBe(true);
  });

  it('counts down to when a new code can be asked for', () => {
    setup();
    expect(screen.getByText("Didn't get it? Resend in 0:59")).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(17_000));
    expect(screen.getByText("Didn't get it? Resend in 0:42")).toBeInTheDocument();
  });

  it('offers Resend code once the countdown ends', () => {
    setup();
    act(() => void vi.advanceTimersByTime(60_000));
    expect(screen.getByRole('button', { name: 'Resend code' })).toBeEnabled();
    expect(screen.queryByText(/Resend in/)).not.toBeInTheDocument();
  });

  it('goes back, or to a different email', async () => {
    const { user, onBack, onChangeEmail } = setup();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Use a different email' }));
    expect(onChangeEmail).toHaveBeenCalledOnce();
  });
});

describe('checking the code (2b, 2h)', () => {
  it('shows the digits, Checking… and Almost there… while it is checked', async () => {
    let finish: (r: VerifyResult) => void = () => {};
    const c = client(() => new Promise<VerifyResult>((r) => { finish = r; }));
    const { user } = setup({ c });
    await typeCode(user);
    expect(boxes().map((b) => b.value).join('')).toBe('48291735');
    expect(boxes().every((b) => b.readOnly)).toBe(true);
    expect(screen.getByText('Checking…')).toBeInTheDocument();
    expect(screen.getByText('Almost there…')).toBeInTheDocument();
    expect(c.verifyCode).toHaveBeenCalledWith(EMAIL, '48291735', 'signup');
    await act(async () => finish({ ok: true }));
  });

  it('carries on once the code is right', async () => {
    const { user, onVerified } = setup();
    await typeCode(user);
    await vi.waitFor(() => expect(onVerified).toHaveBeenCalledWith(EMAIL));
  });
});

describe('wrong code (2c, 2i)', () => {
  const wrong = { ok: false, reason: 'wrong' } as const;

  it('turns every box red and says so, keeping what was typed', async () => {
    const { user } = setup({ c: client(wrong) });
    await typeCode(user);
    expect(await screen.findByText("That code didn't match. Check it and try again, or send a new one.")).toBeInTheDocument();
    expect(boxes().every((b) => b.getAttribute('aria-invalid') === 'true')).toBe(true);
    expect(boxes().map((b) => b.value).join('')).toBe('48291735');
  });

  it('lets the visitor ask for a new code straight away', async () => {
    const { user } = setup({ c: client(wrong) });
    await typeCode(user);
    expect(await screen.findByRole('button', { name: 'Resend code' })).toBeEnabled();
  });

  it('clears the error as soon as a digit is changed', async () => {
    const { user } = setup({ c: client(wrong) });
    await typeCode(user);
    await screen.findByText(/That code didn't match/);
    await user.click(boxes()[7]!);
    await user.keyboard('{Backspace}');
    expect(screen.queryByText(/That code didn't match/)).not.toBeInTheDocument();
    expect(boxes().every((b) => b.getAttribute('aria-invalid') === 'false')).toBe(true);
  });
});

describe('code expired (2e)', () => {
  const expired = { ok: false, reason: 'expired' } as const;

  it('explains, empties the boxes and offers a new code', async () => {
    const { user } = setup({ c: client(expired) });
    await typeCode(user);
    expect(await screen.findByText('That code has expired. Codes last ten minutes. Send a new one to continue.')).toBeInTheDocument();
    expect(boxes().every((b) => b.value === '')).toBe(true);
    expect(screen.getByRole('button', { name: 'Send a new code' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resend code' })).toBeEnabled();
  });
});

describe('too many tries (2f)', () => {
  it('locks the boxes until the time given, and says when to come back', async () => {
    const retryAt = Date.now() + 300_000;
    const { user, c } = setup({ c: client({ ok: false, reason: 'locked', retryAt }) });
    await typeCode(user);
    expect(await screen.findByText('Too many attempts. For your security, wait five minutes, then ask for a new code.')).toBeInTheDocument();
    expect(screen.getByText(/You can try again at \d{1,2}:\d{2} (AM|PM)\./)).toBeInTheDocument();
    expect(screen.getByText('Resend locked for 5:00')).toBeInTheDocument();
    expect(boxes().every((b) => b.readOnly && b.getAttribute('aria-invalid') === 'true')).toBe(true);
    expect(screen.queryByRole('button', { name: 'Resend code' })).not.toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(65_000));
    expect(screen.getByText('Resend locked for 3:55')).toBeInTheDocument();
    expect(c.resendCode).not.toHaveBeenCalled();
  });
});

describe('new code sent (2d, 2j)', () => {
  it('sends a new code, empties the boxes, restarts the countdown and confirms with a toast', async () => {
    const { user, c } = setup({ c: client({ ok: false, reason: 'expired' }) });
    await typeCode(user);
    await user.click(await screen.findByRole('button', { name: 'Send a new code' }));
    expect(c.resendCode).toHaveBeenCalledWith(EMAIL, 'signup');
    expect(await screen.findByText(`New code sent to ${EMAIL}`)).toBeInTheDocument();
    expect(boxes().every((b) => b.value === '')).toBe(true);
    expect(boxes()[0]).toHaveFocus();
    expect(screen.getByText("Didn't get it? Resend in 0:59")).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Send a new code' })).not.toBeInTheDocument();
  });

  it('clears the toast after a few seconds', async () => {
    const { user } = setup({ c: client({ ok: false, reason: 'wrong' }) });
    await typeCode(user);
    await user.click(await screen.findByRole('button', { name: 'Resend code' }));
    await screen.findByText(`New code sent to ${EMAIL}`);
    act(() => void vi.advanceTimersByTime(4_500));
    expect(screen.queryByText(`New code sent to ${EMAIL}`)).not.toBeInTheDocument();
  });

  it('says so if the new code could not be sent', async () => {
    const c = client({ ok: false, reason: 'wrong' });
    (c.resendCode as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false });
    const { user } = setup({ c });
    await typeCode(user);
    await user.click(await screen.findByRole('button', { name: 'Resend code' }));
    expect(await screen.findByText("We couldn't send a new code. Check your connection and try again.")).toBeInTheDocument();
  });
});
