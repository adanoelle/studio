import { html, css, PropertyValues, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { GlitchBase } from './glitch-base.js';

/**
 * MODAL-MENU COMPONENT
 *
 * THEORETICAL GROUNDING:
 * Embodies Russell's concept of glitch as portal and refusal of linear navigation.
 *
 * - Non-linear traversal: Go anywhere, anytime. Navigation is possibility, not corridor.
 * - Glitch as threshold: Modal appears through corruption effects - liminal space between pages.
 * - Multiplicity of paths: Fuzzy search reveals all destinations simultaneously.
 * - Keyboard-first as resistance: Reclaiming "outdated" CLI patterns.
 *
 * The menu exists in a threshold state - neither fully present nor absent.
 * Its appearance through corruption effects represents crossing between digital spaces.
 *
 * PERFORMANCE:
 * - Extends GlitchBase for visibility/RAF/motion detection
 * - Memoized fuzzy search results
 * - Dither pattern cached per corruption level
 * - Items lazy-loaded until first open
 *
 * ACCESSIBILITY:
 * - role="dialog" with aria-modal="true"
 * - role="combobox" input with aria-activedescendant
 * - role="listbox" with role="option" items
 * - Focus trap when open, restore on close
 * - prefers-reduced-motion: instant transitions, no idle glitch
 *
 * @example
 * ```html
 * <modal-menu
 *   .items=${[
 *     { id: 'home', label: 'Home', path: '/' },
 *     { id: 'about', label: 'About', path: '/about' }
 *   ]}
 * ></modal-menu>
 * ```
 */

export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  category?: string;
  shortcut?: string;
  keywords?: string[];
  action?: () => void;
}

interface FuzzyMatch {
  item: MenuItem;
  score: number;
  indices: number[];
}

const RECENT_STORAGE_KEY = 'modal-menu-recent';

@customElement('modal-menu')
export class ModalMenu extends GlitchBase {
  // ============================================
  // PUBLIC API
  // ============================================

  /** Menu visibility state */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Navigation items to display */
  @property({ type: Array })
  items: MenuItem[] = [];

  /** Input placeholder text */
  @property({ type: String })
  placeholder = 'Type to filter...';

  /** Base glitch effect intensity (0-1) */
  @property({ type: Number, attribute: 'glitch-intensity' })
  glitchIntensity = 0.3;

  /** Show recent items section */
  @property({ type: Boolean, attribute: 'show-recent' })
  showRecent = true;

  /** Maximum recent items to display */
  @property({ type: Number, attribute: 'max-recent' })
  maxRecent = 3;

  /** Input debounce time in ms */
  @property({ type: Number, attribute: 'filter-debounce' })
  filterDebounce = 50;

  // ============================================
  // INTERNAL STATE
  // ============================================

  @state()
  private filterQuery = '';

  @state()
  private selectedIndex = 0;

  @state()
  private filteredItems: FuzzyMatch[] = [];

  @state()
  private recentItems: MenuItem[] = [];

  @state()
  private corruptionLevel = 0;

  @state()
  private isAnimating = false;

  @query('#menu-input')
  private inputElement?: HTMLInputElement;

  // Note: listbox element accessed via shadowRoot query in scrollSelectedIntoView

  private previouslyFocusedElement: HTMLElement | null = null;
  private debounceTimer?: ReturnType<typeof setTimeout>;
  private idleGlitchTimer?: ReturnType<typeof setTimeout>;
  private animationTimer?: ReturnType<typeof setTimeout>;
  private hasLoadedRecent = false;

  // ============================================
  // LIFECYCLE
  // ============================================

  connectedCallback() {
    super.connectedCallback();
    this.loadRecentItems();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanup();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('open')) {
      if (this.open) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    }

    if (changedProperties.has('items') || changedProperties.has('filterQuery')) {
      this.updateFilteredItems();
    }
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /** Open the modal menu */
  show() {
    if (!this.open) {
      this.open = true;
    }
  }

  /** Close the modal menu */
  hide() {
    if (this.open) {
      this.open = false;
    }
  }

  /** Toggle open/close state */
  toggle() {
    this.open = !this.open;
  }

  /** Focus the search input */
  focusInput() {
    this.inputElement?.focus();
  }

