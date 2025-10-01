import { describe, it, expect, beforeEach } from 'vitest';
import { OpenRouterProvider } from '../../src/providers/OpenRouterProvider';
import { AITask } from '../../src/config/types';

describe('OpenRouterProvider', () => {
  let provider: OpenRouterProvider;

  beforeEach(() => {
    provider = new OpenRouterProvider('mock-api-key');
  });

  it('should initialize with correct name', () => {
    expect(provider.name).toBe('openrouter');
  });

  it('should have correct capabilities', () => {
    expect(provider.capabilities.supportsImageAnalysis).toBe(true);
    expect(provider.capabilities.supportsTextGeneration).toBe(true);
    expect(provider.capabilities.supportsImageGeneration).toBe(false);
  });

  it('should support prompt generation', () => {
    expect(provider.supports('prompt-generation')).toBe(true);
  });

  it('should support cultural validation', () => {
    expect(provider.supports('cultural-validation')).toBe(true);
  });

  it('should support image analysis', () => {
    expect(provider.supports('image-analysis')).toBe(true);
  });

  it('should not support asset generation', () => {
    expect(provider.supports('asset-generation')).toBe(false);
  });

  it('should execute prompt generation task', async () => {
    const task: AITask = {
      type: 'prompt-generation',
      input: { text: 'Generate VW-themed prompts' },
    };

    const response = await provider.execute(task);
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.metadata.provider).toBe('openrouter');
  });

  it('should execute cultural validation task', async () => {
    const task: AITask = {
      type: 'cultural-validation',
      input: {
        text: 'Validate VW heritage alignment',
        context: {
          theme: 'bw',
          vehicle: 'beetle',
          section: 'components',
        },
      },
    };

    const response = await provider.execute(task);
    expect(response.success).toBe(true);
    expect(response.data.valid).toBeDefined();
    expect(response.data.score).toBeDefined();
  });

  it('should estimate cost correctly', async () => {
    const task: AITask = {
      type: 'prompt-generation',
      input: { text: 'test' },
      options: { maxTokens: 2000 },
    };

    const cost = await provider.estimateCost(task);
    expect(cost).toBeGreaterThan(0);
  });

  it('should pass health check', async () => {
    const healthy = await provider.healthCheck();
    expect(healthy).toBe(true);
  });

  it('should include response time in metadata', async () => {
    const task: AITask = {
      type: 'prompt-generation',
      input: { text: 'test' },
    };

    const response = await provider.execute(task);
    expect(response.metadata.responseTime).toBeGreaterThanOrEqual(0);
  });

  it('should include timestamp in metadata', async () => {
    const task: AITask = {
      type: 'prompt-generation',
      input: { text: 'test' },
    };

    const response = await provider.execute(task);
    expect(response.metadata.timestamp).toBeInstanceOf(Date);
  });
});
