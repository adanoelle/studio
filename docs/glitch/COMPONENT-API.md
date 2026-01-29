# Component API Reference

Complete API documentation for all components in the Glitch Feminist Design System.

## Core Components

### glitch-text

Text that glitches on hover with rare idle animations, embodying unstable, multiple identities.

#### API

```typescript
<glitch-text
  text="string"                    // Required: Text to display
  mode="all|word|character"        // How to glitch (default: "all")
  character-type="vowels|consonants|numbers|punctuation"  // For mode="character"
  intensity="number"               // 0.0-1.0, default: 0.3
  hover-delay="number"             // ms before glitch starts, default: 100
  idle-glitch="boolean"            // Enable rare idle glitches, default: true
  idle-interval="number"           // Average ms between idle glitches, default: 45000
></glitch-text>
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | `string` | `""` | The text to display and glitch |
| `mode` | `'all' \| 'word' \| 'character'` | `'all'` | How characters are glitched |
| `character-type` | `'vowels' \| 'consonants' \| 'numbers' \| 'punctuation'` | `undefined` | Which characters to glitch (mode='character' only) |
| `intensity` | `number` | `0.3` | Glitch aggressiveness (0.0-1.0) |
| `hover-delay` | `number` | `100` | Delay before hover glitch starts (ms) |
| `idle-glitch` | `boolean` | `true` | Whether to enable rare idle glitches |
| `idle-interval` | `number` | `45000` | Average time between idle glitches (ms, randomized ±15s) |

#### Behavior

**Hover Glitch (Primary)**:
- Glitch starts after `hover-delay` ms of hovering
- Continues until mouse leaves
- Intensity controlled by `intensity` property

**Idle Glitch (Secondary)**:
- Triggers randomly every 30-60 seconds (averaged around `idle-interval`)
- Duration: 200-500ms, then returns to stable
- Only fires when element is visible (Intersection Observer)
- Disabled when `prefers-reduced-motion` is set
- Disabled when `idle-glitch="false"`

#### Methods

```typescript
// Start glitching programmatically
element.startGlitch();

// Stop glitching programmatically
element.stopGlitch();
```

#### Events

None - component is self-contained.

#### CSS Custom Properties

```css
--glitch-magenta: #ff00ff;  /* Primary glitch color */
--glitch-cyan: #00ffff;     /* Secondary glitch color */
--duration-fast: 0.1s;      /* Animation speed */
--duration-normal: 0.2s;    /* Transition speed */
```

#### Examples

**Basic usage:**
```html
<glitch-text text="Hello World"></glitch-text>
```

**Word glitching:**
```html
<glitch-text
  text="Principal Reliability Engineer"
  mode="word"
></glitch-text>
```

**High intensity, no idle glitch:**
```html
<glitch-text
  text="Maximum chaos"
  intensity="0.8"
  idle-glitch="false"
></glitch-text>
```

**Programmatic control:**
```javascript
const glitchText = document.querySelector('glitch-text');

// Start on click instead of hover
glitchText.addEventListener('click', () => {
  glitchText.startGlitch();
  setTimeout(() => glitchText.stopGlitch(), 2000);
});
```

---

### glitch-border

Borders that break and shift colors on hover, refusing containment.

#### API

```typescript
<glitch-border
  thickness="number"                    // Border thickness in px, default: 4
  color="string"                        // Border color (auto if not set)
  break-pattern="shift|gap|color|all"   // How border breaks, default: "all"
  intensity="number"                    // 0.0-1.0, default: 0.5
  hover-delay="number"                  // ms before glitch, default: 100
>
  <slot></slot>                         // Content inside border
</glitch-border>
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `thickness` | `number` | `4` | Border thickness in pixels |
| `color` | `string` | `auto` | Base border color (auto-selected from palette) |
| `break-pattern` | `'shift' \| 'gap' \| 'color' \| 'all'` | `'all'` | How the border breaks when glitching |
| `intensity` | `number` | `0.5` | Glitch aggressiveness (0.0-1.0) |
| `hover-delay` | `number` | `100` | Delay before glitch starts (ms) |

#### Break Patterns

