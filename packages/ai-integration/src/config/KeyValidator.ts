/**
 * API Key Validator
 *
 * Validates API key formats for each provider
 * Helps catch typos and formatting errors early
 */

export type ProviderName = 'openrouter' | 'fal' | 'openai' | 'anthropic' | 'google';

export interface ValidationResult {
  valid: boolean;
  provider: ProviderName;
  error?: string;
  warnings?: string[];
}

export class KeyValidator {
  /**
   * Validate an API key for a specific provider
   */
  static validate(provider: ProviderName, key: string): ValidationResult {
    if (!key || key.trim().length === 0) {
      return {
        valid: false,
        provider,
        error: 'API key is empty',
      };
    }

    const trimmedKey = key.trim();

    switch (provider) {
      case 'openrouter':
        return this.validateOpenRouter(trimmedKey);
      case 'fal':
        return this.validateFAL(trimmedKey);
      case 'openai':
        return this.validateOpenAI(trimmedKey);
      case 'anthropic':
        return this.validateAnthropic(trimmedKey);
      case 'google':
        return this.validateGoogle(trimmedKey);
      default:
        return {
          valid: false,
          provider,
          error: `Unknown provider: ${provider}`,
        };
    }
  }

  /**
   * Validate OpenRouter API key
   * Format: sk-or-v1-[64 hex chars]
   */
  private static validateOpenRouter(key: string): ValidationResult {
    const pattern = /^sk-or-v1-[a-f0-9]{64}$/i;

    if (!key.startsWith('sk-or-v1-')) {
      return {
        valid: false,
        provider: 'openrouter',
        error: 'OpenRouter keys must start with "sk-or-v1-"',
      };
    }

    if (!pattern.test(key)) {
      return {
        valid: false,
        provider: 'openrouter',
        error: 'Invalid OpenRouter key format. Expected: sk-or-v1-[64 hex chars]',
      };
    }

    return { valid: true, provider: 'openrouter' };
  }

  /**
   * Validate FAL.ai API key
   * Format: UUID (e.g., 550e8400-e29b-41d4-a716-446655440000)
   */
  private static validateFAL(key: string): ValidationResult {
    const pattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

    if (!pattern.test(key)) {
      return {
        valid: false,
        provider: 'fal',
        error: 'Invalid FAL.ai key format. Expected UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      };
    }

    return { valid: true, provider: 'fal' };
  }

  /**
   * Validate OpenAI API key
   * Format: sk-[48+ alphanumeric chars]
   * New format: sk-proj-[alphanumeric]
   */
  private static validateOpenAI(key: string): ValidationResult {
    const warnings: string[] = [];

    if (!key.startsWith('sk-')) {
      return {
        valid: false,
        provider: 'openai',
        error: 'OpenAI keys must start with "sk-"',
      };
    }

    // Check for new project-scoped keys
    if (key.startsWith('sk-proj-')) {
      warnings.push('Using project-scoped API key (sk-proj-). Ensure it has necessary permissions.');
    }

    if (key.length < 40) {
      return {
        valid: false,
        provider: 'openai',
        error: 'OpenAI key appears too short. Expected at least 40 characters.',
      };
    }

    // Check for valid characters (alphanumeric only after prefix)
    const keyBody = key.substring(3); // Remove 'sk-'
    if (!/^[a-zA-Z0-9-]+$/.test(keyBody)) {
      return {
        valid: false,
        provider: 'openai',
        error: 'OpenAI key contains invalid characters',
      };
    }

    return {
      valid: true,
      provider: 'openai',
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Validate Anthropic API key
   * Format: sk-ant-[alphanumeric and hyphens, ~95 chars total]
   */
  private static validateAnthropic(key: string): ValidationResult {
    if (!key.startsWith('sk-ant-')) {
      return {
        valid: false,
        provider: 'anthropic',
        error: 'Anthropic keys must start with "sk-ant-"',
      };
    }

    if (key.length < 80) {
      return {
        valid: false,
        provider: 'anthropic',
        error: 'Anthropic key appears too short. Expected ~95 characters.',
      };
    }

    // Check for valid characters
    const keyBody = key.substring(7); // Remove 'sk-ant-'
    if (!/^[a-zA-Z0-9-]+$/.test(keyBody)) {
      return {
        valid: false,
        provider: 'anthropic',
        error: 'Anthropic key contains invalid characters',
      };
    }

    return { valid: true, provider: 'anthropic' };
  }

  /**
   * Validate Google AI API key
   * Format: [39 alphanumeric chars with hyphens and underscores]
   */
  private static validateGoogle(key: string): ValidationResult {
    // Google keys are typically 39 characters
    if (key.length < 30) {
      return {
        valid: false,
        provider: 'google',
        error: 'Google AI key appears too short. Expected ~39 characters.',
      };
    }

    // Check for valid characters (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9-_]+$/.test(key)) {
      return {
        valid: false,
        provider: 'google',
        error: 'Google AI key contains invalid characters',
      };
    }

    return { valid: true, provider: 'google' };
  }

  /**
   * Batch validate all providers from config
   */
  static validateAll(config: {
    openrouter?: string;
    fal?: string;
    openai?: string;
    anthropic?: string;
    google?: string;
  }): Record<ProviderName, ValidationResult> {
    const results: Record<string, ValidationResult> = {};

    if (config.openrouter) {
      results.openrouter = this.validate('openrouter', config.openrouter);
    }
    if (config.fal) {
      results.fal = this.validate('fal', config.fal);
    }
    if (config.openai) {
      results.openai = this.validate('openai', config.openai);
    }
    if (config.anthropic) {
      results.anthropic = this.validate('anthropic', config.anthropic);
    }
    if (config.google) {
      results.google = this.validate('google', config.google);
    }

    return results as Record<ProviderName, ValidationResult>;
  }

  /**
   * Get validation summary
   */
  static getSummary(
    results: Record<ProviderName, ValidationResult>
  ): {
    valid: number;
    invalid: number;
    warnings: number;
    details: string[];
  } {
    let valid = 0;
    let invalid = 0;
    let warnings = 0;
    const details: string[] = [];

    Object.entries(results).forEach(([provider, result]) => {
      if (result.valid) {
        valid++;
        details.push(`✅ ${provider}: Valid`);
        if (result.warnings) {
          warnings += result.warnings.length;
          result.warnings.forEach((warning) => {
            details.push(`   ⚠️  ${warning}`);
          });
        }
      } else {
        invalid++;
        details.push(`❌ ${provider}: ${result.error}`);
      }
    });

    return { valid, invalid, warnings, details };
  }
}
