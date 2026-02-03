import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ArchiveItem } from './archive-types.js';
import './archive-card.js';

/**
 * ARCHIVE GRID COMPONENT
 *
 * THEORETICAL GROUNDING:
 * The grid presents multiplicity without hierarchy—each item occupies equal
 * space, refusing the ranking logic of algorithmic feeds. Following Lugones'
 * concept of "worldtraveling," the grid is a site of encounter where different
 * works exist in proximity without forced coherence.
 *
 * VISUAL METAPHOR:
 * A 3-column grid evokes the rhythm of a gallery wall—structured enough to
 * provide orientation, open enough to allow wandering. Pagination with
 * "prev/next" echoes flipping through pages of a zine or journal.
 *
 * TEMPORAL VIEW (horizontal):
 * Uses a horizontal axis to resist doomscroll patterns. Items flow
 * left-to-right with soft year markers that create boundary and liminality—
 * acknowledging time's passage without insisting on hard edges. Work from
 * adjacent years can exist in the same breath. This embodies queer
 * temporality—time as gradient, not discrete containers.
 *
 * BEHAVIOR:
 * - Fixed 3-column layout (2 rows visible = 6 items per page)
 * - Prev/Next pagination with page indicator
 * - Placeholder cells for incomplete pages
 * - Supports grid and temporal view modes
 */
@customElement('archive-grid')
export class ArchiveGrid extends LitElement {
  @property({ type: Array })
  items: ArchiveItem[] = [];

  @property({ type: Number, attribute: 'page-size' })
  pageSize = 6;

  @property({ type: Number })
  page = 1;

  @property({ type: String })
  view: 'grid' | 'temporal' = 'grid';

  @state()
  private totalPages = 1;

  @state()
  private currentYear: number | null = null;

