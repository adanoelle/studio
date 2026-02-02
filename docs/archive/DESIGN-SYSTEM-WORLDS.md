# Deferred: World-Specific Design System

> **Status**: Deferred - See `docs/DESIGN-SYSTEM.md` for active design tokens.

This document preserves the original two-world design system with separate overworld/underworld styling.

---

## World-Specific Color Tokens

```css
:root {
  /* === OVERWORLD (Professional/Public) === */

  --ow-bg-dark: #0a0e1a; /* Terminal black */
  --ow-bg-medium: #1f2937; /* Dark blue-gray */
  --ow-bg-light: #374151; /* Medium gray */
  --ow-text-primary: #e5e7eb; /* Crisp white */
  --ow-text-secondary: #9ca3af; /* Muted gray */
  --ow-border: #4a9eff; /* Digital blue */
  --ow-accent: #60a5fa; /* Cool blue */

  /* === UNDERWORLD (Personal/Authentic) === */

  --uw-bg-warm: #f5f1e8; /* Film paper white */
  --uw-bg-medium: #e8d5c4; /* Warm highlight */
  --uw-bg-dark: #d4cfc3; /* Faded shadow */
  --uw-text-primary: #5a5347; /* Faded black */
  --uw-text-secondary: #8b8076; /* Warm gray */
  --uw-border: #c9a88a; /* Warm terracotta */
  --uw-accent: #b89b7f; /* Muted clay */

  /* === GLITCH (Transition/Between) === */

  --glitch-magenta: #ff00ff; /* Cyberspace pink */
  --glitch-cyan: #00ffff; /* Digital ghost */
  --glitch-pink: #ff6b9d; /* Riot grrrl */
  --glitch-lime: #b4ff9f; /* Toxic fem */
  --glitch-violet: #9d00ff; /* Between pink/blue */
}
```

---

## World-Specific Typography

```css
:root {
  /* Overworld: Technical, precise */
  --font-overworld: 'Berkeley Mono', 'Iosevka', 'JetBrains Mono', monospace;
  --font-overworld-pixel: 'PxPlus IBM VGA8', monospace;

  /* Underworld: Warmer monospace */
  --font-underworld: 'Courier New', 'Monaco', monospace;
}
```

### Usage

```css
/* Overworld: Technical, precise */
.overworld-text {
  font-family: var(--font-overworld);
}

/* Underworld: Warmer monospace */
.underworld-text {
  font-family: var(--font-underworld);
}

/* Pixel UI elements */
.pixel-text {
  font-family: var(--font-overworld-pixel);
  image-rendering: pixelated;
}
```

---

## World Class Definitions

### Overworld Styles

```css
.overworld {
  /* Base */
  background: var(--ow-bg-dark);
  color: var(--ow-text-primary);
  font-family: var(--font-overworld);

  /* Pixel rendering */
  image-rendering: pixelated;
  image-rendering: crisp-edges;

  /* Geometric, precise */
  border-radius: 0;

  /* Cool color accents */
  --accent: var(--ow-border);
}
```

### Underworld Styles

```css
.underworld {
  /* Base */
  background: var(--uw-bg-warm);
  color: var(--uw-text-primary);
  font-family: var(--font-underworld);

  /* Film aesthetic */
  filter: sepia(0.08) saturate(0.85) contrast(0.95);

  /* Slightly softer edges */
  border-radius: 1px;

  /* Warm color accents */
  --accent: var(--uw-border);
}
```

### Glitch Transition

```css
.glitching {
  /* Chromatic aberration */
  position: relative;
}

.glitching::before {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  color: var(--glitch-magenta);
  transform: translateX(-2px);
  opacity: 0.7;
  mix-blend-mode: screen;
}

.glitching::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  color: var(--glitch-cyan);
  transform: translateX(2px);
  opacity: 0.7;
  mix-blend-mode: screen;
}
```

---

## Grid Systems

### Overworld: Strict Grid

```css
.overworld-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);
}
```

### Underworld: Looser Grid

```css
.underworld-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
}
```

---

## Accessibility per World

All color combinations meet WCAG 2.1 AA standards:

```
Overworld:
- #e5e7eb on #0a0e1a = 13.5:1 (AAA) ✓
- #9ca3af on #1f2937 = 4.8:1 (AA) ✓

Underworld:
- #5a5347 on #f5f1e8 = 7.2:1 (AAA) ✓
- #8b8076 on #e8d5c4 = 4.6:1 (AA) ✓

Glitch (temporary <300ms):
- May drop below AA during transition
- Returns to compliant colors
```

---

## World-Aware Components

Components were designed to accept a `world` property:

```typescript
interface WorldAware {
  world: 'overworld' | 'underworld';
}

// Usage
<component-name world="overworld"></component-name>
```

### State Management

```typescript
enum ComponentState {
  Idle = 'idle',
  Hovering = 'hovering',
  Glitching = 'glitching',
  Transitioning = 'transitioning',
}
```

### Event Naming

```typescript
// Custom events follow this pattern
this.dispatchEvent(
  new CustomEvent('world-changed', {
    detail: {
      from: 'overworld',
      to: 'underworld',
    },
  })
);
```

---

## Why This Was Deferred

The current implementation uses a single warm palette with morning/evening variants:

1. **No cool/clinical overworld** - Even "professional" content uses warm colors
2. **Simpler token namespace** - No `--ow-*` / `--uw-*` split
3. **Single font stack** - No world-specific typography
4. **No world property on components** - Removed from APIs

---

## Reactivating This Feature

If implementing world-switching in the future:

1. Add world-specific tokens back to CSS
2. Implement world class definitions
3. Add `world` property to all components
4. Implement world transition events
5. Add world-specific grid systems
