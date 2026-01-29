# Design System

Visual language for the analog learning journal.

## Aesthetic Philosophy

This is an **arthouse journal** - both diary and academic publication, but creative.

### Core Qualities

- **Raw** - Unpolished, capturing learning as it happens
- **Improvisational** - Layouts feel composed in the moment
- **Immediate** - Writing that exists in a specific time
- **Self-referential** - Retrospectives create loops back through time
- **Breathing** - Generous negative space throughout

### What It Is Not

- Not a polished portfolio
- Not a corporate design system
- Not a template-driven blog
- Not optimized for "content"

Every spread is a **composition**, not a **template application**.

## Typography

### Hierarchy

The typographic system creates temporal depth through value (light/dark).

| Element         | Value                      | Purpose                                  |
| --------------- | -------------------------- | ---------------------------------------- |
| Mini essay      | Semi-dark gray (`#5a5a5a`) | Initial thought, rough, allowed mistakes |
| Reflection body | Near-black (`#1a1a1a`)     | Present voice, more considered           |
| Inline quotes   | Dark gray (`#3d3d3d`)      | Original text called forth by reflection |
| Corrections     | Muted rose (`#8a5555`)     | Honest marking of error                  |
| Code            | Monospace, own weight      | Distinct from prose                      |
| Headings        | Variable                   | Per-spread composition choice            |

### Rationale

- **Mini essay lighter** - Recedes into the past. Freeform, rough, capturing the
  moment of first encounter. Mistakes are allowed; this is learning in progress.
- **Reflection darker** - The present voice looking back. More considered, more
  certain. Black text foregrounds the current perspective.
- **Quotes between** - When reflection cites the mini essay, the quoted text appears
  darker than its original context but not as dark as the reflection. Called forth
  from the past, brought closer to the present.
- **Corrections in rose** - Honest without alarming. Says "I was wrong" without
  screaming.

### Scale Variation

Not all text is the same size. Within a spread:

- Pull quotes or key phrases can be larger
- Asides or tangents can be smaller
- Code can vary based on importance
- Essays can be set at different scales based on their weight

### Line Weight

Use weight variation to create emphasis and hierarchy:

- Regular weight for reflection text (present voice, solid)
- Light weight for mini essays (reinforces the receding, past quality)
- Medium or bold for emphasis, sparingly
- Avoid heavy weights except for display type

### Typeface Direction

Not specified yet, but consider:

- Serif for essays (warmth, intimacy, the diary quality)
- Sans for interface/navigation elements
- Monospace for code (required)
- Possibly a display face for module titles

The combination should feel **literary but not precious**.

## Citations

The citation system provides academic grounding while maintaining warmth. It balances
the freeform artistic body text with structured references.

### Inline Format

Citations appear as bracketed number pairs: `[n, m]`

- First position = internal reference (dusty rose)
- Second position = external reference (muted teal)

```markdown
The pentatonic scale appears across many musical traditions [1, 2], suggesting
something fundamental about how we perceive melody.
```

Renders with `1` in dusty rose and `2` in muted teal.

### Single References

When only one type of reference exists:

- `[1]` - Single reference (color indicates type)
- `[1, 2]` - Both internal and external

### Visual Treatment

```css
.citation {
  font-size: 0.75em;
  vertical-align: super;
  font-weight: 500;
  cursor: pointer;
}

.citation-internal {
  color: var(--link-internal);
}

.citation-external {
  color: var(--link-external);
}

.citation:hover {
  text-decoration: underline;
}
```

### Numbering

A single continuous sequence across both types:

- Type distinguished by color inline
- Type explicitly labeled in footer
- Simpler to follow as a reader

Numbering restarts per spread/entry, not globally.

## References Footer

Each spread with citations includes a references section at the bottom. This provides
the academic grounding that balances the artistic body text.

### Structure

```markdown
<references>

1. [internal] Module 3: Intervals See the interval explorer exercise for hands-on
   practice with thirds and fifths.

2. [external] Pentatonic Scale — Wikipedia
   https://en.wikipedia.org/wiki/Pentatonic_scale Historical overview of pentatonic
   scales across cultures. Note the Western-centric framing; gamelan examples warrant
   separate exploration.

</references>
```

### Typography Hierarchy

| Element    | Treatment                                              |
| ---------- | ------------------------------------------------------ |
| Number     | Same color as inline citation (rose or teal)           |
| Type label | `[internal]` or `[external]`, lighter gray, small caps |
| Title      | Regular weight, primary text color                     |
| URL        | Lighter weight, de-emphasized, monospace               |
| Annotation | Concise scholarly note, indented, lighter than title   |

