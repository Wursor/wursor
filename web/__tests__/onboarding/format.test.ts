import { describe, expect, it } from 'vitest';
import { formatClock, formatCountdown } from '../../src/onboarding/format.ts';

describe('formatCountdown', () => {
  it.each([[59, '0:59'], [42, '0:42'], [5, '0:05'], [0, '0:00'], [300, '5:00'], [61, '1:01']])('%i seconds is %s', (s, out) => {
    expect(formatCountdown(s)).toBe(out);
  });

  it('never goes below zero', () => {
    expect(formatCountdown(-3)).toBe('0:00');
  });
});

describe('formatClock', () => {
  it('writes a time of day like the design: 9:47 AM, with an ordinary space', () => {
    const t = new Date(2026, 9, 13, 9, 47).getTime();
    expect(formatClock(t)).toBe('9:47 AM');
  });

  it('uses PM in the afternoon', () => {
    expect(formatClock(new Date(2026, 9, 13, 15, 5).getTime())).toBe('3:05 PM');
  });
});
