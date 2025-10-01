import { BaseProvider } from './BaseProvider';
import { AITask, AIProviderResponse, AITaskType, ProviderCapabilities } from '../config/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Google AI Provider - Gemini models
 *
 * Capabilities:
 * - Text generation (Gemini 2.0 Flash, Gemini 1.5 Pro)
 * - Image analysis (Gemini Pro Vision)
 * - Multimodal understanding
 * - Cost-effective for high volume
 *
 * Phase 3: Live API integration
 */
export class GoogleAIProvider extends BaseProvider {
  public readonly name = 'google';
  public readonly capabilities: ProviderCapabilities = {
    supportsImageAnalysis: true,
    supportsTextGeneration: true,
    supportsImageGeneration: false,
    maxTokens: 8192,
    costPerRequest: 0.015,
    averageResponseTime: 1200,
  };

  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    super(apiKey);
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async execute(task: AITask): Promise<AIProviderResponse> {
    const modelName = this.selectModel(task.type);

    try {
      if (task.type === 'image-analysis') {
        return await this.analyzeImage(task, modelName);
      } else {
        return await this.generateText(task, modelName);
      }
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        data: null,
        error: {
          message: err.message,
          code: 'GOOGLE_AI_ERROR',
          retryable: this.isRetryableError(err),
        },
        metadata: {
          provider: this.name,
          model: modelName,
          tokensUsed: 0,
          cost: 0,
          timestamp: Date.now(),
        },
      };
    }
  }

  private async generateText(task: AITask, modelName: string): Promise<AIProviderResponse> {
    const model = this.client.getGenerativeModel({ model: modelName });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: task.input.text || '' }] }],
      generationConfig: {
        temperature: task.options?.temperature || 0.7,
        maxOutputTokens: task.options?.maxTokens || 2048,
      },
    });

    const response = result.response;
    const text = response.text();
    const tokensUsed = (response.usageMetadata?.totalTokenCount || 0);
    const cost = this.calculateCost(tokensUsed, modelName);

    return {
      success: true,
      data: text,
      metadata: {
        provider: this.name,
        model: modelName,
        tokensUsed,
        cost,
        timestamp: Date.now(),
      },
    };
  }

  private async analyzeImage(task: AITask, modelName: string): Promise<AIProviderResponse> {
    const model = this.client.getGenerativeModel({ model: modelName });
    const image = task.input.image || '';

    // Ensure image is a string (URL or data URL)
    const imageUrl = typeof image === 'string' ? image : '';

    // Convert data URL to inline data if needed
    let imagePart: any;
    if (imageUrl.startsWith('data:')) {
      const matches = imageUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      if (matches) {
        imagePart = {
          inlineData: {
            mimeType: `image/${matches[1]}`,
            data: matches[2],
          },
        };
      }
    } else {
      // For external URLs, we need to fetch and convert to base64
      // This is a limitation of Gemini API (doesn't support URLs directly)
      throw new Error('Google AI requires base64-encoded images. Please convert URL to base64 first.');
    }

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            imagePart,
            { text: task.input.text || 'Analyze this image in detail.' },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: task.options?.maxTokens || 2048,
      },
    });

    const response = result.response;
    const text = response.text();
    const tokensUsed = response.usageMetadata?.totalTokenCount || 0;
    const cost = this.calculateCost(tokensUsed, modelName);

    return {
      success: true,
      data: text,
      metadata: {
        provider: this.name,
        model: modelName,
        tokensUsed,
        cost,
        timestamp: Date.now(),
      },
    };
  }

  private calculateCost(tokens: number, model: string): number {
    // Gemini pricing (approximate, as of 2025)
    if (model.includes('pro')) {
      return tokens * 0.000002; // Gemini Pro
    }
    return tokens * 0.0000005; // Gemini Flash
  }

  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    return (
      message.includes('quota') ||
      message.includes('rate limit') ||
      message.includes('timeout') ||
      message.includes('503') ||
      message.includes('500')
    );
  }

  async estimateCost(task: AITask): Promise<number> {
    const model = this.selectModel(task.type);
    let baseCost = this.capabilities.costPerRequest;

    // Gemini Pro Vision is more expensive
    if (model.includes('vision')) {
      baseCost *= 1.5;
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
    // const response = await fetch(
    //   `https://generativelanguage.googleapis.com/v1/models?key=${this.apiKey}`
    // );
    // return response.ok;

    // Phase 1: Always return healthy
    return true;
  }

  private selectModel(taskType: AITaskType): string {
    switch (taskType) {
      case 'image-analysis':
        return 'gemini-pro-vision';
      case 'prompt-generation':
      case 'cultural-validation':
        return 'gemini-pro';
      default:
        return 'gemini-pro';
    }
  }
}
