# @vwx/ai-integration

**VWX Design System AI Integration Package**

A comprehensive BYOK (Bring Your Own Key) AI provider integration system with intelligent routing, cost tracking, circuit breaker patterns, and automatic failover.

## Overview

This package provides a unified interface for integrating multiple AI providers into the VWX Design System, supporting:

- **5 AI Providers**: OpenRouter, FAL.ai, OpenAI, Anthropic, Google AI
- **Intelligent Routing**: Cost-optimized, quality-first, or speed-first strategies
- **Automatic Failover**: Circuit breaker pattern with graceful degradation
- **Cost Tracking**: Real-time cost monitoring with budget limits
- **Analytics**: Detailed usage reports and optimization recommendations

## Phase 3 Status ✨

**Phase 3 Complete**: Live API integration with 5 AI providers and full 4-step pipeline orchestration.

### What's New in Phase 3

- **4-Step AI Pipeline**: Image Analysis → Prompt Generation → Cultural Validation → Asset Generation
- **Live API Integration**: All 5 providers (OpenAI, Anthropic, Google AI, FAL.ai, OpenRouter) connected to real APIs
- **Wolfsburg Cultural Validation**: 100-point heritage scoring system with bonus principles
- **Multi-Modal Processing**: Text-to-image and image-to-image workflows
- **Cost Tracking**: Real-time cost calculation across all pipeline steps
- **Intelligent Routing**: Automatic provider selection based on task type and budget

### Pipeline Usage

```typescript
import { AIPipeline, createAIRouter } from '@vwx/ai-integration';

// Create router with API keys
const router = createAIRouter({
  providers: {
    openai: { apiKey: process.env.VITE_OPENAI_API_KEY },
    anthropic: { apiKey: process.env.VITE_ANTHROPIC_API_KEY },
    // Add other providers as needed
  }
});

// Create pipeline
const pipeline = new AIPipeline(router);

// Execute complete pipeline
const result = await pipeline.execute({
  text: 'Classic VW Beetle from the 1960s',
  context: {
    theme: 'color',
    vehicle: 'beetle',
    era: '1960s'
  },
  options: {
    promptVariations: 3,
    validationThreshold: 70,
    assetCount: 2
  }
});

console.log('Cultural Score:', result.culturalValidation?.score);
console.log('Generated Assets:', result.generatedAssets);
console.log('Total Cost:', result.totalCost);
```

See [PIPELINE_GUIDE.md](./PIPELINE_GUIDE.md) for complete pipeline documentation.

## Installation

```bash
npm install @vwx/ai-integration
```

## Quick Start

### Personal Use (Environment Variables)

For personal use, store API keys in `.env.local`:

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your keys (see "Environment Variables" section below)

# Restart dev server
pnpm dev
```

Then use the auto-loader:

```typescript
import { StartupValidator, EnvironmentKeyLoader } from '@vwx/ai-integration/config';
import { AIRouter } from '@vwx/ai-integration/router';

// Validate on startup
const validation = StartupValidator.validateAndLog();

if (validation.success) {
  // Auto-load from .env.local
  const config = EnvironmentKeyLoader.load();

  // Create router
  const router = new AIRouter(config);

  // Use it
  const result = await router.route({
    type: 'prompt-generation',
    input: { text: 'VW Beetle design' }
  });
}
```

### Mock Mode (No API Keys)

For development without API keys:

```typescript
import { createMockRouter } from '@vwx/ai-integration';

// Create router with mock providers (no API keys needed)
const router = createMockRouter();

// Execute a task - returns mock response
const response = await router.route({
  type: 'prompt-generation',
  input: {
    text: 'Generate prompts for VW Beetle classic design',
    context: {
      theme: 'bw',
      vehicle: 'beetle',
      section: 'components'
    }
  }
});

console.log(response.data.prompts);
```

### Production Configuration (Custom Setup)

For advanced configuration:

```typescript
import { createAIRouter } from '@vwx/ai-integration';

const router = createAIRouter({
  providers: {
    openrouter: {
      apiKey: process.env.OPENROUTER_API_KEY,
      baseUrl: 'https://openrouter.ai/api/v1'
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID // optional
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY
    },
    google: {
      apiKey: process.env.GOOGLE_AI_API_KEY
    },
    fal: {
      apiKey: process.env.FAL_API_KEY
    }
  },
  routing: {
    strategy: 'cost-optimized', // or 'quality-first', 'speed-first'
    fallbackEnabled: true,
    preferredProviders: ['openrouter', 'anthropic'] // optional
  },
  costTracking: {
    enabled: true,
    dailyLimit: 50.00,
    monthlyLimit: 1000.00,
    alertThreshold: 0.8 // alert at 80% of limit
  }
});
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the browser.

