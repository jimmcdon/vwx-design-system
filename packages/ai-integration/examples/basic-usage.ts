/**
 * Basic Usage Examples for @vwx/ai-integration
 *
 * These examples demonstrate how to use the AI integration package
 * in the VWX Design System.
 */

import { createMockRouter, AITask, createAIRouter } from '../src/index';

// =============================================================================
// PHASE 1: MOCK USAGE (No API Keys Required)
// =============================================================================

async function phase1Examples() {
  console.log('=== Phase 1: Mock Examples ===\n');

  // Create a mock router
  const router = createMockRouter();

  // Example 1: Generate VW-themed prompts
  console.log('1. Generating prompts...');
  const promptTask: AITask = {
    type: 'prompt-generation',
    input: {
      text: 'Generate creative prompts for vintage VW Beetle illustrations',
      context: {
        theme: 'bw',
        vehicle: 'beetle',
        era: '60s',
        section: 'components',
      },
    },
    options: {
      temperature: 0.8,
      variations: 3,
    },
  };

  const promptResponse = await router.route(promptTask);
  console.log('Response:', JSON.stringify(promptResponse.data, null, 2));
  console.log(`Cost: $${promptResponse.metadata.cost.toFixed(4)}`);
  console.log(`Response time: ${promptResponse.metadata.responseTime}ms\n`);

  // Example 2: Validate cultural alignment
  console.log('2. Validating cultural alignment...');
  const validationTask: AITask = {
    type: 'cultural-validation',
    input: {
      text: 'Proposed design emphasizes air-cooled engineering heritage and timeless simplicity',
      context: {
        theme: 'patina',
        vehicle: 'bus',
        era: '70s',
        section: 'guidelines',
      },
    },
  };

  const validationResponse = await router.route(validationTask);
  console.log('Validation:', JSON.stringify(validationResponse.data, null, 2));
  console.log(`Score: ${validationResponse.data.score}\n`);

  // Example 3: Analyze an image
  console.log('3. Analyzing image...');
  const analysisTask: AITask = {
    type: 'image-analysis',
    input: {
      image: 'https://example.com/vw-beetle.jpg',
      context: {
        theme: 'color',
        vehicle: 'beetle',
        section: 'components',
      },
    },
  };

  const analysisResponse = await router.route(analysisTask);
  console.log('Analysis:', JSON.stringify(analysisResponse.data, null, 2));
  console.log(`Features detected: ${analysisResponse.data.features.join(', ')}\n`);

  // Example 4: Check costs
  console.log('4. Cost tracking...');
  const stats = router.getCostStats();
  console.log('Daily cost:', `$${stats.daily.toFixed(2)}`);
  console.log('Monthly cost:', `$${stats.monthly.toFixed(2)}`);
  console.log('By provider:', stats.byProvider);
  console.log('Budget usage:', stats.budgetUsage, '\n');

  // Example 5: Estimate costs before executing
  console.log('5. Cost estimation...');
  const estimate = await router.estimateCost({
    type: 'asset-generation',
    input: {
      text: 'Vintage VW Beetle silhouette',
    },
  });
  console.log('Estimated cost range:', `$${estimate.min} - $${estimate.max}`);
  console.log('Recommended:', `$${estimate.recommended.toFixed(4)}`);
  console.log('By provider:', estimate.byProvider, '\n');

  // Example 6: Check circuit breaker status
  console.log('6. Circuit breaker status...');
  const cbStatus = router.getCircuitBreakerStatus();
  console.log('Circuit breaker status:', cbStatus, '\n');
}

// =============================================================================
// PHASE 3: REAL API USAGE (Requires API Keys)
// =============================================================================

async function phase3Examples() {
  console.log('=== Phase 3: Real API Examples ===\n');

  // Configuration with real API keys (from environment)
  const router = createAIRouter({
    providers: {
      openrouter: {
        apiKey: process.env.OPENROUTER_API_KEY || 'your-key-here',
        baseUrl: 'https://openrouter.ai/api/v1',
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY || 'your-key-here',
      },
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY || 'your-key-here',
      },
    },
    routing: {
      strategy: 'cost-optimized',
      fallbackEnabled: true,
      preferredProviders: ['openrouter', 'anthropic'],
    },
    costTracking: {
      enabled: true,
      dailyLimit: 50.0,
      monthlyLimit: 1000.0,
      alertThreshold: 0.8,
    },
  });

  // Same code as Phase 1 - now makes real API calls!
  console.log('1. Real prompt generation...');
  const response = await router.route({
    type: 'prompt-generation',
    input: {
      text: 'Generate prompts for VW Beetle artwork',
    },
  });

  console.log('Real response:', response.data);
  console.log(`Actual cost: $${response.metadata.cost.toFixed(4)}`);
  console.log(`Provider used: ${response.metadata.provider}`);
  console.log(`Model: ${response.metadata.model}\n`);
}