- **`shift`**: Border sections shift position
- **`gap`**: Gaps appear in the border
- **`color`**: Border color shifts
- **`all`**: All effects combined

#### CSS Custom Properties

```css
--border-thickness: 4px;       /* Thickness of border */
--border-color: #c9a88a;       /* Base color (Jitney) */
--glitch-color: #ff00ff;       /* Glitch color */
--duration-normal: 0.2s;       /* Animation speed */
```

#### Examples

**Basic usage:**
```html
<glitch-border>
  <p>Content goes here</p>
</glitch-border>
```

**Custom thickness and color:**
```html
<glitch-border
  thickness="8"
  color="#00ffff"
  break-pattern="shift"
>
  <div>Professional content</div>
</glitch-border>
```

**Gap pattern:**
```html
<glitch-border break-pattern="gap">
  <div>Creative work</div>
</glitch-border>
```

---

### dithered-glitch-gradient

Dithered gradients that glitch into chromatic separation. Synthesizes PC-98 constraint with glitch feminist refusal.

#### API

```typescript
<dithered-glitch-gradient
  color-a="string"                // Start color (default: #1a0a2e)
  color-b="string"                // End color (default: #7209b7)
  pattern="bayer|floyd-steinberg|ordered"  // Dither type (default: bayer)
  direction="horizontal|vertical|diagonal" // Gradient direction (default: vertical)
  glitch-intensity="number"       // 0.0-1.0, default: 0.5
>
  <slot></slot>
</dithered-glitch-gradient>
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color-a` | `string` | `#1a0a2e` | Gradient start color |
| `color-b` | `string` | `#7209b7` | Gradient end color |
| `pattern` | `'bayer' \| 'floyd-steinberg' \| 'ordered'` | `'bayer'` | Dithering algorithm |
| `direction` | `'horizontal' \| 'vertical' \| 'diagonal'` | `'vertical'` | Gradient direction |
| `glitch-intensity` | `number` | `0.5` | How aggressively to glitch (0.0-1.0) |

#### Dither Patterns

- **bayer**: 8×8 ordered Bayer matrix (PC-98 style)
- **floyd-steinberg**: Error diffusion (more organic)
- **ordered**: Alias for bayer

#### Examples

**Basic dithered gradient:**
```html
<dithered-glitch-gradient
  color-a="#1a0a2e"
  color-b="#7209b7"
  pattern="bayer"
>
  <div style="padding: 40px;">
    <h1>Content over dithered background</h1>
  </div>
</dithered-glitch-gradient>
```

**High intensity glitch:**
```html
<dithered-glitch-gradient
  color-a="#0a0e1a"
  color-b="#00ffff"
  glitch-intensity="0.8"
  direction="diagonal"
>
  <p>Aggressive chromatic separation on hover</p>
</dithered-glitch-gradient>
```

---

## Composite Components

### holographic-ui

HLD-inspired semi-transparent, flickering UI with scan lines.

#### API

```typescript
<holographic-ui
  flickering="boolean"      // Enable flicker effect (default: true)
  scan-speed="number"       // Scan line speed in seconds (default: 2)
  border-color="string"     // Border/glow color (default: #00ffff)
>
  <slot></slot>
</holographic-ui>
```

#### Examples

```html
<holographic-ui flickering scan-speed="3" border-color="#00ffff">
  <p>Unstable, translucent interface</p>
</holographic-ui>
```

---

### dither-corruption

Spreading corruption through dithering patterns. Pattern breaks down organically.

#### API

```typescript
<dither-corruption
  corruption-level="number"       // 0.0-1.0 (default: 0)
  primary-color="string"          // Base color (default: #1a0a2e)
  corruption-color="string"       // Corruption color (default: #ff006e)
>
  <slot></slot>
</dither-corruption>
```

#### Examples

```html
<dither-corruption
  corruption-level="0.5"
  primary-color="#1a0a2e"
  corruption-color="#ff006e"
>
  <p>Content with corrupting dither overlay</p>
</dither-corruption>
```

---

### dash-trail

HLD-inspired movement trails with chromatic afterimages.

#### API

```typescript
<dash-trail
  trail-length="number"     // Number of afterimages (default: 5)
>
  <slot></slot>
</dash-trail>
```

