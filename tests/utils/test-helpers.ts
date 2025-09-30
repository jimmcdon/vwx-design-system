/**
 * Test Helper Utilities
 * Common utilities for component testing
 */

import { fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit';

/**
 * Create a test fixture for a Lit component
 */
export async function createFixture<T extends HTMLElement>(
  template: TemplateResult
): Promise<T> {
  return fixture<T>(template);
}

/**
 * Wait for a component to be fully rendered and updated
 */
export async function waitForComponentUpdate(
  element: HTMLElement,
  timeout = 1000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Component update timeout'));
    }, timeout);

    // Wait for custom element to be defined and updated
    if (element instanceof HTMLElement && 'updateComplete' in element) {
      (element as any).updateComplete.then(() => {
        clearTimeout(timer);
        resolve();
      });
    } else {
      // Fallback for non-Lit elements
      requestAnimationFrame(() => {
        clearTimeout(timer);
        resolve();
      });
    }
  });
}

/**
 * Simulate user interaction events
 */
export const userEvent = {
  click: (element: HTMLElement) => {
    element.click();
  },
  type: (element: HTMLInputElement, text: string) => {
    element.value = text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  },
  focus: (element: HTMLElement) => {
    element.focus();
    element.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
  },
  blur: (element: HTMLElement) => {
    element.blur();
    element.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
  },
  hover: (element: HTMLElement) => {
    element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
  },
  unhover: (element: HTMLElement) => {
    element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
  },
};

/**
 * Get computed styles for an element
 */
export function getComputedStyles(element: HTMLElement): CSSStyleDeclaration {
  return window.getComputedStyle(element);
}

/**
 * Check if element is visible in the DOM
 */
export function isVisible(element: HTMLElement): boolean {
  const styles = getComputedStyles(element);
  return (
    styles.display !== 'none' &&
    styles.visibility !== 'hidden' &&
    styles.opacity !== '0'
  );
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean,
  timeout = 1000,
  interval = 50
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Condition timeout'));
    }, timeout);

    const check = () => {
      if (condition()) {
        clearTimeout(timer);
        resolve();
      } else {
        setTimeout(check, interval);
      }
    };

    check();
  });
}
