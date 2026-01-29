import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';

/**
 * GLITCH-BASE COMPONENT
 *
 * THEORETICAL GROUNDING:
 * A foundation for all glitch components, encoding shared patterns
 * for visibility tracking, performance optimization, and accessibility.
 *
 * Encapsulates the technical infrastructure that allows glitch effects
 * to be sustainable - running only when needed, respecting user preferences,
 * and cleaning up properly.
 *
 * PERFORMANCE:
 * - IntersectionObserver: Only animates when component is visible
 * - RequestAnimationFrame: Centralized RAF management with cleanup
 * - Reduced motion: Detects and exposes prefers-reduced-motion preference
 * - Mobile detection: Feature-based detection for device optimization
 *
 * ACCESSIBILITY:
 * - Respects prefers-reduced-motion system preference
 * - Provides hooks for subclasses to disable animations accordingly
 */
export class GlitchBase extends LitElement {
  // ============================================
  // PROTECTED STATE
  // ============================================

  /** IntersectionObserver for visibility tracking */
  protected intersectionObserver?: IntersectionObserver;

  /** Whether the component is currently visible in viewport */
  @state()
  protected isVisible = false;

  /** Whether user prefers reduced motion */
  protected prefersReducedMotion = false;

  /** Whether device is mobile (touch-primary, no hover) */
  protected isMobile = false;

  /** Current requestAnimationFrame ID */
  protected rafId?: ReturnType<typeof requestAnimationFrame>;

  /** Timestamp of last animation update (for throttling) */
  protected lastUpdate = 0;

  // ============================================
  // LIFECYCLE
  // ============================================

  connectedCallback() {
    super.connectedCallback();
    this.detectCapabilities();
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanupObserver();
    this.cleanupRaf();
  }

  // ============================================
  // CAPABILITY DETECTION
  // ============================================

  /**
   * Detect device capabilities using feature queries
   * Avoids user-agent sniffing in favor of capability detection
   */
  protected detectCapabilities() {
    // Check for hover capability and pointer type
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    this.isMobile = !hasHover || hasCoarsePointer || window.innerWidth < 768;

    // Check reduced motion preference
    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  }

  // ============================================
  // INTERSECTION OBSERVER
  // ============================================

  /**
   * Set up IntersectionObserver to track visibility
   * Components should only animate when visible
   */
  protected setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          const wasVisible = this.isVisible;
          this.isVisible = entry.isIntersecting;

          // Notify subclasses of visibility change
          if (wasVisible !== this.isVisible) {
            this.onVisibilityChange(this.isVisible);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    // Observe after first render completes
    this.updateComplete.then(() => {
      this.intersectionObserver?.observe(this);
    });
  }

  /**
   * Called when visibility changes
   * Override in subclasses to start/stop animations
   *
   * @param _visible - Whether the component is now visible
   */
  protected onVisibilityChange(_visible: boolean): void {
    // Override in subclasses
  }

  /**
   * Clean up intersection observer
   */
  protected cleanupObserver() {
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = undefined;
  }

  // ============================================
  // REQUESTANIMATIONFRAME MANAGEMENT
  // ============================================

  /**
   * Start an animation loop with automatic throttling
   *
   * @param callback - Animation callback receiving timestamp
   * @param targetFps - Target frames per second (default 20)
   */
  protected startAnimationLoop(
    callback: (timestamp: number) => boolean | void,
    targetFps = 20
  ) {
    const interval = 1000 / targetFps;

    const loop = (timestamp: number) => {
      // Throttle to target FPS
      if (timestamp - this.lastUpdate < interval) {
        this.rafId = requestAnimationFrame(loop);
        return;
      }

      this.lastUpdate = timestamp;

      // Callback returns false to stop loop
      const shouldContinue = callback(timestamp);
      if (shouldContinue !== false) {
        this.rafId = requestAnimationFrame(loop);
      } else {
        this.rafId = undefined;
      }
    };

    this.rafId = requestAnimationFrame(loop);
  }

  /**
   * Stop the current animation loop
   */
  protected stopAnimationLoop() {
    this.cleanupRaf();
  }

  /**
   * Clean up requestAnimationFrame
   */
  protected cleanupRaf() {
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Check if animations should be enabled
   * Considers both visibility and motion preference
   */
  protected shouldAnimate(): boolean {
    return this.isVisible && !this.prefersReducedMotion;
  }
}
