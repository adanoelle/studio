# Modal Menu Component Specification

## Overview

A dmenu/rofi-style keyboard-first navigation launcher with dithering effects and glitch aesthetics. Provides instant access to site navigation through fuzzy search and keyboard shortcuts.

## Theoretical Grounding

The modal menu embodies Russell's concept of **glitch as portal** and **refusal of linear navigation**:

- **Non-linear traversal**: Go anywhere, anytime. Navigation is possibility, not corridor.
- **Glitch as threshold**: Modal appears through glitch effects - a liminal space between pages.
- **Multiplicity of paths**: Fuzzy search reveals all destinations simultaneously.
- **Keyboard-first as resistance**: Reclaiming "outdated" CLI patterns as a form of refusal against touch-first design hegemony.

The menu exists in a threshold state - neither fully present nor absent. Its appearance through corruption effects represents crossing between digital spaces, acknowledging that navigation itself is a form of transformation.

## Visual Design

```
┌─────────────────────────────────────────────────┐
│ ▒░▓ DITHER BORDER (corrupted Bayer pattern) ▓░▒ │
│ ┌─────────────────────────────────────────────┐ │
│ │ > _                                         │ │  ← input
│ ├─────────────────────────────────────────────┤ │
│ │   RECENT                                    │ │
│ │   home                              ⌘1      │ │
│ │ → about                             ⌘2      │ │  ← selected (cyan)
│ │   ─────────────────────────────────         │ │
│ │   NAVIGATION                                │ │
│ │   archive                                   │ │
│ │   journal                                   │ │
│ └─────────────────────────────────────────────┘ │
│ ░ Esc close • ↑↓ navigate • Enter select ░     │
└─────────────────────────────────────────────────┘
```

### Color & Effects

- **Backdrop**: Semi-transparent deep purple (`rgba(26, 10, 46, 0.92)`) with backdrop blur (8px on desktop)
- **Container**: Dark background (`#1a0a2e`) with subtle border
- **Dithered border**: Corrupted Bayer pattern using `generateCorruptedBayerSVG()` from `utils/bayer.ts`
- **Chromatic aberration**: Subtle magenta/cyan offset (1-2px) on container edges
- **Selection highlight**: Cyan left border + subtle cyan background tint
- **Search highlighting**: Matched characters wrapped in `<mark>` with magenta color

### Animation States

**Open (~300ms)**:

1. Backdrop fades in (0 → 0.92 opacity)
2. Container slides up from -10px with fade
3. Dither corruption peaks at 50% (0.4 level)
4. Settles to idle state (0.2 corruption)

**Close (~200ms)**:

1. Corruption intensifies briefly (0.5 level)
2. Container fades out + slides up
3. Backdrop fades out

**Selection change**: 80ms transform transition + brief glitch shake on selected item

**Idle glitch**: Rare border corruption (~30s interval, 200-500ms duration)

## Component API

### Properties

| Property          | Type         | Default               | Description                         |
| ----------------- | ------------ | --------------------- | ----------------------------------- |
| `open`            | `boolean`    | `false`               | Menu visibility state               |
| `items`           | `MenuItem[]` | `[]`                  | Navigation items to display         |
| `placeholder`     | `string`     | `"Type to filter..."` | Input placeholder text              |
| `enableDither`    | `boolean`    | `true`                | Enable dithering effects on borders |
| `glitchIntensity` | `number`     | `0.3`                 | Base glitch effect intensity (0-1)  |
| `showRecent`      | `boolean`    | `true`                | Show recent items section           |
| `maxRecent`       | `number`     | `3`                   | Maximum recent items to display     |
| `filterDebounce`  | `number`     | `50`                  | Input debounce time in ms           |

### MenuItem Interface

```typescript
interface MenuItem {
  id: string; // Unique identifier
  label: string; // Display text
  path?: string; // URL/route for navigation
  category?: string; // Section grouping (e.g., "Navigation", "Tools")
  shortcut?: string; // Keyboard shortcut display (e.g., "⌘1")
  keywords?: string[]; // Additional search terms
  action?: () => void; // Custom action instead of navigation
}
```

### Methods

| Method                         | Signature                 | Description                       |
| ------------------------------ | ------------------------- | --------------------------------- |
| `show()`                       | `() => void`              | Open the modal menu               |
| `hide()`                       | `() => void`              | Close the modal menu              |
| `toggle()`                     | `() => void`              | Toggle open/close state           |
| `focusInput()`                 | `() => void`              | Focus the search input            |
| `clearFilter()`                | `() => void`              | Clear current filter text         |
| `getSelectedItem()`            | `() => MenuItem \| null`  | Get currently selected item       |
| `selectByIndex(index: number)` | `(index: number) => void` | Select item by index              |
| `confirmSelection()`           | `() => void`              | Trigger selection of current item |

### Events

| Event              | Detail                                                | Description                         |
| ------------------ | ----------------------------------------------------- | ----------------------------------- |
| `modal-open`       | `{ }`                                                 | Fired when menu opens               |
| `modal-close`      | `{ reason: 'escape' \| 'select' \| 'click-outside' }` | Fired when menu closes              |
| `item-select`      | `{ item: MenuItem }`                                  | Fired when item is selected         |
| `filter-change`    | `{ query: string, results: MenuItem[] }`              | Fired when filter changes           |
| `selection-change` | `{ item: MenuItem, index: number }`                   | Fired when keyboard selection moves |

### CSS Custom Properties

