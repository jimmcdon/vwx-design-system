import { describe, it, expect, beforeEach } from 'vitest';
import { AIRouter } from '../../src/router/AIRouter';
import { MockProvider } from '../mocks/MockProvider';
import { BYOKConfiguration, AITask } from '../../src/config/types';

describe('AIRouter', () => {
  let router: AIRouter;
  let mockProvider: MockProvider;
  let config: BYOKConfiguration;

  beforeEach(() => {
    mockProvider = new MockProvider('mock-key');
    config = {
      providers: { openrouter: { apiKey: 'mock' } },
      routing: {
        strategy: 'cost-optimized',
        fallbackEnabled: true,
      },
      costTracking: {
        enabled: true,
        dailyLimit: 10.0,
        monthlyLimit: 100.0,
      },
    };
    router = new AIRouter(config, [mockProvider]);
  });

  describe('Routing', () => {
    it('should route task to appropriate provider', async () => {
      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      const response = await router.route(task);
      expect(response.success).toBe(true);
      expect(response.metadata.provider).toBe('mock');
    });

    it('should track cost after successful request', async () => {
      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      await router.route(task);

      const stats = router.getCostStats();
      expect(stats.daily).toBeGreaterThan(0);
    });

    it('should select cheapest provider for cost-optimized strategy', async () => {
      const expensive = new MockProvider('expensive-key', 'expensive');
      expensive.capabilities.costPerRequest = 0.10;

      const cheap = new MockProvider('cheap-key', 'cheap');
      cheap.capabilities.costPerRequest = 0.01;

      const testRouter = new AIRouter(config, [expensive, cheap]);

      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      const response = await testRouter.route(task);
      expect(response.metadata.provider).toBe('cheap');
    });

    it('should throw error when budget limit exceeded', async () => {
      const limitedConfig = {
        ...config,
        costTracking: {
          enabled: true,
          dailyLimit: 0.001, // Very low limit
        },
      };

      const limitedRouter = new AIRouter(limitedConfig, [mockProvider]);

      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      // First request should succeed
      await limitedRouter.route(task);

      // Second request should fail due to budget
      await expect(limitedRouter.route(task)).rejects.toThrow('Budget limit exceeded');
    });

    it('should handle failover when primary provider fails', async () => {
      const failing = new MockProvider('failing-key', 'failing');
      failing.setFailure(true, 'Primary failure');

      const backup = new MockProvider('backup-key', 'backup');

      const testRouter = new AIRouter(config, [failing, backup]);

      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      const response = await testRouter.route(task);
      expect(response.success).toBe(true);
      expect(response.metadata.provider).toBe('backup');
    });

    it('should throw error when all providers fail', async () => {
      mockProvider.setFailure(true, 'All providers down');

      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      await expect(router.route(task)).rejects.toThrow();
    });

    it('should respect circuit breaker', async () => {
      const singleProvider = new MockProvider('single-key', 'single');
      singleProvider.setFailure(true);

      const noFallbackConfig = {
        ...config,
        routing: {
          ...config.routing,
          fallbackEnabled: false,
        },
      };

      const singleRouter = new AIRouter(noFallbackConfig, [singleProvider]);

      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      // Fail 3 times to open circuit
      for (let i = 0; i < 3; i++) {
        try {
          await singleRouter.route(task);
        } catch (e) {
          // Expected
        }
      }

      const status = singleRouter.getCircuitBreakerStatus();
      expect(status.single.state).toBe('open');
      expect(status.single.failures).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Cost Estimation', () => {
    it('should estimate cost for a task', async () => {
      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      const estimate = await router.estimateCost(task);
      expect(estimate.min).toBeGreaterThan(0);
      expect(estimate.max).toBeGreaterThanOrEqual(estimate.min);
      expect(estimate.recommended).toBeGreaterThan(0);
    });

    it('should provide cost by provider', async () => {
      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      const estimate = await router.estimateCost(task);
      expect(estimate.byProvider).toBeDefined();
      expect(estimate.byProvider.mock).toBeDefined();
    });
  });

  describe('Statistics', () => {
    it('should track daily costs', async () => {
      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      await router.route(task);

      const stats = router.getCostStats();
      expect(stats.daily).toBeGreaterThan(0);
    });

    it('should track costs by provider', async () => {
      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      await router.route(task);

      const stats = router.getCostStats();
      expect(stats.byProvider.mock).toBeGreaterThan(0);
    });

    it('should track costs by task type', async () => {
      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      await router.route(task);

      const stats = router.getCostStats();
      expect(stats.byTaskType['prompt-generation']).toBeGreaterThan(0);
    });

    it('should show budget usage', async () => {
      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      await router.route(task);

      const stats = router.getCostStats();
      expect(stats.budgetUsage.daily).toBeDefined();
      expect(stats.budgetUsage.monthly).toBeDefined();
    });
  });

  describe('Circuit Breaker', () => {
    it('should report circuit breaker status', () => {
      const status = router.getCircuitBreakerStatus();
      expect(status.mock).toBeDefined();
      expect(status.mock.state).toBe('closed');
      expect(status.mock.failures).toBe(0);
    });

    it('should allow manual circuit reset', async () => {
      mockProvider.setFailure(true);

      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      // Trigger failures
      for (let i = 0; i < 3; i++) {
        try {
          await router.route(task);
        } catch (e) {
          // Expected
        }
      }

      // Reset circuit
      router.resetCircuitBreaker('mock');

      const status = router.getCircuitBreakerStatus();
      expect(status.mock.state).toBe('closed');
      expect(status.mock.failures).toBe(0);
    });
  });

  describe('Provider Selection', () => {
    it('should throw error when no provider supports task type', async () => {
      const limited = new MockProvider('limited-key', 'limited');
      limited.supports = () => false;

      const testRouter = new AIRouter(config, [limited]);

      const task: AITask = {
        type: 'prompt-generation',
        input: { text: 'test' },
      };

      await expect(testRouter.route(task)).rejects.toThrow(
        'No suitable provider found'
      );
    });
  });
});
