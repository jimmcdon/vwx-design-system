import { AITask, AIProviderResponse, AITaskType, ProviderCapabilities } from '../config/types';

/**
 * Base abstract class for all AI providers
 *
 * Phase 1: All implementations use mock responses
 * Phase 3: Subclasses will implement actual API calls
 */
export abstract class BaseProvider {
  protected apiKey: string;
  protected baseUrl?: string;
  public abstract readonly name: string;
  public abstract readonly capabilities: ProviderCapabilities;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Execute an AI task
   * TODO (Phase 3): Implement actual API calls
   */
  abstract execute(task: AITask): Promise<AIProviderResponse>;

  /**
   * Estimate the cost of executing a task
   */
  abstract estimateCost(task: AITask): Promise<number>;

  /**
   * Check if this provider supports a specific task type
   */
  abstract supports(taskType: AITaskType): boolean;

  /**
   * Perform a health check on the provider
   * TODO (Phase 3): Implement actual API health checks
   */
  abstract healthCheck(): Promise<boolean>;

  /**
   * Make an HTTP request to the provider's API
   * TODO (Phase 3): Replace with actual HTTP client implementation
   *
   * @param endpoint - The API endpoint
   * @param payload - The request payload
   * @returns Mock response for Phase 1
   */
  protected async makeRequest(endpoint: string, payload: any): Promise<any> {
    // Phase 1: Mock implementation
    // Phase 3: Replace with actual HTTP client (e.g., fetch, axios)
    return {
      success: true,
      data: { mock: true, endpoint, payload },
      timestamp: new Date(),
    };
  }

  /**
   * Generate a mock response for Phase 1 development
   *
   * @param task - The AI task
   * @param model - The model identifier
   * @returns A mock AIProviderResponse
   */
  protected createMockResponse(task: AITask, model: string): AIProviderResponse {
    const startTime = Date.now();

    let mockData: any;
    switch (task.type) {
      case 'image-analysis':
        mockData = {
          analysis: 'Mock image analysis result',
          features: ['vintage', 'automotive', 'classic'],
          culturalContext: 'VW heritage aesthetic',
          recommendations: ['Use warm tones', 'Emphasize craftsmanship'],
        };
        break;
      case 'prompt-generation':
        mockData = {
          prompts: [
            'A vintage VW Beetle in the style of 1960s advertising',
            'Classic air-cooled VW Bus with patina finish',
            'Karmann Ghia silhouette with retro design elements',
          ],
          variations: 3,
        };
        break;
      case 'cultural-validation':
        mockData = {
          valid: true,
          score: 0.92,
          feedback: 'Aligns well with VW heritage values',
          suggestions: ['Consider adding more era-specific details'],
        };
        break;
      case 'asset-generation':
        mockData = {
          assetUrl: 'mock://generated-asset.png',
          format: 'png',
          dimensions: { width: 1024, height: 1024 },
        };
        break;
      default:
        mockData = { result: 'Mock response' };
    }

    return {
      success: true,
      data: mockData,
      metadata: {
        provider: this.name,
        model,
        cost: this.capabilities.costPerRequest,
        responseTime: Date.now() - startTime,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Create an error response
   */
  protected createErrorResponse(
    code: string,
    message: string,
    retryable: boolean = false
  ): AIProviderResponse {
    return {
      success: false,
      error: {
        code,
        message,
        retryable,
      },
      metadata: {
        provider: this.name,
        model: 'error',
        cost: 0,
        responseTime: 0,
        timestamp: Date.now(),
      },
    };
  }
}
