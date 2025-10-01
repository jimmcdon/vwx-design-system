import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { PipelineResult, PipelineInput } from '../../../../packages/ai-integration/src/pipeline/types';

const meta: Meta = {
  title: 'AI Integration/Pipeline',
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['text-to-image', 'image-to-image', 'step-by-step'],
      description: 'Pipeline execution mode',
    },
    theme: {
      control: 'select',
      options: ['bw', 'color', 'patina'],
      description: 'VWX visual theme',
    },
    vehicle: {
      control: 'select',
      options: ['beetle', 'bus', 'karmann-ghia', 'type-3'],
      description: 'VW vehicle archetype',
    },
    era: {
      control: 'select',
      options: ['1950s', '1960s', '1970s'],
      description: 'Historical era',
    },
    includeWolfsburg: {
      control: 'boolean',
      description: 'Include Wolfsburg principle validation',
    },
  },
};

export default meta;
type Story = StoryObj;

// Mock pipeline result data
const mockTextToImageResult: PipelineResult = {
  success: true,
  stage: 'complete',
  imageAnalysis: undefined, // Not used in text-to-image
  generatedPrompts: {
    primary: 'A classic 1960s VW Beetle in vibrant VW Blue, parked on a scenic coastal highway during golden hour. The iconic rounded silhouette is perfectly framed against an orange sunset sky. Vintage film photography aesthetic with subtle grain.',
    variations: [
      'Classic Volkswagen Beetle, 1960s era, VW Blue paint, coastal road, sunset lighting, vintage photography style',
      'Vintage VW Bug in signature blue, oceanside setting, warm evening light, retro film aesthetic',
    ],
    negativePrompt: 'modern elements, digital art, oversaturated, unrealistic proportions, cartoon style',
    styleKeywords: ['vintage photography', 'film grain', 'golden hour', 'coastal', 'classic automotive'],
    technicalParameters: {
      aspectRatio: '16:9',
      quality: 'hd',
      style: 'natural',
    },
    confidence: 0.92,
    metadata: {
      provider: 'Anthropic',
      model: 'claude-3-sonnet-20240229',
      tokensUsed: 487,
      cost: 0.0024,
    },
  },
  culturalValidation: {
    score: 88,
    passes: true,
    breakdown: {
      periodAccuracy: 23,
      vehicleDesignFidelity: 24,
      culturalSensitivity: 18,
      materialAuthenticity: 12,
      communityValuesAlignment: 11,
    },
    wolfsburgPrinciples: {
      ddbPrinciple: 9,
      pancakePrinciple: 8,
      airCooledPrinciple: 9,
      characterCharm: 10,
    },
    issues: [
      {
        severity: 'info',
        category: 'Material Authenticity',
        message: 'Consider specifying chrome bumper details for period accuracy',
        suggestion: 'Add "chrome bumpers" to prompt',
      },
    ],
    suggestions: [
      'Excellent era-appropriate setting and lighting',
      'Strong adherence to Wolfsburg design principles',
      'Consider adding more specific material details (chrome, paint finish)',
    ],
    metadata: {
      provider: 'Anthropic',
      model: 'claude-3-sonnet-20240229',
      tokensUsed: 632,
      cost: 0.0032,
    },
  },
  generatedAssets: [
    {
      url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1024&h=576',
      format: 'jpg',
      width: 1024,
      height: 576,
      prompt: 'A classic 1960s VW Beetle in vibrant VW Blue, parked on a scenic coastal highway during golden hour...',
      revisedPrompt: 'A classic 1960s VW Beetle in vibrant VW Blue (#003d7a), parked on a scenic coastal highway...',
      metadata: {
        provider: 'OpenAI',
        model: 'dall-e-3',
        cost: 0.04,
        generationTime: 8432,
      },
    },
  ],
  totalCost: 0.0456,
  totalTime: 12647,
  metadata: {
    pipelineId: 'pipeline_20240930_183847_abc123',
    startTime: 1696089527000,
    endTime: 1696089539647,
    providersUsed: ['Anthropic', 'OpenAI'],
  },
};