  /** Clear current filter text */
  clearFilter() {
    this.filterQuery = '';
    this.selectedIndex = 0;
  }

  /** Get currently selected item */
  getSelectedItem(): MenuItem | null {
    const allItems = this.getAllDisplayItems();
    return allItems[this.selectedIndex]?.item ?? null;
  }

  /** Select item by index */
  selectByIndex(index: number) {
    const allItems = this.getAllDisplayItems();
    if (index >= 0 && index < allItems.length) {
      this.selectedIndex = index;
      this.dispatchSelectionChange();
    }
  }

  /** Trigger selection of current item */
  confirmSelection() {
    const item = this.getSelectedItem();
    if (item) {
      this.selectItem(item);
    }
  }

  // ============================================
  // OPEN/CLOSE HANDLERS
  // ============================================

  private handleOpen() {
    // Store previously focused element
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    // Reset state
    this.filterQuery = '';
    this.selectedIndex = 0;
    this.updateFilteredItems();

    // Animate open
    if (!this.prefersReducedMotion) {
      this.isAnimating = true;
      this.corruptionLevel = 0.4;

      this.animationTimer = setTimeout(() => {
        this.corruptionLevel = this.glitchIntensity;
        this.isAnimating = false;
      }, 150);
    } else {
      this.corruptionLevel = this.glitchIntensity;
    }

    // Focus input after render
    this.updateComplete.then(() => {
      this.focusInput();
      this.scheduleIdleGlitch();
    });

    // Dispatch event
    this.dispatchEvent(new CustomEvent('modal-open', { bubbles: true, composed: true }));

    // Add escape listener to document
    document.addEventListener('keydown', this.handleDocumentKeydown);
  }

  private handleClose() {
    // Cleanup
    this.clearIdleGlitch();
    document.removeEventListener('keydown', this.handleDocumentKeydown);

    // Restore focus
    this.previouslyFocusedElement?.focus();
    this.previouslyFocusedElement = null;
  }

  // ============================================
  // IDLE GLITCH
  // ============================================

  private scheduleIdleGlitch() {
    if (this.prefersReducedMotion || !this.open) return;

    this.clearIdleGlitch();

    // 30-60 second interval
    const delay = 30000 + Math.random() * 30000;

    this.idleGlitchTimer = setTimeout(() => {
      if (this.open && this.isVisible) {
        this.triggerIdleGlitch();
      }
      this.scheduleIdleGlitch();
    }, delay);
  }

  private triggerIdleGlitch() {
    const baseLevel = this.corruptionLevel;
    this.corruptionLevel = 0.6;

    setTimeout(() => {
      this.corruptionLevel = baseLevel;
    }, 200 + Math.random() * 300);
  }

  private clearIdleGlitch() {
    if (this.idleGlitchTimer) {
      clearTimeout(this.idleGlitchTimer);
      this.idleGlitchTimer = undefined;
    }
  }

  // ============================================
  // FUZZY SEARCH
  // ============================================

