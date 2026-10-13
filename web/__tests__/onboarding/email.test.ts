import { describe, expect, it } from 'vitest';
import { isValidEmail } from '../../src/onboarding/email.ts';

describe('isValidEmail', () => {
  it.each(['you@company.com', 'amara@harborbakery.com', 'a.b+tag@sub.example.co.uk', ' you@company.com '])('accepts %j', (v) => {
    expect(isValidEmail(v)).toBe(true);
  });

  it.each(['', 'amara', 'amara@harbor', '@company.com', 'you@', 'you @company.com', 'you@company.c'])('rejects %j', (v) => {
    expect(isValidEmail(v)).toBe(false);
  });
});
