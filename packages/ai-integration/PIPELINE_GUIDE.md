# AI Pipeline Usage Guide

Complete guide to using the VWX Design System 4-step AI pipeline for generating culturally authentic VW heritage assets.

## Table of Contents

- [Overview](#overview)
- [Pipeline Architecture](#pipeline-architecture)
- [Text-to-Image Workflow](#text-to-image-workflow)
- [Image-to-Image Workflow](#image-to-image-workflow)
- [Individual Step Execution](#individual-step-execution)
- [Pipeline Options](#pipeline-options)
- [Error Handling](#error-handling)
- [Cost Management](#cost-management)
- [Best Practices](#best-practices)
- [Real-World Examples](#real-world-examples)

---

## Overview

The VWX AI Pipeline is a 4-step orchestration system that generates culturally authentic VW design system assets:

1. **Image Analysis** (optional) - Analyze source images to extract VW design elements
2. **Prompt Generation** - Create culturally-aware prompts based on VW heritage
3. **Cultural Validation** - Validate prompts against Wolfsburg principles (0-100 score)
4. **Asset Generation** - Generate final visual assets using validated prompts

### When to Use the Pipeline

**Use the full pipeline when:**
- Generating design system assets (icons, patterns, illustrations)
- Creating VW-themed marketing materials
- Ensuring cultural authenticity is critical
- Budget tracking across all AI steps is needed

**Use individual steps when:**
- Testing prompt quality without generating assets
- Validating existing prompts
- Analyzing images without generation
- Debugging specific pipeline stages

---

## Pipeline Architecture

### Step 1: Image Analysis (Optional)

Analyzes uploaded images to detect:
- Vehicle type (Beetle, Bus, Karmann Ghia, Type 3)
- Era (1938-1980s)
- Colors and materials
- Design elements
- Cultural context

**Providers:** Google Gemini Vision (default), GPT-4 Vision, Claude 3 Vision

**Cost:** $0.015 per image (Gemini), $0.03 (GPT-4)

### Step 2: Prompt Generation

Generates culturally-aware image generation prompts:
- Primary prompt optimized for asset generation
- Multiple variations for diversity
- Negative prompts to avoid common issues
- Context-aware (theme, vehicle, era)
- Incorporates Wolfsburg principles

**Providers:** OpenAI GPT-4 (default), Claude Opus, OpenRouter

**Cost:** $0.02-$0.03 per generation

### Step 3: Cultural Validation

Validates prompts against VW heritage standards:
- 5 main criteria (100 points total)
  - Period Accuracy (25 pts)
  - Vehicle Design Fidelity (25 pts)
  - Cultural Sensitivity (20 pts)
  - Material Authenticity (15 pts)
  - Community Values Alignment (15 pts)
- 4 Wolfsburg principles (bonus 0-40 pts)
  - DDB Principle - Honesty & Clarity
  - Pancake Principle - Engineering Enables Form
  - Air-Cooled Principle - Durability & Reliability
  - Character & Charm - The "Bug" Principle

**Providers:** Anthropic Claude (preferred), GPT-4

**Cost:** $0.025 per validation

### Step 4: Asset Generation

Generates final visual assets:
- Multiple sizes (256x256 to 1792x1024)
- Quality options (standard, HD)
- Style options (vivid, natural)
- Multiple variations per prompt

**Providers:** FAL.ai FLUX (default), OpenAI DALL-E 3

**Cost:** $0.003-$0.12 per image depending on size/quality

---

## Text-to-Image Workflow

### Basic Usage

```typescript
import { AIPipeline, createAIRouter } from '@vwx/ai-integration';

// Create router with API keys
const router = createAIRouter({
  providers: {
    openai: { apiKey: process.env.VITE_OPENAI_API_KEY },
    anthropic: { apiKey: process.env.VITE_ANTHROPIC_API_KEY },
    google: { apiKey: process.env.VITE_GOOGLE_AI_API_KEY },
    fal: { apiKey: process.env.VITE_FAL_API_KEY }
  },
  routing: { strategy: 'cost-optimized' }
});

// Create pipeline
const pipeline = new AIPipeline(router);

// Execute
const result = await pipeline.execute({
  text: 'Classic VW Beetle dashboard with chrome details',
  context: {
    theme: 'bw',          // 'bw', 'color', or 'patina'
    vehicle: 'beetle',    // 'beetle', 'bus', 'karmann-ghia', 'type-3'
    era: '1960s',         // '1938-1950', '1950s', '1960s', '1970s', '1980s'
    mode: 'rational'      // 'rational' or 'emotional'
  }
});

if (result.success) {
  console.log('Cultural Score:', result.culturalValidation?.score);
  console.log('Assets:', result.generatedAssets);
  console.log('Total Cost:', result.totalCost);
}
```

### Advanced Configuration

```typescript
const result = await pipeline.execute({
  text: 'VW Bus with split windows and two-tone paint',
  context: {
    theme: 'color',
    vehicle: 'bus',
    era: '1960s',
    mode: 'emotional',
    vehicleVariant: 'deluxe', // Optional: 'standard', 'deluxe', 'custom'
    section: 'components'     // Optional: 'tokens', 'components', 'patterns'
  },
  options: {
    // Prompt generation
    promptVariations: 5,        // Number of prompt variations (default: 3)
    promptTemperature: 0.8,     // Creativity level 0-1 (default: 0.7)
    includeNegativePrompt: true,// Include negative prompt (default: true)

    // Cultural validation
    validationThreshold: 80,    // Minimum score to pass (default: 70)
    strictMode: true,           // Fail on any critical issues (default: false)
    includeWolfsburgPrinciples: true, // Include bonus scoring (default: true)
    skipValidation: false,      // Skip validation entirely (default: false)
    stopOnValidationFailure: true,    // Stop if validation fails (default: true)

    // Asset generation
    assetCount: 3,              // Number of assets to generate (default: 1)
    assetSize: '1024x1024',     // '256x256', '512x512', '1024x1024', '1792x1024'
    assetQuality: 'hd',         // 'standard' or 'hd'
    assetStyle: 'natural',      // 'vivid' or 'natural'

    // Pipeline behavior
    retryFailedSteps: true      // Retry failed steps once (default: true)
  }
});
```

---

## Image-to-Image Workflow

### Analyze and Recreate

Upload an existing VW image and generate similar assets:

```typescript
// From file upload
const fileInput = document.querySelector('#image-upload');
const file = fileInput.files[0];

const result = await pipeline.execute({
  sourceImage: file, // Can be File, Blob, or base64 data URL
  text: 'Generate variations of this VW design', // Optional additional guidance
  context: {
    theme: 'patina',
    vehicle: 'bus' // Will be validated against detected vehicle
  },
  options: {
    analyzeImage: true,         // Enable image analysis (default: true if sourceImage provided)
    analysisDetail: 'high',     // 'low', 'medium', 'high' (default: 'medium')
    assetCount: 4               // Generate 4 variations
  }
});

// Check what was detected
console.log('Detected vehicle:', result.imageAnalysis?.detectedVehicle);
console.log('Detected era:', result.imageAnalysis?.detectedEra);
console.log('Detected colors:', result.imageAnalysis?.colors);
console.log('Design elements:', result.imageAnalysis?.designElements);
```

### Style Transfer

Apply VW design system styling to existing images:

```typescript
const result = await pipeline.execute({
  sourceImage: modernCarPhoto,
  text: 'Convert to classic VW Beetle style with vintage patina finish',
  context: {
    theme: 'patina',
    vehicle: 'beetle',
    era: '1960s'
  },
  options: {
    analyzeImage: true,
    analysisDetail: 'high',
    assetStyle: 'natural',
    validationThreshold: 75 // Higher threshold for style transfer
  }
});
```

### From Base64

```typescript
// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const base64Image = await fileToBase64(file);

const result = await pipeline.execute({
  sourceImage: base64Image,
  context: { theme: 'color', vehicle: 'beetle' }
});
```

---

## Individual Step Execution

### Step 1: Image Analysis Only

```typescript
const analysis = await pipeline.analyzeImage(
  file,
  { theme: 'bw', vehicle: 'beetle' },
  'high' // detail level
);

console.log('Vehicle:', analysis.detectedVehicle);
console.log('Era:', analysis.detectedEra);
console.log('Colors:', analysis.colors);
console.log('Design elements:', analysis.designElements);
console.log('Cultural notes:', analysis.culturalNotes);
console.log('Cost:', analysis.metadata?.cost);
```

### Step 2: Prompt Generation Only

```typescript
const prompts = await pipeline.generatePrompts(
  {
    text: 'VW Beetle illustration',
    imageAnalysis: previousAnalysis // Optional: include prior analysis
  },
  { theme: 'color', vehicle: 'beetle', era: '1960s' },
  {
    variations: 5,
    temperature: 0.8,
    includeNegativePrompt: true
  }
);

console.log('Primary prompt:', prompts.primary);
console.log('Variations:', prompts.variations);
console.log('Negative prompt:', prompts.negativePrompt);
console.log('Wolfsburg principles:', prompts.wolfsburgPrinciples);
```

### Step 3: Cultural Validation Only

```typescript
const validation = await pipeline.validatePrompt(
  'A classic 1967 VW Beetle in original L87 Pearl White with chrome bumpers',
  { theme: 'bw', vehicle: 'beetle', era: '1960s' },
  {
    threshold: 70,
    strictMode: false,
    includeWolfsburgPrinciples: true
  }
);

console.log('Score:', validation.score, '/ 100');
console.log('Passes:', validation.passes);
console.log('Breakdown:', validation.breakdown);
console.log('Wolfsburg principles:', validation.wolfsburgPrinciples);
console.log('Issues:', validation.issues);
console.log('Suggestions:', validation.suggestions);
```

### Step 4: Asset Generation Only

```typescript
const assets = await pipeline.generateAssets(
  'Classic VW Beetle silhouette with chrome details',
  { theme: 'bw', vehicle: 'beetle' },
  {
    count: 3,
    size: '1024x1024',
    quality: 'hd',
    style: 'natural'
  }
);

console.log('Generated assets:', assets);
assets.forEach((asset, i) => {
  console.log(`Asset ${i}:`, asset.url);
  console.log('  Format:', asset.format);
  console.log('  Size:', asset.width, 'x', asset.height);
  console.log('  Cost:', asset.metadata?.cost);
});
```

---

## Pipeline Options

### Complete Options Reference

```typescript
interface PipelineOptions {
  // Image Analysis
  analyzeImage?: boolean;           // Default: true if sourceImage provided
  analysisDetail?: 'low' | 'medium' | 'high'; // Default: 'medium'

  // Prompt Generation
  promptVariations?: number;        // Default: 3
  promptTemperature?: number;       // Default: 0.7 (0-1)
  includeNegativePrompt?: boolean;  // Default: true

  // Cultural Validation
  validationThreshold?: number;     // Default: 70 (0-100)
  strictMode?: boolean;             // Default: false
  includeWolfsburgPrinciples?: boolean; // Default: true
  skipValidation?: boolean;         // Default: false
  stopOnValidationFailure?: boolean; // Default: true

  // Asset Generation
  assetCount?: number;              // Default: 1
  assetSize?: string;               // Default: '1024x1024'
  assetQuality?: 'standard' | 'hd'; // Default: 'standard'
  assetStyle?: 'vivid' | 'natural'; // Default: 'natural'

  // Pipeline Behavior
  retryFailedSteps?: boolean;       // Default: true
}
```

### Context Reference

```typescript
interface PipelineContext {
  theme: 'bw' | 'color' | 'patina';
  vehicle?: 'beetle' | 'bus' | 'karmann-ghia' | 'type-3';
  era?: '1938-1950' | '1950s' | '1960s' | '1970s' | '1980s';
  mode?: 'rational' | 'emotional';
  vehicleVariant?: string;          // 'standard', 'deluxe', 'custom', etc.
  section?: string;                 // 'tokens', 'components', 'patterns', etc.
}
```

---

## Error Handling

### Comprehensive Error Handling

```typescript
try {
  const result = await pipeline.execute({
    text: 'VW design',
    context: { theme: 'bw' }
  });

  if (!result.success) {
    // Handle pipeline failure
    console.error('Pipeline failed at stage:', result.stage);
    console.error('Error:', result.error?.message);

    // Check if retryable
    if (result.error?.retryable) {
      console.log('Error is retryable, attempting again...');
      // Retry logic here
    }

    // Partial results may still be available
    if (result.generatedPrompts) {
      console.log('Prompts were generated:', result.generatedPrompts);
    }
    if (result.culturalValidation) {
      console.log('Validation completed:', result.culturalValidation);
    }
  } else {
    // Success
    console.log('Pipeline completed successfully');
    console.log('Assets:', result.generatedAssets);
  }

} catch (error) {
  // Handle unexpected errors
  if (error.message.includes('Budget limit exceeded')) {
    console.error('Budget exceeded. Current usage:', router.getCostStats());
  } else if (error.message.includes('All providers failed')) {
    console.error('No providers available. Check circuit breaker status:',
                  router.getCircuitBreakerStatus());
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Retry Logic

```typescript
async function executeWithRetry(
  pipeline: AIPipeline,
  input: PipelineInput,
  maxRetries = 3
): Promise<PipelineResult> {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await pipeline.execute(input);

      if (result.success) {
        return result;
      }

      // Failed but not retryable
      if (!result.error?.retryable) {
        return result;
      }

      lastError = result.error;
      console.log(`Attempt ${i + 1} failed, retrying...`);

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));

    } catch (error) {
      lastError = error;
      console.error(`Attempt ${i + 1} threw error:`, error);
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}
```

### Fallback Strategies

```typescript
// Strategy 1: Degrade gracefully
async function executeWithFallback(pipeline: AIPipeline, input: PipelineInput) {
  // Try with full pipeline
  let result = await pipeline.execute(input);

  if (!result.success && result.stage === 'cultural-validation') {
    // Validation failed, try with lower threshold
    console.log('Lowering validation threshold...');
    result = await pipeline.execute({
      ...input,
      options: { ...input.options, validationThreshold: 50 }
    });
  }

  if (!result.success && result.stage === 'cultural-validation') {
    // Still failing, skip validation
    console.log('Skipping validation...');
    result = await pipeline.execute({
      ...input,
      options: { ...input.options, skipValidation: true }
    });
  }

  return result;
}

// Strategy 2: Use cheaper options on failure
async function executeWithCostFallback(pipeline: AIPipeline, input: PipelineInput) {
  try {
    // Try with HD quality
    return await pipeline.execute({
      ...input,
      options: { assetQuality: 'hd', assetSize: '1024x1024' }
    });
  } catch (error) {
    // Fallback to standard quality, smaller size
    console.log('HD generation failed, using standard...');
    return await pipeline.execute({
      ...input,
      options: { assetQuality: 'standard', assetSize: '512x512' }
    });
  }
}
```

---

## Cost Management

### Estimate Before Executing

```typescript
// Get cost estimate
const estimate = await pipeline.estimateCost({
  text: 'VW design',
  sourceImage: file, // Include if analyzing
  context: { theme: 'bw', vehicle: 'beetle' },
  options: {
    assetCount: 3,
    assetSize: '1024x1024',
    assetQuality: 'hd'
  }
});

console.log('Estimated costs:');
console.log('  Image analysis:', estimate.imageAnalysis);
console.log('  Prompt generation:', estimate.promptGeneration);
console.log('  Cultural validation:', estimate.culturalValidation);
console.log('  Asset generation:', estimate.assetGeneration);
console.log('  TOTAL:', estimate.total);

// Proceed only if affordable
if (estimate.total <= 0.50) {
  const result = await pipeline.execute(input);
}
```

### Track Costs During Execution

```typescript
const result = await pipeline.execute(input);

console.log('Actual costs:');
console.log('  Image analysis:', result.imageAnalysis?.metadata?.cost || 0);
console.log('  Prompt generation:', result.generatedPrompts?.metadata?.cost || 0);
console.log('  Cultural validation:', result.culturalValidation?.metadata?.cost || 0);
console.log('  Asset generation:',
  result.generatedAssets?.reduce((sum, a) => sum + (a.metadata?.cost || 0), 0) || 0
);
console.log('  TOTAL:', result.totalCost);
console.log('  Time:', result.totalTime, 'ms');
console.log('  Providers used:', result.metadata.providersUsed);
```

### Budget-Aware Execution

```typescript
import { BudgetManager } from '@vwx/ai-integration';

const costTracker = router.getCostTracker();
const budgetManager = new BudgetManager(costTracker, {
  dailyLimit: 50.00,
  monthlyLimit: 1000.00,
  warningThreshold: 0.8,
  criticalThreshold: 0.95
});

// Check budget before executing
const alerts = budgetManager.checkBudget();
if (alerts.some(a => a.level === 'critical')) {
  console.error('Critical budget alert:', alerts);
  throw new Error('Budget limit reached');
}

// Estimate and check affordability
const estimate = await pipeline.estimateCost(input);
const { canAfford, reason } = budgetManager.canAffordTask(estimate.total);

if (!canAfford) {
  console.error('Cannot afford task:', reason);
  throw new Error(`Budget insufficient: ${reason}`);
}

// Execute
const result = await pipeline.execute(input);
```

---

## Best Practices

### 1. Start with Lower Cost Options

```typescript
// Draft mode: fast and cheap
const draftResult = await pipeline.execute({
  text: 'VW concept',
  context: { theme: 'bw', vehicle: 'beetle' },
  options: {
    analyzeImage: false,      // Skip analysis if not needed
    promptVariations: 1,      // Fewer variations
    validationThreshold: 60,  // Lower threshold
    assetCount: 1,            // Single asset
    assetSize: '512x512',     // Smaller size
    assetQuality: 'standard'  // Standard quality
  }
});

// If draft looks good, generate final HD version
if (draftResult.success && draftResult.culturalValidation.score >= 70) {
  const finalResult = await pipeline.generateAssets(
    draftResult.generatedPrompts.primary,
    context,
    {
      count: 3,
      size: '1024x1024',
      quality: 'hd'
    }
  );
}
```

### 2. Reuse Validated Prompts

```typescript
// Validate once
const prompts = await pipeline.generatePrompts(
  { text: 'VW Beetle dashboard' },
  context
);

const validation = await pipeline.validatePrompt(
  prompts.primary,
  context
);

// If validation passes, reuse prompt for multiple assets
if (validation.passes) {
  const assets1 = await pipeline.generateAssets(prompts.primary, context);
  const assets2 = await pipeline.generateAssets(prompts.variations[0], context);
  const assets3 = await pipeline.generateAssets(prompts.variations[1], context);
}
```

### 3. Batch Similar Requests

```typescript
// Generate multiple related assets in one pipeline run
const result = await pipeline.execute({
  text: 'VW Beetle design system icons',
  context: { theme: 'bw', vehicle: 'beetle' },
  options: {
    promptVariations: 5,  // Multiple variations
    assetCount: 3         // Multiple assets per variation
  }
});

// Total: 3 assets from primary + 3 from each variation = 18 assets
```

### 4. Use Appropriate Detail Levels

```typescript
// Low detail: Quick analysis for basic detection
const quickAnalysis = await pipeline.analyzeImage(file, context, 'low');
// Cost: ~$0.005, Time: ~1s

// Medium detail: Balanced analysis (default)
const normalAnalysis = await pipeline.analyzeImage(file, context, 'medium');
// Cost: ~$0.015, Time: ~2s

// High detail: Comprehensive analysis for critical use
const deepAnalysis = await pipeline.analyzeImage(file, context, 'high');
// Cost: ~$0.03, Time: ~3s
```

### 5. Handle Validation Intelligently

```typescript
async function smartValidation(pipeline: AIPipeline, prompt: string, context: any) {
  // Always validate user-generated prompts
  if (prompt.includes('user-input')) {
    return await pipeline.validatePrompt(prompt, context, {
      threshold: 80,
      strictMode: true
    });
  }

  // For AI-generated prompts, use standard validation
  if (prompt.includes('ai-generated')) {
    return await pipeline.validatePrompt(prompt, context, {
      threshold: 70,
      strictMode: false
    });
  }

  // Skip validation for pre-approved templates
  if (isApprovedTemplate(prompt)) {
    return { score: 100, passes: true };
  }
}
```

---

## Real-World Examples

### Example 1: Generate Icon Set

```typescript
async function generateIconSet(theme: string, vehicle: string) {
  const icons = ['front-view', 'side-view', 'rear-view', 'detail'];
  const results = [];

  for (const icon of icons) {
    const result = await pipeline.execute({
      text: `Simple ${vehicle} ${icon} icon for design system`,
      context: {
        theme,
        vehicle,
        mode: 'rational',
        section: 'tokens'
      },
      options: {
        validationThreshold: 75,
        assetCount: 2,
        assetSize: '512x512',
        assetStyle: 'natural'
      }
    });

    if (result.success) {
      results.push({
        name: icon,
        assets: result.generatedAssets,
        score: result.culturalValidation?.score
      });
    }
  }

  return results;
}

// Usage
const beetleIcons = await generateIconSet('bw', 'beetle');
console.log('Generated', beetleIcons.length, 'icon sets');
```

### Example 2: Style Variation Explorer

```typescript
async function exploreStyleVariations(basePrompt: string, context: any) {
  const themes = ['bw', 'color', 'patina'];
  const variations = [];

  for (const theme of themes) {
    const result = await pipeline.execute({
      text: basePrompt,
      context: { ...context, theme },
      options: {
        promptVariations: 3,
        assetCount: 2,
        validationThreshold: 70
      }
    });

    if (result.success) {
      variations.push({
        theme,
        score: result.culturalValidation?.score,
        assets: result.generatedAssets
      });
    }
  }

  // Sort by cultural score
  return variations.sort((a, b) => b.score - a.score);
}

// Usage
const variations = await exploreStyleVariations(
  'Classic VW Bus at beach sunset',
  { vehicle: 'bus', era: '1970s' }
);
```

### Example 3: Image Analysis Pipeline

```typescript
async function analyzeVWCollection(images: File[]) {
  const analyses = [];

  for (const image of images) {
    const analysis = await pipeline.analyzeImage(
      image,
      { theme: 'color' },
      'high'
    );

    analyses.push({
      filename: image.name,
      vehicle: analysis.detectedVehicle,
      era: analysis.detectedEra,
      colors: analysis.colors,
      score: analysis.culturalNotes?.includes('authentic') ? 100 : 70
    });
  }

  // Group by vehicle type
  const byVehicle = analyses.reduce((acc, a) => {
    acc[a.vehicle] = acc[a.vehicle] || [];
    acc[a.vehicle].push(a);
    return acc;
  }, {});

  return byVehicle;
}
```

### Example 4: Automated Asset Generation System

```typescript
class VWAssetGenerator {
  constructor(private pipeline: AIPipeline) {}

  async generateComponentAssets(component: string, theme: string) {
    // Step 1: Generate prompts
    const prompts = await this.pipeline.generatePrompts(
      { text: `${component} component in VW design system` },
      { theme, mode: 'rational', section: 'components' }
    );

    // Step 2: Validate all variations
    const validatedPrompts = [];
    for (const prompt of [prompts.primary, ...prompts.variations]) {
      const validation = await this.pipeline.validatePrompt(prompt, { theme });
      if (validation.passes && validation.score >= 75) {
        validatedPrompts.push({ prompt, score: validation.score });
      }
    }

    // Step 3: Generate assets from top-scoring prompts
    const topPrompts = validatedPrompts
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const assets = [];
    for (const { prompt, score } of topPrompts) {
      const generated = await this.pipeline.generateAssets(
        prompt,
        { theme },
        { count: 2, size: '1024x1024', quality: 'hd' }
      );
      assets.push({ prompt, score, assets: generated });
    }

    return assets;
  }
}

// Usage
const generator = new VWAssetGenerator(pipeline);
const buttonAssets = await generator.generateComponentAssets('button', 'bw');
```

---

## See Also

- **[README.md](./README.md)** - Package overview and quick start
- **[COST_OPTIMIZATION.md](./COST_OPTIMIZATION.md)** - Detailed cost management strategies
- **[WOLFSBURG_INTEGRATION.md](./WOLFSBURG_INTEGRATION.md)** - Cultural validation deep dive
- **[PHASE3_PROGRESS.md](./PHASE3_PROGRESS.md)** - Implementation details and status

---

**VWX Design System v0.1.0** | **Phase 3 Complete** | **AI Pipeline Documentation**
