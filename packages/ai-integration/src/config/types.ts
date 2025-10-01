/**
 * BYOK (Bring Your Own Key) Configuration
 *
 * Phase 1: All providers use mock responses
 * Phase 3: API keys will be used for real integration
 */
export interface BYOKConfiguration {
  providers: {
    openrouter?: {
      apiKey: string;
      baseUrl?: string;
    };
    fal?: {
      apiKey: string;
    };
    openai?: {
      apiKey: string;
      organization?: string;
    };
    anthropic?: {
      apiKey: string;
    };
    google?: {
      apiKey: string;
    };
  };
  vwxHostedService?: {
    apiKey: string;
    tier: 'starter' | 'pro' | 'business';
  };
  routing?: {
    strategy: 'cost-optimized' | 'quality-first' | 'speed-first';
    preferredProviders?: string[];
    budgetLimit?: number;
    fallbackEnabled?: boolean;
  };
  costTracking?: {
    enabled: boolean;
    dailyLimit?: number;
    monthlyLimit?: number;
    alertThreshold?: number;
  };
}

export type AITaskType =
  | 'image-analysis'
  | 'prompt-generation'
  | 'cultural-validation'
  | 'asset-generation';

export interface AITask {
  type: AITaskType;
  input: {
    text?: string;
    image?: File | string;
    context?: DesignSystemContext;
  };
  options?: {
    temperature?: number;
    maxTokens?: number;
    variations?: number;
    size?: string;
    quality?: string;
    style?: string;
  };
}

export interface DesignSystemContext {
  theme?: 'bw' | 'color' | 'patina';
  vehicle?: 'beetle' | 'bus' | 'karmann-ghia' | 'type-3';
  era?: '50s' | '60s' | '70s' | '80s' | '1950s' | '1960s' | '1970s';
  section?: 'components' | 'patterns' | 'tokens' | 'guidelines' | string;
}

export interface AIProviderResponse {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
  metadata: {
    provider: string;
    model: string;
    tokensUsed?: number;
    cost: number;
    responseTime?: number;
    timestamp: number;
  };
}

export interface ProviderCapabilities {
  supportsImageAnalysis: boolean;
  supportsTextGeneration: boolean;
  supportsImageGeneration: boolean;
  maxTokens: number;
  costPerRequest: number;
  averageResponseTime: number;
}

export interface CostRecord {
  timestamp: number;
  cost: number;
  provider: string;
  taskType?: AITaskType;
}

export interface UsageReport {
  period: 'daily' | 'monthly';
  totalCost: number;
  requestCount: number;
  byProvider: Record<string, { cost: number; requests: number }>;
  byTaskType: Record<AITaskType, { cost: number; requests: number }>;
}
