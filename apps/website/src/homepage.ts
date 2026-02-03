/**
 * Homepage Entry Point
 *
 * Sets up the modal-menu navigation and global keyboard shortcuts.
 *
 * THEORETICAL GROUNDING:
 * ⌘K navigation embodies keyboard-first as resistance - reclaiming
 * "outdated" CLI patterns in a world dominated by touch interfaces.
 * The menu exists as threshold space between pages.
 */

import '@studio/design-system';
import type { ModalMenu, MenuItem } from '@studio/design-system/glitch';

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
    path: '#',
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

/**
 * Initialize the modal menu with navigation items
 */
function initModalMenu(): void {
  const menu = document.getElementById('nav-menu') as ModalMenu | null;

  if (!menu) {
    console.warn('Modal menu element not found');
    return;
  }

  // Configure menu
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
    // ⌘K or Ctrl+K to toggle menu
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      menu?.toggle();
    }
  });
}

/**
 * Initialize when DOM is ready
 */
function init(): void {
  initModalMenu();
  initKeyboardShortcuts();
  console.log('Homepage loaded');
}

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
