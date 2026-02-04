import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * GLITCH-WAVEFORM COMPONENT
 *
 * THEORETICAL GROUNDING:
 * Audio visualization as embodied presence - the waveform makes sound visible,
 * giving form to the ephemeral. Like glitch feminism's insistence on making
 * the invisible visible, this component materializes sonic experience.
 *
 * VISUAL METAPHOR:
 * - Warm bars = grounded presence, stability
 * - Ghost peaks = memory, trace of what was
 * - Chromatic aberration on hover = multiplicity of experience
 * - Dithered texture = liminal space between digital and analog
 *
 * BEHAVIOR:
 * - Connects to AnalyserNode for real-time frequency data
 * - Ghost peaks decay slowly for visual memory effect
 * - Subtle chromatic aberration on hover
 * - Respects prefers-reduced-motion (static bars)
 *
 * @example
 * ```html
 * <glitch-waveform bars="8" bar-height="24"></glitch-waveform>
 * ```
 */
@customElement('glitch-waveform')
export class GlitchWaveform extends LitElement {
  // ============================================
  // PUBLIC API
  // ============================================

  /** Number of bars to display */
  @property({ type: Number })
  bars = 8;

  /** Whether audio is currently playing */
  @property({ type: Boolean })
  playing = false;

  /** Height of bars in pixels */
  @property({ type: Number, attribute: 'bar-height' })
  barHeight = 24;

  /** Peak decay rate (0-1, higher = faster decay) */
  @property({ type: Number, attribute: 'peak-decay' })
  peakDecay = 0.02;

  // ============================================
  // INTERNAL STATE
  // ============================================

  /** Current bar levels (0-1) */
  @state()
  private barLevels: number[] = [];

  /** Ghost peak levels for each bar */
  @state()
  private peakLevels: number[] = [];

  /** Whether hovering (for chromatic effect) */
  @state()
  private isHovering = false;

  // ============================================
  // PRIVATE MEMBERS
  // ============================================

  /** Connected AnalyserNode */
  private analyser: AnalyserNode | null = null;

  /** Frequency data buffer */
  private frequencyData: Uint8Array | null = null;

  /** Animation frame ID */
  private rafId?: number;

  /** Last animation update timestamp */
  private lastUpdate = 0;

  /** Intersection observer for visibility tracking */
  private intersectionObserver?: IntersectionObserver;

  /** Whether component is visible in viewport */
  private isVisible = false;

  /** Whether user prefers reduced motion */
  private prefersReducedMotion = false;

  // ============================================
  // LIFECYCLE
  // ============================================