```css
/* Container */
--modal-menu-backdrop-color: rgba(26, 10, 46, 0.92);
--modal-menu-background: #1a0a2e;
--modal-menu-border-color: #3a2a4e;
--modal-menu-width: min(90vw, 500px);

/* Input */
--modal-menu-input-background: transparent;
--modal-menu-input-color: var(--text-primary);
--modal-menu-placeholder-color: var(--text-secondary);

/* Items */
--modal-menu-item-color: var(--text-primary);
--modal-menu-item-hover: rgba(0, 255, 255, 0.1);
--modal-menu-item-selected: rgba(0, 255, 255, 0.15);
--modal-menu-category-color: var(--text-secondary);

/* Glitch colors */
--modal-menu-highlight-color: var(--glitch-magenta);
--modal-menu-selection-accent: var(--glitch-cyan);
```

## Keyboard Navigation

| Key                       | Action                                         |
| ------------------------- | ---------------------------------------------- |
| `⌘/Ctrl + K`              | Global: Open menu (requires external listener) |
| `Escape`                  | Close menu                                     |
| `↓` / `j`                 | Move selection down                            |
| `↑` / `k`                 | Move selection up                              |
| `Enter`                   | Confirm current selection                      |
| `⌘/Ctrl + 1-9`            | Quick select recent item by position           |
| `Backspace` (empty input) | Close menu                                     |

## Fuzzy Search

The component implements fuzzy matching that:

1. Matches characters in order, but not necessarily contiguous
2. Prioritizes matches at word boundaries
3. Searches both `label` and `keywords` fields
4. Highlights matched characters with `<mark>` elements

Example: Query "arc" matches "**a**rchive", "t**a**sk-t**r**a**c**ker", etc.

## Recent Items

- Recent selections stored in localStorage under key `modal-menu-recent`
- Maximum items configurable via `maxRecent` property
- Displayed in separate "RECENT" section when `showRecent` is true
- Quick accessible via `⌘1-9` shortcuts

## Accessibility

### ARIA Attributes

```html
<div role="dialog" aria-modal="true" aria-label="Navigation menu">
  <input
    role="combobox"
    aria-expanded="true"
    aria-controls="menu-listbox"
    aria-activedescendant="item-{id}"
  />
  <ul role="listbox" id="menu-listbox">
    <li role="option" id="item-{id}" aria-selected="true|false">...</li>
  </ul>
</div>
```

### Focus Management

- Focus trapped within modal when open
- Focus moves to input on open
- Focus restored to previously focused element on close
- Arrow keys navigate without losing input focus

### Screen Reader Announcements

- Announce when modal opens: "Navigation menu opened. Type to filter."
- Announce selection changes: "{label}, {index} of {total}"
- Announce on close: "Navigation menu closed"

### Reduced Motion

When `prefers-reduced-motion: reduce`:

- Instant open/close (no slide animation)
- No idle glitch effects
- No chromatic aberration animation
- Selection changes instantly (no shake effect)

### Color Contrast

All text meets WCAG AA contrast requirements:

- Regular text: 4.5:1 minimum
- Large text: 3:1 minimum
- Focus indicators: 3:1 minimum

## Performance

### Optimizations

- Extends `GlitchBase` for visibility/RAF/motion detection
- Memoized fuzzy search results (only recalculate on query change)
- Dither pattern cached and only regenerated on corruption level change
- Items lazy-loaded until first open
- Debounced input handling

### Mobile Optimizations

- Static dither pattern (no animation)
- No backdrop blur (performance)
- 48px minimum touch targets
- Simplified animations

### Desktop

- 20fps dither animation when visible
- Backdrop blur enabled
- Full animation suite

## Implementation Notes

### Dependencies

- `GlitchBase` - Base class from `./glitch-base.ts`
- `generateCorruptedBayerSVG`, `BAYER_MATRIX_4` from `../utils/bayer.ts`
- `styleMap` directive from `lit/directives/style-map.js`

### File Structure

```
packages/design-system/src/glitch/
├── modal-menu.ts        # Main component
├── modal-menu.test.ts   # Tests
└── index.ts             # Add export
```

## Usage Examples

### Basic Usage

```html
<modal-menu
  .items=${[
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'archive', label: 'Archive', path: '/archive' }
  ]}
></modal-menu>
```

### With Categories

```html
<modal-menu
  .items=${[
    { id: 'home', label: 'Home', path: '/', category: 'Navigation' },
    { id: 'about', label: 'About', path: '/about', category: 'Navigation' },
    { id: 'search', label: 'Search', action: openSearch, category: 'Tools' }
  ]}
></modal-menu>
```

### Programmatic Control

```typescript
const menu = document.querySelector('modal-menu');

// Open with keyboard shortcut
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    menu.toggle();
  }
});

// Listen for selection
menu.addEventListener('item-select', (e) => {
  const { item } = e.detail;
  if (item.path) {
    window.location.href = item.path;
  }
});
```

## Test Plan

1. **Rendering**: Component renders with default props
2. **Open/Close**: `⌘K` opens, `Escape` closes
3. **Fuzzy filter**: "arc" matches "archive"
4. **Keyboard navigation**: `j/k` and arrows navigate selection
5. **Selection**: `Enter` selects and fires `item-select` event
6. **Recent items**: Persist across page refresh in localStorage
7. **Reduced motion**: Respects `prefers-reduced-motion`
8. **Focus trap**: Tab cycles within modal
9. **Screen reader**: State changes announced
10. **Mobile**: Touch targets >= 48px, no blur
