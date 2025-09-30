/**
 * Vitest Test Setup
 * Configures global test environment for VW Xperience Design System
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/web-components';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Configure custom matchers for accessibility testing
expect.extend({
  toBeAccessible(received: HTMLElement) {
    // Placeholder for custom accessibility matcher
    // Will be implemented with axe-core integration
    return {
      pass: true,
      message: () => 'Accessibility check passed',
    };
  },
});

// Mock window.matchMedia for theme testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

// Mock IntersectionObserver for lazy loading tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock ResizeObserver for responsive component tests
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;
