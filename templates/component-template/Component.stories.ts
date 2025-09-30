import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './Component';

/**
 * COMPONENT_NAME is a versatile component for...
 *
 * ## Features
 * - Feature 1
 * - Feature 2
 * - Feature 3
 *
 * ## Usage
 * ```html
 * <vwx-component-name variant="primary">
 *   Content here
 * </vwx-component-name>
 * ```
 */
const meta: Meta = {
  title: 'Components/ComponentName',
  component: 'vwx-component-name',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary'],
      description: 'Visual variant of the component',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the component',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: {
    variant: 'default',
    size: 'medium',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

// ==========================================
// Default Story
// ==========================================

export const Default: Story = {
  render: (args) => html`
    <vwx-component-name
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
    >
      Default Component Content
    </vwx-component-name>
  `,
};

// ==========================================
// Variant Stories
// ==========================================

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
  render: (args) => html`
    <vwx-component-name variant=${args.variant}>
      Primary Variant
    </vwx-component-name>
  `,
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  render: (args) => html`
    <vwx-component-name variant=${args.variant}>
      Secondary Variant
    </vwx-component-name>
  `,
};

// ==========================================
// Size Stories
// ==========================================

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center;">
      <vwx-component-name size="small">Small</vwx-component-name>
      <vwx-component-name size="medium">Medium</vwx-component-name>
      <vwx-component-name size="large">Large</vwx-component-name>
    </div>
  `,
};

// ==========================================
// State Stories
// ==========================================

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => html`
    <vwx-component-name ?disabled=${args.disabled}>
      Disabled Component
    </vwx-component-name>
  `,
};

// ==========================================
// Slot Stories
// ==========================================

export const WithIcon: Story = {
  render: () => html`
    <vwx-component-name>
      <span slot="icon" style="font-size: 1.5rem;">🚗</span>
      Component with Icon
    </vwx-component-name>
  `,
};

export const CustomContent: Story = {
  render: () => html`
    <vwx-component-name>
      <div>
        <h3 style="margin: 0 0 0.5rem 0;">Custom Title</h3>
        <p style="margin: 0;">Custom paragraph content with <strong>formatting</strong>.</p>
      </div>
    </vwx-component-name>
  `,
};

// ==========================================
// Combination Stories
// ==========================================

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <vwx-component-name variant="default">Default Variant</vwx-component-name>
      <vwx-component-name variant="primary">Primary Variant</vwx-component-name>
      <vwx-component-name variant="secondary">Secondary Variant</vwx-component-name>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <vwx-component-name size="small" variant="primary">Small Size</vwx-component-name>
      <vwx-component-name size="medium" variant="primary">Medium Size</vwx-component-name>
      <vwx-component-name size="large" variant="primary">Large Size</vwx-component-name>
    </div>
  `,
};

// ==========================================
// Interactive Stories
// ==========================================

export const Interactive: Story = {
  render: () => html`
    <vwx-component-name
      @vwx-focus=${() => console.log('Component focused')}
      @vwx-blur=${() => console.log('Component blurred')}
      @vwx-change=${(e: CustomEvent) => console.log('Component changed', e.detail)}
    >
      Click to interact (check console)
    </vwx-component-name>
  `,
};

// ==========================================
// Accessibility Story
// ==========================================

export const Accessibility: Story = {
  parameters: {
    docs: {
      description: {
        story: 'This component is fully accessible with keyboard navigation and screen reader support.',
      },
    },
  },
  render: () => html`
    <div>
      <p>Use Tab to focus, Enter/Space to interact:</p>
      <vwx-component-name>Accessible Component 1</vwx-component-name>
      <vwx-component-name variant="primary">Accessible Component 2</vwx-component-name>
      <vwx-component-name disabled>Disabled Component (not focusable)</vwx-component-name>
    </div>
  `,
};

// ==========================================
// Theme Story
// ==========================================

export const Theming: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Component can be themed using CSS custom properties.',
      },
    },
  },
  render: () => html`
    <style>
      .custom-theme {
        --vw-component-bg: #ff6b6b;
        --vw-component-color: white;
        --vw-component-padding: 2rem;
      }
    </style>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <vwx-component-name>Default Theme</vwx-component-name>
      <vwx-component-name class="custom-theme">Custom Theme</vwx-component-name>
    </div>
  `,
};
