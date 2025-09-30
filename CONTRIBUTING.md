# Contributing to VW Xperience Design System

Thank you for contributing to the VW Xperience Design System! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Component Development](#component-development)
- [Review Process](#review-process)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Unprofessional conduct

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vwx-design-system.git
   cd vwx-design-system
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/vwx-design-system.git
   ```
4. Install dependencies:
   ```bash
   pnpm install
   ```
5. Build design tokens:
   ```bash
   pnpm build:tokens
   ```

## Development Workflow

### Branch Naming Conventions

Use descriptive branch names following this pattern:

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions or updates
- `chore/description` - Maintenance tasks

Examples:
- `feature/add-button-component`
- `fix/color-theme-contrast`
- `docs/update-installation-guide`

### Commit Message Format

We follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Examples:**

```
feat(components): add Button component with three variants

- Implemented primary, secondary, and tertiary variants
- Added hover and active states
- Includes comprehensive tests

Closes #123
```

```
fix(tokens): correct color contrast for accessibility

Updated color tokens to meet WCAG AA standards
```

### Development Process

1. **Create a branch** from `develop`:
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**:
   ```bash
   pnpm test
   pnpm lint
   pnpm typecheck
   ```

4. **Build to ensure no errors**:
   ```bash
   pnpm build
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   ```

6. **Keep your branch up to date**:
   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request** on GitHub

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] All tests pass (`pnpm test`)
- [ ] No linting errors (`pnpm lint`)
- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Changes are tested in all three themes (B&W, Color, Patina)

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] Tested in all themes
```

### Review Process

1. A maintainer will review your PR
2. Address any feedback or requested changes
3. Once approved, a maintainer will merge your PR

## Component Development Guidelines

### Component Structure

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('vwx-button')
export class VwxButton extends LitElement {
  @property({ type: String }) variant: 'primary' | 'secondary' = 'primary';
  @property({ type: Boolean }) disabled = false;

  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      padding: var(--spacing-component-padding-md);
      /* ... */
    }
  `;

  render() {
    return html`
      <button
        class=${this.variant}
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </button>
    `;
  }
}
```

### Best Practices

1. **Use Design Tokens**: Always use CSS custom properties from `@vwx/tokens`
   ```css
   color: var(--theme-color-text-primary);
   padding: var(--spacing-component-padding-md);
   ```

2. **Accessibility**: Ensure components are accessible
   - Proper ARIA labels
   - Keyboard navigation support
   - Sufficient color contrast
   - Screen reader compatibility

3. **Theme Support**: Test components in all three themes
   - B&W
   - Color
   - Patina

4. **Documentation**: Write clear Storybook stories
   ```typescript
   export default {
     title: 'Components/Button',
     component: 'vwx-button',
   };
   ```

5. **Testing**: Write comprehensive tests
   - Unit tests for logic
   - Component tests for rendering
   - Accessibility tests

## Design Token Guidelines

### Adding New Tokens

1. Add base tokens in `packages/tokens/src/base/`
2. Reference tokens in theme files
3. Run `pnpm build:tokens` to generate CSS
4. Document new tokens in Storybook

Example:
```json
{
  "spacing": {
    "new-scale": {
      "value": "2rem"
    }
  }
}
```

### Token Naming Convention

- Use semantic names: `spacing-component-padding-md`
- Follow existing patterns
- Use references when possible: `{color.primitive.blue.500.value}`

## Testing Guidelines

### Unit Tests (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { VwxButton } from './vwx-button';

describe('VwxButton', () => {
  it('renders with default props', () => {
    const button = new VwxButton();
    expect(button.variant).toBe('primary');
  });
});
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('button is clickable', async ({ page }) => {
  await page.goto('http://localhost:6006');
  await page.click('vwx-button');
  // assertions
});
```

## Documentation Guidelines

### Storybook Stories

```typescript
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Button',
  component: 'vwx-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
};

export default meta;

export const Primary: StoryObj = {
  render: (args) => html`
    <vwx-button variant=${args.variant}>
      Click Me
    </vwx-button>
  `,
};
```

### MDX Documentation

Create comprehensive documentation pages for complex features.

## Style Guidelines

### TypeScript

- Use explicit types where helpful
- Avoid `any` type
- Use strict mode
- Leverage type inference when appropriate

### CSS

- Use CSS custom properties (design tokens)
- Follow BEM naming for classes if needed
- Keep specificity low
- Support all three themes

### Formatting

Code is automatically formatted with Prettier on commit. You can also run:
```bash
pnpm format
```

## Getting Help

- **Questions**: Open a discussion on GitHub
- **Bugs**: Open an issue with reproduction steps
- **Features**: Open an issue describing your proposal

## Recognition

Contributors will be recognized in:
- Repository contributors list
- Release notes
- Project documentation

Thank you for contributing to VW Xperience Design System!
