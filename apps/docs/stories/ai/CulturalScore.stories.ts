import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { CulturalValidationResult } from '../../../../packages/ai-integration/src/pipeline/types';

const meta: Meta = {
  title: 'AI Integration/Cultural Score',
  tags: ['autodocs'],
  argTypes: {
    scoreLevel: {
      control: 'select',
      options: ['high', 'passing', 'failing'],
      description: 'Score level to display',
    },
    includeWolfsburg: {
      control: 'boolean',
      description: 'Include Wolfsburg principles',
    },
    showIssues: {
      control: 'boolean',
      description: 'Show validation issues',
    },
  },
};

export default meta;
type Story = StoryObj;

// Mock validation data
const highScoreValidation: CulturalValidationResult = {
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
};

const passingScoreValidation: CulturalValidationResult = {
  score: 78,
  passes: true,
  breakdown: {
    periodAccuracy: 20,
    vehicleDesignFidelity: 22,
    culturalSensitivity: 16,
    materialAuthenticity: 11,
    communityValuesAlignment: 12,
  },
  wolfsburgPrinciples: {
    ddbPrinciple: 8,
    pancakePrinciple: 7,
    airCooledPrinciple: 8,
    characterCharm: 7,
  },
  issues: [
    {
      severity: 'info',
      category: 'Material Authenticity',
      message: 'Consider specifying chrome bumper details for period accuracy',
      suggestion: 'Add "chrome bumpers" to prompt',
    },
    {
      severity: 'warning',
      category: 'Community Values',
      message: 'Restoration-focused language detected - consider preservation values',
      suggestion: 'Use terms like "preserved" instead of "restored"',
    },
  ],
  suggestions: [
    'Good era-appropriate setting and lighting',
    'Strong vehicle design fidelity',
    'Consider adding more specific material details',
    'Align language more closely with community preservation values',
  ],
  metadata: {
    provider: 'Anthropic',
    model: 'claude-3-sonnet-20240229',
    tokensUsed: 632,
    cost: 0.0032,
  },
};

const failingScoreValidation: CulturalValidationResult = {
  score: 62,
  passes: false,
  breakdown: {
    periodAccuracy: 15,
    vehicleDesignFidelity: 18,
    culturalSensitivity: 14,
    materialAuthenticity: 8,
    communityValuesAlignment: 10,
  },
  wolfsburgPrinciples: {
    ddbPrinciple: 5,
    pancakePrinciple: 6,
    airCooledPrinciple: 7,
    characterCharm: 5,
  },
  issues: [
    {
      severity: 'critical',
      category: 'Period Accuracy',
      message: 'Modern LED headlights mentioned (not period-accurate for 1960s)',
      suggestion: 'Use period-correct sealed beam headlights',
    },
    {
      severity: 'critical',
      category: 'Vehicle Design Fidelity',
      message: 'Incorrect paint code specified (not a VW factory color)',
      suggestion: 'Use authentic VW colors: VW Blue, Dove Blue, Sea Blue, etc.',
    },
    {
      severity: 'warning',
      category: 'Era Consistency',
      message: 'Mixed era elements (1960s Beetle with 1970s accessories)',
      suggestion: 'Stay within a single era for authenticity',
    },
    {
      severity: 'warning',
      category: 'Material Authenticity',
      message: 'Aftermarket wheels specified instead of factory hubcaps',
      suggestion: 'Use period-correct factory wheel covers',
    },
  ],
  suggestions: [
    'Review VW factory specifications for the specified era',
    'Remove modern elements (LED lights, digital displays, etc.)',
    'Use period-appropriate accessories and materials',
    'Consult VW cultural guidelines for authentic details',
  ],
  metadata: {
    provider: 'Anthropic',
    model: 'claude-3-sonnet-20240229',
    tokensUsed: 789,
    cost: 0.0039,
  },
};

// Stories

export const HighScore: Story = {
  args: {
    scoreLevel: 'high',
    includeWolfsburg: true,
    showIssues: false,
  },
  render: () => html`
    <div style="max-width: 1000px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">Excellent Cultural Authenticity</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        This asset demonstrates outstanding adherence to VW heritage principles
      </p>

      ${renderScoreVisualization(highScoreValidation)}
    </div>
  `,
};

export const PassingScore: Story = {
  args: {
    scoreLevel: 'passing',
    includeWolfsburg: true,
    showIssues: true,
  },
  render: () => html`
    <div style="max-width: 1000px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">Good Cultural Authenticity</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        This asset meets cultural validation requirements with room for improvement
      </p>

      ${renderScoreVisualization(passingScoreValidation)}
    </div>
  `,
};

