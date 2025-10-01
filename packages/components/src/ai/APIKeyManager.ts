import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * VWX API Key Manager Component
 *
 * Secure API key input and storage for BYOK (Bring Your Own Key) architecture.
 * Supports 5 AI providers: OpenRouter, FAL.ai, OpenAI, Anthropic, Google AI.
 *
 * @fires vwx-keys-updated - Fired when keys are updated, provides sanitized keys object
 * @fires vwx-keys-cleared - Fired when all keys are cleared
 *
 * @example
 * ```html
 * <vwx-api-key-manager
 *   .providers="${['openai', 'anthropic', 'google']}"
 *   @vwx-keys-updated="${handleKeysUpdated}"
 * ></vwx-api-key-manager>
 * ```
 */
@customElement('vwx-api-key-manager')
export class VwxAPIKeyManager extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .vwx-api-key-manager {
      font-family: var(--vw-typography-fontFamily-sans, sans-serif);
    }

    .vwx-api-key-manager__header {
      margin-bottom: var(--vw-spacing-component-gap-lg, 1.5rem);
    }

    .vwx-api-key-manager__title {
      font-size: var(--vw-typography-fontSize-xl, 1.25rem);
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      color: var(--vw-theme-bw-color-text-primary, #000);
      margin: 0 0 0.5rem 0;
    }

    .vwx-api-key-manager__description {
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      color: var(--vw-theme-bw-color-text-secondary, #666);
      margin: 0;
    }

    .vwx-api-key-manager__providers {
      display: flex;
      flex-direction: column;
      gap: var(--vw-spacing-component-gap-md, 1rem);
    }

    .vwx-api-key-manager__provider {
      padding: var(--vw-spacing-component-padding-md, 0.75rem);
      border: 2px solid var(--vw-theme-bw-color-border-primary, #ccc);
      border-radius: 8px;
      background: var(--vw-theme-bw-color-background-primary, #fff);
    }

    .vwx-api-key-manager__provider-name {
      font-size: var(--vw-typography-fontSize-base, 1rem);
      font-weight: var(--vw-typography-fontWeight-medium, 500);
      color: var(--vw-theme-bw-color-text-primary, #000);
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .vwx-api-key-manager__provider-status {
      font-size: var(--vw-typography-fontSize-xs, 0.75rem);
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      background: var(--vw-theme-bw-color-status-success, #4caf50);
      color: #fff;
    }

    .vwx-api-key-manager__provider-status--empty {
      background: var(--vw-theme-bw-color-interactive-secondary, #f5f5f5);
      color: var(--vw-theme-bw-color-text-secondary, #666);
    }

    .vwx-api-key-manager__input-wrapper {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .vwx-api-key-manager__input {
      flex: 1;
      font-family: var(--vw-typography-fontFamily-mono, monospace);
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      padding: 0.625rem 0.75rem;
      border: 2px solid var(--vw-theme-bw-color-border-primary, #ccc);
      border-radius: 6px;
      background: var(--vw-theme-bw-color-background-primary, #fff);
      color: var(--vw-theme-bw-color-text-primary, #000);
      transition: border-color 0.2s;
      outline: none;
    }

    .vwx-api-key-manager__input:focus {
      border-color: var(--vw-theme-bw-color-border-focus, #000);
    }

    .vwx-api-key-manager__input::placeholder {
      color: var(--vw-theme-bw-color-text-tertiary, #999);
    }

    .vwx-api-key-manager__toggle-btn,
    .vwx-api-key-manager__clear-btn {
      padding: 0.625rem 0.75rem;
      border: 2px solid var(--vw-theme-bw-color-border-primary, #ccc);
      border-radius: 6px;
      background: var(--vw-theme-bw-color-background-primary, #fff);
      color: var(--vw-theme-bw-color-text-primary, #000);
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      font-weight: var(--vw-typography-fontWeight-medium, 500);
      cursor: pointer;
      transition: all 0.2s;
    }

    .vwx-api-key-manager__toggle-btn:hover,
    .vwx-api-key-manager__clear-btn:hover {
      border-color: var(--vw-theme-bw-color-border-focus, #000);
      background: var(--vw-theme-bw-color-background-secondary, #f5f5f5);
    }

    .vwx-api-key-manager__actions {
      margin-top: var(--vw-spacing-component-gap-lg, 1.5rem);
      display: flex;
      gap: 0.75rem;
    }

    .vwx-api-key-manager__clear-all-btn {
      padding: 0.75rem 1.5rem;
      border: 2px solid var(--vw-theme-bw-color-status-error, #f44336);
      border-radius: 6px;
      background: var(--vw-theme-bw-color-background-primary, #fff);
      color: var(--vw-theme-bw-color-status-error, #f44336);
      font-size: var(--vw-typography-fontSize-base, 1rem);
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      cursor: pointer;
      transition: all 0.2s;
    }

    .vwx-api-key-manager__clear-all-btn:hover {
      background: var(--vw-theme-bw-color-status-error, #f44336);
      color: #fff;
    }

    .vwx-api-key-manager__help-text {
      font-size: var(--vw-typography-fontSize-xs, 0.75rem);
      color: var(--vw-theme-bw-color-text-tertiary, #999);
      margin-top: 0.25rem;
    }

    /* Archetype variations */
    :host([archetype='beetle']) .vwx-api-key-manager__provider {
      border-radius: 24px;
    }

    :host([archetype='bus']) .vwx-api-key-manager__provider {
      border-radius: 4px;
      border-width: 3px;
    }

    :host([archetype='ghia']) .vwx-api-key-manager__provider {
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    :host([archetype='type3']) .vwx-api-key-manager__provider {
      border-radius: 2px;
    }
  `;

  private static readonly STORAGE_KEY = 'vwx-api-keys';
  private static readonly PROVIDER_LABELS: Record<string, string> = {
    openrouter: 'OpenRouter',
    fal: 'FAL.ai',
    openai: 'OpenAI',
    anthropic: 'Anthropic (Claude)',
    google: 'Google AI (Gemini)',
  };

  @property({ type: Array })
  providers: string[] = ['openrouter', 'fal', 'openai', 'anthropic', 'google'];

  @property({ type: String, reflect: true })
  archetype: 'beetle' | 'bus' | 'ghia' | 'type3' = 'beetle';

  @state()
  private keys: Record<string, string> = {};

  @state()
  private visibility: Record<string, boolean> = {};

  connectedCallback(): void {
    super.connectedCallback();
    this.loadKeys();
  }

  private loadKeys(): void {
    try {
      const stored = localStorage.getItem(VwxAPIKeyManager.STORAGE_KEY);
      if (stored) {
        this.keys = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load API keys from localStorage:', error);
    }
  }

  private saveKeys(): void {
    try {
      localStorage.setItem(VwxAPIKeyManager.STORAGE_KEY, JSON.stringify(this.keys));
      this.dispatchKeysUpdated();
    } catch (error) {
      console.error('Failed to save API keys to localStorage:', error);
    }
  }

  private handleKeyInput(provider: string, e: Event): void {
    const input = e.target as HTMLInputElement;
    const value = input.value.trim();

    if (value) {
      this.keys = { ...this.keys, [provider]: value };
    } else {
      const newKeys = { ...this.keys };
      delete newKeys[provider];
      this.keys = newKeys;
    }

    this.saveKeys();
  }

  private toggleVisibility(provider: string): void {
    this.visibility = {
      ...this.visibility,
      [provider]: !this.visibility[provider],
    };
  }

  private clearKey(provider: string): void {
    const newKeys = { ...this.keys };
    delete newKeys[provider];
    this.keys = newKeys;
    this.saveKeys();
  }

  private clearAllKeys(): void {
    if (confirm('Are you sure you want to clear all API keys? This action cannot be undone.')) {
      this.keys = {};
      this.visibility = {};
      localStorage.removeItem(VwxAPIKeyManager.STORAGE_KEY);

      this.dispatchEvent(
        new CustomEvent('vwx-keys-cleared', {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private dispatchKeysUpdated(): void {
    // Only dispatch sanitized keys (check if they exist, not the actual values)
    const sanitized = Object.keys(this.keys).reduce((acc, provider) => {
      acc[provider] = '***HIDDEN***';
      return acc;
    }, {} as Record<string, string>);

    this.dispatchEvent(
      new CustomEvent('vwx-keys-updated', {
        detail: {
          providers: Object.keys(this.keys),
          sanitized,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private hasKey(provider: string): boolean {
    return !!this.keys[provider];
  }

  private getInputType(provider: string): string {
    return this.visibility[provider] ? 'text' : 'password';
  }

  /**
   * Get stored API keys (for use by AI router)
   * Returns actual keys for authentication
   */
  getKeys(): Record<string, string> {
    return { ...this.keys };
  }

  /**
   * Validate a specific provider's key format
   */
  private validateKey(provider: string, key: string): boolean {
    const patterns: Record<string, RegExp> = {
      openrouter: /^sk-or-v1-[a-f0-9]{64}$/i,
      openai: /^sk-[a-zA-Z0-9]{48}$/,
      anthropic: /^sk-ant-[a-zA-Z0-9-_]{95}$/,
      google: /^AIza[a-zA-Z0-9_-]{35}$/,
      fal: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
    };

    const pattern = patterns[provider];
    return pattern ? pattern.test(key) : key.length > 0;
  }

  override render() {
    return html`
      <div class="vwx-api-key-manager">
        <div class="vwx-api-key-manager__header">
          <h2 class="vwx-api-key-manager__title">API Key Configuration</h2>
          <p class="vwx-api-key-manager__description">
            Configure your AI provider API keys. Keys are stored securely in your browser's local storage.
          </p>
        </div>

        <div class="vwx-api-key-manager__providers">
          ${this.providers.map(
            (provider) => html`
              <div class="vwx-api-key-manager__provider">
                <div class="vwx-api-key-manager__provider-name">
                  ${VwxAPIKeyManager.PROVIDER_LABELS[provider] || provider}
                  <span
                    class="vwx-api-key-manager__provider-status ${!this.hasKey(provider)
                      ? 'vwx-api-key-manager__provider-status--empty'
                      : ''}"
                  >
                    ${this.hasKey(provider) ? 'Configured' : 'Not Set'}
                  </span>
                </div>
                <div class="vwx-api-key-manager__input-wrapper">
                  <input
                    type="${this.getInputType(provider)}"
                    class="vwx-api-key-manager__input"
                    .value="${this.keys[provider] || ''}"
                    placeholder="Enter ${VwxAPIKeyManager.PROVIDER_LABELS[provider]} API key..."
                    @input="${(e: Event) => this.handleKeyInput(provider, e)}"
                    aria-label="${VwxAPIKeyManager.PROVIDER_LABELS[provider]} API key"
                  />
                  <button
                    class="vwx-api-key-manager__toggle-btn"
                    @click="${() => this.toggleVisibility(provider)}"
                    aria-label="${this.visibility[provider] ? 'Hide' : 'Show'} API key"
                  >
                    ${this.visibility[provider] ? 'Hide' : 'Show'}
                  </button>
                  ${this.hasKey(provider)
                    ? html`
                        <button
                          class="vwx-api-key-manager__clear-btn"
                          @click="${() => this.clearKey(provider)}"
                          aria-label="Clear ${VwxAPIKeyManager.PROVIDER_LABELS[provider]} API key"
                        >
                          Clear
                        </button>
                      `
                    : null}
                </div>
                <p class="vwx-api-key-manager__help-text">
                  Get your API key from ${VwxAPIKeyManager.PROVIDER_LABELS[provider]} dashboard
                </p>
              </div>
            `
          )}
        </div>

        <div class="vwx-api-key-manager__actions">
          <button
            class="vwx-api-key-manager__clear-all-btn"
            @click="${this.clearAllKeys}"
            ?disabled="${Object.keys(this.keys).length === 0}"
          >
            Clear All Keys
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vwx-api-key-manager': VwxAPIKeyManager;
  }
}