### Annotation Style

Annotations are **formal scholarly notes**, not freeform mini-essays:

- Concise, one to three sentences
- Provide context the title doesn't convey
- Note limitations or caveats of external sources
- Suggest further exploration paths
- Written in the author's voice but restrained

**Good annotation:**

> Historical overview of pentatonic scales across cultures. Note the Western-centric
> framing; gamelan examples warrant separate exploration.

**Too informal:**

> This Wikipedia article is pretty good but definitely has some bias issues. You
> should probably also check out some actual ethnomusicology sources.

### Visual Treatment

```css
.references {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--text-tertiary);
}

.reference-item {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
  text-indent: -1.5rem; /* Hanging indent */
}

.reference-number {
  font-weight: 600;
}

.reference-number.internal {
  color: var(--link-internal);
}

.reference-number.external {
  color: var(--link-external);
}

.reference-type {
  font-size: 0.75em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.reference-title {
  color: var(--text-primary);
}

.reference-url {
  font-family: var(--font-mono);
  font-size: 0.85em;
  color: var(--text-tertiary);
}

.reference-annotation {
  display: block;
  margin-top: 0.25rem;
  padding-left: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.9em;
}
```

### Spacing

- Significant vertical separation from body content (at least 4rem)
- Generous spacing between reference entries (1.5rem)
- Consistent left alignment with hanging indent for wrapped lines
- Optional light background tint to distinguish from body

## Layout

### Philosophy

The layout is **collage/scrapbook** - elements placed with intention but not snapped
to a rigid grid. Each spread is manually composed.

### Principles

**Off-grid placement**

- Elements can sit at unexpected horizontal and vertical positions
- Not random - composed for balance
- Avoids the "everything aligned to the same left edge" default

**No rotation**

- Elements stay horizontal for readability
- The "randomness" comes from position, not angle

**Scale variation**

- Code blocks can be different sizes
- Images can be large or intimate
- White space is sized deliberately

**Generous negative space**

- The page breathes
- Content exists as islands in white space
- Density varies - some spreads sparse, some fuller
- Silence is part of the composition

### Spread Composition

Think of each spread as a **designed artifact**:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│        ┌──────────────────┐                                 │
│        │   Mini Essay     │                                 │
│        │   (gray text)    │                                 │
│        └──────────────────┘                                 │
│                                                             │
│                              ┌─────────────────────────┐    │
│                              │                         │    │
│                              │     Code Block          │    │
│                              │                         │    │
│                              └─────────────────────────┘    │
│                                                             │
│   ┌────────────────────────────┐                            │
│   │  Reflection (black text)   │                            │
│   │  with <quote>called</quote>│                            │
│   │  forth from mini essay     │                            │
│   └────────────────────────────┘                            │
│                                                             │
│                                        ┌──────────┐         │
│                                        │ Fretboard│         │
│                                        │ Diagram  │         │
│                                        └──────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Elements don't align. They exist in relationship to each other and to the white
space.

### Content Proximity

Elements near each other may or may not be related:

- An essay **can** comment on adjacent code
- An essay **can** exist independently, an ephemeral thought
- A diagram **can** illustrate the essay
- A diagram **can** be its own artifact

Proximity suggests relationship but doesn't require it.

## Color

### Palette

Minimal, value-driven:

| Role            | Color           | Hex       |
| --------------- | --------------- | --------- |
| Reflection      | Near-black      | `#1a1a1a` |
| Inline quote    | Dark gray       | `#3d3d3d` |
| Mini essay      | Semi-dark gray  | `#5a5a5a` |
| Correction      | Muted rose      | `#8a5555` |
| Link (internal) | Dusty rose      | `#8a6666` |
| Link (external) | Muted teal      | `#527878` |
| Background      | Off-white       | `#fafafa` |
| Code background | Light warm gray | `#f5f3f0` |

### Accent

No bright accents. The rose for corrections and the teal for external links are the
only color departures. Everything else lives in grayscale with warm undertones.

### Link Colors

The citation system uses two muted colors to distinguish link types:

- **Internal links** (dusty rose `#8a6666`) - References to other modules, exercises,
  or sections within the journal. The rose connects to the correction color family,
  suggesting self-reference and internal dialogue.

- **External links** (muted teal `#527878`) - References to outside sources. The teal
  provides contrast while staying muted and warm-adjacent, acknowledging the external
  world without letting it dominate.

