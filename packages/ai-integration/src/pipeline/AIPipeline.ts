import { AIRouter } from '../router/AIRouter';
import { ImageAnalyzer } from './ImageAnalyzer';
import { PromptGenerator } from './PromptGenerator';
import { CulturalValidator } from './CulturalValidator';
import { AssetGenerator } from './AssetGenerator';
import { PipelineInput, PipelineResult, PipelineOptions } from './types';

/**
 * AI Pipeline - Complete 4-Step Orchestrator
 *
 * Orchestrates the full AI asset generation pipeline:
 * 1. Image Analysis (optional) - Analyze source images
 * 2. Prompt Generation - Create culturally-aware prompts
 * 3. Cultural Validation - Validate against Wolfsburg principles
 * 4. Asset Generation - Generate final assets
 *
 * Features:
 * - Automatic retry on failure
 * - Cost tracking across all steps
 * - Partial results on failure
 * - Validation-gated generation
 */
export class AIPipeline {
  private imageAnalyzer: ImageAnalyzer;
  private promptGenerator: PromptGenerator;
  private culturalValidator: CulturalValidator;
  private assetGenerator: AssetGenerator;

  constructor(router: AIRouter) {
    this.imageAnalyzer = new ImageAnalyzer(router);
    this.promptGenerator = new PromptGenerator(router);
    this.culturalValidator = new CulturalValidator(router);
    this.assetGenerator = new AssetGenerator(router);
  }

  /**
   * Execute the complete AI pipeline
   */
  async execute(input: PipelineInput): Promise<PipelineResult> {
    const pipelineId = this.generatePipelineId();
    const startTime = Date.now();
    const providersUsed = new Set<string>();

    let totalCost = 0;

    const result: PipelineResult = {
      success: false,
      stage: 'image-analysis',
      totalCost: 0,
      totalTime: 0,
      metadata: {
        pipelineId,
        startTime,
        providersUsed: [],
      },
    };

    try {
      // Step 1: Image Analysis (optional)
      if (input.sourceImage && input.options?.analyzeImage !== false) {
        console.log('[Pipeline] Step 1: Image Analysis');
        const analysisDetail = input.options?.analysisDetail || 'medium';

        result.imageAnalysis = await this.imageAnalyzer.analyze(
          input.sourceImage,
          input.context,
          analysisDetail
        );

        if (result.imageAnalysis.metadata?.provider) {
          providersUsed.add(result.imageAnalysis.metadata.provider);
        }
        totalCost += result.imageAnalysis.metadata?.cost || 0;

        console.log(`[Pipeline] Image analysis complete. Detected: ${result.imageAnalysis.detectedVehicle || 'unknown'}, Era: ${result.imageAnalysis.detectedEra || 'unknown'}`);
      }

      // Step 2: Prompt Generation
      result.stage = 'prompt-generation';
      console.log('[Pipeline] Step 2: Prompt Generation');

      const promptInput = {
        text: input.text,
        imageAnalysis: result.imageAnalysis,
      };

      result.generatedPrompts = await this.promptGenerator.generate(promptInput, input.context, {
        variations: input.options?.promptVariations || 3,
        temperature: input.options?.promptTemperature || 0.7,
        includeNegativePrompt: input.options?.includeNegativePrompt !== false,
      });

      if (result.generatedPrompts.metadata?.provider) {
        providersUsed.add(result.generatedPrompts.metadata.provider);
      }
      totalCost += result.generatedPrompts.metadata?.cost || 0;

      console.log(`[Pipeline] Generated ${result.generatedPrompts.variations.length + 1} prompts`);

      // Step 3: Cultural Validation
      if (!input.options?.skipValidation) {
        result.stage = 'cultural-validation';
        console.log('[Pipeline] Step 3: Cultural Validation');

        result.culturalValidation = await this.culturalValidator.validate(
          result.generatedPrompts,
          input.context,
          {
            threshold: input.options?.validationThreshold || 70,
            strictMode: input.options?.strictMode || false,
            includeWolfsburgPrinciples: input.options?.includeWolfsburgPrinciples !== false,
          }
        );

        if (result.culturalValidation.metadata?.provider) {
          providersUsed.add(result.culturalValidation.metadata.provider);
        }
        totalCost += result.culturalValidation.metadata?.cost || 0;

        console.log(`[Pipeline] Cultural validation: ${result.culturalValidation.score}/100 (${result.culturalValidation.passes ? 'PASS' : 'FAIL'})`);

        // Stop if validation fails and stopOnValidationFailure is true
        if (!result.culturalValidation.passes && input.options?.stopOnValidationFailure !== false) {
          const endTime = Date.now();
          return {
            ...result,
            success: false,
            stage: 'cultural-validation',
            totalCost,
            totalTime: endTime - startTime,
            error: {
              message: `Cultural validation failed with score ${result.culturalValidation.score}/100`,
              code: 'VALIDATION_FAILED',
              retryable: true,
            },
            metadata: {
              ...result.metadata,
              endTime,
              providersUsed: Array.from(providersUsed),
            },
          };
        }
      }

      // Step 4: Asset Generation
      result.stage = 'asset-generation';
      console.log('[Pipeline] Step 4: Asset Generation');

      result.generatedAssets = await this.assetGenerator.generate(
        result.generatedPrompts,
        input.context,
        {
          count: input.options?.assetCount || 1,
          size: input.options?.assetSize || '1024x1024',
          quality: input.options?.assetQuality || 'standard',
          style: input.options?.assetStyle || 'natural',
        }
      );

      result.generatedAssets.forEach((asset) => {
        if (asset.metadata?.provider) {
          providersUsed.add(asset.metadata.provider);
        }
        totalCost += asset.metadata?.cost || 0;
      });

      console.log(`[Pipeline] Generated ${result.generatedAssets.length} asset(s)`);

      // Pipeline complete
      result.stage = 'complete';
      result.success = true;
      const endTime = Date.now();

      return {
        ...result,
        totalCost,
        totalTime: endTime - startTime,
        metadata: {
          ...result.metadata,
          endTime,
          providersUsed: Array.from(providersUsed),
        },
      };
    } catch (error) {
      const endTime = Date.now();
      const err = error as Error;

      console.error(`[Pipeline] Error at stage ${result.stage}:`, err.message);

      return {
        ...result,
        success: false,
        totalCost,
        totalTime: endTime - startTime,
        error: {
          message: err.message,
          code: 'PIPELINE_ERROR',
          retryable: input.options?.retryFailedSteps !== false,
        },
        metadata: {
          ...result.metadata,
          endTime,
          providersUsed: Array.from(providersUsed),
        },
      };
    }
  }

