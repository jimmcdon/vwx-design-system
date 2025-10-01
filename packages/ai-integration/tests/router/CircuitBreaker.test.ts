import { describe, it, expect, beforeEach } from 'vitest';
import { CircuitBreaker } from '../../src/router/CircuitBreaker';

describe('CircuitBreaker', () => {
  let breaker: CircuitBreaker;

  beforeEach(() => {
    breaker = new CircuitBreaker();
  });

  it('should allow requests when circuit is closed', () => {
    expect(breaker.canAttempt('test-provider')).toBe(true);
  });

  it('should open circuit after threshold failures', () => {
    for (let i = 0; i < 3; i++) {
      breaker.recordFailure('test-provider');
    }

    expect(breaker.getState('test-provider')).toBe('open');
    expect(breaker.canAttempt('test-provider')).toBe(false);
  });

  it('should close circuit on success', () => {
    breaker.recordFailure('test-provider');
    breaker.recordFailure('test-provider');
    breaker.recordSuccess('test-provider');

    expect(breaker.getState('test-provider')).toBe('closed');
    expect(breaker.getFailureCount('test-provider')).toBe(0);
  });

  it('should track failure count', () => {
    breaker.recordFailure('test-provider');
    breaker.recordFailure('test-provider');

    expect(breaker.getFailureCount('test-provider')).toBe(2);
  });

  it('should reset circuit manually', () => {
    breaker.recordFailure('test-provider');
    breaker.recordFailure('test-provider');
    breaker.recordFailure('test-provider');

    expect(breaker.getState('test-provider')).toBe('open');

    breaker.reset('test-provider');

    expect(breaker.getState('test-provider')).toBe('closed');
    expect(breaker.getFailureCount('test-provider')).toBe(0);
  });

  it('should reset all circuits', () => {
    breaker.recordFailure('provider-1');
    breaker.recordFailure('provider-2');

    breaker.resetAll();

    expect(breaker.getFailureCount('provider-1')).toBe(0);
    expect(breaker.getFailureCount('provider-2')).toBe(0);
  });

  it('should handle multiple providers independently', () => {
    breaker.recordFailure('provider-1');
    breaker.recordFailure('provider-1');
    breaker.recordFailure('provider-1');

    breaker.recordFailure('provider-2');

    expect(breaker.getState('provider-1')).toBe('open');
    expect(breaker.getState('provider-2')).toBe('closed');
  });

  it('should transition to half-open after timeout', (done) => {
    // Record failures to open circuit
    for (let i = 0; i < 3; i++) {
      breaker.recordFailure('test-provider');
    }

    expect(breaker.getState('test-provider')).toBe('open');

    // Wait for timeout (mocked by setting a short timeout)
    // In real implementation, would wait 60 seconds
    // For testing, we'll manually verify the state transition logic
    setTimeout(() => {
      // Circuit should allow attempt after timeout
      expect(breaker.canAttempt('test-provider')).toBe(true);
      done();
    }, 100);
  }, 1000);
});
