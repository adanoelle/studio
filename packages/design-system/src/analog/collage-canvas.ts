import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * COLLAGE-CANVAS COMPONENT
 *
 * THEORETICAL GROUNDING:
 * Embodies the analog design philosophy's rejection of implicit grids.
 * This container establishes a coordinate space where elements can float freely,
 * treating negative space as content. Each composition is intentional and manual,
 * refusing the systematization of traditional grid layouts.
 *
 * VISUAL METAPHOR:
 * - Empty canvas = the void is part of the design
 * - Relative positioning = elements exist in relation to their context
 * - Responsive linearization = graceful degradation to readable flow on mobile
 *
 * @example
 * ```html
 * <collage-canvas min-height="100vh">
 *   <collage-item x="5%" y="8vh" max-width="500px">
 *     <h1>Entry Title</h1>
 *   </collage-item>
 *   <collage-item x="60%" y="25vh" max-width="480px">
 *     <p>Essay floating in negative space...</p>
 *   </collage-item>
 * </collage-canvas>
 * ```
 */
@customElement('collage-canvas')
export class CollageCanvas extends LitElement {
  // ============================================
  // PUBLIC API
  // ============================================

  /**
   * Minimum height of the canvas.
   * Accepts any valid CSS height value.
   */
  @property({ type: String, attribute: 'min-height' })
  minHeight = 'auto';

  /**
   * Viewport width below which items linearize into a vertical stack.
   * Default 900px matches typical tablet breakpoint.
   */
  @property({ type: Number, attribute: 'linearize-below' })
  linearizeBelow = 900;

  // ============================================
  // INTERNAL STATE
  // ============================================

  /**
   * Whether we're in linearized (mobile) mode
   */
  @state()
  private _isLinearized = false;

  /**
   * Bound resize handler for cleanup
   */
  private _boundResizeHandler = this._checkLinearization.bind(this);

  // ============================================
  // LIFECYCLE
  // ============================================

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._boundResizeHandler);
    this._checkLinearization();
    // Defer initial notification to ensure children are connected
    requestAnimationFrame(() => this._notifyChildren());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._boundResizeHandler);
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('linearizeBelow')) {
      this._checkLinearization();
    }
    if (changedProperties.has('minHeight')) {
      this.style.setProperty('--canvas-min-height', this.minHeight);
    }
  }

  // ============================================
  // RESPONSIVE HANDLING
  // ============================================

  /**
   * Check if we should be in linearized mode based on viewport width
   */
  private _checkLinearization() {
    const width = window.innerWidth;
    const wasLinearized = this._isLinearized;
    this._isLinearized = width < this.linearizeBelow;

    // Notify children of mode change
    if (wasLinearized !== this._isLinearized) {
      this._notifyChildren();
    }
  }

  /**
   * Notify child collage-items of linearization state
   */
  private _notifyChildren() {
    const items = this.querySelectorAll('collage-item');
    items.forEach((item) => {
      const event = new CustomEvent('collage-mode-change', {
        detail: { linearized: this._isLinearized },
      });
      item.dispatchEvent(event);
    });
  }

  /**
   * Public method to check current linearization state
   */
  get isLinearized(): boolean {
    return this._isLinearized;
  }

  // ============================================
  // STYLES
  // ============================================

  static styles = css`
    :host {
      display: block;
      position: relative;
      min-height: var(--canvas-min-height, auto);
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: var(--space-8, 32px);
    }

    /**
     * Desktop: absolute positioning mode
     * Children use absolute positioning within this container
     */
    :host(:not([linearized])) {
      /* Container provides coordinate space for absolutely positioned items */
    }

    /**
     * Mobile: linearized stack mode
     * Children stack vertically in DOM/mobile-order sequence
     */
    :host([linearized]) {
      display: flex;
      flex-direction: column;
      gap: var(--space-8, 32px);
      padding: var(--space-6, 24px);
    }

    /**
     * Slotted content wrapper
     */
    ::slotted(*) {
      /* Items handle their own positioning */
    }
  `;

  // ============================================
  // RENDER
  // ============================================

  render() {
    // Set linearized attribute for CSS targeting
    if (this._isLinearized) {
      this.setAttribute('linearized', '');
    } else {
      this.removeAttribute('linearized');
    }

    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'collage-canvas': CollageCanvas;
  }
}
