# Archive Page Design Document

## Overview

The archive is a content-primary collection of creative work, inspired by are.na's block/channel model. It presents photography, writing, sound, and code in two complementary views: **taxonomy** (grid filtered by tag) and **temporal** (river of time by year).

## Theoretical Grounding

### Memory as Living Presence

The archive embodies Russell's concept of **multiplicity** - items exist in multiple contexts simultaneously through tags. Like the waveform's ghost peaks, past work leaves traces that persist and inform the present. This is not a tomb or museum - it's a living garden where past and present coexist.

### Worldtraveling Through Content

Switching between temporal and taxonomy views is **worldtraveling** (Lugones) - seeing the same content through different lenses, neither more "true" than the other. The year 2024 is one world; the tag "photography" is another. Items exist in both simultaneously.

### Glitch at the Boundary, Not the Content

Following the design principle of **content-first**, glitch effects appear at card boundaries on interaction, never distracting from the work itself. The archive respects the content it holds while maintaining the site's visual identity.

---

## Visual Design

### Grid View (Taxonomy)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ░▒▓ VOID (dithered background) ▓▒░                                  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ░ GLITCH BORDER ░                                           │   │
│  │ ┌─────────────────────────────────────────────────────────┐ │   │
│  │ │                                                         │ │   │
│  │ │  [all]  [photography]  [writing]  [sound]  [code]      │ │   │
│  │ │    ↑ active (cyan underline)                            │ │   │
│  │ │                                                         │ │   │
│  │ │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │ │   │
│  │ │  │              │ │              │ │     ≋≋≋≋     │   │ │   │
│  │ │  │    image     │ │    image     │ │   waveform   │   │ │   │
│  │ │  │              │ │              │ │     ≋≋≋≋     │   │ │   │
│  │ │  ├──────────────┤ ├──────────────┤ ├──────────────┤   │ │   │
│  │ │  │ Image        │ │ Image        │ │ Sound        │   │ │   │
│  │ │  │ Jan 21, 2026 │ │ Jan 21, 2026 │ │ Jan 15, 2026 │   │ │   │
│  │ │  └──────────────┘ └──────────────┘ └──────────────┘   │ │   │
│  │ │                                                         │ │   │
│  │ │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │ │   │
│  │ │  │  "Title of   │ │              │ │   { code }   │   │ │   │
│  │ │  │   Writing"   │ │    image     │ │    icon      │   │ │   │
│  │ │  │   excerpt... │ │              │ │              │   │ │   │
│  │ │  ├──────────────┤ ├──────────────┤ ├──────────────┤   │ │   │
│  │ │  │ Writing      │ │ Image        │ │ Code         │   │ │   │
│  │ │  │ Jan 10, 2026 │ │ Jan 8, 2026  │ │ Dec 20, 2025 │   │ │   │
│  │ │  └──────────────┘ └──────────────┘ └──────────────┘   │ │   │
│  │ │                                                         │ │   │
│  │ └─────────────────────────────────────────────────────────┘ │   │
│  │ ┌─────────────────────────────────────────────────────────┐ │   │
│  │ │ ~/archive  │  47 items  │  grid  │  ⌘K navigate        │ │   │
│  │ └─────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Temporal View