export const FailingScore: Story = {
  args: {
    scoreLevel: 'failing',
    includeWolfsburg: true,
    showIssues: true,
  },
  render: () => html`
    <div style="max-width: 1000px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">Cultural Validation Failed</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        This asset does not meet the minimum cultural authenticity threshold
      </p>

      ${renderScoreVisualization(failingScoreValidation)}
    </div>
  `,
};

export const WithWolfsburg: Story = {
  render: () => html`
    <div style="max-width: 1000px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">Wolfsburg Principles Analysis</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Deep alignment with DDB's original VW campaign principles from the 1960s
      </p>

      <!-- Wolfsburg Principles Detailed View -->
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <h3 style="margin: 0 0 1.5rem 0; font-size: 1.125rem; color: #1f2937;">
          Wolfsburg Principles Scoring
        </h3>

        <div style="display: grid; gap: 2rem;">
          ${renderWolfsburgPrincipleDetailed(
            'DDB Principle',
            'Honesty & Clarity',
            10,
            10,
            'Think small. The campaign that revolutionized advertising with honest, self-deprecating humor.',
            [
              'Honest representation without exaggeration',
              'Clear, straightforward messaging',
              'Self-aware, humble tone',
              'No misleading claims or overselling',
            ],
            '✓ Perfect alignment with honest, authentic representation'
          )}

          ${renderWolfsburgPrincipleDetailed(
            'Pancake Principle',
            'Engineering Enables Form',
            9,
            10,
            'Form follows function. The flat engine enables the iconic shape.',
            [
              'Design driven by engineering realities',
              'Functional beauty over decoration',
              'Honest expression of mechanical purpose',
              'No fake styling cues',
            ],
            '✓ Excellent - shows how engineering creates beauty'
          )}

          ${renderWolfsburgPrincipleDetailed(
            'Air-Cooled Principle',
            'Durability & Reliability',
            10,
            10,
            'Simple, robust, dependable. Built to last through generations.',
            [
              'Emphasis on longevity and durability',
              'Simple, maintainable design',
              'Built for real-world use',
              'Timeless rather than trendy',
            ],
            '✓ Perfect - celebrates durability and preservation'
          )}

          ${renderWolfsburgPrincipleDetailed(
            'Character Charm',
            'The "Bug" Principle',
            10,
            10,
            'Quirky, lovable personality. A car with soul and character.',
            [
              'Distinctive, recognizable character',
              'Emotional connection and charm',
              'Personality beyond transportation',
              'Community and cultural impact',
            ],
            '✓ Perfect - captures the iconic Bug personality'
          )}
        </div>

        <!-- Overall Wolfsburg Score -->
        <div style="margin-top: 2rem; padding: 1.5rem; background: #f0fdf4; border-radius: 6px; text-align: center;">
          <div style="font-size: 0.875rem; color: #047857; margin-bottom: 0.5rem; font-weight: 500;">
            Overall Wolfsburg Alignment
          </div>
          <div style="font-size: 3rem; font-weight: 700; color: #10b981; margin-bottom: 0.5rem;">
            39/40
          </div>
          <div style="display: inline-block; padding: 0.5rem 1rem; background: #d1fae5; color: #065f46; border-radius: 20px; font-weight: 600; font-size: 0.875rem;">
            Exceptional Authenticity
          </div>
        </div>
      </div>

      <!-- Historical Context -->
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1rem 0; font-size: 1.125rem; color: #1f2937;">
          Historical Context
        </h3>
        <div style="padding: 1.5rem; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px;">
          <p style="margin: 0 0 1rem 0; color: #92400e; font-size: 0.875rem; line-height: 1.6;">
            The Wolfsburg Principles are derived from Doyle Dane Bernbach's revolutionary "Think Small" campaign
            for Volkswagen in 1959. This campaign transformed automotive advertising by embracing honesty,
            simplicity, and self-deprecating humor instead of the typical bombastic claims of the era.
          </p>
          <p style="margin: 0; color: #92400e; font-size: 0.875rem; line-height: 1.6;">
            These principles remain core to VW's heritage and are essential for creating culturally authentic
            VW content. Scoring highly on Wolfsburg Principles indicates deep alignment with the values that
            made VW a cultural icon.
          </p>
        </div>
      </div>
    </div>
  `,
};

