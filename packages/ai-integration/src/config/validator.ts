import { BYOKConfiguration } from './types';

export class ConfigurationValidator {
  static validate(config: BYOKConfiguration): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check that at least one provider is configured
    if (!config.providers || Object.keys(config.providers).length === 0) {
      errors.push('At least one provider must be configured');
    }

    // Validate provider configurations
    if (config.providers) {
      for (const [provider, providerConfig] of Object.entries(config.providers)) {
        if (!providerConfig || !providerConfig.apiKey) {
          errors.push(`Provider ${provider} requires an apiKey`);
        }
      }
    }

    // Validate routing configuration
    if (config.routing) {
      const validStrategies = ['cost-optimized', 'quality-first', 'speed-first'];
      if (config.routing.strategy && !validStrategies.includes(config.routing.strategy)) {
        errors.push(
          `Invalid routing strategy: ${config.routing.strategy}. Must be one of: ${validStrategies.join(', ')}`
        );
      }

      if (config.routing.budgetLimit && config.routing.budgetLimit <= 0) {
        errors.push('Budget limit must be greater than 0');
      }
    }

    // Validate cost tracking configuration
    if (config.costTracking && config.costTracking.enabled) {
      if (
        config.costTracking.dailyLimit &&
        config.costTracking.monthlyLimit &&
        config.costTracking.dailyLimit > config.costTracking.monthlyLimit
      ) {
        errors.push('Daily limit cannot exceed monthly limit');
      }

      if (config.costTracking.alertThreshold) {
        if (config.costTracking.alertThreshold < 0 || config.costTracking.alertThreshold > 1) {
          errors.push('Alert threshold must be between 0 and 1');
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static sanitize(config: BYOKConfiguration): BYOKConfiguration {
    const sanitized = JSON.parse(JSON.stringify(config));

    // Ensure routing defaults
    if (!sanitized.routing) {
      sanitized.routing = {};
    }
    if (!sanitized.routing.strategy) {
      sanitized.routing.strategy = 'cost-optimized';
    }
    if (sanitized.routing.fallbackEnabled === undefined) {
      sanitized.routing.fallbackEnabled = true;
    }

    // Ensure cost tracking defaults
    if (!sanitized.costTracking) {
      sanitized.costTracking = { enabled: true };
    }
    if (sanitized.costTracking.alertThreshold === undefined) {
      sanitized.costTracking.alertThreshold = 0.8;
    }

    return sanitized;
  }
}
