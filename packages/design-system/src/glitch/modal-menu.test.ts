import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fixture, html, fixtureCleanup } from '@open-wc/testing';
import { ModalMenu, MenuItem } from './modal-menu.js';
import './modal-menu.js';

// Helper to wait for a specified time
const aTimeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Sample items for testing
const sampleItems: MenuItem[] = [
  { id: 'home', label: 'Home', path: '/', category: 'Navigation' },
  { id: 'about', label: 'About', path: '/about', category: 'Navigation' },
  { id: 'archive', label: 'Archive', path: '/archive', category: 'Navigation' },
  { id: 'journal', label: 'Journal', path: '/journal', category: 'Navigation' },
  { id: 'search', label: 'Search', category: 'Tools', keywords: ['find', 'lookup'] },
];

describe('ModalMenu', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.removeItem('modal-menu-recent');
  });

  afterEach(() => {
    fixtureCleanup();
  });

  // ============================================
  // RENDERING & PROPERTIES
  // ============================================

  describe('rendering', () => {
    it('renders with default properties', async () => {
      const el = await fixture<ModalMenu>(html`<modal-menu></modal-menu>`);

      expect(el).toBeTruthy();
      expect(el.open).toBe(false);
      expect(el.items).toEqual([]);
      expect(el.placeholder).toBe('Type to filter...');
    });

    it('does not render content when closed', async () => {
      const el = await fixture<ModalMenu>(html`<modal-menu .items=${sampleItems}></modal-menu>`);

      const backdrop = el.shadowRoot?.querySelector('.backdrop');
      expect(backdrop).toBeNull();
    });

    it('renders content when open', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const backdrop = el.shadowRoot?.querySelector('.backdrop');
      expect(backdrop).toBeTruthy();

      const input = el.shadowRoot?.querySelector('#menu-input');
      expect(input).toBeTruthy();
    });

    it('renders all items when open', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const items = el.shadowRoot?.querySelectorAll('.item');
      expect(items?.length).toBe(sampleItems.length);
    });

    it('renders items grouped by category', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const categoryHeaders = el.shadowRoot?.querySelectorAll('.category-header');
      // Should have Navigation and Tools categories
      expect(categoryHeaders?.length).toBe(2);
    });
  });

  describe('properties', () => {
    it('has correct default property values', async () => {
      const el = await fixture<ModalMenu>(html`<modal-menu></modal-menu>`);

      expect(el.glitchIntensity).toBe(0.3);
      expect(el.showRecent).toBe(true);
      expect(el.maxRecent).toBe(3);
      expect(el.filterDebounce).toBe(50);
    });

    it('accepts custom placeholder', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu placeholder="Search..." open></modal-menu>`
      );
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector('#menu-input') as HTMLInputElement;
      expect(input?.placeholder).toBe('Search...');
    });

    it('accepts custom glitch intensity', async () => {
      const el = await fixture<ModalMenu>(html`<modal-menu glitch-intensity="0.8"></modal-menu>`);

      expect(el.glitchIntensity).toBe(0.8);
    });
  });

  // ============================================
  // OPEN/CLOSE BEHAVIOR
  // ============================================

  describe('open/close', () => {
    it('opens when open property is set', async () => {
      const el = await fixture<ModalMenu>(html`<modal-menu .items=${sampleItems}></modal-menu>`);

      el.open = true;
      await el.updateComplete;

      const backdrop = el.shadowRoot?.querySelector('.backdrop');
      expect(backdrop?.classList.contains('open')).toBe(true);
    });

    it('closes on Escape key', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const closeHandler = vi.fn();
      el.addEventListener('modal-close', closeHandler);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await el.updateComplete;

      expect(el.open).toBe(false);
      expect(closeHandler).toHaveBeenCalledTimes(1);
      expect(closeHandler.mock.calls[0][0].detail.reason).toBe('escape');
    });

    it('closes on backdrop click', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const closeHandler = vi.fn();
      el.addEventListener('modal-close', closeHandler);

      const backdrop = el.shadowRoot?.querySelector('.backdrop');
      backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await el.updateComplete;

      expect(el.open).toBe(false);
      expect(closeHandler).toHaveBeenCalledTimes(1);
      expect(closeHandler.mock.calls[0][0].detail.reason).toBe('click-outside');
    });

    it('closes on Backspace when input is empty', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const closeHandler = vi.fn();
      el.addEventListener('modal-close', closeHandler);

      const input = el.shadowRoot?.querySelector('#menu-input');
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
      await el.updateComplete;

      expect(el.open).toBe(false);
    });

    it('dispatches modal-open event when opened', async () => {
      const el = await fixture<ModalMenu>(html`<modal-menu .items=${sampleItems}></modal-menu>`);

      const openHandler = vi.fn();
      el.addEventListener('modal-open', openHandler);

      el.open = true;
      await el.updateComplete;

      expect(openHandler).toHaveBeenCalledTimes(1);
    });

    it('focuses input when opened', async () => {
      const el = await fixture<ModalMenu>(html`<modal-menu .items=${sampleItems}></modal-menu>`);

      el.open = true;
      await el.updateComplete;
      await aTimeout(10);

      const input = el.shadowRoot?.querySelector('#menu-input');
      expect(el.shadowRoot?.activeElement).toBe(input);
    });
  });

  // ============================================
  // PUBLIC METHODS
  // ============================================

  describe('public methods', () => {
    it('show() opens the menu', async () => {
      const el = await fixture<ModalMenu>(html`<modal-menu .items=${sampleItems}></modal-menu>`);

      el.show();
      await el.updateComplete;

      expect(el.open).toBe(true);
    });

    it('hide() closes the menu', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );

      el.hide();
      await el.updateComplete;

      expect(el.open).toBe(false);
    });

    it('toggle() toggles the menu', async () => {
      const el = await fixture<ModalMenu>(html`<modal-menu .items=${sampleItems}></modal-menu>`);

      el.toggle();
      await el.updateComplete;
      expect(el.open).toBe(true);

      el.toggle();
      await el.updateComplete;
      expect(el.open).toBe(false);
    });

    it('clearFilter() resets the filter', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector('#menu-input') as HTMLInputElement;
      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      await aTimeout(60);

      el.clearFilter();
      await el.updateComplete;

      expect(input.value).toBe('');
    });

    it('getSelectedItem() returns selected item', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const selected = el.getSelectedItem();
      expect(selected).toBeTruthy();
      expect(selected?.id).toBe(sampleItems[0].id);
    });

    it('selectByIndex() changes selection', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      el.selectByIndex(2);
      await el.updateComplete;

      const selected = el.getSelectedItem();
      expect(selected?.id).toBe(sampleItems[2].id);
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  describe('keyboard navigation', () => {
    it('ArrowDown moves selection down', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector('#menu-input');
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;

      const selected = el.getSelectedItem();
      expect(selected?.id).toBe(sampleItems[1].id);
    });

    it('ArrowUp moves selection up', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      el.selectByIndex(2);
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector('#menu-input');
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await el.updateComplete;

      const selected = el.getSelectedItem();
      expect(selected?.id).toBe(sampleItems[1].id);
    });

    it('does not go below zero', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector('#menu-input');
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await el.updateComplete;

      const selected = el.getSelectedItem();
      expect(selected?.id).toBe(sampleItems[0].id);
    });

    it('does not exceed item count', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      el.selectByIndex(sampleItems.length - 1);

      const input = el.shadowRoot?.querySelector('#menu-input');
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;

      const selected = el.getSelectedItem();
      expect(selected?.id).toBe(sampleItems[sampleItems.length - 1].id);
    });

    it('Enter selects current item', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const selectHandler = vi.fn();
      el.addEventListener('item-select', selectHandler);

      const input = el.shadowRoot?.querySelector('#menu-input');
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;

      expect(selectHandler).toHaveBeenCalledTimes(1);
      expect(selectHandler.mock.calls[0][0].detail.item.id).toBe(sampleItems[0].id);
    });

    it('dispatches selection-change event on navigation', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const selectionHandler = vi.fn();
      el.addEventListener('selection-change', selectionHandler);

      const input = el.shadowRoot?.querySelector('#menu-input');
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;

      expect(selectionHandler).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================
  // FUZZY SEARCH
  // ============================================

  describe('fuzzy search', () => {
    it('filters items by label', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open .showRecent=${false}></modal-menu>`
      );
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector('#menu-input') as HTMLInputElement;
      input.value = 'chiv';
      input.dispatchEvent(new Event('input'));
      await aTimeout(60);
      await el.updateComplete;

      const items = el.shadowRoot?.querySelectorAll('.item');
      expect(items?.length).toBe(1);
      expect(items?.[0].textContent).toContain('Archive');
    });

    it('filters with non-contiguous matches', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open .showRecent=${false}></modal-menu>`
      );
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector('#menu-input') as HTMLInputElement;
      input.value = 'hm';
      input.dispatchEvent(new Event('input'));
      await aTimeout(60);
      await el.updateComplete;

      const items = el.shadowRoot?.querySelectorAll('.item');
      // Should match "Home"
      expect(items?.length).toBeGreaterThanOrEqual(1);
    });

    it('filters by keywords', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open .showRecent=${false}></modal-menu>`
      );
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector('#menu-input') as HTMLInputElement;
      input.value = 'find';
      input.dispatchEvent(new Event('input'));
      await aTimeout(60);
      await el.updateComplete;

      const items = el.shadowRoot?.querySelectorAll('.item');
      expect(items?.length).toBe(1);
      expect(items?.[0].textContent).toContain('Search');
    });

    it('shows empty state when no matches', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open .showRecent=${false}></modal-menu>`
      );
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector('#menu-input') as HTMLInputElement;
      input.value = 'xyz123';
      input.dispatchEvent(new Event('input'));
      await aTimeout(60);
      await el.updateComplete;

      const emptyState = el.shadowRoot?.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
    });

    it('highlights matched characters', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open .showRecent=${false}></modal-menu>`
      );
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector('#menu-input') as HTMLInputElement;
      input.value = 'arc';
      input.dispatchEvent(new Event('input'));
      await aTimeout(60);
      await el.updateComplete;

      const marks = el.shadowRoot?.querySelectorAll('.item mark');
      expect(marks?.length).toBeGreaterThan(0);
    });

    it('dispatches filter-change event', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open .showRecent=${false}></modal-menu>`
      );
      await el.updateComplete;

      const filterHandler = vi.fn();
      el.addEventListener('filter-change', filterHandler);

      const input = el.shadowRoot?.querySelector('#menu-input') as HTMLInputElement;
      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      await aTimeout(60);
      await el.updateComplete;

      expect(filterHandler).toHaveBeenCalled();
    });
  });

  // ============================================
  // RECENT ITEMS
  // ============================================

  describe('recent items', () => {
    it('shows recent section when enabled', async () => {
      localStorage.setItem('modal-menu-recent', JSON.stringify(['home']));

      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open show-recent></modal-menu>`
      );
      await el.updateComplete;

      const categoryHeaders = el.shadowRoot?.querySelectorAll('.category-header');
      const headerTexts = Array.from(categoryHeaders || []).map((h) => h.textContent);
      expect(headerTexts).toContain('RECENT');
    });

    it('saves selection to recent', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      // Select second item
      el.selectByIndex(1);
      el.confirmSelection();
      await el.updateComplete;

      const stored = JSON.parse(localStorage.getItem('modal-menu-recent') || '[]');
      expect(stored).toContain('about');
    });

    it('respects maxRecent limit', async () => {
      localStorage.setItem(
        'modal-menu-recent',
        JSON.stringify(['home', 'about', 'archive', 'journal'])
      );

      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} max-recent="2" open></modal-menu>`
      );
      await el.updateComplete;

      // Force reload of recent items
      (el as unknown as { loadRecentItems: () => void; hasLoadedRecent: boolean }).hasLoadedRecent =
        false;
      (el as unknown as { loadRecentItems: () => void }).loadRecentItems();
      await el.updateComplete;

      const recentItems = (el as unknown as { recentItems: MenuItem[] }).recentItems;
      expect(recentItems.length).toBeLessThanOrEqual(2);
    });
  });

  // ============================================
  // ITEM SELECTION
  // ============================================

  describe('item selection', () => {
    it('selects item on click', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const selectHandler = vi.fn();
      el.addEventListener('item-select', selectHandler);

      const items = el.shadowRoot?.querySelectorAll('.item');
      items?.[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await el.updateComplete;

      expect(selectHandler).toHaveBeenCalledTimes(1);
    });

    it('calls action if provided', async () => {
      const actionFn = vi.fn();
      const itemsWithAction: MenuItem[] = [{ id: 'action', label: 'Action', action: actionFn }];

      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${itemsWithAction} open></modal-menu>`
      );
      await el.updateComplete;

      el.confirmSelection();
      await el.updateComplete;

      expect(actionFn).toHaveBeenCalledTimes(1);
    });

    it('closes menu after selection', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      el.confirmSelection();
      await el.updateComplete;

      expect(el.open).toBe(false);
    });

    it('highlights selected item', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      el.selectByIndex(1);
      await el.updateComplete;

      const selectedItem = el.shadowRoot?.querySelector('.item.selected');
      expect(selectedItem).toBeTruthy();
      expect(selectedItem?.getAttribute('aria-selected')).toBe('true');
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe('accessibility', () => {
    it('has role="dialog" with aria-modal', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const dialog = el.shadowRoot?.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });

    it('has role="combobox" input', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector('#menu-input');
      expect(input?.getAttribute('role')).toBe('combobox');
      expect(input?.getAttribute('aria-expanded')).toBe('true');
    });

    it('has role="listbox" for items', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const listbox = el.shadowRoot?.querySelector('#menu-listbox');
      expect(listbox?.getAttribute('role')).toBe('listbox');
    });

    it('has role="option" for each item', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const options = el.shadowRoot?.querySelectorAll('[role="option"]');
      expect(options?.length).toBe(sampleItems.length);
    });

    it('updates aria-activedescendant on selection', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const input = el.shadowRoot?.querySelector('#menu-input');
      expect(input?.getAttribute('aria-activedescendant')).toBe(`item-${sampleItems[0].id}`);

      el.selectByIndex(2);
      await el.updateComplete;

      expect(input?.getAttribute('aria-activedescendant')).toBe(`item-${sampleItems[2].id}`);
    });

    it('has screen reader status announcements', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      const status = el.shadowRoot?.querySelector('[role="status"]');
      expect(status).toBeTruthy();
      expect(status?.textContent).toContain('opened');
    });
  });

  // ============================================
  // LIFECYCLE
  // ============================================

  describe('lifecycle', () => {
    it('cleans up on disconnect', async () => {
      const el = await fixture<ModalMenu>(
        html`<modal-menu .items=${sampleItems} open></modal-menu>`
      );
      await el.updateComplete;

      el.remove();
      await aTimeout(50);

      // Should not throw
      expect(el.isConnected).toBe(false);
    });

    it('handles rapid open/close', async () => {
      const el = await fixture<ModalMenu>(html`<modal-menu .items=${sampleItems}></modal-menu>`);

      for (let i = 0; i < 5; i++) {
        el.toggle();
        await aTimeout(10);
      }

      await el.updateComplete;
      // Should not throw
      expect(true).toBe(true);
    });
  });
});
