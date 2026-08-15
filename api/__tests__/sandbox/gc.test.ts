import { describe, it, expect } from 'vitest';
import { decideGc } from '../../src/sandbox/gc.ts';

const opts = { idleMs: 15 * 60 * 1000, hardMs: 24 * 60 * 60 * 1000 };
const now = 1_000_000;

describe('decideGc', () => {
  it('pauses a running sandbox after the idle threshold', () => {
    expect(decideGc({ status: 'running', lastActiveAt: now - opts.idleMs - 1, createdAt: 0 }, now, opts)).toBe('pause');
  });

  it('keeps an active running sandbox', () => {
    expect(decideGc({ status: 'running', lastActiveAt: now - 1000, createdAt: 0 }, now, opts)).toBe('keep');
  });

  it('destroys any sandbox past the hard timeout regardless of activity', () => {
    expect(decideGc({ status: 'running', lastActiveAt: now - 1000, createdAt: now - opts.hardMs - 1 }, now, opts)).toBe(
      'destroy',
    );
  });

  it('does not re-pause an already paused sandbox', () => {
    expect(decideGc({ status: 'paused', lastActiveAt: now - opts.idleMs - 1, createdAt: 0 }, now, opts)).toBe('keep');
  });

  it('keeps a destroyed sandbox', () => {
    expect(decideGc({ status: 'destroyed', lastActiveAt: 0, createdAt: 0 }, now, opts)).toBe('keep');
  });
});
