import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'AI Integration/AI Generation Panel',
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['ready', 'in-progress', 'success', 'error'],
      description: 'Panel state',
    },
    mode: {
      control: 'select',
      options: ['text-to-image', 'image-to-image'],
      description: 'Generation mode',
    },
    showCostEstimate: {
      control: 'boolean',
      description: 'Show cost estimate',
    },
  },
};

export default meta;
type Story = StoryObj;

// Stories

export const Default: Story = {
  args: {
    state: 'ready',
    mode: 'text-to-image',
    showCostEstimate: true,
  },
  render: (args) => html`
    <div style="max-width: 1000px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">AI Asset Generation</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Generate culturally authentic VW assets using AI
      </p>

      <!-- Generation Panel -->
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Input Section -->
        <div style="margin-bottom: 2rem;">
          <label style="display: block; margin-bottom: 0.75rem; font-weight: 600; color: #1f2937; font-size: 1rem;">
            Describe Your VW Asset
          </label>
          <textarea
            style="width: 100%; padding: 1rem; border: 2px solid #d1d5db; border-radius: 6px; font-family: inherit; resize: vertical; min-height: 120px; font-size: 0.875rem; line-height: 1.6;"
            placeholder="Example: A classic 1967 VW Beetle in VW Blue parked on a scenic coastal highway during golden hour. Vintage film photography aesthetic with subtle grain and warm tones."
          >A classic 1967 VW Beetle in VW Blue parked on a scenic coastal highway during golden hour</textarea>
          <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #6b7280;">
            💡 Tip: Be specific about era, vehicle type, setting, and aesthetic for best results
          </div>
        </div>

        <!-- Context Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
              Theme
            </label>
            <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;">
              <option selected>Color</option>
              <option>B&W</option>
              <option>Patina</option>
            </select>
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
              Vehicle
            </label>
            <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;">
              <option selected>Beetle</option>
              <option>Bus</option>
              <option>Karmann Ghia</option>
              <option>Type 3</option>
            </select>
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
              Era
            </label>
            <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;">
              <option>1950s</option>
              <option selected>1960s</option>
              <option>1970s</option>
            </select>
          </div>
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
              Asset Size
            </label>
            <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;">
              <option>512x512</option>
              <option selected>1024x1024</option>
              <option>1792x1024</option>
              <option>1024x1792</option>
            </select>
          </div>
        </div>

        <!-- Advanced Options -->
        <details style="margin-bottom: 2rem;">
          <summary style="cursor: pointer; font-weight: 500; color: #4b5563; font-size: 0.875rem; margin-bottom: 1rem;">
            Advanced Options
          </summary>
          <div style="padding: 1rem; background: #f9fafb; border-radius: 6px; margin-top: 1rem;">
            <div style="display: grid; gap: 1rem;">
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
                  Routing Strategy
                </label>
                <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;">
                  <option selected>Cost-Optimized</option>
                  <option>Quality-First</option>
                  <option>Speed-First</option>
                </select>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
                    Number of Variations
                  </label>
                  <input
                    type="number"
                    value="1"
                    min="1"
                    max="4"
                    style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;"
                  />
                </div>
                <div>
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
                    Quality
                  </label>
                  <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;">
                    <option>Standard</option>
                    <option selected>HD</option>
                  </select>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="checkbox" id="wolfsburg" checked style="width: 16px; height: 16px; cursor: pointer;" />
                <label for="wolfsburg" style="color: #4b5563; font-size: 0.875rem; cursor: pointer;">
                  Include Wolfsburg Principles validation
                </label>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="checkbox" id="stoponfail" checked style="width: 16px; height: 16px; cursor: pointer;" />
                <label for="stoponfail" style="color: #4b5563; font-size: 0.875rem; cursor: pointer;">
                  Stop pipeline if cultural validation fails
                </label>
              </div>
            </div>
          </div>
        </details>

        ${args.showCostEstimate
          ? html`
              <!-- Cost Estimate -->
              <div style="padding: 1rem; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px; margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; justify-content: between; gap: 1rem;">
                  <div style="flex: 1;">
                    <div style="font-weight: 600; color: #1e40af; margin-bottom: 0.25rem; font-size: 0.875rem;">
                      Estimated Cost
                    </div>
                    <div style="font-size: 0.75rem; color: #3b82f6; line-height: 1.5;">
                      Based on cost-optimized routing with cultural validation
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 1.75rem; font-weight: 700; color: #1e40af;">
                      $0.021
                    </div>
                    <div style="font-size: 0.75rem; color: #3b82f6;">
                      per asset
                    </div>
                  </div>
                </div>
              </div>
            `
          : ''}

        <!-- Action Button -->
        <button style="width: 100%; padding: 1rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 1rem; transition: background 0.2s;">
          Generate VW Asset
        </button>
      </div>
    </div>
  `,
};

