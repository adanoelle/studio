# Project State: February 4, 2026

**Version**: v0.4.0
**Branch**: main
**CI Status**: Passing

---

## Summary

The studio project is a personal website/portfolio built on glitch feminism principles.
The design system implements Lit web components with a warm Farrow & Ball palette and
HLD-inspired glitch effects at boundaries. The core thesis: glitch represents vitality
and multiplicity, not decay or error.

---

## What's Built

### Design System (`@studio/design-system` v0.4.0)

**Glitch Components** (`src/glitch/`):

| Component              | Status | Description                                        |
| ---------------------- | ------ | -------------------------------------------------- |
| `glitch-text`          | Done   | Text with hover glitch + rare idle animation       |
| `glitch-border`        | Done   | Animated border with chromatic aberration          |
| `modal-menu`           | Done   | dmenu/rofi-style keyboard-first navigation (Cmd+K) |
| `archive-grid`         | Done   | Grid/temporal views for archive items              |
| `archive-card`         | Done   | Individual archive item card                       |
| `tag-filter`           | Done   | Tag-based filtering UI                             |
| `glitch-waveform`      | Done   | Audio waveform visualization with glitch effects   |
| `dithered-glitch-gradient` | Done | Bayer-matrix dithered gradients                |
| `dither-corruption`    | Done   | Spreading dither corruption effect                 |
| `holographic-ui`       | Done   | HLD-style holographic panel styling                |
| `dash-trail`           | Done   | Persistent presence trails                         |

**Audio Components** (`src/audio/`):

| Component              | Status | Description                              |
| ---------------------- | ------ | ---------------------------------------- |
| `visualization-canvas` | Done   | WebGL audio visualization                |
| `hydra-canvas`         | Done   | Hydra live-coding integration            |
| `strudel-bridge`       | Done   | Strudel/Tidal patterns bridge            |

**Analog Components** (`src/analog/`):

| Component        | Status | Description                    |
| ---------------- | ------ | ------------------------------ |
| `collage-canvas` | Done   | Draggable collage workspace    |
| `collage-item`   | Done   | Individual collage element     |

### Website (`apps/website`)

| Page                    | Status | Description                                |
| ----------------------- | ------ | ------------------------------------------ |
| `homepage.html`         | Done   | Entry point with modal-menu, dithered void |
| `archive.html`          | Done   | Archive with grid/temporal views           |
| `dithering-demo.html`   | Done   | Dithering effects showcase                 |
| `visualization-demo.html` | Done | Audio visualization demo                   |

### Tokens (`@studio/tokens` v0.4.0)

CSS custom properties for colors, spacing, typography across three palettes:
- `base.css` - Core tokens
- `glitch.css` - Glitch aesthetic (magenta/cyan aberration)
- `analog.css` - Music journal aesthetic (grayscale + rose/teal)

---

## Recent Work (This Session)

### Horizontal Temporal View (v0.4.0)

Implemented a horizontal timeline for the archive that resists doomscroll patterns:

- Items flow left-to-right (past → present)
- Soft year markers float above as labels, not walls
- Subtle year boundaries create liminality between years
- Keyboard navigation (←/→, Home/End)
- Year jump buttons in position indicator
- Auto-scrolls to present on view switch
- Fixed card dimensions (280×320px) centered vertically
- Responsive sizing and reduced motion support

**Theoretical grounding**: Queer temporality—time as gradient, not discrete containers.

---

## Uncommitted Work

```
modified:   apps/website/src/homepage.ts
modified:   apps/website/vite.config.ts
untracked:  .changeset/ambient-waveform-player.md
untracked:  2026-02-03-grid-layout-glitch.txt
untracked:  docs/glitch/archive-spec.md
```

- **ambient-waveform-player.md**: Changeset for waveform audio player feature
- **homepage.ts / vite.config.ts**: Likely related to audio player integration
- **archive-spec.md**: Documentation for archive feature

Review these before continuing—decide whether to commit or discard.

---

## Architecture Overview

