import { BaseProvider } from '../../src/providers/BaseProvider';
import { AITask, AIProviderResponse, AITaskType, ProviderCapabilities } from '../../src/config/types';

/**
 * Mock Provider for testing
 */
export class MockProvider extends BaseProvider {
  public name: string;
  public readonly capabilities: ProviderCapabilities = {
    supportsImageAnalysis: true,
    supportsTextGeneration: true,
    supportsImageGeneration: true,
    maxTokens: 1000,
    costPerRequest: 0.01,
    averageResponseTime: 100,
  };

  private shouldFail = false;
  private failureMessage = 'Mock failure';

  constructor(apiKey: string, name: string = 'mock') {
    super(apiKey);
    this.name = name;
  }

  setFailure(shouldFail: boolean, message?: string) {
    this.shouldFail = shouldFail;
    if (message) {
      this.failureMessage = message;
    }
  }

  async execute(task: AITask): Promise<AIProviderResponse> {
    if (this.shouldFail) {
      return this.createErrorResponse('MOCK_ERROR', this.failureMessage, true);
    }

    return this.createMockResponse(task, 'mock-model');
  }

  async estimateCost(task: AITask): Promise<number> {
    return this.capabilities.costPerRequest;
  }

  supports(taskType: AITaskType): boolean {
    return true;
  }

  async healthCheck(): Promise<boolean> {
    return !this.shouldFail;
  }
}
