/**
 * Environment Key Loader
 *
 * Automatically loads API keys from environment variables (.env.local)
 * for personal use during development and testing.
 *
 * Usage:
 *   const config = EnvironmentKeyLoader.load();
 *   const router = new AIRouter(config);
 */

import type { BYOKConfiguration } from './types';

export class EnvironmentKeyLoader {
  /**
   * Load API keys from environment variables
   *
   * Reads from .env.local (via Vite's import.meta.env)
   * All keys must be prefixed with VITE_ to be accessible
   */
  static load(): BYOKConfiguration {
    const config: BYOKConfiguration = {
      providers: {},
      routing: {
        strategy: 'cost-optimized',
        fallbackEnabled: true,
      },
      costTracking: {
        enabled: true,
        dailyLimit: this.parseFloat(import.meta.env.VITE_DAILY_BUDGET, 10.0),
        monthlyLimit: this.parseFloat(import.meta.env.VITE_MONTHLY_BUDGET, 200.0),
        alertThreshold: this.parseFloat(import.meta.env.VITE_BUDGET_ALERT_THRESHOLD, 0.8),
      },
    };

    // Load OpenRouter
    const openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (this.isValidKey(openrouterKey) && openrouterKey) {
      config.providers.openrouter = {
        apiKey: openrouterKey,
        baseUrl: 'https://openrouter.ai/api/v1',
      };
    }

    // Load FAL.ai
    const falKey = import.meta.env.VITE_FAL_API_KEY;
    if (this.isValidKey(falKey) && falKey) {
      config.providers.fal = {
        apiKey: falKey,
      };
    }

    // Load OpenAI
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (this.isValidKey(openaiKey) && openaiKey) {
      config.providers.openai = {
        apiKey: openaiKey,
      };
    }

    // Load Anthropic
    const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (this.isValidKey(anthropicKey) && anthropicKey) {
      config.providers.anthropic = {
        apiKey: anthropicKey,
      };
    }

    // Load Google AI
    const googleKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    if (this.isValidKey(googleKey) && googleKey) {
      config.providers.google = {
        apiKey: googleKey,
      };
    }

    return config;
  }

  /**
   * Check if environment is properly configured
   * Returns array of missing/invalid provider keys
   */
  static validate(): {
    valid: boolean;
    configured: string[];
    missing: string[];
    warnings: string[];
  } {
    const providers = ['openrouter', 'fal', 'openai', 'anthropic', 'google'];
    const configured: string[] = [];
    const missing: string[] = [];
    const warnings: string[] = [];

    const envVars = {
      openrouter: import.meta.env.VITE_OPENROUTER_API_KEY,
      fal: import.meta.env.VITE_FAL_API_KEY,
      openai: import.meta.env.VITE_OPENAI_API_KEY,
      anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY,
      google: import.meta.env.VITE_GOOGLE_AI_API_KEY,
    };

    providers.forEach((provider) => {
      const key = envVars[provider as keyof typeof envVars];

      if (this.isValidKey(key)) {
        configured.push(provider);
      } else if (key && !this.isPlaceholder(key)) {
        warnings.push(`${provider}: Key format appears invalid`);
        missing.push(provider);
      } else {
        missing.push(provider);
      }
    });

    // Check AI mode
    const aiMode = import.meta.env.VITE_AI_MODE || 'live';
    if (aiMode === 'mock') {
      warnings.push('AI_MODE is set to "mock" - using mock responses instead of real API calls');
    }

    return {
      valid: configured.length > 0,
      configured,
      missing,
      warnings,
    };
  }

