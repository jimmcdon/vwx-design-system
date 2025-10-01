import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'AI Integration/API Key Manager',
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['all-providers', 'single-provider', 'vwx-hosted'],
      description: 'Key management mode',
    },
    showValidation: {
      control: 'boolean',
      description: 'Show validation feedback',
    },
    populated: {
      control: 'boolean',
      description: 'Pre-populate with mock keys',
    },
  },
};

export default meta;
type Story = StoryObj;

// Stories

export const Default: Story = {
  args: {
    mode: 'all-providers',
    showValidation: false,
    populated: false,
  },
  render: (args) => html`
    <div style="max-width: 900px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">BYOK Configuration</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Bring Your Own Key: Configure your AI provider API keys for VWX Design System
      </p>

      ${renderProviderCard(
        'OpenRouter',
        'openrouter',
        'Multi-model routing with 100+ AI models',
        args.populated ? 'sk-or-v1-abc123...' : '',
        args.showValidation,
        true
      )}
      ${renderProviderCard(
        'FAL.ai',
        'fal',
        'Fast image generation with Flux and Stable Diffusion',
        args.populated ? 'fal_abc123...' : '',
        args.showValidation,
        true
      )}
      ${renderProviderCard(
        'OpenAI',
        'openai',
        'GPT-4, DALL-E 3 for text and image generation',
        args.populated ? 'sk-proj-abc123...' : '',
        args.showValidation,
        true
      )}
      ${renderProviderCard(
        'Anthropic',
        'anthropic',
        'Claude 3 for cultural validation and prompt generation',
        args.populated ? 'sk-ant-api03-abc123...' : '',
        args.showValidation,
        true
      )}
      ${renderProviderCard(
        'Google AI',
        'google',
        'Gemini Vision for image analysis',
        args.populated ? 'AIzaSy...' : '',
        args.showValidation,
        true
      )}

      <!-- Action Buttons -->
      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button style="flex: 1; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
          Save Configuration
        </button>
        <button style="padding: 0.75rem 1.5rem; background: white; color: #6b7280; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
          Test All Keys
        </button>
        <button style="padding: 0.75rem 1.5rem; background: white; color: #ef4444; border: 1px solid #fca5a5; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
          Clear All
        </button>
      </div>

      <!-- Security Notice -->
      <div style="margin-top: 2rem; padding: 1rem; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
        <div style="display: flex; align-items: start; gap: 0.75rem;">
          <span style="font-size: 1.25rem;">🔒</span>
          <div>
            <div style="font-weight: 600; color: #1e40af; margin-bottom: 0.25rem; font-size: 0.875rem;">
              Your Keys Stay Secure
            </div>
            <div style="color: #1e40af; font-size: 0.875rem; line-height: 1.5;">
              API keys are stored locally in your browser using encrypted storage. They are never sent to VWX servers.
              Keys are only transmitted directly to the respective AI provider APIs.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const SingleProvider: Story = {
  render: () => html`
    <div style="max-width: 700px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">Configure OpenAI</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Set up your OpenAI API key for GPT-4 and DALL-E 3 integration
      </p>

      ${renderProviderCard(
        'OpenAI',
        'openai',
        'GPT-4, DALL-E 3 for text and image generation',
        '',
        false,
        true,
        true
      )}

      <!-- Provider Capabilities -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Provider Capabilities</h3>
        <div style="display: grid; gap: 0.75rem;">
          ${renderCapability('Image Analysis', true, 'GPT-4 Vision')}
          ${renderCapability('Text Generation', true, 'GPT-4, GPT-3.5 Turbo')}
          ${renderCapability('Image Generation', true, 'DALL-E 3, DALL-E 2')}
          ${renderCapability('Cultural Validation', true, 'GPT-4')}
        </div>
      </div>

      <!-- Pricing Info -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Estimated Costs</h3>
        <table style="width: 100%; font-size: 0.875rem;">
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 0.5rem 0; color: #6b7280;">Image Analysis (GPT-4 Vision)</td>
            <td style="padding: 0.5rem 0; text-align: right; font-weight: 500; color: #1f2937;">$0.003/image</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 0.5rem 0; color: #6b7280;">Prompt Generation (GPT-4)</td>
            <td style="padding: 0.5rem 0; text-align: right; font-weight: 500; color: #1f2937;">$0.002/request</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 0.5rem 0; color: #6b7280;">Image Generation (DALL-E 3 HD)</td>
            <td style="padding: 0.5rem 0; text-align: right; font-weight: 500; color: #1f2937;">$0.080/image</td>
          </tr>
          <tr style="background: #f9fafb; font-weight: 600;">
            <td style="padding: 0.75rem 0; color: #1f2937;">Typical Pipeline Cost</td>
            <td style="padding: 0.75rem 0; text-align: right; color: #10b981;">$0.085/asset</td>
          </tr>
        </table>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
        <button style="flex: 1; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
          Save & Test Connection
        </button>
        <button style="padding: 0.75rem 1.5rem; background: white; color: #6b7280; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-weight: 500;">
          Cancel
        </button>
      </div>
    </div>
  `,
};

export const WithValidation: Story = {
  render: () => html`
    <div style="max-width: 900px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">API Key Validation</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Real-time validation feedback for your API keys
      </p>

      ${renderProviderCard('OpenRouter', 'openrouter', 'Multi-model routing', 'sk-or-v1-abc123def456ghi789', true, true, false, 'valid')}
      ${renderProviderCard('FAL.ai', 'fal', 'Fast image generation', 'fal_xyz789', true, true, false, 'invalid')}
      ${renderProviderCard('OpenAI', 'openai', 'GPT-4, DALL-E 3', '', true, true, false, 'empty')}
      ${renderProviderCard('Anthropic', 'anthropic', 'Claude 3', 'sk-ant-api03-testing123', true, true, false, 'validating')}
      ${renderProviderCard('Google AI', 'google', 'Gemini Vision', 'AIzaSy...', true, true, false, 'valid')}

      <!-- Validation Summary -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Validation Summary</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
          <div style="text-align: center; padding: 1rem; background: #f0fdf4; border-radius: 6px;">
            <div style="font-size: 2rem; font-weight: 700; color: #10b981; margin-bottom: 0.25rem;">2</div>
            <div style="font-size: 0.875rem; color: #047857;">Valid Keys</div>
          </div>
          <div style="text-align: center; padding: 1rem; background: #fef3c7; border-radius: 6px;">
            <div style="font-size: 2rem; font-weight: 700; color: #f59e0b; margin-bottom: 0.25rem;">1</div>
            <div style="font-size: 0.875rem; color: #92400e;">Validating</div>
          </div>
          <div style="text-align: center; padding: 1rem; background: #fee2e2; border-radius: 6px;">
            <div style="font-size: 2rem; font-weight: 700; color: #ef4444; margin-bottom: 0.25rem;">1</div>
            <div style="font-size: 0.875rem; color: #991b1b;">Invalid Keys</div>
          </div>
          <div style="text-align: center; padding: 1rem; background: #f3f4f6; border-radius: 6px;">
            <div style="font-size: 2rem; font-weight: 700; color: #6b7280; margin-bottom: 0.25rem;">1</div>
            <div style="font-size: 0.875rem; color: #4b5563;">Not Configured</div>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const Populated: Story = {
  render: () => html`
    <div style="max-width: 900px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">Configured Providers</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Your AI providers are configured and ready to use
      </p>

      ${renderProviderCard('OpenRouter', 'openrouter', 'Multi-model routing', 'sk-or-v1-...ghi789', true, true, false, 'valid')}
      ${renderProviderCard('FAL.ai', 'fal', 'Fast image generation', 'fal_...xyz789', true, true, false, 'valid')}
      ${renderProviderCard('OpenAI', 'openai', 'GPT-4, DALL-E 3', 'sk-proj-...def456', true, true, false, 'valid')}
      ${renderProviderCard('Anthropic', 'anthropic', 'Claude 3', 'sk-ant-...abc123', true, true, false, 'valid')}
      ${renderProviderCard('Google AI', 'google', 'Gemini Vision', 'AIzaSy...mno789', true, true, false, 'valid')}

      <!-- Routing Configuration -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Routing Configuration</h3>
        <div style="display: grid; gap: 1rem;">
          <div>
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
              Routing Strategy
            </label>
            <select style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;">
              <option selected>Cost-Optimized (Recommended)</option>
              <option>Quality-First</option>
              <option>Speed-First</option>
              <option>Custom</option>
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
                Daily Budget Limit
              </label>
              <input
                type="number"
                value="10.00"
                step="0.01"
                style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;"
                placeholder="10.00"
              />
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
                Monthly Budget Limit
              </label>
              <input
                type="number"
                value="200.00"
                step="0.01"
                style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;"
                placeholder="200.00"
              />
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="checkbox" id="fallback" checked style="width: 16px; height: 16px; cursor: pointer;" />
            <label for="fallback" style="color: #4b5563; font-size: 0.875rem; cursor: pointer;">
              Enable automatic fallback to alternative providers if primary fails
            </label>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="checkbox" id="tracking" checked style="width: 16px; height: 16px; cursor: pointer;" />
            <label for="tracking" style="color: #4b5563; font-size: 0.875rem; cursor: pointer;">
              Enable cost tracking and usage analytics
            </label>
          </div>
        </div>
      </div>

      <!-- Current Usage -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">Current Usage (October 2024)</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div style="padding: 1rem; background: #f9fafb; border-radius: 6px;">
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Total Spent Today</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: #10b981;">$2.34</div>
            <div style="margin-top: 0.5rem; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden;">
              <div style="width: 23%; height: 100%; background: #10b981;"></div>
            </div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">23% of $10.00 daily limit</div>
          </div>
          <div style="padding: 1rem; background: #f9fafb; border-radius: 6px;">
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Total Spent This Month</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: #3b82f6;">$67.89</div>
            <div style="margin-top: 0.5rem; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden;">
              <div style="width: 34%; height: 100%; background: #3b82f6;"></div>
            </div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">34% of $200.00 monthly limit</div>
          </div>
          <div style="padding: 1rem; background: #f9fafb; border-radius: 6px;">
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">Requests Today</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: #6b7280;">127</div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem;">Avg cost: $0.018/request</div>
          </div>
        </div>
      </div>
    </div>
  `,
};

export const VWXHostedService: Story = {
  render: () => html`
    <div style="max-width: 700px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">VWX Hosted AI Service</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Use VWX's managed AI service with simplified billing and setup
      </p>

      <!-- Service Plans -->
      <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
        ${renderServicePlan('Starter', '$29/month', ['100 assets/month', 'All AI providers', 'Basic support', 'Cost-optimized routing'], false)}
        ${renderServicePlan('Pro', '$99/month', ['500 assets/month', 'All AI providers', 'Priority support', 'Custom routing', 'Usage analytics'], true)}
        ${renderServicePlan('Business', '$299/month', ['2000 assets/month', 'All AI providers', '24/7 support', 'Custom routing', 'Advanced analytics', 'SLA guarantee'], false)}
      </div>

      <!-- API Key Input -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1rem 0; font-size: 1rem; color: #374151;">VWX API Key</h3>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
            API Key
          </label>
          <input
            type="password"
            value="vwx_prod_abc123def456..."
            style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-family: monospace; font-size: 0.875rem;"
            placeholder="vwx_prod_..."
          />
        </div>
        <div style="display: flex; gap: 1rem;">
          <button style="flex: 1; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
            Connect Service
          </button>
          <button style="padding: 0.75rem 1.5rem; background: white; color: #6b7280; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
            Sign Up
          </button>
        </div>
      </div>

      <!-- Benefits -->
      <div style="margin-top: 2rem; padding: 1rem; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 4px;">
        <div style="font-weight: 600; color: #047857; margin-bottom: 0.5rem; font-size: 0.875rem;">
          Why Use VWX Hosted?
        </div>
        <ul style="margin: 0; padding-left: 1.5rem; color: #047857; font-size: 0.875rem; line-height: 1.6;">
          <li>No need to manage multiple API keys</li>
          <li>Simplified billing - one monthly charge</li>
          <li>Optimized routing for best cost/quality balance</li>
          <li>Built-in usage analytics and monitoring</li>
          <li>Priority support from VWX team</li>
        </ul>
      </div>
    </div>
  `,
};

// Helper Functions

function renderProviderCard(
  name: string,
  id: string,
  description: string,
  value: string,
  showValidation: boolean,
  enabled: boolean,
  expanded: boolean = false,
  validationStatus: 'valid' | 'invalid' | 'validating' | 'empty' = 'empty'
) {
  const validationColors = {
    valid: { bg: '#d1fae5', border: '#10b981', text: '#065f46', icon: '✓' },
    invalid: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: '✗' },
    validating: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '⟳' },
    empty: { bg: '#f3f4f6', border: '#d1d5db', text: '#6b7280', icon: '' },
  };

  const status = validationColors[validationStatus];

  return html`
    <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1rem; border: 2px solid ${showValidation && validationStatus !== 'empty' ? status.border : 'transparent'};">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <input type="checkbox" ${enabled ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;" />
          <div>
            <h3 style="margin: 0; font-size: 1rem; color: #1f2937; font-weight: 600;">${name}</h3>
            <p style="margin: 0; font-size: 0.75rem; color: #6b7280;">${description}</p>
          </div>
        </div>
        ${showValidation && validationStatus !== 'empty'
          ? html`
              <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.75rem; background: ${status.bg}; border-radius: 12px;">
                <span style="font-weight: 600; color: ${status.text};">${status.icon}</span>
                <span style="font-size: 0.75rem; font-weight: 500; color: ${status.text}; text-transform: capitalize;">
                  ${validationStatus}
                </span>
              </div>
            `
          : ''}
      </div>

      <div style="margin-bottom: ${expanded ? '1rem' : '0'};">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #4b5563; font-size: 0.875rem;">
          API Key
        </label>
        <div style="position: relative;">
          <input
            type="password"
            value="${value}"
            style="width: 100%; padding: 0.75rem; padding-right: 5rem; border: 1px solid ${showValidation && validationStatus === 'invalid' ? '#ef4444' : '#d1d5db'}; border-radius: 4px; font-family: monospace; font-size: 0.875rem;"
            placeholder="sk-..."
          />
          <button style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); padding: 0.375rem 0.75rem; background: #f3f4f6; color: #6b7280; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem; font-weight: 500;">
            ${value ? 'Show' : 'Paste'}
          </button>
        </div>
        ${showValidation && validationStatus === 'invalid'
          ? html`
              <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #ef4444;">
                Invalid API key format or authentication failed. Please check your key.
              </div>
            `
          : ''}
        ${showValidation && validationStatus === 'valid'
          ? html`
              <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #10b981;">
                API key validated successfully. Provider is ready to use.
              </div>
            `
          : ''}
      </div>

      ${expanded
        ? html`
            <div style="margin-top: 1rem; padding: 1rem; background: #f9fafb; border-radius: 4px; border-left: 3px solid #3b82f6;">
              <div style="font-weight: 600; color: #1f2937; margin-bottom: 0.5rem; font-size: 0.875rem;">
                Additional Configuration
              </div>
              <div style="display: grid; gap: 0.75rem;">
                <div>
                  <label style="display: block; margin-bottom: 0.25rem; color: #6b7280; font-size: 0.75rem;">
                    Organization ID (Optional)
                  </label>
                  <input
                    type="text"
                    style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;"
                    placeholder="org-..."
                  />
                </div>
                <div>
                  <label style="display: block; margin-bottom: 0.25rem; color: #6b7280; font-size: 0.75rem;">
                    Default Model
                  </label>
                  <select style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.875rem;">
                    <option>gpt-4-turbo-preview</option>
                    <option>gpt-4</option>
                    <option>dall-e-3</option>
                  </select>
                </div>
              </div>
            </div>
          `
        : ''}

      ${value && !expanded
        ? html`
            <button style="margin-top: 0.75rem; padding: 0.375rem 0.75rem; background: white; color: #3b82f6; border: 1px solid #3b82f6; border-radius: 4px; cursor: pointer; font-size: 0.75rem; font-weight: 500;">
              Test Connection
            </button>
          `
        : ''}
    </div>
  `;
}

