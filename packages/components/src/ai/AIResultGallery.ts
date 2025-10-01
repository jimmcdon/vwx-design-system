import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { PipelineResult, GeneratedAsset } from '@vwx/ai-integration';

/**
 * VWX AI Result Gallery Component
 *
 * Display generated AI assets with cultural scores, metadata, and download options.
 * Supports grid/list view toggle and filtering by score threshold.
 *
 * @fires vwx-asset-select - Fired when an asset is selected
 * @fires vwx-asset-download - Fired when download is triggered
 *
 * @example
 * ```html
 * <vwx-ai-result-gallery
 *   .results="${pipelineResults}"
 *   @vwx-asset-select="${handleSelect}"
 * ></vwx-ai-result-gallery>
 * ```
 */
@customElement('vwx-ai-result-gallery')
export class VwxAIResultGallery extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .vwx-gallery {
      font-family: var(--vw-typography-fontFamily-sans, sans-serif);
    }

    .vwx-gallery__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--vw-spacing-component-gap-lg, 1.5rem);
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--vw-theme-bw-color-border-primary, #ccc);
    }

    .vwx-gallery__title {
      font-size: var(--vw-typography-fontSize-xl, 1.25rem);
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      color: var(--vw-theme-bw-color-text-primary, #000);
      margin: 0;
    }

    .vwx-gallery__controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .vwx-gallery__view-toggle {
      display: flex;
      gap: 0.5rem;
    }

    .vwx-gallery__view-btn {
      padding: 0.5rem 0.75rem;
      border: 2px solid var(--vw-theme-bw-color-border-primary, #ccc);
      border-radius: 6px;
      background: var(--vw-theme-bw-color-background-primary, #fff);
      color: var(--vw-theme-bw-color-text-primary, #000);
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      cursor: pointer;
      transition: all 0.2s;
    }

    .vwx-gallery__view-btn--active {
      background: var(--vw-theme-bw-color-interactive-primary, #000);
      color: var(--vw-theme-bw-color-text-inverse, #fff);
      border-color: var(--vw-theme-bw-color-interactive-primary, #000);
    }

    .vwx-gallery__filter {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .vwx-gallery__filter-label {
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      color: var(--vw-theme-bw-color-text-secondary, #666);
    }

    .vwx-gallery__filter-input {
      width: 80px;
      padding: 0.5rem;
      border: 2px solid var(--vw-theme-bw-color-border-primary, #ccc);
      border-radius: 6px;
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
    }

    .vwx-gallery__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--vw-spacing-component-gap-lg, 1.5rem);
    }

    .vwx-gallery__list {
      display: flex;
      flex-direction: column;
      gap: var(--vw-spacing-component-gap-md, 1rem);
    }

    .vwx-gallery__item {
      border: 2px solid var(--vw-theme-bw-color-border-primary, #ccc);
      border-radius: 8px;
      background: var(--vw-theme-bw-color-background-primary, #fff);
      overflow: hidden;
      transition: all 0.2s;
      cursor: pointer;
    }

    .vwx-gallery__item:hover {
      border-color: var(--vw-theme-bw-color-border-focus, #000);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .vwx-gallery__item--list {
      display: flex;
      gap: 1rem;
    }

    .vwx-gallery__image-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 100%; /* 1:1 aspect ratio */
      overflow: hidden;
      background: var(--vw-theme-bw-color-background-secondary, #f5f5f5);
    }

    .vwx-gallery__item--list .vwx-gallery__image-wrapper {
      width: 200px;
      padding-bottom: 200px;
      flex-shrink: 0;
    }

    .vwx-gallery__image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .vwx-gallery__score-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 20px;
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      font-weight: var(--vw-typography-fontWeight-bold, 700);
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .vwx-gallery__score-badge--high {
      color: var(--vw-theme-bw-color-status-success, #4caf50);
    }

    .vwx-gallery__score-badge--medium {
      color: var(--vw-theme-bw-color-status-warning, #ff9800);
    }

    .vwx-gallery__score-badge--low {
      color: var(--vw-theme-bw-color-status-error, #f44336);
    }

    .vwx-gallery__content {
      padding: 1rem;
    }

    .vwx-gallery__item--list .vwx-gallery__content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .vwx-gallery__meta {
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      color: var(--vw-theme-bw-color-text-secondary, #666);
      margin-bottom: 0.5rem;
    }

    .vwx-gallery__prompt {
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      color: var(--vw-theme-bw-color-text-primary, #000);
      line-height: 1.5;
      margin-bottom: 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .vwx-gallery__item--list .vwx-gallery__prompt {
      -webkit-line-clamp: 2;
    }

    .vwx-gallery__actions {
      display: flex;
      gap: 0.5rem;
      margin-top: auto;
    }

    .vwx-gallery__btn {
      flex: 1;
      padding: 0.5rem 1rem;
      border: 2px solid var(--vw-theme-bw-color-border-primary, #ccc);
      border-radius: 6px;
      background: var(--vw-theme-bw-color-background-primary, #fff);
      color: var(--vw-theme-bw-color-text-primary, #000);
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      font-weight: var(--vw-typography-fontWeight-medium, 500);
      cursor: pointer;
      transition: all 0.2s;
    }

    .vwx-gallery__btn:hover {
      border-color: var(--vw-theme-bw-color-border-focus, #000);
      background: var(--vw-theme-bw-color-background-secondary, #f5f5f5);
    }

    .vwx-gallery__empty {
      padding: 3rem;
      text-align: center;
      color: var(--vw-theme-bw-color-text-secondary, #666);
    }

    .vwx-gallery__empty-title {
      font-size: var(--vw-typography-fontSize-lg, 1.125rem);
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      margin-bottom: 0.5rem;
    }

    /* Archetype variations */
    :host([archetype='beetle']) .vwx-gallery__item {
      border-radius: 24px;
    }

    :host([archetype='bus']) .vwx-gallery__item {
      border-radius: 4px;
      border-width: 3px;
    }

    :host([archetype='ghia']) .vwx-gallery__item {
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    :host([archetype='type3']) .vwx-gallery__item {
      border-radius: 2px;
    }
  `;

  @property({ type: Array })
  results: PipelineResult[] = [];

  @property({ type: String, reflect: true })
  archetype: 'beetle' | 'bus' | 'ghia' | 'type3' = 'beetle';

  @state()
  private viewMode: 'grid' | 'list' = 'grid';

  @state()
  private scoreThreshold = 0;

  private getScoreClass(score: number): string {
    if (score >= 85) return 'vwx-gallery__score-badge--high';
    if (score >= 70) return 'vwx-gallery__score-badge--medium';
    return 'vwx-gallery__score-badge--low';
  }

  private handleViewChange(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  private handleScoreFilterChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.scoreThreshold = parseInt(input.value, 10) || 0;
  }

  private handleAssetSelect(result: PipelineResult, asset: GeneratedAsset): void {
    this.dispatchEvent(
      new CustomEvent('vwx-asset-select', {
        detail: { result, asset },
        bubbles: true,
        composed: true,
      })
    );
  }

  private async handleDownload(asset: GeneratedAsset): Promise<void> {
    this.dispatchEvent(
      new CustomEvent('vwx-asset-download', {
        detail: { asset },
        bubbles: true,
        composed: true,
      })
    );

    try {
      // Fetch the image and trigger download
      const response = await fetch(asset.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vwx-asset-${Date.now()}.${asset.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download asset:', error);
    }
  }

  private getFilteredResults(): Array<{ result: PipelineResult; asset: GeneratedAsset }> {
    const items: Array<{ result: PipelineResult; asset: GeneratedAsset }> = [];

    this.results.forEach((result) => {
      if (result.generatedAssets) {
        result.generatedAssets.forEach((asset) => {
          const score = result.culturalValidation?.score || 0;
          if (score >= this.scoreThreshold) {
            items.push({ result, asset });
          }
        });
      }
    });

    return items;
  }

  override render() {
    const items = this.getFilteredResults();

    return html`
      <div class="vwx-gallery">
        <div class="vwx-gallery__header">
          <h2 class="vwx-gallery__title">
            Generated Assets (${items.length})
          </h2>

          <div class="vwx-gallery__controls">
            <div class="vwx-gallery__view-toggle">
              <button
                class="vwx-gallery__view-btn ${this.viewMode === 'grid'
                  ? 'vwx-gallery__view-btn--active'
                  : ''}"
                @click="${() => this.handleViewChange('grid')}"
                aria-label="Grid view"
              >
                Grid
              </button>
              <button
                class="vwx-gallery__view-btn ${this.viewMode === 'list'
                  ? 'vwx-gallery__view-btn--active'
                  : ''}"
                @click="${() => this.handleViewChange('list')}"
                aria-label="List view"
              >
                List
              </button>
            </div>

            <div class="vwx-gallery__filter">
              <label class="vwx-gallery__filter-label" for="score-filter">
                Min Score:
              </label>
              <input
                type="number"
                id="score-filter"
                class="vwx-gallery__filter-input"
                min="0"
                max="100"
                .value="${this.scoreThreshold}"
                @input="${this.handleScoreFilterChange}"
              />
            </div>
          </div>
        </div>

        ${items.length === 0
          ? html`
              <div class="vwx-gallery__empty">
                <div class="vwx-gallery__empty-title">No assets to display</div>
                <p>
                  ${this.results.length === 0
                    ? 'Generate assets using the AI Generation Panel'
                    : 'No assets match the current filter criteria'}
                </p>
              </div>
            `
          : html`
              <div
                class="${this.viewMode === 'grid'
                  ? 'vwx-gallery__grid'
                  : 'vwx-gallery__list'}"
              >
                ${items.map(
                  ({ result, asset }) => html`
                    <div
                      class="vwx-gallery__item ${this.viewMode === 'list'
                        ? 'vwx-gallery__item--list'
                        : ''}"
                      @click="${() => this.handleAssetSelect(result, asset)}"
                    >
                      <div class="vwx-gallery__image-wrapper">
                        <img
                          class="vwx-gallery__image"
                          src="${asset.url}"
                          alt="${asset.prompt}"
                          loading="lazy"
                        />
                        ${result.culturalValidation
                          ? html`
                              <div
                                class="vwx-gallery__score-badge ${this.getScoreClass(
                                  result.culturalValidation.score
                                )}"
                              >
                                ${result.culturalValidation.score}/100
                              </div>
                            `
                          : null}
                      </div>

                      <div class="vwx-gallery__content">
                        <div class="vwx-gallery__meta">
                          ${asset.metadata?.provider || 'Unknown'} •
                          ${asset.width}x${asset.height} •
                          ${asset.format.toUpperCase()}
                          ${asset.metadata?.cost
                            ? ` • $${asset.metadata.cost.toFixed(3)}`
                            : ''}
                        </div>

                        <div class="vwx-gallery__prompt">
                          ${asset.prompt}
                        </div>

                        <div class="vwx-gallery__actions">
                          <button
                            class="vwx-gallery__btn"
                            @click="${(e: Event) => {
                              e.stopPropagation();
                              this.handleDownload(asset);
                            }}"
                          >
                            Download
                          </button>
                          <button
                            class="vwx-gallery__btn"
                            @click="${(e: Event) => {
                              e.stopPropagation();
                              this.handleAssetSelect(result, asset);
                            }}"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  `
                )}
              </div>
            `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vwx-ai-result-gallery': VwxAIResultGallery;
  }
}
