import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { GlitchBase } from './glitch-base.js';

/**
 * DASH-TRAIL COMPONENT
 *
 * THEORETICAL GROUNDING:
 * Inspired by Hyper Light Drifter's dash mechanic.
 * Movement leaves chromatic traces - past selves remain visible.
 *
 * Embodies Russell's concept of multiple simultaneous identities:
 * You are not just where you are NOW, but also where you WERE.
 * The trail shows the multiplicity of self across time/space.
 *
 * Identity exists in motion, not static position.
 * Each afterimage is equally "you" - all versions coexist.
 *
 * PERFORMANCE:
 * - Uses IntersectionObserver to only track when visible
 * - Throttles position tracking to 20fps
 * - Caches position and only updates on significant movement
 * - Respects prefers-reduced-motion preference
 *
 * ACCESSIBILITY:
 * - Completely disabled when prefers-reduced-motion is set
 * - Visual-only effect with no semantic meaning
 *
 * @example
 * ```html
 * <dash-trail trail-length="8">
 *   <div>Content that leaves trails on move</div>
 * </dash-trail>
 * ```
 */
@customElement('dash-trail')
export class DashTrail extends GlitchBase {
  // ============================================
  // PUBLIC API
  // ============================================

  /** Number of trail ghosts to display */
  @property({ type: Number, attribute: 'trail-length' })
  trailLength = 5;

  /** Minimum movement distance to create new trail position (pixels) */
  @property({ type: Number, attribute: 'threshold' })
  threshold = 5;

  // ============================================
  // INTERNAL STATE
  // ============================================

  @state()
  private positions: Array<{ x: number; y: number; age: number }> = [];

  /** Last tracked position to detect movement */
  private lastPos = { x: 0, y: 0 };

  /** Cached bounding rect to avoid repeated queries */
  private cachedRect: DOMRect | null = null;
  private rectCacheTime = 0;
  private readonly RECT_CACHE_DURATION = 50; // ms

  // ============================================
  // LIFECYCLE
  // ============================================

  connectedCallback() {
    super.connectedCallback();

    // Initialize position after component renders
    this.updateComplete.then(() => {
      this.initializePosition();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.positions = [];
  }

  // ============================================
  // VISIBILITY HANDLING
  // ============================================

  protected override onVisibilityChange(visible: boolean) {
    if (visible && this.shouldAnimate()) {
      this.startTracking();
    } else {
      this.stopTracking();
    }
  }

  // ============================================
  // POSITION TRACKING
  // ============================================

  private initializePosition() {
    const rect = this.getBoundingClientRect();
    this.lastPos = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  private startTracking() {
    if (this.rafId !== undefined) return;
    if (this.prefersReducedMotion) return;

    this.startAnimationLoop((timestamp) => {
      this.trackMovement(timestamp);
      return this.isVisible; // Continue while visible
    }, 20); // 20fps is sufficient for trail effect
  }

  private stopTracking() {
    this.stopAnimationLoop();
    // Fade out trails gradually
    this.fadeTrails();
  }

  private trackMovement(timestamp: number) {
    // Use cached rect if available and fresh
    const now = timestamp;
    if (!this.cachedRect || now - this.rectCacheTime > this.RECT_CACHE_DURATION) {
      this.cachedRect = this.getBoundingClientRect();
      this.rectCacheTime = now;
    }

    const rect = this.cachedRect;
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const distance = Math.hypot(x - this.lastPos.x, y - this.lastPos.y);

    if (distance > this.threshold) {
      this.positions = [
        { x, y, age: 0 },
        ...this.positions.map((p) => ({ ...p, age: p.age + 1 })),
      ].slice(0, this.trailLength);

      this.lastPos = { x, y };
    }
  }

  private fadeTrails() {
    // Gradually age out existing trails
    if (this.positions.length === 0) return;

    const fadeInterval = setInterval(() => {
      this.positions = this.positions
        .map((p) => ({ ...p, age: p.age + 1 }))
        .filter((p) => p.age < this.trailLength);

      if (this.positions.length === 0) {
        clearInterval(fadeInterval);
      }
    }, 100);
  }

  // ============================================
  // STYLES
  // ============================================

  static override styles = css`
    :host {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: var(--z-overlay, 300);
    }

    /**
     * TRAIL AFTERIMAGES
     * HLD-style chromatic separation
     */
    .trail-ghost {
      position: absolute;
      width: 16px;
      height: 16px;
      mix-blend-mode: screen;
      will-change: transform, opacity;
    }

    .trail-ghost::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--glitch-cyan, #00ffff);
      transform: translate(-2px, -2px);
      border-radius: 50%;
    }

    .trail-ghost::after {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--glitch-magenta, #ff00ff);
      transform: translate(2px, 2px);
      border-radius: 50%;
    }

    .trail-ghost-base {
      position: absolute;
      inset: 0;
      background: white;
      border-radius: 50%;
    }

    /**
     * ACCESSIBILITY: Reduced Motion
     * Hide trails entirely for users who prefer reduced motion
     */
    @media (prefers-reduced-motion: reduce) {
      :host {
        display: none;
      }
    }
  `;

  // ============================================
  // RENDER
  // ============================================

  render() {
    // Don't render anything if reduced motion is preferred
    if (this.prefersReducedMotion) {
      return html``;
    }

    return html`
      ${this.positions.map((pos) => {
        const opacity = 1 - pos.age / this.trailLength;
        const scale = 1 - (pos.age / this.trailLength) * 0.5;

        const styles = styleMap({
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          opacity: String(opacity),
          transform: `translate(-50%, -50%) scale(${scale})`,
        });

        return html`
          <div class="trail-ghost" style=${styles}>
            <div class="trail-ghost-base"></div>
          </div>
        `;
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dash-trail': DashTrail;
  }
}
