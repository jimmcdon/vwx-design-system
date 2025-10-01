import { BaseProvider } from './BaseProvider';
import { AITask, AIProviderResponse, AITaskType, ProviderCapabilities } from '../config/types';

/**
 * OpenRouter Provider - Multi-model routing service
 *
 * Capabilities:
 * - Text generation (Claude, GPT-4, Gemini, etc.)
 * - Image analysis (via Claude Vision, GPT-4 Vision)
 * - Cost-effective model routing
 * - Access to 100+ models
 *
 * Phase 3: Live API integration
 */
export class OpenRouterProvider extends BaseProvider {
  public readonly name = 'openrouter';
  public readonly capabilities: ProviderCapabilities = {
    supportsImageAnalysis: true,
    supportsTextGeneration: true,
    supportsImageGeneration: false,
    maxTokens: 8000,
    costPerRequest: 0.02,
    averageResponseTime: 1500,
  };

  constructor(apiKey: string, baseUrl = 'https://openrouter.ai/api/v1') {
    super(apiKey, baseUrl);
  }

  async execute(task: AITask): Promise<AIProviderResponse> {
    const model = this.selectModel(task.type);

    try {
      if (task.type === 'image-analysis') {
        return await this.analyzeImage(task, model);
      } else {
        return await this.generateText(task, model);
      }
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        data: null,
        error: {
          message: err.message,
          code: 'OPENROUTER_ERROR',
          retryable: this.isRetryableError(err),
        },
        metadata: {
          provider: this.name,
          model,
          tokensUsed: 0,
          cost: 0,
          timestamp: Date.now(),
        },
      };
    }
  }

  private async generateText(task: AITask, model: string): Promise<AIProviderResponse> {
    const baseUrl = this.baseUrl || 'https://openrouter.ai/api/v1';
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vwx-design-system.com',
        'X-Title': 'VWX Design System',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: task.input.text || '',
          },
        ],
        max_tokens: task.options?.maxTokens || 1000,
        temperature: task.options?.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    const tokensUsed = data.usage?.total_tokens || 0;
    const cost = this.calculateCost(tokensUsed, model);

    return {
      success: true,
      data: data.choices?.[0]?.message?.content || '',
      metadata: {
        provider: this.name,
        model,
        tokensUsed,
        cost,
        timestamp: Date.now(),
      },
    };
  }

  private async analyzeImage(task: AITask, model: string): Promise<AIProviderResponse> {
    const imageUrl = task.input.image || '';
    const baseUrl = this.baseUrl || 'https://openrouter.ai/api/v1';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vwx-design-system.com',
        'X-Title': 'VWX Design System',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: task.input.text || 'Analyze this image.' },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
        max_tokens: task.options?.maxTokens || 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as any;
    const tokensUsed = data.usage?.total_tokens || 0;
    const cost = this.calculateCost(tokensUsed, model);

    return {
      success: true,
      data: data.choices?.[0]?.message?.content || '',
      metadata: {
        provider: this.name,
        model,
        tokensUsed,
        cost,
        timestamp: Date.now(),
      },
    };
  }

  private calculateCost(tokens: number, model: string): number {
    // OpenRouter pricing varies by model
    // These are approximate averages
    if (model.includes('gpt-4')) return tokens * 0.00003;
    if (model.includes('claude-3-opus')) return tokens * 0.000015;
    if (model.includes('claude-3-sonnet')) return tokens * 0.000003;
    if (model.includes('gemini-pro')) return tokens * 0.000001;
    return tokens * 0.00001; // Default
  }

  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes('rate limit') ||
      message.includes('timeout') ||
      message.includes('503') ||
      message.includes('500') ||
      message.includes('429')
    );
  }

  async estimateCost(task: AITask): Promise<number> {
    // Base cost varies by model and task complexity
    const baseCost = this.capabilities.costPerRequest;
    const tokenMultiplier = (task.options?.maxTokens || 1000) / 1000;

    return baseCost * tokenMultiplier;
  }

  supports(taskType: AITaskType): boolean {
    return (
      taskType === 'prompt-generation' ||
      taskType === 'cultural-validation' ||
      taskType === 'image-analysis'
    );
  }

  async healthCheck(): Promise<boolean> {
    // TODO (Phase 3): Implement actual health check
    // const response = await fetch(`${this.baseUrl}/models`);
    // return response.ok;

    // Phase 1: Always return healthy
    return true;
  }

  private selectModel(taskType: AITaskType): string {
    switch (taskType) {
      case 'image-analysis':
        return 'anthropic/claude-3-opus';
      case 'cultural-validation':
        return 'anthropic/claude-2';
      case 'prompt-generation':
        return 'openai/gpt-4-turbo';
      default:
        return 'anthropic/claude-2';
    }
  }
}