export const WithIssues: Story = {
  render: () => html`
    <div style="max-width: 1000px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">Validation Issues & Suggestions</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Detailed feedback to improve cultural authenticity
      </p>

      <!-- Score Overview -->
      <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem; text-align: center;">
        <div style="font-size: 3rem; font-weight: 700; color: #ef4444; margin-bottom: 0.5rem;">
          62/100
        </div>
        <div style="display: inline-block; padding: 0.5rem 1rem; background: #fee2e2; color: #991b1b; border-radius: 20px; font-weight: 600; font-size: 0.875rem;">
          Does Not Pass Validation
        </div>
      </div>

      <!-- Critical Issues -->
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
          <span style="font-size: 1.5rem;">🚨</span>
          <h3 style="margin: 0; font-size: 1.125rem; color: #1f2937;">
            Critical Issues (Must Fix)
          </h3>
        </div>

        <div style="display: grid; gap: 1rem;">
          ${failingScoreValidation.issues
            .filter((issue) => issue.severity === 'critical')
            .map(
              (issue) => html`
                <div style="padding: 1.5rem; background: #fee2e2; border-left: 4px solid #dc2626; border-radius: 6px;">
                  <div style="display: flex; align-items: start; gap: 1rem;">
                    <span style="font-size: 1.25rem;">❌</span>
                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="padding: 0.25rem 0.5rem; background: #dc2626; color: white; border-radius: 3px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                          Critical
                        </span>
                        <span style="font-size: 0.75rem; color: #991b1b; font-weight: 500;">
                          ${issue.category}
                        </span>
                      </div>
                      <div style="font-weight: 600; color: #991b1b; margin-bottom: 0.75rem; font-size: 1rem;">
                        ${issue.message}
                      </div>
                      ${issue.suggestion
                        ? html`
                            <div style="padding: 1rem; background: white; border-radius: 4px;">
                              <div style="font-weight: 600; color: #047857; margin-bottom: 0.25rem; font-size: 0.875rem;">
                                💡 Suggested Fix:
                              </div>
                              <div style="color: #4b5563; font-size: 0.875rem;">
                                ${issue.suggestion}
                              </div>
                            </div>
                          `
                        : ''}
                    </div>
                  </div>
                </div>
              `
            )}
        </div>
      </div>

      <!-- Warnings -->
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
          <span style="font-size: 1.5rem;">⚠️</span>
          <h3 style="margin: 0; font-size: 1.125rem; color: #1f2937;">
            Warnings (Should Address)
          </h3>
        </div>

        <div style="display: grid; gap: 1rem;">
          ${failingScoreValidation.issues
            .filter((issue) => issue.severity === 'warning')
            .map(
              (issue) => html`
                <div style="padding: 1.5rem; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
                  <div style="display: flex; align-items: start; gap: 1rem;">
                    <span style="font-size: 1.25rem;">⚠️</span>
                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <span style="padding: 0.25rem 0.5rem; background: #f59e0b; color: white; border-radius: 3px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
                          Warning
                        </span>
                        <span style="font-size: 0.75rem; color: #92400e; font-weight: 500;">
                          ${issue.category}
                        </span>
                      </div>
                      <div style="font-weight: 600; color: #92400e; margin-bottom: 0.75rem; font-size: 1rem;">
                        ${issue.message}
                      </div>
                      ${issue.suggestion
                        ? html`
                            <div style="padding: 1rem; background: white; border-radius: 4px;">
                              <div style="font-weight: 600; color: #047857; margin-bottom: 0.25rem; font-size: 0.875rem;">
                                💡 Suggested Improvement:
                              </div>
                              <div style="color: #4b5563; font-size: 0.875rem;">
                                ${issue.suggestion}
                              </div>
                            </div>
                          `
                        : ''}
                    </div>
                  </div>
                </div>
              `
            )}
        </div>
      </div>

      <!-- Overall Suggestions -->
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1.5rem 0; font-size: 1.125rem; color: #1f2937;">
          Improvement Suggestions
        </h3>

        <div style="padding: 1.5rem; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 6px; margin-bottom: 1.5rem;">
          <ul style="margin: 0; padding-left: 1.5rem; color: #1e40af; font-size: 0.875rem; line-height: 1.6;">
            ${failingScoreValidation.suggestions.map(
              (suggestion) => html`
                <li style="margin-bottom: 0.5rem;">${suggestion}</li>
              `
            )}
          </ul>
        </div>

        <!-- Action Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <button style="padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
            Apply Suggestions
          </button>
          <button style="padding: 0.75rem; background: white; color: #6b7280; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.875rem;">
            View Guidelines
          </button>
        </div>
      </div>
    </div>
  `,
};

