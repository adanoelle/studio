# UX Design Exploration: Terminal Quest + Holographic Shell + Unix RPG Dialog

This document captures the design exploration for the website's UX architecture,
combining influences from tiling window managers, RPG dialog systems, PC-98
aesthetics, and Hyper Light Drifter.

> **Deferred Features**: The following elements from this exploration are deferred:
>
> - **Guide character** - See `archive/GUIDE-CHARACTER-DESIGN.md`
> - **Tiled windows** - Complex multi-pane layouts deferred to future phase
> - **World-switching** - See `archive/THEORETICAL-FRAMEWORK-WORLDTRAVELING.md`

---

## Core Principles

1. **Content-primary**: Minimal chrome, content fills the space
2. **Non-linear exploration**: Visitors choose their own path
3. **Glitch at the boundary**: Effects happen at the frame, not distracting from
   content
4. **are.na influence**: Resists attention-seeking, generous whitespace
5. **Tiling WM philosophy**: Keyboard-driven, efficient, no wasted space

---

## The Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ ░▒▓█ OUTER BOUNDARY - pixel art frame, glitches █▓▒░            │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                                                             │ │
│ │                    CONTENT AREA                             │ │
│ │                                                             │ │
│ │    (minimal chrome, content-primary)                        │ │
│ │                                                             │ │
│ │         ┌───────────────────────────┐                       │ │
│ │         │   MODAL MENU (dmenu/rofi  │                       │ │
│ │         │   style, launches pages   │                       │ │
│ │         │   or spawns tile windows) │                       │ │
│ │         └───────────────────────────┘                       │ │
│ │                                                             │ │
│ │    [tiled windows can appear here when spawned]             │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ STATUS BAR: ~/archive/photos │ ◀ blog ◀ home │ [≡] │ 23:42  │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
           ↑ glitches at the boundary (chromatic, dither corruption)
```

---

## Component Breakdown

### 1. Outer Boundary (The Membrane)

**What it is**: A pixel art frame around the entire viewport - the edge between your
crafted space and the wider internet.

**UX it enables**:

- Immediate signal: "you've entered a hand-made space"
- The glitch happens at the _boundary_, not the content
- Creates a sense of interiority (inside vs outside)

**Behavior**:

- Subtle idle animation (gentle shimmer, occasional chromatic flicker)
- Intensifies on certain actions (page transitions, opening modals)
- Could respond to scroll position (more corruption as you go deeper?)
- **Disappears on fullscreen media view** (click to escape, boundary returns on exit)

**Implementation**:

- Fixed position frame (CSS border-image with 9-slice pixel art)
- Glitch effects via CSS animations + occasional JS triggers
- Relatively simple - it's just a frame

---

### 2. Modal Menu (The Launcher)

**What it is**: dmenu/rofi-style popup. Keyboard-invokable, minimal, functional.

**UX it enables**:

- Fast navigation (type to filter)
- Non-linear exploration (go anywhere anytime)
- Spawning tiled views (archive + about side-by-side?)

**Behavior**:

```
[Press ⌘K or click ≡]

┌─────────────────────────────────────┐
│ > _                                 │
├─────────────────────────────────────┤
│   home                              │
│   archive                           │
│   archive/photos                    │
│   archive/writing                   │
│   about                             │
│   now                               │
│   ──────────────────                │
│   [spawn tile: archive + about]     │
└─────────────────────────────────────┘
```

**Implementation**:

- Medium complexity
- Fuzzy search over page list
- Keyboard navigation (j/k or arrows)
- Could be a web component: `<modal-launcher>`

---

### 3. Tiled Windows (Optional Complexity - Defer)

**What it is**: Ability to view multiple "pages" side-by-side within the viewport.

**UX it enables**:

- Compare archive items
- Read about while viewing work
- Power-user exploration

**Behavior**:

```
┌─────────────────────┬─────────────────────┐
│ archive/2024        │ about               │
├─────────────────────┼─────────────────────┤
│                     │                     │
│  [photo grid]       │  [bio text]         │
│                     │                     │
│                     │                     │
└─────────────────────┴─────────────────────┘
```

**Implementation**:

- Higher complexity (layout engine, state management)
- **Recommendation: Defer this** - start with single-page, add tiling later
- Or: simple two-column split only (not full tiling)

---

### 4. Status Bar (Location + History Stack)

**What it is**: Unix-style status line showing where you are + breadcrumb stack.

**UX it enables**:

- Always know where you are
- Quick back-navigation through your trail
- At-a-glance metadata

**Behavior**:

```
┌────────────────────────────────────────────────────────────────┐
│ ~/archive/photos/2024 │ ◀ archive ◀ home │ items: 47 │ [≡] ⌘K │
└────────────────────────────────────────────────────────────────┘
  ↑ current path         ↑ clickable stack    ↑ context  ↑ menu
