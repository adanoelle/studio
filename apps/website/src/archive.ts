/**
 * Archive Page Controller
 *
 * Manages the archive grid, tag filtering, pagination, and URL state.
 *
 * THEORETICAL GROUNDING:
 * The archive presents multiplicity without hierarchy—items coexist
 * without ranking logic. Following Lugones' worldtraveling, navigation
 * across tags creates encounters rather than strict categories.
 */

import '@studio/design-system';
import type {
  ModalMenu,
  MenuItem,
  ArchiveGrid,
  TagFilter,
  ArchiveItem,
} from '@studio/design-system/glitch';
import { extractTags, filterByTag, sortByDate } from './data/archive-types.js';
import archiveData from './data/archive.json';

// Navigation items for the modal menu
const navItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/homepage.html',
    category: 'Navigation',
    keywords: ['index', 'main', 'start'],
  },
  {
    id: 'archive',
    label: 'Archive',
    path: '/archive.html',
    category: 'Navigation',
    keywords: ['posts', 'writing', 'blog'],
  },
  {
    id: 'about',
    label: 'About',
    path: '#',
    category: 'Navigation',
    keywords: ['bio', 'contact', 'info'],
  },
  {
    id: 'projects',
    label: 'Projects',
    path: '#',
    category: 'Navigation',
    keywords: ['work', 'code', 'portfolio'],
  },
  {
    id: 'design-system',
    label: 'Design System Demo',
    path: '/index.html',
    category: 'Meta',
    keywords: ['components', 'demo', 'showcase'],
  },
];

// State
let allItems: ArchiveItem[] = [];
let filteredItems: ArchiveItem[] = [];
let currentTag: string | null = null;
let currentView: 'grid' | 'temporal' = 'grid';
let currentPage = 1;

// DOM elements
let grid: ArchiveGrid | null = null;
let tagFilter: TagFilter | null = null;
let itemCount: HTMLElement | null = null;
let viewGridBtn: HTMLButtonElement | null = null;
let viewTemporalBtn: HTMLButtonElement | null = null;

/**
 * Initialize the modal menu
 */
function initModalMenu(): void {
  const menu = document.getElementById('nav-menu') as ModalMenu | null;

  if (!menu) {
    console.warn('Modal menu element not found');
    return;
  }

  menu.items = navItems;
  menu.placeholder = 'Where to?';
  menu.showRecent = true;
  menu.maxRecent = 3;
}

/**
 * Set up global keyboard shortcuts
 */
function initKeyboardShortcuts(): void {
  const menu = document.getElementById('nav-menu') as ModalMenu | null;

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      menu?.toggle();
    }
  });
}

/**
 * Parse URL state
 */
function parseURLState(): void {
  const params = new URLSearchParams(window.location.search);

  const tag = params.get('tag');
  currentTag = tag || null;

  const view = params.get('view');
  if (view === 'grid' || view === 'temporal') {
    currentView = view;
  }

  const page = params.get('page');
  if (page) {
    const pageNum = parseInt(page, 10);
    if (!isNaN(pageNum) && pageNum > 0) {
      currentPage = pageNum;
    }
  }
}

/**
 * Update URL state
 */
function updateURLState(): void {
  const params = new URLSearchParams();

  if (currentTag) {
    params.set('tag', currentTag);
  }

  if (currentView !== 'grid') {
    params.set('view', currentView);
  }

  if (currentPage > 1) {
    params.set('page', currentPage.toString());
  }

  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;

  window.history.replaceState({}, '', newUrl);
}

/**
 * Update the grid with filtered items
 */
function updateGrid(): void {
  if (!grid) return;

  filteredItems = filterByTag(allItems, currentTag);
  filteredItems = sortByDate(filteredItems);

  grid.items = filteredItems;
  grid.page = currentPage;
  grid.view = currentView;

  // Update item count
  if (itemCount) {
    itemCount.textContent = `${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''}`;
  }

  updateURLState();
}

/**
 * Handle tag selection
 */
function handleTagSelect(e: CustomEvent<{ tag: string | null }>): void {
  currentTag = e.detail.tag;
  currentPage = 1; // Reset to first page
  if (tagFilter) {
    tagFilter.active = currentTag;
  }
  updateGrid();
}

/**
 * Handle page change
 */
function handlePageChange(e: CustomEvent<{ page: number }>): void {
  currentPage = e.detail.page;
  updateURLState();
}

/**
 * Handle card click
 */
function handleCardClick(e: CustomEvent<{ item: ArchiveItem }>): void {
  const item = e.detail.item;
  console.log('Card clicked:', item.id);
  // Future: Open detail view
}

/**
 * Handle view toggle
 */
function setView(view: 'grid' | 'temporal'): void {
  currentView = view;

  if (viewGridBtn && viewTemporalBtn) {
    viewGridBtn.classList.toggle('active', view === 'grid');
    viewTemporalBtn.classList.toggle('active', view === 'temporal');
    viewGridBtn.setAttribute('aria-pressed', (view === 'grid').toString());
    viewTemporalBtn.setAttribute('aria-pressed', (view === 'temporal').toString());
  }

  updateGrid();
}

/**
 * Initialize the archive page
 */
function initArchive(): void {
  // Get DOM elements
  grid = document.getElementById('archive-grid') as ArchiveGrid | null;
  tagFilter = document.getElementById('tag-filter') as TagFilter | null;
  itemCount = document.getElementById('item-count');
  viewGridBtn = document.getElementById('view-grid') as HTMLButtonElement | null;
  viewTemporalBtn = document.getElementById('view-temporal') as HTMLButtonElement | null;

  if (!grid || !tagFilter) {
    console.error('Required elements not found');
    return;
  }

  // Load data
  allItems = archiveData.items as ArchiveItem[];

  // Extract and set tags
  const tags = extractTags(allItems);
  tagFilter.tags = tags;

  // Parse URL state
  parseURLState();
  tagFilter.active = currentTag;

  // Set initial view state
  if (viewGridBtn && viewTemporalBtn) {
    viewGridBtn.classList.toggle('active', currentView === 'grid');
    viewTemporalBtn.classList.toggle('active', currentView === 'temporal');
    viewGridBtn.setAttribute('aria-pressed', (currentView === 'grid').toString());
    viewTemporalBtn.setAttribute('aria-pressed', (currentView === 'temporal').toString());
  }

  // Set up event listeners
  tagFilter.addEventListener('tag-select', handleTagSelect as EventListener);
  grid.addEventListener('page-change', handlePageChange as EventListener);
  grid.addEventListener('card-click', handleCardClick as EventListener);

  viewGridBtn?.addEventListener('click', () => setView('grid'));
  viewTemporalBtn?.addEventListener('click', () => setView('temporal'));

  // Initial render
  updateGrid();
}

/**
 * Initialize when DOM is ready
 */
function init(): void {
  initModalMenu();
  initKeyboardShortcuts();
  initArchive();
  console.log('Archive loaded');
}

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
