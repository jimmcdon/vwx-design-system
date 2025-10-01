/**
 * AI Pipeline Types
 *
 * Phase 3: 4-step pipeline for culturally authentic VW asset generation
 * 1. Image Analysis (Gemini Vision/GPT-4 Vision)
 * 2. Prompt Generation (Claude/GPT-4)
 * 3. Cultural Validation (Claude + Wolfsburg principles)
 * 4. Asset Generation (DALL-E/Stable Diffusion/Flux)
 */

export interface PipelineContext {
  theme?: 'bw' | 'color' | 'patina';
  vehicle?: 'beetle' | 'bus' | 'karmann-ghia' | 'type-3';
  era?: '1950s' | '1960s' | '1970s';
  mode?: 'rational' | 'expressive' | 'hybrid';
  vehicleVariant?: 'lowlight' | 'barndoor' | 'oval-window' | 'split-window' | 'bay-window';
  section?: string;
  userInstructions?: string;
}

export interface ImageAnalysisResult {
  description: string;
  detectedVehicle?: string;
  detectedEra?: string;
  designElements: string[];
  colors: string[];
  composition: string;
  culturalNotes: string[];
  confidence: number;
  metadata?: {
    provider: string;
    model: string;
    tokensUsed: number;
    cost: number;
  };
}

export interface GeneratedPrompt {
  primary: string;
  variations: string[];
  negativePrompt?: string;
  styleKeywords: string[];
  technicalParameters: {
    aspectRatio?: string;
    quality?: string;
    style?: string;
  };
  confidence: number;
  metadata?: {
    provider: string;
    model: string;
    tokensUsed: number;
    cost: number;
  };
}

export interface CulturalValidationResult {
  score: number; // 0-100
  passes: boolean; // true if score >= threshold (default 70)
  breakdown: {
    periodAccuracy: number; // 0-25
    vehicleDesignFidelity: number; // 0-25
    culturalSensitivity: number; // 0-20
    materialAuthenticity: number; // 0-15
    communityValuesAlignment: number; // 0-15
  };
  wolfsburgPrinciples?: {
    ddbPrinciple: number; // 0-10 (Honesty & Clarity)
    pancakePrinciple: number; // 0-10 (Engineering Enables Form)
    airCooledPrinciple: number; // 0-10 (Durability & Reliability)
    characterCharm: number; // 0-10 (The "Bug" Principle)
  };
  issues: ValidationIssue[];
  suggestions: string[];
  metadata?: {
    provider: string;
    model: string;
    tokensUsed: number;
    cost: number;
  };
}

export interface ValidationIssue {
  severity: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  suggestion?: string;
}

export interface GeneratedAsset {
  url: string;
  format: 'png' | 'jpg' | 'svg' | 'webp';
  width: number;
  height: number;
  prompt: string;
  seed?: number;
  revisedPrompt?: string; // Some providers revise the prompt
  metadata?: {
    provider: string;
    model: string;
    cost: number;
    generationTime: number;
  };
}

export interface PipelineResult {
  success: boolean;
  stage: 'image-analysis' | 'prompt-generation' | 'cultural-validation' | 'asset-generation' | 'complete';
  imageAnalysis?: ImageAnalysisResult;
  generatedPrompts?: GeneratedPrompt;
  culturalValidation?: CulturalValidationResult;
  generatedAssets?: GeneratedAsset[];
  error?: {
    message: string;
    code: string;
    retryable: boolean;
  };
  totalCost: number;
  totalTime: number;
  metadata: {
    pipelineId: string;
    startTime: number;
    endTime?: number;
    providersUsed: string[];
  };
}

export interface PipelineOptions {
  // Image Analysis options
  analyzeImage?: boolean;
  analysisDetail?: 'low' | 'medium' | 'high';

  // Prompt Generation options
  promptVariations?: number; // Number of prompt variations (default: 3)
  promptTemperature?: number; // 0.0-1.0 (default: 0.7)
  includeNegativePrompt?: boolean;

  // Cultural Validation options
  validationThreshold?: number; // 0-100 (default: 70)
  strictMode?: boolean; // Fail if any critical issues found
  includeWolfsburgPrinciples?: boolean; // Add Wolfsburg bonus scoring

  // Asset Generation options
  assetCount?: number; // Number of assets to generate (default: 1)
  assetSize?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  assetQuality?: 'standard' | 'hd';
  assetStyle?: 'vivid' | 'natural';

  // Pipeline control
  skipValidation?: boolean; // Skip cultural validation step
  stopOnValidationFailure?: boolean; // Stop if validation fails (default: true)
  retryFailedSteps?: boolean; // Retry failed steps with fallback provider
}

export interface PipelineInput {
  // Text-to-image workflow
  text?: string;

  // Image-to-image workflow
  sourceImage?: File | Blob | string; // File, Blob, or URL

  // Pipeline context
  context: PipelineContext;

  // Pipeline options
  options?: PipelineOptions;
}