### Required (at least one provider)

```bash
# OpenRouter - Multi-model routing ($0.02/request)
VITE_OPENROUTER_API_KEY=sk-or-v1-...

# FAL.ai - Fast image generation ($0.05/request)
VITE_FAL_API_KEY=...

# OpenAI - GPT-4 & DALL-E 3 ($0.03/request)
VITE_OPENAI_API_KEY=sk-...

# Anthropic - Claude for cultural validation ($0.025/request)
VITE_ANTHROPIC_API_KEY=sk-ant-...

# Google AI - Gemini for image analysis ($0.015/request)
VITE_GOOGLE_AI_API_KEY=...
```

### Optional (Cost Tracking)

```bash
# Daily spending limit (USD)
VITE_DAILY_BUDGET=10.00

# Monthly spending limit (USD)
VITE_MONTHLY_BUDGET=200.00

# Alert when budget reaches this percentage (0.0 to 1.0)
VITE_BUDGET_ALERT_THRESHOLD=0.80
```

### Optional (Development)

```bash
# Set to 'true' to enable detailed AI logging
VITE_AI_DEBUG=false

# Set to 'mock' to use mock responses (no API keys needed)
# Set to 'live' to use real API calls
VITE_AI_MODE=live
```

**Get API keys from:**
- OpenRouter: https://openrouter.ai/keys
- FAL.ai: https://fal.ai/dashboard/keys
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/settings/keys
- Google AI: https://makersuite.google.com/app/apikey

## Task Types

The system supports four types of AI tasks:

### 1. Prompt Generation

Generate creative prompts for VW-themed content:

```typescript
await router.route({
  type: 'prompt-generation',
  input: {
    text: 'Create prompts for vintage VW Bus illustrations',
    context: {
      theme: 'patina',
      vehicle: 'bus',
      era: '60s',
      section: 'patterns'
    }
  },
  options: {
    temperature: 0.8,
    variations: 3
  }
});
```

### 2. Image Analysis

Analyze images for VW design system alignment:

```typescript
await router.route({
  type: 'image-analysis',
  input: {
    image: uploadedFile, // File object or URL
    context: {
      theme: 'color',
      vehicle: 'karmann-ghia',
      section: 'components'
    }
  }
});
```

### 3. Cultural Validation

Validate content against VW heritage values:

```typescript
await router.route({
  type: 'cultural-validation',
  input: {
    text: 'Proposed component description...',
    context: {
      theme: 'bw',
      vehicle: 'beetle',
      era: '50s',
      section: 'guidelines'
    }
  }
});
```

### 4. Asset Generation

Generate visual assets (Phase 3):

```typescript
await router.route({
  type: 'asset-generation',
  input: {
    text: 'Vintage VW Beetle silhouette with chrome details',
    context: {
      theme: 'bw',
      vehicle: 'beetle',
      section: 'tokens'
    }
  },
  options: {
    variations: 2
  }
});
```

## Routing Strategies

### Cost-Optimized (Default)

Routes to the cheapest provider capable of handling the task:

```typescript
routing: { strategy: 'cost-optimized' }
```

**Best for**: High-volume operations where budget is a primary concern.

### Quality-First

Routes to the highest-quality provider for each task type:

```typescript
routing: { strategy: 'quality-first' }
```

**Provider rankings by task**:
- Image analysis: Anthropic Claude > OpenAI GPT-4 Vision > Google Gemini
- Cultural validation: Anthropic Claude > OpenAI GPT-4
- Prompt generation: OpenAI GPT-4 > Anthropic Claude
- Asset generation: FAL.ai > OpenAI DALL-E

### Speed-First

Routes to the fastest provider:

```typescript
routing: { strategy: 'speed-first' }
```

**Best for**: Real-time interactions where latency matters.

## Cost Tracking

### Real-time Monitoring

```typescript
const stats = router.getCostStats();

console.log('Today:', stats.daily);
console.log('This month:', stats.monthly);
console.log('By provider:', stats.byProvider);
console.log('By task type:', stats.byTaskType);
```

### Budget Usage