```
┌─────────────────────────────────────────────────────────────────────┐
│ ░▒▓ VOID ▓▒░                                                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ░ GLITCH BORDER ░                                           │   │
│  │ ┌─────────────────────────────────────────────────────────┐ │   │
│  │ │                                                         │ │   │
│  │ │  [all]  [photography]  [writing]  [sound]  [code]      │ │   │
│  │ │                                                         │ │   │
│  │ │  2026 ─────────────────────────────────────────────    │ │   │
│  │ │                                                         │ │   │
│  │ │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │ │   │
│  │ │  │    image     │ │    image     │ │   writing    │   │ │   │
│  │ │  └──────────────┘ └──────────────┘ └──────────────┘   │ │   │
│  │ │                                                         │ │   │
│  │ │  2025 ─────────────────────────────────────────────    │ │   │
│  │ │                                                         │ │   │
│  │ │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │ │   │
│  │ │  │    code      │ │    sound     │ │    image     │   │ │   │
│  │ │  └──────────────┘ └──────────────┘ └──────────────┘   │ │   │
│  │ │                                                         │ │   │
│  │ └─────────────────────────────────────────────────────────┘ │   │
│  │ ┌─────────────────────────────────────────────────────────┐ │   │
│  │ │ ~/archive  │  47 items  │  temporal  │  ⌘K navigate    │ │   │
│  │ └─────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Detail View

```
┌─────────────────────────────────────────────────────────────────────┐
│ ░▒▓ VOID ▓▒░                                                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ░ GLITCH BORDER ░                                           │   │
│  │ ┌─────────────────────────────────────────────────────────┐ │   │
│  │ │                                                         │ │   │
│  │ │  ┌────────────────────────────────┐                    │ │   │
│  │ │  │ ░ CONTENT BORDER ░          ⋯  │   Archived         │ │   │
│  │ │  │ ┌────────────────────────────┐ │   January 21, 2026 │ │   │
│  │ │  │ │                            │ │                    │ │   │
│  │ │  │ │                            │ │   Type             │ │   │
│  │ │  │ │                            │ │   Image            │ │   │
│  │ │  │ │      [ CONTENT ]           │ │                    │ │   │
│  │ │  │ │                            │ │   Tags             │ │   │
│  │ │  │ │                            │ │   restaurant       │ │   │
│  │ │  │ │                            │ │   photography      │ │   │
│  │ │  │ └────────────────────────────┘ │                    │ │   │
│  │ │  └────────────────────────────────┘                    │ │   │
│  │ │                                                         │ │   │
│  │ │  ────────────────────────────────────────────────────  │ │   │
│  │ │                                                         │ │   │
│  │ │  NOTES                                                  │ │   │
│  │ │  Wooden bar set in an "L" shaped configuration.        │ │   │
│  │ │                                                         │ │   │
│  │ └─────────────────────────────────────────────────────────┘ │   │
│  │ ┌─────────────────────────────────────────────────────────┐ │   │
│  │ │ ~/archive/restaurant-bar  │  ◀ archive  │  ⌘K          │ │   │
│  │ └─────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Color & Effects

### Background

Same void treatment as homepage:

