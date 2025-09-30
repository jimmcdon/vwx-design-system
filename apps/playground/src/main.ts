/**
 * VWX Design System Playground
 * Development environment for testing components
 */

import '@vwx/components';

console.log('VWX Design System Playground initialized');

// Export theme switcher utility for reuse
export function initThemeSwitcher(selector: string = '[data-theme-switcher]') {
  const switchers = document.querySelectorAll(selector);

  switchers.forEach((switcher) => {
    const buttons = switcher.querySelectorAll('button[data-theme]');

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        if (theme) {
          document.documentElement.setAttribute('data-theme', theme);

          // Update active state
          buttons.forEach((b) => b.classList.remove('active'));
          button.classList.add('active');

          // Store preference
          localStorage.setItem('vwx-theme', theme);
        }
      });
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('vwx-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      const activeButton = switcher.querySelector(`button[data-theme="${savedTheme}"]`);
      if (activeButton) {
        buttons.forEach((b) => b.classList.remove('active'));
        activeButton.classList.add('active');
      }
    }
  });
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initThemeSwitcher());
} else {
  initThemeSwitcher();
}
