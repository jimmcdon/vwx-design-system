/**
 * Mock AI Providers for Testing
 * Mock implementations of AI providers for testing AI-enhanced components
 */

export interface MockAIProvider {
  name: string;
  generateSuggestion: (input: string) => Promise<string>;
  analyzeContent: (content: string) => Promise<Record<string, unknown>>;
}

/**
 * Mock OpenAI Provider
 */
export class MockOpenAIProvider implements MockAIProvider {
  name = 'OpenAI';

  async generateSuggestion(input: string): Promise<string> {
    // Simulate API delay
    await this.delay(100);
    return `Mock AI suggestion for: ${input}`;
  }

  async analyzeContent(content: string): Promise<Record<string, unknown>> {
    await this.delay(100);
    return {
      sentiment: 'positive',
      keywords: ['test', 'mock', 'ai'],
      summary: `Analysis of: ${content.substring(0, 50)}...`,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Mock Anthropic Provider
 */
export class MockAnthropicProvider implements MockAIProvider {
  name = 'Anthropic';

  async generateSuggestion(input: string): Promise<string> {
    await this.delay(100);
    return `Claude suggests: ${input}`;
  }

  async analyzeContent(content: string): Promise<Record<string, unknown>> {
    await this.delay(100);
    return {
      analysis: 'comprehensive',
      insights: ['insight1', 'insight2'],
      recommendations: ['rec1', 'rec2'],
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Mock Provider Factory
 */
export function createMockProvider(type: 'openai' | 'anthropic'): MockAIProvider {
  switch (type) {
    case 'openai':
      return new MockOpenAIProvider();
    case 'anthropic':
      return new MockAnthropicProvider();
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}

/**
 * Mock Provider with Error Simulation
 */
export class MockErrorProvider implements MockAIProvider {
  name = 'ErrorProvider';

  async generateSuggestion(_input: string): Promise<string> {
    throw new Error('Mock API error: Rate limit exceeded');
  }

  async analyzeContent(_content: string): Promise<Record<string, unknown>> {
    throw new Error('Mock API error: Service unavailable');
  }
}
