# @studio/design-system

Web components grounded in feminist theory.

Each component embodies concepts from Legacy Russell's glitch feminism: the glitch as
refusal, error as liberation, identity as multiple and unstable. Text that scrambles
refuses singular meaning. Borders that break refuse containment.

---

## Installation

```
pnpm add @studio/design-system
```

---

## Usage

Import from submodules:

```typescript
// Glitch components
import { GlitchText, GlitchBorder } from '@studio/design-system/glitch';

// Audio/visualization
import { HydraCanvas, StrudelBridge } from '@studio/design-system/audio';

// Analog components (planned)
import { FretboardDiagram } from '@studio/design-system/analog';
```

Or import everything:

```typescript
import '@studio/design-system';
```

---

## Components

### Glitch

**glitch-text** — Text with chromatic aberration on hover, rare idle glitches

```html
<glitch-text text="Principal Engineer" intensity="0.3"></glitch-text>
```

**glitch-border** — Container with borders that shift, gap, or pixelate on
interaction

```html
<glitch-border break-pattern="shift">
  <p>Content refuses containment</p>
</glitch-border>
```

**dithered-glitch-gradient** — PC-98 style dithering with glitch corruption

**holographic-ui** — Hyper Light Drifter-inspired translucent panels

**dither-corruption** — Dither patterns that degrade and reform

**dash-trail** — Movement traces with chromatic separation

### Audio

Audio components require the `hydra-synth` peer dependency:

```
pnpm add hydra-synth
```

**hydra-canvas** — Live-coding visuals via Hydra Synth

**visualization-canvas** — Audio-reactive background rendering

**strudel-bridge** — Service connecting Strudel patterns to visualizations

### Analog

Components for the music journal. Planned:

- fretboard-diagram
- practice-entry
- audio-player
- strudel-embed

---

## Tokens

Components require design tokens. Import base plus your palette:

```css
@import '@studio/tokens/base.css';
@import '@studio/tokens/glitch.css';
```

Or for the analog aesthetic:

```css
@import '@studio/tokens/base.css';
@import '@studio/tokens/analog.css';
```

---

## Accessibility

All components:

- Respect `prefers-reduced-motion` — idle glitches disabled, animations simplified
- Meet WCAG AA contrast requirements
- Support keyboard navigation
- Include ARIA attributes where appropriate

---

## Performance

- IntersectionObserver pauses off-screen animations
- GPU-accelerated transforms only
- Throttled animation loops (20fps for glitch effects)
- Mobile-specific simplifications

---

## Theoretical Framework

See `docs/glitch/THEORETICAL-FRAMEWORK.md` for the philosophical grounding, and
`docs/glitch/COMPONENT-API.md` for detailed component documentation.

---

## Development

```
pnpm dev
```

---

MIT
