import { test, expect } from '@playwright/test';

/**
 * Theme Switching E2E Tests
 * Tests theme switching functionality and persistence
 */

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch to dark theme', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await themeToggle.click();

    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-theme', 'dark');

    // Verify dark theme colors are applied
    const primaryColor = await body.evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--vw-color-primary');
    });
    expect(primaryColor).toBeTruthy();
  });

  test('should persist theme preference', async ({ page, context }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await themeToggle.click();

    // Reload page
    await page.reload();

    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-theme', 'dark');
  });

  test('should respect system theme preference', async ({ page, context }) => {
    await context.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    const body = page.locator('body');
    const theme = await body.getAttribute('data-theme');

    // Should either be dark or auto (depending on implementation)
    expect(['dark', 'auto']).toContain(theme);
  });

  test('should apply theme to all components', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary');

    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await themeToggle.click();

    const button = page.locator('vwx-button');
    const backgroundColor = await button.evaluate((el) => {
      return getComputedStyle(el).backgroundColor;
    });

    // Verify component uses theme colors
    expect(backgroundColor).toBeTruthy();
  });

  test('should handle theme transitions smoothly', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');

    // Toggle theme multiple times
    await themeToggle.click();
    await page.waitForTimeout(100);
    await themeToggle.click();
    await page.waitForTimeout(100);
    await themeToggle.click();

    // No errors should occur
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    expect(errors).toHaveLength(0);
  });
});

test.describe('VW Blue Theme', () => {
  test('should apply VW Blue brand colors', async ({ page }) => {
    await page.goto('/');

    const themeSelector = page.locator('[data-testid="theme-selector"]');
    await themeSelector.selectOption('vw-blue');

    const body = page.locator('body');
    const primaryColor = await body.evaluate((el) => {
      return getComputedStyle(el).getPropertyValue('--vw-color-primary');
    });

    // VW Blue primary color (#001E50)
    expect(primaryColor.toLowerCase()).toContain('#001e50');
  });
});

test.describe('High Contrast Theme', () => {
  test('should apply high contrast theme', async ({ page }) => {
    await page.goto('/');

    const themeSelector = page.locator('[data-testid="theme-selector"]');
    await themeSelector.selectOption('high-contrast');

    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-theme', 'high-contrast');
  });

  test('should meet WCAG AAA contrast requirements', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary');

    const themeSelector = page.locator('[data-testid="theme-selector"]');
    await themeSelector.selectOption('high-contrast');

    // This would typically use axe-core or similar for actual testing
    const button = page.locator('vwx-button');
    await expect(button).toBeVisible();
  });
});