```

**The stack**: Not browser history, but _your_ navigation trail within the site.
Clicking "archive" in the stack returns you there. Stack could be limited (last 5?)
or show full trail.

**Implementation**:

- Low-medium complexity
- Session state for the stack
- Web component: `<status-bar>`

---

### 5. Archive (The are.na-influenced space)

**What it is**: A content-primary grid of your selected works, with multiple views.

**Data source**: Dedicated database backend

**UX it enables**:

- Visitors explore at their own pace
- No forced narrative
- Discovery through two lenses: time and concept

**Two Views**:

#### A. Temporal View (organized by time)

```
┌─────────────────────────────────────────────────────────────┐
│  2024                                                       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                    │
│  │     │ │     │ │     │ │     │ │     │                    │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                    │
│                                                             │
│  2023                                                       │
│  ┌─────┐ ┌─────┐ ┌─────┐                                    │
│  │     │ │     │ │     │                                    │
│  └─────┘ └─────┘ └─────┘                                    │
└─────────────────────────────────────────────────────────────┘
```

#### B. Taxonomy View (organized by concept)

```
┌─────────────────────────────────────────────────────────────┐
│  photography    writing    sound    code    research        │
│  ────────────────────────────────────────────────────────── │
│                                                             │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│  │     │ │     │ │     │ │     │ │     │ │     │ │     │  │
│  │photo│ │photo│ │essay│ │sound│ │code │ │photo│ │essay│  │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │
│                                                             │
│  clicking "photography" filters to only photos              │
│  items can have multiple tags (shows connections)           │
└─────────────────────────────────────────────────────────────┘
```

**are.na influence**:

- Minimal hover states (no attention-seeking)
- Clean grid, generous whitespace
- Items are blocks, not cards with excessive metadata
- The glitch is _around_ the archive, not distracting from content

**Personal distortion**:

- Subtle chromatic shift on hover
- Occasional glitch on thumbnails (rare, not constant)
- The outer boundary glitches more when viewing certain "charged" content?

**Implementation**:

- Medium complexity
- API calls to database backend
- Filter/view toggle
- CSS grid with responsive layout

---

### 6. Item Detail View

**What it is**: Full view of a single archive item (photo, video, audio, text)

**Behavior**:

- Minimal chrome, content fills space
- Photo/video/audio is primary
- Small metadata below (date, tags, description)
- **Click to fullscreen**: Boundary disappears, pure content
- Press Escape or click edge to return

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                    [ PHOTO / VIDEO ]                        │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  untitled-2024                                              │
│  photography, personal                                      │
│  2024-03-15                                                 │
│                                                             │
│  Optional description text here...                          │
└─────────────────────────────────────────────────────────────┘
```

---

## The Experience Flow

```
1. ARRIVE
   └→ See the outer boundary (you've entered a crafted space)
   └→ Status bar shows: ~/home

2. INVOKE MENU (⌘K or click)
   └→ Modal appears (dmenu style)
   └→ Type "arch" → filtered to "archive"
   └→ Press enter

3. NAVIGATE TO ARCHIVE
   └→ Boundary glitches during transition
   └→ Status bar: ~/archive │ ◀ home
   └→ Default view: temporal (most recent first)

4. EXPLORE ARCHIVE
   └→ Toggle to taxonomy view
   └→ Click "photography" tag → filtered
   └→ Status bar: ~/archive?tag=photography │ ◀ archive ◀ home
   └→ Click an item → opens detail view

5. VIEW ITEM
   └→ Minimal chrome, content fills space
   └→ Photo/video/audio is primary
   └→ Small metadata below (date, tags, description)
   └→ Status bar: ~/archive/photos/untitled-2024 │ ◀ archive ◀ home

6. FULLSCREEN (click on media)
   └→ Outer boundary fades/disappears
   └→ Pure content view
   └→ Escape or click edge → boundary returns

7. RETURN
   └→ Click "archive" in stack → back to filtered view
   └→ Or invoke menu → go anywhere
```

---

## Complexity Estimate

| Component                           | Complexity | Priority | Notes              |
| ----------------------------------- | ---------- | -------- | ------------------ |
| Outer boundary (pixel art + glitch) | Medium     | High     | Defines the space  |
| Status bar                          | Low-Medium | High     | Navigation clarity |
| Modal menu                          | Medium     | High     | Primary navigation |
| Archive (grid + two views)          | Medium     | High     | Core content       |
| Item detail view                    | Low        | High     | Needed for archive |
| Tiled windows                       | High       | Low      | Defer, add later   |

---

## Pixel Art Assets Needed

For the outer boundary (9-slice):

- `boundary-frame.png` (128×128 or larger)
- Corners: decorative, don't scale
- Edges: tileable pattern
- Could have multiple variants for different glitch states

For the modal menu:

- Optional: pixel art frame for the modal
- Or: CSS-only with border styling

For status bar:

- Likely CSS-only (simple borders)
- Optional: pixel art dividers

---

## Open Questions

1. **Color palette**: Since we're not doing overworld/underworld, what's the single
   palette? Dark with warm accents? Something else?

2. **Glitch triggers**: When exactly does the boundary glitch intensify?
   - Page transitions always?
   - Hover on boundary?
   - Random intervals?
   - Based on content type?

3. **Mobile experience**: Tiling WM aesthetic doesn't translate well to touch. How
   does this adapt?
   - Simpler boundary?
   - Menu via hamburger instead of ⌘K?
   - Status bar becomes bottom nav?

4. **Backend**: What database? What framework for the frontend?
