import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { detectDeviceCapabilities } from '../utils/device.js';

/**
 * GLITCH-BORDER COMPONENT
 *
 * THEORETICAL GROUNDING:
 * Embodies Maria Lugones' concept of refusing containment.
 * Borders try to contain and define.
 * Glitching reveals the artificiality of boundaries.
 *
 * VISUAL METAPHOR:
 * - Stable border = imposed categorization
 * - Breaking border = refusing containment
 * - Color shifting = identity fluidity
 * - Gaps appearing = boundaries are porous
 *
 * @example
 * ```html
 * <glitch-border break-pattern="shift">
 *   <div>Content goes here</div>
 * </glitch-border>
 * ```
 */
@customElement('glitch-border')
export class GlitchBorder extends LitElement {
  // ============================================
  // PUBLIC API
  // ============================================

  /**
   * Border thickness in pixels
   */
  @property({ type: Number })
  thickness = 4;

  /**
   * Base border color
   * Auto-selected based on world if not specified
   */
  @property({ type: String })
  color?: string;

  /**
   * How the border breaks when glitching:
   * - 'shift': Sections shift position
   * - 'gap': Gaps appear in border
   * - 'color': Color shifts only
   * - 'all': All effects combined
   */
  @property({ type: String, attribute: 'break-pattern', reflect: true })
  breakPattern: 'shift' | 'gap' | 'color' | 'all' = 'all';

  /**
   * Glitch intensity (0.0 - 1.0)
   */
  @property({ type: Number })
  intensity = 0.5;

  /**
   * Delay before glitch starts (ms)
   */
  @property({ type: Number, attribute: 'hover-delay' })
  hoverDelay = 100;

  // ============================================
  // STATE
  // ============================================

  @state()
  private isGlitching = false;

  @state()
  private currentGlitchState = 0;

  // ============================================
  // CONFIGURATION
  // ============================================

  private rafId?: number;
  private hoverTimeout?: number;
  private lastUpdate = 0;
  private intersectionObserver?: IntersectionObserver;
  private isVisible = false;
  private prefersReducedMotion = false;
  private isMobile = false;

  private config = {
    updateInterval: 100, // 10fps
    maxIterations: 8,
    currentIteration: 0,
  };

  /**
   * Glitch colors - digital chromatic aberration palette
   */
  private readonly glitchColors = ['#ff00ff', '#00ffff', '#ff6b9d'];

  // ============================================
  // LIFECYCLE
  // ============================================

  connectedCallback() {
    super.connectedCallback();

    this.detectDeviceCapabilities();
    this.applyDeviceOptimizations();
    this.setupIntersectionObserver();
  }

  private detectDeviceCapabilities() {
    const capabilities = detectDeviceCapabilities();
    this.isMobile = capabilities.isMobile;
    this.prefersReducedMotion = capabilities.prefersReducedMotion;
  }

  private applyDeviceOptimizations() {
    if (this.isMobile) {
      this.config.updateInterval = 150;
      this.config.maxIterations = 5;
    }
  }

  private setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.isVisible = entries[0].isIntersecting;
        if (!this.isVisible && this.isGlitching) {
          this.stopGlitch();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    this.updateComplete.then(() => {
      if (this.isConnected) {
        this.intersectionObserver?.observe(this);
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
    this.intersectionObserver?.disconnect();
  }

  // ============================================
  // GLITCH LOGIC
  // ============================================

  /**
   * Animation loop for border glitching
   * Cycles through different glitch states
   */
  private glitchLoop = (timestamp: number) => {
    if (timestamp - this.lastUpdate < this.config.updateInterval) {
      this.rafId = requestAnimationFrame(this.glitchLoop);
      return;
    }

    this.lastUpdate = timestamp;

    // Cycle through glitch states (0-3)
    this.currentGlitchState = (this.currentGlitchState + 1) % 4;
    this.config.currentIteration++;

    if (this.config.currentIteration >= this.config.maxIterations) {
      this.stopGlitch();
      return;
    }

    this.rafId = requestAnimationFrame(this.glitchLoop);
  };

  /**
   * Start glitching
   */
  private startGlitch() {
    if (this.rafId) return;
    if (!this.isVisible) return;
    if (this.prefersReducedMotion) return;

    this.config.currentIteration = 0;
    this.isGlitching = true;
    this.rafId = requestAnimationFrame(this.glitchLoop);
  }

  /**
   * Stop glitching
   */
  private stopGlitch() {
    this.cleanup();
    this.currentGlitchState = 0;
  }

  /**
   * Cleanup resources
   */
  private cleanup() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = undefined;
    }
    this.isGlitching = false;
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  private handleMouseEnter() {
    this.hoverTimeout = window.setTimeout(() => {
      this.startGlitch();
    }, this.hoverDelay);
  }

  private handleMouseLeave() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = undefined;
    }
    this.stopGlitch();
  }

  // ============================================
  // RENDERING
  // ============================================

  /**
   * Get current glitch color based on state
   */
  private getGlitchColor(): string {
    return this.glitchColors[this.currentGlitchState % this.glitchColors.length];
  }

  /**
   * Get CSS custom properties for current state
   */
  private getStyleProps() {
    // Use provided color or fall back to CSS custom property
    const baseColor = this.color || 'var(--border, #c9a88a)';
    const glitchColor = this.getGlitchColor();

    return {
      '--border-thickness': `${this.thickness}px`,
      '--border-color': baseColor,
      '--glitch-color': glitchColor,
      '--glitch-state': this.currentGlitchState,
    };
  }

