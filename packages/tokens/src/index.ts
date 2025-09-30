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

// Re-export design tokens (will be generated during build)
export * from '../dist/js/base';

// Export theme names
export const themes = ['bw', 'color', 'patina'] as const;
export type Theme = typeof themes[number];

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