export const InProgress: Story = {
  render: () => html`
    <div style="max-width: 1000px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">Generating Asset...</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Your AI pipeline is processing your request
      </p>

      <!-- Progress Panel -->
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Input Summary -->
        <div style="padding: 1rem; background: #f9fafb; border-radius: 6px; margin-bottom: 2rem;">
          <div style="font-weight: 600; color: #1f2937; margin-bottom: 0.5rem; font-size: 0.875rem;">
            Your Request
          </div>
          <div style="color: #4b5563; font-size: 0.875rem; line-height: 1.6;">
            "A classic 1967 VW Beetle in VW Blue parked on a scenic coastal highway during golden hour"
          </div>
          <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span style="padding: 0.25rem 0.75rem; background: #dbeafe; color: #1e40af; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">
              Theme: Color
            </span>
            <span style="padding: 0.25rem 0.75rem; background: #dbeafe; color: #1e40af; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">
              Vehicle: Beetle
            </span>
            <span style="padding: 0.25rem 0.75rem; background: #dbeafe; color: #1e40af; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">
              Era: 1960s
            </span>
          </div>
        </div>

        <!-- Pipeline Progress -->
        <div style="margin-bottom: 2rem;">
          <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Pipeline Progress</h3>
          <div style="display: grid; gap: 1rem;">
            ${renderProgressStep('Prompt Generation', 'complete', 'Enhanced your description with VW-specific details', '2.1s')}
            ${renderProgressStep('Cultural Validation', 'complete', 'Score: 88/100 - Passes validation', '1.8s')}
            ${renderProgressStep('Asset Generation', 'in-progress', 'Generating image with DALL-E 3...', null)}
            ${renderProgressStep('Post-Processing', 'pending', 'Waiting...', null)}
          </div>
        </div>

        <!-- Real-time Stats -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; padding: 1rem; background: #f9fafb; border-radius: 6px;">
          <div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Elapsed Time</div>
            <div style="font-size: 1.25rem; font-weight: 600; color: #3b82f6;">6.2s</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Cost So Far</div>
            <div style="font-size: 1.25rem; font-weight: 600; color: #10b981;">$0.0056</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Providers Used</div>
            <div style="font-size: 1.25rem; font-weight: 600; color: #6b7280;">2</div>
          </div>
        </div>

        <!-- Cancel Button -->
        <button style="width: 100%; margin-top: 2rem; padding: 0.75rem; background: white; color: #ef4444; border: 1px solid #ef4444; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
          Cancel Generation
        </button>
      </div>
    </div>
  `,
};

