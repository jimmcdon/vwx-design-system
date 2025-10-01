import { BaseProvider } from './BaseProvider';
import { AITask, AIProviderResponse, AITaskType, ProviderCapabilities } from '../config/types';
import { fal } from '@fal-ai/client';

/**
 * FAL.ai Provider - Fast image generation
 *
 * Capabilities:
 * - High-quality image generation (FLUX Pro, Stable Diffusion XL)
 * - Fast inference times (2-3 seconds)
 * - Multiple image variations
 *
 * Phase 3: Live API integration
 */
export class FALProvider extends BaseProvider {
  public readonly name = 'fal';
  public readonly capabilities: ProviderCapabilities = {
    supportsImageAnalysis: false,
    supportsTextGeneration: false,
    supportsImageGeneration: true,
    maxTokens: 0, // Not applicable for image generation
    costPerRequest: 0.05,
    averageResponseTime: 3000,
  };

  constructor(apiKey: string) {
    super(apiKey);
    fal.config({ credentials: apiKey });
  }

  async execute(task: AITask): Promise<AIProviderResponse> {
    const model = this.selectModel(task.type);

    try {
      return await this.generateImage(task, model);
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        data: null,
        error: {
          message: err.message,
          code: 'FAL_ERROR',
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

  private async generateImage(task: AITask, model: string): Promise<AIProviderResponse> {
    const size = task.options?.size || '1024x1024';
    const [width, height] = size.split('x').map(Number);

    const result = await fal.subscribe(model, {
      input: {
        prompt: task.input.text || '',
        image_size: {
          width: width || 1024,
          height: height || 1024,
        },
        num_images: 1,
        enable_safety_checker: true,
      },
      logs: false,
    });

    const cost = this.calculateImageCost(model);

    return {
      success: true,
      data: {
        url: result.data.images?.[0]?.url || '',
        width: width || 1024,
        height: height || 1024,
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

  private calculateImageCost(model: string): number {
    // FAL.ai pricing
    if (model.includes('flux-pro')) return 0.055;
    if (model.includes('flux-dev')) return 0.025;
    if (model.includes('flux-schnell')) return 0.003;
    return 0.05; // SDXL default
  }

  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes('queue') ||
      message.includes('timeout') ||
      message.includes('rate limit') ||
      message.includes('503') ||
      message.includes('500')
    );
  }

  async estimateCost(task: AITask): Promise<number> {
    const baseCost = this.capabilities.costPerRequest;
    const variations = task.options?.variations || 1;

    return baseCost * variations;
  }

  supports(taskType: AITaskType): boolean {
    return taskType === 'asset-generation';
  }

  async healthCheck(): Promise<boolean> {
    // TODO (Phase 3): Implement actual health check
    // const response = await fetch('https://fal.run/health');
    // return response.ok;

    // Phase 1: Always return healthy
    return true;
  }

  private selectModel(taskType: AITaskType): string {
    switch (taskType) {
      case 'asset-generation':
        return 'fal-ai/flux-pro';
      default:
        return 'fal-ai/stable-diffusion-xl';
    }
  }
}
