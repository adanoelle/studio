import { html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { GlitchBase } from './glitch-base.js';

/**
 * DITHER-CORRUPTION COMPONENT
 *
 * THEORETICAL GROUNDING:
 * The dither pattern itself becomes the site of corruption.
 *
 * Ordered dithering is an IMPOSED PATTERN - a technical solution
 * that creates order from limitation. When it corrupts, the
 * pattern breaks down into organic chaos, refusing even its
 * own adaptive logic.
 *
 * Inspired by Hyper Light Drifter's spreading pink corruption,
 * but applied to the dithering technique itself - the constraint
 * AND the adaptation both become sites of glitching.
 *
 * PERFORMANCE:
 * - Memoizes pattern generation to prevent flickering
 * - Only regenerates pattern when corruption level changes
 * - Uses IntersectionObserver to pause animations when off-screen
 * - Respects prefers-reduced-motion preference
 *
 * ACCESSIBILITY:
 * - Respects prefers-reduced-motion by disabling pulse animation
 * - Corruption spread animation disabled for reduced motion
 *
 * @example
 * ```html
 * <dither-corruption
 *   corruption-level="0.5"
 *   primary-color="#1a0a2e"
 *   corruption-color="#ff006e"
 * >
 *   <p>Content being corrupted</p>
 * </dither-corruption>
 * ```
 */
@customElement('dither-corruption')
export class DitherCorruption extends GlitchBase {
  // ============================================
  // PUBLIC API
  // ============================================

  /** Corruption level from 0 (none) to 1 (maximum) */
  @property({ type: Number, attribute: 'corruption-level' })
  corruptionLevel = 0;

  /** Base color for the dither pattern */
  @property({ type: String, attribute: 'primary-color' })
  primaryColor = '#1a0a2e';

  /** Color of the corruption effect */
  @property({ type: String, attribute: 'corruption-color' })
  corruptionColor = '#ff006e';

  // ============================================
  // INTERNAL STATE
  // ============================================

  /** Cached SVG pattern data URL */
  @state()
  private cachedPattern = '';

  /** Cached spread positions (memoized) */
  @state()
  private spreadPositions: Array<{ x: number; y: number; delay: number }> = [];

  /** Last corruption level used for pattern generation */
  private lastCorruptionLevel = -1;

  /** Random seed for deterministic pattern generation */
  private patternSeed = 0;

  // ============================================
  // LIFECYCLE
  // ============================================

  connectedCallback() {
    super.connectedCallback();

    // Generate initial seed
    this.patternSeed = Math.random() * 10000;

    // Generate initial pattern
    this.updatePattern();
    this.updateSpreadPositions();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    // Only regenerate pattern when relevant properties change
    if (
      changedProperties.has('corruptionLevel') ||
      changedProperties.has('primaryColor') ||
      changedProperties.has('corruptionColor')
    ) {
      this.updatePattern();
    }

    if (changedProperties.has('corruptionLevel')) {
      this.updateSpreadPositions();
    }
  }

  // ============================================
  // PATTERN GENERATION
  // ============================================

  /**
   * Seeded random number generator for deterministic patterns
   * Same seed + same inputs = same pattern (no flickering)
   */
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Update the cached pattern
   * Only regenerates if corruption level has changed significantly
   */
  private updatePattern() {
    // Quantize corruption level to reduce regeneration frequency
    const quantizedLevel = Math.round(this.corruptionLevel * 20) / 20;

    if (quantizedLevel === this.lastCorruptionLevel) {
      return;
    }

    this.lastCorruptionLevel = quantizedLevel;
    this.cachedPattern = this.generateCorruptingPattern(quantizedLevel);
  }

  /**
   * Generate corrupting Bayer pattern
   * As corruption increases, pattern becomes chaotic
   *
   * @param level - Quantized corruption level
   */
  private generateCorruptingPattern(level: number): string {
    const size = 8;
    const matrix = [
      [0, 32, 8, 40, 2, 34, 10, 42],
      [48, 16, 56, 24, 50, 18, 58, 26],
      [12, 44, 4, 36, 14, 46, 6, 38],
      [60, 28, 52, 20, 62, 30, 54, 22],
      [3, 35, 11, 43, 1, 33, 9, 41],
      [51, 19, 59, 27, 49, 17, 57, 25],
      [15, 47, 7, 39, 13, 45, 5, 37],
      [63, 31, 55, 23, 61, 29, 53, 21],
    ];

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">`;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const originalValue = matrix[y][x] / 64;

        // Use seeded random for deterministic corruption
        const cellSeed = this.patternSeed + y * size + x;
        const randomness = this.seededRandom(cellSeed) * level;
        const corruptedValue = Math.max(0, Math.min(1, originalValue + randomness - level / 2));

        // Color: blend between primary and corruption color
        const colorSeed = this.patternSeed + y * size + x + 1000;
        const useCorruptionColor = this.seededRandom(colorSeed) < level;
        const color = useCorruptionColor ? this.corruptionColor : this.primaryColor;

        svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" opacity="${corruptedValue}"/>`;
      }
    }

    svg += '</svg>';

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  /**
   * Update spread positions based on corruption level
   * Memoized to prevent constant regeneration
   */
  private updateSpreadPositions() {
    const spreadCount = Math.floor(this.corruptionLevel * 5);

    // Only regenerate if count changed
    if (spreadCount === this.spreadPositions.length) {
      return;
    }

    this.spreadPositions = Array.from({ length: spreadCount }, (_, i) => ({
      x: this.seededRandom(this.patternSeed + i * 100) * 100,
      y: this.seededRandom(this.patternSeed + i * 100 + 50) * 100,
      delay: this.seededRandom(this.patternSeed + i * 100 + 25) * 3,
    }));
  }

  // ============================================
  // STYLES
  // ============================================

  static override styles = css`
    :host {
      display: block;
      position: relative;
    }

    .corruption-container {
      position: relative;
      background: var(--primary-color);
      image-rendering: pixelated;
    }

    /**
     * CORRUPTING DITHER OVERLAY
     */
    .dither-overlay {
      position: absolute;
      inset: 0;
      background-image: var(--dither-pattern);
      background-size: 8px 8px;
      mix-blend-mode: overlay;
      animation: corruption-pulse 2s ease-in-out infinite;
    }

    @keyframes corruption-pulse {
      0%,
      100% {
        opacity: 0.8;
      }
      50% {
        opacity: 1;
      }
    }

    /**
     * SPREADING CORRUPTION
     * Organic growth from random points
     */
    .corruption-spread {
      position: absolute;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, var(--corruption-color) 0%, transparent 70%);
      mix-blend-mode: screen;
      animation: spread 3s ease-out infinite;
      pointer-events: none;
      will-change: transform, opacity;
    }

    @keyframes spread {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        opacity: 0.6;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }

    /**
     * ACCESSIBILITY: Reduced Motion
     * Disable animations for users who prefer reduced motion
     */
    @media (prefers-reduced-motion: reduce) {
      .dither-overlay {
        animation: none;
        opacity: 0.9;
      }

      .corruption-spread {
        animation: none;
        transform: scale(1);
        opacity: 0.3;
      }
    }
  `;

  // ============================================
  // RENDER
  // ============================================

  render() {
    const containerStyles = styleMap({
      '--primary-color': this.primaryColor,
    });

    const overlayStyles = styleMap({
      '--dither-pattern': `url('${this.cachedPattern}')`,
    });

    return html`
      <div class="corruption-container" style=${containerStyles}>
        <div class="dither-overlay" style=${overlayStyles}></div>

        ${this.spreadPositions.map((spread) => {
          const spreadStyles = styleMap({
            '--corruption-color': this.corruptionColor,
            left: `${spread.x}%`,
            top: `${spread.y}%`,
            animationDelay: `${spread.delay}s`,
          });

          return html` <div class="corruption-spread" style=${spreadStyles}></div> `;
        })}

        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dither-corruption': DitherCorruption;
  }
}