const mockImageToImageResult: PipelineResult = {
  success: true,
  stage: 'complete',
  imageAnalysis: {
    description: 'A weathered 1967 VW Bus in two-tone Dove Blue and white, showing authentic patina and age. The vehicle displays period-correct details including safari windows, split windshield, and original chrome trim.',
    detectedVehicle: 'VW Bus (Type 2, Bay Window)',
    detectedEra: '1960s',
    designElements: [
      'Two-tone paint (Dove Blue/White)',
      'Safari windows',
      'Bay window design',
      'Chrome bumpers',
      'Period-correct hubcaps',
      'Weathered patina',
    ],
    colors: ['#4A7C9B', '#F5F5F5', 'Rust tones', 'Chrome silver'],
    composition: 'Three-quarter front view, natural outdoor setting, diffused lighting',
    culturalNotes: [
      'Authentic weathering shows vehicle history',
      'Period-appropriate modifications',
      'Community values: preservation over restoration',
    ],
    confidence: 0.94,
    metadata: {
      provider: 'Google',
      model: 'gemini-pro-vision',
      tokensUsed: 542,
      cost: 0.0027,
    },
  },
  generatedPrompts: {
    primary: 'Vintage 1967 VW Bus in weathered two-tone Dove Blue and white, authentic patina showing decades of adventures. Safari windows, bay window design, natural outdoor setting with diffused lighting. Celebrating preservation and authentic aging. Vintage film photography aesthetic.',
    variations: [
      'Classic VW Type 2 Bus, 1960s, Dove Blue/white, weathered patina, safari windows, outdoor scene',
      'Vintage Volkswagen Bus with authentic age, two-tone blue and white, period details, natural setting',
    ],
    negativePrompt: 'pristine restoration, modern modifications, over-restoration, plastic components, digital manipulation',
    styleKeywords: ['authentic patina', 'vintage photography', 'preservation', 'outdoor', 'natural lighting'],
    technicalParameters: {
      aspectRatio: '4:3',
      quality: 'hd',
      style: 'natural',
    },
    confidence: 0.96,
    metadata: {
      provider: 'Anthropic',
      model: 'claude-3-sonnet-20240229',
      tokensUsed: 523,
      cost: 0.0026,
    },
  },
  culturalValidation: {
    score: 94,
    passes: true,
    breakdown: {
      periodAccuracy: 25,
      vehicleDesignFidelity: 24,
      culturalSensitivity: 20,
      materialAuthenticity: 14,
      communityValuesAlignment: 15,
    },
    wolfsburgPrinciples: {
      ddbPrinciple: 10,
      pancakePrinciple: 9,
      airCooledPrinciple: 10,
      characterCharm: 10,
    },
    issues: [],
    suggestions: [
      'Outstanding preservation values alignment',
      'Excellent adherence to all Wolfsburg principles',
      'Authentic patina enhances cultural authenticity',
      'Perfect era-vehicle match',
    ],
    metadata: {
      provider: 'Anthropic',
      model: 'claude-3-sonnet-20240229',
      tokensUsed: 674,
      cost: 0.0034,
    },
  },
  generatedAssets: [
    {
      url: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1024&h=768',
      format: 'jpg',
      width: 1024,
      height: 768,
      prompt: 'Vintage 1967 VW Bus in weathered two-tone Dove Blue and white...',
      metadata: {
        provider: 'FAL',
        model: 'flux-schnell',
        cost: 0.012,
        generationTime: 3245,
      },
    },
  ],
  totalCost: 0.0207,
  totalTime: 8976,
  metadata: {
    pipelineId: 'pipeline_20240930_184512_def456',
    startTime: 1696089912000,
    endTime: 1696089920976,
    providersUsed: ['Google', 'Anthropic', 'FAL'],
  },
};

// Stories