function renderCapability(name: string, supported: boolean, models: string) {
  return html`
    <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: ${supported ? '#f0fdf4' : '#fef2f2'}; border-radius: 4px;">
      <span style="font-size: 1.25rem; margin-top: -2px;">${supported ? '✓' : '✗'}</span>
      <div style="flex: 1;">
        <div style="font-weight: 500; color: ${supported ? '#047857' : '#991b1b'}; margin-bottom: 0.25rem; font-size: 0.875rem;">
          ${name}
        </div>
        <div style="font-size: 0.75rem; color: #6b7280;">
          ${supported ? models : 'Not supported'}
        </div>
      </div>
    </div>
  `;
}

function renderServicePlan(name: string, price: string, features: string[], selected: boolean) {
  return html`
    <div style="background: white; padding: 1.5rem; border-radius: 8px; border: 2px solid ${selected ? '#3b82f6' : '#e5e7eb'}; position: relative;">
      ${selected
        ? html`
            <div style="position: absolute; top: -12px; right: 1rem; padding: 0.375rem 0.75rem; background: #3b82f6; color: white; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
              Current Plan
            </div>
          `
        : ''}
      <div style="margin-bottom: 1rem;">
        <h3 style="margin: 0 0 0.25rem 0; font-size: 1.125rem; color: #1f2937; font-weight: 600;">
          ${name}
        </h3>
        <div style="font-size: 1.5rem; font-weight: 700; color: #3b82f6;">
          ${price}
        </div>
      </div>
      <ul style="margin: 0; padding-left: 1.25rem; list-style: none;">
        ${features.map(
          (feature) => html`
            <li style="margin-bottom: 0.5rem; color: #4b5563; font-size: 0.875rem; position: relative; padding-left: 1rem;">
              <span style="position: absolute; left: 0; color: #10b981;">✓</span>
              ${feature}
            </li>
          `
        )}
      </ul>
      ${!selected
        ? html`
            <button style="width: 100%; margin-top: 1rem; padding: 0.75rem; background: white; color: #3b82f6; border: 1px solid #3b82f6; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
              Upgrade to ${name}
            </button>
          `
        : ''}
    </div>
  `;
}