export const ComparisonView: Story = {
  render: () => html`
    <div style="max-width: 1400px; margin: 0 auto; padding: 2rem; background: #f8f9fa;">
      <h2 style="margin: 0 0 0.5rem 0; color: #1a1a1a;">Score Comparison</h2>
      <p style="margin: 0 0 2rem 0; color: #6b7280;">
        Compare cultural authenticity across different score levels
      </p>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
        ${renderScoreCard(highScoreValidation, 'Excellent', '#10b981')}
        ${renderScoreCard(passingScoreValidation, 'Good', '#f59e0b')}
        ${renderScoreCard(failingScoreValidation, 'Needs Work', '#ef4444')}
      </div>

      <!-- Scoring Criteria Reference -->
      <div style="margin-top: 2rem; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1.5rem 0; font-size: 1.125rem; color: #1f2937;">
          Scoring Criteria
        </h3>

        <div style="display: grid; gap: 1rem;">
          ${renderScoringCriteria('Period Accuracy', '25 points', 'Correct era details, period-appropriate elements, no anachronisms')}
          ${renderScoringCriteria('Vehicle Design Fidelity', '25 points', 'Authentic VW design, correct model details, factory specifications')}
          ${renderScoringCriteria('Cultural Sensitivity', '20 points', 'Respectful representation, appropriate context, community values')}
          ${renderScoringCriteria('Material Authenticity', '15 points', 'Period-correct materials, authentic finishes, factory colors')}
          ${renderScoringCriteria('Community Values', '15 points', 'Preservation focus, adventure spirit, simplicity, honesty')}
        </div>

        <div style="margin-top: 1.5rem; padding: 1rem; background: #f9fafb; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem;">
            <div>
              <span style="color: #6b7280;">Passing Threshold:</span>
              <span style="font-weight: 600; color: #1f2937; margin-left: 0.5rem;">70/100</span>
            </div>
            <div>
              <span style="color: #6b7280;">Wolfsburg Bonus:</span>
              <span style="font-weight: 600; color: #10b981; margin-left: 0.5rem;">+40 points max</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};

// Helper Functions

function renderScoreVisualization(validation: CulturalValidationResult) {
  const scoreColor = validation.score >= 90 ? '#10b981' : validation.score >= 70 ? '#f59e0b' : '#ef4444';
  const scoreBg = validation.score >= 90 ? '#d1fae5' : validation.score >= 70 ? '#fef3c7' : '#fee2e2';
  const scoreText = validation.score >= 90 ? '#065f46' : validation.score >= 70 ? '#92400e' : '#991b1b';

  return html`
    <div style="display: grid; gap: 2rem;">
      <!-- Overall Score -->
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 4rem; font-weight: 700; color: ${scoreColor}; margin-bottom: 1rem; line-height: 1;">
          ${validation.score}
        </div>
        <div style="font-size: 1.5rem; color: #6b7280; margin-bottom: 1rem;">
          ${validation.passes ? '✓ Passes Cultural Validation' : '✗ Does Not Pass Validation'}
        </div>
        <div style="display: inline-block; padding: 0.75rem 1.5rem; background: ${scoreBg}; color: ${scoreText}; border-radius: 24px; font-weight: 600; font-size: 1rem;">
          ${validation.score >= 90 ? 'Excellent Authenticity' : validation.score >= 70 ? 'Good Authenticity' : 'Needs Improvement'}
        </div>
      </div>

      <!-- Score Breakdown -->
      <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 1.5rem 0; font-size: 1.125rem; color: #374151;">Score Breakdown</h3>
        <div style="display: grid; gap: 1.5rem;">
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
            <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="margin-bottom: 1rem;">
                <h3 style="margin: 0 0 0.25rem 0; font-size: 1.125rem; color: #374151;">Wolfsburg Principles Bonus</h3>
                <p style="margin: 0; font-size: 0.875rem; color: #6b7280;">
                  Alignment with DDB's original VW campaign principles
                </p>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
                ${renderWolfsburgCard('DDB Principle', 'Honesty & Clarity', validation.wolfsburgPrinciples.ddbPrinciple, 10)}
                ${renderWolfsburgCard('Pancake Principle', 'Form Follows Function', validation.wolfsburgPrinciples.pancakePrinciple, 10)}
                ${renderWolfsburgCard('Air-Cooled Principle', 'Durability & Reliability', validation.wolfsburgPrinciples.airCooledPrinciple, 10)}
                ${renderWolfsburgCard('Character Charm', 'The "Bug" Principle', validation.wolfsburgPrinciples.characterCharm, 10)}
              </div>
              <div style="margin-top: 1.5rem; padding: 1rem; background: #f0fdf4; border-radius: 6px; text-align: center;">
                <div style="font-size: 0.875rem; color: #047857; margin-bottom: 0.25rem;">
                  Total Wolfsburg Bonus
                </div>
                <div style="font-size: 2rem; font-weight: 700; color: #10b981;">
                  +${Object.values(validation.wolfsburgPrinciples).reduce((a, b) => a + b, 0)}
                </div>
              </div>
            </div>
          `
        : ''}

      <!-- Issues & Suggestions -->
      ${validation.issues && validation.issues.length > 0
        ? html`
            <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 1.5rem 0; font-size: 1.125rem; color: #374151;">Validation Issues</h3>
              <div style="display: grid; gap: 1rem;">
                ${validation.issues.map((issue) => renderIssue(issue))}
              </div>
            </div>
          `
        : ''}

      ${validation.suggestions && validation.suggestions.length > 0
        ? html`
            <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="margin: 0 0 1.5rem 0; font-size: 1.125rem; color: #374151;">Suggestions</h3>
              <ul style="margin: 0; padding-left: 1.5rem; display: grid; gap: 0.75rem;">
                ${validation.suggestions.map(
                  (suggestion) => html`
                    <li style="color: #4b5563; font-size: 0.875rem; line-height: 1.6;">
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span style="font-size: 0.875rem; font-weight: 500; color: #4b5563;">${label}</span>
        <span style="font-size: 0.875rem; font-weight: 600; color: #1f2937;">${score}/${max}</span>
      </div>
      <div style="width: 100%; height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden;">
        <div
          style="width: ${percentage}%; height: 100%; background: ${color}; transition: width 0.5s ease; border-radius: 6px;"
        ></div>
      </div>
    </div>
  `;
}

function renderWolfsburgCard(title: string, description: string, score: number, max: number) {
  const percentage = (score / max) * 100;
  const color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444';
  const bg = percentage >= 80 ? '#f0fdf4' : percentage >= 60 ? '#fffbeb' : '#fef2f2';

  return html`
    <div style="padding: 1.25rem; background: ${bg}; border-radius: 6px; border: 2px solid ${color};">
      <div style="font-weight: 600; color: #1f2937; margin-bottom: 0.25rem; font-size: 0.875rem;">
        ${title}
      </div>
      <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 1rem;">
        ${description}
      </div>
      <div style="font-size: 2rem; font-weight: 700; color: ${color};">
        ${score}/${max}
      </div>
    </div>
  `;
}

function renderIssue(issue: any) {
  const colors = {
    critical: { bg: '#fee2e2', border: '#dc2626', text: '#991b1b', icon: '❌' },
    warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '⚠️' },
    info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', icon: 'ℹ️' },
  };

  const color = colors[issue.severity as keyof typeof colors];

  return html`
    <div style="padding: 1.25rem; background: ${color.bg}; border-left: 4px solid ${color.border}; border-radius: 4px;">
      <div style="display: flex; align-items: start; gap: 0.75rem;">
        <span style="font-size: 1.25rem;">${color.icon}</span>
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span style="padding: 0.25rem 0.5rem; background: ${color.border}; color: white; border-radius: 3px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">
              ${issue.severity}
            </span>
            <span style="font-size: 0.75rem; color: ${color.text}; font-weight: 500;">
              ${issue.category}
            </span>
          </div>
          <p style="margin: 0 0 0.75rem 0; color: ${color.text}; font-size: 0.875rem; line-height: 1.5;">
            ${issue.message}
          </p>
          ${issue.suggestion
            ? html`
                <div style="padding: 0.75rem; background: white; border-radius: 4px;">
                  <span style="font-weight: 600; color: #047857; font-size: 0.875rem;">💡 ${issue.suggestion}</span>
                </div>
              `
            : ''}
        </div>
      </div>
    </div>
  `;
}

function renderWolfsburgPrincipleDetailed(
  title: string,
  subtitle: string,
  score: number,
  max: number,
  description: string,
  criteria: string[],
  assessment: string
) {
  const percentage = (score / max) * 100;
  const color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444';
  const bg = percentage >= 80 ? '#f0fdf4' : percentage >= 60 ? '#fffbeb' : '#fef2f2';

  return html`
    <div style="padding: 1.5rem; background: ${bg}; border-radius: 8px; border: 2px solid ${color};">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 0.25rem 0; font-size: 1rem; color: #1f2937; font-weight: 600;">
            ${title}
          </h4>
          <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.75rem;">
            ${subtitle}
          </div>
          <p style="margin: 0; font-size: 0.875rem; color: #4b5563; line-height: 1.6; font-style: italic;">
            ${description}
          </p>
        </div>
        <div style="text-align: right; margin-left: 1rem;">
          <div style="font-size: 2.5rem; font-weight: 700; color: ${color}; line-height: 1;">
            ${score}
          </div>
          <div style="font-size: 0.875rem; color: #6b7280;">
            of ${max}
          </div>
        </div>
      </div>

      <div style="margin-bottom: 1rem;">
        <div style="font-weight: 600; color: #1f2937; margin-bottom: 0.5rem; font-size: 0.875rem;">
          Evaluation Criteria:
        </div>
        <ul style="margin: 0; padding-left: 1.25rem; display: grid; gap: 0.25rem;">
          ${criteria.map(
            (criterion) => html`
              <li style="color: #4b5563; font-size: 0.875rem;">
                ${criterion}
              </li>
            `
          )}
        </ul>
      </div>

      <div style="padding: 0.75rem; background: white; border-radius: 4px;">
        <div style="font-weight: 600; color: ${color}; font-size: 0.875rem;">
          ${assessment}
        </div>
      </div>
    </div>
  `;
}

function renderScoreCard(validation: CulturalValidationResult, label: string, color: string) {
  return html`
    <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-top: 4px solid ${color};">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 3rem; font-weight: 700; color: ${color}; margin-bottom: 0.5rem;">
          ${validation.score}
        </div>
        <div style="font-weight: 600; color: #1f2937; font-size: 1rem;">
          ${label}
        </div>
      </div>

      <div style="display: grid; gap: 0.75rem; font-size: 0.875rem;">
        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f9fafb; border-radius: 4px;">
          <span style="color: #6b7280;">Period Accuracy</span>
          <span style="font-weight: 600; color: #1f2937;">${validation.breakdown.periodAccuracy}/25</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f9fafb; border-radius: 4px;">
          <span style="color: #6b7280;">Vehicle Fidelity</span>
          <span style="font-weight: 600; color: #1f2937;">${validation.breakdown.vehicleDesignFidelity}/25</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f9fafb; border-radius: 4px;">
          <span style="color: #6b7280;">Cultural Sensitivity</span>
          <span style="font-weight: 600; color: #1f2937;">${validation.breakdown.culturalSensitivity}/20</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f9fafb; border-radius: 4px;">
          <span style="color: #6b7280;">Material Auth.</span>
          <span style="font-weight: 600; color: #1f2937;">${validation.breakdown.materialAuthenticity}/15</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f9fafb; border-radius: 4px;">
          <span style="color: #6b7280;">Community Values</span>
          <span style="font-weight: 600; color: #1f2937;">${validation.breakdown.communityValuesAlignment}/15</span>
        </div>
      </div>

      ${validation.wolfsburgPrinciples
        ? html`
            <div style="margin-top: 1rem; padding: 0.75rem; background: #f0fdf4; border-radius: 4px; text-align: center;">
              <div style="font-size: 0.75rem; color: #047857; margin-bottom: 0.25rem;">
                Wolfsburg Bonus
              </div>
              <div style="font-size: 1.5rem; font-weight: 700; color: #10b981;">
                +${Object.values(validation.wolfsburgPrinciples).reduce((a, b) => a + b, 0)}
              </div>
            </div>
          `
        : ''}
    </div>
  `;
}

function renderScoringCriteria(name: string, points: string, description: string) {
  return html`
    <div style="padding: 1rem; background: #f9fafb; border-radius: 6px; border-left: 3px solid #3b82f6;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
        <div style="font-weight: 600; color: #1f2937; font-size: 0.875rem;">
          ${name}
        </div>
        <div style="padding: 0.25rem 0.5rem; background: #dbeafe; color: #1e40af; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
          ${points}
        </div>
      </div>
      <div style="color: #6b7280; font-size: 0.875rem; line-height: 1.5;">
        ${description}
      </div>
    </div>
  `;
}
