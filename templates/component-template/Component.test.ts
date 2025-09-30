import { expect, describe, it, beforeEach } from 'vitest';
import { fixture, html, elementUpdated } from '@open-wc/testing';
import './Component';
import type { VwxComponentName } from './Component';

describe('vwx-component-name', () => {
  // ==========================================
  // Rendering Tests
  // ==========================================

  describe('Rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name>Content</vwx-component-name>`
      );

      expect(el).to.exist;
      expect(el.variant).to.equal('default');
      expect(el.disabled).to.be.false;
      expect(el.size).to.equal('medium');
    });

    it('renders slotted content', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name>Test Content</vwx-component-name>`
      );

      const slot = el.shadowRoot?.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('renders icon slot', async () => {
      const el = await fixture<VwxComponentName>(html`
        <vwx-component-name>
          <span slot="icon">🚗</span>
          Content
        </vwx-component-name>
      `);

      const iconSlot = el.shadowRoot?.querySelector('slot[name="icon"]');
      expect(iconSlot).to.exist;
    });
  });

  // ==========================================
  // Property Tests
  // ==========================================

  describe('Properties', () => {
    it('applies variant attribute', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name variant="primary">Content</vwx-component-name>`
      );

      expect(el.variant).to.equal('primary');
      expect(el.getAttribute('variant')).to.equal('primary');
    });

    it('applies disabled state', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name disabled>Content</vwx-component-name>`
      );

      expect(el.disabled).to.be.true;
      expect(el.hasAttribute('disabled')).to.be.true;

      const base = el.shadowRoot?.querySelector('.base');
      expect(base?.getAttribute('aria-disabled')).to.equal('true');
    });

    it('updates when properties change', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name>Content</vwx-component-name>`
      );

      el.variant = 'secondary';
      await elementUpdated(el);

      expect(el.variant).to.equal('secondary');
    });
  });

  // ==========================================
  // Event Tests
  // ==========================================

  describe('Events', () => {
    it('fires vwx-focus event on focus', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name>Content</vwx-component-name>`
      );

      let eventFired = false;
      el.addEventListener('vwx-focus', () => {
        eventFired = true;
      });

      el.focus();
      await elementUpdated(el);

      expect(eventFired).to.be.true;
    });

    it('fires vwx-blur event on blur', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name>Content</vwx-component-name>`
      );

      let eventFired = false;
      el.addEventListener('vwx-blur', () => {
        eventFired = true;
      });

      el.focus();
      await elementUpdated(el);
      el.blur();
      await elementUpdated(el);

      expect(eventFired).to.be.true;
    });

    it('does not fire events when disabled', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name disabled>Content</vwx-component-name>`
      );

      let focusEventFired = false;
      el.addEventListener('vwx-focus', () => {
        focusEventFired = true;
      });

      el.focus();
      await elementUpdated(el);

      expect(focusEventFired).to.be.false;
    });
  });

  // ==========================================
  // Accessibility Tests
  // ==========================================

  describe('Accessibility', () => {
    it('has correct ARIA attributes', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name>Content</vwx-component-name>`
      );

      expect(el.getAttribute('role')).to.equal('group');

      const base = el.shadowRoot?.querySelector('.base');
      expect(base?.getAttribute('aria-disabled')).to.equal('false');
    });

    it('updates ARIA disabled when disabled', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name disabled>Content</vwx-component-name>`
      );

      const base = el.shadowRoot?.querySelector('.base');
      expect(base?.getAttribute('aria-disabled')).to.equal('true');
    });

    it('is keyboard focusable', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name>Content</vwx-component-name>`
      );

      const base = el.shadowRoot?.querySelector('.base');
      expect(base?.getAttribute('tabindex')).to.equal('0');
    });

    it('is not keyboard focusable when disabled', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name disabled>Content</vwx-component-name>`
      );

      const base = el.shadowRoot?.querySelector('.base');
      expect(base?.getAttribute('tabindex')).to.equal('-1');
    });
  });

  // ==========================================
  // API Tests
  // ==========================================

  describe('Public API', () => {
    it('has focus() method', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name>Content</vwx-component-name>`
      );

      expect(el.focus).to.be.a('function');

      // Should not throw
      el.focus();
    });

    it('has blur() method', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name>Content</vwx-component-name>`
      );

      expect(el.blur).to.be.a('function');

      // Should not throw
      el.blur();
    });
  });

  // ==========================================
  // Edge Cases
  // ==========================================

  describe('Edge Cases', () => {
    it('handles empty content', async () => {
      const el = await fixture<VwxComponentName>(html`<vwx-component-name></vwx-component-name>`);

      expect(el).to.exist;
    });

    it('handles rapid property changes', async () => {
      const el = await fixture<VwxComponentName>(
        html`<vwx-component-name>Content</vwx-component-name>`
      );

      el.variant = 'primary';
      el.variant = 'secondary';
      el.variant = 'default';
      await elementUpdated(el);

      expect(el.variant).to.equal('default');
    });
  });
});
