// Configuration
export * from './config/types';
export * from './config/validator';
export * from './config/defaults';

// Providers
export * from './providers';

// Router
export * from './router';

// Pipeline (Phase 3)
export * from './pipeline';

// Analytics
export { CostAnalytics } from './analytics/CostAnalytics';
export { BudgetManager } from './analytics/BudgetManager';
export { UsageReporter } from './analytics/UsageReporter';

// Re-export for convenience
import { AIRouter } from './router/AIRouter';
import {
  OpenRouterProvider,
  FALProvider,
  OpenAIProvider,
  AnthropicProvider,
  GoogleAIProvider,
} from './providers';
import { BYOKConfiguration } from './config/types';
import { ConfigurationValidator } from './config/validator';
import { createMockConfig } from './config/defaults';

/**
 * Factory function to create a configured AI Router
 *
 * @param config - BYOK configuration
 * @returns Configured AIRouter instance
 *
 * @example
 * ```typescript
 * const config = {
 *   providers: {
 *     openrouter: { apiKey: 'your-key' },
 *     openai: { apiKey: 'your-key' }
 *   },
 *   routing: { strategy: 'cost-optimized' }
 * };
 *
 * const router = createAIRouter(config);
 * const response = await router.route({
 *   type: 'prompt-generation',
 *   input: { text: 'Generate VW-themed prompts' }
 * });
 * ```
 */
export function createAIRouter(config: BYOKConfiguration): AIRouter {
  // Validate configuration
  const validation = ConfigurationValidator.validate(config);
  if (!validation.valid) {
    throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
  }

  // Sanitize configuration
  const sanitizedConfig = ConfigurationValidator.sanitize(config);

  // Initialize providers based on configuration
  const providers = [];

  if (sanitizedConfig.providers.openrouter) {
    providers.push(
      new OpenRouterProvider(
        sanitizedConfig.providers.openrouter.apiKey,
        sanitizedConfig.providers.openrouter.baseUrl
      )
    );
  }

  if (sanitizedConfig.providers.fal) {
    providers.push(new FALProvider(sanitizedConfig.providers.fal.apiKey));
  }

  if (sanitizedConfig.providers.openai) {
    providers.push(
      new OpenAIProvider(
        sanitizedConfig.providers.openai.apiKey,
        sanitizedConfig.providers.openai.organization
      )
    );
  }

  if (sanitizedConfig.providers.anthropic) {
    providers.push(new AnthropicProvider(sanitizedConfig.providers.anthropic.apiKey));
  }

  if (sanitizedConfig.providers.google) {
    providers.push(new GoogleAIProvider(sanitizedConfig.providers.google.apiKey));
  }

  // Create and return router
  return new AIRouter(sanitizedConfig, providers);
}

/**
 * Create a router with mock configuration for Phase 1 development
 *
 * @returns AIRouter with mock providers
 */
export function createMockRouter(): AIRouter {
  return createAIRouter(createMockConfig());
}
