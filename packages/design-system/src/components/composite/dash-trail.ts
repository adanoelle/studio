import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

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
 * @example
 * ```html
 * <dash-trail trail-length="8">
 *   <div>Content that leaves trails on move</div>
 * </dash-trail>
 * ```
 */
@customElement('dash-trail')
export class DashTrail extends LitElement {
  @property({ type: Number, attribute: 'trail-length' })
  trailLength = 5;

  @state()
  private positions: Array<{ x: number; y: number; age: number }> = [];

  private rafId?: number;
  private lastPos = { x: 0, y: 0 };

  connectedCallback() {
    super.connectedCallback();
    this.trackMovement();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  private trackMovement() {
    const track = () => {
      const rect = this.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const distance = Math.hypot(x - this.lastPos.x, y - this.lastPos.y);

      if (distance > 5) {
        this.positions = [
          { x, y, age: 0 },
          ...this.positions.map((p) => ({ ...p, age: p.age + 1 })),
        ].slice(0, this.trailLength);

        this.lastPos = { x, y };
        this.requestUpdate();
      }

      this.rafId = requestAnimationFrame(track);
    };

    track();
  }

  static styles = css`
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
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
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
  `;

  render() {
    return html`
      ${this.positions.map((pos) => {
        const opacity = 1 - pos.age / this.trailLength;
        const scale = 1 - (pos.age / this.trailLength) * 0.5;

        return html`
          <div
            class="trail-ghost"
            style="
              left: ${pos.x}px;
              top: ${pos.y}px;
              opacity: ${opacity};
              transform: translate(-50%, -50%) scale(${scale});
            "
          >
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
