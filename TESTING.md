# Testing Guide

Comprehensive guide to testing in the VW Xperience Design System.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Coverage Requirements](#test-coverage-requirements)
- [Unit Testing](#unit-testing)
- [E2E Testing](#e2e-testing)
- [Accessibility Testing](#accessibility-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [Performance Testing](#performance-testing)
- [Writing Good Tests](#writing-good-tests)

## Testing Philosophy

Our testing approach follows these principles:

1. **Test Behavior, Not Implementation**: Focus on what components do, not how they do it
2. **Write Tests Users Would Care About**: Test from the user's perspective
3. **Accessibility First**: Every component must pass WCAG 2.1 AA standards
4. **Fail Fast**: Catch issues early in development
5. **Maintainable Tests**: Write clear, readable tests that are easy to update

### Test Pyramid

```
        /\
       /E2E\          Few: Critical user flows
      /------\
     /Visual \        Some: Key UI components
    /----------\
   /Accessibility\    Many: All interactive elements
  /--------------\
 /   Unit Tests   \   Most: All functions and components
/------------------\
```

## Test Coverage Requirements

### Minimum Coverage Thresholds

- **Lines**: 90%
- **Statements**: 90%
- **Branches**: 85%
- **Functions**: 90%

### What to Test

✅ **Always Test**:

- Component rendering
- User interactions (click, type, focus)
- Props and attributes
- Events and callbacks
- Accessibility (ARIA, keyboard navigation)
- Error states
- Edge cases

❌ **Don't Test**:

- Third-party library internals
- CSS implementation details
- Browser APIs (assume they work)

## Unit Testing

### Framework: Vitest

We use Vitest for unit testing with `@testing-library/web-components`.

### Running Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test Button.test.ts

# Run tests for specific package
pnpm --filter @vwx/components test
```

### Writing Unit Tests

#### Basic Component Test

```typescript
// Button.test.ts
import { expect, describe, it } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import './Button';

describe('vwx-button', () => {
  it('renders with default props', async () => {
    const el = await fixture(html`<vwx-button>Click me</vwx-button>`);

    expect(el).to.exist;
    expect(el.textContent).to.equal('Click me');
  });

  it('applies variant correctly', async () => {
    const el = await fixture(html`
      <vwx-button variant="primary">Primary</vwx-button>
    `);

    expect(el.getAttribute('variant')).to.equal('primary');
    expect(el.classList.contains('button--primary')).to.be.true;
  });

  it('handles click events', async () => {
    let clicked = false;
    const el = await fixture(html`
      <vwx-button @click=${() => (clicked = true)}>Click</vwx-button>
    `);

    el.click();
    expect(clicked).to.be.true;
  });

  it('respects disabled state', async () => {
    const el = await fixture(html`<vwx-button disabled>Disabled</vwx-button>`);

    expect(el.hasAttribute('disabled')).to.be.true;
    expect(el.getAttribute('aria-disabled')).to.equal('true');
  });
});
```

#### Testing User Interactions

```typescript
import { userEvent } from '../tests/utils/test-helpers';

it('handles user input', async () => {
  const el = await fixture(html`<vwx-input></vwx-input>`);
  const input = el.shadowRoot.querySelector('input');

  userEvent.type(input, 'test@vw.com');

  expect(input.value).to.equal('test@vw.com');
});

it('handles focus and blur', async () => {
  const el = await fixture(html`<vwx-input></vwx-input>`);

  userEvent.focus(el);
  expect(el.classList.contains('focused')).to.be.true;

  userEvent.blur(el);
  expect(el.classList.contains('focused')).to.be.false;
});
```

#### Testing Asynchronous Behavior

```typescript
import { waitFor } from '../tests/utils/test-helpers';

it('shows loading state', async () => {
  const el = await fixture(html`<vwx-button loading>Load</vwx-button>`);

  await waitFor(() => {
    const spinner = el.shadowRoot.querySelector('.spinner');
    return spinner !== null;
  });

  expect(el.hasAttribute('loading')).to.be.true;
});
```

#### Testing with Mock Providers

```typescript
import { createMockProvider } from '../tests/utils/mock-providers';

it('integrates with AI provider', async () => {
  const mockProvider = createMockProvider('openai');
  const el = await fixture(html`
    <vwx-ai-assistant .provider=${mockProvider}></vwx-ai-assistant>
  `);

  const suggestion = await el.getSuggestion('test input');
  expect(suggestion).to.include('Mock AI suggestion');
});
```

## E2E Testing

### Framework: Playwright

We use Playwright for end-to-end testing across multiple browsers.

### Running E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run in headed mode (see browser)
pnpm test:e2e --headed

# Run specific test file
pnpm test:e2e accessibility.spec.ts

# Run in specific browser
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit

# Debug mode
pnpm test:e2e --debug
```

### Writing E2E Tests

#### Basic E2E Test

```typescript
// component-rendering.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Button Component', () => {
  test('renders and handles clicks', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary');

    const button = page.locator('vwx-button');
    await expect(button).toBeVisible();

    await button.click();
    // Assert side effects of click
  });
});
```

#### Testing Forms

```typescript
test('submits form with valid data', async ({ page }) => {
  await page.goto('/iframe.html?id=components-form--login');

  await page.fill('input[name="email"]', 'user@vw.com');
  await page.fill('input[name="password"]', 'password123');

  await page.click('button[type="submit"]');

  await expect(page.locator('.success-message')).toBeVisible();
});
```

#### Testing Modal Interactions

```typescript
test('opens and closes modal', async ({ page }) => {
  await page.goto('/iframe.html?id=components-modal--default');

  const openButton = page.locator('button:has-text("Open")');
  await openButton.click();

  const modal = page.locator('vwx-modal[open]');
  await expect(modal).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(modal).not.toBeVisible();
});
```

## Accessibility Testing

### Framework: axe-core + Playwright

All components must pass WCAG 2.1 AA compliance.

### Running Accessibility Tests

```bash
# Run accessibility-specific tests
pnpm test:e2e accessibility.spec.ts
```

### Writing Accessibility Tests

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--primary');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### Accessibility Checklist

For every interactive component, test:

- [ ] Keyboard navigation (Tab, Enter, Space, Escape, Arrow keys)
- [ ] Focus indicators visible
- [ ] ARIA attributes correct
- [ ] Screen reader announcements
- [ ] Color contrast (WCAG AA)
- [ ] Semantic HTML structure
- [ ] Form labels and descriptions
- [ ] Error messages accessible
- [ ] Loading states announced

### Keyboard Navigation Tests

```typescript
test('navigates with keyboard', async ({ page }) => {
  await page.goto('/iframe.html?id=components-form--default');

  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('name', 'email');

  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('name', 'password');

  await page.keyboard.press('Enter');
  // Assert form submission
});
```

### Focus Trap Tests

```typescript
test('traps focus in modal', async ({ page }) => {
  await page.goto('/iframe.html?id=components-modal--default');

  await page.click('button:has-text("Open")');

  const modal = page.locator('vwx-modal');
  const firstButton = modal.locator('button').first();
  const lastButton = modal.locator('button').last();

  await lastButton.focus();
  await page.keyboard.press('Tab');

  // Focus should cycle back to first element
  await expect(firstButton).toBeFocused();
});
```

## Visual Regression Testing

### Recommended: Playwright Screenshots

```typescript
test('button visual regression', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--primary');

  const button = page.locator('vwx-button');

  await expect(button).toHaveScreenshot('button-primary.png');
});
```

### Advanced: Chromatic

See [Visual Regression Setup Guide](./docs/visual-regression-setup.md) for Chromatic integration.

## Performance Testing

### Framework: Lighthouse CI

```bash
# Run Lighthouse tests
pnpm lighthouse
```

### Performance Criteria

- **Performance Score**: > 90
- **Accessibility Score**: > 95
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Total Blocking Time**: < 300ms

### Bundle Size Testing

```bash
# Check bundle sizes
pnpm bundle-size
```

Maximum bundle sizes:

- Components: 500 KB
- Tokens: 50 KB
- Themes: 100 KB
- Utils: 100 KB

## Writing Good Tests

### Best Practices

1. **Descriptive Test Names**

   ✅ Good:

   ```typescript
   test('shows error message when email is invalid', async () => {});
   ```

   ❌ Bad:

   ```typescript
   test('test 1', async () => {});
   ```

2. **Arrange-Act-Assert Pattern**

   ```typescript
   test('increments counter', async () => {
     // Arrange
     const el = await fixture(html`<vwx-counter value="0"></vwx-counter>`);

     // Act
     el.increment();

     // Assert
     expect(el.value).to.equal(1);
   });
   ```

3. **One Assertion Per Test** (when possible)

   ✅ Good:

   ```typescript
   test('renders with correct text', async () => {
     const el = await fixture(html`<vwx-button>Click</vwx-button>`);
     expect(el.textContent).to.equal('Click');
   });

   test('renders with correct variant', async () => {
     const el = await fixture(html`<vwx-button variant="primary"></vwx-button>`);
     expect(el.variant).to.equal('primary');
   });
   ```

   ❌ Bad:

   ```typescript
   test('renders correctly', async () => {
     const el = await fixture(html`<vwx-button variant="primary">Click</vwx-button>`);
     expect(el.textContent).to.equal('Click');
     expect(el.variant).to.equal('primary');
     expect(el.disabled).to.be.false;
   });
   ```

4. **Avoid Implementation Details**

   ✅ Good:

   ```typescript
   test('shows loading spinner', async () => {
     const el = await fixture(html`<vwx-button loading></vwx-button>`);
     expect(el.getAttribute('aria-busy')).to.equal('true');
   });
   ```

   ❌ Bad:

   ```typescript
   test('sets _isLoading private property', async () => {
     const el = await fixture(html`<vwx-button loading></vwx-button>`);
     expect(el._isLoading).to.be.true; // Testing private implementation
   });
   ```

5. **Clean Up After Tests**

   ```typescript
   afterEach(async () => {
     // Cleanup is automatic with @open-wc/testing
     // But clean up any global state if needed
   });
   ```

### Common Patterns

#### Testing Error States

```typescript
test('shows error when validation fails', async () => {
  const el = await fixture(html`<vwx-input required></vwx-input>`);
  const input = el.shadowRoot.querySelector('input');

  input.value = '';
  input.dispatchEvent(new Event('blur'));

  await el.updateComplete;

  const error = el.shadowRoot.querySelector('.error-message');
  expect(error).to.exist;
  expect(error.textContent).to.include('required');
});
```

#### Testing Events

```typescript
test('emits custom event on submit', async () => {
  const el = await fixture(html`<vwx-form></vwx-form>`);

  let eventData;
  el.addEventListener('vwx-submit', (e) => {
    eventData = e.detail;
  });

  const submitButton = el.shadowRoot.querySelector('button[type="submit"]');
  submitButton.click();

  expect(eventData).to.exist;
  expect(eventData.formData).to.exist;
});
```

#### Testing Slots

```typescript
test('renders slotted content', async () => {
  const el = await fixture(html`
    <vwx-card>
      <span slot="header">Title</span>
      <p>Content</p>
    </vwx-card>
  `);

  const header = el.querySelector('[slot="header"]');
  expect(header.textContent).to.equal('Title');
});
```

## Continuous Integration

Tests run automatically on:

- Every commit (via Git hooks)
- Every push (via pre-push hook)
- Every pull request (via GitHub Actions)

### CI Test Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test:coverage
      - run: pnpm test:e2e
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [axe-core](https://github.com/dequelabs/axe-core)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Getting Help

- Review existing tests for examples
- Check test utilities in `/tests/utils`
- Ask in team Slack channel
- Request review from QA team
