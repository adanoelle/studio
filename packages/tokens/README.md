# @studio/tokens

Design tokens as CSS custom properties. Three files, two palettes.

---

## Installation

```
pnpm add @studio/tokens
```

---

## Usage

Import base tokens plus your palette:

```css
/* For glitch aesthetic (website) */
@import '@studio/tokens/base.css';
@import '@studio/tokens/glitch.css';

/* For analog aesthetic (journal) */
@import '@studio/tokens/base.css';
@import '@studio/tokens/analog.css';
```

Then use the properties:

```css
.element {
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--space-4);
  font-family: var(--font-primary);
}
```

---

## Files

### base.css

Shared foundation. Spacing, typography scale, z-index layers, animation timing.

```css
/* Spacing */
--space-1 through --space-24

/* Typography */
--text-xs through --text-4xl
--font-primary, --font-mono
--leading-tight, --leading-relaxed

/* Animation */
--duration-fast, --duration-normal, --duration-slow

/* Borders */
--border-thin, --border-normal, --border-thick
```

### glitch.css

Warm Farrow & Ball palette with chromatic aberration accents.

```css
/* Backgrounds */
--bg-primary          /* Warm dark */
--bg-secondary        /* Slightly lighter */

/* Text */
--text-primary        /* High contrast cream */
--text-secondary      /* Muted */
--text-tertiary       /* Subtle */

/* Glitch colors */
--glitch-magenta      /* Chromatic shift */
--glitch-cyan         /* Chromatic shift */
--glitch-pink         /* Accent */
```

### analog.css

Grayscale foundation with rose and teal accents. Quieter, more archival.

```css
/* Backgrounds */
--bg-primary          /* Near black */
--bg-secondary        /* Dark gray */

/* Text */
--text-primary        /* Off-white */
--text-secondary      /* Gray */
--text-tertiary       /* Muted gray */

/* Accent */
--accent              /* Dusty rose */
--accent-secondary    /* Muted teal */
```

---

## Semantic naming

Both palettes define the same semantic properties (`--bg-primary`, `--text-primary`,
`--accent`), so components work with either aesthetic without modification.

---

## Reduced motion

Animation durations respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
  }
}
```

---

MIT