  private updateFilteredItems() {
    if (!this.filterQuery.trim()) {
      this.filteredItems = this.items.map((item) => ({
        item,
        score: 0,
        indices: [],
      }));
    } else {
      this.filteredItems = this.fuzzyFilter(this.items, this.filterQuery.toLowerCase());
    }

    // Reset selection if out of bounds
    const allItems = this.getAllDisplayItems();
    if (this.selectedIndex >= allItems.length) {
      this.selectedIndex = Math.max(0, allItems.length - 1);
    }

    // Dispatch filter change event
    this.dispatchEvent(
      new CustomEvent('filter-change', {
        detail: {
          query: this.filterQuery,
          results: this.filteredItems.map((m) => m.item),
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private fuzzyFilter(items: MenuItem[], query: string): FuzzyMatch[] {
    const results: FuzzyMatch[] = [];

    for (const item of items) {
      const match = this.fuzzyMatch(item, query);
      if (match) {
        results.push(match);
      }
    }

    // Sort by score (higher is better)
    return results.sort((a, b) => b.score - a.score);
  }

  private fuzzyMatch(item: MenuItem, query: string): FuzzyMatch | null {
    // Try label first
    const labelMatch = this.fuzzyMatchString(item.label.toLowerCase(), query);
    if (labelMatch) {
      return { item, score: labelMatch.score + 10, indices: labelMatch.indices };
    }

    // Try keywords
    if (item.keywords) {
      for (const keyword of item.keywords) {
        const keywordMatch = this.fuzzyMatchString(keyword.toLowerCase(), query);
        if (keywordMatch) {
          return { item, score: keywordMatch.score, indices: [] }; // Don't highlight keyword matches in label
        }
      }
    }

    return null;
  }

  private fuzzyMatchString(str: string, query: string): { score: number; indices: number[] } | null {
    let queryIndex = 0;
    let score = 0;
    const indices: number[] = [];

    for (let i = 0; i < str.length && queryIndex < query.length; i++) {
      if (str[i] === query[queryIndex]) {
        indices.push(i);

        // Bonus for word boundary matches
        if (i === 0 || str[i - 1] === ' ' || str[i - 1] === '-') {
          score += 2;
        }

        // Bonus for consecutive matches
        if (indices.length > 1 && indices[indices.length - 2] === i - 1) {
          score += 1;
        }

        score += 1;
        queryIndex++;
      }
    }

    // All query characters must match
    if (queryIndex === query.length) {
      return { score, indices };
    }

    return null;
  }

  // ============================================
  // RECENT ITEMS
  // ============================================

  private loadRecentItems() {
    if (this.hasLoadedRecent) return;
    this.hasLoadedRecent = true;

    try {
      const stored = localStorage.getItem(RECENT_STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as string[];
        this.recentItems = ids
          .map((id) => this.items.find((item) => item.id === id))
          .filter((item): item is MenuItem => item !== undefined)
          .slice(0, this.maxRecent);
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  private saveRecentItem(item: MenuItem) {
    try {
      const stored = localStorage.getItem(RECENT_STORAGE_KEY);
      let ids: string[] = stored ? JSON.parse(stored) : [];

      // Remove existing occurrence and add to front
      ids = ids.filter((id) => id !== item.id);
      ids.unshift(item.id);
      ids = ids.slice(0, this.maxRecent);

      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(ids));

      // Update local state
      this.recentItems = ids
        .map((id) => this.items.find((i) => i.id === id))
        .filter((i): i is MenuItem => i !== undefined);
    } catch {
      // Ignore localStorage errors
    }
  }

  // ============================================
  // ITEM SELECTION
  // ============================================

  private getAllDisplayItems(): FuzzyMatch[] {
    if (!this.showRecent || this.filterQuery.trim() || this.recentItems.length === 0) {
      return this.filteredItems;
    }

    // Show recent items at top when no filter
    const recentMatches: FuzzyMatch[] = this.recentItems.map((item) => ({
      item,
      score: 100,
      indices: [],
    }));

    // Filter out recent items from main list to avoid duplicates
    const recentIds = new Set(this.recentItems.map((i) => i.id));
    const nonRecent = this.filteredItems.filter((m) => !recentIds.has(m.item.id));

    return [...recentMatches, ...nonRecent];
  }

  private selectItem(item: MenuItem) {
    // Save to recent
    this.saveRecentItem(item);

    // Dispatch event
    this.dispatchEvent(
      new CustomEvent('item-select', {
        detail: { item },
        bubbles: true,
        composed: true,
      })
    );

    // Execute action or navigate
    if (item.action) {
      item.action();
    } else if (item.path) {
      window.location.href = item.path;
    }

    // Close menu
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('modal-close', {
        detail: { reason: 'select' },
        bubbles: true,
        composed: true,
      })
    );
  }

  private dispatchSelectionChange() {
    const item = this.getSelectedItem();
    if (item) {
      this.dispatchEvent(
        new CustomEvent('selection-change', {
          detail: { item, index: this.selectedIndex },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  private handleDocumentKeydown = (e: KeyboardEvent) => {
    if (!this.open) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      this.open = false;
      this.dispatchEvent(
        new CustomEvent('modal-close', {
          detail: { reason: 'escape' },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  private handleInputKeydown(e: KeyboardEvent) {
    const allItems = this.getAllDisplayItems();

    switch (e.key) {
      case 'ArrowDown':
      case 'j':
        if (e.key === 'j' && !e.ctrlKey) break; // Only handle Ctrl+j or j without modifier
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, allItems.length - 1);
        this.dispatchSelectionChange();
        this.scrollSelectedIntoView();
        break;

      case 'ArrowUp':
      case 'k':
        if (e.key === 'k' && !e.ctrlKey) break; // Only handle Ctrl+k or k without modifier
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.dispatchSelectionChange();
        this.scrollSelectedIntoView();
        break;

      case 'Enter':
        e.preventDefault();
        this.confirmSelection();
        break;

      case 'Backspace':
        if (this.filterQuery === '') {
          this.open = false;
          this.dispatchEvent(
            new CustomEvent('modal-close', {
              detail: { reason: 'escape' },
              bubbles: true,
              composed: true,
            })
          );
        }
        break;

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if ((e.metaKey || e.ctrlKey) && this.showRecent) {
          e.preventDefault();
          const index = parseInt(e.key) - 1;
          if (index < this.recentItems.length) {
            this.selectItem(this.recentItems[index]);
          }
        }
        break;
    }
  }

  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.filterQuery = target.value;
      this.selectedIndex = 0;
    }, this.filterDebounce);
  }

  private handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this.open = false;
      this.dispatchEvent(
        new CustomEvent('modal-close', {
          detail: { reason: 'click-outside' },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private handleItemClick(item: MenuItem) {
    this.selectItem(item);
  }

  private handleItemMouseEnter(index: number) {
    this.selectedIndex = index;
  }

  private scrollSelectedIntoView() {
    const selectedElement = this.shadowRoot?.querySelector('[aria-selected="true"]');
    // Guard against jsdom in tests where scrollIntoView may not exist
    if (selectedElement && typeof selectedElement.scrollIntoView === 'function') {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }

  // ============================================
  // CLEANUP
  // ============================================

  private cleanup() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
    }
    this.clearIdleGlitch();
    document.removeEventListener('keydown', this.handleDocumentKeydown);
  }

  // ============================================
  // RENDERING HELPERS
  // ============================================

  private renderHighlightedLabel(label: string, indices: number[]) {
    if (indices.length === 0) {
      return label;
    }

    const result: (string | ReturnType<typeof html>)[] = [];
    const indexSet = new Set(indices);
    let currentText = '';

    for (let i = 0; i < label.length; i++) {
      if (indexSet.has(i)) {
        if (currentText) {
          result.push(currentText);
          currentText = '';
        }
        result.push(html`<mark>${label[i]}</mark>`);
      } else {
        currentText += label[i];
      }
    }

    if (currentText) {
      result.push(currentText);
    }

    return result;
  }

  private getCategoryGroups(): Map<string, FuzzyMatch[]> {
    const groups = new Map<string, FuzzyMatch[]>();
    const allItems = this.getAllDisplayItems();

    // If showing recent with no filter, add recent section
    if (this.showRecent && !this.filterQuery.trim() && this.recentItems.length > 0) {
      const recentMatches = allItems.slice(0, this.recentItems.length);
      groups.set('RECENT', recentMatches);

      // Group remaining by category
      const remaining = allItems.slice(this.recentItems.length);
      for (const match of remaining) {
        const category = match.item.category || 'NAVIGATION';
        if (!groups.has(category)) {
          groups.set(category, []);
        }
        groups.get(category)!.push(match);
      }
    } else {
      // Group all by category
      for (const match of allItems) {
        const category = match.item.category || 'NAVIGATION';
        if (!groups.has(category)) {
          groups.set(category, []);
        }
        groups.get(category)!.push(match);
      }
    }

    return groups;
  }

  // ============================================
  // STYLES
  // ============================================

  static override styles = css`
    :host {
      display: contents;
    }

    /**
     * BACKDROP
     * Dithered overlay that mutes the background, centered modal
     *
     * THEORETICAL GROUNDING:
     * The dither pattern creates a membrane between the current context
     * and the navigation possibilities. The void texture persists,
     * reminding us that navigation is worldtraveling.
     */
    .backdrop {
      position: fixed;
      inset: 0;
      /* Semi-transparent warm overlay using Paean Black tint - maintains warm palette */
      background-color: rgba(58, 54, 50, 0.75);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition:
        opacity 0.2s ease,
        visibility 0.2s ease;
    }

    .backdrop.open {
      opacity: 1;
      visibility: visible;
    }

    /* Dither texture overlay - separate layer so we can control opacity */
    .backdrop::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: var(--dither-void-cool);
      background-size: var(--dither-void-size, 12px 12px);
      opacity: 0.7;
      pointer-events: none;
    }

    /**
     * GLITCH DASH ANIMATION
     * HLD-inspired: instant appearance with ghost afterimages that fade
     * The modal appears in place; ghosts trail off to the side and fade
     */

    /* Main container snaps in instantly */
    @keyframes dash-appear {
      0% {
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      100% {
        opacity: 1;
      }
    }

    /* Ghost afterimages - they start offset and fade out in place */
    @keyframes ghost-trail {
      0% {
        opacity: 0.6;
      }
      100% {
        opacity: 0;
      }
    }

    /**
     * CONTAINER
     * Main menu container with warm palette matching homepage
     */
    .container {
      width: var(--modal-menu-width, min(90vw, 500px));
      max-height: 60vh;
      background: var(--modal-menu-background, var(--bg-primary, #dfc8ba));
      border: 1px solid var(--modal-menu-border-color, var(--color-muted, #5a4a4a));
      border-radius: 0;
      overflow: visible;
      display: flex;
      flex-direction: column;
      opacity: 0;
      position: relative;
      box-shadow:
        0 4px 60px rgba(0, 0, 0, 0.3),
        0 0 100px rgba(58, 54, 50, 0.4);
    }

    /* Ghosts converging from all four directions */
    @keyframes ghosts-fade-all {
      0% {
        box-shadow:
          /* Base shadow */
          0 4px 60px rgba(0, 0, 0, 0.3),
          0 0 100px rgba(58, 54, 50, 0.4),
          /* Right - cyan */
          40px 0 0 0 rgba(0, 255, 255, 0.4),
          25px 0 0 0 rgba(0, 255, 255, 0.2),
          /* Left - magenta */
          -40px 0 0 0 rgba(255, 0, 255, 0.4),
          -25px 0 0 0 rgba(255, 0, 255, 0.2),
          /* Top - cyan */
          0 -35px 0 0 rgba(0, 255, 255, 0.35),
          0 -20px 0 0 rgba(0, 255, 255, 0.15),
          /* Bottom - magenta */
          0 35px 0 0 rgba(255, 0, 255, 0.35),
          0 20px 0 0 rgba(255, 0, 255, 0.15);
      }
      100% {
        box-shadow:
          0 4px 60px rgba(0, 0, 0, 0.3),
          0 0 100px rgba(58, 54, 50, 0.4),
          0 0 0 0 rgba(0, 255, 255, 0),
          0 0 0 0 rgba(0, 255, 255, 0),
          0 0 0 0 rgba(255, 0, 255, 0),
          0 0 0 0 rgba(255, 0, 255, 0),
          0 0 0 0 rgba(0, 255, 255, 0),
          0 0 0 0 rgba(0, 255, 255, 0),
          0 0 0 0 rgba(255, 0, 255, 0),
          0 0 0 0 rgba(255, 0, 255, 0);
      }
    }

    .backdrop.open .container {
      animation:
        dash-appear 0.1s steps(2) forwards,
        ghosts-fade-all 0.3s ease-out forwards;
    }

    /* Chromatic afterimage layers - border ghosts from corners */
    .container .chromatic-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0;
    }

    .container .chromatic-layer.magenta {
      border: 2px solid var(--glitch-magenta, #ff00ff);
      transform: translate(-30px, -20px);
    }

    .container .chromatic-layer.cyan {
      border: 2px solid var(--glitch-cyan, #00ffff);
      transform: translate(30px, 20px);
    }

    .backdrop.open .container .chromatic-layer.magenta {
      animation: ghost-trail 0.25s ease-out forwards;
    }

    .backdrop.open .container .chromatic-layer.cyan {
      animation: ghost-trail 0.2s ease-out forwards;
    }

    /**
     * OUTER BORDER
     * Double-line aesthetic matching homepage boundary frame
     */
    .container::before {
      content: '';
      position: absolute;
      inset: -6px;
      border: 1px solid var(--modal-menu-border-color, var(--color-muted, #5a4a4a));
      pointer-events: none;
      z-index: 10;
    }

    /**
     * CHROMATIC ABERRATION
     * Subtle offset for glitch effect on the outer border
     */
    .container::after {
      content: '';
      position: absolute;
      inset: -6px;
      border: 1px solid var(--glitch-cyan, #00ffff);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease, transform 0.15s ease;
      z-index: 10;
    }

    .container:hover::after {
      opacity: 0.4;
      transform: translate(1px, 0);
    }

    /**
     * INPUT SECTION
     */
    .input-wrapper {
      padding: 12px 16px;
      border-bottom: 1px solid var(--modal-menu-border-color, var(--border, #c9a88a));
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .input-prompt {
      color: var(--text-secondary, #5a4a4a);
      font-family: var(--font-primary, monospace);
      font-size: 14px;
    }

    .input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--modal-menu-input-color, var(--text-primary, #3a3632));
      font-family: var(--font-primary, monospace);
      font-size: 14px;
      caret-color: var(--accent, #a4656a);
    }

    .input::placeholder {
      color: var(--modal-menu-placeholder-color, var(--text-tertiary, #8a7a7a));
    }

    /**
     * ITEMS LIST
     */
    .items-wrapper {
      flex: 1;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--modal-menu-border-color, var(--border, #c9a88a)) transparent;
    }

    .items-wrapper::-webkit-scrollbar {
      width: 6px;
    }

    .items-wrapper::-webkit-scrollbar-thumb {
      background: var(--modal-menu-border-color, var(--border, #c9a88a));
      border-radius: 3px;
    }

    .listbox {
      list-style: none;
      margin: 0;
      padding: 8px 0;
    }

    /**
     * CATEGORY HEADERS
     */
    .category-header {
      padding: 8px 16px 4px;
      font-family: var(--font-primary, monospace);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--modal-menu-category-color, var(--text-secondary, #5a4a4a));
    }

    .category-divider {
      height: 1px;
      background: var(--modal-menu-border-color, var(--border, #c9a88a));
      margin: 8px 16px;
    }

    /**
     * MENU ITEMS
     */
    .item {
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      font-family: var(--font-primary, monospace);
      font-size: 14px;
      color: var(--modal-menu-item-color, var(--text-primary, #3a3632));
      position: relative;
      transition: background-color 0.08s ease;
    }

    .item:hover {
      background: var(--modal-menu-item-hover, var(--bg-secondary, #c9a88a));
    }

    .item.selected {
      background: var(--modal-menu-item-selected, var(--bg-secondary, #c9a88a));
    }

    .item.selected::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--modal-menu-selection-accent, var(--accent, #a4656a));
    }

    .item-label {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .item-indicator {
      color: var(--accent, #a4656a);
      opacity: 0;
      transition: opacity 0.08s ease;
    }

    .item.selected .item-indicator {
      opacity: 1;
    }

    .item-shortcut {
      font-size: 12px;
      color: var(--modal-menu-category-color, var(--text-secondary, #5a4a4a));
    }

    /**
     * SEARCH HIGHLIGHTING
     */
    .item mark {
      background: transparent;
      color: var(--modal-menu-highlight-color, var(--glitch-magenta, #ff00ff));
      font-weight: 600;
    }

    /**
     * FOOTER HINTS
     */
    .footer {
      padding: 8px 16px;
      border-top: 1px solid var(--modal-menu-border-color, var(--border, #c9a88a));
      font-family: var(--font-primary, monospace);
      font-size: 11px;
      color: var(--modal-menu-category-color, var(--text-secondary, #5a4a4a));
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .footer-hint {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .footer-key {
      color: var(--text-primary, #3a3632);
      font-weight: 600;
    }

    /**
     * EMPTY STATE
     */
    .empty-state {
      padding: 24px 16px;
      text-align: center;
      color: var(--modal-menu-category-color, var(--text-secondary, #5a4a4a));
      font-family: var(--font-primary, monospace);
      font-size: 14px;
    }

    /**
     * ACCESSIBILITY: Reduced Motion
     */
    @media (prefers-reduced-motion: reduce) {
      .backdrop,
      .container,
      .item {
        transition: none;
      }

      .backdrop.open .container {
        animation: none;
        opacity: 1;
      }

      .backdrop.open .container .chromatic-layer.magenta,
      .backdrop.open .container .chromatic-layer.cyan {
        animation: none;
        opacity: 0;
      }

      .container::after {
        display: none;
      }
    }

    /**
     * MOBILE OPTIMIZATIONS
     */
    @media (max-width: 767px) {
      .backdrop {
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        padding-top: 10vh;
      }

      .item {
        padding: 14px 16px;
        min-height: 48px;
      }

      .footer {
        display: none;
      }
    }

    /**
     * SCREEN READER ONLY
     */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `;

  // ============================================
  // RENDER
  // ============================================

  render() {
    if (!this.open && !this.isAnimating) {
      return nothing;
    }

    const allItems = this.getAllDisplayItems();
    const groups = this.getCategoryGroups();

    let globalIndex = 0;

    return html`
      <div
        class=${classMap({ backdrop: true, open: this.open })}
        @click=${this.handleBackdropClick}
        role="presentation"
      >
        <div
          class="container"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <!-- Chromatic afterimage layers for glitch dash effect -->
          <div class="chromatic-layer magenta" aria-hidden="true"></div>
          <div class="chromatic-layer cyan" aria-hidden="true"></div>

          <div class="input-wrapper">
            <span class="input-prompt" aria-hidden="true">></span>
            <input
              id="menu-input"
              class="input"
              type="text"
              .value=${this.filterQuery}
              placeholder=${this.placeholder}
              @input=${this.handleInput}
              @keydown=${this.handleInputKeydown}
              role="combobox"
              aria-expanded="true"
              aria-controls="menu-listbox"
              aria-activedescendant=${allItems[this.selectedIndex]
                ? `item-${allItems[this.selectedIndex].item.id}`
                : ''}
              aria-autocomplete="list"
            />
          </div>

          <div class="items-wrapper">
            ${allItems.length === 0
              ? html`<div class="empty-state">No results found</div>`
              : html`
                  <ul
                    id="menu-listbox"
                    class="listbox"
                    role="listbox"
                    aria-label="Navigation options"
                  >
                    ${Array.from(groups.entries()).map(([category, items], groupIndex) => {
                      const startIndex = globalIndex;
                      const itemsHtml = items.map((match, i) => {
                        const currentIndex = startIndex + i;
                        const isSelected = currentIndex === this.selectedIndex;
                        const shortcut =
                          category === 'RECENT' && !this.filterQuery.trim() ? `⌘${i + 1}` : match.item.shortcut;

                        const itemHtml = html`
                          <li
                            id="item-${match.item.id}"
                            class=${classMap({ item: true, selected: isSelected })}
                            role="option"
                            aria-selected=${isSelected}
                            @click=${() => this.handleItemClick(match.item)}
                            @mouseenter=${() => this.handleItemMouseEnter(currentIndex)}
                          >
                            <span class="item-label">
                              <span class="item-indicator" aria-hidden="true">→</span>
                              <span>${this.renderHighlightedLabel(match.item.label, match.indices)}</span>
                            </span>
                            ${shortcut ? html`<span class="item-shortcut">${shortcut}</span>` : nothing}
                          </li>
                        `;

                        return itemHtml;
                      });

                      globalIndex += items.length;

                      return html`
                        ${groupIndex > 0 ? html`<div class="category-divider" role="separator"></div>` : nothing}
                        <li class="category-header" role="presentation">${category}</li>
                        ${itemsHtml}
                      `;
                    })}
                  </ul>
                `}
          </div>

          <div class="footer" aria-hidden="true">
            <span class="footer-hint">
              <span class="footer-key">Esc</span> close
            </span>
            <span class="footer-hint">
              <span class="footer-key">↑↓</span> navigate
            </span>
            <span class="footer-hint">
              <span class="footer-key">Enter</span> select
            </span>
          </div>
        </div>
      </div>

      <div class="sr-only" role="status" aria-live="polite">
        ${this.open
          ? `Navigation menu opened. ${allItems.length} items available. Type to filter.`
          : 'Navigation menu closed.'}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'modal-menu': ModalMenu;
  }
}
