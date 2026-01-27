import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

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
export class DitherCorruption extends LitElement {
  @property({ type: Number, attribute: 'corruption-level' })
  corruptionLevel = 0; // 0-1

  @property({ type: String, attribute: 'primary-color' })
  primaryColor = '#1a0a2e';

  @property({ type: String, attribute: 'corruption-color' })
  corruptionColor = '#ff006e';

  /**
   * Generate corrupting Bayer pattern
   * As corruption increases, pattern becomes chaotic
   */
  private generateCorruptingPattern(): string {
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

        // Corruption: randomize pattern based on corruption level
        const randomness = Math.random() * this.corruptionLevel;
        const corruptedValue = Math.max(
          0,
          Math.min(1, originalValue + randomness - this.corruptionLevel / 2)
        );

        // Color: blend between primary and corruption color
        const useCorruptionColor = Math.random() < this.corruptionLevel;
        const color = useCorruptionColor ? this.corruptionColor : this.primaryColor;

        svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" opacity="${corruptedValue}"/>`;
      }
    }

    svg += '</svg>';

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  static styles = css`
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
  `;

  render() {
    const pattern = this.generateCorruptingPattern();

    const spreadCount = Math.floor(this.corruptionLevel * 5);
    const spreads = Array.from({ length: spreadCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));

    return html`
      <div class="corruption-container" style="--primary-color: ${this.primaryColor}">
        <div class="dither-overlay" style="--dither-pattern: url('${pattern}')"></div>

        ${spreads.map(
          (spread) => html`
            <div
              class="corruption-spread"
              style="
              --corruption-color: ${this.corruptionColor};
              left: ${spread.x}%;
              top: ${spread.y}%;
              animation-delay: ${spread.delay}s;
            "
            ></div>
          `
        )}

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