export const Success: Story = {
  render: () => html`
    <div style="max-width: 1200px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
        <h2 style="margin: 0; color: #1a1a1a;">Generation Complete</h2>
        <span style="padding: 0.375rem 0.75rem; background: #d1fae5; color: #065f46; border-radius: 12px; font-size: 0.875rem; font-weight: 600;">
          Success
        </span>
      </div>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Your VW asset has been generated successfully
      </p>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
        <!-- Generated Asset -->
        <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <img
            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1024&h=576"
            alt="Generated VW Beetle"
            style="width: 100%; border-radius: 6px; margin-bottom: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
          />

          <!-- Action Buttons -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <button style="padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
              Download Image
            </button>
            <button style="padding: 0.75rem; background: white; color: #3b82f6; border: 1px solid #3b82f6; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
              Generate Variation
            </button>
          </div>

          <!-- Asset Details -->
          <div style="padding: 1rem; background: #f9fafb; border-radius: 6px;">
            <div style="font-weight: 600; color: #1f2937; margin-bottom: 0.75rem; font-size: 0.875rem;">
              Asset Details
            </div>
            <div style="display: grid; gap: 0.5rem; font-size: 0.875rem;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Format:</span>
                <span style="color: #1f2937; font-weight: 500;">JPEG</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Dimensions:</span>
                <span style="color: #1f2937; font-weight: 500;">1024 × 576</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Provider:</span>
                <span style="color: #1f2937; font-weight: 500;">OpenAI (DALL-E 3)</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Generation Time:</span>
                <span style="color: #1f2937; font-weight: 500;">8.4s</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar: Validation & Stats -->
        <div style="display: grid; gap: 1.5rem; align-content: start;">
          <!-- Cultural Score -->
          <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
            <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">
              Cultural Authenticity
            </div>
            <div style="font-size: 3rem; font-weight: 700; color: #10b981; margin-bottom: 0.5rem;">
              88
            </div>
            <div style="display: inline-block; padding: 0.375rem 0.75rem; background: #d1fae5; color: #065f46; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
              Excellent
            </div>
            <button style="width: 100%; margin-top: 1rem; padding: 0.5rem; background: white; color: #6b7280; border: 1px solid #d1d5db; border-radius: 4px; cursor: pointer; font-size: 0.75rem; font-weight: 500;">
              View Details
            </button>
          </div>

          <!-- Cost Breakdown -->
          <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="font-weight: 600; color: #1f2937; margin-bottom: 1rem; font-size: 0.875rem;">
              Cost Breakdown
            </div>
            <div style="display: grid; gap: 0.75rem; font-size: 0.875rem; margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Prompt Gen.</span>
                <span style="color: #1f2937;">$0.0024</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Validation</span>
                <span style="color: #1f2937;">$0.0032</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Generation</span>
                <span style="color: #1f2937;">$0.0400</span>
              </div>
              <div style="border-top: 1px solid #e5e7eb; padding-top: 0.75rem; display: flex; justify-content: space-between; font-weight: 600;">
                <span style="color: #1f2937;">Total</span>
                <span style="color: #10b981;">$0.0456</span>
              </div>
            </div>
            <div style="padding: 0.75rem; background: #f0fdf4; border-radius: 4px; font-size: 0.75rem; color: #047857; text-align: center;">
              35% below estimated cost
            </div>
          </div>

          <!-- Providers Used -->
          <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="font-weight: 600; color: #1f2937; margin-bottom: 1rem; font-size: 0.875rem;">
              Providers Used
            </div>
            <div style="display: grid; gap: 0.5rem;">
              ${renderProviderBadge('Anthropic', 'Prompt & Validation')}
              ${renderProviderBadge('OpenAI', 'DALL-E 3 Generation')}
            </div>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div style="margin-top: 2rem; padding: 1.5rem; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-weight: 600; color: #1f2937; margin-bottom: 0.25rem;">
            Want to generate another asset?
          </div>
          <div style="font-size: 0.875rem; color: #6b7280;">
            Refine your prompt or try a different theme
          </div>
        </div>
        <button style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
          New Generation
        </button>
      </div>
    </div>
  `,
};

