import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BAYER_MATRIX_8, generateBayerSVG } from '../utils/bayer.js';
import { detectDeviceCapabilities } from '../utils/device.js';

/**
 * DITHERED-GLITCH-GRADIENT COMPONENT
 *
 * THEORETICAL GROUNDING:
 * Synthesizes PC-98 dithering (working within color constraints)
 * with glitch feminism (refusing those constraints).
 *
 * The dithering pattern is a technical adaptation to limitation.
 * When it glitches, the adaptation itself breaks down - showing
 * both the constraint and the refusal simultaneously.
 *
 * This embodies Lugones' concept of worldtraveling made visible:
 * The dither is the overworld (technical, constrained)
 * The glitch is the underworld (refusing, free)
 * Seeing them together is the act of traveling between worlds
 *
 * AESTHETIC INSPIRATION:
 * - PC-98's 16-color limitation requiring dithering
 * - Hyper Light Drifter's chromatic aberration on movement
 * - The beauty of technical constraint meeting political refusal
 *
 * VISUAL METAPHOR:
 * - Stable dither = working within imposed systems
 * - Glitching dither = the system breaking down
 * - Color separation = multiplicities visible within constraint
 * - Pattern corruption = even adaptation can be refused
 */
@customElement('dithered-glitch-gradient')
export class DitheredGlitchGradient extends LitElement {
  @property({ type: String })
  colorA = '#1a0a2e';

  @property({ type: String })
  colorB = '#7209b7';

  @property({ type: String })
  pattern: 'bayer' | 'floyd-steinberg' | 'ordered' = 'bayer';

  @property({ type: String })
  direction: 'horizontal' | 'vertical' | 'diagonal' = 'vertical';

  @property({ type: Number })
  glitchIntensity = 0.5;

  @state()
  private isGlitching = false;

  @state()
  private glitchOffset = { x: 0, y: 0 };

  private rafId?: number;
  private lastUpdate = 0;
  private intersectionObserver?: IntersectionObserver;
  private isVisible = false;
  private prefersReducedMotion = false;
  private isMobile = false;

  private config = {
    updateInterval: 50, // 20fps
  };

  /** Cached pattern data URIs keyed by pattern type */
  private cachedPatterns = new Map<string, string>();

  protected willUpdate(changedProperties: PropertyValues) {
    // Invalidate cached patterns when pattern type changes
    if (changedProperties.has('pattern')) {
      this.cachedPatterns.clear();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.detectDeviceCapabilities();
    this.applyDeviceOptimizations();
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
    this.intersectionObserver?.disconnect();
  }

  private detectDeviceCapabilities() {
    const capabilities = detectDeviceCapabilities();
    this.isMobile = capabilities.isMobile;
    this.prefersReducedMotion = capabilities.prefersReducedMotion;
  }

  private applyDeviceOptimizations() {
    if (this.isMobile) {
      this.config.updateInterval = 100; // 10fps on mobile
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
      this.intersectionObserver?.observe(this);
    });
  }

  private startGlitch() {
    if (this.rafId) return;
    if (!this.isVisible) return;
    if (this.prefersReducedMotion) return;

    this.isGlitching = true;
    this.lastUpdate = 0;

    const glitchLoop = (timestamp: number) => {
      // Throttle to target frame rate
      if (timestamp - this.lastUpdate < this.config.updateInterval) {
        this.rafId = requestAnimationFrame(glitchLoop);
        return;
      }

      this.lastUpdate = timestamp;
      this.glitchOffset = {
        x: (Math.random() - 0.5) * 8 * this.glitchIntensity,
        y: (Math.random() - 0.5) * 8 * this.glitchIntensity,
      };

      this.requestUpdate();
      this.rafId = requestAnimationFrame(glitchLoop);
    };

    this.rafId = requestAnimationFrame(glitchLoop);
  }

  private stopGlitch() {
    this.cleanup();
    this.glitchOffset = { x: 0, y: 0 };
  }

