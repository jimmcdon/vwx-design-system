/**
 * VWX Design System - Design Tokens
 *
 * This package exports design tokens for the VW Xperience Design System.
 * Tokens are available in multiple formats:
 * - CSS Custom Properties (via dist/css/variables.css)
 * - JavaScript/TypeScript objects
 *
 * @example
 * // Import CSS tokens in your app
 * import '@vwx/tokens/css';
 *
 * // Or import JavaScript tokens
 * import { spacing, typography, colors } from '@vwx/tokens';
 */

// Export base tokens (types only, actual values loaded at runtime)
export interface DesignTokens {
  spacing: Record<string, string>;
  typography: Record<string, any>;
  colors: Record<string, string>;
}

// Re-export will be available after build
try {
  // @ts-ignore - This will exist after build
  module.exports = { ...module.exports, ...require('../dist/js/base') };
} catch {
  // Build time - no dist folder yet
}

// Export theme names
export const themes = ['bw', 'color', 'patina'] as const;
export type Theme = (typeof themes)[number];

// Utility function to apply theme
export function applyTheme(theme: Theme): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

// Utility function to get current theme
export function getCurrentTheme(): Theme | null {
  if (typeof document !== 'undefined') {
    const theme = document.documentElement.getAttribute('data-theme');
    return themes.includes(theme as Theme) ? (theme as Theme) : null;
  }
  return null;
}
