import { test, expect } from '@playwright/test';

/**
 * Component Rendering E2E Tests
 * Tests basic rendering and functionality of design system components
 */

test.describe('Button Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--primary');
  });

  test('should render primary button correctly', async ({ page }) => {
    const button = page.locator('vwx-button[variant="primary"]');
    await expect(button).toBeVisible();
    await expect(button).toHaveText(/Primary Button/i);
  });

  test('should handle click events', async ({ page }) => {
    const button = page.locator('vwx-button[variant="primary"]');
    await button.click();
    // Assert click event was triggered (check for event handler side effects)
  });

  test('should respect disabled state', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--disabled');
    const button = page.locator('vwx-button[disabled]');
    await expect(button).toBeDisabled();
  });

  test('should show loading state', async ({ page }) => {
    await page.goto('/iframe.html?id=components-button--loading');
    const button = page.locator('vwx-button[loading]');
    const spinner = button.locator('.spinner');
    await expect(spinner).toBeVisible();
  });
});

test.describe('Input Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=components-input--default');
  });

  test('should render input field', async ({ page }) => {
    const input = page.locator('vwx-input input');
    await expect(input).toBeVisible();
  });

  test('should accept user input', async ({ page }) => {
    const input = page.locator('vwx-input input');
    await input.fill('test@vw.com');
    await expect(input).toHaveValue('test@vw.com');
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/iframe.html?id=components-input--with-validation');
    const input = page.locator('vwx-input input');
    await input.fill('invalid-email');
    await input.blur();
    const error = page.locator('vwx-input .error-message');
    await expect(error).toBeVisible();
  });
});

test.describe('Modal Component', () => {
  test('should open and close modal', async ({ page }) => {
    await page.goto('/iframe.html?id=components-modal--default');

    const openButton = page.locator('button:has-text("Open Modal")');
    await openButton.click();

    const modal = page.locator('vwx-modal[open]');
    await expect(modal).toBeVisible();

    const closeButton = modal.locator('[aria-label="Close"]');
    await closeButton.click();

    await expect(modal).not.toBeVisible();
  });

  test('should trap focus within modal', async ({ page }) => {
    await page.goto('/iframe.html?id=components-modal--default');

    const openButton = page.locator('button:has-text("Open Modal")');
    await openButton.click();

    const modal = page.locator('vwx-modal[open]');
    const firstButton = modal.locator('button').first();
    const lastButton = modal.locator('button').last();

    await lastButton.focus();
    await page.keyboard.press('Tab');

    // Focus should cycle back to first focusable element
    await expect(firstButton).toBeFocused();
  });
});

test.describe('Responsive Behavior', () => {
  test('should adapt layout for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/iframe.html?id=components-navigation--default');

    const mobileMenu = page.locator('.mobile-menu');
    await expect(mobileMenu).toBeVisible();
  });

  test('should show desktop layout on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/iframe.html?id=components-navigation--default');

    const desktopNav = page.locator('.desktop-nav');
    await expect(desktopNav).toBeVisible();
  });
});