Both colors meet WCAG AA contrast requirements (4.5:1 minimum) against the off-white
background while remaining deliberately understated - they mark references without
shouting.

### Dark Mode

Consider inverting the value system while maintaining relationships:

- Reflections remain highest contrast (present voice foregrounded)
- Mini essays remain lower contrast (past receding)
- Inline quotes remain between the two
- Corrections remain rose-tinted

## Components

### Mini Essay

```css
.mini-essay {
  color: var(--color-mini-essay); /* #5a5a5a */
  font-family: var(--font-serif);
  max-width: 32rem;
  /* Position varies per spread */
}
```

The mini essay is lighter, receding into the past. Freeform writing, rough edges
allowed.

### Reflection

```css
.reflection {
  color: var(--color-reflection); /* #1a1a1a */
  font-family: var(--font-serif);
  max-width: 28rem;
}

.reflection quote {
  color: var(--color-inline-quote); /* #3d3d3d */
}

.reflection correction {
  color: var(--color-correction);
}
```

The reflection is the present voice - darker, foregrounded. When it quotes the mini
essay, those words appear darker than their original context, as if called forth from
the past into the present moment.

### Code Block

```css
.code-block {
  font-family: var(--font-mono);
  background: var(--bg-code);
  padding: 1.5rem;
  /* Size and position vary */
}
```

## Playback Visualization

When Strudel compositions play, the page transforms from quiet reading space to active
performance environment.

### Background Visualization

During playback of substantial melodies, Strudel-inspired visualizations fill the page
behind all content. This brings in elements from livecode environments - the page
becomes a canvas showing the music's structure.

**Visualization characteristics:**

- Tied to the pattern's rhythm and structure
- Fills the viewport behind text, code blocks, and diagrams
- Subtle enough not to overwhelm, active enough to feel alive
- Colors drawn from the existing palette (grays, rose, teal)

**Activation:**

- Appears when a Strudel block begins playing
- Fades when playback stops
- Intensity can vary based on musical density

### Container State Changes

Text containers shift between two states based on playback.

**Idle state (not playing):**

```css
.mini-essay,
.reflection {
  background: transparent;
  border: none;
  box-shadow: none;
}
```

Text floats freely on the page with no visible boundaries. The negative space breathes.

**Active state (playing):**

```css
.mini-essay[data-playing],
.reflection[data-playing] {
  background: var(--background); /* #fafafa */
  border: 1px solid var(--color-mini-essay); /* subtle, not harsh */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: background 300ms ease, border 300ms ease, box-shadow 300ms ease;
}
```

Bounding boxes emerge, providing solid backgrounds that maintain legibility against
the active visualization. The containers become visible - the music reveals structure.

### Visual Metaphor

The transformation embodies a shift in attention:

- **Idle**: The page is a contemplative space. Text exists as islands in white.
- **Playing**: The page becomes a stage. Structure becomes visible. The visualization
  is the performance; the text containers are the audience, watching.

### Transition

The shift between states should feel organic:

- **Fade in**: Background visualization appears gradually (300-500ms)
- **Container emergence**: Borders and backgrounds fade in simultaneously
- **Fade out**: Reverse on stop, containers dissolving back into the page

```css
.visualization-layer {
  opacity: 0;
  transition: opacity 400ms ease;
}

.visualization-layer[data-playing] {
  opacity: 1;
}
```

### Legibility Priority

The visualization should never compromise readability:

- Container backgrounds are fully opaque
- Sufficient contrast maintained at all times
- Visualization dims or simplifies if needed for dense text areas
- `prefers-reduced-motion` disables or simplifies the visualization

## Implementation Notes

### Manual Layout

Each spread requires manual composition. This could be implemented as:

- **Per-entry CSS** - Custom positioning rules per entry
- **Layout components** - Predefined compositions that can be selected
- **Visual editor** - Drag-and-drop positioning that generates CSS
- **CSS Grid with named areas** - Define areas per spread

The key constraint: **avoid a single repeating template**.

### Responsive Behavior

On smaller screens, the collage may need to linearize. Consider:

- Maintaining relative scale relationships
- Allowing more vertical stacking
- Preserving negative space even if reduced
- Keeping the typographic hierarchy intact

The small-screen version can be simpler while maintaining the same type system.

## References

Visual inspirations (not to copy, but for tone):

- Artist monographs with generous white space
- Literary journals with considered typography
- Zines with intentional placement
- Scientific notebooks with marginalia
- Commonplace books
- Livecode environments (Strudel, Hydra, Sonic Pi) for playback visualization