- `background-color: var(--color-dark)` (#3a3632)
- `background-image: var(--dither-void-cool)` - 4×4 Bayer pattern
- Void responds to boundary hover with subtle corruption

### Cards

| Element         | Color                   | Notes                 |
| --------------- | ----------------------- | --------------------- |
| Card background | `var(--bg-primary)`     | Warm cream (#dfc8ba)  |
| Card border     | `var(--color-muted)`    | Via `<glitch-border>` |
| Type label      | `var(--text-secondary)` | Muted, secondary info |
| Date            | `var(--text-tertiary)`  | Even more muted       |
| Hover border    | Chromatic shift         | Subtle magenta/cyan   |

### Tag Pills

| State   | Style                                                       |
| ------- | ----------------------------------------------------------- |
| Default | Transparent bg, `var(--text-secondary)` text, subtle border |
| Hover   | `var(--bg-secondary)` background                            |
| Active  | `var(--accent)` underline, `var(--text-primary)` text       |
| Focus   | `var(--glitch-cyan)` outline                                |

### Metadata Sidebar (Detail View)

| Element | Style                                    |
| ------- | ---------------------------------------- |
| Labels  | `var(--text-tertiary)`, uppercase, small |
| Values  | `var(--text-primary)`                    |
| Tags    | Clickable pills, same style as filter    |

---

## Card Types

### Image Card

```
┌────────────────────┐
│                    │
│   ┌────────────┐   │
│   │            │   │
│   │  thumbnail │   │  ← aspect-ratio: 4/3, object-fit: cover
│   │            │   │
│   └────────────┘   │
│                    │
├────────────────────┤
│ Image              │  ← type label
│ Jan 21, 2026       │  ← date
└────────────────────┘
```

### Writing Card

```
┌────────────────────┐
│                    │
│  "Title of the     │  ← title in quotes, glitch-text
│   Writing Piece"   │
│                    │
│  First line of     │  ← excerpt, 2-3 lines max
│  the excerpt...    │
│                    │
├────────────────────┤
│ Writing            │
│ Jan 10, 2026       │
└────────────────────┘
```

### Sound Card

```
┌────────────────────┐
│                    │
│   ┌────────────┐   │
│   │ ≋≋≋≋≋≋≋≋≋≋ │   │  ← static waveform preview
│   │ ≋≋≋≋≋≋≋≋≋≋ │   │    (not animated until hover)
│   └────────────┘   │
│      2:34          │  ← duration
│                    │
├────────────────────┤
│ Sound              │
│ Jan 15, 2026       │
└────────────────────┘
```

### Code Card

```
┌────────────────────┐
│                    │
│      ┌────┐        │
│      │ <> │        │  ← code icon or language logo
│      └────┘        │
│                    │
│  project-name      │  ← repo/project name
│                    │
├────────────────────┤
│ Code               │
│ Dec 20, 2025       │
└────────────────────┘
```

---

## Data Model

```typescript
/**
 * Base interface for all archive items
 */
interface ArchiveItemBase {
  id: string; // URL-safe slug
  type: 'image' | 'writing' | 'sound' | 'code';
  title: string;
  date: string; // ISO 8601 date string
  tags: string[]; // Multiple tags (multiplicity)
  notes?: string; // Description/context (markdown)
}

/**
 * Image-specific fields
 */
interface ImageItem extends ArchiveItemBase {
  type: 'image';
  src: string; // Full image URL
  thumbnail?: string; // Optional smaller version
  alt: string; // Alt text (required for a11y)
  dimensions?: {
    width: number;
    height: number;
  };
}

/**
 * Writing-specific fields
 */
interface WritingItem extends ArchiveItemBase {
  type: 'writing';
  excerpt: string; // First ~100 chars for card
  content: string; // Full text (markdown)
  readingTime?: number; // Minutes
}

/**
 * Sound-specific fields
 */
interface SoundItem extends ArchiveItemBase {
  type: 'sound';
  src: string; // Audio file URL
  duration: number; // Seconds
  waveform?: number[]; // Pre-computed waveform data (0-1)
}

/**
 * Code-specific fields
 */
interface CodeItem extends ArchiveItemBase {
  type: 'code';
  repo?: string; // GitHub URL
  demo?: string; // Live demo URL
  language?: string; // Primary language
  description: string; // Short description
}

type ArchiveItem = ImageItem | WritingItem | SoundItem | CodeItem;
```

---

## Components

### `<archive-page>`

Top-level page component that orchestrates the archive experience.

#### Properties

| Property    | Type                   | Default  | Description            |
| ----------- | ---------------------- | -------- | ---------------------- |
| `items`     | `ArchiveItem[]`        | `[]`     | All archive items      |
| `view`      | `'grid' \| 'temporal'` | `'grid'` | Current view mode      |
| `activeTag` | `string \| null`       | `null`   | Currently filtered tag |

#### Events

| Event         | Detail                           | Description        |
| ------------- | -------------------------------- | ------------------ |
| `view-change` | `{ view: 'grid' \| 'temporal' }` | View mode changed  |
| `tag-change`  | `{ tag: string \| null }`        | Filter tag changed |
| `item-select` | `{ item: ArchiveItem }`          | Item clicked       |

---

### `<archive-grid>`

Responsive grid container with CSS Grid layout.

#### Properties

| Property  | Type                   | Default          | Description              |
| --------- | ---------------------- | ---------------- | ------------------------ |
| `items`   | `ArchiveItem[]`        | `[]`             | Items to display         |
| `view`    | `'grid' \| 'temporal'` | `'grid'`         | Layout mode              |
| `columns` | `number`               | `3`              | Max columns (responsive) |
| `gap`     | `string`               | `var(--space-6)` | Grid gap                 |

#### CSS Custom Properties

```css
--archive-grid-columns: 3;
--archive-grid-gap: var(--space-6);
--archive-grid-min-card-width: 280px;
```

---

### `<archive-card>`

Individual item card with type-specific preview.

#### Properties

| Property   | Type          | Default  | Description         |
| ---------- | ------------- | -------- | ------------------- |
| `item`     | `ArchiveItem` | required | Item data           |
| `showDate` | `boolean`     | `true`   | Show date in footer |

#### Events

| Event        | Detail                  | Description  |
| ------------ | ----------------------- | ------------ |
| `card-click` | `{ item: ArchiveItem }` | Card clicked |

#### Slots

| Slot      | Description            |
| --------- | ---------------------- |
| `preview` | Custom preview content |
| `footer`  | Custom footer content  |

---

### `<tag-filter>`

Horizontal list of filterable tag pills.

#### Properties

| Property  | Type             | Default | Description          |
| --------- | ---------------- | ------- | -------------------- |
| `tags`    | `string[]`       | `[]`    | Available tags       |
| `active`  | `string \| null` | `null`  | Currently active tag |
| `showAll` | `boolean`        | `true`  | Show "all" option    |

#### Events

| Event        | Detail                    | Description               |
| ------------ | ------------------------- | ------------------------- |
| `tag-select` | `{ tag: string \| null }` | Tag selected (null = all) |

---

### `<year-header>`

Year divider for temporal view with sticky behavior.

#### Properties

| Property | Type      | Default  | Description               |
| -------- | --------- | -------- | ------------------------- |
| `year`   | `number`  | required | Year to display           |
| `sticky` | `boolean` | `true`   | Enable sticky positioning |

---

### `<archive-detail>`

Detail view layout for single item display.

#### Properties

| Property | Type          | Default  | Description     |
| -------- | ------------- | -------- | --------------- |
| `item`   | `ArchiveItem` | required | Item to display |

#### Events

| Event        | Detail                  | Description              |
| ------------ | ----------------------- | ------------------------ |
| `close`      | `{}`                    | Close requested (Escape) |
| `fullscreen` | `{ item: ArchiveItem }` | Fullscreen requested     |
| `tag-click`  | `{ tag: string }`       | Tag clicked in sidebar   |

#### Slots

| Slot       | Description       |
| ---------- | ----------------- |
| `content`  | Main content area |
| `metadata` | Sidebar metadata  |
| `notes`    | Notes section     |

---

## Interaction States

### Card Hover

```
Default state:
┌────────────────────┐
│ [content]          │  border: var(--color-muted)
└────────────────────┘

Hover state (150ms transition):
┌────────────────────┐
│ [content]          │  border: chromatic shift (subtle)
└────────────────────┘  glitch-border activates
                       cursor: pointer
```

### Card Focus (Keyboard)

```
┌────────────────────┐
│ [content]          │  outline: 2px solid var(--glitch-cyan)
└────────────────────┘  outline-offset: 2px
```

### Tag States

```
[photography]     Default: transparent, muted text
[photography]     Hover: subtle background
[photography]     Active: cyan underline, primary text
─────────────
```

### Filter Transition

When tag changes:

1. Items that don't match fade out (opacity 0, 150ms)
2. Grid reflows instantly (no animation)
3. Matching items are already visible

This is **instant filtering** - no fancy animations, content-first.

---

## Keyboard Navigation

### Grid View

| Key                  | Action                          |
| -------------------- | ------------------------------- |
| `Tab`                | Move between tag pills and grid |
| `Arrow keys`         | Navigate within tag pills       |
| `Enter` on tag       | Select/deselect tag filter      |
| `Arrow keys` in grid | Navigate between cards          |
| `Enter` on card      | Open detail view                |
| `⌘K`                 | Open navigation menu            |

### Detail View

| Key                | Action               |
| ------------------ | -------------------- |
| `Escape`           | Return to grid       |
| `Enter` on content | Fullscreen (images)  |
| `Space`            | Play/pause (sound)   |
| `←` `→`            | Previous/next item   |
| `⌘K`               | Open navigation menu |

### Fullscreen

| Key      | Action              |
| -------- | ------------------- |
| `Escape` | Exit fullscreen     |
| `←` `→`  | Previous/next image |

---

## URL Structure

```
/archive                        # Grid view, all items
/archive?tag=photography        # Filtered by tag
/archive?view=temporal          # Temporal view
/archive?view=temporal&tag=code # Combined filters
/archive/[item-slug]            # Detail view
```

State is reflected in URL for shareability and back button support.

---

## Responsive Behavior

### Breakpoints

| Breakpoint          | Grid      | Card       | Notes            |
| ------------------- | --------- | ---------- | ---------------- |
| Desktop (≥1024px)   | 3 columns | ~300px     | Full layout      |
| Tablet (768-1023px) | 2 columns | ~350px     | Narrower sidebar |
| Mobile (<768px)     | 1 column  | Full width | Stacked layout   |

### Mobile Adaptations

- Tag pills scroll horizontally
- Detail view: content stacked above metadata
- Touch targets minimum 44px
- Swipe left/right for prev/next in detail view

### Detail View Responsive

```
Desktop:                          Mobile:
┌──────────────────────────┐     ┌────────────────┐
│ ┌────────────┐  Metadata │     │ [content]      │
│ │            │  ──────── │     │                │
│ │  content   │  Date     │     ├────────────────┤
│ │            │  Type     │     │ Metadata       │
│ └────────────┘  Tags     │     │ Date | Type    │
│                          │     │ Tags: x, y     │
│ ─────────────────────────│     ├────────────────┤
│ NOTES                    │     │ NOTES          │
│ ...                      │     │ ...            │
└──────────────────────────┘     └────────────────┘
```

---

## Accessibility

### Semantic Structure

```html
<main class="archive-page">
  <nav class="tag-filter" aria-label="Filter by tag">
    <button aria-pressed="true">all</button>
    <button aria-pressed="false">photography</button>
    ...
  </nav>

  <section aria-label="Archive items">
    <ul class="archive-grid" role="list">
      <li>
        <article class="archive-card">
          <a href="/archive/item-slug" aria-label="Restaurant bar, Image, January 21 2026"> ... </a>
        </article>
      </li>
    </ul>
  </section>
</main>
```

### Screen Reader Announcements

- Tag filter: "Filter by photography, 12 items"
- Card: "Restaurant bar, Image, January 21 2026"
- View change: "Showing temporal view"
- Detail open: "Viewing Restaurant bar, Image"

### Focus Management

- Focus moves to first card when tag filter changes
- Focus moves to detail content when opening
- Focus returns to triggering card when closing detail

### Reduced Motion

When `prefers-reduced-motion: reduce`:

- No hover glitch effects on cards
- Instant filter changes (no fade)
- No chromatic aberration animation
- Static waveform in sound cards

### Color Contrast

All text meets WCAG AA:

- Primary text on cream: 7:1
- Secondary text on cream: 4.5:1
- Tags on dark background: 4.5:1

---

## Performance

### Image Loading

- Thumbnails: 400px width, WebP format
- Lazy loading with `loading="lazy"`
- Blur placeholder while loading
- Full images load on detail view

### Virtualization

For archives with 100+ items:

- Consider virtual scrolling
- Render only visible cards + buffer
- Maintain scroll position on filter change

### Animation Budget

- Card hover: CSS only, no JS
- Filter: instant (no animation)
- Glitch effects: 20fps max, visibility-gated

### Caching

- Static JSON cached at build time
- Images cached with service worker
- Filter state in URL (shareable)

---

## Empty & Loading States

### Empty State (No Items)

```
┌────────────────────────────────────┐
│                                    │
│           ~/archive                │
│                                    │
│      The archive is empty.         │
│                                    │
│   Nothing here yet. Check back     │
│   later or explore other areas.    │
│                                    │
│           [Go home]                │
│                                    │
└────────────────────────────────────┘
```

### Empty Filter (No Matches)

```
┌────────────────────────────────────┐
│                                    │
│  [all] [photography] [writing]...  │
│                                    │
│     No items match "sound"         │
│                                    │
│     Try another tag or view all.   │
│                                    │
│          [Show all]                │
│                                    │
└────────────────────────────────────┘
```

### Loading State

```
┌────────────────────────────────────┐
│                                    │
│  ┌──────────┐ ┌──────────┐        │
│  │ ░░░░░░░░ │ │ ░░░░░░░░ │        │  ← skeleton cards
│  │ ░░░░░░░░ │ │ ░░░░░░░░ │        │    with dither pattern
│  └──────────┘ └──────────┘        │
│                                    │
└────────────────────────────────────┘
```

---

## Data Storage

### Phase 1: Static JSON

```
apps/website/src/data/archive.json
```

Simple array of ArchiveItem objects. Build-time data, no runtime fetching.

```json
{
  "items": [
    {
      "id": "restaurant-bar",
      "type": "image",
      "title": "Restaurant Bar",
      "date": "2026-01-21",
      "tags": ["photography", "restaurant"],
      "src": "/archive/images/restaurant-bar.jpg",
      "alt": "Wooden bar set in an L-shaped configuration"
    }
  ]
}
```

### Future: API Backend

Design components to accept data via props, making backend swappable:

```typescript
// Current (static)
import archiveData from './data/archive.json';
<archive-page .items=${archiveData.items} />

// Future (API)
const items = await fetch('/api/archive').then(r => r.json());
<archive-page .items=${items} />
```

---

## Implementation Phases

### Phase 1: Static Grid MVP

- [ ] `<archive-page>` shell with routing
- [ ] `<archive-grid>` responsive grid
- [ ] `<archive-card>` with image type only
- [ ] Static JSON data
- [ ] Basic styling matching design system

### Phase 2: All Card Types

- [ ] Writing card with excerpt
- [ ] Sound card with static waveform
- [ ] Code card with icon
- [ ] Type-specific styling

### Phase 3: Filtering & Views

- [ ] `<tag-filter>` component
- [ ] URL state management
- [ ] Temporal view with `<year-header>`
- [ ] View toggle in status bar

### Phase 4: Detail View

- [ ] `<archive-detail>` layout
- [ ] Type-specific content renderers
- [ ] Fullscreen mode for images
- [ ] Audio player for sound
- [ ] Navigation (prev/next, back)

### Phase 5: Polish

- [ ] Empty states
- [ ] Loading skeletons
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Performance optimization

---

## Test Plan

### Unit Tests

1. `<archive-card>` renders each type correctly
2. `<tag-filter>` emits correct events
3. `<archive-grid>` handles empty state
4. URL state reflects filter/view

### Integration Tests

1. Filter by tag shows correct items
2. View toggle preserves filter
3. Detail view opens from card click
4. Back navigation returns to correct scroll position

### Accessibility Tests

1. Keyboard navigation through grid
2. Screen reader announces cards correctly
3. Focus management on view changes
4. Reduced motion respected

### Visual Regression

1. Card layouts at each breakpoint
2. Hover/focus states
3. Empty states
4. Detail view layouts

---

## Open Questions

1. **Sorting**: Should temporal view allow reverse chronological?
2. **Search**: Add fuzzy search in addition to tag filter?
3. **Pagination**: Infinite scroll vs. load more vs. pagination?
4. **Related items**: Show related items in detail view sidebar?
5. **Edit capability**: Future admin interface for adding items?
