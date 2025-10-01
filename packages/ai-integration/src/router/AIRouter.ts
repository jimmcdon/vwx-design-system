import { BYOKConfiguration, AITask, AIProviderResponse } from '../config/types';
import { BaseProvider } from '../providers/BaseProvider';
import { CircuitBreaker } from './CircuitBreaker';
import { CostTracker } from './CostTracker';

/**
 * AI Router - Intelligent request routing with failover
 *
 * Features:
 * - Multiple routing strategies (cost, quality, speed)
 * - Automatic failover to backup providers
 * - Circuit breaker pattern for resilience
 * - Cost tracking and budget enforcement
 * - Provider health monitoring
 */
export class AIRouter {
  private providers: Map<string, BaseProvider>;
  private config: BYOKConfiguration;
  private costTracker: CostTracker;
  private circuitBreaker: CircuitBreaker;

  constructor(config: BYOKConfiguration, providers: BaseProvider[]) {
    this.config = config;
    this.providers = new Map(providers.map((p) => [p.name, p]));
    this.costTracker = new CostTracker(config.costTracking);
    this.circuitBreaker = new CircuitBreaker();
  }

  /**
   * Route an AI task to the appropriate provider
   * Handles provider selection, failover, and cost tracking
   */
  async route(task: AITask): Promise<AIProviderResponse> {
    // Check budget limits
    if (!this.costTracker.canProceed(task)) {
      throw new Error('Budget limit exceeded. Cannot process request.');
    }

    // Select provider based on strategy
    const provider = this.selectProvider(task);

    if (!provider) {
      throw new Error(`No suitable provider found for task type: ${task.type}`);
    }

    // Execute with failover
    return this.executeWithFailover(task, provider);
  }

  /**
   * Select the best provider for a task based on routing strategy
   */
  private selectProvider(task: AITask): BaseProvider | null {
    const strategy = this.config.routing?.strategy || 'cost-optimized';
    const availableProviders = Array.from(this.providers.values()).filter((p) =>
      p.supports(task.type)
    );

    if (availableProviders.length === 0) {
      return null;
    }

    // Filter by preferred providers if specified
    const preferredProviders = this.config.routing?.preferredProviders;
    let candidates = availableProviders;

    if (preferredProviders && preferredProviders.length > 0) {
      const preferred = availableProviders.filter((p) => preferredProviders.includes(p.name));
      if (preferred.length > 0) {
        candidates = preferred;
      }
    }

    // Apply routing strategy
    switch (strategy) {
      case 'cost-optimized':
        return this.selectCheapest(candidates, task);
      case 'quality-first':
        return this.selectHighestQuality(candidates, task);
      case 'speed-first':
        return this.selectFastest(candidates, task);
      default:
        return candidates[0];
    }
  }

  /**
   * Select the cheapest provider
   */
  private selectCheapest(providers: BaseProvider[], _task: AITask): BaseProvider {
    return providers.sort(
      (a, b) => a.capabilities.costPerRequest - b.capabilities.costPerRequest
    )[0];
  }

  /**
   * Select the highest quality provider
   * Quality ranking based on task type
   */
  private selectHighestQuality(providers: BaseProvider[], task: AITask): BaseProvider {
    const qualityRanking: Record<string, number> = {
      // Image analysis: Claude Opus > GPT-4 Vision > Gemini Vision
      'image-analysis': {
        anthropic: 10,
        openai: 8,
        google: 7,
        openrouter: 6,
        fal: 0,
      },
      // Cultural validation: Claude > GPT-4 > Others
      'cultural-validation': {
        anthropic: 10,
        openai: 8,
        openrouter: 7,
        google: 6,
        fal: 0,
      },
      // Prompt generation: GPT-4 > Claude > Others
      'prompt-generation': {
        openai: 10,
        anthropic: 9,
        openrouter: 8,
        google: 7,
        fal: 0,
      },
      // Asset generation: FAL > DALL-E
      'asset-generation': {
        fal: 10,
        openai: 8,
        openrouter: 0,
        anthropic: 0,
        google: 0,
      },
    }[task.type] || {};

    return providers.sort((a, b) => {
      const scoreA = qualityRanking[a.name] || 0;
      const scoreB = qualityRanking[b.name] || 0;
      return scoreB - scoreA;
    })[0];
  }

