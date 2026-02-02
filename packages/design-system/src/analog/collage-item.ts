import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * COLLAGE-ITEM COMPONENT
 *
 * THEORETICAL GROUNDING:
 * Embodies the analog design philosophy's treatment of negative space as content.
 * Elements float deliberately in the void, each position a conscious choice rather
 * than a grid-computed result. The playback reveal feature shows how structure
 * emerges from chaos—idle state is pure text in space; playing state reveals
 * the underlying boxes and composition.
 *
 * VISUAL METAPHOR:
 * - Arbitrary positioning = each composition is unique and manual
 * - Negative space = the void is part of the design
 * - Playback reveal = structure becomes visible under active conditions
 * - Mobile linearization = graceful fallback to readable flow
 *
 * @example
 * ```html
 * <!-- Basic positioning -->
 * <collage-item x="5%" y="8vh" max-width="500px">
 *   <h1>Entry Title</h1>
 * </collage-item>
 *
 * <!-- Named anchors -->
 * <collage-item anchor="top-right" offset-x="8%" offset-y="15vh" max-width="420px">
 *   <aside>Sidebar content</aside>
 * </collage-item>
 *
 * <!-- Playback reveal -->
 * <collage-item x="25%" y="50vh" playing-reveal>
 *   <pre>// Code block</pre>
 * </collage-item>
 * ```
 */
@customElement('collage-item')
export class CollageItem extends LitElement {
  // ============================================
  // PUBLIC API - POSITIONING
  // ============================================

  /**
   * Horizontal position from left edge.
   * Accepts any valid CSS length: "8%", "5vw", "100px"
   */
  @property({ type: String })
  x = '';

  /**
   * Vertical position from top edge.
   * Accepts any valid CSS length: "12vh", "15%", "200px"
   */
  @property({ type: String })
  y = '';

  /**
   * Named anchor position as alternative to x/y.
   * Takes precedence over x/y if both are specified.
   */
  @property({ type: String })
  anchor: '' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' = '';

  /**
   * Horizontal offset from anchor position.
   * Used with anchor property to fine-tune placement.
   */
  @property({ type: String, attribute: 'offset-x' })
  offsetX = '0';

  /**
   * Vertical offset from anchor position.
   * Used with anchor property to fine-tune placement.
   */
  @property({ type: String, attribute: 'offset-y' })
  offsetY = '0';

  // ============================================
  // PUBLIC API - SIZING
  // ============================================

  /**
   * Maximum width of the item.
   * Accepts any valid CSS length.
   */
  @property({ type: String, attribute: 'max-width' })
  maxWidth = '100%';

  // ============================================
  // PUBLIC API - LAYERING
  // ============================================

  /**
   * Z-index for layering.
   * 0 = background, 1 = content (default), 2 = emphasis
   */
  @property({ type: Number })
  z = 1;

  // ============================================
  // PUBLIC API - PLAYBACK STATE
  // ============================================

  /**
   * When true, item gains visual treatment when body.playing is set.
   * This reveals the underlying composition/structure.
   */
  @property({ type: Boolean, attribute: 'playing-reveal' })
  playingReveal = false;

  // ============================================
  // PUBLIC API - MOBILE
  // ============================================

  /**
   * Order in the linearized mobile layout.
   * Lower numbers appear first. Default follows DOM order.
   */
  @property({ type: Number, attribute: 'mobile-order' })
  mobileOrder = 0;

  // ============================================
  // INTERNAL STATE
  // ============================================

  /**
   * Whether parent canvas is in linearized mode
   */
  @state()
  private _isLinearized = false;

  /**
   * Whether body.playing class is active
   */
  @state()
  private _isPlaying = false;

  /**
   * MutationObserver for body.playing class
   */
  private _bodyObserver?: MutationObserver;

  // ============================================
  // LIFECYCLE
  // ============================================

  connectedCallback() {
    super.connectedCallback();
    this._setupBodyObserver();
    this._checkPlayingState();
    this._applyPositioning();

    // Listen for parent canvas mode changes
    this.addEventListener('collage-mode-change', this._handleModeChange as EventListener);

    // Check initial linearization state from parent
    this._checkParentLinearization();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._bodyObserver?.disconnect();
    this.removeEventListener('collage-mode-change', this._handleModeChange as EventListener);
  }

  updated(changedProperties: PropertyValues) {
    const positionProps = ['x', 'y', 'anchor', 'offsetX', 'offsetY', 'maxWidth', 'z', 'mobileOrder'];
    if (positionProps.some((prop) => changedProperties.has(prop))) {
      this._applyPositioning();
    }
  }

  // ============================================
  // POSITIONING LOGIC
  // ============================================

  /**
   * Apply positioning styles based on current state
   */
  private _applyPositioning() {
    if (this._isLinearized) {
      this._applyLinearizedStyles();
    } else {
      this._applyAbsoluteStyles();
    }
  }

