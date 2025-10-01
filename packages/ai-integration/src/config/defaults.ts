import { BYOKConfiguration } from './types';

export const DEFAULT_CONFIG: Partial<BYOKConfiguration> = {
  routing: {
    strategy: 'cost-optimized',
    fallbackEnabled: true,
  },
  costTracking: {
    enabled: true,
    alertThreshold: 0.8,
  },
};

export const MOCK_API_KEY = 'mock-api-key-phase-1';

/**
 * Creates a mock configuration for Phase 1 development and testing
 */
export function createMockConfig(): BYOKConfiguration {
  return {
    providers: {
      openrouter: {
        apiKey: MOCK_API_KEY,
        baseUrl: 'https://openrouter.ai/api/v1',
      },
      openai: {
        apiKey: MOCK_API_KEY,
      },
      anthropic: {
        apiKey: MOCK_API_KEY,
      },
      google: {
        apiKey: MOCK_API_KEY,
      },
      fal: {
        apiKey: MOCK_API_KEY,
      },
    },
    routing: {
      strategy: 'cost-optimized',
      fallbackEnabled: true,
    },
    costTracking: {
      enabled: true,
      dailyLimit: 10.0,
      monthlyLimit: 100.0,
      alertThreshold: 0.8,
    },
  };
}