#### Examples

```html
<dash-trail trail-length="8">
  <div>Content that leaves trails on movement</div>
</dash-trail>
```

---

## Layout Components (Planned)

### modal-window (Planned)

Pixel art window chrome with film grain overlay.

### page-layout (Planned)

Overall page structure.

### section-container (Planned)

Section wrapper with consistent styling.

---

## Deferred Components

The following components are designed but deferred for future implementation:

| Component | Description | Archive Document |
|-----------|-------------|------------------|
| `world-switcher` | Toggle between overworld/underworld | `archive/ADR-DEFERRED-WORLDS.md` |
| `boundary-guide` | Guide character sprite | `archive/GUIDE-CHARACTER-DESIGN.md` |

See `docs/archive/` for full documentation on deferred features.

---

## Base Styles

All components respect these CSS custom properties:

```css
/* Colors - Single warm palette */
--bg-primary: #dfc8ba;     /* Setting Plaster (morning) or #3a3632 (evening) */
--bg-secondary: #c9a88a;   /* Jitney */
--text-primary: #3a3632;   /* Paean Black (morning) or #dfc8ba (evening) */
--text-secondary: #5a4a4a; /* Muted warm */
--accent: #a4656a;         /* Sulking Room Pink */
--border: #c9a88a;         /* Jitney */

/* Glitch colors */
--glitch-magenta: #ff00ff;
--glitch-cyan: #00ffff;
--glitch-pink: #ff6b9d;
--glitch-lime: #b4ff9f;

/* Typography */
--font-primary: 'Berkeley Mono', 'Iosevka', 'JetBrains Mono', monospace;
--text-*    /* Font sizes */

/* Spacing */
--space-*   /* Spacing scale */

/* Animation */
--duration-*
--ease-*
```

---

## Accessibility

All components implement:

- **Keyboard navigation**: Tab, Enter, Escape work as expected
- **Screen reader support**: Proper ARIA labels and roles
- **Reduced motion**: Respects `prefers-reduced-motion`
  - Hover glitches simplified (no chromatic aberration)
  - Idle glitches disabled entirely
- **Color contrast**: WCAG AA minimum
- **Focus management**: Visible focus indicators

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  glitch-text {
    /* Idle glitches disabled */
    /* Hover glitches simplified to opacity only */
  }
}
```

---

## Performance

### Budgets

- **Desktop**: 60fps, max 10 concurrent animations
- **Mobile**: 30fps, max 3 concurrent animations

### Optimization Features

- Intersection Observer (only animate visible elements)
- requestAnimationFrame throttling
- GPU-accelerated transforms
- Automatic mobile simplification

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

### Polyfills

Not required - uses only modern web standards.

---

## TypeScript Support

Full TypeScript definitions included:

```typescript
import { GlitchText, GlitchBorder } from 'glitch-feminist-design-system';

// Type-safe property access
const glitchText = document.querySelector('glitch-text') as GlitchText;
glitchText.intensity = 0.8;  // ✓ Type-safe
glitchText.startGlitch();    // ✓ Method autocomplete
```

---

## Testing

### Unit Testing

```typescript
import { GlitchText } from 'glitch-feminist-design-system';

describe('GlitchText', () => {
  it('renders with text', async () => {
    const el = document.createElement('glitch-text');
    el.text = 'Test';
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot?.textContent).to.include('Test');
  });
});
```

### Accessibility Testing

```typescript
it('respects reduced motion', () => {
  // Mock prefers-reduced-motion
  window.matchMedia = () => ({ matches: true });

  const el = document.createElement('glitch-text');
  // ... verify idle glitches disabled
});
```

---

## Contributing

When adding new components:

1. Follow existing patterns (see `glitch-text.ts`)
2. Document theoretical grounding
3. Add TypeScript types
4. Test accessibility
5. Check performance budgets
6. Update this API doc

---

For more information, see:
- [ADR-001](./ADR-001-architecture.md) - Architecture decisions
- [Design System](./DESIGN-SYSTEM.md) - Visual language
- [Theoretical Framework](./THEORETICAL-FRAMEWORK.md) - Feminist theory connections