export const Error: Story = {
  render: () => html`
    <div style="max-width: 800px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
        <h2 style="margin: 0; color: #1a1a1a;">Generation Failed</h2>
        <span style="padding: 0.375rem 0.75rem; background: #fee2e2; color: #991b1b; border-radius: 12px; font-size: 0.875rem; font-weight: 600;">
          Error
        </span>
      </div>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        We encountered an issue while generating your asset
      </p>

      <!-- Error Panel -->
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- Error Message -->
        <div style="padding: 1.5rem; background: #fee2e2; border-left: 4px solid #ef4444; border-radius: 4px; margin-bottom: 2rem;">
          <div style="display: flex; align-items: start; gap: 1rem;">
            <span style="font-size: 1.5rem;">⚠️</span>
            <div style="flex: 1;">
              <div style="font-weight: 600; color: #991b1b; margin-bottom: 0.5rem; font-size: 1rem;">
                Cultural Validation Failed
              </div>
              <div style="color: #991b1b; font-size: 0.875rem; line-height: 1.6; margin-bottom: 1rem;">
                The generated prompt did not meet the minimum cultural authenticity threshold (70/100). Score: 62/100
              </div>
              <div style="padding: 1rem; background: white; border-radius: 4px; margin-bottom: 1rem;">
                <div style="font-weight: 600; color: #1f2937; margin-bottom: 0.5rem; font-size: 0.875rem;">
                  Critical Issues Found:
                </div>
                <ul style="margin: 0; padding-left: 1.5rem; color: #4b5563; font-size: 0.875rem; line-height: 1.6;">
                  <li>Modern LED headlights mentioned (not period-accurate for 1960s)</li>
                  <li>Incorrect paint code specified (not a VW factory color)</li>
                  <li>Mixed era elements (1960s Beetle with 1970s accessories)</li>
                </ul>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <span style="padding: 0.25rem 0.75rem; background: #fef3c7; color: #92400e; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">
                  Error Code: VALIDATION_FAILED
                </span>
                <span style="padding: 0.25rem 0.75rem; background: #dbeafe; color: #1e40af; border-radius: 12px; font-size: 0.75rem; font-weight: 500;">
                  Retryable
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Suggested Actions -->
        <div style="margin-bottom: 2rem;">
          <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Suggested Actions</h3>
          <div style="display: grid; gap: 0.75rem;">
            ${renderSuggestion('Revise your description to use period-accurate details', 'Remove modern elements like LED lights, digital displays, etc.')}
            ${renderSuggestion('Specify a VW factory color', 'Use authentic colors like VW Blue, Dove Blue, or Sea Blue')}
            ${renderSuggestion('Stay within a single era', 'Don\'t mix 1960s vehicles with 1970s accessories')}
          </div>
        </div>

        <!-- Cost Information -->
        <div style="padding: 1rem; background: #f9fafb; border-radius: 6px; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.25rem;">
                Partial Cost (stopped at validation)
              </div>
              <div style="font-size: 1.25rem; font-weight: 600; color: #1f2937;">
                $0.0056
              </div>
            </div>
            <div style="text-align: right; font-size: 0.75rem; color: #6b7280;">
              No image generation charge
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <button style="padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
            Retry with Suggestions
          </button>
          <button style="padding: 0.75rem; background: white; color: #6b7280; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
            Edit Prompt Manually
          </button>
        </div>
      </div>

      <!-- Help Section -->
      <div style="margin-top: 2rem; padding: 1rem; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
        <div style="display: flex; align-items: start; gap: 0.75rem;">
          <span style="font-size: 1.25rem;">💡</span>
          <div>
            <div style="font-weight: 600; color: #1e40af; margin-bottom: 0.25rem; font-size: 0.875rem;">
              Need Help?
            </div>
            <div style="color: #1e40af; font-size: 0.875rem; line-height: 1.5;">
              Check out our <a href="#" style="color: #1e40af; text-decoration: underline;">VW Cultural Guidelines</a> for
              period-accurate details and authentic VW specifications.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const WithCostEstimate: Story = {
  render: () => html`
    <div style="max-width: 800px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">Cost Estimation</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Transparent pricing before you generate
      </p>

      <!-- Cost Calculator -->
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1.5rem 0; font-size: 1.125rem; color: #1f2937;">
          Cost Calculator
        </h3>

        <!-- Configuration -->
        <div style="display: grid; gap: 1rem; margin-bottom: 2rem; padding: 1.5rem; background: #f9fafb; border-radius: 6px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
                Routing Strategy
              </label>
              <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;">
                <option selected>Cost-Optimized</option>
                <option>Quality-First</option>
                <option>Speed-First</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
                Asset Size
              </label>
              <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;">
                <option>512x512</option>
                <option selected>1024x1024</option>
                <option>1792x1024 (HD)</option>
              </select>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
                Number of Assets
              </label>
              <input
                type="number"
                value="1"
                min="1"
                max="10"
                style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;"
              />
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
                Quality
              </label>
              <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;">
                <option>Standard</option>
                <option selected>HD</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Cost Breakdown -->
        <div style="margin-bottom: 2rem;">
          <h4 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Estimated Cost Breakdown</h4>
          <table style="width: 100%; font-size: 0.875rem;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 0.75rem 0; color: #6b7280;">Image Analysis (Google AI)</td>
              <td style="padding: 0.75rem 0; text-align: right; color: #6b7280;">Optional</td>
              <td style="padding: 0.75rem 0; text-align: right; font-weight: 500; color: #1f2937;">$0.0027</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 0.75rem 0; color: #6b7280;">Prompt Generation (Anthropic)</td>
              <td style="padding: 0.75rem 0; text-align: right; color: #6b7280;">Required</td>
              <td style="padding: 0.75rem 0; text-align: right; font-weight: 500; color: #1f2937;">$0.0024</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 0.75rem 0; color: #6b7280;">Cultural Validation (Anthropic)</td>
              <td style="padding: 0.75rem 0; text-align: right; color: #6b7280;">Required</td>
              <td style="padding: 0.75rem 0; text-align: right; font-weight: 500; color: #1f2937;">$0.0032</td>
            </tr>
            <tr style="border-bottom: 2px solid #e5e7eb;">
              <td style="padding: 0.75rem 0; color: #6b7280;">Asset Generation (FAL)</td>
              <td style="padding: 0.75rem 0; text-align: right; color: #6b7280;">Required</td>
              <td style="padding: 0.75rem 0; text-align: right; font-weight: 500; color: #1f2937;">$0.0124</td>
            </tr>
            <tr style="background: #f9fafb; font-weight: 600;">
              <td style="padding: 1rem 0; color: #1f2937;" colspan="2">Total Per Asset</td>
              <td style="padding: 1rem 0; text-align: right; color: #10b981; font-size: 1.125rem;">$0.0207</td>
            </tr>
          </table>
        </div>

        <!-- Comparison -->
        <div style="padding: 1.5rem; background: #eff6ff; border-radius: 6px;">
          <h4 style="margin: 0 0 1rem 0; font-size: 1rem; color: #1e40af;">Compare Strategies</h4>
          <div style="display: grid; gap: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 500; color: #1f2937; font-size: 0.875rem;">Cost-Optimized</div>
                <div style="font-size: 0.75rem; color: #6b7280;">Best price, good quality</div>
              </div>
              <div style="font-weight: 600; color: #10b981;">$0.0207</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 500; color: #1f2937; font-size: 0.875rem;">Quality-First</div>
                <div style="font-size: 0.75rem; color: #6b7280;">Premium providers, highest quality</div>
              </div>
              <div style="font-weight: 600; color: #3b82f6;">$0.0782</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-weight: 500; color: #1f2937; font-size: 0.875rem;">Speed-First</div>
                <div style="font-size: 0.75rem; color: #6b7280;">Fastest generation time</div>
              </div>
              <div style="font-weight: 600; color: #f59e0b;">$0.0345</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};

