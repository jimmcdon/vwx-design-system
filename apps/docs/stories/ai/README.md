# AI Integration Stories

Comprehensive Storybook documentation for VWX Design System's AI integration components.

## Overview

These stories demonstrate the complete AI-powered asset generation pipeline, from API key configuration to cultural validation and final asset generation. All stories use **mock data** and are designed to showcase the UI/UX without requiring actual API keys.

## Story Files

### 1. Pipeline.stories.ts
**Complete AI Pipeline Demonstration**

Demonstrates the full 4-step AI generation pipeline with multiple workflow variants:

- **Default** - Text-to-image workflow with cost estimation
- **ImageToImage** - Upload image and generate variations
- **StepByStep** - Individual step execution with manual review
- **WithValidation** - Detailed cultural validation results
- **CostComparison** - Compare routing strategies (cost-optimized, quality-first, speed-first)

**Key Features:**
- Real-time pipeline progress visualization
- Step-by-step status indicators
- Cost breakdown by provider
- Cultural validation scoring
- Generated asset preview

**Controls:**
- `mode`: Pipeline execution mode (text-to-image, image-to-image, step-by-step)
- `theme`: VWX visual theme (bw, color, patina)
- `vehicle`: VW vehicle archetype (beetle, bus, karmann-ghia, type-3)
- `era`: Historical era (1950s, 1960s, 1970s)
- `includeWolfsburg`: Enable Wolfsburg principles validation

**Variants:** 5 stories

---

### 2. APIKeyManager.stories.ts
**BYOK (Bring Your Own Key) Configuration UI**

Demonstrates API key management for all 5 AI providers with validation feedback:

- **Default** - All 5 providers (OpenRouter, FAL, OpenAI, Anthropic, Google)
- **SingleProvider** - Focused view for one provider (OpenAI example)
- **WithValidation** - Real-time key validation with success/error states
- **Populated** - Pre-filled configuration with routing options
- **VWXHostedService** - Alternative VWX managed service option

**Key Features:**
- Secure key input with show/hide toggle
- Real-time validation feedback
- Provider capabilities display
- Cost estimation per provider
- Routing strategy configuration
- Budget limits and cost tracking
- Security notices

**Controls:**
- `mode`: Key management mode (all-providers, single-provider, vwx-hosted)
- `showValidation`: Display validation feedback
- `populated`: Pre-populate with mock keys

**Variants:** 5 stories

---

### 3. AIGeneration.stories.ts
**Asset Generation Panel**

Demonstrates the main generation interface with various states:

- **Default** - Ready to generate with cost estimate
- **InProgress** - Active generation with real-time progress
- **Success** - Completed generation with results
- **Error** - Error handling and retry suggestions
- **WithCostEstimate** - Detailed cost calculator and comparison

**Key Features:**
- Contextual input form (theme, vehicle, era)
- Advanced options (routing, quality, variations)
- Real-time progress tracking
- Cost breakdown and estimation
- Generated asset preview
- Error handling with actionable suggestions
- Provider usage statistics

**Controls:**
- `state`: Panel state (ready, in-progress, success, error)
- `mode`: Generation mode (text-to-image, image-to-image)
- `showCostEstimate`: Display cost preview

**Variants:** 5 stories

---

### 4. CulturalScore.stories.ts
**Cultural Authenticity Visualization**

Demonstrates the cultural validation scoring system with Wolfsburg principles:

- **HighScore** - Excellent score (90+) with all categories
- **PassingScore** - Good score (70-85) with minor issues
- **FailingScore** - Below threshold (<70) with critical issues
- **WithWolfsburg** - Detailed Wolfsburg principles analysis
- **WithIssues** - Complete issue and suggestion display
- **ComparisonView** - Side-by-side score comparison

**Key Features:**
- Overall score visualization (0-100)
- 5-category breakdown with progress bars
- Wolfsburg Principles scoring (4 principles, +40 bonus)
- Issue severity indicators (critical, warning, info)
- Actionable suggestions
- Historical context for Wolfsburg principles
- Scoring criteria reference

**Controls:**
- `scoreLevel`: Score range (high, passing, failing)
- `includeWolfsburg`: Show Wolfsburg principles
- `showIssues`: Display validation issues

**Variants:** 6 stories

---

## Usage in Storybook

### Running Storybook

```bash
# From vwx-design-system root
pnpm storybook

# Or from apps/docs
cd apps/docs
pnpm storybook
```

Storybook will be available at `http://localhost:6006`

### Navigation

1. Open Storybook
2. Navigate to **AI Integration** in the sidebar
3. Select a story category:
   - AI Integration / Pipeline
   - AI Integration / API Key Manager
   - AI Integration / AI Generation Panel
   - AI Integration / Cultural Score

### Interactive Controls

Each story has interactive controls in the **Controls** tab:
- Modify props to see different states
- Toggle features on/off
- Switch between themes, vehicles, and eras
- Adjust score levels and validation settings

### Documentation

Each story includes:
- **Description**: What the story demonstrates
- **Controls**: Interactive prop controls
- **Args**: Default argument values
- **Source**: View the HTML/Lit template code

---

## Mock Data

All stories use **mock data** to demonstrate functionality without requiring real API keys:

### Mock Pipeline Results
- Complete pipeline execution with all 4 steps
- Realistic timing and cost data
- Sample validation scores and feedback
- Example generated assets (using Unsplash placeholder images)