  // Used to track the temporal container for scroll handling
  private _temporalContainer: HTMLElement | null = null;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      --grid-columns: 3;
      --grid-rows: 2;
      --grid-gap: var(--space-4, 1rem);
      --card-text: var(--color-dark, #2d2926);
      --card-secondary: var(--color-warm-gray, #7a756f);
      --card-border: var(--color-muted, #e8e4df);
      --glitch-cyan: #00d4ff;
    }

    /* Grid view - fills available space, cards size to fit */
    .grid {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: repeat(var(--grid-columns), 1fr);
      grid-template-rows: repeat(var(--grid-rows), 1fr);
      gap: var(--grid-gap);
    }

    /* Temporal view - horizontal continuous strip, vertically centered */
    .temporal-horizontal {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: row;
      gap: var(--space-3, 0.75rem);
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      align-items: center;
      padding: var(--space-6, 1.5rem) var(--space-4, 1rem);
      position: relative;
      /* Hide scrollbar - navigation is intentional */
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .temporal-horizontal::-webkit-scrollbar {
      display: none;
    }

    /* Year marker - floating label above the stream */
    .year-marker {
      position: absolute;
      top: var(--space-2, 0.5rem);
      font-family: var(--font-mono, monospace);
      font-size: var(--text-sm, 0.875rem);
      font-weight: 500;
      color: var(--card-secondary);
      padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
      background: var(--bg-primary, #faf7f2);
      z-index: 10;
      pointer-events: none;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }

    .year-marker.active {
      opacity: 1;
      color: var(--card-text);
    }

    /* Year boundary - subtle visual separator */
    .year-boundary {
      flex-shrink: 0;
      width: 1px;
      height: 280px;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        var(--card-border) 20%,
        var(--card-border) 80%,
        transparent 100%
      );
      margin: 0 var(--space-2, 0.5rem);
      opacity: 0.5;
    }

    /* Card wrapper for temporal view - fixed dimensions, centered */
    .temporal-card {
      flex-shrink: 0;
      width: 280px;
      height: 320px;
      display: flex;
    }

    .temporal-card archive-card {
      flex: 1;
      width: 100%;
      height: 100%;
    }

    /* Position indicator */
    .position-indicator {
      position: absolute;
      bottom: var(--space-2, 0.5rem);
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: var(--space-3, 0.75rem);
      font-family: var(--font-mono, monospace);
      font-size: var(--text-xs, 0.75rem);
      color: var(--card-secondary);
      background: var(--bg-primary, #faf7f2);
      padding: var(--space-1, 0.25rem) var(--space-3, 0.75rem);
      border-radius: var(--radius-sm, 2px);
      z-index: 10;
    }

    .position-indicator button {
      background: none;
      border: none;
      font-family: inherit;
      font-size: inherit;
      color: var(--card-secondary);
      cursor: pointer;
      padding: var(--space-1, 0.25rem);
      transition: color 0.15s ease;
    }

    .position-indicator button:hover {
      color: var(--glitch-cyan);
    }

    .position-indicator button:focus-visible {
      outline: 2px solid var(--glitch-cyan);
      outline-offset: 1px;
    }

    .position-indicator .current-year {
      min-width: 4ch;
      text-align: center;
    }

    /* Year jump buttons in position indicator */
    .year-nav {
      display: flex;
      gap: var(--space-2, 0.5rem);
    }

    .year-nav button {
      opacity: 0.6;
      transition: opacity 0.15s ease, color 0.15s ease;
    }

    .year-nav button:hover {
      opacity: 1;
    }

    /* Placeholder cell - fills grid cell */
    .placeholder {
      background: var(--card-border);
      opacity: 0.3;
    }

    /* Pagination - fixed at bottom, no scroll needed */
    .pagination {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--space-4, 1rem);
      padding-top: var(--space-4, 1rem);
      font-family: var(--font-mono, monospace);
      font-size: var(--text-sm, 0.875rem);
      color: var(--card-secondary);
    }

    .pagination button {
      background: none;
      border: 1px solid var(--card-border);
      color: var(--card-text);
      font-family: var(--font-mono, monospace);
      font-size: var(--text-sm, 0.875rem);
      padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
      cursor: pointer;
      transition: border-color 0.2s ease, color 0.2s ease;
    }

    .pagination button:hover:not(:disabled) {
      border-color: var(--glitch-cyan);
      color: var(--glitch-cyan);
    }

    .pagination button:focus-visible {
      outline: 2px solid var(--glitch-cyan);
      outline-offset: 2px;
    }

    .pagination button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-info {
      min-width: 5rem;
      text-align: center;
    }

    /* Empty state */
    .empty {
      text-align: center;
      padding: var(--space-12, 3rem);
      font-family: var(--font-mono, monospace);
      color: var(--card-secondary);
    }

    /* Mobile: single column grid, narrower temporal cards */
    @media (max-width: 768px) {
      :host {
        --grid-columns: 1;
      }

      .temporal-card {
        width: 220px;
        height: 260px;
      }

      .year-boundary {
        height: 220px;
      }

      .position-indicator {
        flex-direction: column;
        gap: var(--space-2, 0.5rem);
      }

      .year-nav {
        flex-wrap: wrap;
        justify-content: center;
      }
    }

    /* Tablet: 2 columns */
    @media (min-width: 769px) and (max-width: 1024px) {
      :host {
        --grid-columns: 2;
      }

      .temporal-card {
        width: 250px;
        height: 300px;
      }

      .year-boundary {
        height: 260px;
      }
    }

    /* Reduced motion: disable smooth scrolling */
    @media (prefers-reduced-motion: reduce) {
      .temporal-horizontal {
        scroll-behavior: auto;
      }
    }
  `;

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('items') || changedProperties.has('pageSize')) {
      this.totalPages = Math.max(
        1,
        Math.ceil(this.items.length / this.pageSize)
      );
      // Ensure page is within bounds
      if (this.page > this.totalPages) {
        this.page = this.totalPages;
      }
    }

    // Initialize temporal view: set current year and scroll to present (right)
    if (changedProperties.has('view') && this.view === 'temporal') {
      this.initializeTemporalView();
    }
  }

  private initializeTemporalView() {
    // Set initial year from most recent item
    if (this.items.length > 0 && this.currentYear === null) {
      const sortedDates = this.items
        .map((item) => new Date(item.date).getFullYear())
        .sort((a, b) => b - a);
      this.currentYear = sortedDates[0];
    }

    // Scroll to the right (present) after render
    requestAnimationFrame(() => {
      const container = this.renderRoot.querySelector(
        '.temporal-horizontal'
      ) as HTMLElement;
      if (container) {
        this._temporalContainer = container;
        container.scrollTo({ left: container.scrollWidth, behavior: 'auto' });
      }
    });
  }

  render() {
    if (this.items.length === 0) {
      return html`<div class="empty">No items found</div>`;
    }

    return html`
      ${this.view === 'grid' ? this.renderGridView() : this.renderTemporalView()}
      ${this.view === 'grid' ? this.renderPagination() : ''}
    `;
  }

  private renderGridView() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pageItems = this.items.slice(start, end);

    // Fill with placeholders if incomplete page
    const placeholderCount = this.pageSize - pageItems.length;

    return html`
      <div class="grid">
        ${pageItems.map(
          (item) =>
            html`<archive-card
              .item=${item}
              @card-click=${this.handleCardClick}
            ></archive-card>`
        )}
        ${Array.from(
          { length: placeholderCount },
          () => html`<div class="placeholder"></div>`
        )}
      </div>
    `;
  }

  private renderTemporalView() {
    // Sort items by date ascending (oldest on left, newest on right)
    const sortedItems = [...this.items].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Build year boundaries: track where each year starts
    const yearBoundaries: { year: number; index: number }[] = [];
    let lastYear: number | null = null;

    sortedItems.forEach((item, index) => {
      const year = new Date(item.date).getFullYear();
      if (year !== lastYear) {
        yearBoundaries.push({ year, index });
        lastYear = year;
      }
    });

    // Calculate year range for the indicator
    const years = yearBoundaries.map((b) => b.year);
    const startYear = years[0] ?? new Date().getFullYear();
    const endYear = years[years.length - 1] ?? startYear;

    // Build the timeline with items and year boundaries interleaved
    const timelineElements: Array<{
      type: 'card' | 'boundary';
      item?: ArchiveItem;
      year?: number;
      isFirst?: boolean;
    }> = [];

    sortedItems.forEach((item, index) => {
      const boundary = yearBoundaries.find((b) => b.index === index);
      if (boundary) {
        // Add year boundary before this item (except for first year)
        if (index > 0) {
          timelineElements.push({ type: 'boundary', year: boundary.year });
        }
      }
      timelineElements.push({ type: 'card', item });
    });

    return html`
      <div
        class="temporal-horizontal"
        @scroll=${this.handleTemporalScroll}
        @keydown=${this.handleTemporalKeydown}
        tabindex="0"
        role="region"
        aria-label="Timeline view, use arrow keys to navigate"
      >
        <!-- Floating year marker -->
        <div class="year-marker ${this.currentYear ? 'active' : ''}">
          ${this.currentYear ?? startYear}
        </div>

        ${timelineElements.map((el) =>
          el.type === 'boundary'
            ? html`<div
                class="year-boundary"
                data-year="${el.year}"
                aria-hidden="true"
              ></div>`
            : html`<div class="temporal-card" data-year="${new Date(el.item!.date).getFullYear()}">
                <archive-card
                  .item=${el.item!}
                  @card-click=${this.handleCardClick}
                ></archive-card>
              </div>`
        )}
      </div>

      <!-- Position indicator -->
      <div class="position-indicator">
        <div class="year-nav">
          ${years.map(
            (year) => html`
              <button
                @click=${() => this.scrollToYear(year)}
                aria-label="Jump to ${year}"
                title="${year}"
              >
                ${year}
              </button>
            `
          )}
        </div>
        <span class="current-year">${startYear}–${endYear}</span>
      </div>
    `;
  }

  private handleTemporalScroll(e: Event) {
    const container = e.target as HTMLElement;
    this._temporalContainer = container;

    // Find the visible year based on scroll position
    const cards = container.querySelectorAll('.temporal-card');
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 3;

    let visibleYear: number | null = null;

    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      if (rect.left <= containerCenter && rect.right >= containerRect.left) {
        visibleYear = parseInt(card.getAttribute('data-year') || '0', 10);
        break;
      }
    }

    if (visibleYear && visibleYear !== this.currentYear) {
      this.currentYear = visibleYear;
    }
  }

  private handleTemporalKeydown(e: KeyboardEvent) {
    const container = e.currentTarget as HTMLElement;
    const scrollAmount = 300; // Approximate card width

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        break;
      case 'ArrowRight':
        e.preventDefault();
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        break;
      case 'Home':
        e.preventDefault();
        container.scrollTo({ left: 0, behavior: 'smooth' });
        break;
      case 'End':
        e.preventDefault();
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
        break;
    }
  }

  private scrollToYear(year: number) {
    // Use cached container or query for it
    const container =
      this._temporalContainer ||
      (this.renderRoot.querySelector('.temporal-horizontal') as HTMLElement);
    if (!container) return;

    // Find the first card of that year or the boundary
    const target =
      container.querySelector(`.temporal-card[data-year="${year}"]`) ||
      container.querySelector(`.year-boundary[data-year="${year}"]`);

    if (target) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const scrollLeft =
        container.scrollLeft + (targetRect.left - containerRect.left) - 16;

      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }

  private renderPagination() {
    if (this.totalPages <= 1) return '';

    return html`
      <nav class="pagination" aria-label="Archive pagination">
        <button
          @click=${this.handlePrev}
          ?disabled=${this.page <= 1}
          aria-label="Previous page"
        >
          ←
        </button>
        <span class="page-info">${this.page} of ${this.totalPages}</span>
        <button
          @click=${this.handleNext}
          ?disabled=${this.page >= this.totalPages}
          aria-label="Next page"
        >
          →
        </button>
      </nav>
    `;
  }

  private handlePrev() {
    if (this.page > 1) {
      this.page--;
      this.dispatchPageChange();
    }
  }

  private handleNext() {
    if (this.page < this.totalPages) {
      this.page++;
      this.dispatchPageChange();
    }
  }

  private dispatchPageChange() {
    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: { page: this.page },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleCardClick(e: CustomEvent) {
    // Re-dispatch the event
    this.dispatchEvent(
      new CustomEvent('card-click', {
        detail: e.detail,
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'archive-grid': ArchiveGrid;
  }
}