  private cleanup() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
    this.isGlitching = false;
  }

  /**
   * Get pattern data URI, using cache to avoid regenerating SVG every frame.
   * Patterns only depend on the pattern type (bayer vs floyd-steinberg),
   * not on glitch offset, so they can be cached across glitch frames.
   */
  private getPatternDataUri(): string {
    const key = this.pattern === 'floyd-steinberg' ? 'floyd-steinberg' : 'bayer';
    let cached = this.cachedPatterns.get(key);
    if (!cached) {
      cached = key === 'floyd-steinberg'
        ? this.generateFloydSteinbergPattern()
        : generateBayerSVG('black', BAYER_MATRIX_8);
      this.cachedPatterns.set(key, cached);
    }
    return cached;
  }

  /**
   * Generate Floyd-Steinberg style error diffusion pattern
   */
  private generateFloydSteinbergPattern(): string {
    const size = 16;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">`;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const value = (x * 7 + y * 13) % 256;
        const opacity = value / 256;
        svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="black" opacity="${opacity}"/>`;
      }
    }

    svg += '</svg>';

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
    }

    .gradient-container {
      position: relative;
      width: 100%;
      height: 100%;

      /* CRITICAL: Pixel rendering for dither visibility */
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      -ms-interpolation-mode: nearest-neighbor;
    }

    /**
     * BASE GRADIENT LAYER
     */
    .gradient-base {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        var(--gradient-direction, to bottom),
        var(--color-a) 0%,
        var(--color-b) 100%
      );
    }

    /**
     * DITHER PATTERN LAYER
     * PC-98 style ordered pattern
     */
    .dither-layer {
      position: absolute;
      inset: 0;
      background-image: var(--dither-pattern);
      background-size: var(--dither-size, 8px 8px);
      background-repeat: repeat;
      mix-blend-mode: multiply;
      transform: translate(var(--glitch-x, 0), var(--glitch-y, 0));
    }

    /**
     * CHROMATIC SEPARATION LAYERS
     * HLD-inspired color splitting using glitch feminist palette
     */
    .chroma-layer {
      position: absolute;
      inset: 0;
      background-image: var(--dither-pattern);
      background-size: var(--dither-size, 8px 8px);
      opacity: 0;
      mix-blend-mode: screen;
      pointer-events: none;
    }

    .chroma-magenta {
      background-color: var(--glitch-magenta, #ff00ff);
      transform: translate(2px, 2px);
    }

    .chroma-cyan {
      background-color: var(--glitch-cyan, #00ffff);
      transform: translate(-2px, -2px);
    }

    .chroma-pink {
      background-color: var(--glitch-pink, #ff6b9d);
      transform: translate(2px, -2px);
    }

    .chroma-green {
      background-color: var(--glitch-lime, #b4ff9f);
      transform: translate(-2px, 2px);
    }

    :host([is-glitching]) .chroma-layer {
      opacity: 0.4;
      animation: chroma-flicker 0.1s steps(2) infinite;
    }

    /**
     * PATTERN CORRUPTION
     * Dither itself becomes unstable
     */
    :host([is-glitching]) .dither-layer {
      animation: pattern-corrupt 0.2s steps(4) infinite;
    }

    @keyframes chroma-flicker {
      0%,
      50% {
        opacity: 0.4;
      }
      51%,
      100% {
        opacity: 0.3;
      }
    }

    @keyframes pattern-corrupt {
      0% {
        background-size: 8px 8px;
        transform: translate(var(--glitch-x), var(--glitch-y));
      }
      25% {
        background-size: 7px 9px;
        transform: translate(calc(var(--glitch-x) + 1px), calc(var(--glitch-y) - 1px));
      }
      50% {
        background-size: 9px 7px;
        transform: translate(calc(var(--glitch-x) - 1px), calc(var(--glitch-y) + 1px));
      }
      75% {
        background-size: 8px 8px;
        transform: translate(calc(var(--glitch-x) + 0.5px), calc(var(--glitch-y) - 0.5px));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .chroma-layer,
      .dither-layer {
        animation: none !important;
      }

      :host([is-glitching]) .chroma-layer {
        opacity: 0.2;
      }
    }
  `;

  render() {
    const directions = {
      horizontal: 'to right',
      vertical: 'to bottom',
      diagonal: 'to bottom right',
    };

    const patternUri = this.getPatternDataUri();

    return html`
      <div
        class="gradient-container"
        style="
          --color-a: ${this.colorA};
          --color-b: ${this.colorB};
          --gradient-direction: ${directions[this.direction]};
          --dither-pattern: url('${patternUri}');
          --glitch-x: ${this.glitchOffset.x}px;
          --glitch-y: ${this.glitchOffset.y}px;
        "
        @mouseenter=${this.startGlitch}
        @mouseleave=${this.stopGlitch}
      >
        <div class="gradient-base"></div>
        <div class="dither-layer"></div>

        ${this.isGlitching
          ? html`
              <div class="chroma-layer chroma-magenta"></div>
              <div class="chroma-layer chroma-cyan"></div>
              <div class="chroma-layer chroma-pink"></div>
              <div class="chroma-layer chroma-green"></div>
            `
          : ''}

        <slot></slot>
      </div>
    `;
  }

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
    'dithered-glitch-gradient': DitheredGlitchGradient;
  }
}
