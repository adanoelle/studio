# @studio/design-system

Web components grounded in feminist theory. Part of the Glitch monorepo.

## Installation

```bash
pnpm add @studio/design-system
```

## Usage

### Import All Components

```typescript
import '@studio/design-system';
```

### Import Individual Components

```typescript
// Core components
import '@studio/design-system/glitch-text';
import '@studio/design-system/glitch-border';
import '@studio/design-system/dithered-glitch-gradient';

// Composite components
import '@studio/design-system/holographic-ui';
import '@studio/design-system/dither-corruption';
import '@studio/design-system/dash-trail';
```

## Components

### Core Components

#### `<glitch-text>`

Text with glitch effects on hover and idle.

```html
<glitch-text
  text="Hello World"
  intensity="0.3"
  idle-glitch
></glitch-text>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | `string` | `''` | The text to display |
| `intensity` | `number` | `0.3` | Glitch effect intensity (0-1) |
| `idle-glitch` | `boolean` | `true` | Enable random idle glitches |

#### `<glitch-border>`

Container with glitching border effects.

```html
<glitch-border world="overworld" break-pattern="shift">
  <div>Content here</div>
</glitch-border>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `world` | `'overworld' \| 'underworld'` | `'overworld'` | Visual world context |
| `break-pattern` | `'shift' \| 'gap' \| 'pixel'` | `'shift'` | Border break style |

#### `<dithered-glitch-gradient>`

PC-98 style dithered gradient with glitch effects.

```html
<dithered-glitch-gradient
  pattern="bayer"
  density="0.5"
></dithered-glitch-gradient>
```

### Composite Components

#### `<holographic-ui>`

Holographic UI panel inspired by Hyper Light Drifter.

```html
<holographic-ui variant="panel">
  <p>Holographic content</p>
</holographic-ui>
```

#### `<dither-corruption>`

Dither pattern with corruption effects.

#### `<dash-trail>`

Movement trail effect with chromatic aberration.

## Design Tokens

Components use CSS custom properties from `@studio/tokens`. Include the tokens CSS:

```html
<link rel="stylesheet" href="@studio/tokens/tokens.css">
```

Or import in your CSS:

```css
@import '@studio/tokens/tokens.css';
```

## Accessibility

All components:

- Respect `prefers-reduced-motion` (disables idle glitches, simplifies animations)
- Meet WCAG AA color contrast requirements
- Support keyboard navigation
- Include appropriate ARIA attributes

## Performance

Components are optimized for performance:

- Use `IntersectionObserver` to pause animations when off-screen
- GPU-accelerated transforms only
- Throttled animation loops
- Mobile-specific simplifications

## Theoretical Grounding

Each component embodies concepts from feminist theory:

- **Glitch as refusal** (Legacy Russell): Errors are intentional acts of resistance
- **Worldtraveling** (Maria Lugones): Moving between different identity contexts
- **Cyborg identity** (Donna Haraway): Hybrid human-machine existence

See the [Theoretical Framework](../../docs/THEORETICAL-FRAMEWORK.md) for details.

## Development

```bash
# From repo root
just dev-design-system

# Or from this directory
just dev
```

## License

MIT