export const Default: Story = {
  args: {
    mode: 'text-to-image',
    theme: 'color',
    vehicle: 'beetle',
    era: '1960s',
    includeWolfsburg: true,
  },
  render: (args) => html`
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 1rem 0; color: #1a1a1a;">AI Pipeline: Text-to-Image</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Complete 4-step pipeline for generating culturally authentic VW assets from text descriptions.
      </p>

      <!-- Input Section -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Pipeline Input</h3>
        <div style="display: grid; gap: 1rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563;">Description</label>
            <textarea
              style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-family: inherit; resize: vertical; min-height: 80px;"
              placeholder="Describe the VW asset you want to generate...">Classic VW Beetle on coastal highway at sunset</textarea>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563;">Theme</label>
              <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px;">
                <option selected>${args.theme}</option>
                <option>bw</option>
                <option>patina</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563;">Vehicle</label>
              <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px;">
                <option selected>${args.vehicle}</option>
                <option>bus</option>
                <option>karmann-ghia</option>
                <option>type-3</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563;">Era</label>
              <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px;">
                <option selected>${args.era}</option>
                <option>1950s</option>
                <option>1970s</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Pipeline Progress -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Pipeline Progress</h3>
        ${renderPipelineSteps(mockTextToImageResult, args.mode)}
      </div>

      <!-- Results -->
      ${renderPipelineResults(mockTextToImageResult)}
    </div>
  `,
};

export const ImageToImage: Story = {
  render: () => html`
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 1rem 0; color: #1a1a1a;">AI Pipeline: Image-to-Image</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Upload an image of a VW vehicle and generate culturally authentic variations.
      </p>

      <!-- Image Upload Section -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Source Image</h3>
        <div style="border: 2px dashed #d1d5db; border-radius: 8px; padding: 2rem; text-align: center; background: #f9fafb;">
          <img
            src="https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400&h=300"
            alt="VW Bus source"
            style="max-width: 400px; border-radius: 4px; margin-bottom: 1rem;"
          />
          <p style="margin: 0; color: #6b7280; font-size: 0.875rem;">
            Drag and drop or click to upload
          </p>
        </div>
      </div>

      <!-- Pipeline Progress -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Pipeline Progress</h3>
        ${renderPipelineSteps(mockImageToImageResult, 'image-to-image')}
      </div>

      <!-- Results -->
      ${renderPipelineResults(mockImageToImageResult)}
    </div>
  `,
};

export const StepByStep: Story = {
  render: () => html`
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 1rem 0; color: #1a1a1a;">Pipeline: Step-by-Step Execution</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Execute each pipeline step individually with manual review between steps.
      </p>

      <!-- Step 1: Image Analysis (Optional) -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #10b981; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;">✓</div>
            <h3 style="margin: 0; font-size: 1rem; color: #1a1a1a;">Step 1: Image Analysis</h3>
          </div>
          <span style="padding: 0.25rem 0.75rem; background: #d1fae5; color: #065f46; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">Complete</span>
        </div>
        <div style="padding: 1rem; background: #f9fafb; border-radius: 4px; border-left: 4px solid #10b981;">
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #374151;">
            <strong>Detected:</strong> ${mockImageToImageResult.imageAnalysis?.detectedVehicle} • ${mockImageToImageResult.imageAnalysis?.detectedEra}
          </p>
          <p style="margin: 0; font-size: 0.875rem; color: #6b7280;">
            ${mockImageToImageResult.imageAnalysis?.description}
          </p>
        </div>
      </div>

      <!-- Step 2: Prompt Generation -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #10b981; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;">✓</div>
            <h3 style="margin: 0; font-size: 1rem; color: #1a1a1a;">Step 2: Prompt Generation</h3>
          </div>
          <span style="padding: 0.25rem 0.75rem; background: #d1fae5; color: #065f46; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">Complete</span>
        </div>
        <div style="padding: 1rem; background: #f9fafb; border-radius: 4px; border-left: 4px solid #10b981;">
          <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: #374151;">
            <strong>Primary Prompt:</strong>
          </p>
          <p style="margin: 0; padding: 0.75rem; background: white; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 0.875rem; color: #1f2937;">
            ${mockImageToImageResult.generatedPrompts?.primary}
          </p>
        </div>
      </div>

      <!-- Step 3: Cultural Validation -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #10b981; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;">✓</div>
            <h3 style="margin: 0; font-size: 1rem; color: #1a1a1a;">Step 3: Cultural Validation</h3>
          </div>
          <span style="padding: 0.25rem 0.75rem; background: #d1fae5; color: #065f46; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">Passed: 94/100</span>
        </div>
        <div style="padding: 1rem; background: #f9fafb; border-radius: 4px; border-left: 4px solid #10b981;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
            <div>
              <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Period Accuracy</div>
              <div style="font-size: 1.25rem; font-weight: 600; color: #10b981;">25/25</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Vehicle Fidelity</div>
              <div style="font-size: 1.25rem; font-weight: 600; color: #10b981;">24/25</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Cultural Sensitivity</div>
              <div style="font-size: 1.25rem; font-weight: 600; color: #10b981;">20/20</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Wolfsburg Bonus</div>
              <div style="font-size: 1.25rem; font-weight: 600; color: #10b981;">+39</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 4: Asset Generation -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600;">4</div>
            <h3 style="margin: 0; font-size: 1rem; color: #1a1a1a;">Step 4: Asset Generation</h3>
          </div>
          <button style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
            Generate Asset
          </button>
        </div>
        <div style="padding: 1rem; background: #f9fafb; border-radius: 4px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; font-size: 0.875rem; color: #6b7280;">
            Ready to generate asset. Review validation results and click "Generate Asset" to proceed.
          </p>
        </div>
      </div>
    </div>
  `,
};

