import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { AIRouter } from '@vwx/ai-integration';
import type { PipelineContext, PipelineResult, PipelineOptions } from '@vwx/ai-integration';

/**
 * VWX AI Generation Panel Component
 *
 * Pipeline execution UI for VW-themed AI asset generation.
 * Provides controls for text/image input, context selection, and pipeline execution.
 *
 * @fires vwx-generation-start - Fired when generation starts
 * @fires vwx-generation-progress - Fired during pipeline stages
 * @fires vwx-generation-complete - Fired when generation completes successfully
 * @fires vwx-generation-error - Fired when generation fails
 *
 * @example
 * ```html
 * <vwx-ai-generation-panel
 *   .router="${aiRouter}"
 *   @vwx-generation-complete="${handleResults}"
 * ></vwx-ai-generation-panel>
 * ```
 */
@customElement('vwx-ai-generation-panel')
export class VwxAIGenerationPanel extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .vwx-ai-panel {
      font-family: var(--vw-typography-fontFamily-sans, sans-serif);
    }

    .vwx-ai-panel__section {
      margin-bottom: var(--vw-spacing-component-gap-lg, 1.5rem);
      padding: var(--vw-spacing-component-padding-lg, 1rem);
      border: 2px solid var(--vw-theme-bw-color-border-primary, #ccc);
      border-radius: 8px;
      background: var(--vw-theme-bw-color-background-primary, #fff);
    }

    .vwx-ai-panel__label {
      display: block;
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      color: var(--vw-theme-bw-color-text-primary, #000);
      margin-bottom: 0.5rem;
    }

    .vwx-ai-panel__textarea {
      width: 100%;
      min-height: 120px;
      box-sizing: border-box;
      font-family: var(--vw-typography-fontFamily-sans, sans-serif);
      font-size: var(--vw-typography-fontSize-base, 1rem);
      padding: var(--vw-spacing-component-padding-md, 0.75rem);
      border: 2px solid var(--vw-theme-bw-color-border-primary, #ccc);
      border-radius: 6px;
      background: var(--vw-theme-bw-color-background-primary, #fff);
      color: var(--vw-theme-bw-color-text-primary, #000);
      resize: vertical;
      outline: none;
      transition: border-color 0.2s;
    }

    .vwx-ai-panel__textarea:focus {
      border-color: var(--vw-theme-bw-color-border-focus, #000);
    }

    .vwx-ai-panel__file-input {
      display: none;
    }

    .vwx-ai-panel__file-label {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border: 2px solid var(--vw-theme-bw-color-border-primary, #ccc);
      border-radius: 6px;
      background: var(--vw-theme-bw-color-background-primary, #fff);
      color: var(--vw-theme-bw-color-text-primary, #000);
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      font-weight: var(--vw-typography-fontWeight-medium, 500);
      cursor: pointer;
      transition: all 0.2s;
    }

    .vwx-ai-panel__file-label:hover {
      border-color: var(--vw-theme-bw-color-border-focus, #000);
      background: var(--vw-theme-bw-color-background-secondary, #f5f5f5);
    }

    .vwx-ai-panel__file-name {
      margin-left: 1rem;
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      color: var(--vw-theme-bw-color-text-secondary, #666);
    }

    .vwx-ai-panel__controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .vwx-ai-panel__control {
      display: flex;
      flex-direction: column;
    }

    .vwx-ai-panel__select {
      padding: 0.625rem 0.75rem;
      border: 2px solid var(--vw-theme-bw-color-border-primary, #ccc);
      border-radius: 6px;
      background: var(--vw-theme-bw-color-background-primary, #fff);
      color: var(--vw-theme-bw-color-text-primary, #000);
      font-size: var(--vw-typography-fontSize-base, 1rem);
      outline: none;
      transition: border-color 0.2s;
    }

    .vwx-ai-panel__select:focus {
      border-color: var(--vw-theme-bw-color-border-focus, #000);
    }

    .vwx-ai-panel__cost-estimate {
      padding: 1rem;
      background: var(--vw-theme-bw-color-background-secondary, #f5f5f5);
      border-radius: 6px;
      margin-top: 1rem;
    }

    .vwx-ai-panel__cost-label {
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      color: var(--vw-theme-bw-color-text-secondary, #666);
      margin-bottom: 0.25rem;
    }

    .vwx-ai-panel__cost-value {
      font-size: var(--vw-typography-fontSize-xl, 1.25rem);
      font-weight: var(--vw-typography-fontWeight-bold, 700);
      color: var(--vw-theme-bw-color-text-primary, #000);
    }

    .vwx-ai-panel__execute-btn {
      width: 100%;
      padding: 1rem 2rem;
      border: none;
      border-radius: 6px;
      background: var(--vw-theme-bw-color-interactive-primary, #000);
      color: var(--vw-theme-bw-color-text-inverse, #fff);
      font-size: var(--vw-typography-fontSize-lg, 1.125rem);
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      cursor: pointer;
      transition: all 0.2s;
    }

    .vwx-ai-panel__execute-btn:hover:not(:disabled) {
      opacity: 0.85;
      transform: translateY(-1px);
    }

    .vwx-ai-panel__execute-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .vwx-ai-panel__progress {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--vw-theme-bw-color-background-secondary, #f5f5f5);
      border-radius: 6px;
    }

    .vwx-ai-panel__progress-stage {
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      font-weight: var(--vw-typography-fontWeight-medium, 500);
      color: var(--vw-theme-bw-color-text-primary, #000);
      margin-bottom: 0.5rem;
    }

    .vwx-ai-panel__progress-bar {
      width: 100%;
      height: 8px;
      background: var(--vw-theme-bw-color-background-primary, #fff);
      border-radius: 4px;
      overflow: hidden;
    }

    .vwx-ai-panel__progress-fill {
      height: 100%;
      background: var(--vw-theme-bw-color-interactive-primary, #000);
      transition: width 0.3s ease;
    }

    .vwx-ai-panel__error {
      margin-top: 1rem;
      padding: 1rem;
      background: #fef2f2;
      border: 2px solid var(--vw-theme-bw-color-status-error, #f44336);
      border-radius: 6px;
      color: #7f1d1d;
    }

    .vwx-ai-panel__error-title {
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      margin-bottom: 0.25rem;
    }

    /* Archetype variations */
    :host([archetype='beetle']) .vwx-ai-panel__section {
      border-radius: 24px;
    }

    :host([archetype='bus']) .vwx-ai-panel__section {
      border-radius: 4px;
      border-width: 3px;
    }

    :host([archetype='ghia']) .vwx-ai-panel__section {
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    :host([archetype='type3']) .vwx-ai-panel__section {
      border-radius: 2px;
    }
  `;

  @property({ type: Object })
  router?: AIRouter;

  @property({ type: Object })
  context: PipelineContext = {
    theme: 'bw',
    vehicle: 'beetle',
    era: '1960s',
  };

  @property({ type: String, reflect: true })
  archetype: 'beetle' | 'bus' | 'ghia' | 'type3' = 'beetle';

  @state()
  private textInput = '';

  @state()
  private sourceImage: File | null = null;

  @state()
  private isGenerating = false;

  @state()
  private currentStage = '';

  @state()
  private progress = 0;

  @state()
  private estimatedCost = 0.0;

  @state()
  private errorMessage = '';

  @state()
  private selectedTheme: 'bw' | 'color' | 'patina' = 'bw';

  @state()
  private selectedVehicle: 'beetle' | 'bus' | 'karmann-ghia' | 'type-3' = 'beetle';

  @state()
  private selectedEra: '1950s' | '1960s' | '1970s' = '1960s';

  private handleTextInput(e: Event): void {
    const textarea = e.target as HTMLTextAreaElement;
    this.textInput = textarea.value;
    this.updateCostEstimate();
  }

  private handleFileSelect(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.sourceImage = input.files[0];
      this.updateCostEstimate();
    }
  }

  private handleThemeChange(e: Event): void {
    const select = e.target as HTMLSelectElement;
    this.selectedTheme = select.value as 'bw' | 'color' | 'patina';
  }

  private handleVehicleChange(e: Event): void {
    const select = e.target as HTMLSelectElement;
    this.selectedVehicle = select.value as 'beetle' | 'bus' | 'karmann-ghia' | 'type-3';
  }

  private handleEraChange(e: Event): void {
    const select = e.target as HTMLSelectElement;
    this.selectedEra = select.value as '1950s' | '1960s' | '1970s';
  }

  private updateCostEstimate(): void {
    // Simple cost estimation
    let cost = 0.0;

    if (this.sourceImage) {
      cost += 0.015; // Image analysis
    }

    cost += 0.03; // Prompt generation
    cost += 0.025; // Cultural validation
    cost += 0.05; // Asset generation (1 asset)

    this.estimatedCost = cost;
  }

  private async executeGeneration(): Promise<void> {
    if (!this.router) {
      this.errorMessage = 'No AI router configured. Please configure your API keys first.';
      return;
    }

    if (!this.textInput && !this.sourceImage) {
      this.errorMessage = 'Please provide either text input or upload an image.';
      return;
    }

    this.isGenerating = true;
    this.errorMessage = '';
    this.progress = 0;

    this.dispatchEvent(
      new CustomEvent('vwx-generation-start', {
        bubbles: true,
        composed: true,
      })
    );

    try {
      // Import pipeline dynamically
      const { AIPipeline } = await import('@vwx/ai-integration');
      const pipeline = new AIPipeline(this.router);

      // Build pipeline context
      const pipelineContext: PipelineContext = {
        theme: this.selectedTheme,
        vehicle: this.selectedVehicle,
        era: this.selectedEra,
      };

      // Execute pipeline with progress tracking
      this.updateProgress('image-analysis', 10);

      const result: PipelineResult = await pipeline.execute({
        text: this.textInput || undefined,
        sourceImage: this.sourceImage || undefined,
        context: pipelineContext,
        options: {
          analyzeImage: !!this.sourceImage,
          assetCount: 1,
          assetSize: '1024x1024',
        } as PipelineOptions,
      });

      this.progress = 100;
      this.isGenerating = false;

      if (result.success) {
        this.dispatchEvent(
          new CustomEvent('vwx-generation-complete', {
            detail: result,
            bubbles: true,
            composed: true,
          })
        );
      } else {
        this.errorMessage = result.error?.message || 'Generation failed';
        this.dispatchEvent(
          new CustomEvent('vwx-generation-error', {
            detail: result.error,
            bubbles: true,
            composed: true,
          })
        );
      }
    } catch (error) {
      this.isGenerating = false;
      const err = error as Error;
      this.errorMessage = err.message;

      this.dispatchEvent(
        new CustomEvent('vwx-generation-error', {
          detail: { message: err.message },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private updateProgress(stage: string, percent: number): void {
    const stageLabels: Record<string, string> = {
      'image-analysis': 'Analyzing image...',
      'prompt-generation': 'Generating prompts...',
      'cultural-validation': 'Validating cultural authenticity...',
      'asset-generation': 'Generating assets...',
      complete: 'Complete!',
    };

    this.currentStage = stageLabels[stage] || stage;
    this.progress = percent;

    this.dispatchEvent(
      new CustomEvent('vwx-generation-progress', {
        detail: { stage, progress: percent },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      <div class="vwx-ai-panel">
        <!-- Text Input -->
        <div class="vwx-ai-panel__section">
          <label class="vwx-ai-panel__label" for="text-input">
            Text Description
          </label>
          <textarea
            id="text-input"
            class="vwx-ai-panel__textarea"
            placeholder="Describe the VW-themed asset you want to generate..."
            .value="${this.textInput}"
            @input="${this.handleTextInput}"
            ?disabled="${this.isGenerating}"
          ></textarea>
        </div>

        <!-- Image Upload -->
        <div class="vwx-ai-panel__section">
          <label class="vwx-ai-panel__label">Source Image (Optional)</label>
          <input
            type="file"
            id="image-input"
            class="vwx-ai-panel__file-input"
            accept="image/*"
            @change="${this.handleFileSelect}"
            ?disabled="${this.isGenerating}"
          />
          <label for="image-input" class="vwx-ai-panel__file-label">
            Choose Image
          </label>
          ${this.sourceImage
            ? html`<span class="vwx-ai-panel__file-name">${this.sourceImage.name}</span>`
            : null}
        </div>

        <!-- Context Controls -->
        <div class="vwx-ai-panel__section">
          <label class="vwx-ai-panel__label">Context & Options</label>
          <div class="vwx-ai-panel__controls">
            <div class="vwx-ai-panel__control">
              <label class="vwx-ai-panel__label" for="theme-select">Theme</label>
              <select
                id="theme-select"
                class="vwx-ai-panel__select"
                .value="${this.selectedTheme}"
                @change="${this.handleThemeChange}"
                ?disabled="${this.isGenerating}"
              >
                <option value="bw">B&W</option>
                <option value="color">Color</option>
                <option value="patina">Patina</option>
              </select>
            </div>

            <div class="vwx-ai-panel__control">
              <label class="vwx-ai-panel__label" for="vehicle-select">Vehicle</label>
              <select
                id="vehicle-select"
                class="vwx-ai-panel__select"
                .value="${this.selectedVehicle}"
                @change="${this.handleVehicleChange}"
                ?disabled="${this.isGenerating}"
              >
                <option value="beetle">Beetle</option>
                <option value="bus">Bus</option>
                <option value="karmann-ghia">Karmann Ghia</option>
                <option value="type-3">Type 3</option>
              </select>
            </div>

            <div class="vwx-ai-panel__control">
              <label class="vwx-ai-panel__label" for="era-select">Era</label>
              <select
                id="era-select"
                class="vwx-ai-panel__select"
                .value="${this.selectedEra}"
                @change="${this.handleEraChange}"
                ?disabled="${this.isGenerating}"
              >
                <option value="1950s">1950s</option>
                <option value="1960s">1960s</option>
                <option value="1970s">1970s</option>
              </select>
            </div>
          </div>

          <!-- Cost Estimate -->
          <div class="vwx-ai-panel__cost-estimate">
            <div class="vwx-ai-panel__cost-label">Estimated Cost</div>
            <div class="vwx-ai-panel__cost-value">
              $${this.estimatedCost.toFixed(3)}
            </div>
          </div>
        </div>

        <!-- Execute Button -->
        <button
          class="vwx-ai-panel__execute-btn"
          @click="${this.executeGeneration}"
          ?disabled="${this.isGenerating || (!this.textInput && !this.sourceImage)}"
        >
          ${this.isGenerating ? 'Generating...' : 'Generate Asset'}
        </button>

        <!-- Progress Indicator -->
        ${this.isGenerating
          ? html`
              <div class="vwx-ai-panel__progress">
                <div class="vwx-ai-panel__progress-stage">${this.currentStage}</div>
                <div class="vwx-ai-panel__progress-bar">
                  <div
                    class="vwx-ai-panel__progress-fill"
                    style="width: ${this.progress}%"
                  ></div>
                </div>
              </div>
            `
          : null}

        <!-- Error Display -->
        ${this.errorMessage
          ? html`
              <div class="vwx-ai-panel__error">
                <div class="vwx-ai-panel__error-title">Error</div>
                <div>${this.errorMessage}</div>
              </div>
            `
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vwx-ai-generation-panel': VwxAIGenerationPanel;
  }
}
