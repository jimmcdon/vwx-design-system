import { AIRouter } from '../router/AIRouter';
import { CulturalValidationResult, ValidationIssue, PipelineContext, GeneratedPrompt } from './types';

/**
 * Cultural Validator - Step 3 of AI Pipeline
 *
 * Validates generated prompts and content against VW heritage standards:
 * - Period accuracy (1938-1980)
 * - Vehicle design fidelity
 * - Cultural sensitivity
 * - Material authenticity
 * - Community values alignment
 * - Wolfsburg principles (DDB, Pancake, Air-Cooled, Character)
 *
 * Uses: Claude Opus (preferred for nuanced cultural analysis) or GPT-4
 */
export class CulturalValidator {
  constructor(private router: AIRouter) {}

  async validate(
    prompt: GeneratedPrompt | string,
    context: PipelineContext,
    options: {
      threshold?: number; // 0-100 (default: 70)
      strictMode?: boolean;
      includeWolfsburgPrinciples?: boolean;
    } = {}
  ): Promise<CulturalValidationResult> {
    const { threshold = 70, strictMode = false, includeWolfsburgPrinciples = true } = options;

    // Build validation prompt
    const validationPrompt = this.buildValidationPrompt(prompt, context, includeWolfsburgPrinciples);

    // Route to cultural validation provider (Claude preferred)
    const response = await this.router.route({
      type: 'cultural-validation',
      input: {
        text: validationPrompt,
        context,
      },
      options: {
        temperature: 0.3, // Lower temperature for consistent validation
        maxTokens: 2000,
      },
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Cultural validation failed');
    }

    // Parse the structured response
    const result = this.parseValidationResponse(response.data, response.metadata, threshold, strictMode);

    return result;
  }

  private buildValidationPrompt(
    prompt: GeneratedPrompt | string,
    context: PipelineContext,
    includeWolfsburgPrinciples: boolean
  ): string {
    const promptText = typeof prompt === 'string' ? prompt : prompt.primary;

    let validationPrompt = `You are a VW heritage expert and cultural authenticity validator. `;
    validationPrompt += `Your task is to evaluate this image generation prompt against authentic Volkswagen design standards (1938-1980).\n\n`;

    validationPrompt += `**Prompt to Validate:**\n${promptText}\n\n`;

    if (typeof prompt !== 'string' && prompt.variations.length > 0) {
      validationPrompt += `**Variations:**\n`;
      prompt.variations.forEach((v, i) => {
        validationPrompt += `${i + 1}. ${v}\n`;
      });
      validationPrompt += `\n`;
    }

    validationPrompt += `**Context:**\n`;
    if (context.theme) validationPrompt += `- Theme: ${context.theme}\n`;
    if (context.vehicle) validationPrompt += `- Vehicle: ${context.vehicle}\n`;
    if (context.era) validationPrompt += `- Era: ${context.era}\n`;
    if (context.mode) validationPrompt += `- Mode: ${context.mode}\n`;
    if (context.vehicleVariant) validationPrompt += `- Variant: ${context.vehicleVariant}\n`;
    validationPrompt += `\n`;

    validationPrompt += `**Validation Criteria (100 points total):**\n\n`;

    validationPrompt += `1. **Period Accuracy (25 points):**\n`;
    validationPrompt += `   - Does it reference authentic VW design from 1938-1980?\n`;
    validationPrompt += `   - Are colors, materials, and features period-appropriate?\n`;
    validationPrompt += `   - No anachronisms (modern elements in vintage contexts)?\n\n`;

    validationPrompt += `2. **Vehicle Design Fidelity (25 points):**\n`;
    validationPrompt += `   - Accurate vehicle proportions and shapes?\n`;
    validationPrompt += `   - Correct design details (windows, chrome, body lines)?\n`;
    validationPrompt += `   - Era-appropriate variants (split window, oval window, etc.)?\n\n`;

    validationPrompt += `3. **Cultural Sensitivity (20 points):**\n`;
    validationPrompt += `   - Respects VW community values (simplicity, adventure, freedom)?\n`;
    validationPrompt += `   - Avoids stereotypes or inappropriate associations?\n`;
    validationPrompt += `   - Honors the counter-culture heritage authentically?\n\n`;

    validationPrompt += `4. **Material Authenticity (15 points):**\n`;
    validationPrompt += `   - References authentic VW materials (chrome, steel, canvas)?\n`;
    validationPrompt += `   - Period-accurate color names (L87 Pearl White, L456 Lotus White)?\n`;
    validationPrompt += `   - Realistic textures and finishes?\n\n`;

    validationPrompt += `5. **Community Values Alignment (15 points):**\n`;
    validationPrompt += `   - Captures VW spirit (reliability, practicality, charm)?\n`;
    validationPrompt += `   - Authentic emotional resonance?\n`;
    validationPrompt += `   - Avoids commercial exploitation of heritage?\n\n`;

    if (includeWolfsburgPrinciples) {
      validationPrompt += `**Wolfsburg Principles (Bonus 0-40 points):**\n\n`;

      validationPrompt += `1. **DDB Principle - Honesty & Clarity (0-10 points):**\n`;
      validationPrompt += `   - Based on "Think Small" / "Lemon" advertising philosophy\n`;
      validationPrompt += `   - Clear, honest description without pretense?\n`;
      validationPrompt += `   - Direct communication, no marketing fluff?\n\n`;

      validationPrompt += `2. **Pancake Principle - Engineering Enables Form (0-10 points):**\n`;
      validationPrompt += `   - Based on Type 3's flat "pancake" engine innovation\n`;
      validationPrompt += `   - Does prompt show how VW engineering created unique aesthetics?\n`;
      validationPrompt += `   - References functional design beauty?\n\n`;

      validationPrompt += `3. **Air-Cooled Principle - Durability & Reliability (0-10 points):**\n`;
      validationPrompt += `   - Based on legendary VW air-cooled engine reliability\n`;
      validationPrompt += `   - References timeless, robust design?\n`;
      validationPrompt += `   - Emphasizes longevity over trends?\n\n`;

      validationPrompt += `4. **Character & Charm - The "Bug" Principle (0-10 points):**\n`;
      validationPrompt += `   - Based on Beetle's beloved personality\n`;
      validationPrompt += `   - Captures VW's friendly, approachable character?\n`;
      validationPrompt += `   - Shows personality in mechanical/design objects?\n\n`;
    }

    validationPrompt += `**Output Format (JSON):**\n`;
    validationPrompt += `Provide a detailed JSON response with:\n`;
    validationPrompt += `1. "score": Overall score (0-100)\n`;
    validationPrompt += `2. "breakdown": Scores for each of the 5 main criteria\n`;
    if (includeWolfsburgPrinciples) {
      validationPrompt += `3. "wolfsburgPrinciples": Scores for each Wolfsburg principle\n`;
    }
    validationPrompt += `4. "issues": Array of issues found (severity, category, message, suggestion)\n`;
    validationPrompt += `5. "suggestions": Array of improvement suggestions\n`;
    validationPrompt += `6. "passes": Boolean (true if score >= 70)\n\n`;

    validationPrompt += `**Be thorough and specific in your evaluation. Provide actionable feedback.**`;

    return validationPrompt;
  }

  private parseValidationResponse(
    data: any,
    metadata: any,
    threshold: number,
    strictMode: boolean
  ): CulturalValidationResult {
    // Handle different provider response formats
    let responseText = '';

    if (typeof data === 'string') {
      responseText = data;
    } else if (data.validation) {
      responseText = JSON.stringify(data.validation);
    } else if (data.text) {
      responseText = data.text;
    }

    // Try to parse as JSON
    let parsedData: any;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch =
        responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[1]);
      } else {
        parsedData = JSON.parse(responseText);
      }
    } catch {
      // If parsing fails, create a fallback validation result
      parsedData = this.fallbackValidation(responseText);
    }

    // Build result
    const breakdown = {
      periodAccuracy: parsedData.breakdown?.periodAccuracy || 0,
      vehicleDesignFidelity: parsedData.breakdown?.vehicleDesignFidelity || parsedData.breakdown?.vehicleFidelity || 0,
      culturalSensitivity: parsedData.breakdown?.culturalSensitivity || 0,
      materialAuthenticity: parsedData.breakdown?.materialAuthenticity || 0,
      communityValuesAlignment: parsedData.breakdown?.communityValuesAlignment || parsedData.breakdown?.communityValues || 0,
    };

    const score = parsedData.score || Object.values(breakdown).reduce((sum, val) => sum + val, 0);

    // Check for critical issues in strict mode
    const criticalIssues = parsedData.issues?.filter((issue: ValidationIssue) => issue.severity === 'critical') || [];
    const passes = strictMode ? score >= threshold && criticalIssues.length === 0 : score >= threshold;

    const result: CulturalValidationResult = {
      score,
      passes,
      breakdown,
      wolfsburgPrinciples: parsedData.wolfsburgPrinciples || undefined,
      issues: this.normalizeIssues(parsedData.issues || []),
      suggestions: parsedData.suggestions || [],
      metadata: {
        provider: metadata.provider,
        model: metadata.model,
        tokensUsed: metadata.tokensUsed || 0,
        cost: metadata.cost || 0,
      },
    };

    return result;
  }

  private normalizeIssues(issues: any[]): ValidationIssue[] {
    return issues.map((issue) => ({
      severity: issue.severity || 'warning',
      category: issue.category || 'general',
      message: issue.message || issue.description || 'Unknown issue',
      suggestion: issue.suggestion || undefined,
    }));
  }

  private fallbackValidation(text: string): any {
    // Simple fallback if JSON parsing fails
    // Analyze the text for positive/negative indicators

    const lowercaseText = text.toLowerCase();
    let score = 50; // Start at neutral

    // Positive indicators
    if (lowercaseText.includes('authentic')) score += 10;
    if (lowercaseText.includes('accurate')) score += 10;
    if (lowercaseText.includes('period-appropriate')) score += 10;
    if (lowercaseText.includes('excellent') || lowercaseText.includes('outstanding')) score += 15;
    if (lowercaseText.includes('good') || lowercaseText.includes('well-done')) score += 5;

    // Negative indicators
    if (lowercaseText.includes('anachronism')) score -= 15;
    if (lowercaseText.includes('inaccurate')) score -= 15;
    if (lowercaseText.includes('inappropriate')) score -= 20;
    if (lowercaseText.includes('poor') || lowercaseText.includes('weak')) score -= 10;

    score = Math.max(0, Math.min(100, score)); // Clamp to 0-100

    return {
      score,
      breakdown: {
        periodAccuracy: score * 0.25,
        vehicleDesignFidelity: score * 0.25,
        culturalSensitivity: score * 0.2,
        materialAuthenticity: score * 0.15,
        communityValuesAlignment: score * 0.15,
      },
      issues: [],
      suggestions: ['Unable to parse detailed validation. Please review manually.'],
      passes: score >= 70,
    };
  }
}