export const WithValidation: Story = {
  render: () => html`
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 1rem 0; color: #1a1a1a;">Cultural Validation Results</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Detailed breakdown of cultural authenticity scoring with Wolfsburg principles.
      </p>

      ${renderValidationDetails(mockImageToImageResult.culturalValidation!)}
    </div>
  `,
};

export const CostComparison: Story = {
  render: () => html`
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 1rem 0; color: #1a1a1a;">Routing Strategy Cost Comparison</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Compare costs and performance across different routing strategies.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
        ${renderRoutingStrategyCard('cost-optimized', 0.0207, 8976, 'FAL + Anthropic', 'Lowest cost, good quality')}
        ${renderRoutingStrategyCard('quality-first', 0.0782, 14523, 'OpenAI + GPT-4', 'Best quality, higher cost')}
        ${renderRoutingStrategyCard('speed-first', 0.0345, 4132, 'FAL + Claude Haiku', 'Fastest generation')}
      </div>

      <div style="margin-top: 2rem; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Provider Cost Breakdown</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #e5e7eb;">
              <th style="text-align: left; padding: 0.75rem; color: #6b7280; font-size: 0.875rem;">Provider</th>
              <th style="text-align: left; padding: 0.75rem; color: #6b7280; font-size: 0.875rem;">Task</th>
              <th style="text-align: right; padding: 0.75rem; color: #6b7280; font-size: 0.875rem;">Cost</th>
              <th style="text-align: right; padding: 0.75rem; color: #6b7280; font-size: 0.875rem;">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 0.75rem; color: #1f2937;">Google AI</td>
              <td style="padding: 0.75rem; color: #6b7280;">Image Analysis</td>
              <td style="text-align: right; padding: 0.75rem; color: #1f2937; font-weight: 500;">$0.0027</td>
              <td style="text-align: right; padding: 0.75rem; color: #6b7280;">1.2s</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 0.75rem; color: #1f2937;">Anthropic</td>
              <td style="padding: 0.75rem; color: #6b7280;">Prompt Generation</td>
              <td style="text-align: right; padding: 0.75rem; color: #1f2937; font-weight: 500;">$0.0026</td>
              <td style="text-align: right; padding: 0.75rem; color: #6b7280;">2.1s</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 0.75rem; color: #1f2937;">Anthropic</td>
              <td style="padding: 0.75rem; color: #6b7280;">Cultural Validation</td>
              <td style="text-align: right; padding: 0.75rem; color: #1f2937; font-weight: 500;">$0.0034</td>
              <td style="text-align: right; padding: 0.75rem; color: #6b7280;">1.8s</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 0.75rem; color: #1f2937;">FAL</td>
              <td style="padding: 0.75rem; color: #6b7280;">Asset Generation</td>
              <td style="text-align: right; padding: 0.75rem; color: #1f2937; font-weight: 500;">$0.0120</td>
              <td style="text-align: right; padding: 0.75rem; color: #6b7280;">3.2s</td>
            </tr>
            <tr style="background: #f9fafb; font-weight: 600;">
              <td style="padding: 0.75rem; color: #1f2937;" colspan="2">Total</td>
              <td style="text-align: right; padding: 0.75rem; color: #10b981;">$0.0207</td>
              <td style="text-align: right; padding: 0.75rem; color: #1f2937;">8.3s</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
};

// Helper Functions

function renderPipelineSteps(result: PipelineResult, mode: string) {
  const steps = [
    { name: 'Image Analysis', key: 'imageAnalysis', skip: mode === 'text-to-image' },
    { name: 'Prompt Generation', key: 'generatedPrompts', skip: false },
    { name: 'Cultural Validation', key: 'culturalValidation', skip: false },
    { name: 'Asset Generation', key: 'generatedAssets', skip: false },
  ];

  return html`
    <div style="display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem;">
      ${steps
        .filter((step) => !step.skip)
        .map((step, index) => {
          const isComplete = result[step.key as keyof PipelineResult] !== undefined;
          const isCurrent = result.stage === step.key.replace(/([A-Z])/g, '-$1').toLowerCase();

          return html`
            <div style="flex: 1; min-width: 200px; background: ${isComplete ? '#f0fdf4' : '#f9fafb'}; padding: 1rem; border-radius: 6px; border: 2px solid ${isComplete ? '#10b981' : '#e5e7eb'};">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div style="width: 24px; height: 24px; border-radius: 50%; background: ${isComplete ? '#10b981' : '#d1d5db'}; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600;">
                  ${isComplete ? '✓' : index + 1}
                </div>
                <span style="font-weight: 600; font-size: 0.875rem; color: ${isComplete ? '#047857' : '#6b7280'};">
                  ${step.name}
                </span>
              </div>
              <div style="font-size: 0.75rem; color: #6b7280;">
                ${isComplete ? 'Complete' : isCurrent ? 'In Progress...' : 'Pending'}
              </div>
            </div>
          `;
        })}
    </div>
  `;
}

function renderPipelineResults(result: PipelineResult) {
  return html`
    <div style="display: grid; gap: 1.5rem;">
      <!-- Generated Asset -->
      ${result.generatedAssets && result.generatedAssets.length > 0
        ? html`
            <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Generated Asset</h3>
              <img
                src="${result.generatedAssets[0].url}"
                alt="Generated VW asset"
                style="width: 100%; border-radius: 6px; margin-bottom: 1rem;"
              />
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; padding: 1rem; background: #f9fafb; border-radius: 4px;">
                <div>
                  <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Provider</div>
                  <div style="font-weight: 600; color: #1f2937;">${result.generatedAssets[0].metadata?.provider}</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Model</div>
                  <div style="font-weight: 600; color: #1f2937;">${result.generatedAssets[0].metadata?.model}</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Cost</div>
                  <div style="font-weight: 600; color: #10b981;">$${result.generatedAssets[0].metadata?.cost.toFixed(4)}</div>
                </div>
                <div>
                  <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Time</div>
                  <div style="font-weight: 600; color: #1f2937;">${(result.generatedAssets[0].metadata?.generationTime! / 1000).toFixed(1)}s</div>
                </div>
              </div>
            </div>
          `
        : ''}

      <!-- Summary -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Pipeline Summary</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div style="padding: 1rem; background: #eff6ff; border-radius: 6px;">
            <div style="font-size: 0.75rem; color: #1e40af; margin-bottom: 0.25rem;">Total Cost</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: #1e40af;">$${result.totalCost.toFixed(4)}</div>
          </div>
          <div style="padding: 1rem; background: #f0fdf4; border-radius: 6px;">
            <div style="font-size: 0.75rem; color: #047857; margin-bottom: 0.25rem;">Total Time</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: #047857;">${(result.totalTime / 1000).toFixed(1)}s</div>
          </div>
          <div style="padding: 1rem; background: #fef3c7; border-radius: 6px;">
            <div style="font-size: 0.75rem; color: #92400e; margin-bottom: 0.25rem;">Providers Used</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: #92400e;">${result.metadata.providersUsed.length}</div>
          </div>
          <div style="padding: 1rem; background: #fce7f3; border-radius: 6px;">
            <div style="font-size: 0.75rem; color: #9f1239; margin-bottom: 0.25rem;">Cultural Score</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: #9f1239;">
              ${result.culturalValidation?.score || 0}/100
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderValidationDetails(validation: any) {
  return html`
    <div style="display: grid; gap: 1.5rem;">
      <!-- Overall Score -->
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 3rem; font-weight: 700; color: ${validation.score >= 90 ? '#10b981' : validation.score >= 70 ? '#f59e0b' : '#ef4444'}; margin-bottom: 0.5rem;">
          ${validation.score}/100
        </div>
        <div style="font-size: 1.25rem; color: #6b7280; margin-bottom: 1rem;">
          ${validation.passes ? '✓ Passes Cultural Validation' : '✗ Does Not Pass Validation'}
        </div>
        <div style="display: inline-block; padding: 0.5rem 1rem; background: ${validation.passes ? '#d1fae5' : '#fee2e2'}; color: ${validation.passes ? '#065f46' : '#991b1b'}; border-radius: 20px; font-weight: 500;">
          ${validation.passes ? 'Culturally Authentic' : 'Needs Improvement'}
        </div>
      </div>

      <!-- Breakdown -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1rem 0; font-size: 1.125rem; color: #374151;">Score Breakdown</h3>
        <div style="display: grid; gap: 1rem;">
          ${renderScoreBar('Period Accuracy', validation.breakdown.periodAccuracy, 25)}
          ${renderScoreBar('Vehicle Design Fidelity', validation.breakdown.vehicleDesignFidelity, 25)}
          ${renderScoreBar('Cultural Sensitivity', validation.breakdown.culturalSensitivity, 20)}
          ${renderScoreBar('Material Authenticity', validation.breakdown.materialAuthenticity, 15)}
          ${renderScoreBar('Community Values Alignment', validation.breakdown.communityValuesAlignment, 15)}
        </div>
      </div>

      <!-- Wolfsburg Principles -->
      ${validation.wolfsburgPrinciples
        ? html`
            <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem; color: #374151;">Wolfsburg Principles Bonus</h3>
              <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: #6b7280;">
                Authenticity alignment with DDB's original VW campaign principles
              </p>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                ${renderWolfsburgPrinciple('DDB Principle', 'Honesty & Clarity', validation.wolfsburgPrinciples.ddbPrinciple, 10)}
                ${renderWolfsburgPrinciple('Pancake Principle', 'Form Follows Function', validation.wolfsburgPrinciples.pancakePrinciple, 10)}
                ${renderWolfsburgPrinciple('Air-Cooled', 'Durability & Reliability', validation.wolfsburgPrinciples.airCooledPrinciple, 10)}
                ${renderWolfsburgPrinciple('Character Charm', 'The "Bug" Principle', validation.wolfsburgPrinciples.characterCharm, 10)}
              </div>
            </div>
          `
        : ''}

      <!-- Issues & Suggestions -->
      ${validation.issues && validation.issues.length > 0
        ? html`
            <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 1rem 0; font-size: 1.125rem; color: #374151;">Validation Issues</h3>
              <div style="display: grid; gap: 0.75rem;">
                ${validation.issues.map(
                  (issue: any) => html`
                    <div style="padding: 1rem; background: ${issue.severity === 'critical' ? '#fee2e2' : issue.severity === 'warning' ? '#fef3c7' : '#dbeafe'}; border-left: 4px solid ${issue.severity === 'critical' ? '#dc2626' : issue.severity === 'warning' ? '#f59e0b' : '#3b82f6'}; border-radius: 4px;">
                      <div style="display: flex; align-items: start; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="padding: 0.25rem 0.5rem; background: ${issue.severity === 'critical' ? '#dc2626' : issue.severity === 'warning' ? '#f59e0b' : '#3b82f6'}; color: white; border-radius: 3px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                          ${issue.severity}
                        </span>
                        <span style="font-size: 0.75rem; color: #6b7280; font-weight: 500;">
                          ${issue.category}
                        </span>
                      </div>
                      <p style="margin: 0 0 0.5rem 0; color: #1f2937; font-size: 0.875rem;">
                        ${issue.message}
                      </p>
                      ${issue.suggestion
                        ? html`
                            <p style="margin: 0; color: #4b5563; font-size: 0.875rem; font-style: italic;">
                              💡 ${issue.suggestion}
                            </p>
                          `
                        : ''}
                    </div>
                  `
                )}
              </div>
            </div>
          `
        : ''}

      <!-- Suggestions -->
      ${validation.suggestions && validation.suggestions.length > 0
        ? html`
            <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 1rem 0; font-size: 1.125rem; color: #374151;">Suggestions</h3>
              <ul style="margin: 0; padding-left: 1.5rem; display: grid; gap: 0.5rem;">
                ${validation.suggestions.map(
                  (suggestion: string) => html`
                    <li style="color: #4b5563; font-size: 0.875rem; line-height: 1.5;">
                      ${suggestion}
                    </li>
                  `
                )}
              </ul>
            </div>
          `
        : ''}
    </div>
  `;
}

function renderScoreBar(label: string, score: number, max: number) {
  const percentage = (score / max) * 100;
  const color = percentage >= 90 ? '#10b981' : percentage >= 70 ? '#f59e0b' : '#ef4444';

  return html`
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
        <span style="font-size: 0.875rem; color: #4b5563;">${label}</span>
        <span style="font-size: 0.875rem; font-weight: 600; color: #1f2937;">${score}/${max}</span>
      </div>
      <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
        <div style="width: ${percentage}%; height: 100%; background: ${color}; transition: width 0.3s ease;"></div>
      </div>
    </div>
  `;
}

function renderWolfsburgPrinciple(title: string, description: string, score: number, max: number) {
  const percentage = (score / max) * 100;
  const color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444';

  return html`
    <div style="padding: 1rem; background: #f9fafb; border-radius: 6px; border: 2px solid ${color};">
      <div style="font-weight: 600; color: #1f2937; margin-bottom: 0.25rem; font-size: 0.875rem;">
        ${title}
      </div>
      <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.75rem;">
        ${description}
      </div>
      <div style="font-size: 1.5rem; font-weight: 700; color: ${color};">
        ${score}/${max}
      </div>
    </div>
  `;
}

function renderRoutingStrategyCard(strategy: string, cost: number, time: number, providers: string, description: string) {
  return html`
    <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem; color: #1f2937; text-transform: capitalize;">
        ${strategy.replace('-', ' ')}
      </h3>
      <p style="margin: 0 0 1.5rem 0; font-size: 0.875rem; color: #6b7280;">
        ${description}
      </p>
      <div style="display: grid; gap: 1rem; margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 4px;">
          <span style="color: #6b7280; font-size: 0.875rem;">Total Cost</span>
          <span style="font-weight: 600; color: #10b981; font-size: 0.875rem;">$${cost.toFixed(4)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 4px;">
          <span style="color: #6b7280; font-size: 0.875rem;">Total Time</span>
          <span style="font-weight: 600; color: #3b82f6; font-size: 0.875rem;">${(time / 1000).toFixed(1)}s</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.75rem; background: #f9fafb; border-radius: 4px;">
          <span style="color: #6b7280; font-size: 0.875rem;">Providers</span>
          <span style="font-weight: 600; color: #1f2937; font-size: 0.875rem;">${providers}</span>
        </div>
      </div>
      <button style="width: 100%; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">
        Use This Strategy
      </button>
    </div>
  `;
}
