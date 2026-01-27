import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * HOLOGRAPHIC-UI COMPONENT
 *
 * THEORETICAL GROUNDING:
 * Inspired by Hyper Light Drifter's semi-transparent, flickering UI.
 * Represents the instability of digital identity.
 *
 * Not solid/permanent, but ephemeral and shifting.
 * Information exists in multiple states simultaneously - visible
 * yet translucent, stable yet flickering, present yet ghostly.
 *
 * Embodies Russell's concept of digital identity as unstable,
 * multiple, and resistant to singular representation.
 *
 * AESTHETIC INSPIRATION:
 * - HLD's holographic interface elements
 * - Scan line effects from CRT displays
 * - Chromatic aberration on UI edges
 * - Subtle brightness fluctuation
 */
@customElement('holographic-ui')
export class HolographicUI extends LitElement {
  @property({ type: Boolean })
  flickering = true;

  @property({ type: Number })
  scanSpeed = 2; // seconds

  @property({ type: String })
  borderColor = '#00ffff'; // Cyan default

  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    .holo-container {
      position: relative;
      background: rgba(10, 14, 26, 0.8);
      border: 2px solid var(--border-color, #00ffff);
      box-shadow:
        0 0 10px var(--border-glow, rgba(0, 255, 255, 0.3)),
        inset 0 0 10px var(--border-glow-inner, rgba(0, 255, 255, 0.1));

      image-rendering: pixelated;
    }

    /**
     * SCAN LINE EFFECT
     * Moving horizontal line like HLD's holograms
     */
    .holo-container::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        transparent 45%,
        var(--scan-color-dim, rgba(0, 255, 255, 0.3)) 49%,
        var(--scan-color-bright, rgba(0, 255, 255, 0.8)) 50%,
        var(--scan-color-dim, rgba(0, 255, 255, 0.3)) 51%,
        transparent 55%,
        transparent 100%
      );
      animation: scan-line var(--scan-speed, 2s) linear infinite;
      pointer-events: none;
      mix-blend-mode: screen;
    }

    /**
     * STATIC FLICKER
     * Random brightness fluctuation
     */
    .holo-container.flickering {
      animation: holo-flicker 0.1s steps(1) infinite;
    }

    /**
     * CHROMATIC ABERRATION ON EDGES
     * Magenta ghost border offset slightly
     */
    .holo-container::after {
      content: '';
      position: absolute;
      inset: -2px;
      border: 2px solid var(--glitch-magenta, #ff00ff);
      opacity: 0.3;
      transform: translate(1px, 1px);
      pointer-events: none;
    }

    .holo-content {
      position: relative;
      z-index: 1;
      padding: var(--space-4, 16px);
      color: var(--border-color, #00ffff);
      font-family: var(--font-overworld-pixel);
      text-shadow: 0 0 4px var(--border-glow, rgba(0, 255, 255, 0.5));
    }

    @keyframes scan-line {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(200%);
      }
    }

    @keyframes holo-flicker {
      0%,
      80%,
      100% {
        opacity: 1;
      }
      85% {
        opacity: 0.8;
      }
      90% {
        opacity: 0.9;
      }
      95% {
        opacity: 0.85;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .holo-container::before {
        animation: none;
      }

      .holo-container.flickering {
        animation: none;
      }
    }
  `;

  render() {
    return html`
      <div
        class="holo-container ${this.flickering ? 'flickering' : ''}"
        style="
          --scan-speed: ${this.scanSpeed}s;
          --border-color: ${this.borderColor};
          --border-glow: ${this.borderColor}80;
          --border-glow-inner: ${this.borderColor}1a;
          --scan-color-dim: ${this.borderColor}4d;
          --scan-color-bright: ${this.borderColor}cc;
        "
      >
        <div class="holo-content">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'holographic-ui': HolographicUI;
  }
}