  connectedCallback() {
    super.connectedCallback();
    this.initializeLevels();
    this.detectCapabilities();
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.analyser = null;
    this.frequencyData = null;
    this.cleanupRaf();
    this.intersectionObserver?.disconnect();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('bars')) {
      this.initializeLevels();
    }
  }

  // ============================================
  // CAPABILITY DETECTION
  // ============================================

  private detectCapabilities(): void {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const wasVisible = this.isVisible;
        this.isVisible = entries[0]?.isIntersecting ?? false;
        if (wasVisible !== this.isVisible) {
          this.onVisibilityChange(this.isVisible);
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

  private onVisibilityChange(visible: boolean): void {
    if (visible && this.playing && !this.prefersReducedMotion) {
      this.startAnimationLoop();
    } else if (!visible) {
      this.cleanupRaf();
    }
  }

  // ============================================
  // ANIMATION LOOP
  // ============================================

  private startAnimationLoop(): void {
    if (this.rafId !== undefined) return;

    const loop = (timestamp: number) => {
      // Throttle to ~30fps
      if (timestamp - this.lastUpdate < 33) {
        this.rafId = requestAnimationFrame(loop);
        return;
      }
      this.lastUpdate = timestamp;

      const shouldContinue = this.updateVisualization();
      if (shouldContinue) {
        this.rafId = requestAnimationFrame(loop);
      } else {
        this.rafId = undefined;
      }
    };

    this.rafId = requestAnimationFrame(loop);
  }

  private cleanupRaf(): void {
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /**
   * Connect an AnalyserNode for real-time frequency data
   */
  connectAnalyser(analyser: AnalyserNode): void {
    this.analyser = analyser;
    this.frequencyData = new Uint8Array(analyser.frequencyBinCount);
  }

  /**
   * Disconnect the analyser
   */
  disconnectAnalyser(): void {
    this.analyser = null;
    this.frequencyData = null;
    this.resetLevels();
  }

  /**
   * Set bar levels manually (for testing or non-analyser use)
   */
  setLevels(levels: number[]): void {
    this.barLevels = levels.slice(0, this.bars);
    this.updatePeaks();
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private initializeLevels(): void {
    this.barLevels = new Array(this.bars).fill(0);
    this.peakLevels = new Array(this.bars).fill(0);
  }

  private resetLevels(): void {
    this.barLevels = this.barLevels.map(() => 0);
    this.peakLevels = this.peakLevels.map(() => 0);
  }

  /**
   * Animation callback - updates bar levels from analyser data
   */
  private updateVisualization(): boolean {
    if (!this.playing) {
      // Fade out bars when stopped
      this.barLevels = this.barLevels.map((level) => Math.max(0, level - 0.05));
      this.decayPeaks();
      return this.barLevels.some((level) => level > 0);
    }

    if (this.analyser && this.frequencyData) {
      this.analyser.getByteFrequencyData(this.frequencyData);
      this.updateBarsFromFrequencyData();
    } else {
      // Generate idle animation when no analyser connected
      this.generateIdleAnimation();
    }

    this.updatePeaks();
    return true;
  }

  private updateBarsFromFrequencyData(): void {
    if (!this.frequencyData) return;

    const binCount = this.frequencyData.length;
    const binsPerBar = Math.floor(binCount / this.bars);

    this.barLevels = Array.from({ length: this.bars }, (_, i) => {
      const start = i * binsPerBar;
      const end = start + binsPerBar;
      let sum = 0;
      for (let j = start; j < end && j < binCount; j++) {
        sum += this.frequencyData![j];
      }
      // Normalize to 0-1 range
      return sum / (binsPerBar * 255);
    });
  }

  private generateIdleAnimation(): void {
    const time = Date.now() / 1000;
    this.barLevels = Array.from({ length: this.bars }, (_, i) => {
      // Gentle wave pattern
      const phase = (i / this.bars) * Math.PI * 2;
      const wave1 = Math.sin(time * 0.5 + phase) * 0.3 + 0.3;
      const wave2 = Math.sin(time * 0.8 + phase * 1.5) * 0.2;
      return Math.max(0.1, Math.min(0.8, wave1 + wave2));
    });
  }

  private updatePeaks(): void {
    this.peakLevels = this.peakLevels.map((peak, i) => {
      const current = this.barLevels[i] ?? 0;
      if (current > peak) {
        return current;
      }
      return peak;
    });
  }

  private decayPeaks(): void {
    this.peakLevels = this.peakLevels.map((peak, i) => {
      const current = this.barLevels[i] ?? 0;
      if (current > peak) {
        return current;
      }
      return Math.max(current, peak - this.peakDecay);
    });
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  private handleMouseEnter(): void {
    this.isHovering = true;
  }

  private handleMouseLeave(): void {
    this.isHovering = false;
  }

  // ============================================
  // STYLES
  // ============================================

  static override styles = css`
    :host {
      display: inline-flex;
      align-items: flex-end;
      gap: 2px;
      height: var(--waveform-height, 24px);
    }

    .waveform-container {
      display: flex;
      align-items: flex-end;
      gap: var(--bar-gap, 2px);
      height: 100%;
      position: relative;
      width: 100%;
    }

    .bar-container {
      position: relative;
      width: var(--bar-width, 3px);
      flex: var(--bar-flex, 0 0 auto);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    /**
     * GHOST PEAK
     * Dithered texture represents memory/trace
     */
    .peak {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: var(--dither-warm, rgba(201, 168, 138, 0.3));
      opacity: 0.4;
      transition: height var(--duration-fast) ease-out;
    }

    /**
     * MAIN BAR
     * Warm tan color from F&B palette
     */
    .bar {
      position: relative;
      width: 100%;
      background: var(--color-tan, #c9a88a);
      transition: height var(--duration-fast) ease-out;
      min-height: 2px;
    }

    /**
     * CHROMATIC ABERRATION ON HOVER
     * Multiple simultaneous identities
     */
    .waveform-container.hovering .bar::before,
    .waveform-container.hovering .bar::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .waveform-container.hovering .bar::before {
      background: var(--glitch-cyan, #00ffff);
      transform: translateX(-1px);
      opacity: 0.3;
    }

    .waveform-container.hovering .bar::after {
      background: var(--glitch-magenta, #ff00ff);
      transform: translateX(1px);
      opacity: 0.3;
    }

    /**
     * PLAYING STATE
     * Subtle glow when active
     */
    :host([playing]) .bar {
      box-shadow: 0 0 4px var(--color-tan, #c9a88a);
    }

    /**
     * ACCESSIBILITY: Reduced Motion
     * Static bars, no chromatic effect
     */
    @media (prefers-reduced-motion: reduce) {
      .bar,
      .peak {
        transition: none;
      }

      .waveform-container.hovering .bar::before,
      .waveform-container.hovering .bar::after {
        display: none;
      }
    }
  `;

  // ============================================
  // RENDER
  // ============================================

  render() {
    // Start/stop animation based on playing state
    if (this.playing && this.isVisible && !this.prefersReducedMotion) {
      if (this.rafId === undefined) {
        this.startAnimationLoop();
      }
    }

    return html`
      <div
        class="waveform-container ${this.isHovering ? 'hovering' : ''}"
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
        role="img"
        aria-label="Audio waveform visualization"
      >
        ${this.barLevels.map(
          (level, i) => html`
            <div class="bar-container">
              <div class="peak" style="height: ${(this.peakLevels[i] ?? 0) * 100}%"></div>
              <div class="bar" style="height: ${Math.max(level * 100, 8)}%"></div>
            </div>
          `
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'glitch-waveform': GlitchWaveform;
  }
}