### Mock Validation Data
Three validation score levels:
- **High Score (94/100)**: Perfect alignment, no issues
- **Passing Score (78/100)**: Good with minor warnings
- **Failing Score (62/100)**: Critical issues, does not pass

### Mock Providers
- OpenRouter (multi-model routing)
- FAL.ai (fast image generation)
- OpenAI (GPT-4, DALL-E 3)
- Anthropic (Claude 3)
- Google AI (Gemini Vision)

---

## Cultural Validation System

### Scoring Categories (100 points total)

1. **Period Accuracy** (25 points)
   - Correct era details (1950s, 1960s, 1970s)
   - Period-appropriate elements
   - No anachronisms

2. **Vehicle Design Fidelity** (25 points)
   - Authentic VW design features
   - Correct model specifications
   - Factory-correct details

3. **Cultural Sensitivity** (20 points)
   - Respectful representation
   - Appropriate context
   - Community values alignment

4. **Material Authenticity** (15 points)
   - Period-correct materials
   - Authentic finishes and patina
   - Factory color codes

5. **Community Values Alignment** (15 points)
   - Preservation over restoration
   - Adventure and freedom spirit
   - Simplicity and honesty
   - Anti-establishment ethos

### Wolfsburg Principles (+40 bonus points)

Based on DDB's revolutionary "Think Small" campaign (1959):

1. **DDB Principle** (10 points)
   - Honesty & Clarity
   - "Think small" philosophy
   - Self-aware, humble messaging

2. **Pancake Principle** (10 points)
   - Form Follows Function
   - Engineering enables design
   - Flat engine → iconic shape

3. **Air-Cooled Principle** (10 points)
   - Durability & Reliability
   - Simple, maintainable design
   - Built to last generations

4. **Character Charm** (10 points)
   - The "Bug" Principle
   - Quirky, lovable personality
   - Emotional connection

### Validation Threshold
- **Pass**: 70/100 or higher
- **Fail**: Below 70/100
- **Excellent**: 90/100 or higher

---

## Routing Strategies

### Cost-Optimized (Default)
- **Goal**: Lowest cost while maintaining quality
- **Providers**: FAL (generation), Anthropic (validation)
- **Cost**: ~$0.021 per asset
- **Use Case**: High-volume generation, budget-conscious

### Quality-First
- **Goal**: Best possible quality
- **Providers**: OpenAI (GPT-4, DALL-E 3)
- **Cost**: ~$0.078 per asset
- **Use Case**: Hero images, marketing materials

### Speed-First
- **Goal**: Fastest generation time
- **Providers**: FAL Flux Schnell, Claude Haiku
- **Cost**: ~$0.035 per asset
- **Use Case**: Rapid prototyping, iterations

---

## File Structure

```
apps/docs/stories/ai/
├── Pipeline.stories.ts          # Complete pipeline workflows
├── APIKeyManager.stories.ts     # BYOK configuration
├── AIGeneration.stories.ts      # Generation panel states
├── CulturalScore.stories.ts     # Validation visualization
└── README.md                    # This file
```

---

## Integration with Components

These stories demonstrate **UI patterns** for AI integration. The actual integration will:

1. **Use Real Components**: Stories will eventually import actual Web Components from `packages/components`
2. **Connect to AI Package**: Wire up to `packages/ai-integration` for real API calls
3. **Handle State**: Implement proper state management (Lit reactive properties)
4. **Add Interactivity**: Real form submissions, file uploads, API calls

### Example Integration (Future)

```typescript
import '../../../packages/components/src/organisms/AIPipeline';
import { createAIRouter } from '../../../packages/ai-integration';

export const LivePipeline: Story = {
  render: () => html`
    <vwx-ai-pipeline
      .router=${createAIRouter(config)}
      @vwx-pipeline-complete=${handleComplete}
    ></vwx-ai-pipeline>
  `,
};
```

---

## Best Practices

### Using These Stories

1. **Reference for Implementation**: Use as visual spec for building real components
2. **UX Patterns**: Copy interaction patterns and states
3. **Visual Design**: Match colors, spacing, typography
4. **Error Handling**: Replicate error states and messaging
5. **Cost Transparency**: Maintain clear cost visibility

### When Building Components

1. **Match Story Behavior**: Components should match story interactions
2. **Use Same Data Structures**: Import types from `packages/ai-integration`
3. **Handle All States**: Ready, loading, success, error
4. **Validate Props**: Use TypeScript interfaces
5. **Accessibility**: WCAG 2.1 AA compliance

---

## Related Documentation

- **AI Integration Spec**: `/docs/ai-integration-specification.md`
- **Design System Spec**: `/docs/vw-xperience-design-system-specification.md`
- **Cultural Guidelines**: `/docs/cultural-authenticity-guidelines.md`
- **AI Package**: `/packages/ai-integration/README.md`
- **Component Library**: `/packages/components/README.md`

---

## Support

For questions or issues with these stories:

1. Check the [Technical Architecture Document](/docs/technical-architecture-document.md)
2. Review the [AI Integration Specification](/docs/ai-integration-specification.md)
3. Consult the [Design System Specification](/docs/vw-xperience-design-system-specification.md)

---

**Last Updated**: 2024-09-30
**Version**: 1.0.0
**Phase**: Phase 3 - AI Integration
