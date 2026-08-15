export type CircuitBreakerOptions = {
  maxConsecutiveFailures: number;
};

export class CircuitBreaker {
  private failures = 0;

  constructor(private readonly opts: CircuitBreakerOptions) {}

  recordFailure(): void {
    this.failures += 1;
  }

  recordSuccess(): void {
    this.failures = 0;
  }

  shouldHalt(): boolean {
    return this.failures >= this.opts.maxConsecutiveFailures;
  }
}
