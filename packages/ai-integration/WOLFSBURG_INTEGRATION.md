# Wolfsburg Cultural Validation Guide

Complete guide to VW heritage authenticity validation using the Wolfsburg principles scoring system.

## Table of Contents

- [What is Wolfsburg Validation?](#what-is-wolfsburg-validation)
- [Scoring System](#scoring-system)
- [Main Criteria (100 Points)](#main-criteria-100-points)
- [Wolfsburg Principles (Bonus 0-40 Points)](#wolfsburg-principles-bonus-0-40-points)
- [How to Use Validation](#how-to-use-validation)
- [Improving Cultural Scores](#improving-cultural-scores)
- [Examples](#examples)
- [Common Issues](#common-issues)
- [Best Practices](#best-practices)

---

## What is Wolfsburg Validation?

Wolfsburg Cultural Validation is a comprehensive scoring system that ensures AI-generated VW design system content honors authentic Volkswagen heritage (1938-1980). Named after Wolfsburg, Germany—the birthplace of VW—this validation system prevents:

- **Anachronisms**: Modern elements in vintage contexts (LED lights on 1960s Beetles)
- **Design inaccuracies**: Wrong proportions, incorrect details
- **Cultural insensitivity**: Stereotypes, inappropriate associations
- **Material inauthenticity**: Non-period materials, wrong color names
- **Community misalignment**: Violating VW community values

### When to Use Validation

**Always validate when:**
- Generating public-facing assets (marketing, website)
- Creating design system components
- Ensuring brand authenticity is critical
- Working with user-generated prompts

**Optional validation for:**
- Internal drafts and prototypes
- Rapid iteration and experimentation
- Trusted, pre-approved prompts
- Budget-constrained projects

---

## Scoring System

### Overall Score Structure

```
┌─────────────────────────────────────────────────┐
│ CULTURAL AUTHENTICITY SCORE                     │
├─────────────────────────────────────────────────┤
│ Main Criteria (Required)           100 points   │
│ Wolfsburg Principles (Bonus)       +40 points   │
├─────────────────────────────────────────────────┤
│ MAXIMUM POSSIBLE SCORE              140 points  │
├─────────────────────────────────────────────────┤
│ Passing Threshold (default)         70 points   │
│ High Quality Threshold              85+ points  │
│ Exceptional Threshold               100+ points │
└─────────────────────────────────────────────────┘
```

### Validation Result

```typescript
interface CulturalValidationResult {
  score: number;              // 0-140 (typically 0-100 without bonus)
  passes: boolean;            // True if score >= threshold
  breakdown: {
    periodAccuracy: number;           // 0-25 points
    vehicleDesignFidelity: number;    // 0-25 points
    culturalSensitivity: number;      // 0-20 points
    materialAuthenticity: number;     // 0-15 points
    communityValuesAlignment: number; // 0-15 points
  };
  wolfsburgPrinciples?: {
    ddb: number;              // 0-10 bonus points
    pancake: number;          // 0-10 bonus points
    airCooled: number;        // 0-10 bonus points
    character: number;        // 0-10 bonus points
  };
  issues: ValidationIssue[];
  suggestions: string[];
}
```

---

## Main Criteria (100 Points)

### 1. Period Accuracy (25 points)

Ensures content references authentic VW design from 1938-1980 without anachronisms.

**What's evaluated:**
- Era-appropriate design elements
- Period-correct colors and materials
- Historical accuracy of features
- Absence of modern elements in vintage contexts

**Scoring:**
- **20-25 pts**: Perfectly period-accurate
- **15-19 pts**: Minor accuracy issues
- **10-14 pts**: Some anachronisms present
- **0-9 pts**: Significant period errors

**Examples:**

```typescript
// HIGH SCORE (25/25)
const prompt = "1967 VW Beetle in original L87 Pearl White with chrome bumpers and steel wheels";
// ✓ Specific year
// ✓ Period-correct color name
// ✓ Authentic materials (chrome, steel)

// MEDIUM SCORE (15/25)
const prompt = "Classic 1960s VW Beetle with modern LED headlights";
// ✓ Correct era
// ✗ Anachronism: LED lights didn't exist in 1960s

// LOW SCORE (5/25)
const prompt = "Vintage VW Beetle with touchscreen dashboard and electric motor";
// ✗ Major anachronisms
// ✗ Not authentic to air-cooled era
```

**Common Deductions:**
- Generic era references ("vintage", "classic") instead of specific years: -5 pts
- Modern materials in vintage context (carbon fiber, LED, digital): -10 pts
- Wrong era entirely (2000s elements in 1960s design): -20 pts

---

### 2. Vehicle Design Fidelity (25 points)

Ensures accurate vehicle proportions, shapes, and design details.

**What's evaluated:**
- Correct vehicle proportions
- Accurate design details (windows, chrome, body lines)
- Era-appropriate variants (split window, oval window, etc.)
- Authentic model-specific features

**Scoring:**
- **20-25 pts**: Highly accurate design details
- **15-19 pts**: Generally correct with minor errors
- **10-14 pts**: Noticeable design inaccuracies
- **0-9 pts**: Wrong proportions or major errors

**Examples:**

```typescript
// HIGH SCORE (25/25)
const prompt = "1963 VW Beetle split-window with curved windshield, round headlights, and characteristic sloping hood";
// ✓ Split-window variant (correct for 1963)
// ✓ Accurate design details
// ✓ Characteristic proportions mentioned

// MEDIUM SCORE (16/25)
const prompt = "VW Beetle with boxy shape and angular windows";
// ✗ Wrong proportions (Beetles are curved, not boxy)
// ✗ Wrong windows (Beetles have curved windows)

// LOW SCORE (8/25)
const prompt = "VW Beetle sedan with four doors";
// ✗ Major error: Beetles only had 2 doors
```

**Era-Specific Variants:**

| Era | Beetle Variants | Bus Variants | Correct Details |
|-----|----------------|--------------|-----------------|
| 1938-1953 | Split window, small rear window | Split windshield, "barn doors" | Smaller windows, external hinges |
| 1953-1957 | Oval window | Split windshield | Vent windows, chrome trim |
| 1958-1964 | Larger windows | Split or panoramic windshield | Larger lights, more glass |
| 1965-1979 | Curved windshield, larger windows | Panoramic windshield | Modern lights, larger bumpers |

**Common Deductions:**
- Wrong window style for era: -5 pts
- Incorrect body proportions: -10 pts
- Wrong number of doors/windows: -15 pts
- Mixing features from different models: -8 pts

---

### 3. Cultural Sensitivity (20 points)

Respects VW community values and avoids stereotypes or inappropriate associations.

**What's evaluated:**
- Alignment with VW community values (simplicity, adventure, freedom)
- Avoidance of stereotypes (hippie clichés, drug culture)
- Authentic representation of counter-culture heritage
- Respectful treatment of VW legacy

**Scoring:**
- **16-20 pts**: Highly respectful and authentic
- **11-15 pts**: Generally respectful with minor issues
- **6-10 pts**: Some stereotypes or insensitivity
- **0-5 pts**: Offensive or highly inappropriate

**VW Community Values:**
1. **Simplicity**: Honest, functional design
2. **Adventure**: Freedom of the road, exploration
3. **Reliability**: Dependable, long-lasting
4. **Practicality**: Utilitarian, multi-purpose
5. **Charm**: Friendly, approachable personality

**Examples:**

```typescript
// HIGH SCORE (20/20)
const prompt = "VW Bus on coastal highway symbolizing freedom and adventure, simple and practical design";
// ✓ Authentic values (freedom, adventure, simplicity)
// ✓ No stereotypes
// ✓ Respectful representation

// MEDIUM SCORE (12/20)
const prompt = "VW Bus covered in tie-dye paint at Woodstock with peace signs and incense";
// ✓ Historically accurate to counter-culture
// ✗ Leans on stereotypes
// ✗ Missing deeper VW values

// LOW SCORE (5/20)
const prompt = "VW Bus hotbox with drug paraphernalia and stoners";
// ✗ Perpetuates negative stereotypes
// ✗ Disrespectful to community
// ✗ Ignores authentic VW heritage
```

**Common Deductions:**
- Overuse of hippie stereotypes without depth: -5 pts
- Drug culture associations: -10 pts
- Ignoring core VW values (simplicity, reliability): -8 pts
- Exploitative or disrespectful tone: -15 pts

---

### 4. Material Authenticity (15 points)

References authentic VW materials, colors, and finishes.

**What's evaluated:**
- Period-accurate materials (chrome, steel, canvas)
- Official VW color names and codes
- Realistic textures and finishes
- Authentic trim and upholstery

**Scoring:**
- **12-15 pts**: Highly authentic materials
- **8-11 pts**: Generally correct materials
- **4-7 pts**: Some inaccurate materials
- **0-3 pts**: Mostly incorrect materials

**Authentic VW Materials:**

**Exterior:**
- Chrome (bumpers, trim, hubcaps)
- Steel body panels
- Glass (not plastic)
- VW brand paints (L-codes)

**Interior:**
- Vinyl seats (early models)
- Cloth/leatherette (later models)
- Rubber floor mats
- Bakelite/metal dashboard

**VW Color Codes (Examples):**
- L87 Pearl White
- L456 Lotus White
- L41 Black
- L380 Poppy Red
- L456 Pastel Blue

**Examples:**

```typescript
// HIGH SCORE (15/15)
const prompt = "1965 VW Beetle in L380 Poppy Red with chrome bumpers, steel wheels, and vinyl interior";
// ✓ Official color code
// ✓ Period-correct materials
// ✓ Authentic trim

// MEDIUM SCORE (9/15)
const prompt = "Classic VW Beetle in bright red with shiny metal accents";
// ✓ Generally correct materials
// ✗ Generic color name (not official)
// ✗ "Shiny metal" instead of specific material

// LOW SCORE (3/15)
const prompt = "VW Beetle with carbon fiber body and LED underglow";
// ✗ Anachronistic materials (carbon fiber, LEDs)
// ✗ Not authentic to VW heritage
```

**Common Deductions:**
- Generic color names instead of official codes: -3 pts
- Modern materials in vintage context: -8 pts
- Incorrect material types (plastic instead of metal): -5 pts
- Non-VW brand materials: -4 pts

---

### 5. Community Values Alignment (15 points)

Captures the VW spirit and authentic emotional resonance.

**What's evaluated:**
- VW spirit (reliability, practicality, charm)
- Authentic emotional resonance
- Avoidance of commercial exploitation
- Connection to VW community ethos

**Scoring:**
- **12-15 pts**: Strongly aligned with values
- **8-11 pts**: Generally aligned
- **4-7 pts**: Weak alignment
- **0-3 pts**: Misaligned or exploitative

**VW Community Ethos:**
1. **Authenticity over flash**: Real experiences over show
2. **Function over form**: Practical design drives aesthetics
3. **Community over consumption**: Shared passion, not status
4. **Heritage over trends**: Timeless design, not fads
5. **Adventure over luxury**: Experiences over possessions

**Examples:**

```typescript
// HIGH SCORE (15/15)
const prompt = "Well-loved VW Bus with camping gear, showing reliable service and practical adventures";
// ✓ Authentic experience (adventure)
// ✓ Community values (reliability, practicality)
// ✓ Emotional resonance (well-loved)

// MEDIUM SCORE (9/15)
const prompt = "Restored VW Beetle showroom perfect with flawless paint";
// ✓ Appreciation of heritage
// ✗ More about show than authentic use
// ✗ Missing adventure/practical spirit

// LOW SCORE (3/15)
const prompt = "Luxury VW concept with premium features and status appeal";
// ✗ Misses VW spirit (simplicity, practicality)
// ✗ Commercial/status-focused
// ✗ Not authentic to community values
```

**Common Deductions:**
- Commercial/marketing tone: -5 pts
- Status/luxury focus instead of adventure: -6 pts
- Missing emotional connection: -4 pts
- Trendy instead of timeless: -5 pts

---

## Wolfsburg Principles (Bonus 0-40 Points)

The Wolfsburg Principles are four bonus scoring categories that recognize exceptional cultural authenticity inspired by VW's history and philosophy.

### 1. DDB Principle - Honesty & Clarity (0-10 bonus points)

Based on the legendary "Think Small" and "Lemon" advertising campaigns by Doyle Dane Bernbach (DDB).

**Philosophy:**
- Honest, clear communication without pretense
- Direct descriptions without marketing fluff
- Self-aware humor and humility
- "What you see is what you get" approach

**Examples:**

```typescript
// HIGH BONUS (10/10)
const prompt = "Simple VW Beetle, nothing fancy—just reliable transportation with character";
// ✓ Honest description
// ✓ No pretense
// ✓ Direct communication

// MEDIUM BONUS (5/10)
const prompt = "Classic VW Beetle with timeless design and proven engineering";
// ✓ Honest
// ✗ Slightly marketing-influenced

// NO BONUS (0/10)
const prompt = "Revolutionary VW Beetle with unparalleled luxury and cutting-edge innovation";
// ✗ Marketing hyperbole
// ✗ Dishonest to VW's simple ethos
```

---

### 2. Pancake Principle - Engineering Enables Form (0-10 bonus points)

Based on the Type 3's flat "pancake" engine innovation that enabled new design possibilities.

**Philosophy:**
- Engineering innovation drives aesthetic design
- Form follows function
- Technical solutions create unique beauty
- Design is consequence of smart engineering

**Examples:**

```typescript
// HIGH BONUS (10/10)
const prompt = "VW Type 3 with low, sleek profile enabled by innovative flat-four pancake engine design";
// ✓ Engineering enables aesthetics
// ✓ Function drives form
// ✓ Technical innovation highlighted

// MEDIUM BONUS (5/10)
const prompt = "VW Beetle's curved shape following the air-cooled engine layout";
// ✓ Form follows function
// ✗ Less specific engineering detail

// NO BONUS (0/10)
const prompt = "Beautiful VW Beetle with attractive curves";
// ✗ Aesthetic focus only
// ✗ No engineering connection
```

---

### 3. Air-Cooled Principle - Durability & Reliability (0-10 bonus points)

Based on VW's legendary air-cooled engine reliability and longevity.

**Philosophy:**
- Built to last, not to trend
- Timeless design over fashion
- Durable, maintainable, repairable
- Proven reliability over novelty

**Examples:**

```typescript
// HIGH BONUS (10/10)
const prompt = "Decades-old VW Beetle still running strong, testament to durable air-cooled engineering";
// ✓ Longevity emphasized
// ✓ Durability highlighted
// ✓ Timeless reliability

// MEDIUM BONUS (5/10)
const prompt = "Reliable VW Bus ready for another road trip";
// ✓ Reliability mentioned
// ✗ Less emphasis on durability/longevity

// NO BONUS (0/10)
const prompt = "Brand new VW concept with latest features";
// ✗ Novelty focus
// ✗ No durability/timelessness
```

---

### 4. Character & Charm - The "Bug" Principle (0-10 bonus points)

Based on the Beetle's beloved personality and friendly, approachable character.

**Philosophy:**
- Mechanical objects with personality
- Friendly, approachable design
- Emotional connection and charm
- "Bug" as friend, not just vehicle

**Examples:**

```typescript
// HIGH BONUS (10/10)
const prompt = "Friendly VW Beetle with round headlights like eyes, smiling at you from the driveway";
// ✓ Personality emphasized
// ✓ Emotional connection
// ✓ Character and charm

// MEDIUM BONUS (5/10)
const prompt = "VW Beetle with its characteristic friendly appearance";
// ✓ Charm mentioned
// ✗ Less personal connection

// NO BONUS (0/10)
const prompt = "VW Beetle vehicle in parking lot";
// ✗ No personality
// ✗ No charm or character
```

---

## How to Use Validation

### Basic Validation

```typescript
import { AIPipeline, createAIRouter } from '@vwx/ai-integration';

const router = createAIRouter({
  providers: {
    anthropic: { apiKey: process.env.VITE_ANTHROPIC_API_KEY }
  }
});

const pipeline = new AIPipeline(router);

// Validate a prompt
const validation = await pipeline.validatePrompt(
  'Classic 1967 VW Beetle in L87 Pearl White',
  {
    theme: 'bw',
    vehicle: 'beetle',
    era: '1960s'
  }
);

console.log('Score:', validation.score, '/ 100');
console.log('Passes:', validation.passes);
console.log('Breakdown:', validation.breakdown);
console.log('Issues:', validation.issues);
console.log('Suggestions:', validation.suggestions);
```

### Advanced Validation Options

```typescript
const validation = await pipeline.validatePrompt(
  prompt,
  context,
  {
    threshold: 80,                    // Require 80+ score (default: 70)
    strictMode: true,                 // Fail on any critical issues
    includeWolfsburgPrinciples: true  // Include bonus scoring (default: true)
  }
);

// Check Wolfsburg bonus scores
if (validation.wolfsburgPrinciples) {
  console.log('DDB:', validation.wolfsburgPrinciples.ddb, '/ 10');
  console.log('Pancake:', validation.wolfsburgPrinciples.pancake, '/ 10');
  console.log('Air-Cooled:', validation.wolfsburgPrinciples.airCooled, '/ 10');
  console.log('Character:', validation.wolfsburgPrinciples.character, '/ 10');
}
```

### Validation in Pipeline

```typescript
// Automatic validation in full pipeline
const result = await pipeline.execute({
  text: 'VW design concept',
  context: { theme: 'color', vehicle: 'beetle' },
  options: {
    validationThreshold: 75,          // Custom threshold
    stopOnValidationFailure: true,    // Stop if validation fails
    includeWolfsburgPrinciples: true  // Include bonus scoring
  }
});

if (result.success) {
  console.log('Cultural score:', result.culturalValidation?.score);
  console.log('Breakdown:', result.culturalValidation?.breakdown);
}
```

---

## Improving Cultural Scores

### Strategy 1: Be Specific

```typescript
// LOW SCORE (60/100)
const generic = "Vintage VW in red";

// HIGH SCORE (88/100)
const specific = "1965 VW Beetle in L380 Poppy Red with chrome bumpers and curved windshield";
// + Period accuracy: Specific year (+5)
// + Vehicle fidelity: Era-correct details (+5)
// + Material authenticity: Official color code, specific materials (+8)
```

### Strategy 2: Include Era-Appropriate Details

```typescript
// LOW SCORE (65/100)
const vague = "Classic VW Bus for road trips";

// HIGH SCORE (85/100)
const detailed = "1970 VW Type 2 Bus with split windshield, safari windows, and pop-top camper";
// + Period accuracy: Specific year and variant (+7)
// + Vehicle fidelity: Accurate variant details (+6)
// + Community values: Adventure spirit (+4)
```

### Strategy 3: Reference Authentic Materials

```typescript
// LOW SCORE (70/100)
const generic = "VW Beetle with shiny paint and metal trim";

// HIGH SCORE (90/100)
const authentic = "VW Beetle in original L87 Pearl White lacquer with polished chrome bumpers and steel wheels";
// + Material authenticity: Official color, specific materials (+10)
// + Period accuracy: Era-correct finishes (+5)
```

### Strategy 4: Emphasize VW Values

```typescript
// LOW SCORE (68/100)
const shallow = "Beautiful restored VW Beetle showpiece";

// HIGH SCORE (92/100)
const values = "Well-maintained VW Beetle, reliable daily driver and beloved companion for weekend adventures";
// + Community values: Reliability, adventure, emotional connection (+15)
// + Character principle: "Beloved companion" (+8)
// + Air-cooled principle: Reliability emphasized (+7)
```

### Strategy 5: Incorporate Wolfsburg Principles

```typescript
// STANDARD SCORE (75/100)
const standard = "1967 VW Beetle in good condition";

// EXCEPTIONAL SCORE (105/100)
const wolfsburg = "Simple, honest 1967 VW Beetle—no frills, just dependable air-cooled character that's been faithfully serving its owner for decades";
// + DDB principle: Honest, no-frills description (+9)
// + Air-cooled principle: Durability and longevity (+8)
// + Character principle: Personality emphasized (+7)
// Total bonus: +24 points!
```

---

## Examples

### Example 1: Low Score Analysis

```typescript
const prompt = "Vintage VW with cool modifications";

const validation = await pipeline.validatePrompt(prompt, context);

// Result: 45/100 - FAIL
// Breakdown:
//   Period Accuracy: 8/25 (vague era, no specific details)
//   Vehicle Fidelity: 10/25 (no specific vehicle or details)
//   Cultural Sensitivity: 12/20 (generally okay)
//   Material Authenticity: 5/15 (no specific materials)
//   Community Values: 10/15 (missing core values)
//
// Issues:
//   - "Vintage" too vague (critical)
//   - "Cool modifications" undefined (warning)
//   - No specific vehicle type (warning)
//
// Suggestions:
//   - Specify exact year and vehicle type
//   - Define specific modifications
//   - Include authentic VW materials and colors
```

### Example 2: High Score Analysis

```typescript
const prompt = "1963 VW Beetle split-window in L41 Black with chrome bumpers, a reliable friend for daily commuting and weekend exploration";

const validation = await pipeline.validatePrompt(prompt, context);

// Result: 98/100 - EXCEPTIONAL
// Breakdown:
//   Period Accuracy: 24/25 (specific year, era-correct details)
//   Vehicle Fidelity: 24/25 (split-window variant accurate for 1963)
//   Cultural Sensitivity: 19/20 (respectful, authentic)
//   Material Authenticity: 15/15 (official color code, authentic materials)
//   Community Values: 16/15 (reliability, adventure values) [bonus!]
//
// Wolfsburg Principles:
//   DDB: 7/10 (simple, honest description)
//   Pancake: 0/10 (not applicable to Beetle)
//   Air-Cooled: 8/10 (reliability emphasized)
//   Character: 9/10 ("reliable friend" personality)
//
// Total: 98 + 24 = 122/140 possible
//
// Issues: None
//
// Suggestions:
//   - Already exceptional! Consider mentioning specific use cases for even higher engagement.
```

### Example 3: Before/After Improvement

**Before (Score: 58/100):**
```typescript
const before = "VW Bus painted with flowers for hippies";
// Issues:
// - Stereotypical representation
// - No era specificity
// - No authentic details
// - Exploitative tone
```

**After (Score: 92/100):**
```typescript
const after = "1967 VW Type 2 Bus in L380 Poppy Red, lovingly customized with hand-painted wildflower motifs by its owner, symbolizing the freedom and self-expression of the counter-culture era";
// Improvements:
// + Specific year and model
// + Official color code
// + Authentic customization (not stereotype)
// + Respectful cultural context
// + Personal connection ("lovingly customized")
// + VW values (freedom, self-expression)
```

---

## Common Issues

### Issue 1: Anachronisms

**Problem:** Modern elements in vintage contexts

```typescript
// WRONG
"1960s VW Beetle with LED headlights and digital dashboard"

// RIGHT
"1960s VW Beetle with round sealed-beam headlights and simple analog speedometer"
```

### Issue 2: Wrong Vehicle Details

**Problem:** Inaccurate design features for specific models/eras

```typescript
// WRONG
"1955 VW Beetle with curved windshield"
// (Curved windshield introduced in 1965)

// RIGHT
"1955 VW Beetle with split rear window and small oval rear window"
```

### Issue 3: Generic Descriptions

**Problem:** Vague references without specific details

```typescript
// WRONG
"Classic VW in nice condition"

// RIGHT
"1968 VW Beetle in L456 Lotus White, well-maintained with original chrome trim"
```

### Issue 4: Stereotypes

**Problem:** Relying on clichés instead of authentic representation

```typescript
// WRONG
"VW Bus full of hippies smoking at Woodstock"

// RIGHT
"1969 VW Type 2 Bus, symbol of counter-culture freedom and adventure, representing a generation's quest for authentic experiences"
```

### Issue 5: Incorrect Materials

**Problem:** Non-period or non-VW materials

```typescript
// WRONG
"VW Beetle with carbon fiber hood and neon underglow"

// RIGHT
"VW Beetle with steel hood and polished chrome bumpers"
```

---

## Best Practices

### 1. Research Before Prompting

```typescript
// Consult VW resources:
// - Official VW Heritage documentation
// - TheSamba.com (VW community wiki)
// - VW color codes and specifications
// - Era-specific variant guides

// Then create informed prompts:
const researched = "1965 VW Type 3 Notchback with pancake engine, enabling low hood and sleek profile";
```

### 2. Use Official Terminology

```typescript
// Prefer official VW terms:
const official = "VW Type 2 Transporter" // not "VW Van"
const official2 = "Split-window Beetle" // not "Old Beetle"
const official3 = "L87 Pearl White" // not "Off-white"
```

### 3. Balance Detail and Clarity

```typescript
// Too vague:
"Classic VW"

// Too much detail:
"1967 VW Beetle chassis number 117 1234 567 with specific engine modifications including bore size..."

// Just right:
"1967 VW Beetle with original air-cooled flat-four engine and classic round headlights"
```

### 4. Emphasize Authentic Values

```typescript
// Focus on VW spirit:
const authentic = "Reliable VW Bus, trusted companion for countless adventures";
// Not just: "VW Bus"
```

### 5. Iterate Based on Feedback

```typescript
async function iterativeValidation(prompt: string, context: any) {
  let currentPrompt = prompt;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    const validation = await pipeline.validatePrompt(currentPrompt, context);

    if (validation.passes && validation.score >= 85) {
      return { prompt: currentPrompt, validation };
    }

    // Improve based on suggestions
    if (validation.suggestions.length > 0) {
      console.log('Improving prompt based on:', validation.suggestions[0]);
      currentPrompt = improvePrompt(currentPrompt, validation);
    }

    attempts++;
  }

  throw new Error('Could not achieve target score after iterations');
}
```

---

## See Also

- **[PIPELINE_GUIDE.md](./PIPELINE_GUIDE.md)** - Complete pipeline usage guide
- **[COST_OPTIMIZATION.md](./COST_OPTIMIZATION.md)** - Cost management strategies
- **[README.md](./README.md)** - Package overview and quick start

---

**VWX Design System v0.1.0** | **Phase 3 Complete** | **Wolfsburg Cultural Validation Guide**
