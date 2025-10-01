import { BaseProvider } from './BaseProvider';
import { AITask, AIProviderResponse, AITaskType, ProviderCapabilities } from '../config/types';
import OpenAI from 'openai';

/**
 * OpenAI Provider - GPT-4 and DALL-E
 *
 * Capabilities:
 * - Text generation (GPT-4, GPT-4 Turbo)
 * - Image analysis (GPT-4 Vision)
 * - Image generation (DALL-E 3)
 *
 * Phase 3: Live API integration
 */
export class OpenAIProvider extends BaseProvider {
  public readonly name = 'openai';
  public readonly capabilities: ProviderCapabilities = {
    supportsImageAnalysis: true,
    supportsTextGeneration: true,
    supportsImageGeneration: true,
    maxTokens: 4096,
    costPerRequest: 0.03,
    averageResponseTime: 2000,
  };

  private client: OpenAI;

  constructor(apiKey: string, organization?: string) {
    super(apiKey);
    this.client = new OpenAI({
      apiKey,
      organization,
      dangerouslyAllowBrowser: true, // Required for Vite browser builds
    });
  }

  async execute(task: AITask): Promise<AIProviderResponse> {
    const model = this.selectModel(task.type);

    try {
      if (task.type === 'asset-generation') {
        return await this.generateImage(task, model);
      } else if (task.type === 'image-analysis') {
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
          code: 'OPENAI_ERROR',
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
    const completion = await this.client.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: task.input.text || '',
        },
      ],
      max_tokens: task.options?.maxTokens || 1000,
      temperature: task.options?.temperature || 0.7,
    });

    const tokensUsed = completion.usage?.total_tokens || 0;
    const cost = this.calculateCost(tokensUsed, model);

    return {
      success: true,
      data: completion.choices[0]?.message?.content || '',
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

    const completion = await this.client.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: task.input.text || 'Analyze this image.' },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'auto',
              },
            } as any,
          ],
        },
      ],
      max_tokens: task.options?.maxTokens || 1000,
    });

    const tokensUsed = completion.usage?.total_tokens || 0;
    const cost = this.calculateCost(tokensUsed, model);

    return {
      success: true,
      data: completion.choices[0]?.message?.content || '',
      metadata: {
        provider: this.name,
        model,
        tokensUsed,
        cost,
        timestamp: Date.now(),
      },
    };
  }

  private async generateImage(task: AITask, model: string): Promise<AIProviderResponse> {
    const size = (task.options?.size || '1024x1024') as '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
    const quality = (task.options?.quality || 'standard') as 'standard' | 'hd';
    const style = (task.options?.style || 'natural') as 'vivid' | 'natural';

    const response = await this.client.images.generate({
      model,
      prompt: task.input.text || '',
      n: 1,
      size,
      quality,
      style,
    });

    const cost = this.calculateImageCost(size, quality);

    return {
      success: true,
      data: {
        url: response.data?.[0]?.url || '',
        revised_prompt: response.data?.[0]?.revised_prompt,
      },
      metadata: {
        provider: this.name,
        model,
        tokensUsed: 0,
        cost,
        timestamp: Date.now(),
      },
    };
  }

  private calculateCost(tokens: number, model: string): number {
    // GPT-4 pricing (approximate)
    const pricePerToken = model.includes('gpt-4-vision') || model.includes('gpt-4-turbo') ? 0.00003 : 0.00001;
    return tokens * pricePerToken;
  }

  private calculateImageCost(size: string, quality: string): number {
    // DALL-E 3 pricing
    if (quality === 'hd') {
      if (size === '1024x1024') return 0.08;
      if (size === '1792x1024' || size === '1024x1792') return 0.12;
    }
    // Standard quality
    if (size === '1024x1024') return 0.04;
    if (size === '1792x1024' || size === '1024x1792') return 0.08;
    return 0.02; // Smaller sizes
  }

  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes('rate limit') ||
      message.includes('timeout') ||
      message.includes('503') ||
      message.includes('500')
    );
  }

  async estimateCost(task: AITask): Promise<number> {
    const model = this.selectModel(task.type);
    let baseCost = this.capabilities.costPerRequest;

    // Adjust cost based on model
    if (model.includes('gpt-4')) {
      baseCost *= 1.5;
    }
    if (model.includes('dalle')) {
      baseCost *= 2.0;
    }

    const tokenMultiplier = (task.options?.maxTokens || 1000) / 1000;
    return baseCost * tokenMultiplier;
  }

  supports(taskType: AITaskType): boolean {
    return (
      taskType === 'prompt-generation' ||
      taskType === 'cultural-validation' ||
      taskType === 'image-analysis' ||
      taskType === 'asset-generation'
    );
  }

  async healthCheck(): Promise<boolean> {
    // TODO (Phase 3): Implement actual health check
    // const response = await fetch('https://api.openai.com/v1/models');
    // return response.ok;

    // Phase 1: Always return healthy
    return true;
  }

  private selectModel(taskType: AITaskType): string {
    switch (taskType) {
      case 'image-analysis':
        return 'gpt-4-vision-preview';
      case 'asset-generation':
        return 'dall-e-3';
      case 'prompt-generation':
      case 'cultural-validation':
        return 'gpt-4-turbo';
      default:
        return 'gpt-4';
    }
  }
}
