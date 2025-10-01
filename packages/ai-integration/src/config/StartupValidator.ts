/**
 * Startup Validator
 *
 * Runs on application startup to validate API key configuration
 * and provide helpful feedback to developers
 */

import { EnvironmentKeyLoader } from './EnvironmentKeyLoader';
import { KeyValidator } from './KeyValidator';
import type { BYOKConfiguration } from './types';

export interface StartupValidationResult {
  success: boolean;
  config: BYOKConfiguration | null;
  providersConfigured: number;
  providersMissing: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export class StartupValidator {
  /**
   * Validate environment and return configuration
   * This is the main entry point for application startup
   */
  static validate(): StartupValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check if in mock mode
    if (EnvironmentKeyLoader.isMockMode()) {
      warnings.push('Running in MOCK mode - no real API calls will be made');
      warnings.push('Set VITE_AI_MODE=live in .env.local to enable real API calls');
    }

    // Load configuration from environment
    const config = EnvironmentKeyLoader.load();

    // Validate environment setup
    const envValidation = EnvironmentKeyLoader.validate();

    if (!envValidation.valid) {
      errors.push('No API providers configured!');
      errors.push('');
      errors.push('To configure API keys:');
      errors.push('1. Copy .env.example to .env.local');
      errors.push('2. Add your API keys to .env.local');
      errors.push('3. Restart the dev server: pnpm dev');
      errors.push('');
      errors.push('Get API keys from:');
      errors.push('• OpenRouter: https://openrouter.ai/keys');
      errors.push('• FAL.ai: https://fal.ai/dashboard/keys');
      errors.push('• OpenAI: https://platform.openai.com/api-keys');
      errors.push('• Anthropic: https://console.anthropic.com/settings/keys');
      errors.push('• Google AI: https://makersuite.google.com/app/apikey');

      return {
        success: false,
        config: null,
        providersConfigured: 0,
        providersMissing: 5,
        errors,
        warnings,
        suggestions,
      };
    }

    // Validate key formats
    const keyValidation = this.validateKeys(config);
    errors.push(...keyValidation.errors);
    warnings.push(...keyValidation.warnings);

    // Add environment warnings
    envValidation.warnings.forEach((warning) => warnings.push(warning));

    // Check provider coverage
    const configured = envValidation.configured.length;
    const missing = envValidation.missing.length;

    if (configured < 2) {
      suggestions.push('Consider adding more providers for better redundancy');
      suggestions.push('Recommended: OpenRouter (multi-model) + FAL.ai (image generation)');
    }

    if (missing > 0) {
      suggestions.push(`${missing} provider(s) not configured: ${envValidation.missing.join(', ')}`);
    }

    // Check cost tracking
    if (!config.costTracking?.enabled) {
      warnings.push('Cost tracking is disabled - no budget limits enforced');
    } else {
      const { dailyLimit, monthlyLimit } = config.costTracking;
      if (!dailyLimit && !monthlyLimit) {
        warnings.push('No budget limits set - costs will not be tracked');
      }
    }

    // Check debug mode
    if (EnvironmentKeyLoader.isDebugMode()) {
      warnings.push('Debug mode enabled - detailed AI logs will be shown');
    }

    return {
      success: errors.length === 0,
      config: errors.length === 0 ? config : null,
      providersConfigured: configured,
      providersMissing: missing,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Validate all configured keys
   */
  private static validateKeys(config: BYOKConfiguration): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const keysToValidate: { provider: string; key: string }[] = [];

    if (config.providers.openrouter?.apiKey) {
      keysToValidate.push({
        provider: 'openrouter',
        key: config.providers.openrouter.apiKey,
      });
    }
    if (config.providers.fal?.apiKey) {
      keysToValidate.push({
        provider: 'fal',
        key: config.providers.fal.apiKey,
      });
    }
    if (config.providers.openai?.apiKey) {
      keysToValidate.push({
        provider: 'openai',
        key: config.providers.openai.apiKey,
      });
    }
    if (config.providers.anthropic?.apiKey) {
      keysToValidate.push({
        provider: 'anthropic',
        key: config.providers.anthropic.apiKey,
      });
    }
    if (config.providers.google?.apiKey) {
      keysToValidate.push({
        provider: 'google',
        key: config.providers.google.apiKey,
      });
    }

    keysToValidate.forEach(({ provider, key }) => {
      const result = KeyValidator.validate(
        provider as any,
        key
      );

      if (!result.valid) {
        errors.push(`${provider}: ${result.error}`);
      }

      if (result.warnings) {
        result.warnings.forEach((warning) => {
          warnings.push(`${provider}: ${warning}`);
        });
      }
    });

    return { errors, warnings };
  }

  /**
   * Format validation result as console-friendly string
   */
  static formatResult(result: StartupValidationResult): string {
    const lines: string[] = [];

    lines.push('');
    lines.push('═══════════════════════════════════════════════════════');
    lines.push('  VWX AI Integration - Startup Validation');
    lines.push('═══════════════════════════════════════════════════════');
    lines.push('');

    if (result.success) {
      lines.push(`✅ Configuration valid`);
      lines.push(`✅ ${result.providersConfigured} provider(s) configured`);
      lines.push('');
    } else {
      lines.push(`❌ Configuration invalid`);
      lines.push('');
    }

    // Errors
    if (result.errors.length > 0) {
      lines.push('❌ ERRORS:');
      result.errors.forEach((error) => lines.push(`   ${error}`));
      lines.push('');
    }

    // Warnings
    if (result.warnings.length > 0) {
      lines.push('⚠️  WARNINGS:');
      result.warnings.forEach((warning) => lines.push(`   ${warning}`));
      lines.push('');
    }

    // Suggestions
    if (result.suggestions.length > 0) {
      lines.push('💡 SUGGESTIONS:');
      result.suggestions.forEach((suggestion) => lines.push(`   ${suggestion}`));
      lines.push('');
    }

    // Status
    if (result.success) {
      lines.push('✅ Ready to use AI features!');
    } else {
      lines.push('❌ AI features unavailable until configuration is fixed');
    }

    lines.push('═══════════════════════════════════════════════════════');
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Validate and log to console
   * Use this in your application entry point
   */
  static validateAndLog(): StartupValidationResult {
    const result = this.validate();
    console.log(this.formatResult(result));

    // Also log detailed status if debug mode
    if (EnvironmentKeyLoader.isDebugMode() && result.config) {
      EnvironmentKeyLoader.logStatus();
    }

    return result;
  }

  /**
   * Validate and throw if invalid
   * Use this if you want to prevent app startup with invalid config
   */
  static validateAndThrow(): BYOKConfiguration {
    const result = this.validate();
    console.log(this.formatResult(result));

    if (!result.success) {
      throw new Error(
        'AI Integration configuration invalid. See console for details.'
      );
    }

    return result.config!;
  }
}