  /**
   * Apply absolute positioning for desktop layout
   */
  private _applyAbsoluteStyles() {
    // Calculate position from anchor or x/y
    const position = this._calculatePosition();

    this.style.position = 'absolute';
    this.style.left = position.left;
    this.style.top = position.top;
    this.style.right = position.right;
    this.style.bottom = position.bottom;
    this.style.transform = position.transform;
    this.style.maxWidth = this.maxWidth;
    this.style.zIndex = String(this.z);
    this.style.order = '';
    this.style.width = '';
  }

  /**
   * Apply linearized styles for mobile layout
   */
  private _applyLinearizedStyles() {
    this.style.position = 'relative';
    this.style.left = '';
    this.style.top = '';
    this.style.right = '';
    this.style.bottom = '';
    this.style.transform = '';
    this.style.maxWidth = '';
    this.style.width = '100%';
    this.style.zIndex = '';
    this.style.order = String(this.mobileOrder);
  }

  /**
   * Calculate position from anchor or x/y coordinates
   */
  private _calculatePosition(): {
    left: string;
    top: string;
    right: string;
    bottom: string;
    transform: string;
  } {
    const result = {
      left: '',
      top: '',
      right: '',
      bottom: '',
      transform: '',
    };

    if (this.anchor) {
      // Named anchor positioning
      switch (this.anchor) {
        case 'top-left':
          result.left = this.offsetX || '0';
          result.top = this.offsetY || '0';
          break;
        case 'top-right':
          result.right = this.offsetX || '0';
          result.top = this.offsetY || '0';
          break;
        case 'bottom-left':
          result.left = this.offsetX || '0';
          result.bottom = this.offsetY || '0';
          break;
        case 'bottom-right':
          result.right = this.offsetX || '0';
          result.bottom = this.offsetY || '0';
          break;
        case 'center': {
          result.left = '50%';
          result.top = '50%';
          // Combine centering transform with offset
          const offsetXVal = this.offsetX || '0';
          const offsetYVal = this.offsetY || '0';
          result.transform = `translate(calc(-50% + ${offsetXVal}), calc(-50% + ${offsetYVal}))`;
          break;
        }
      }
    } else {
      // Direct x/y positioning
      result.left = this.x || '0';
      result.top = this.y || '0';
    }

    return result;
  }

  // ============================================
  // PLAYBACK STATE OBSERVER
  // ============================================

  /**
   * Set up MutationObserver to watch body.playing class
   * Using observer because :host-context() has limited support
   */
  private _setupBodyObserver() {
    if (!this.playingReveal) return;

    this._bodyObserver = new MutationObserver(() => {
      this._checkPlayingState();
    });

    this._bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  /**
   * Check if body has 'playing' class
   */
  private _checkPlayingState() {
    this._isPlaying = document.body.classList.contains('playing');
  }

  // ============================================
  // LINEARIZATION HANDLING
  // ============================================

  /**
   * Handle mode change event from parent canvas
   */
  private _handleModeChange = (e: CustomEvent<{ linearized: boolean }>) => {
    this._isLinearized = e.detail.linearized;
    this._applyPositioning();
  };

  /**
   * Check parent canvas for initial linearization state
   */
  private _checkParentLinearization() {
    const canvas = this.closest('collage-canvas');
    if (canvas && 'isLinearized' in canvas) {
      this._isLinearized = (canvas as { isLinearized: boolean }).isLinearized;
      this._applyPositioning();
    }
  }

  // ============================================
  // STYLES
  // ============================================

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      transition: var(
        --collage-item-transition,
        background var(--duration-slow, 0.3s),
        border var(--duration-slow, 0.3s),
        box-shadow var(--duration-slow, 0.3s)
      );
    }

    /**
     * Playing reveal state
     * Gains visual treatment to show underlying composition
     */
    :host([playing]) {
      background: var(--bg-primary);
      border: var(--border-thin, 1px) solid var(--border);
      padding: var(--space-6, 24px);
    }

    /**
     * Mobile: linearized layout
     */
    :host([linearized]) {
      position: relative !important;
      left: auto !important;
      top: auto !important;
      right: auto !important;
      bottom: auto !important;
      transform: none !important;
      width: 100%;
      max-width: none !important;
      padding: var(--space-6, 24px) var(--space-4, 16px);
      border-bottom: var(--collage-mobile-divider, 1px solid var(--border-subtle, var(--border)));
    }

    :host([linearized]:last-child) {
      border-bottom: none;
    }

    /**
     * Slotted content
     */
    ::slotted(*) {
      margin: 0;
    }
  `;

  // ============================================
  // RENDER
  // ============================================

  render() {
    // Set attributes for CSS targeting
    if (this._isLinearized) {
      this.setAttribute('linearized', '');
    } else {
      this.removeAttribute('linearized');
    }

    if (this.playingReveal && this._isPlaying) {
      this.setAttribute('playing', '');
    } else {
      this.removeAttribute('playing');
    }

    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'collage-item': CollageItem;
  }
}
