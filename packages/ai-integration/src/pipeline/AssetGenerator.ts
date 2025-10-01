import { AIRouter } from '../router/AIRouter';
import { GeneratedAsset, GeneratedPrompt, PipelineContext } from './types';

/**
 * Asset Generator - Step 4 of AI Pipeline
 *
 * Generates visual assets from validated prompts:
 * - Supports multiple image sizes and aspect ratios
 * - Handles multiple variations per prompt
 * - Optimizes for quality and cost
 *
 * Uses: FAL.ai (preferred for speed/cost) or DALL-E 3 (quality)
 */
export class AssetGenerator {
  constructor(private router: AIRouter) {}

  async generate(
    prompt: GeneratedPrompt | string,
    context: PipelineContext,
    options: {
      count?: number;
      size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
      quality?: 'standard' | 'hd';
      style?: 'vivid' | 'natural';
    } = {}
  ): Promise<GeneratedAsset[]> {
    const { count = 1, size = '1024x1024', quality = 'standard', style = 'natural' } = options;

    const promptText = typeof prompt === 'string' ? prompt : prompt.primary;
    const negativePrompt = typeof prompt !== 'string' ? prompt.negativePrompt : undefined;

    const assets: GeneratedAsset[] = [];

    // Generate multiple assets if requested
    for (let i = 0; i < count; i++) {
      const asset = await this.generateSingle(promptText, negativePrompt, context, {
        size,
        quality,
        style,
      });
      assets.push(asset);
    }

    return assets;
  }

  private async generateSingle(
    prompt: string,
    negativePrompt: string | undefined,
    context: PipelineContext,
    options: {
      size: string;
      quality: string;
      style: string;
    }
  ): Promise<GeneratedAsset> {
    const startTime = Date.now();

    // Build generation request
    const fullPrompt = this.buildFullPrompt(prompt, negativePrompt, context);

    // Route to image generation provider
    const response = await this.router.route({
      type: 'asset-generation',
      input: {
        text: fullPrompt,
        context,
      },
      options: {
        size: options.size,
        quality: options.quality,
        style: options.style,
      },
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Asset generation failed');
    }

    const generationTime = Date.now() - startTime;

    // Parse the image response
    return this.parseAssetResponse(response.data, response.metadata, prompt, generationTime);
  }

  private buildFullPrompt(prompt: string, negativePrompt: string | undefined, context: PipelineContext): string {
    let fullPrompt = prompt;

    // Add context-specific enhancements
    if (context.theme === 'bw') {
      if (!fullPrompt.toLowerCase().includes('black and white')) {
        fullPrompt += ', black and white photography';
      }
    } else if (context.theme === 'patina') {
      if (!fullPrompt.toLowerCase().includes('patina') && !fullPrompt.toLowerCase().includes('aged')) {
        fullPrompt += ', aged patina, vintage weathered look';
      }
    }

    // Add era-specific style notes if not already present
    if (context.era === '1950s' && !fullPrompt.includes('1950s')) {
      fullPrompt += ', 1950s mid-century modern aesthetic';
    } else if (context.era === '1960s' && !fullPrompt.includes('1960s')) {
      fullPrompt += ', 1960s vintage photography';
    } else if (context.era === '1970s' && !fullPrompt.includes('1970s')) {
      fullPrompt += ', 1970s retro aesthetic';
    }

    // Some providers support negative prompts in the main prompt
    if (negativePrompt) {
      // Note: This is provider-specific. DALL-E doesn't support negative prompts.
      // For providers that do (Stable Diffusion via FAL.ai), include it
      fullPrompt += `\n\nAvoid: ${negativePrompt}`;
    }

    return fullPrompt;
  }

  private parseAssetResponse(
    data: any,
    metadata: any,
    originalPrompt: string,
    generationTime: number
  ): GeneratedAsset {
    // Handle different provider response formats
    let imageUrl = '';
    let revisedPrompt: string | undefined;
    let width = 1024;
    let height = 1024;

    if (typeof data === 'string') {
      // Direct URL
      imageUrl = data;
    } else if (data.url) {
      imageUrl = data.url;
      revisedPrompt = data.revised_prompt || data.revisedPrompt;
    } else if (data.images && data.images.length > 0) {
      // Array of images (take first one)
      const image = data.images[0];
      imageUrl = image.url || image.image_url || image.imageUrl || '';
      revisedPrompt = image.revised_prompt || image.revisedPrompt;
      width = image.width || 1024;
      height = image.height || 1024;
    } else if (data.data && data.data.length > 0) {
      // OpenAI format
      const image = data.data[0];
      imageUrl = image.url || image.b64_json || '';
      revisedPrompt = image.revised_prompt;
    }

    // Determine format from URL or default to PNG
    let format: 'png' | 'jpg' | 'svg' | 'webp' = 'png';
    if (imageUrl) {
      if (imageUrl.includes('.jpg') || imageUrl.includes('.jpeg')) format = 'jpg';
      else if (imageUrl.includes('.svg')) format = 'svg';
      else if (imageUrl.includes('.webp')) format = 'webp';
    }

    const asset: GeneratedAsset = {
      url: imageUrl,
      format,
      width,
      height,
      prompt: originalPrompt,
      revisedPrompt,
      metadata: {
        provider: metadata.provider,
        model: metadata.model,
        cost: metadata.cost || 0,
        generationTime,
      },
    };

    return asset;
  }
}
