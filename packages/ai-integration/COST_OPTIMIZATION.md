# Cost Optimization Guide

Comprehensive guide to managing and optimizing AI costs in the VWX Design System.

## Table of Contents

- [Cost Overview](#cost-overview)
- [Provider Cost Comparison](#provider-cost-comparison)
- [Routing Strategies](#routing-strategies)
- [Budget Configuration](#budget-configuration)
- [Cost Reduction Techniques](#cost-reduction-techniques)
- [Real-World Scenarios](#real-world-scenarios)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Best Practices](#best-practices)

---

## Cost Overview

### Typical Pipeline Costs

A complete 4-step pipeline execution typically costs:

```
┌────────────────────────────────────────────────┐
│ Pipeline Step          │ Cost Range            │
├────────────────────────────────────────────────┤
│ Image Analysis         │ $0.005 - $0.030       │
│ Prompt Generation      │ $0.020 - $0.030       │
│ Cultural Validation    │ $0.020 - $0.035       │
│ Asset Generation       │ $0.003 - $0.120       │
├────────────────────────────────────────────────┤
│ TOTAL per asset        │ $0.048 - $0.215       │
└────────────────────────────────────────────────┘
```

**Budget Planning:**
- **Low-volume usage** (10 assets/day): ~$0.50-$2.00/day, ~$15-$60/month
- **Medium-volume usage** (50 assets/day): ~$2.50-$10.00/day, ~$75-$300/month
- **High-volume usage** (200 assets/day): ~$10.00-$40.00/day, ~$300-$1200/month

### Cost Factors

**Image Analysis:**
- Model choice (Gemini $0.005 vs GPT-4 Vision $0.030)
- Detail level (low/medium/high)
- Image size and complexity

**Prompt Generation:**
- Model choice (GPT-4 $0.030 vs Claude Opus $0.025)
- Number of variations (1-10)
- Context length and complexity

**Cultural Validation:**
- Model choice (Claude Opus $0.025 vs GPT-4 $0.030)
- Validation depth (include Wolfsburg principles or not)
- Prompt complexity

**Asset Generation:**
- Provider choice (FAL FLUX Schnell $0.003 vs DALL-E 3 HD $0.120)
- Image size (256x256 to 1792x1024)
- Quality (standard vs HD)
- Number of variations

---

## Provider Cost Comparison

### Image Analysis

| Provider | Model | Cost/Request | Speed | Quality |
|----------|-------|--------------|-------|---------|
| Google AI | Gemini 2.0 Flash | $0.005 | ⚡⚡⚡ Fast | ⭐⭐⭐ Good |
| Google AI | Gemini 1.5 Pro | $0.015 | ⚡⚡ Medium | ⭐⭐⭐⭐ Excellent |
| OpenAI | GPT-4 Vision | $0.030 | ⚡⚡ Medium | ⭐⭐⭐⭐ Excellent |
| Anthropic | Claude 3 Haiku | $0.015 | ⚡⚡⚡ Fast | ⭐⭐⭐ Good |
| Anthropic | Claude 3.5 Sonnet | $0.025 | ⚡⚡ Medium | ⭐⭐⭐⭐⭐ Best |

**Recommendation:** Google Gemini 2.0 Flash for cost-optimized, Claude 3.5 Sonnet for quality-first

### Prompt Generation

| Provider | Model | Cost/Request | Speed | Quality |
|----------|-------|--------------|-------|---------|
| OpenRouter | Claude 3 Haiku | $0.015 | ⚡⚡⚡ Fast | ⭐⭐⭐ Good |
| OpenAI | GPT-4 Turbo | $0.030 | ⚡⚡ Medium | ⭐⭐⭐⭐⭐ Best |
| Anthropic | Claude 3.5 Sonnet | $0.025 | ⚡⚡ Medium | ⭐⭐⭐⭐⭐ Best |
| OpenRouter | GPT-3.5 | $0.005 | ⚡⚡⚡ Fast | ⭐⭐ Fair |

**Recommendation:** Claude 3.5 Sonnet for balanced cost/quality, GPT-4 Turbo for quality-first

### Cultural Validation

| Provider | Model | Cost/Request | Speed | Quality |
|----------|-------|--------------|-------|---------|
| Anthropic | Claude 3 Haiku | $0.015 | ⚡⚡⚡ Fast | ⭐⭐⭐ Good |
| Anthropic | Claude 3.5 Sonnet | $0.025 | ⚡⚡ Medium | ⭐⭐⭐⭐⭐ Best |
| Anthropic | Claude 3 Opus | $0.035 | ⚡ Slow | ⭐⭐⭐⭐⭐ Best |
| OpenAI | GPT-4 Turbo | $0.030 | ⚡⚡ Medium | ⭐⭐⭐⭐ Excellent |

**Recommendation:** Claude 3 Haiku for cost-optimized, Claude 3.5 Sonnet for quality-first

### Asset Generation

| Provider | Model | Size | Cost/Image | Speed | Quality |
|----------|-------|------|------------|-------|---------|
| FAL.ai | FLUX Schnell | 512x512 | $0.003 | ⚡⚡⚡ 2s | ⭐⭐⭐ Good |
| FAL.ai | FLUX Dev | 1024x1024 | $0.025 | ⚡⚡ 5s | ⭐⭐⭐⭐ Excellent |
| FAL.ai | FLUX Pro | 1024x1024 | $0.055 | ⚡ 8s | ⭐⭐⭐⭐⭐ Best |
| OpenAI | DALL-E 3 | 1024x1024 | $0.040 | ⚡⚡ 10s | ⭐⭐⭐⭐ Excellent |
| OpenAI | DALL-E 3 HD | 1024x1024 | $0.080 | ⚡⚡ 12s | ⭐⭐⭐⭐⭐ Best |
| OpenAI | DALL-E 3 HD | 1792x1024 | $0.120 | ⚡ 15s | ⭐⭐⭐⭐⭐ Best |

**Recommendation:** FLUX Schnell for rapid prototyping, FLUX Dev for production, DALL-E 3 HD for final assets

---

## Routing Strategies

### Cost-Optimized Strategy

Routes to the cheapest capable provider for each task.

```typescript
const router = createAIRouter({
  providers: {
    google: { apiKey: process.env.VITE_GOOGLE_AI_API_KEY },
    openrouter: { apiKey: process.env.VITE_OPENROUTER_API_KEY },
    fal: { apiKey: process.env.VITE_FAL_API_KEY }
  },
  routing: {
    strategy: 'cost-optimized'
  }
});
```

**Routing decisions:**
- Image Analysis → Google Gemini 2.0 Flash ($0.005)
- Prompt Generation → OpenRouter Claude Haiku ($0.015)
- Cultural Validation → Anthropic Claude Haiku ($0.015)
- Asset Generation → FAL FLUX Schnell ($0.003)

**Total cost per asset:** ~$0.038

### Quality-First Strategy

Routes to the best-quality provider regardless of cost.

```typescript
const router = createAIRouter({
  providers: {
    anthropic: { apiKey: process.env.VITE_ANTHROPIC_API_KEY },
    openai: { apiKey: process.env.VITE_OPENAI_API_KEY },
    fal: { apiKey: process.env.VITE_FAL_API_KEY }
  },
  routing: {
    strategy: 'quality-first'
  }
});
```

**Routing decisions:**
- Image Analysis → Claude 3.5 Sonnet ($0.025)
- Prompt Generation → GPT-4 Turbo ($0.030)
- Cultural Validation → Claude 3 Opus ($0.035)
- Asset Generation → FAL FLUX Pro ($0.055)

**Total cost per asset:** ~$0.145

### Balanced Strategy

Custom routing that balances cost and quality.

```typescript
const router = createAIRouter({
  providers: {
    google: { apiKey: process.env.VITE_GOOGLE_AI_API_KEY },
    anthropic: { apiKey: process.env.VITE_ANTHROPIC_API_KEY },
    fal: { apiKey: process.env.VITE_FAL_API_KEY }
  },
  routing: {
    strategy: 'cost-optimized',
    preferredProviders: ['anthropic', 'google'] // Prefer these when cost is similar
  }
});
```

**Routing decisions:**
- Image Analysis → Google Gemini 1.5 Pro ($0.015)
- Prompt Generation → Claude 3.5 Sonnet ($0.025)
- Cultural Validation → Claude 3.5 Sonnet ($0.025)
- Asset Generation → FAL FLUX Dev ($0.025)

**Total cost per asset:** ~$0.090

---

## Budget Configuration

### Basic Budget Limits

```typescript
const router = createAIRouter({
  providers: { /* ... */ },
  costTracking: {
    enabled: true,
    dailyLimit: 10.00,      // Max $10/day
    monthlyLimit: 200.00,   // Max $200/month
    alertThreshold: 0.8     // Alert at 80% of limit
  }
});
```

### Advanced Budget Management

```typescript
import { BudgetManager } from '@vwx/ai-integration';

const costTracker = router.getCostTracker();
const budgetManager = new BudgetManager(costTracker, {
  dailyLimit: 50.00,
  monthlyLimit: 1000.00,
  warningThreshold: 0.7,    // Warning at 70%
  criticalThreshold: 0.9    // Critical at 90%
});

// Check budget before expensive operations
const alerts = budgetManager.checkBudget();
for (const alert of alerts) {
  if (alert.level === 'critical') {
    console.error('Critical budget alert:', alert.message);
    // Stop processing or notify admin
  } else if (alert.level === 'warning') {
    console.warn('Budget warning:', alert.message);
    // Consider using cheaper options
  }
}

// Check if a specific task is affordable
const estimatedCost = 5.00;
const { canAfford, reason } = budgetManager.canAffordTask(estimatedCost);

if (!canAfford) {
  console.error('Cannot afford task:', reason);
  throw new Error('Budget insufficient');
}
```

### Dynamic Budget Adjustment

```typescript
class AdaptiveBudgetManager {
  constructor(
    private router: AIRouter,
    private budgetManager: BudgetManager
  ) {}

  async executePipeline(input: PipelineInput): Promise<PipelineResult> {
    const usage = this.budgetManager.getBudgetUsage();

    // Adjust quality based on budget remaining
    if (usage.daily.percentage > 90) {
      // Critical: Use cheapest options
      input.options = {
        ...input.options,
        assetSize: '512x512',
        assetQuality: 'standard',
        skipValidation: true,
        analyzeImage: false
      };
    } else if (usage.daily.percentage > 70) {
      // Warning: Use medium quality
      input.options = {
        ...input.options,
        assetSize: '1024x1024',
        assetQuality: 'standard',
        validationThreshold: 60
      };
    }
    // else: Use normal/high quality options

    const pipeline = new AIPipeline(this.router);
    return await pipeline.execute(input);
  }
}
```

---

## Cost Reduction Techniques

### 1. Skip Unnecessary Steps

```typescript
// Draft mode: minimal pipeline
const draft = await pipeline.execute({
  text: 'VW design',
  context: { theme: 'bw' },
  options: {
    analyzeImage: false,        // Save $0.005-$0.030
    skipValidation: true,       // Save $0.015-$0.035
    assetCount: 1,
    assetSize: '512x512'
  }
});
// Cost: ~$0.023 (prompt + asset only)

// Production mode: full pipeline for final assets
const final = await pipeline.execute({
  text: bestPrompt,
  context: { theme: 'bw' },
  options: {
    assetQuality: 'hd',
    assetSize: '1024x1024'
  }
});
```

### 2. Reuse Validated Prompts

```typescript
// Validate once
const prompts = await pipeline.generatePrompts({ text: 'VW design' }, context);
const validation = await pipeline.validatePrompt(prompts.primary, context);
// Cost: $0.015 (prompt) + $0.025 (validation) = $0.040

// Reuse for multiple assets
if (validation.passes) {
  // Generate 10 assets using same prompt
  for (let i = 0; i < 10; i++) {
    await pipeline.generateAssets(prompts.primary, context);
  }
  // Cost: $0.040 (one-time) + $0.003 × 10 = $0.070 total
  // vs $0.040 × 10 = $0.400 if validating each time
  // Savings: $0.330 (83%)
}
```

### 3. Batch Processing

```typescript
async function batchGenerate(descriptions: string[], context: any) {
  // Generate all prompts in one pass
  const allPrompts = await Promise.all(
    descriptions.map(text =>
      pipeline.generatePrompts({ text }, context)
    )
  );

  // Validate in batch (reuse same model instance)
  const validations = await Promise.all(
    allPrompts.map(p =>
      pipeline.validatePrompt(p.primary, context)
    )
  );

  // Generate assets for passing prompts
  const validPrompts = allPrompts.filter((_, i) => validations[i].passes);
  const assets = await Promise.all(
    validPrompts.map(p =>
      pipeline.generateAssets(p.primary, context, {
        count: 2,
        size: '512x512'
      })
    )
  );

  return assets;
}
```

### 4. Use Appropriate Image Sizes

```typescript
// Cost comparison for different sizes:
const sizes = {
  '256x256': 0.003,   // FLUX Schnell: Draft/thumbnail
  '512x512': 0.003,   // FLUX Schnell: Preview
  '1024x1024': 0.025, // FLUX Dev: Standard production
  '1024x1024 HD': 0.080, // DALL-E 3 HD: High-quality production
  '1792x1024': 0.120  // DALL-E 3 HD: Premium/hero images
};

// Strategy: Generate small first, upscale later if needed
const preview = await pipeline.generateAssets(prompt, context, {
  size: '512x512',
  count: 5
});
// Cost: $0.015 (5 × $0.003)

// Review previews, then generate HD version of best one
const final = await pipeline.generateAssets(bestPrompt, context, {
  size: '1024x1024',
  quality: 'hd'
});
// Cost: $0.080

// Total: $0.095 vs $0.400 (5 × $0.080) if generating all as HD
// Savings: $0.305 (76%)
```

### 5. Optimize Prompt Generation

```typescript
// Expensive: Generate many variations
const expensive = await pipeline.generatePrompts({ text }, context, {
  variations: 10,     // Each variation adds cost
  temperature: 0.9    // Higher temperature = longer generation
});
// Cost: ~$0.040

// Optimized: Fewer variations, focused temperature
const optimized = await pipeline.generatePrompts({ text }, context, {
  variations: 3,      // Sufficient for diversity
  temperature: 0.7    // Balanced creativity
});
// Cost: ~$0.025
// Savings: $0.015 (38%)
```

### 6. Smart Validation

```typescript
async function smartValidation(prompt: string, context: any) {
  // Quick validation first (cheaper model)
  const quickCheck = await pipeline.validatePrompt(prompt, context, {
    threshold: 50,
    strictMode: false
  });
  // Cost: $0.015 (Claude Haiku)

  // Only do thorough validation if quick check passes
  if (quickCheck.score >= 60) {
    const thorough = await pipeline.validatePrompt(prompt, context, {
      threshold: 70,
      strictMode: true,
      includeWolfsburgPrinciples: true
    });
    // Cost: $0.035 (Claude Opus)
    return thorough;
  }

  return quickCheck; // Failed quick check, no need for expensive validation
}
```

### 7. Cache Image Analysis

```typescript
class ImageAnalysisCache {
  private cache = new Map<string, any>();

  async analyze(file: File, pipeline: AIPipeline, context: any) {
    // Create cache key from file hash
    const arrayBuffer = await file.arrayBuffer();
    const hash = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const key = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Return cached result if available
    if (this.cache.has(key)) {
      console.log('Cache hit: $0 cost');
      return this.cache.get(key);
    }

    // Analyze and cache
    const result = await pipeline.analyzeImage(file, context, 'medium');
    this.cache.set(key, result);
    console.log('Cache miss: $0.015 cost');
    return result;
  }
}

// Usage
const cache = new ImageAnalysisCache();
const analysis1 = await cache.analyze(file, pipeline, context); // $0.015
const analysis2 = await cache.analyze(file, pipeline, context); // $0 (cached)
```

---

## Real-World Scenarios

### Scenario 1: Icon Set Generation (Low Budget)

**Goal:** Generate 20 icons for design system
**Budget:** $1.00
**Strategy:** Cost-optimized with minimal validation

```typescript
async function generateIconSet(themes: string[]) {
  const icons = [];

  for (const theme of themes) {
    const result = await pipeline.execute({
      text: `Simple VW ${theme} icon`,
      context: { theme: 'bw', mode: 'rational' },
      options: {
        analyzeImage: false,      // Save $0.015
        promptVariations: 1,      // Minimal variations
        skipValidation: true,     // Save $0.025 (trust AI-generated prompts)
        assetCount: 1,
        assetSize: '512x512',     // Smaller size
        assetQuality: 'standard'  // Standard quality
      }
    });

    icons.push(result.generatedAssets[0]);
  }

  return icons;
}

// Cost: 20 × $0.023 = $0.46 (well under budget)
```

### Scenario 2: Hero Image Creation (High Quality)

**Goal:** Generate 1 hero image for homepage
**Budget:** $5.00
**Strategy:** Quality-first with extensive validation

```typescript
async function generateHeroImage() {
  // Step 1: Generate multiple prompt variations
  const prompts = await pipeline.generatePrompts(
    { text: 'Iconic VW Beetle hero image for homepage' },
    { theme: 'color', vehicle: 'beetle', era: '1960s', mode: 'emotional' },
    { variations: 10, temperature: 0.8 }
  );
  // Cost: $0.030

  // Step 2: Validate all prompts
  const validated = [];
  for (const prompt of [prompts.primary, ...prompts.variations]) {
    const validation = await pipeline.validatePrompt(prompt, context, {
      threshold: 85,
      strictMode: true,
      includeWolfsburgPrinciples: true
    });
    // Cost: 11 × $0.035 = $0.385

    if (validation.passes) {
      validated.push({ prompt, score: validation.score });
    }
  }

  // Step 3: Generate previews from top 3 prompts
  const top3 = validated.sort((a, b) => b.score - a.score).slice(0, 3);
  const previews = await Promise.all(
    top3.map(({ prompt }) =>
      pipeline.generateAssets(prompt, context, {
        count: 2,
        size: '1024x1024',
        quality: 'standard'
      })
    )
  );
  // Cost: 6 × $0.040 = $0.240

  // Step 4: Generate final HD version of best preview
  const bestPrompt = top3[0].prompt;
  const final = await pipeline.generateAssets(bestPrompt, context, {
    count: 3,
    size: '1792x1024',
    quality: 'hd'
  });
  // Cost: 3 × $0.120 = $0.360

  // Total: $0.030 + $0.385 + $0.240 + $0.360 = $1.015
  return final;
}
```

### Scenario 3: Image Collection Analysis (Bulk Processing)

**Goal:** Analyze 100 user-uploaded VW images
**Budget:** $2.00
**Strategy:** Use cheapest provider, batch processing

```typescript
async function analyzeCollection(images: File[]) {
  const batchSize = 10;
  const analyses = [];

  // Process in batches to manage memory
  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(image =>
        pipeline.analyzeImage(
          image,
          { theme: 'color' },
          'low' // Low detail for bulk analysis
        )
      )
    );

    analyses.push(...batchResults);
  }

  // Cost: 100 × $0.005 = $0.50 (using Gemini Flash, low detail)
  return analyses;
}
```

### Scenario 4: Daily Asset Generation (Sustained Usage)

**Goal:** Generate 50 assets/day for social media
**Monthly Budget:** $300
**Strategy:** Balanced quality with caching and reuse

```typescript
class DailyAssetGenerator {
  private promptCache = new Map<string, any>();

  async generateDaily(count: number) {
    const dailyBudget = 300 / 30; // $10/day
    const targetCostPerAsset = dailyBudget / count; // $0.20/asset

    const assets = [];

    for (let i = 0; i < count; i++) {
      // Reuse prompts when possible
      const cacheKey = `daily-${new Date().toDateString()}-${i % 10}`;

      let prompt;
      if (this.promptCache.has(cacheKey)) {
        prompt = this.promptCache.get(cacheKey);
        console.log('Reusing cached prompt: $0 cost');
      } else {
        const generated = await pipeline.generatePrompts(
          { text: `VW daily asset ${i}` },
          context
        );
        const validated = await pipeline.validatePrompt(
          generated.primary,
          context
        );

        if (validated.passes) {
          prompt = generated.primary;
          this.promptCache.set(cacheKey, prompt);
        }
      }

      // Generate asset with balanced settings
      const asset = await pipeline.generateAssets(prompt, context, {
        count: 1,
        size: '1024x1024',
        quality: 'standard' // Use HD for special occasions
      });

      assets.push(asset);
    }

    return assets;
  }
}

// Average cost: ~$0.15/asset (prompt reuse saves ~25%)
// Daily cost: ~$7.50 (well under $10 budget)
// Monthly cost: ~$225 (under $300 budget with buffer)
```

---

## Monitoring and Analytics

### Real-Time Cost Tracking

```typescript
// Get current usage
const stats = router.getCostStats();

console.log('Daily usage:', stats.daily);
console.log('Monthly usage:', stats.monthly);
console.log('By provider:', stats.byProvider);
console.log('By task type:', stats.byTaskType);

// Check budget status
const usage = stats.budgetUsage;
console.log(`Daily: $${usage.daily.used} / $${usage.daily.limit} (${usage.daily.percentage}%)`);
console.log(`Monthly: $${usage.monthly.used} / $${usage.monthly.limit} (${usage.monthly.percentage}%)`);
```

### Generate Usage Reports

```typescript
import { UsageReporter } from '@vwx/ai-integration';

const costs = router.getCostStats().export();
const reporter = new UsageReporter(costs);

// Daily report
const dailyReport = reporter.generateDailyReport();
console.log(reporter.formatAsText(dailyReport));

// Output:
// === DAILY USAGE REPORT ===
//
// Total Cost: $12.50
// Total Requests: 45
//
// By Provider:
//   openai: $6.25 (20 requests)
//   anthropic: $3.75 (15 requests)
//   fal: $2.50 (10 requests)
//
// By Task Type:
//   prompt-generation: $4.50 (15 requests)
//   cultural-validation: $3.75 (15 requests)
//   asset-generation: $4.25 (15 requests)

// Detailed analytics
const detailed = reporter.generateDetailedReport(
  new Date('2024-01-01'),
  new Date('2024-01-31')
);

console.log('Average cost per request:', detailed.summary.averageCost);
console.log('Top expensive requests:', detailed.topExpensive);
console.log('Daily trend:', detailed.trends.daily);
```

### Cost Optimization Recommendations

```typescript
const recommendations = reporter.generateRecommendations(
  new Date('2024-01-01'),
  new Date()
);

console.log('Optimization recommendations:');
recommendations.forEach(rec => console.log('•', rec));

// Output examples:
// • Consider diversifying providers: openai accounts for 75% of costs
// • High volume of prompt-generation requests: Consider caching
// • Average cost per request is $0.1234: Review task configurations
// • Detected cost spike: Maximum daily cost ($45.00) is more than 2x average
```

### Custom Analytics Dashboard

```typescript
class CostDashboard {
  constructor(private router: AIRouter) {}

  async generateReport() {
    const costs = this.router.getCostStats();
    const reporter = new UsageReporter(costs.export());

    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
      realtime: {
        daily: costs.daily,
        monthly: costs.monthly,
        budgetUsage: costs.budgetUsage
      },
      breakdown: {
        byProvider: costs.byProvider,
        byTaskType: costs.byTaskType
      },
      trends: {
        daily: reporter.generateDailyReport().totalCost,
        monthly: reporter.generateMonthlyReport().totalCost
      },
      recommendations: reporter.generateRecommendations(thisMonth, today),
      alerts: this.checkAlerts()
    };
  }

  private checkAlerts(): string[] {
    const alerts = [];
    const usage = this.router.getCostStats().budgetUsage;

    if (usage.daily.percentage > 90) {
      alerts.push('CRITICAL: Daily budget 90% used');
    }
    if (usage.monthly.percentage > 90) {
      alerts.push('CRITICAL: Monthly budget 90% used');
    }

    return alerts;
  }
}
```

---

## Best Practices

### 1. Set Realistic Budgets

```typescript
// Development/Testing
const devBudget = {
  dailyLimit: 5.00,
  monthlyLimit: 100.00
};

// Production (Low Volume)
const prodLowBudget = {
  dailyLimit: 25.00,
  monthlyLimit: 500.00
};

// Production (High Volume)
const prodHighBudget = {
  dailyLimit: 100.00,
  monthlyLimit: 2000.00
};
```

### 2. Use Tiered Quality Levels

```typescript
enum QualityTier {
  DRAFT = 'draft',
  STANDARD = 'standard',
  PREMIUM = 'premium'
}

function getPipelineOptions(tier: QualityTier) {
  switch (tier) {
    case QualityTier.DRAFT:
      return {
        analyzeImage: false,
        skipValidation: true,
        assetSize: '512x512',
        assetQuality: 'standard'
      };

    case QualityTier.STANDARD:
      return {
        analyzeImage: false,
        validationThreshold: 70,
        assetSize: '1024x1024',
        assetQuality: 'standard'
      };

    case QualityTier.PREMIUM:
      return {
        analyzeImage: true,
        validationThreshold: 85,
        includeWolfsburgPrinciples: true,
        assetSize: '1024x1024',
        assetQuality: 'hd'
      };
  }
}
```

### 3. Implement Cost Estimation

```typescript
async function executeWithEstimate(pipeline: AIPipeline, input: PipelineInput) {
  // Estimate first
  const estimate = await pipeline.estimateCost(input);

  console.log(`Estimated cost: $${estimate.total.toFixed(4)}`);

  // Confirm before expensive operations
  if (estimate.total > 1.00) {
    const confirmed = await confirmExpensiveOperation(estimate.total);
    if (!confirmed) {
      throw new Error('Operation cancelled by user');
    }
  }

  // Execute
  return await pipeline.execute(input);
}
```

### 4. Monitor and Alert

```typescript
class CostMonitor {
  private alertCallbacks: ((alert: string) => void)[] = [];

  constructor(private router: AIRouter) {
    // Check budget every hour
    setInterval(() => this.checkBudget(), 60 * 60 * 1000);
  }

  onAlert(callback: (alert: string) => void) {
    this.alertCallbacks.push(callback);
  }

  private checkBudget() {
    const usage = this.router.getCostStats().budgetUsage;

    if (usage.daily.percentage > 90) {
      this.alert('Daily budget 90% used');
    }

    if (usage.monthly.percentage > 80) {
      this.alert('Monthly budget 80% used');
    }
  }

  private alert(message: string) {
    this.alertCallbacks.forEach(cb => cb(message));
  }
}

// Usage
const monitor = new CostMonitor(router);
monitor.onAlert(alert => {
  console.error('BUDGET ALERT:', alert);
  // Send email, Slack notification, etc.
});
```

### 5. Regular Cost Reviews

```typescript
async function weeklyReview(router: AIRouter) {
  const costs = router.getCostStats().export();
  const reporter = new UsageReporter(costs);

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const report = reporter.generateDetailedReport(lastWeek, new Date());
  const recommendations = reporter.generateRecommendations(lastWeek, new Date());

  // Log report
  console.log('Weekly Cost Review:');
  console.log('Total spent:', report.summary.totalCost);
  console.log('Average per request:', report.summary.averageCost);
  console.log('Most expensive provider:', report.breakdown.byProvider[0]);
  console.log('Recommendations:', recommendations);

  // Export for analysis
  saveToFile('weekly-review.json', JSON.stringify(report, null, 2));
}

// Run weekly
setInterval(() => weeklyReview(router), 7 * 24 * 60 * 60 * 1000);
```

---

## See Also

- **[PIPELINE_GUIDE.md](./PIPELINE_GUIDE.md)** - Complete pipeline usage guide
- **[WOLFSBURG_INTEGRATION.md](./WOLFSBURG_INTEGRATION.md)** - Cultural validation guide
- **[README.md](./README.md)** - Package overview and quick start

---

**VWX Design System v0.1.0** | **Phase 3 Complete** | **Cost Optimization Guide**
