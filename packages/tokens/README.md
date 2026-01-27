# @glitch/tokens

Design tokens for the Glitch design system, delivered as CSS custom properties.

## Installation

```bash
pnpm add @glitch/tokens
```

## Usage

### In HTML

```html
<link rel="stylesheet" href="node_modules/@glitch/tokens/dist/tokens.css">
```

### In CSS

```css
@import '@glitch/tokens/tokens.css';

.my-element {
  background: var(--color-warm-cream);
  color: var(--color-warm-text);
  font-family: var(--font-mono);
}
```

### In JavaScript/TypeScript

```typescript
import '@glitch/tokens/tokens.css';
```

## Token Categories

### Colors

#### Warm Palette (Underworld)

```css
--color-warm-cream      /* Background base */
--color-warm-paper      /* Slightly darker background */
--color-warm-terracotta /* Accent color */
--color-warm-text       /* Primary text */
--color-warm-muted      /* Secondary text */
```

#### Cool Palette (Overworld)

```css
--color-cool-bg         /* Background base */
--color-cool-surface    /* Card/panel backgrounds */
--color-cool-border     /* Borders */
--color-cool-text       /* Primary text */
--color-cool-muted      /* Secondary text */
```

#### Glitch Colors

```css
--color-glitch-magenta  /* Chromatic aberration */
--color-glitch-cyan     /* Chromatic aberration */
--color-glitch-error    /* Error states */
```

### Typography

```css
--font-mono             /* Monospace/code font */
--font-body             /* Body text font */
--font-display          /* Headings/display font */

--font-size-xs          /* 0.75rem */
--font-size-sm          /* 0.875rem */
--font-size-base        /* 1rem */
--font-size-lg          /* 1.125rem */
--font-size-xl          /* 1.25rem */
--font-size-2xl         /* 1.5rem */
--font-size-3xl         /* 1.875rem */
```

### Spacing

```css
--space-1               /* 0.25rem */
--space-2               /* 0.5rem */
--space-3               /* 0.75rem */
--space-4               /* 1rem */
--space-6               /* 1.5rem */
--space-8               /* 2rem */
--space-12              /* 3rem */
--space-16              /* 4rem */
```

### Animation

```css
--duration-fast         /* 100ms */
--duration-normal       /* 200ms */
--duration-slow         /* 400ms */
--ease-out              /* Deceleration curve */
--ease-in-out           /* Symmetric curve */
```

### Borders

```css
--radius-sm             /* Small border radius */
--radius-md             /* Medium border radius */
--radius-lg             /* Large border radius */
--border-width          /* Standard border width */
```

## World-Specific Tokens

The design system supports two "worlds" with distinct visual languages:

### Overworld (Professional/Public)

Cool, precise, formal aesthetic. Use `--color-cool-*` tokens.

### Underworld (Personal/Authentic)

Warm, organic, intimate aesthetic. Use `--color-warm-*` tokens.

## Reduced Motion

Tokens respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
  }
}
```

## Development

```bash
# From repo root
just packages::tokens::build

# Or from this directory
just build
```

## License

MIT