  /**
   * Select the fastest provider
   */
  private selectFastest(providers: BaseProvider[], _task: AITask): BaseProvider {
    return providers.sort(
      (a, b) => a.capabilities.averageResponseTime - b.capabilities.averageResponseTime
    )[0];
  }

  /**
   * Execute a task with automatic failover
   */
  private async executeWithFailover(
    task: AITask,
    primary: BaseProvider
  ): Promise<AIProviderResponse> {
    const fallbackEnabled = this.config.routing?.fallbackEnabled !== false;
    const providers = fallbackEnabled
      ? [primary, ...this.getFailoverProviders(task, primary)]
      : [primary];

    let lastError: Error | null = null;

    for (const provider of providers) {
      // Check circuit breaker
      if (!this.circuitBreaker.canAttempt(provider.name)) {
        console.warn(`Circuit breaker open for ${provider.name}, skipping`);
        continue;
      }

      try {
        const response = await provider.execute(task);

        if (response.success) {
          // Record success and cost
          this.costTracker.record({
            cost: response.metadata.cost,
            provider: response.metadata.provider,
            timestamp: response.metadata.timestamp,
            taskType: task.type,
          });
          this.circuitBreaker.recordSuccess(provider.name);
          return response;
        } else if (response.error && !response.error.retryable) {
          // Non-retryable error, don't try other providers
          this.circuitBreaker.recordFailure(provider.name);
          return response;
        }

        // Retryable error, record failure and try next provider
        this.circuitBreaker.recordFailure(provider.name);
        lastError = new Error(response.error?.message || 'Unknown error');
      } catch (error) {
        this.circuitBreaker.recordFailure(provider.name);
        lastError = error as Error;

        // If this is the last provider, throw
        if (provider === providers[providers.length - 1]) {
          throw new Error(
            `All providers failed. Last error: ${lastError.message}`
          );
        }

        // Otherwise, continue to next provider
        console.warn(`Provider ${provider.name} failed, trying next provider`);
      }
    }

    throw new Error(
      lastError ? `All providers failed: ${lastError.message}` : 'No providers available'
    );
  }

  /**
   * Get failover providers for a task
   */
  private getFailoverProviders(task: AITask, primary: BaseProvider): BaseProvider[] {
    return Array.from(this.providers.values())
      .filter((p) => p !== primary && p.supports(task.type))
      .sort((a, b) => a.capabilities.costPerRequest - b.capabilities.costPerRequest);
  }

  /**
   * Estimate the cost of executing a task across different providers
   */
  async estimateCost(task: AITask): Promise<{
    min: number;
    max: number;
    recommended: number;
    byProvider: Record<string, number>;
  }> {
    const providers = Array.from(this.providers.values()).filter((p) => p.supports(task.type));

    if (providers.length === 0) {
      throw new Error(`No providers support task type: ${task.type}`);
    }

    const costs = await Promise.all(providers.map((p) => p.estimateCost(task)));
    const byProvider: Record<string, number> = {};

    providers.forEach((p, i) => {
      byProvider[p.name] = costs[i];
    });

    return {
      min: Math.min(...costs),
      max: Math.max(...costs),
      recommended: costs.reduce((a, b) => a + b, 0) / costs.length,
      byProvider,
    };
  }

  /**
   * Get current cost tracking statistics
   */
  getCostStats() {
    return {
      daily: this.costTracker.getDailyCost(),
      monthly: this.costTracker.getMonthlyCost(),
      byProvider: this.costTracker.getCostsByProvider(),
      byTaskType: this.costTracker.getCostsByTaskType(),
      budgetUsage: this.costTracker.getBudgetUsage(),
    };
  }

  /**
   * Get circuit breaker status for all providers
   */
  getCircuitBreakerStatus() {
    const status: Record<string, { state: string; failures: number }> = {};

    for (const [name] of this.providers) {
      status[name] = {
        state: this.circuitBreaker.getState(name),
        failures: this.circuitBreaker.getFailureCount(name),
      };
    }

    return status;
  }

  /**
   * Manually reset circuit breaker for a provider
   */
  resetCircuitBreaker(providerName?: string) {
    if (providerName) {
      this.circuitBreaker.reset(providerName);
    } else {
      this.circuitBreaker.resetAll();
    }
  }
}
