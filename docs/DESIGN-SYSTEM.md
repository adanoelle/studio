# Design System Documentation

Complete visual language specification for the Glitch Feminist Design System.

> **Note**: This document has been simplified to reflect the current single-space design.
> For deferred world-switching styling, see `docs/archive/DESIGN-SYSTEM-WORLDS.md`.

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Animation & Motion](#animation--motion)
6. [Responsive Strategy](#responsive-strategy)
7. [Asset Guidelines](#asset-guidelines)

---

## Design Tokens

All design values are defined as CSS custom properties for consistency and easy theming.

```css
:root {
  /* === COLORS === */

  /* Base Palette (Farrow & Ball Warm Tones) */
  --color-cream: #dfc8ba;       /* Setting Plaster */
  --color-dark: #3a3632;        /* Paean Black */
  --color-tan: #c9a88a;         /* Jitney */
  --color-pink: #a4656a;        /* Sulking Room Pink */
  --color-muted: #5a4a4a;       /* Muted warm */

  /* Semantic Colors - Morning (lighter) */
  --bg-primary: var(--color-cream);
  --bg-secondary: var(--color-tan);
  --text-primary: var(--color-dark);
  --text-secondary: var(--color-muted);
  --accent: var(--color-pink);
  --border: var(--color-tan);

  /* Glitch Colors (pure digital) */
  --glitch-magenta: #ff00ff;    /* Cyberspace pink */
  --glitch-cyan: #00ffff;       /* Digital ghost */
  --glitch-pink: #ff6b9d;       /* Riot grrrl */
  --glitch-lime: #b4ff9f;       /* Toxic fem */
  --glitch-violet: #9d00ff;     /* Between pink/blue */

  /* Boundary Frame (HLD Void) */
  --boundary-dark: #1a0a2e;     /* Deep purple void */
  --boundary-mid: #3a1055;      /* Mid purple */

  /* Algorave */
  --code-green: #0f0;           /* Terminal green */
  --warning-yellow: #ffcc00;    /* Alert */

  /* === TYPOGRAPHY === */

  /* Font family - single stack */
  --font-primary: 'Berkeley Mono', 'Iosevka', 'JetBrains Mono', monospace;
  --font-pixel: 'PxPlus IBM VGA8', monospace;

  /* Font sizes */
  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 15px;
  --text-lg: 18px;
  --text-xl: 24px;
  --text-2xl: 32px;
  --text-3xl: 48px;

  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* === SPACING === */

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* === BORDERS === */

  --border-thin: 1px;
  --border-normal: 2px;
  --border-thick: 4px;
  --border-very-thick: 8px;

  /* === SHADOWS === */

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* === ANIMATION === */

  --duration-fast: 0.1s;
  --duration-normal: 0.2s;
  --duration-slow: 0.3s;
  --duration-very-slow: 0.5s;

  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-linear: linear;

  /* === Z-INDEX === */

  --z-base: 0;
  --z-dropdown: 100;
  --z-modal: 200;
  --z-overlay: 300;
  --z-toast: 400;
}
```

---

## Color System

### Base Palette: Farrow & Ball Warm Tones

Two lighting variants (both "home", just different times of day):

**"Morning" (lighter)**:
```css
.morning {
  --bg-primary: #dfc8ba;     /* Setting Plaster */
  --text-primary: #3a3632;   /* Paean Black */
  --accent: #a4656a;         /* Sulking Room Pink */
  --border: #c9a88a;         /* Jitney */
}
```

**"Evening" (darker)**:
```css
.evening {
  --bg-primary: #3a3632;     /* Paean Black */
  --text-primary: #dfc8ba;   /* Setting Plaster */
  --accent: #c9a88a;         /* Jitney */
  --border: #5a4a4a;         /* Muted warm */
}
```

### Glitch Colors

Pure digital colors for glitch effects:

```css
.glitching-element {
  color: var(--glitch-magenta);
  text-shadow: 2px 0 var(--glitch-cyan);
}
```

**When to use**:
- Outer boundary effects
- Page transitions
- Hover states on interactive elements

**Color meanings**:
- **Magenta**: Between pink (fem) and blue (masc) = non-binary
- **Cyan**: Digital ghost, RGB split, multiplicity
- **Hot pink**: Riot grrrl, punk feminism

### Boundary Frame

```css
.boundary {
  background: linear-gradient(
    var(--boundary-dark),
    var(--boundary-mid)
  );
}
```

### Accessibility

All color combinations meet WCAG 2.1 AA standards:

```
Morning palette:
- #3a3632 on #dfc8ba = 7.2:1 (AAA) ✓
- #5a4a4a on #dfc8ba = 4.6:1 (AA) ✓

Evening palette:
- #dfc8ba on #3a3632 = 7.2:1 (AAA) ✓

Glitch (temporary <300ms):
- May drop below AA during transition
- Returns to compliant colors
```

---

## Typography

### Font Stack

```css
body {
  font-family: var(--font-primary);
  /* Falls back to system monospace if unavailable */
}

/* Pixel UI elements */
.pixel-text {
  font-family: var(--font-pixel);
  image-rendering: pixelated;
}
```

### Type Scale

```css
.text-xs    { font-size: var(--text-xs);   }  /* 11px - Captions */
.text-sm    { font-size: var(--text-sm);   }  /* 13px - Small text */
.text-base  { font-size: var(--text-base); }  /* 15px - Body */
.text-lg    { font-size: var(--text-lg);   }  /* 18px - Emphasis */
.text-xl    { font-size: var(--text-xl);   }  /* 24px - H3 */
.text-2xl   { font-size: var(--text-2xl);  }  /* 32px - H2 */
.text-3xl   { font-size: var(--text-3xl);  }  /* 48px - H1 */
```

### Typography Rules

1. **Use monospace for everything**
   - Technical consistency
   - Retro computing aesthetic
   - Better for code examples

2. **Line height varies by context**
   - Body text: `--leading-normal` (1.5)
   - Headers: `--leading-tight` (1.25)
   - Code: `--leading-relaxed` (1.75)

3. **Emphasis via color, not weight**
   - Use accent color for emphasis
   - Keeps pixel aesthetic pure

---

## Spacing & Layout

### Grid System

```css
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
}
```

### Spacing Scale

Use consistent spacing multiples of 4px:

```
4px  = --space-1   (tight spacing)
8px  = --space-2   (default gap)
12px = --space-3   (moderate)
16px = --space-4   (comfortable)
24px = --space-6   (sections)
32px = --space-8   (large sections)
48px = --space-12  (page sections)
```

### Container Widths

```css
.container-sm  { max-width: 640px;  }  /* Text content */
.container-md  { max-width: 768px;  }  /* Forms */
.container-lg  { max-width: 1024px; }  /* Standard page */
.container-xl  { max-width: 1280px; }  /* Wide layouts */
```

---

## Animation & Motion

### Animation Principles

1. **Use GPU-accelerated properties only**
   ```css
   /* ✓ GOOD: transform and opacity */
   .animate {
     transform: translate(10px, 0);
     opacity: 0.5;
   }

   /* ✗ BAD: left/top trigger layout */
   .animate-bad {
     left: 10px;
     top: 10px;
   }
   ```

2. **Respect reduced motion**
   ```css
   @media (prefers-reduced-motion: reduce) {
     .animated {
       animation: none !important;
       transition: none !important;
     }
   }
   ```

3. **Use appropriate durations**
   - Fast (0.1s): Hover feedback
   - Normal (0.2s): State changes
   - Slow (0.3s): Page transitions
   - Very slow (0.5s): Modal appearances

### Standard Animations

```css
/* Glitch shake */
@keyframes glitch-shake {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-1px, 1px); }
  75% { transform: translate(1px, -1px); }
}

/* Chromatic split */
@keyframes chromatic-split {
  0% { transform: translateX(0); }
  33% { transform: translateX(-2px); }
  66% { transform: translateX(2px); }
}

/* Fade in */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

---

## Responsive Strategy

### Breakpoints

```css
/* Mobile first approach */
:root {
  --breakpoint-sm: 640px;   /* Landscape phones */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
}

/* Usage */
@media (min-width: 768px) {
  /* Tablet and up */
}
```

### Mobile Adaptations

```css
/* Mobile (<768px) */
@media (max-width: 767px) {
  :root {
    /* Larger touch targets */
    --min-tap-target: 44px;

    /* Simplified effects */
    --max-concurrent-animations: 3;

    /* Lower frame rates */
    --animation-fps: 10;
  }

  /* Disable complex glitch effects */
  .glitch-text::before,
  .glitch-text::after {
    display: none; /* No chromatic aberration on mobile */
  }
}
```

### Desktop Enhancements

```css
/* Desktop (≥1024px) */
@media (min-width: 1024px) {
  :root {
    /* Full effects */
    --max-concurrent-animations: 10;
    --animation-fps: 20;
  }

  /* Hover states (no touch) */
  .hover-effect:hover {
    /* Desktop-only hover effects */
  }
}
```

---

## Asset Guidelines

### Pixel Art Creation

**In Aseprite:**

1. **Canvas sizes**:
   - Icons: 16×16
   - Buttons: 48×16 (9-slice)
   - Borders: 48×48 (9-slice)
   - Windows: 128×128 (9-slice)

2. **Color palette**: Use the warm F&B palette + glitch colors
   - Export as `.pal` file
   - Import into each project
   - Ensures consistency

3. **Export settings**:
   - Format: PNG
   - Scale: 100% (actual pixels)
   - No smoothing
   - Transparent background

4. **9-Slice technique**:
   ```
   For borders that scale:

   ┌─────┬───────┬─────┐
   │ TL  │  TOP  │ TR  │  8×8 corners
   ├─────┼───────┼─────┤
   │LEFT │CENTER │RIGHT│  8×N edges
   ├─────┼───────┼─────┤
   │ BL  │BOTTOM │ BR  │  8×8 corners
   └─────┴───────┴─────┘
   ```

### File Naming

```
{component}-{variant}-{state}.png

Examples:
border-thick-normal.png
border-thick-glitch.png
window-chrome.png
transition-frame-001.png
```

### Optimization

```bash
# Use pngquant for compression
pngquant --quality=80-90 input.png -o output.png

# Or ImageOptim/Squoosh for GUI
```

**Target sizes**:
- Icon: <1KB
- Border: <2KB
- Window chrome: <5KB
- Sprite sheet: <10KB

---

## Performance Budgets

### JavaScript

```
Total bundle: <100KB gzipped
Per component: <5KB
Core library: <10KB
```

### Assets

```
Total pixel art: <50KB
Per asset: <5KB
Fonts: <100KB per weight
Total fonts: <200KB
```

### Runtime

```
Desktop:
- 60fps maintained
- <16.67ms per frame
- Max 10 concurrent animations

Mobile:
- 30fps maintained
- <33ms per frame
- Max 3 concurrent animations
```

### Monitoring

```typescript
// Built-in performance monitoring
if (import.meta.env.DEV) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('Performance:', entry);
    }
  });
  observer.observe({ entryTypes: ['measure'] });
}
```

---

## Code Style

### Naming Conventions

```typescript
// Components: PascalCase
class GlitchText extends LitElement {}

// Properties: camelCase
@property() hoverDelay = 100;

// Private: prefix with _
private _rafId?: number;

// Constants: SCREAMING_SNAKE_CASE
const MAX_ITERATIONS = 20;

// CSS classes: kebab-case
.glitch-text { }
```

### File Organization

```
component-name.ts
├─ imports
├─ type definitions
├─ @customElement decorator
├─ class definition
│  ├─ properties
│  ├─ state
│  ├─ configuration
│  ├─ lifecycle methods
│  ├─ public methods
│  ├─ private methods
│  ├─ event handlers
│  ├─ styles
│  └─ render
└─ global type declarations
```

---

## Deferred Features

For world-specific styling (overworld/underworld), see:
- `docs/archive/DESIGN-SYSTEM-WORLDS.md`

---

This design system is **living documentation**—update as patterns emerge and components evolve.
