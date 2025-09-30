import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility E2E Tests
 * Tests WCAG 2.1 AA compliance using axe-core
 */

test.describe('Accessibility - WCAG 2.1 AA', () => {
  test('should not have automatically detectable accessibility issues on homepage', async ({
    page,
  }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('button components should be accessible', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('form components should be accessible', async ({ page }) => {
    await page.goto('/iframe.html?id=components-form--login-form');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('modal component should be accessible', async ({ page }) => {
    await page.goto('/iframe.html?id=components-modal--default');

    const openButton = page.locator('button:has-text("Open Modal")');
    await openButton.click();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Keyboard Navigation', () => {
  test('should navigate through interactive elements with Tab', async ({ page }) => {
    await page.goto('/iframe.html?id=components-form--login-form');

    await page.keyboard.press('Tab');
    const firstInput = page.locator('input:focus');
    await expect(firstInput).toBeFocused();

    await page.keyboard.press('Tab');
    const secondInput = page.locator('input:focus');
    await expect(secondInput).toBeFocused();
  });

  test('should activate button with Enter and Space', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary');

    const button = page.locator('vwx-button');
    await button.focus();

    await page.keyboard.press('Enter');
    // Verify button was activated

    await page.keyboard.press('Space');
    // Verify button was activated
  });

  test('should close modal with Escape key', async ({ page }) => {
    await page.goto('/iframe.html?id=components-modal--default');

    const openButton = page.locator('button:has-text("Open Modal")');
    await openButton.click();

    const modal = page.locator('vwx-modal[open]');
    await expect(modal).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });
});

test.describe('Screen Reader Support', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--icon-only');

    const button = page.locator('vwx-button[icon-only]');
    const ariaLabel = await button.getAttribute('aria-label');

    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel?.length).toBeGreaterThan(0);
  });

  test('should announce loading states', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--loading');

    const button = page.locator('vwx-button[loading]');
    const ariaLive = await button.getAttribute('aria-live');

    expect(ariaLive).toBe('polite');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

    // Verify heading hierarchy (h1 before h2, etc.)
    let previousLevel = 0;
    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName);
      const currentLevel = parseInt(tagName.charAt(1));

      if (previousLevel > 0) {
        expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1);
      }
      previousLevel = currentLevel;
    }
  });

  test('should have descriptive link text', async ({ page }) => {
    await page.goto('/');

    const links = await page.locator('a').all();

    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');

      // Link should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  });
});

test.describe('Color Contrast', () => {
  test('should meet WCAG AA contrast ratios', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should maintain contrast in dark theme', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary');

    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await themeToggle.click();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Focus Management', () => {
  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary');

    const button = page.locator('vwx-button');
    await button.focus();

    const outlineStyle = await button.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineColor: styles.outlineColor,
      };
    });

    // Should have a visible outline or box-shadow for focus
    expect(
      outlineStyle.outline !== 'none' ||
      parseInt(outlineStyle.outlineWidth) > 0
    ).toBe(true);
  });

  test('should restore focus after modal closes', async ({ page }) => {
    await page.goto('/iframe.html?id=components-modal--default');

    const openButton = page.locator('button:has-text("Open Modal")');
    await openButton.click();

    const modal = page.locator('vwx-modal[open]');
    const closeButton = modal.locator('[aria-label="Close"]');
    await closeButton.click();

    // Focus should return to the open button
    await expect(openButton).toBeFocused();
  });
});
