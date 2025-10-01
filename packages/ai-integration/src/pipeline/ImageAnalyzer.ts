import { AIRouter } from '../router/AIRouter';
import { ImageAnalysisResult, PipelineContext } from './types';

/**
 * Image Analyzer - Step 1 of AI Pipeline
 *
 * Analyzes uploaded images to understand:
 * - VW vehicle type and era
 * - Design elements and composition
 * - Color palette
 * - Cultural authenticity markers
 *
 * Uses: Gemini Pro Vision (preferred for cost) or GPT-4 Vision
 */
export class ImageAnalyzer {
  constructor(private router: AIRouter) {}

  async analyze(
    image: File | Blob | string,
    context: PipelineContext,
    detail: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<ImageAnalysisResult> {
    // Build analysis prompt
    const prompt = this.buildAnalysisPrompt(context, detail);

    // Convert image to base64 if needed
    const imageData = await this.prepareImageData(image);

    // Route to vision-capable provider
    const response = await this.router.route({
      type: 'image-analysis',
      input: {
        text: prompt,
        image: imageData,
        context,
      },
      options: {
        maxTokens: detail === 'high' ? 2000 : detail === 'medium' ? 1000 : 500,
      },
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Image analysis failed');
    }

    // Parse the structured response
    return this.parseAnalysisResponse(response.data, response.metadata);
  }

  private buildAnalysisPrompt(context: PipelineContext, detail: 'low' | 'medium' | 'high'): string {
    const detailInstructions = {
      low: 'Provide a brief analysis focusing on vehicle type and era.',
      medium: 'Provide a detailed analysis of the vehicle, design elements, and cultural context.',
      high: 'Provide an exhaustive analysis including all design elements, cultural markers, historical accuracy, and suggestions.',
    };

    let prompt = `Analyze this image of a classic Volkswagen vehicle (1938-1980). ${detailInstructions[detail]}\n\n`;

    prompt += 'Please identify:\n';
    prompt += '1. **Vehicle Type**: Beetle, Bus (Type 2), Karmann Ghia, Type 3, or other\n';
    prompt += '2. **Era**: 1940s, 1950s, 1960s, 1970s, or 1980s\n';
    prompt += '3. **Design Elements**: Key visual features (shapes, chrome, bumpers, windows, etc.)\n';
    prompt += '4. **Colors**: Primary and accent colors\n';
    prompt += '5. **Composition**: Layout, perspective, framing\n';
    prompt += '6. **Cultural Notes**: Any period-specific styling, customizations, or cultural markers\n\n';

    if (context.theme) {
      prompt += `Target theme: ${context.theme}\n`;
    }
    if (context.vehicle) {
      prompt += `Expected vehicle: ${context.vehicle}\n`;
    }
    if (context.era) {
      prompt += `Expected era: ${context.era}\n`;
    }

    prompt += '\nProvide your analysis in a structured format.';

    return prompt;
  }

  private async prepareImageData(image: File | Blob | string): Promise<string> {
    // If it's already a URL, return it
    if (typeof image === 'string') {
      return image;
    }

    // Convert File/Blob to base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });
  }

  private parseAnalysisResponse(data: any, metadata: any): ImageAnalysisResult {
    // Handle different provider response formats
    let analysisText = '';

    if (typeof data === 'string') {
      analysisText = data;
    } else if (data.analysis) {
      analysisText = data.analysis;
    } else if (data.text) {
      analysisText = data.text;
    }

    // Extract structured data from the analysis
    // This is a simple parser - in production, you might use LLM with structured output
    const result: ImageAnalysisResult = {
      description: analysisText,
      detectedVehicle: this.extractVehicle(analysisText),
      detectedEra: this.extractEra(analysisText),
      designElements: this.extractDesignElements(analysisText),
      colors: this.extractColors(analysisText),
      composition: this.extractComposition(analysisText),
      culturalNotes: this.extractCulturalNotes(analysisText),
      confidence: 0.85, // TODO: Extract from provider response if available
      metadata: {
        provider: metadata.provider,
        model: metadata.model,
        tokensUsed: metadata.tokensUsed || 0,
        cost: metadata.cost || 0,
      },
    };

    return result;
  }

  private extractVehicle(text: string): string | undefined {
    const vehicles = ['beetle', 'bus', 'type 2', 'karmann ghia', 'type 3'];
    const lowercaseText = text.toLowerCase();

    for (const vehicle of vehicles) {
      if (lowercaseText.includes(vehicle)) {
        if (vehicle === 'type 2') return 'bus';
        if (vehicle === 'karmann ghia') return 'karmann-ghia';
        return vehicle;
      }
    }

    return undefined;
  }

  private extractEra(text: string): string | undefined {
    const eras = ['1940s', '1950s', '1960s', '1970s', '1980s'];
    const lowercaseText = text.toLowerCase();

    for (const era of eras) {
      if (lowercaseText.includes(era)) {
        return era;
      }
    }

    return undefined;
  }

  private extractDesignElements(text: string): string[] {
    const elements: string[] = [];
    const keywords = [
      'split window',
      'oval window',
      'bay window',
      'chrome bumper',
      'chrome trim',
      'round headlights',
      'squared headlights',
      'tailfins',
      'two-tone',
      'sunroof',
      'running boards',
      'bumper guards',
    ];

    const lowercaseText = text.toLowerCase();
    keywords.forEach((keyword) => {
      if (lowercaseText.includes(keyword)) {
        elements.push(keyword);
      }
    });

    return elements;
  }

  private extractColors(text: string): string[] {
    const colors: string[] = [];
    const colorKeywords = [
      'blue',
      'red',
      'green',
      'yellow',
      'orange',
      'white',
      'black',
      'gray',
      'grey',
      'beige',
      'cream',
      'turquoise',
      'teal',
      'pink',
      'purple',
      'brown',
    ];

    const lowercaseText = text.toLowerCase();
    colorKeywords.forEach((color) => {
      if (lowercaseText.includes(color)) {
        colors.push(color);
      }
    });

    return [...new Set(colors)]; // Remove duplicates
  }

  private extractComposition(text: string): string {
    // Extract composition-related sentences
    const sentences = text.split(/[.!?]+/);
    const compositionSentences = sentences.filter(
      (s) =>
        s.toLowerCase().includes('composition') ||
        s.toLowerCase().includes('perspective') ||
        s.toLowerCase().includes('framing') ||
        s.toLowerCase().includes('angle')
    );

    return compositionSentences.join('. ').trim() || 'Standard composition';
  }

  private extractCulturalNotes(text: string): string[] {
    const notes: string[] = [];
    const sentences = text.split(/[.!?]+/);

    // Look for sentences about cultural context, customization, etc.
    const culturalSentences = sentences.filter(
      (s) =>
        s.toLowerCase().includes('cultural') ||
        s.toLowerCase().includes('period') ||
        s.toLowerCase().includes('era') ||
        s.toLowerCase().includes('custom') ||
        s.toLowerCase().includes('modified') ||
        s.toLowerCase().includes('authentic')
    );

    culturalSentences.forEach((s) => {
      const trimmed = s.trim();
      if (trimmed.length > 10) {
        notes.push(trimmed);
      }
    });

    return notes;
  }
}