  // ============================================
  // STYLES
  // ============================================

  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    /* Container for content */
    .border-container {
      position: relative;
      padding: var(--border-thickness);
    }

    /**
     * BASE BORDER
     * Stable border that represents imposed categorization
     */
    .border-base {
      position: absolute;
      inset: 0;
      border: var(--border-thickness) solid var(--border-color);
      pointer-events: none;
      transition: border-color var(--duration-normal, 0.2s);
    }

    /**
     * GLITCH LAYERS
     * 
     * THEORETICAL GROUNDING:
     * Multiple border copies that shift and break represent:
     * - Multiple simultaneous identities (Russell)
     * - Boundaries refusing to contain (Lugones)
     * - The instability of imposed categorization
     */
    .glitch-layer {
      position: absolute;
      inset: 0;
      border: var(--border-thickness) solid var(--glitch-color);
      opacity: 0;
      pointer-events: none;
      will-change: transform, opacity;
    }

    .glitch-layer-1 {
      animation: glitch-shift-1 var(--duration-normal, 0.2s) steps(3) infinite;
    }

    .glitch-layer-2 {
      animation: glitch-shift-2 0.3s steps(3) infinite;
    }

    /* Show glitch layers only when active */
    :host([is-glitching]) .glitch-layer {
      opacity: 0.7;
    }

    /**
     * BREAK PATTERNS
     * Different ways borders refuse containment
     */

    /* Shift: Border sections move (refusing position) */
    :host([break-pattern='shift']) .glitch-layer-1,
    :host([break-pattern='all']) .glitch-layer-1 {
      clip-path: polygon(0 0, 100% 0, 100% 30%, 95% 30%, 95% 70%, 100% 70%, 100% 100%, 0 100%);
    }

    :host([break-pattern='shift']) .glitch-layer-2,
    :host([break-pattern='all']) .glitch-layer-2 {
      clip-path: polygon(0 0, 5% 0, 5% 30%, 0 30%, 0 70%, 5% 70%, 5% 100%, 0 100%);
    }

    /* Gap: Sections of border disappear (refusing completeness) */
    :host([break-pattern='gap']) .border-base {
      border-style: dashed;
      animation: gap-pattern 0.3s steps(4) infinite;
    }

    /* Color: Only color shifts (identity fluidity) */
    :host([break-pattern='color']) .border-base {
      animation: color-shift 0.3s steps(3) infinite;
    }

    /**
     * ANIMATIONS
     */

    @keyframes glitch-shift-1 {
      0%,
      100% {
        transform: translate(0, 0);
        opacity: 0;
      }
      33% {
        transform: translate(-3px, -3px);
        opacity: 0.7;
      }
      66% {
        transform: translate(-5px, -5px);
        opacity: 0.5;
      }
    }

    @keyframes glitch-shift-2 {
      0%,
      100% {
        transform: translate(0, 0);
        opacity: 0;
      }
      33% {
        transform: translate(3px, 3px);
        opacity: 0.7;
      }
      66% {
        transform: translate(5px, 5px);
        opacity: 0.5;
      }
    }

    @keyframes gap-pattern {
      0% {
        border-style: solid;
      }
      25% {
        border-style: dashed;
      }
      50% {
        border-style: dotted;
      }
      75% {
        border-style: dashed;
      }
    }

    @keyframes color-shift {
      0% {
        border-color: var(--border-color);
      }
      33% {
        border-color: var(--glitch-color);
      }
      66% {
        border-color: var(--border-color);
      }
    }

    /**
     * ACCESSIBILITY: Reduced Motion
     */
    @media (prefers-reduced-motion: reduce) {
      .glitch-layer-1,
      .glitch-layer-2 {
        animation: none !important;
      }

      :host([is-glitching]) .glitch-layer {
        opacity: 0.3;
        transform: translate(2px, 2px);
      }
    }

    /**
     * MOBILE OPTIMIZATION
     */
    @media (max-width: 767px) {
      /* Disable second glitch layer on mobile */
      .glitch-layer-2 {
        display: none;
      }

      /* Simpler animations */
      @keyframes glitch-shift-1 {
        0%,
        100% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(-2px, -2px);
        }
      }
    }
  `;

  // ============================================
  // TEMPLATE
  // ============================================

  render() {
    const styleProps = this.getStyleProps();

    return html`
      <div
        class="border-container"
        style=${Object.entries(styleProps)
          .map(([key, value]) => `${key}: ${value}`)
          .join('; ')}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        <!-- Base border (stable) -->
        <div class="border-base"></div>

        <!-- Glitch layers (only visible when glitching) -->
        ${this.isGlitching
          ? html`
              <div class="glitch-layer glitch-layer-1"></div>
              <div class="glitch-layer glitch-layer-2"></div>
            `
          : ''}

        <!-- Content slot -->
        <slot></slot>
      </div>
    `;
  }

  /**
   * Reflect state to attributes for CSS selectors
   */
  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('isGlitching')) {
      if (this.isGlitching) {
        this.setAttribute('is-glitching', '');
      } else {
        this.removeAttribute('is-glitching');
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'glitch-border': GlitchBorder;
  }
}
