import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ArchiveItem, ImageItem, WritingItem, SoundItem, CodeItem } from './archive-types.js';

/**
 * ARCHIVE CARD COMPONENT
 *
 * THEORETICAL GROUNDING:
 * Each card is a fragment—a piece that gestures toward wholeness without
 * claiming it. Following Russell's concept of the glitch as "an identity
 * that refuses to be pinned," the card presents content that invites
 * exploration rather than consumption.
 *
 * VISUAL METAPHOR:
 * The card is a window into the archive, with glitch effects at the boundary
 * suggesting the instability of categorization. Hover reveals chromatic
 * aberration, making visible the constructed nature of the frame.
 *
 * BEHAVIOR:
 * - Displays type-specific preview (image, excerpt, waveform, code icon)
 * - Subtle glitch effect on hover
 * - Footer shows type and date
 * - Click dispatches card-click event
 */
@customElement('archive-card')
export class ArchiveCard extends LitElement {
  @property({ type: Object })
  item?: ArchiveItem;

  @property({ type: Boolean, attribute: 'show-date' })
  showDate = true;

  @state()
  private isHovered = false;

  @state()
  private prefersReducedMotion = false;

  connectedCallback() {
    super.connectedCallback();
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  static styles = css`
    :host {
      display: block;
      --card-bg: var(--color-light, #faf8f5);
      --card-border: var(--color-muted, #e8e4df);
      --card-text: var(--color-dark, #2d2926);
      --card-secondary: var(--color-warm-gray, #7a756f);
      --glitch-cyan: #00d4ff;
      --glitch-magenta: #ff00ff;
    }

    .card {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      cursor: pointer;
      overflow: hidden;
      transition: border-color 0.2s ease;
    }

    .card:hover {
      border-color: var(--glitch-cyan);
    }

    .card:focus-visible {
      outline: 2px solid var(--glitch-cyan);
      outline-offset: 2px;
    }

    /* Glitch effect layers */
    .card::before,
    .card::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    .card::before {
      border: 1px solid var(--glitch-cyan);
      transform: translate(-2px, -1px);
    }

    .card::after {
      border: 1px solid var(--glitch-magenta);
      transform: translate(2px, 1px);
    }

    .card.hovered::before,
    .card.hovered::after {
      opacity: 0.6;
    }

    /* Preview area - fills available space */
    .preview {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      background: var(--card-border);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Image preview */
    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .card:hover .preview-image {
      transform: scale(1.02);
    }

    /* Writing preview */
    .preview-writing {
      padding: var(--space-4, 1rem);
      font-family: var(--font-mono, monospace);
      font-size: var(--text-sm, 0.875rem);
      line-height: 1.5;
      color: var(--card-text);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }

    /* Sound preview */
    .preview-sound {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-4, 1rem);
      gap: var(--space-2, 0.5rem);
    }

    .waveform {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
      height: 48px;
      width: 100%;
    }

    .waveform-bar {
      width: 3px;
      background: var(--card-secondary);
      border-radius: 1px;
      transition: background 0.2s ease;
    }

    .card:hover .waveform-bar {
      background: var(--glitch-cyan);
    }

    .duration {
      font-family: var(--font-mono, monospace);
      font-size: var(--text-xs, 0.75rem);
      color: var(--card-secondary);
    }

    /* Code preview */
    .preview-code {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-4, 1rem);
      gap: var(--space-2, 0.5rem);
    }

    .code-icon {
      font-size: 2rem;
      opacity: 0.6;
    }

    .code-language {
      font-family: var(--font-mono, monospace);
      font-size: var(--text-xs, 0.75rem);
      color: var(--card-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Content area */
    .content {
      padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
    }

    .title {
      font-family: var(--font-mono, monospace);
      font-size: var(--text-sm, 0.875rem);
      font-weight: 500;
      color: var(--card-text);
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Footer */
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
      border-top: 1px solid var(--card-border);
      font-family: var(--font-mono, monospace);
      font-size: var(--text-xs, 0.75rem);
      color: var(--card-secondary);
    }

    .type {
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .card::before,
      .card::after {
        display: none;
      }

      .preview-image,
      .card {
        transition: none;
      }
    }

    /* Mobile: disable chromatic aberration */
    @media (hover: none), (pointer: coarse) {
      .card::before,
      .card::after {
        display: none;
      }
    }
  `;

  render() {
    if (!this.item) {
      return html`<div class="card placeholder"></div>`;
    }

    return html`
      <div
        class="card ${this.isHovered && !this.prefersReducedMotion ? 'hovered' : ''}"
        role="button"
        tabindex="0"
        aria-label="${this.item.title}"
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
        @click=${this.handleClick}
        @keydown=${this.handleKeydown}
      >
        <div class="preview">${this.renderPreview()}</div>
        <div class="content">
          <h3 class="title">${this.item.title}</h3>
        </div>
        <div class="footer">
          <span class="type">${this.item.type}</span>
          ${this.showDate ? html`<span class="date">${this.formatDate(this.item.date)}</span>` : ''}
        </div>
      </div>
    `;
  }

  private renderPreview() {
    if (!this.item) return null;

    switch (this.item.type) {
      case 'image':
        return this.renderImagePreview(this.item);
      case 'writing':
        return this.renderWritingPreview(this.item);
      case 'sound':
        return this.renderSoundPreview(this.item);
      case 'code':
        return this.renderCodePreview(this.item);
    }
  }

  private renderImagePreview(item: ImageItem) {
    return html`
      <img
        class="preview-image"
        src="${item.thumbnail || item.src}"
        alt="${item.alt}"
        loading="lazy"
      />
    `;
  }

  private renderWritingPreview(item: WritingItem) {
    return html`<div class="preview-writing">${item.excerpt}</div>`;
  }

  private renderSoundPreview(item: SoundItem) {
    const waveform = item.waveform || this.generatePlaceholderWaveform();
    return html`
      <div class="preview-sound">
        <div class="waveform">
          ${waveform.map(
            (value) =>
              html`<div class="waveform-bar" style="height: ${Math.max(4, value * 48)}px"></div>`
          )}
        </div>
        <span class="duration">${this.formatDuration(item.duration)}</span>
      </div>
    `;
  }

  private renderCodePreview(item: CodeItem) {
    return html`
      <div class="preview-code">
        <span class="code-icon">{ }</span>
        ${item.language ? html`<span class="code-language">${item.language}</span>` : ''}
      </div>
    `;
  }

  private generatePlaceholderWaveform(): number[] {
    return Array.from({ length: 20 }, () => 0.2 + Math.random() * 0.6);
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  }

  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private handleMouseEnter() {
    this.isHovered = true;
  }

  private handleMouseLeave() {
    this.isHovered = false;
  }

  private handleClick() {
    if (this.item) {
      this.dispatchEvent(
        new CustomEvent('card-click', {
          detail: { item: this.item },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handleClick();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'archive-card': ArchiveCard;
  }
}