```typescript
const usage = router.getCostStats().budgetUsage;

console.log('Daily budget:', usage.daily);
// { used: 12.50, limit: 50.00, percentage: 25 }

console.log('Monthly budget:', usage.monthly);
// { used: 450.00, limit: 1000.00, percentage: 45 }
```

### Cost Estimation

Estimate costs before executing:

```typescript
const estimate = await router.estimateCost({
  type: 'prompt-generation',
  input: { text: 'test' }
});

console.log('Cost range:', estimate.min, '-', estimate.max);
console.log('Recommended:', estimate.recommended);
console.log('By provider:', estimate.byProvider);
```

## Circuit Breaker

The circuit breaker automatically disables failing providers:

```typescript
// Check circuit status
const status = router.getCircuitBreakerStatus();
console.log(status);
// {
//   openai: { state: 'closed', failures: 0 },
//   anthropic: { state: 'open', failures: 3 }
// }

// Manually reset a circuit
router.resetCircuitBreaker('anthropic');

// Reset all circuits
router.resetCircuitBreaker();
```

**Circuit States**:
- **Closed**: Normal operation
- **Open**: Provider disabled after 3 failures
- **Half-Open**: Testing recovery after 1-minute timeout

## Advanced Usage

### Custom Provider Configuration

```typescript
import { AIRouter, OpenRouterProvider, OpenAIProvider } from '@vwx/ai-integration';

const providers = [
  new OpenRouterProvider('your-key', 'https://openrouter.ai/api/v1'),
  new OpenAIProvider('your-key', 'your-org-id')
];

const router = new AIRouter(config, providers);
```

### Preferred Providers

Prioritize specific providers:

```typescript
routing: {
  strategy: 'cost-optimized',
  preferredProviders: ['openrouter', 'anthropic']
}
```

Only fallback to other providers if preferred ones fail.

### Disable Failover

For debugging or strict provider requirements:

```typescript
routing: {
  strategy: 'quality-first',
  fallbackEnabled: false
}
```

## Analytics

### Usage Reports

```typescript
import { UsageReporter } from '@vwx/ai-integration';

const costs = router.getCostStats(); // Get cost records
const reporter = new UsageReporter(costs);

// Daily report
const dailyReport = reporter.generateDailyReport();
console.log(reporter.formatAsText(dailyReport));

// Monthly report
const monthlyReport = reporter.generateMonthlyReport();

// Detailed analytics
const detailed = reporter.generateDetailedReport(
  new Date('2024-01-01'),
  new Date('2024-01-31')
);
```

### Cost Optimization

```typescript
const recommendations = reporter.generateRecommendations(
  new Date('2024-01-01'),
  new Date('2024-01-31')
);

console.log(recommendations);
// [
//   "Consider diversifying providers: openai accounts for 75% of costs",
//   "High volume of prompt-generation requests: Consider caching"
// ]
```

### Budget Management

```typescript
import { BudgetManager } from '@vwx/ai-integration';

const budgetManager = new BudgetManager(costTracker, {
  dailyLimit: 50.00,
  monthlyLimit: 1000.00,
  warningThreshold: 0.8,
  criticalThreshold: 0.95
});

// Check budget and get alerts
const alerts = budgetManager.checkBudget();
for (const alert of alerts) {
  console.log(`${alert.level}: ${alert.message}`);
}

// Check if a task is affordable
const { canAfford, reason } = budgetManager.canAffordTask(5.00);
```

## Provider Details

### OpenRouter
- **Models**: Claude, GPT-4, and 100+ others
- **Strengths**: Cost-effective, multi-model routing
- **Use for**: General text generation, cost optimization
- **Cost**: $0.02 per request (average)

### FAL.ai
- **Models**: FLUX, Stable Diffusion XL
- **Strengths**: Fast image generation, high quality
- **Use for**: Asset generation only
- **Cost**: $0.05 per image

### OpenAI
- **Models**: GPT-4, GPT-4 Vision, DALL-E 3
- **Strengths**: Best general-purpose AI
- **Use for**: All task types, quality-first routing
- **Cost**: $0.03 per request (average)

### Anthropic
- **Models**: Claude 3 Opus, Sonnet, Haiku
- **Strengths**: Strong reasoning, large context windows
- **Use for**: Cultural validation, complex analysis
- **Cost**: $0.025 per request (average)

### Google AI
- **Models**: Gemini Pro, Gemini Pro Vision
- **Strengths**: Cost-effective, good vision capabilities
- **Use for**: High-volume image analysis
- **Cost**: $0.015 per request (average)

