import { AIRouter } from '../router/AIRouter';
import { GeneratedPrompt, PipelineContext, ImageAnalysisResult } from './types';

/**
 * Prompt Generator - Step 2 of AI Pipeline
 *
 * Generates high-quality prompts for image generation that:
 * - Incorporate VW design language and era-specific details
 * - Use proper artistic terminology
 * - Include negative prompts to avoid common issues
 * - Reference Wolfsburg principles when applicable
 *
 * Uses: GPT-4 (preferred) or Claude Sonnet
 */
export class PromptGenerator {
  constructor(private router: AIRouter) {}

  async generate(
    input: {
      text?: string;
      imageAnalysis?: ImageAnalysisResult;
    },
    context: PipelineContext,
    options: {
      variations?: number;
      temperature?: number;
      includeNegativePrompt?: boolean;
    } = {}
  ): Promise<GeneratedPrompt> {
    const { variations = 3, temperature = 0.7, includeNegativePrompt = true } = options;

    // Build prompt generation instructions
    const systemPrompt = this.buildSystemPrompt(context);
    const userPrompt = this.buildUserPrompt(input, context, variations, includeNegativePrompt);

    // Route to text generation provider
    const response = await this.router.route({
      type: 'prompt-generation',
      input: {
        text: `${systemPrompt}\n\n${userPrompt}`,
        context,
      },
      options: {
        temperature,
        maxTokens: 1500,
      },
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Prompt generation failed');
    }

    // Parse the structured response
    return this.parsePromptResponse(response.data, response.metadata);
  }

  private buildSystemPrompt(context: PipelineContext): string {
    let prompt = `You are an expert prompt engineer specializing in classic Volkswagen (1938-1980) design and vintage automotive photography. `;
    prompt += `Your task is to create detailed, high-quality prompts for AI image generation that capture authentic VW heritage.\n\n`;

    prompt += `**VW Design Eras:**\n`;
    prompt += `- 1950s: Mid-Century Modern, pastel colors, chrome details, oval windows, post-war optimism\n`;
    prompt += `- 1960s: Psychedelic counter-culture, vibrating colors, split windows, DDB "Think Small" minimalism\n`;
    prompt += `- 1970s: Funk & Retrofuturism, earth tones, bay windows, disco aesthetic, practical evolution\n\n`;

    prompt += `**VW Vehicle Archetypes:**\n`;
    prompt += `- Beetle: Rounded organic curves, friendly "bug" personality, rear-engine hump\n`;
    prompt += `- Bus (Type 2): Boxy utilitarian, two-tone color blocking, large windows, communal spirit\n`;
    prompt += `- Karmann Ghia: Sleek Italian-inspired elegance, low profile, refined proportions\n`;
    prompt += `- Type 3: Modern angular lines, flat "pancake" engine, sophisticated restraint\n\n`;

    prompt += `**Wolfsburg Principles:**\n`;
    prompt += `1. DDB Principle (Honesty & Clarity): Clean, honest design without pretense\n`;
    prompt += `2. Pancake Principle (Engineering Enables Form): Innovative engineering creates unique aesthetics\n`;
    prompt += `3. Air-Cooled Principle (Durability): Timeless, robust, reliable design\n`;
    prompt += `4. Character & Charm (The "Bug"): Personality and warmth in mechanical objects\n\n`;

    if (context.theme) {
      prompt += `**Target Theme:** ${context.theme}\n`;
      if (context.theme === 'bw') {
        prompt += `- Black & white, high contrast, print-inspired, timeless clarity\n`;
      } else if (context.theme === 'color') {
        prompt += `- Full VW brand colors, VW Blue (#003d7a), Beetle Red, Bus Orange, vibrant\n`;
      } else if (context.theme === 'patina') {
        prompt += `- Aged aesthetic, rust, weathered textures, vintage feel, authentic wear\n`;
      }
      prompt += `\n`;
    }

    if (context.mode) {
      prompt += `**Design Mode:** ${context.mode}\n`;
      if (context.mode === 'rational') {
        prompt += `- DDB "Think Small" advertising style, Swiss Design, mathematical grids, Helvetica, generous whitespace\n`;
      } else if (context.mode === 'expressive') {
        prompt += `- Psychedelic counter-culture, organic layouts, melting fonts, vibrating colors, feeling over logic\n`;
      } else {
        prompt += `- Hybrid approach balancing clarity with personality\n`;
      }
      prompt += `\n`;
    }

    return prompt;
  }

  private buildUserPrompt(
    input: { text?: string; imageAnalysis?: ImageAnalysisResult },
    context: PipelineContext,
    variations: number,
    includeNegativePrompt: boolean
  ): string {
    let prompt = `Create ${variations} detailed prompts for generating VW-themed images.\n\n`;

    if (input.text) {
      prompt += `**User Request:** ${input.text}\n\n`;
    }

    if (input.imageAnalysis) {
      prompt += `**Image Analysis:**\n`;
      prompt += `- Vehicle: ${input.imageAnalysis.detectedVehicle || 'unknown'}\n`;
      prompt += `- Era: ${input.imageAnalysis.detectedEra || 'unknown'}\n`;
      prompt += `- Design Elements: ${input.imageAnalysis.designElements.join(', ')}\n`;
      prompt += `- Colors: ${input.imageAnalysis.colors.join(', ')}\n`;
      prompt += `- Composition: ${input.imageAnalysis.composition}\n`;
      if (input.imageAnalysis.culturalNotes.length > 0) {
        prompt += `- Cultural Notes: ${input.imageAnalysis.culturalNotes.join('; ')}\n`;
      }
      prompt += `\n`;
    }

    if (context.vehicle) {
      prompt += `**Vehicle Type:** ${context.vehicle}\n`;
    }
    if (context.era) {
      prompt += `**Era:** ${context.era}\n`;
    }
    if (context.vehicleVariant) {
      prompt += `**Vehicle Variant:** ${context.vehicleVariant}\n`;
    }
    if (context.userInstructions) {
      prompt += `**Additional Instructions:** ${context.userInstructions}\n`;
    }

    prompt += `\n**Output Format:**\n`;
    prompt += `Provide a JSON response with:\n`;
    prompt += `1. "primary": The best, most detailed prompt\n`;
    prompt += `2. "variations": Array of ${variations - 1} alternative prompts\n`;
    if (includeNegativePrompt) {
      prompt += `3. "negativePrompt": What to avoid (modern elements, anachronisms, low quality)\n`;
    }
    prompt += `4. "styleKeywords": Array of key artistic style terms\n`;
    prompt += `5. "technicalParameters": Suggested aspect ratio, quality, style settings\n\n`;

    prompt += `**Requirements:**\n`;
    prompt += `- Include specific VW design details (window types, chrome, body shapes)\n`;
    prompt += `- Reference period-accurate colors and materials\n`;
    prompt += `- Use professional photography/illustration terminology\n`;
    prompt += `- Avoid anachronisms (no modern elements in vintage scenes)\n`;
    prompt += `- Capture the emotional essence of VW culture (adventure, simplicity, freedom)\n`;

    return prompt;
  }

  private parsePromptResponse(data: any, metadata: any): GeneratedPrompt {
    // Handle different provider response formats
    let responseText = '';

    if (typeof data === 'string') {
      responseText = data;
    } else if (data.prompts) {
      responseText = JSON.stringify(data.prompts);
    } else if (data.text) {
      responseText = data.text;
    }

    // Try to parse as JSON
    let parsedData: any;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[1]);
      } else {
        parsedData = JSON.parse(responseText);
      }
    } catch {
      // If parsing fails, create a structured response from the text
      parsedData = this.fallbackParsing(responseText);
    }

    const result: GeneratedPrompt = {
      primary: parsedData.primary || parsedData.prompt || responseText.split('\n\n')[0] || '',
      variations: parsedData.variations || parsedData.alternativePrompts || [],
      negativePrompt: parsedData.negativePrompt || parsedData.negative || undefined,
      styleKeywords: parsedData.styleKeywords || parsedData.keywords || [],
      technicalParameters: {
        aspectRatio: parsedData.technicalParameters?.aspectRatio || parsedData.aspectRatio || '1:1',
        quality: parsedData.technicalParameters?.quality || parsedData.quality || 'high',
        style: parsedData.technicalParameters?.style || parsedData.style || 'natural',
      },
      confidence: 0.9, // High confidence for structured prompt generation
      metadata: {
        provider: metadata.provider,
        model: metadata.model,
        tokensUsed: metadata.tokensUsed || 0,
        cost: metadata.cost || 0,
      },
    };

    return result;
  }

  private fallbackParsing(text: string): any {
    // Simple fallback if JSON parsing fails
    const lines = text.split('\n').filter((line) => line.trim().length > 0);

    return {
      primary: lines[0] || 'Classic Volkswagen Beetle, vintage photography',
      variations: lines.slice(1, 3),
      negativePrompt: 'modern cars, contemporary elements, low quality, blurry',
      styleKeywords: ['vintage', 'classic', 'automotive', 'retro'],
      technicalParameters: {
        aspectRatio: '1:1',
        quality: 'high',
        style: 'natural',
      },
    };
  }
}
