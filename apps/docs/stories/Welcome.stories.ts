export default {
  title: 'Introduction/Welcome',
  parameters: {
    docs: {
      description: {
        component: 'Welcome to the VW Xperience Design System'
      }
    }
  }
};

export const Welcome = () => {
  return `
    <div style="padding: 2rem; font-family: system-ui, sans-serif;">
      <h1 style="color: var(--theme-color-interactive-primary, #003d7a); margin-bottom: 1rem;">
        🚗 Welcome to VWX Design System
      </h1>
      <p style="font-size: 1.125rem; color: var(--theme-color-text-primary, #333); margin-bottom: 2rem;">
        The automotive-inspired design system built with Web Components (Lit) and comprehensive theming support.
      </p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="padding: 1.5rem; border: 1px solid var(--theme-color-border-primary, #ddd); border-radius: 8px;">
          <h3 style="margin-top: 0; color: var(--theme-color-text-primary, #333);">🎨 Three Themes</h3>
          <p style="color: var(--theme-color-text-secondary, #666);">
            Choose from B&W (minimalist), Color (VW brand), or Patina (aged aesthetic) themes.
          </p>
        </div>
        
        <div style="padding: 1.5rem; border: 1px solid var(--theme-color-border-primary, #ddd); border-radius: 8px;">
          <h3 style="margin-top: 0; color: var(--theme-color-text-primary, #333);">🧩 Web Components</h3>
          <p style="color: var(--theme-color-text-secondary, #666);">
            Framework-agnostic components built with Lit for maximum compatibility.
          </p>
        </div>
        
        <div style="padding: 1.5rem; border: 1px solid var(--theme-color-border-primary, #ddd); border-radius: 8px;">
          <h3 style="margin-top: 0; color: var(--theme-color-text-primary, #333);">🔧 Design Tokens</h3>
          <p style="color: var(--theme-color-text-secondary, #666);">
            Centralized design decisions using Style Dictionary for consistent theming.
          </p>
        </div>
      </div>
      
      <div style="padding: 1rem; background-color: var(--theme-color-background-secondary, #f8f9fa); border-radius: 8px;">
        <p style="margin: 0; color: var(--theme-color-text-primary, #333);">
          <strong>Next Steps:</strong> Explore the design tokens, components, and themes using the sidebar navigation.
          Use the theme switcher in the toolbar to see how the design system adapts.
        </p>
      </div>
    </div>
  `;
};