## Testing

The package includes comprehensive tests with >90% coverage:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Writing Tests

```typescript
import { createMockRouter } from '@vwx/ai-integration';
import { MockProvider } from '@vwx/ai-integration/tests/mocks';

describe('My Feature', () => {
  it('should use AI router', async () => {
    const router = createMockRouter();
    const response = await router.route({
      type: 'prompt-generation',
      input: { text: 'test' }
    });

    expect(response.success).toBe(true);
  });
});
```

## Migration to Phase 3

Phase 3 maintains backward compatibility while adding powerful new features:

### Option 1: Continue Using Mock Mode
```typescript
const router = createMockRouter();
// Works exactly as before - no changes needed
```

### Option 2: Upgrade to Live APIs
```typescript
const router = createAIRouter({
  providers: {
    openai: { apiKey: process.env.VITE_OPENAI_API_KEY },
    anthropic: { apiKey: process.env.VITE_ANTHROPIC_API_KEY }
  }
});
// Same interface, now with real AI responses
```

### Option 3: Use the Full Pipeline
```typescript
import { AIPipeline } from '@vwx/ai-integration';

const pipeline = new AIPipeline(router);
const result = await pipeline.execute({
  text: 'VW design concept',
  context: { theme: 'bw', vehicle: 'beetle' }
});
```

See [PIPELINE_GUIDE.md](./PIPELINE_GUIDE.md) for migration examples and troubleshooting.

## Configuration Reference

### BYOKConfiguration

```typescript
interface BYOKConfiguration {
  providers: {
    openrouter?: { apiKey: string; baseUrl?: string };
    fal?: { apiKey: string };
    openai?: { apiKey: string; organization?: string };
    anthropic?: { apiKey: string };
    google?: { apiKey: string };
  };
  routing?: {
    strategy: 'cost-optimized' | 'quality-first' | 'speed-first';
    preferredProviders?: string[];
    fallbackEnabled?: boolean;
  };
  costTracking?: {
    enabled: boolean;
    dailyLimit?: number;
    monthlyLimit?: number;
    alertThreshold?: number; // 0-1
  };
}
```

## Error Handling

```typescript
try {
  const response = await router.route(task);

  if (!response.success) {
    console.error('Task failed:', response.error);

    if (response.error.retryable) {
      // Retry logic
    }
  }
} catch (error) {
  if (error.message.includes('Budget limit exceeded')) {
    // Handle budget exceeded
  } else if (error.message.includes('All providers failed')) {
    // Handle all providers down
  }
}
```

## Performance Tips

1. **Use cost-optimized routing** for high-volume operations
2. **Enable caching** for repeated similar requests
3. **Batch requests** when possible to reduce overhead
4. **Monitor circuit breaker** to detect provider issues early
5. **Set appropriate budget limits** to avoid unexpected costs
6. **Skip validation** for trusted prompts to save costs
7. **Use lower resolution** for draft assets (512x512 vs 1024x1024)
8. **Choose faster models** like FLUX Schnell for rapid iteration

## Troubleshooting

### Pipeline Execution Issues

**Pipeline fails at validation step**
```typescript
// Solution: Lower the threshold or skip validation
const result = await pipeline.execute({
  text: 'your prompt',
  context: { theme: 'bw' },
  options: {
    validationThreshold: 60, // Lower from 70
    // OR skip validation entirely
    skipValidation: true
  }
});
```

**Pipeline stops after cultural validation**
```typescript
// Solution: Continue even if validation fails
const result = await pipeline.execute({
  text: 'your prompt',
  context: { theme: 'bw' },
  options: {
    stopOnValidationFailure: false // Continue to asset generation
  }
});
```

**"Budget limit exceeded" error**
```typescript
// Check current usage
const usage = router.getCostStats().budgetUsage;
console.log('Daily:', usage.daily);
console.log('Monthly:', usage.monthly);

// Increase limits or reset
const router = createAIRouter({
  costTracking: {
    enabled: true,
    dailyLimit: 100.00, // Increase from 50
    monthlyLimit: 2000.00
  }
});
```

### Provider Issues

**API key not working**
```bash
# Verify environment variables are prefixed correctly
echo $VITE_OPENAI_API_KEY  # ✓ Correct
echo $OPENAI_API_KEY       # ✗ Won't work in browser
```

