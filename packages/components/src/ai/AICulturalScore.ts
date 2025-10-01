import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CulturalValidationResult, ValidationIssue } from '@vwx/ai-integration';

/**
 * VWX AI Cultural Score Component
 *
 * Visual display of cultural authenticity validation scores with detailed breakdown.
 * Shows 5 core criteria + optional Wolfsburg principles bonus scoring.
 *
 * @example
 * ```html
 * <vwx-ai-cultural-score
 *   .validation="${validationResult}"
 * ></vwx-ai-cultural-score>
 * ```
 */
@customElement('vwx-ai-cultural-score')
export class VwxAICulturalScore extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .vwx-cultural-score {
      font-family: var(--vw-typography-fontFamily-sans, sans-serif);
    }

    .vwx-cultural-score__header {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: var(--vw-spacing-component-gap-lg, 1.5rem);
      padding: var(--vw-spacing-component-padding-lg, 1rem);
      background: var(--vw-theme-bw-color-background-secondary, #f5f5f5);
      border-radius: 8px;
    }

    .vwx-cultural-score__total {
      position: relative;
      width: 120px;
      height: 120px;
      flex-shrink: 0;
    }

    .vwx-cultural-score__circle {
      transform: rotate(-90deg);
    }

    .vwx-cultural-score__circle-bg {
      fill: none;
      stroke: var(--vw-theme-bw-color-background-primary, #fff);
      stroke-width: 12;
    }

    .vwx-cultural-score__circle-fill {
      fill: none;
      stroke-width: 12;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.5s ease;
    }

    .vwx-cultural-score__circle-fill--high {
      stroke: var(--vw-theme-bw-color-status-success, #4caf50);
    }

    .vwx-cultural-score__circle-fill--medium {
      stroke: var(--vw-theme-bw-color-status-warning, #ff9800);
    }

    .vwx-cultural-score__circle-fill--low {
      stroke: var(--vw-theme-bw-color-status-error, #f44336);
    }

    .vwx-cultural-score__total-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .vwx-cultural-score__total-number {
      font-size: var(--vw-typography-fontSize-3xl, 2rem);
      font-weight: var(--vw-typography-fontWeight-bold, 700);
      color: var(--vw-theme-bw-color-text-primary, #000);
      line-height: 1;
    }

    .vwx-cultural-score__total-label {
      font-size: var(--vw-typography-fontSize-xs, 0.75rem);
      color: var(--vw-theme-bw-color-text-secondary, #666);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.25rem;
    }

    .vwx-cultural-score__status {
      flex: 1;
    }

    .vwx-cultural-score__status-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      margin-bottom: 0.5rem;
    }

    .vwx-cultural-score__status-badge--pass {
      background: var(--vw-theme-bw-color-status-success, #4caf50);
      color: #fff;
    }

    .vwx-cultural-score__status-badge--fail {
      background: var(--vw-theme-bw-color-status-error, #f44336);
      color: #fff;
    }

    .vwx-cultural-score__status-text {
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      color: var(--vw-theme-bw-color-text-secondary, #666);
    }

    .vwx-cultural-score__breakdown {
      margin-bottom: var(--vw-spacing-component-gap-lg, 1.5rem);
    }

    .vwx-cultural-score__breakdown-title {
      font-size: var(--vw-typography-fontSize-lg, 1.125rem);
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      color: var(--vw-theme-bw-color-text-primary, #000);
      margin-bottom: 1rem;
    }

    .vwx-cultural-score__criteria {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .vwx-cultural-score__criterion {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .vwx-cultural-score__criterion-label {
      flex: 0 0 200px;
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      color: var(--vw-theme-bw-color-text-primary, #000);
    }

    .vwx-cultural-score__criterion-bar {
      flex: 1;
      height: 24px;
      background: var(--vw-theme-bw-color-background-secondary, #f5f5f5);
      border-radius: 12px;
      overflow: hidden;
      position: relative;
    }

    .vwx-cultural-score__criterion-fill {
      height: 100%;
      background: var(--vw-theme-bw-color-interactive-primary, #000);
      transition: width 0.5s ease;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 0.5rem;
    }

    .vwx-cultural-score__criterion-value {
      font-size: var(--vw-typography-fontSize-xs, 0.75rem);
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      color: #fff;
      min-width: 2rem;
      text-align: right;
    }

    .vwx-cultural-score__wolfsburg {
      padding: var(--vw-spacing-component-padding-lg, 1rem);
      background: linear-gradient(135deg, #003d7a 0%, #0052a3 100%);
      border-radius: 8px;
      color: #fff;
      margin-bottom: var(--vw-spacing-component-gap-lg, 1.5rem);
    }

    .vwx-cultural-score__wolfsburg-title {
      font-size: var(--vw-typography-fontSize-lg, 1.125rem);
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      margin-bottom: 1rem;
    }

    .vwx-cultural-score__wolfsburg-principles {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }

    .vwx-cultural-score__wolfsburg-principle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
    }

    .vwx-cultural-score__wolfsburg-label {
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
    }

    .vwx-cultural-score__wolfsburg-value {
      font-size: var(--vw-typography-fontSize-base, 1rem);
      font-weight: var(--vw-typography-fontWeight-bold, 700);
    }

    .vwx-cultural-score__issues {
      margin-bottom: var(--vw-spacing-component-gap-lg, 1.5rem);
    }

    .vwx-cultural-score__section-title {
      font-size: var(--vw-typography-fontSize-lg, 1.125rem);
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      color: var(--vw-theme-bw-color-text-primary, #000);
      margin-bottom: 0.75rem;
    }

    .vwx-cultural-score__issue-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .vwx-cultural-score__issue {
      padding: 0.75rem;
      border-radius: 6px;
      border-left: 4px solid;
    }

    .vwx-cultural-score__issue--critical {
      background: #fef2f2;
      border-left-color: var(--vw-theme-bw-color-status-error, #f44336);
      color: #7f1d1d;
    }

    .vwx-cultural-score__issue--warning {
      background: var(--color-primitive-rust-50, #fff8f0);
      border-left-color: var(--vw-theme-bw-color-status-warning, #ff9800);
      color: #7c2d12;
    }

    .vwx-cultural-score__issue--info {
      background: var(--color-primitive-blue-50, #f0f9ff);
      border-left-color: var(--vw-theme-bw-color-status-info, #2196f3);
      color: #1e3a8a;
    }

    .vwx-cultural-score__issue-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }

    .vwx-cultural-score__issue-severity {
      font-size: var(--vw-typography-fontSize-xs, 0.75rem);
      font-weight: var(--vw-typography-fontWeight-semibold, 600);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .vwx-cultural-score__issue-category {
      font-size: var(--vw-typography-fontSize-xs, 0.75rem);
      opacity: 0.75;
    }

    .vwx-cultural-score__issue-message {
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      line-height: 1.5;
    }

    .vwx-cultural-score__suggestion {
      font-size: var(--vw-typography-fontSize-xs, 0.75rem);
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid currentColor;
      opacity: 0.75;
    }

    .vwx-cultural-score__suggestions {
      margin-bottom: var(--vw-spacing-component-gap-lg, 1.5rem);
    }

    .vwx-cultural-score__suggestion-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .vwx-cultural-score__suggestion-item {
      padding: 0.75rem;
      background: var(--vw-theme-bw-color-background-secondary, #f5f5f5);
      border-radius: 6px;
      font-size: var(--vw-typography-fontSize-sm, 0.875rem);
      color: var(--vw-theme-bw-color-text-primary, #000);
    }

    /* Archetype variations */
    :host([archetype='beetle']) .vwx-cultural-score__header {
      border-radius: 24px;
    }

    :host([archetype='bus']) .vwx-cultural-score__header {
      border-radius: 4px;
    }

    :host([archetype='ghia']) .vwx-cultural-score__header {
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    :host([archetype='type3']) .vwx-cultural-score__header {
      border-radius: 2px;
    }
  `;

  @property({ type: Object })
  validation?: CulturalValidationResult;

  @property({ type: String, reflect: true })
  archetype: 'beetle' | 'bus' | 'ghia' | 'type3' = 'beetle';

  private getScoreClass(score: number): string {
    if (score >= 85) return 'vwx-cultural-score__circle-fill--high';
    if (score >= 70) return 'vwx-cultural-score__circle-fill--medium';
    return 'vwx-cultural-score__circle-fill--low';
  }

  private getCircleDashArray(score: number): string {
    const radius = 54; // Circle radius
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    return `${circumference} ${circumference}`;
  }

  private getCircleDashOffset(score: number): string {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    return `${offset}`;
  }

  private renderCircularProgress(score: number) {
    const radius = 54;
    const cx = 60;
    const cy = 60;

    return html`
      <svg
        class="vwx-cultural-score__circle"
        width="120"
        height="120"
        viewBox="0 0 120 120"
      >
        <circle
          class="vwx-cultural-score__circle-bg"
          cx="${cx}"
          cy="${cy}"
          r="${radius}"
        />
        <circle
          class="vwx-cultural-score__circle-fill ${this.getScoreClass(score)}"
          cx="${cx}"
          cy="${cy}"
          r="${radius}"
          stroke-dasharray="${this.getCircleDashArray(score)}"
          stroke-dashoffset="${this.getCircleDashOffset(score)}"
        />
      </svg>
    `;
  }

  private renderBreakdown() {
    if (!this.validation?.breakdown) return null;

    const criteria = [
      { label: 'Period Accuracy', value: this.validation.breakdown.periodAccuracy, max: 25 },
      {
        label: 'Vehicle Design Fidelity',
        value: this.validation.breakdown.vehicleDesignFidelity,
        max: 25,
      },
      {
        label: 'Cultural Sensitivity',
        value: this.validation.breakdown.culturalSensitivity,
        max: 20,
      },
      {
        label: 'Material Authenticity',
        value: this.validation.breakdown.materialAuthenticity,
        max: 15,
      },
      {
        label: 'Community Values',
        value: this.validation.breakdown.communityValuesAlignment,
        max: 15,
      },
    ];

    return html`
      <div class="vwx-cultural-score__breakdown">
        <h3 class="vwx-cultural-score__breakdown-title">Score Breakdown</h3>
        <div class="vwx-cultural-score__criteria">
          ${criteria.map(
            (criterion) => html`
              <div class="vwx-cultural-score__criterion">
                <div class="vwx-cultural-score__criterion-label">
                  ${criterion.label}
                </div>
                <div class="vwx-cultural-score__criterion-bar">
                  <div
                    class="vwx-cultural-score__criterion-fill"
                    style="width: ${(criterion.value / criterion.max) * 100}%"
                  >
                    <span class="vwx-cultural-score__criterion-value">
                      ${criterion.value}/${criterion.max}
                    </span>
                  </div>
                </div>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  private renderWolfsburgPrinciples() {
    if (!this.validation?.wolfsburgPrinciples) return null;

    const principles = [
      { label: 'DDB Principle', value: this.validation.wolfsburgPrinciples.ddbPrinciple },
      {
        label: 'Pancake Principle',
        value: this.validation.wolfsburgPrinciples.pancakePrinciple,
      },
      {
        label: 'Air-Cooled Principle',
        value: this.validation.wolfsburgPrinciples.airCooledPrinciple,
      },
      { label: 'Character & Charm', value: this.validation.wolfsburgPrinciples.characterCharm },
    ];

    const total = principles.reduce((sum, p) => sum + p.value, 0);

    return html`
      <div class="vwx-cultural-score__wolfsburg">
        <h3 class="vwx-cultural-score__wolfsburg-title">
          Wolfsburg Principles Bonus: ${total}/40
        </h3>
        <div class="vwx-cultural-score__wolfsburg-principles">
          ${principles.map(
            (principle) => html`
              <div class="vwx-cultural-score__wolfsburg-principle">
                <span class="vwx-cultural-score__wolfsburg-label">${principle.label}</span>
                <span class="vwx-cultural-score__wolfsburg-value">${principle.value}/10</span>
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  private renderIssues() {
    if (!this.validation?.issues || this.validation.issues.length === 0) return null;

    return html`
      <div class="vwx-cultural-score__issues">
        <h3 class="vwx-cultural-score__section-title">Issues Found</h3>
        <div class="vwx-cultural-score__issue-list">
          ${this.validation.issues.map(
            (issue: ValidationIssue) => html`
              <div class="vwx-cultural-score__issue vwx-cultural-score__issue--${issue.severity}">
                <div class="vwx-cultural-score__issue-header">
                  <span class="vwx-cultural-score__issue-severity">${issue.severity}</span>
                  <span class="vwx-cultural-score__issue-category">${issue.category}</span>
                </div>
                <div class="vwx-cultural-score__issue-message">${issue.message}</div>
                ${issue.suggestion
                  ? html`
                      <div class="vwx-cultural-score__suggestion">
                        Suggestion: ${issue.suggestion}
                      </div>
                    `
                  : null}
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  private renderSuggestions() {
    if (!this.validation?.suggestions || this.validation.suggestions.length === 0) return null;

    return html`
      <div class="vwx-cultural-score__suggestions">
        <h3 class="vwx-cultural-score__section-title">Suggestions for Improvement</h3>
        <div class="vwx-cultural-score__suggestion-list">
          ${this.validation.suggestions.map(
            (suggestion) => html`
              <div class="vwx-cultural-score__suggestion-item">${suggestion}</div>
            `
          )}
        </div>
      </div>
    `;
  }

  override render() {
    if (!this.validation) {
      return html`
        <div class="vwx-cultural-score">
          <p>No validation data available</p>
        </div>
      `;
    }

    return html`
      <div class="vwx-cultural-score">
        <div class="vwx-cultural-score__header">
          <div class="vwx-cultural-score__total">
            ${this.renderCircularProgress(this.validation.score)}
            <div class="vwx-cultural-score__total-value">
              <div class="vwx-cultural-score__total-number">${this.validation.score}</div>
              <div class="vwx-cultural-score__total-label">Score</div>
            </div>
          </div>

          <div class="vwx-cultural-score__status">
            <div
              class="vwx-cultural-score__status-badge ${this.validation.passes
                ? 'vwx-cultural-score__status-badge--pass'
                : 'vwx-cultural-score__status-badge--fail'}"
            >
              ${this.validation.passes ? 'PASSED' : 'FAILED'}
            </div>
            <p class="vwx-cultural-score__status-text">
              ${this.validation.passes
                ? 'This asset meets VW cultural authenticity standards.'
                : 'This asset requires improvements to meet authenticity standards.'}
            </p>
          </div>
        </div>

        ${this.renderBreakdown()} ${this.renderWolfsburgPrinciples()} ${this.renderIssues()}
        ${this.renderSuggestions()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vwx-ai-cultural-score': VwxAICulturalScore;
  }
}