// Helper Functions

function renderProgressStep(name: string, status: 'complete' | 'in-progress' | 'pending', message: string, time: string | null) {
  const colors = {
    complete: { bg: '#f0fdf4', border: '#10b981', text: '#047857', icon: '✓' },
    'in-progress': { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '⟳' },
    pending: { bg: '#f3f4f6', border: '#d1d5db', text: '#6b7280', icon: '○' },
  };

  const color = colors[status];

  return html`
    <div style="padding: 1rem; background: ${color.bg}; border-left: 4px solid ${color.border}; border-radius: 4px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-weight: 600; color: ${color.text};">${color.icon}</span>
          <span style="font-weight: 600; color: ${color.text}; font-size: 0.875rem;">${name}</span>
        </div>
        ${time
          ? html`
              <span style="font-size: 0.75rem; color: ${color.text}; font-weight: 500;">
                ${time}
              </span>
            `
          : ''}
      </div>
      <div style="font-size: 0.875rem; color: ${color.text}; padding-left: 1.5rem;">
        ${message}
      </div>
    </div>
  `;
}

function renderProviderBadge(name: string, task: string) {
  return html`
    <div style="padding: 0.75rem; background: #f9fafb; border-radius: 4px; border: 1px solid #e5e7eb;">
      <div style="font-weight: 600; color: #1f2937; margin-bottom: 0.25rem; font-size: 0.875rem;">
        ${name}
      </div>
      <div style="font-size: 0.75rem; color: #6b7280;">
        ${task}
      </div>
    </div>
  `;
}

function renderSuggestion(title: string, description: string) {
  return html`
    <div style="padding: 1rem; background: #f9fafb; border-left: 3px solid #3b82f6; border-radius: 4px;">
      <div style="font-weight: 600; color: #1f2937; margin-bottom: 0.25rem; font-size: 0.875rem;">
        ${title}
      </div>
      <div style="font-size: 0.875rem; color: #6b7280;">
        ${description}
      </div>
    </div>
  `;
}