  /**
   * Execute just the validation step (useful for testing prompts)
   */
  async validatePrompt(prompt: string, context: PipelineInput['context'], options?: PipelineOptions) {
    return this.culturalValidator.validate(prompt, context, {
      threshold: options?.validationThreshold || 70,
      strictMode: options?.strictMode || false,
      includeWolfsburgPrinciples: options?.includeWolfsburgPrinciples !== false,
    });
  }

  /**
   * Execute just the image analysis step
   */
  async analyzeImage(
    image: File | Blob | string,
    context: PipelineInput['context'],
    detail: 'low' | 'medium' | 'high' = 'medium'
  ) {
    return this.imageAnalyzer.analyze(image, context, detail);
  }

  /**
   * Execute just the prompt generation step
   */
  async generatePrompts(input: { text?: string; imageAnalysis?: any }, context: PipelineInput['context'], options?: PipelineOptions) {
    return this.promptGenerator.generate(input, context, {
      variations: options?.promptVariations || 3,
      temperature: options?.promptTemperature || 0.7,
      includeNegativePrompt: options?.includeNegativePrompt !== false,
    });
  }

  /**
   * Execute just the asset generation step
   */
  async generateAssets(prompt: string, context: PipelineInput['context'], options?: PipelineOptions) {
    return this.assetGenerator.generate(prompt, context, {
      count: options?.assetCount || 1,
      size: options?.assetSize || '1024x1024',
      quality: options?.assetQuality || 'standard',
      style: options?.assetStyle || 'natural',
    });
  }

  /**
   * Get cost estimate for a pipeline execution
   */
  async estimateCost(input: PipelineInput): Promise<{
    imageAnalysis: number;
    promptGeneration: number;
    culturalValidation: number;
    assetGeneration: number;
    total: number;
  }> {
    const costs = {
      imageAnalysis: 0,
      promptGeneration: 0.03, // Estimated
      culturalValidation: 0.025, // Estimated
      assetGeneration: 0.05, // Estimated per asset
      total: 0,
    };

    if (input.sourceImage && input.options?.analyzeImage !== false) {
      costs.imageAnalysis = 0.015; // Gemini Vision
    }

    costs.assetGeneration *= input.options?.assetCount || 1;

    costs.total = costs.imageAnalysis + costs.promptGeneration + costs.culturalValidation + costs.assetGeneration;

    return costs;
  }

  private generatePipelineId(): string {
    return `pipeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
