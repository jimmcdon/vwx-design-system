import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * COMPONENT_NAME Component
 *
 * A brief description of what this component does.
 *
 * @slot - The default slot for content
 * @slot icon - Optional icon slot
 *
 * @fires vwx-change - Fired when the component state changes
 * @fires vwx-focus - Fired when the component receives focus
 * @fires vwx-blur - Fired when the component loses focus
 *
 * @csspart base - The component's base wrapper
 * @csspart content - The main content area
 *
 * @cssprop --vw-component-bg - Background color
 * @cssprop --vw-component-color - Text color
 * @cssprop --vw-component-padding - Internal padding
 *
 * @example
 * ```html
 * <vwx-component-name variant="primary">
 *   Content here
 * </vwx-component-name>
 * ```
 */
@customElement('vwx-component-name')
export class VwxComponentName extends LitElement {
  // ==========================================
  // Styles
  // ==========================================

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
    }

    :host([hidden]) {
      display: none;
    }

    .base {
      background: var(--vw-component-bg, var(--vw-color-surface));
      color: var(--vw-component-color, var(--vw-color-text-primary));
      padding: var(--vw-component-padding, var(--vw-spacing-md));
      border-radius: var(--vw-border-radius-md);
      font-family: var(--vw-font-family-base);
    }

    /* Variants */
    :host([variant='primary']) .base {
      background: var(--vw-color-primary);
      color: var(--vw-color-text-on-primary);
    }

    :host([variant='secondary']) .base {
      background: var(--vw-color-secondary);
      color: var(--vw-color-text-on-secondary);
    }

    /* States */
    :host([disabled]) .base {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    :host(:focus-visible) .base {
      outline: 2px solid var(--vw-color-focus);
      outline-offset: 2px;
    }

    /* Content */
    .content {
      display: flex;
      align-items: center;
      gap: var(--vw-spacing-sm);
    }
  `;

  // ==========================================
  // Properties
  // ==========================================

  /**
   * Visual variant of the component
   */
  @property({ type: String })
  variant: 'default' | 'primary' | 'secondary' = 'default';

  /**
   * Disabled state
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Size of the component
   */
  @property({ type: String })
  size: 'small' | 'medium' | 'large' = 'medium';

  // ==========================================
  // State
  // ==========================================

  /**
   * Internal focused state
   * @internal
   */
  @state()
  private focused = false;

  // ==========================================
  // Lifecycle Methods
  // ==========================================

  connectedCallback(): void {
    super.connectedCallback();

    // Set ARIA attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'group');
    }
  }

  // ==========================================
  // Event Handlers
  // ==========================================

  private handleFocus(): void {
    if (this.disabled) return;

    this.focused = true;
    this.dispatchEvent(
      new CustomEvent('vwx-focus', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleBlur(): void {
    this.focused = false;
    this.dispatchEvent(
      new CustomEvent('vwx-blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleChange(): void {
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent('vwx-change', {
        detail: {
          variant: this.variant,
          size: this.size,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  // ==========================================
  // Helper Methods
  // ==========================================

  /**
   * Focus the component
   */
  focus(options?: FocusOptions): void {
    const base = this.shadowRoot?.querySelector('.base') as HTMLElement;
    base?.focus(options);
  }

  /**
   * Blur the component
   */
  blur(): void {
    const base = this.shadowRoot?.querySelector('.base') as HTMLElement;
    base?.blur();
  }

  // ==========================================
  // Render
  // ==========================================

  render() {
    return html`
      <div
        part="base"
        class="base"
        tabindex=${this.disabled ? '-1' : '0'}
        aria-disabled=${this.disabled}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
      >
        <div part="content" class="content">
          <slot name="icon"></slot>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

// TypeScript declaration for the custom element
declare global {
  interface HTMLElementTagNameMap {
    'vwx-component-name': VwxComponentName;
  }
}