  /**
   * Get detailed status report
   */
  static getStatus(): string {
    const validation = this.validate();
    const aiMode = import.meta.env.VITE_AI_MODE || 'live';
    const debugMode = import.meta.env.VITE_AI_DEBUG === 'true';

    let report = '🔑 VWX AI Integration - Environment Configuration\n\n';

    // Mode
    report += `Mode: ${aiMode === 'mock' ? '🧪 Mock (no API calls)' : '🚀 Live (real API calls)'}\n`;
    report += `Debug: ${debugMode ? '✅ Enabled' : '❌ Disabled'}\n\n`;

    // Configured providers
    if (validation.configured.length > 0) {
      report += `✅ Configured Providers (${validation.configured.length}/5):\n`;
      validation.configured.forEach((provider) => {
        const key = this.getProviderKey(provider);
        const masked = this.maskKey(key || '');
        report += `   • ${provider}: ${masked}\n`;
      });
      report += '\n';
    }

    // Missing providers
    if (validation.missing.length > 0) {
      report += `⚠️  Missing Providers (${validation.missing.length}/5):\n`;
      validation.missing.forEach((provider) => {
        report += `   • ${provider}\n`;
      });
      report += '\n';
    }

    // Warnings
    if (validation.warnings.length > 0) {
      report += '⚠️  Warnings:\n';
      validation.warnings.forEach((warning) => {
        report += `   • ${warning}\n`;
      });
      report += '\n';
    }

    // Cost tracking
    const costTracking = import.meta.env.VITE_DAILY_BUDGET ||
                        import.meta.env.VITE_MONTHLY_BUDGET;
    if (costTracking) {
      report += '💰 Cost Tracking:\n';
      if (import.meta.env.VITE_DAILY_BUDGET) {
        report += `   • Daily limit: $${import.meta.env.VITE_DAILY_BUDGET}\n`;
      }
      if (import.meta.env.VITE_MONTHLY_BUDGET) {
        report += `   • Monthly limit: $${import.meta.env.VITE_MONTHLY_BUDGET}\n`;
      }
      if (import.meta.env.VITE_BUDGET_ALERT_THRESHOLD) {
        const threshold = parseFloat(import.meta.env.VITE_BUDGET_ALERT_THRESHOLD) * 100;
        report += `   • Alert at: ${threshold}%\n`;
      }
      report += '\n';
    }

    // Next steps
    if (!validation.valid) {
      report += '❌ No API providers configured!\n\n';
      report += 'To configure:\n';
      report += '1. Copy .env.example to .env.local\n';
      report += '2. Add your API keys to .env.local\n';
      report += '3. Restart the dev server (pnpm dev)\n';
    } else if (validation.missing.length > 0) {
      report += '💡 Tip: Add more providers to .env.local for better redundancy\n';
    }

    return report;
  }

  /**
   * Log status to console (useful for debugging)
   */
  static logStatus(): void {
    console.log(this.getStatus());
  }

  /**
   * Check if a key is valid (not empty, not placeholder)
   */
  private static isValidKey(key: string | undefined): boolean {
    if (!key) return false;
    if (key.length < 10) return false;
    return !this.isPlaceholder(key);
  }

  /**
   * Check if a key is a placeholder value
   */
  private static isPlaceholder(key: string): boolean {
    const placeholders = [
      'your-key-here',
      'your-openrouter-key-here',
      'your-fal-key-here',
      'your-openai-key-here',
      'your-anthropic-key-here',
      'your-google-key-here',
      'sk-or-v1-your-key-here',
      'sk-your-key-here',
      'sk-ant-your-key-here',
    ];
    return placeholders.some((placeholder) => key.includes(placeholder));
  }

  /**
   * Mask API key for display (show first 8 and last 4 chars)
   */
  private static maskKey(key: string): string {
    if (key.length < 12) return '***';
    const start = key.substring(0, 8);
    const end = key.substring(key.length - 4);
    return `${start}...${end}`;
  }

  /**
   * Parse float from env var with default
   */
  private static parseFloat(value: string | undefined, defaultValue: number): number {
    if (!value) return defaultValue;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Get provider key from env
   */
  private static getProviderKey(provider: string): string | undefined {
    const envVars = {
      openrouter: import.meta.env.VITE_OPENROUTER_API_KEY,
      fal: import.meta.env.VITE_FAL_API_KEY,
      openai: import.meta.env.VITE_OPENAI_API_KEY,
      anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY,
      google: import.meta.env.VITE_GOOGLE_AI_API_KEY,
    };
    return envVars[provider as keyof typeof envVars];
  }

  /**
   * Check if running in mock mode
   */
  static isMockMode(): boolean {
    return import.meta.env.VITE_AI_MODE === 'mock';
  }

  /**
   * Check if debug mode is enabled
   */
  static isDebugMode(): boolean {
    return import.meta.env.VITE_AI_DEBUG === 'true';
  }
}
