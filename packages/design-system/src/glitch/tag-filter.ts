import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * TAG FILTER COMPONENT
 *
 * THEORETICAL GROUNDING:
 * Tags refuse the hierarchy of categories. Following Russell's assertion that
 * the glitch "rejects the binary," tag filtering presents multiple axes of
 * relation without privileging one over another. Items can belong to many
 * tags—multiplicity as ontology.
 *
 * VISUAL METAPHOR:
 * Pills arranged horizontally echo the form of hyperlinks and hashtags—
 * networked navigation rather than tree-structured menus. The active state
 * uses cyan underline, connecting to the glitch aesthetic without overwhelming.
 *
 * BEHAVIOR:
 * - Horizontal scrolling on mobile
 * - "all" tag always first
 * - Active state with cyan underline
 * - Click dispatches tag-select event
 */
@customElement('tag-filter')
export class TagFilter extends LitElement {
  @property({ type: Array })
  tags: string[] = [];

  @property({ type: String })
  active: string | null = null;

  static styles = css`
    :host {
      display: block;
      --tag-text: var(--color-dark, #2d2926);
      --tag-secondary: var(--color-warm-gray, #7a756f);
      --tag-border: var(--color-muted, #e8e4df);
      --glitch-cyan: #00d4ff;
    }

    .filter-bar {
      display: flex;
      gap: var(--space-2, 0.5rem);
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding-bottom: var(--space-2, 0.5rem);
    }

    .filter-bar::-webkit-scrollbar {
      display: none;
    }

    .tag {
      flex-shrink: 0;
      background: none;
      border: none;
      font-family: var(--font-mono, monospace);
      font-size: var(--text-sm, 0.875rem);
      color: var(--tag-secondary);
      padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
      cursor: pointer;
      position: relative;
      transition: color 0.15s ease;
    }

    .tag:hover {
      color: var(--tag-text);
    }

    .tag:focus-visible {
      outline: 2px solid var(--glitch-cyan);
      outline-offset: 2px;
    }

    .tag.active {
      color: var(--tag-text);
    }

    /* Active underline */
    .tag::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: var(--space-3, 0.75rem);
      right: var(--space-3, 0.75rem);
      height: 2px;
      background: var(--glitch-cyan);
      transform: scaleX(0);
      transition: transform 0.15s ease;
    }

    .tag.active::after {
      transform: scaleX(1);
    }

    /* Mobile: ensure touch targets */
    @media (pointer: coarse) {
      .tag {
        min-height: 44px;
        display: flex;
        align-items: center;
      }
    }
  `;

  render() {
    return html`
      <nav class="filter-bar" role="navigation" aria-label="Filter by tag">
        <button
          class="tag ${this.active === null ? 'active' : ''}"
          @click=${() => this.selectTag(null)}
          aria-pressed="${this.active === null}"
        >
          all
        </button>
        ${this.tags.map(
          (tag) => html`
            <button
              class="tag ${this.active === tag ? 'active' : ''}"
              @click=${() => this.selectTag(tag)}
              aria-pressed="${this.active === tag}"
            >
              ${tag}
            </button>
          `
        )}
      </nav>
    `;
  }

  private selectTag(tag: string | null) {
    this.dispatchEvent(
      new CustomEvent('tag-select', {
        detail: { tag },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'tag-filter': TagFilter;
  }
}
