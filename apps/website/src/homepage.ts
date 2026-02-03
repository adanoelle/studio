/**
 * Homepage Entry Point
 *
 * Sets up the modal-menu navigation, global keyboard shortcuts,
 * and ambient audio controller.
 *
 * THEORETICAL GROUNDING:
 * ⌘K navigation embodies keyboard-first as resistance - reclaiming
 * "outdated" CLI patterns in a world dominated by touch interfaces.
 * The menu exists as threshold space between pages.
 *
 * Ambient audio creates presence - a gentle soundscape that marks
 * the threshold of entering this space, creating intimacy without intrusion.
 */

import '@studio/design-system';
import type { ModalMenu, MenuItem, GlitchWaveform } from '@studio/design-system/glitch';
import { HomepageAudio } from './homepage-audio.js';

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

// Audio controller instance
const audio = new HomepageAudio();

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

  // Duck audio when modal opens/closes
  menu.addEventListener('modal-open', () => {
    if (audio.isPlaying()) {
      audio.setVolume(audio.getVolume() * 0.5);
    }
  });

  menu.addEventListener('modal-close', () => {
    const state = audio.loadState();
    audio.setVolume(state.volume);
  });
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
 * Initialize the audio controls
 */
function initAudio(): void {
  const frame = document.getElementById('audio-player-frame') as HTMLElement | null;
  const player = document.getElementById('audio-player') as HTMLElement | null;
  const btn = document.getElementById('audio-toggle') as HTMLButtonElement | null;
  const waveform = document.getElementById('waveform') as GlitchWaveform | null;
  const label = document.getElementById('audio-label') as HTMLElement | null;

  if (!frame || !player || !btn) {
    console.warn('Audio player elements not found');
    return;
  }

  // Restore saved state
  const savedState = audio.loadState();
  audio.setVolume(savedState.volume);

  /**
   * Toggle audio playback
   */
  async function toggleAudio(): Promise<void> {
    // Initialize audio context on first click (requires user gesture)
    if (!audio.isInitialized()) {
      await audio.init();
      const analyser = audio.getAnalyser();
      if (analyser && waveform) {
        waveform.connectAnalyser(analyser);
      }
    }

    // Toggle playback
    if (audio.isPlaying()) {
      audio.pause();
      frame!.classList.remove('playing');
      btn!.classList.remove('playing');
      btn!.setAttribute('aria-label', 'Play ambient music');
      if (waveform) waveform.playing = false;
      if (label) label.textContent = 'click to play';
    } else {
      audio.play();
      frame!.classList.add('playing');
      btn!.classList.add('playing');
      btn!.setAttribute('aria-label', 'Pause ambient music');
      if (waveform) waveform.playing = true;
      if (label) label.textContent = 'playing';
    }
  }

  // Click on button toggles
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleAudio();
  });

  // Click on player container (but not button) also toggles
  player.addEventListener('click', (e) => {
    if (e.target !== btn) {
      toggleAudio();
    }
  });
}

/**
 * Initialize when DOM is ready
 */
function init(): void {
  initModalMenu();
  initKeyboardShortcuts();
  initAudio();
  console.log('Homepage loaded');
}

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
