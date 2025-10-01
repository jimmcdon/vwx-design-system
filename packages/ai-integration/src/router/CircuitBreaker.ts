/**
 * Circuit Breaker Pattern Implementation
 *
 * Prevents cascading failures by tracking provider failures
 * and temporarily disabling providers that are failing repeatedly.
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Provider is failing, requests are blocked
 * - HALF_OPEN: Testing if provider has recovered
 */
export class CircuitBreaker {
  private failures: Map<string, number> = new Map();
  private lastFailure: Map<string, Date> = new Map();
  private state: Map<string, 'closed' | 'open' | 'half-open'> = new Map();

  private readonly failureThreshold = 3;
  private readonly timeout = 60000; // 1 minute
  private readonly halfOpenRetries = 1;

  /**
   * Check if requests can be sent to this provider
   */
  canAttempt(providerName: string): boolean {
    const failures = this.failures.get(providerName) || 0;
    const lastFail = this.lastFailure.get(providerName);
    const state = this.state.get(providerName) || 'closed';

    // If circuit is closed, allow all requests
    if (state === 'closed') {
      return true;
    }

    // If circuit is open, check if timeout has passed
    if (state === 'open') {
      if (lastFail && Date.now() - lastFail.getTime() > this.timeout) {
        // Move to half-open state to test recovery
        this.state.set(providerName, 'half-open');
        return true;
      }
      return false;
    }

    // If half-open, allow limited retries
    if (state === 'half-open') {
      return failures < this.halfOpenRetries;
    }

    return true;
  }

  /**
   * Record a successful request
   */
  recordSuccess(providerName: string): void {
    this.failures.set(providerName, 0);
    this.state.set(providerName, 'closed');
  }

  /**
   * Record a failed request
   */
  recordFailure(providerName: string): void {
    const current = this.failures.get(providerName) || 0;
    const newCount = current + 1;

    this.failures.set(providerName, newCount);
    this.lastFailure.set(providerName, new Date());

    // Open the circuit if threshold is reached
    if (newCount >= this.failureThreshold) {
      this.state.set(providerName, 'open');
    }
  }

  /**
   * Get the current state of a provider's circuit
   */
  getState(providerName: string): 'closed' | 'open' | 'half-open' {
    return this.state.get(providerName) || 'closed';
  }

  /**
   * Get the failure count for a provider
   */
  getFailureCount(providerName: string): number {
    return this.failures.get(providerName) || 0;
  }

  /**
   * Manually reset a provider's circuit
   */
  reset(providerName: string): void {
    this.failures.set(providerName, 0);
    this.state.set(providerName, 'closed');
    this.lastFailure.delete(providerName);
  }

  /**
   * Reset all circuits
   */
  resetAll(): void {
    this.failures.clear();
    this.state.clear();
    this.lastFailure.clear();
  }
}