**Provider always fails / circuit breaker open**
```typescript
// Check circuit breaker status
const status = router.getCircuitBreakerStatus();
console.log(status);

// Reset if needed
router.resetCircuitBreaker('openai'); // Reset specific provider
router.resetCircuitBreaker(); // Reset all
```

**"All providers failed" error**
```typescript
// Check which providers are configured
const config = EnvironmentKeyLoader.load();
console.log('Available providers:', Object.keys(config.providers));

// Ensure at least one provider for each task type
// Image analysis: openai, anthropic, google
// Prompt generation: openai, anthropic, openrouter
// Cultural validation: anthropic, openai
// Asset generation: fal, openai
```

### Cost Issues

**Costs higher than expected**
```typescript
// Get detailed cost breakdown
const report = new UsageReporter(router.getCostStats().export());
const detailed = report.generateDetailedReport(
  new Date('2024-01-01'),
  new Date()
);

console.log('Summary:', detailed.summary);
console.log('By provider:', detailed.breakdown.byProvider);
console.log('Top expensive:', detailed.topExpensive);

// Get recommendations
const recommendations = report.generateRecommendations(
  new Date('2024-01-01'),
  new Date()
);
console.log('Recommendations:', recommendations);
```

**Cost estimation inaccurate**
```typescript
// Estimate before executing
const estimate = await pipeline.estimateCost({
  text: 'your prompt',
  sourceImage: file, // Include if analyzing image
  context: { theme: 'bw' },
  options: {
    assetCount: 3, // Include all options that affect cost
    assetSize: '1024x1024'
  }
});

console.log('Estimated total:', estimate.total);
console.log('Breakdown:', estimate);
```

### Common Errors

**"Image analysis failed: Invalid image format"**
- Supported formats: PNG, JPEG, WEBP, GIF
- Maximum size: 20MB
- Convert image: `const base64 = await fileToBase64(file)`

**"Cultural validation returned invalid JSON"**
- This is usually a provider issue
- Try a different provider (Claude is most reliable)
- Or catch and handle gracefully:
```typescript
try {
  const result = await pipeline.execute({ ... });
} catch (error) {
  if (error.message.includes('Invalid JSON')) {
    // Fallback: skip validation
    return pipeline.execute({
      ...,
      options: { skipValidation: true }
    });
  }
}
```

**TypeScript errors with pipeline types**
```typescript
// Import all necessary types
import {
  AIPipeline,
  PipelineInput,
  PipelineResult,
  PipelineContext
} from '@vwx/ai-integration';

// Use proper type annotations
const input: PipelineInput = {
  text: 'your prompt',
  context: {
    theme: 'bw',
    vehicle: 'beetle'
  }
};
```

See [PIPELINE_GUIDE.md](./PIPELINE_GUIDE.md) for more examples and [COST_OPTIMIZATION.md](./COST_OPTIMIZATION.md) for cost management strategies.

## Security

- Store API keys in environment variables, never in code
- Use `.env` files that are gitignored
- Rotate keys regularly
- Monitor usage for anomalies
- Set budget limits as a safety net

## Contributing

This package is part of the VWX Design System. For development:

```bash
# Install dependencies
npm install

# Build
npm run build

# Type check
npm run type-check

# Run tests with coverage
npm run test:coverage
```

## API Reference

Full TypeScript definitions are included. Use your IDE's autocomplete for detailed type information.

## Support

For issues or questions:
- Open an issue in the VWX Design System repository
- Check the main documentation at `/docs/ai-integration.md`
- Review test files for usage examples
- See [PIPELINE_GUIDE.md](./PIPELINE_GUIDE.md) for pipeline usage
- See [COST_OPTIMIZATION.md](./COST_OPTIMIZATION.md) for cost management
- See [WOLFSBURG_INTEGRATION.md](./WOLFSBURG_INTEGRATION.md) for cultural validation

## Additional Documentation

- **[PIPELINE_GUIDE.md](./PIPELINE_GUIDE.md)** - Complete 4-step pipeline usage guide
- **[COST_OPTIMIZATION.md](./COST_OPTIMIZATION.md)** - Cost management and budget strategies
- **[WOLFSBURG_INTEGRATION.md](./WOLFSBURG_INTEGRATION.md)** - Cultural authenticity validation guide
- **[PHASE3_PROGRESS.md](./PHASE3_PROGRESS.md)** - Phase 3 implementation details

## License

MIT

---

**Phase 3 Complete ✨** | **Live API Integration** | **Part of VWX Design System v0.1.0**
