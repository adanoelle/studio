# Design System Summary

A consolidated brief capturing the design direction for this personal
website/portfolio.

---

## Vision

A personal website that embodies glitch feminism - not as decoration, but as **visual
argument**. The glitch represents vitality, multiplicity, and refusal (not decay or
error). The site is a crafted space that resists the attention economy while
showcasing creative work.

**Core influences:**

- Legacy Russell's _Glitch Feminism_ (theoretical foundation)
- Hyper Light Drifter (visual language, reframed from decay to vitality)
- are.na (content-primary, resists attention-seeking)
- Tiling window managers (efficient, keyboard-driven, minimal chrome)
- Farrow & Ball (sophisticated warm color palette)

---

## Key Decisions

### What We're NOT Doing

| Rejected                    | Why                                                                        |
| --------------------------- | -------------------------------------------------------------------------- |
| Overworld/underworld binary | Don't want to maintain a "professional mode" - both warm and dark are home |
| Glitch as decay/corruption  | Reframing to vitality, growth, aliveness                                   |
| Cold/clinical aesthetics    | Even dark mode should feel warm, personal                                  |
| Attention-seeking UI        | Content is primary, chrome is minimal                                      |

### What We ARE Doing

| Decision                | Meaning                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| Single crafted space    | No mode-switching, just variation (day/night of same home)             |
| Glitch at the boundary  | Effects happen at the frame, not distracting from content              |
| HLD visual language     | Chromatic aberration, scanlines, holographic UI - but meaning vitality |
| Glitch text on hover    | Text glitches on interaction + rare idle surprises                     |
| Fullscreen media escape | Boundary disappears when viewing photos/videos                         |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ ░▒▓█ OUTER BOUNDARY - pixel art frame, glitches █▓▒░            │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                                                             │ │
│ │                    CONTENT AREA                             │ │
│ │              (warm F&B interior, minimal chrome)            │ │
│ │                                                             │ │
│ │         ┌───────────────────────────┐                       │ │
│ │         │      MODAL MENU           │                       │ │
│ │         │   (dmenu/rofi style)      │                       │ │
│ │         └───────────────────────────┘                       │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ STATUS BAR: ~/path │ ◀ breadcrumbs │ context │ [≡] ⌘K       │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Color Direction

### Base Palette: Farrow & Ball Warm Tones

Two palettes (both "home", just different lighting):

**"Morning" (lighter):**

```
Background:  #dfc8ba (Setting Plaster - warm cream)
Text:        #3a3632 (Paean Black)
Accent:      #a4656a (Sulking Room Pink)
Border:      #c9a88a (Jitney)
```

**"Evening" (darker):**

```
Background:  #3a3632 (Paean Black - warm dark)
Text:        #dfc8ba (Setting Plaster)
Accent:      #c9a88a (Jitney)
Border:      #5a4a4a (muted warm)
```

### Glitch Colors: Contextual Hybrid

| Context          | Glitch Style   | Colors                            |
| ---------------- | -------------- | --------------------------------- |
| Outer boundary   | Pure digital   | #ff00ff (magenta), #00ffff (cyan) |
| Page transitions | Full intensity | All glitch colors burst briefly   |
| Text hover       | Subtle/derived | Pushed versions of F&B colors     |
| Archive items    | Minimal        | Don't distract from content       |

### Boundary Frame: HLD Void

```
Frame base:      #1a0a2e → #3a1055 (deep purple gradient)
Glitch accent:   #ff00ff, #00ffff (chromatic aberration)
Scanlines:       Subtle, moves occasionally
```

---

## Components

### 1. Outer Boundary (The Membrane)

**What**: Pixel art frame around entire viewport - the edge between crafted space and
wider internet.

**Behavior:**

- Idle: Subtle breathing (chromatic aberration shifts 1-2px)
- Hover on edge: Aberration increases
- Page transition: Glitch grows inward, peaks, recedes
- Media fullscreen: Boundary fades/disappears entirely

**Implementation**: 9-slice pixel art, CSS border-image, animation via CSS + JS
triggers

### 2. Modal Menu (The Launcher)

**What**: dmenu/rofi-style navigation popup, keyboard-first.

**Behavior:**

- Invoke: ⌘K or click menu icon
- Type to fuzzy-filter pages
- Navigate: arrows or j/k
- Select: Enter
- Close: Escape or click outside

**Style**: HLD holographic (semi-transparent, scanlines, chromatic edge glow)

### 3. Status Bar

**What**: Unix-style status line showing location + navigation history.

**Contents:**

```
~/archive/photos/2024 │ ◀ archive ◀ home │ items: 47 │ [≡] ⌘K
     ↑ current path       ↑ clickable stack    ↑ context   ↑ menu
```

**The stack**: Your navigation trail (not browser history). Click to return.

### 4. Glitch Text

**What**: Text that glitches on interaction, embodying unstable/multiple identities.

**Behavior:**

- **Primary trigger**: Hover - text scrambles/glitches while hovering
- **Secondary trigger**: Rare idle glitch (~30-60 seconds, randomized)
  - Brief 200-500ms glitch, then returns to stable
  - Only when element is visible (Intersection Observer)
  - Respects `prefers-reduced-motion` (disabled if set)
- Intensity configurable per instance

**Why rare idle**: Adds life without becoming annoying. The occasional glitch is a
surprise, not a pattern users consciously notice.