```
studio/
├── apps/
│   ├── website/          # Main portfolio site
│   └── journal/          # Music practice journal (separate aesthetic)
├── packages/
│   ├── design-system/    # Lit web components
│   └── tokens/           # CSS custom properties
├── docs/
│   ├── glitch/           # Active design documentation
│   ├── analog/           # Music journal specs
│   └── archive/          # Deferred features (world-switching, guide character)
└── services/             # Future Rust backend (placeholder)
```

**Build**: Turborepo + pnpm workspaces
**Components**: Lit 3.x web components
**Bundler**: Vite
**CI**: GitHub Actions (lint, typecheck, test on push; changesets for versioning)

---

## Key Design Decisions

1. **No overworld/underworld binary** - Both light and dark modes are "home"
2. **Glitch at boundaries only** - Effects at the frame, not distracting from content
3. **Content-primary** - Minimal chrome, generous whitespace, are.na influenced
4. **Keyboard-first navigation** - Cmd+K modal menu, vim-style keybindings
5. **Horizontal temporal view** - Resists vertical doomscroll patterns
6. **Pixel art borders deferred** - ADR-002 documents this decision

---

## Recommended Next Steps

### High Priority

1. **Outer Boundary Frame**
   - The "membrane" between crafted space and wider internet
   - Pixel art 9-slice frame with chromatic aberration
   - Idle breathing animation, intensifies on hover/transition
   - This is THE signature visual element
   - See: `docs/glitch/DESIGN-SUMMARY.md` (Components section)

2. **Page Transitions**
   - "Passing through" concept—boundary activates, not content dying
   - Glitch grows inward from boundary, peaks, recedes
   - Both pages partially visible at peak (multiplicity)
   - ~500ms total duration
   - See: `docs/glitch/DESIGN-SUMMARY.md` (Page Transitions section)

3. **Item Detail View**
   - Full view of single archive item
   - Minimal chrome, content fills space
   - Click media to fullscreen (boundary disappears)
   - Relatively low complexity

### Medium Priority

4. **Status Bar Enhancement**
   - Currently minimal; could add navigation stack (breadcrumbs)
   - Unix-style path display: `~/archive/photos/2024`
   - Clickable trail to return to previous locations

5. **Mobile Adaptation**
   - How does boundary work on touch?
   - Modal menu touch interactions
   - Temporal view swipe gestures

6. **Backend Integration**
   - Archive currently uses static JSON
   - `services/` directory has placeholder for Rust backend
   - Database for archive items, potential CMS

### Lower Priority (Deferred)

- World-switching UX (see `docs/archive/`)
- Guide character sprite
- Tiled windows layout

---

## Development Commands

```bash
# Start dev server
npm run dev

# Build all packages
npm run build

# Run tests
npm run test

# Format code
pnpm format

# Check formatting (CI runs this)
pnpm format:check

# Create a changeset
npx changeset

# Version packages (CI does this automatically via PR)
npx changeset version
```

---

## CI/CD Flow

1. Push to `main` triggers CI (lint, typecheck, test)
2. If changesets exist, Release workflow creates a "Version Packages" PR
3. Merging that PR bumps versions, updates changelogs, creates GitHub release
4. Tags follow `v{major}.{minor}.{patch}` format

---

## Files to Read When Returning

1. **This document** - Project state overview
2. **`docs/glitch/DESIGN-SUMMARY.md`** - Core design direction
3. **`docs/glitch/COMPONENT-API.md`** - Component reference
4. **`CLAUDE.md`** - Instructions for AI agents working on the codebase
5. **`git status`** - Check for uncommitted work

---

## Theoretical Foundation

The project embodies glitch feminism (Legacy Russell):

- **Glitch as vitality** - Not error or decay, but aliveness and multiplicity
- **Boundary as membrane** - Living edge, not wall
- **Refusal** - Resists attention economy, doomscroll patterns
- **Multiplicity** - Multiple selves visible simultaneously (chromatic aberration)
- **Embodiment** - The digital body is real and present

Every visual choice should be defensible through this lens.

---

*Last updated: February 4, 2026*
