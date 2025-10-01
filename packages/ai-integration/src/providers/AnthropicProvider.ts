import { BaseProvider } from './BaseProvider';
import { AITask, AIProviderResponse, AITaskType, ProviderCapabilities } from '../config/types';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Anthropic Provider - Claude models
 *
 * Capabilities:
 * - Text generation (Claude 3.5 Sonnet, Claude 3 Opus, Haiku)
 * - Image analysis (Claude 3 Vision)
 * - Long context windows (200K tokens)
 * - Strong reasoning and cultural analysis
 *
 * Phase 3: Live API integration
 */
export class AnthropicProvider extends BaseProvider {
  public readonly name = 'anthropic';
  public readonly capabilities: ProviderCapabilities = {
    supportsImageAnalysis: true,
    supportsTextGeneration: true,
    supportsImageGeneration: false,
    maxTokens: 200000, // Claude 3.5 supports 200K context
    costPerRequest: 0.025,
    averageResponseTime: 1800,
  };

  private client: Anthropic;

  constructor(apiKey: string) {
    super(apiKey);
    this.client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for Vite browser builds
    });
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
          code: 'ANTHROPIC_ERROR',
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
    const message = await this.client.messages.create({
      model,
      max_tokens: Math.min(task.options?.maxTokens || 4096, 4096), // Claude API max output is 4096
      messages: [
        {
          role: 'user',
          content: task.input.text || '',
        },
      ],
      temperature: task.options?.temperature || 0.7,
    });

    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;
    const cost = this.calculateCost(message.usage.input_tokens, message.usage.output_tokens, model);

    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n');

    return {
      success: true,
      data: responseText,
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
    const image = task.input.image || '';

    // Ensure image is a string (URL or data URL)
    const imageUrl = typeof image === 'string' ? image : '';

    // Convert data URL to base64 if needed
    let imageSource: any;
    if (imageUrl.startsWith('data:')) {
      // Extract base64 from data URL
      const matches = imageUrl.match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/);
      if (matches) {
        imageSource = {
          type: 'base64',
          media_type: `image/${matches[1]}`,
          data: matches[2],
        };
      }
    } else {
      // External URL
      imageSource = {
        type: 'url',
        url: imageUrl,
      };
    }

    const message = await this.client.messages.create({
      model,
      max_tokens: task.options?.maxTokens || 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: imageSource,
            },
            {
              type: 'text',
              text: task.input.text || 'Analyze this image in detail.',
            },
          ],
        },
      ],
    });

    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;
    const cost = this.calculateCost(message.usage.input_tokens, message.usage.output_tokens, model);

    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n');

    return {
      success: true,
      data: responseText,
      metadata: {
        provider: this.name,
        model,
        tokensUsed,
        cost,
        timestamp: Date.now(),
      },
    };
  }

  private calculateCost(inputTokens: number, outputTokens: number, model: string): number {
    // Claude 3.5 Sonnet pricing
    if (model.includes('sonnet')) {
      return inputTokens * 0.000003 + outputTokens * 0.000015;
    }
    // Claude 3 Opus pricing
    if (model.includes('opus')) {
      return inputTokens * 0.000015 + outputTokens * 0.000075;
    }
    // Claude 3 Haiku pricing
    if (model.includes('haiku')) {
      return inputTokens * 0.00000025 + outputTokens * 0.00000125;
    }
    // Default to Sonnet pricing
    return inputTokens * 0.000003 + outputTokens * 0.000015;
  }

  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes('rate_limit') ||
      message.includes('overloaded') ||
      message.includes('timeout') ||
      message.includes('503') ||
      message.includes('500')
    );
  }

  async estimateCost(task: AITask): Promise<number> {
    const model = this.selectModel(task.type);
    let baseCost = this.capabilities.costPerRequest;

    // Adjust cost based on model tier
    if (model.includes('opus')) {
      baseCost *= 1.8;
    } else if (model.includes('haiku')) {
      baseCost *= 0.5;
    }

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
    // Could ping a lightweight endpoint or check API status
    // const response = await fetch('https://status.anthropic.com/api/v2/status.json');
    // return response.ok;

    // Phase 1: Always return healthy
    return true;
  }

  private selectModel(taskType: AITaskType): string {
    switch (taskType) {
      case 'cultural-validation':
        return 'claude-3-opus-20240229'; // Use most capable for validation
      case 'image-analysis':
        return 'claude-3-opus-20240229'; // Opus has best vision capabilities
      case 'prompt-generation':
        return 'claude-3-sonnet-20240229'; // Sonnet is good balance
      default:
        return 'claude-3-haiku-20240307'; // Haiku for speed/cost
    }
  }
}