### 5. Archive

**What**: Content-primary grid of selected works, are.na influenced.

**Two views:**

- **Temporal**: Organized by year, most recent first
- **Taxonomy**: Organized by tags (photography, writing, sound, code, etc.)

**Behavior:**

- Minimal hover states
- Click tag to filter
- Items can have multiple tags
- Generous whitespace

**Data source**: Dedicated database backend

### 6. Item Detail View

**What**: Full view of single archive item.

**Behavior:**

- Minimal chrome, content fills space
- Metadata below (date, tags, description)
- Click media to fullscreen (boundary disappears)
- Escape to return

---

## Visual Language (HLD Reframed)

| HLD Motif            | Original Meaning | Our Meaning                                       |
| -------------------- | ---------------- | ------------------------------------------------- |
| Chromatic aberration | Reality breaking | **Multiplicity** - all selves visible             |
| Corruption spread    | Disease, death   | **Growth** - mycelium, connection                 |
| Scanlines            | Failing tech     | **Texture of digital** - this IS a screen         |
| Dash trails          | Dying world      | **Presence persists** - where you've been matters |
| Holographic UI       | Barely working   | **Liminality** - between states, potential        |
| Deep purple/void     | Ending, darkness | **Depth** - interiority, not ending               |
| Hot pink/magenta     | Corruption       | **Vitality** - aliveness, not disease             |

**Emotional register**: Not melancholy/elegy. Instead: aliveness, multiplicity, play,
joy.

---

## Page Transitions

**Concept**: "Passing Through" - the boundary activates, not the content dying.

**Sequence (~500ms total):**

1. **Trigger** (click)
   - Boundary chromatic aberration increases
   - Scanline speeds up

2. **Growth** (200ms)
   - Glitch grows inward from boundary
   - Current content ghosts (opacity fade)
   - Chromatic trails appear

3. **Peak** (100ms)
   - Maximum glitch intensity
   - Both pages partially visible (multiplicity!)
   - Boundary most alive

4. **Resolution** (200ms)
   - New content solidifies from center
   - Glitch recedes to boundary
   - Returns to idle breathing

---

## Technical Stack

- **Framework**: Lit + Vite (this repo)
- **Components**: Web Components (custom elements)
- **Styling**: CSS custom properties, design tokens
- **Backend**: Dedicated database (for archive)
- **Assets**: Pixel art via Aseprite, 9-slice for scalable frames

---

## Accessibility

- Respect `prefers-reduced-motion` (disable/reduce animations, no idle glitches)
- WCAG AA color contrast
- Keyboard navigation throughout
- Fullscreen escape via Escape key
- Screen reader support for navigation

---

## Implementation Priority

| Component                       | Priority | Complexity |
| ------------------------------- | -------- | ---------- |
| Outer boundary (frame + glitch) | High     | Medium     |
| Status bar                      | High     | Low-Medium |
| Modal menu                      | High     | Medium     |
| Glitch text                     | High     | Low-Medium |
| Archive grid + views            | High     | Medium     |
| Item detail view                | High     | Low        |
| Page transitions                | Medium   | Medium     |

---

## Pixel Art Assets Needed

**Boundary frame** (9-slice, 128×128 or larger):

- Corners: Decorative, don't scale
- Edges: Tileable pattern
- Multiple states possible (idle, active, intense)

**Modal/speech bubble** (optional):

- Could be CSS-only
- Or: 9-slice holographic frame

---

## Deferred Features

The following features are documented but deferred for future implementation:

| Feature                  | Archive Document                                  |
| ------------------------ | ------------------------------------------------- |
| World-switching UX       | `archive/THEORETICAL-FRAMEWORK-WORLDTRAVELING.md` |
| Overworld/underworld CSS | `archive/DESIGN-SYSTEM-WORLDS.md`                 |
| Guide character sprite   | `archive/GUIDE-CHARACTER-DESIGN.md`               |
| Two-world architecture   | `archive/ADR-DEFERRED-WORLDS.md`                  |
| Tiled windows            | (documented in UX-DESIGN-EXPLORATION.md)          |

See `docs/archive/README.md` for details on reactivating these features.

---

## Open Questions for Implementation

1. **Specific F&B colors**: Verify against actual paint swatches
2. **Transition timing**: May need tuning once built
3. **Mobile adaptation**: How does boundary work on touch?

---

## Related Documents

**Active:**

- `docs/UX-DESIGN-EXPLORATION.md` - Detailed UX architecture
- `docs/COLOR-PALETTE-EXPLORATION.md` - Color theory deep dive
- `docs/HLD-VISUAL-MOTIFS-EXPLORATION.md` - HLD reframing
- `docs/THEORETICAL-FRAMEWORK.md` - Feminist theory foundation
- `docs/DESIGN-SYSTEM.md` - Design tokens
- `docs/COMPONENT-API.md` - Component reference

**Archived (deferred features):**

- `docs/archive/` - World-switching, guide character, and related designs

---

## The Core Principle

> **This isn't decoration. It's argument made visible.**

The glitch isn't error - it's vitality. The boundary isn't a wall - it's a living
membrane. Every visual choice embodies the theory: multiplicity, refusal, embodiment,
presence.

The site is a crafted space that says: "You've entered somewhere different. Take your
time. The space isn't going anywhere."