// =============================================================================
// ADVANCED EXAMPLES
// =============================================================================

async function advancedExamples() {
  console.log('=== Advanced Examples ===\n');

  const router = createMockRouter();

  // Example 1: Different routing strategies
  console.log('1. Testing routing strategies...');

  const task: AITask = {
    type: 'prompt-generation',
    input: { text: 'test' },
  };

  // Cost-optimized
  const costRouter = createMockRouter();
  const costResponse = await costRouter.route(task);
  console.log(
    `Cost-optimized: ${costResponse.metadata.provider} @ $${costResponse.metadata.cost}`
  );

  // Example 2: Budget management
  console.log('\n2. Budget management...');

  // Make multiple requests
  for (let i = 0; i < 5; i++) {
    try {
      await router.route(task);
      console.log(`Request ${i + 1}: Success`);
    } catch (error) {
      console.log(`Request ${i + 1}: Failed -`, (error as Error).message);
    }
  }

  const finalStats = router.getCostStats();
  console.log('Final daily cost:', `$${finalStats.daily.toFixed(2)}`);

  // Example 3: Handling failures with circuit breaker
  console.log('\n3. Circuit breaker demonstration...');
  // (Would need to simulate failures - see tests for examples)

  console.log('Circuit breaker prevents cascading failures');
  console.log('Automatically recovers after timeout');
  console.log('Can be manually reset if needed\n');
}

// =============================================================================
// INTEGRATION WITH VWX DESIGN SYSTEM
// =============================================================================

async function vwxIntegrationExample() {
  console.log('=== VWX Design System Integration ===\n');

  const router = createMockRouter();

  // Scenario: User uploads a VW photo for style analysis
  console.log('Scenario: Photo Style Analysis\n');

  const userPhoto = 'user-uploaded-beetle.jpg';

  // Step 1: Analyze the image
  console.log('Step 1: Analyzing uploaded photo...');
  const analysis = await router.route({
    type: 'image-analysis',
    input: {
      image: userPhoto,
      context: {
        theme: 'color',
        vehicle: 'beetle',
        section: 'components',
      },
    },
  });

  console.log('Analysis result:', analysis.data);

  // Step 2: Generate themed prompts based on analysis
  console.log('\nStep 2: Generating themed prompts...');
  const prompts = await router.route({
    type: 'prompt-generation',
    input: {
      text: `Generate prompts inspired by: ${analysis.data.culturalContext}`,
      context: {
        theme: 'color',
        vehicle: 'beetle',
        section: 'patterns',
      },
    },
  });

  console.log('Generated prompts:', prompts.data.prompts);

  // Step 3: Validate alignment with VW heritage
  console.log('\nStep 3: Validating heritage alignment...');
  for (const prompt of prompts.data.prompts) {
    const validation = await router.route({
      type: 'cultural-validation',
      input: {
        text: prompt,
        context: {
          theme: 'color',
          vehicle: 'beetle',
          section: 'patterns',
        },
      },
    });

    console.log(`Prompt: "${prompt}"`);
    console.log(`Valid: ${validation.data.valid}, Score: ${validation.data.score}`);
    console.log(`Feedback: ${validation.data.feedback}\n`);
  }

  // Step 4: Generate assets (when approved)
  console.log('Step 4: Generating visual assets...');
  const asset = await router.route({
    type: 'asset-generation',
    input: {
      text: prompts.data.prompts[0], // Use best prompt
      context: {
        theme: 'color',
        vehicle: 'beetle',
        section: 'patterns',
      },
    },
    options: {
      variations: 2,
    },
  });

  console.log('Generated asset:', asset.data.assetUrl);
  console.log(`Dimensions: ${asset.data.dimensions.width}x${asset.data.dimensions.height}\n`);

  // Step 5: Report total cost
  const totalCost = router.getCostStats();
  console.log('Total workflow cost:', `$${totalCost.daily.toFixed(4)}`);
}

// =============================================================================
// RUN EXAMPLES
// =============================================================================

async function main() {
  try {
    await phase1Examples();
    console.log('\n' + '='.repeat(80) + '\n');

    // Uncomment when you have API keys for Phase 3
    // await phase3Examples();
    // console.log('\n' + '='.repeat(80) + '\n');

    await advancedExamples();
    console.log('\n' + '='.repeat(80) + '\n');

    await vwxIntegrationExample();
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { phase1Examples, phase3Examples, advancedExamples, vwxIntegrationExample };
