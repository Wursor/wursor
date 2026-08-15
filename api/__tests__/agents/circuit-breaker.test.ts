import { describe, it, expect } from 'vitest';
import { CircuitBreaker } from '../../src/agents/circuit-breaker.ts';

describe('CircuitBreaker', () => {
  it('halts after two consecutive failures', () => {
    const breaker = new CircuitBreaker({ maxConsecutiveFailures: 2 });
    breaker.recordFailure();
    breaker.recordFailure();
    expect(breaker.shouldHalt()).toBe(true);
  });

  it('does not halt after a single failure', () => {
    const breaker = new CircuitBreaker({ maxConsecutiveFailures: 2 });
    breaker.recordFailure();
    expect(breaker.shouldHalt()).toBe(false);
  });

  it('resets the failure count after a success', () => {
    const breaker = new CircuitBreaker({ maxConsecutiveFailures: 2 });
    breaker.recordFailure();
    breaker.recordSuccess();
    breaker.recordFailure();
    expect(breaker.shouldHalt()).toBe(false);
  });
});
