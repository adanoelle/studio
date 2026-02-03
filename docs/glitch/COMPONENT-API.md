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

| Property         | Type                                                     | Default     | Description                                              |
| ---------------- | -------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| `text`           | `string`                                                 | `""`        | The text to display and glitch                           |
| `mode`           | `'all' \| 'word' \| 'character'`                         | `'all'`     | How characters are glitched                              |
| `character-type` | `'vowels' \| 'consonants' \| 'numbers' \| 'punctuation'` | `undefined` | Which characters to glitch (mode='character' only)       |
| `intensity`      | `number`                                                 | `0.3`       | Glitch aggressiveness (0.0-1.0)                          |
| `hover-delay`    | `number`                                                 | `100`       | Delay before hover glitch starts (ms)                    |
| `idle-glitch`    | `boolean`                                                | `true`      | Whether to enable rare idle glitches                     |
| `idle-interval`  | `number`                                                 | `45000`     | Average time between idle glitches (ms, randomized ±15s) |

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
--glitch-magenta: #ff00ff; /* Primary glitch color */
--glitch-cyan: #00ffff; /* Secondary glitch color */
--duration-fast: 0.1s; /* Animation speed */
--duration-normal: 0.2s; /* Transition speed */
```

#### Examples

**Basic usage:**

```html
<glitch-text text="Hello World"></glitch-text>
```

**Word glitching:**

```html
<glitch-text text="Principal Reliability Engineer" mode="word"></glitch-text>
```

**High intensity, no idle glitch:**

```html
<glitch-text text="Maximum chaos" intensity="0.8" idle-glitch="false"></glitch-text>
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

| Property        | Type                                   | Default | Description                                    |
| --------------- | -------------------------------------- | ------- | ---------------------------------------------- |
| `thickness`     | `number`                               | `4`     | Border thickness in pixels                     |
| `color`         | `string`                               | `auto`  | Base border color (auto-selected from palette) |
| `break-pattern` | `'shift' \| 'gap' \| 'color' \| 'all'` | `'all'` | How the border breaks when glitching           |
| `intensity`     | `number`                               | `0.5`   | Glitch aggressiveness (0.0-1.0)                |
| `hover-delay`   | `number`                               | `100`   | Delay before glitch starts (ms)                |

#### Break Patterns

- **`shift`**: Border sections shift position
- **`gap`**: Gaps appear in the border
- **`color`**: Border color shifts
- **`all`**: All effects combined

#### CSS Custom Properties

```css
--border-thickness: 4px; /* Thickness of border */
--border-color: #c9a88a; /* Base color (Jitney) */
--glitch-color: #ff00ff; /* Glitch color */
--duration-normal: 0.2s; /* Animation speed */
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
<glitch-border thickness="8" color="#00ffff" break-pattern="shift">
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

### glitch-waveform

Audio waveform visualization with warm palette bars, ghost peaks, and chromatic aberration on hover. Designed to fit in a status bar or other compact UI.

#### API

```typescript
<glitch-waveform
  bars="number"                    // Number of bars (default: 8)
  playing="boolean"                // Whether audio is playing (default: false)
  bar-height="number"              // Height of bars in pixels (default: 24)
  peak-decay="number"              // Peak decay rate 0-1 (default: 0.02)
></glitch-waveform>
```

#### Properties

| Property     | Type      | Default | Description                          |
| ------------ | --------- | ------- | ------------------------------------ |
| `bars`       | `number`  | `8`     | Number of visualization bars         |
| `playing`    | `boolean` | `false` | Whether audio is currently playing   |
| `bar-height` | `number`  | `24`    | Height of bars in pixels             |
| `peak-decay` | `number`  | `0.02`  | How fast ghost peaks decay (0-1)     |

#### Methods

```typescript
// Connect an AnalyserNode for real-time frequency data
waveform.connectAnalyser(analyser: AnalyserNode);

// Disconnect the analyser
waveform.disconnectAnalyser();

// Set bar levels manually (for testing or non-analyser use)
waveform.setLevels(levels: number[]);
```

#### CSS Custom Properties

```css
--waveform-height: 24px;        /* Overall height */
--color-tan: #c9a88a;           /* Bar color (F&B Jitney) */
--dither-warm: rgba(...);       /* Ghost peak color */
--glitch-cyan: #00ffff;         /* Chromatic aberration */
--glitch-magenta: #ff00ff;      /* Chromatic aberration */
--duration-fast: 0.1s;          /* Animation speed */
```

#### Behavior

**Visualization**:
- Bars respond to frequency data from connected AnalyserNode
- Ghost peaks show previous maximum levels, decaying slowly
- Without an analyser, generates gentle idle animation

**Chromatic Aberration**:
- On hover, bars show cyan/magenta offset layers
- Creates glitch aesthetic connection to other components

**Accessibility**:
- `prefers-reduced-motion`: Static bars, no chromatic effect
- Proper ARIA role and label

#### Examples

**Basic usage with audio:**

```html
<glitch-waveform id="waveform" bars="8"></glitch-waveform>

<script>
const waveform = document.getElementById('waveform');
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();

// Connect audio source to analyser
source.connect(analyser);
analyser.connect(audioCtx.destination);

// Connect waveform to analyser
waveform.connectAnalyser(analyser);
waveform.playing = true;
</script>
```

**Status bar integration:**

```html
<footer class="status-bar">
  <button id="audio-toggle">Play</button>
  <glitch-waveform id="waveform" bars="8" style="--waveform-height: 16px;"></glitch-waveform>
</footer>
```

**Manual levels for testing:**

```javascript
const waveform = document.querySelector('glitch-waveform');
waveform.setLevels([0.2, 0.5, 0.8, 0.6, 0.4, 0.7, 0.3, 0.5]);
waveform.playing = true;
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

| Property           | Type                                        | Default      | Description                          |
| ------------------ | ------------------------------------------- | ------------ | ------------------------------------ |
| `color-a`          | `string`                                    | `#1a0a2e`    | Gradient start color                 |
| `color-b`          | `string`                                    | `#7209b7`    | Gradient end color                   |
| `pattern`          | `'bayer' \| 'floyd-steinberg' \| 'ordered'` | `'bayer'`    | Dithering algorithm                  |
| `direction`        | `'horizontal' \| 'vertical' \| 'diagonal'`  | `'vertical'` | Gradient direction                   |
| `glitch-intensity` | `number`                                    | `0.5`        | How aggressively to glitch (0.0-1.0) |

#### Dither Patterns

- **bayer**: 8×8 ordered Bayer matrix (PC-98 style)
- **floyd-steinberg**: Error diffusion (more organic)
- **ordered**: Alias for bayer

#### Examples

**Basic dithered gradient:**

```html
<dithered-glitch-gradient color-a="#1a0a2e" color-b="#7209b7" pattern="bayer">
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
<dither-corruption corruption-level="0.5" primary-color="#1a0a2e" corruption-color="#ff006e">
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

### modal-menu

Keyboard-first navigation launcher with fuzzy search, dithered borders, and glitch aesthetics. A dmenu/rofi-style modal for instant site navigation.

#### API

```typescript
<modal-menu
  open="boolean"                    // Menu visibility (default: false)
  .items=${MenuItem[]}              // Navigation items array
  placeholder="string"              // Input placeholder (default: "Type to filter...")
  enable-dither="boolean"           // Dithering on borders (default: true)
  glitch-intensity="number"         // Effect intensity 0-1 (default: 0.3)
  show-recent="boolean"             // Show recent items section (default: true)
  max-recent="number"               // Max recent items (default: 3)
  filter-debounce="number"          // Input debounce ms (default: 50)
></modal-menu>
```

#### MenuItem Interface

```typescript
interface MenuItem {
  id: string;              // Unique identifier
  label: string;           // Display text
  path?: string;           // URL/route for navigation
  category?: string;       // Section grouping
  shortcut?: string;       // Keyboard shortcut display (e.g., "⌘1")
  keywords?: string[];     // Additional search terms
  action?: () => void;     // Custom action instead of navigation
}
```

#### Properties

| Property           | Type         | Default              | Description                          |
| ------------------ | ------------ | -------------------- | ------------------------------------ |
| `open`             | `boolean`    | `false`              | Menu visibility state                |
| `items`            | `MenuItem[]` | `[]`                 | Navigation items                     |
| `placeholder`      | `string`     | `"Type to filter..."` | Input placeholder                    |
| `enable-dither`    | `boolean`    | `true`               | Enable dithered border effects       |
| `glitch-intensity` | `number`     | `0.3`                | Base glitch intensity (0-1)          |
| `show-recent`      | `boolean`    | `true`               | Show recent items section            |
| `max-recent`       | `number`     | `3`                  | Max recent items to display          |
| `filter-debounce`  | `number`     | `50`                 | Input debounce time in ms            |

#### Methods

```typescript
// Open/close control
menu.show();
menu.hide();
menu.toggle();

// Input control
menu.focusInput();
menu.clearFilter();

// Selection control
menu.getSelectedItem();        // Returns MenuItem | null
menu.selectByIndex(index);     // Select by index
menu.confirmSelection();       // Trigger current selection
```

#### Events

| Event              | Detail                                            | Description                    |
| ------------------ | ------------------------------------------------- | ------------------------------ |
| `modal-open`       | `{ }`                                             | Menu opened                    |
| `modal-close`      | `{ reason: 'escape' \| 'select' \| 'click-outside' }` | Menu closed                    |
| `item-select`      | `{ item: MenuItem }`                              | Item selected                  |
| `filter-change`    | `{ query: string, results: MenuItem[] }`          | Filter query changed           |
| `selection-change` | `{ item: MenuItem, index: number }`               | Keyboard selection moved       |

#### Keyboard Navigation

| Key              | Action                      |
| ---------------- | --------------------------- |
| `Escape`         | Close menu                  |
| `↓` / `ArrowDown`| Move selection down         |
| `↑` / `ArrowUp`  | Move selection up           |
| `Enter`          | Confirm current selection   |
| `⌘/Ctrl + 1-9`   | Quick select recent item    |
| `Backspace` (empty) | Close menu               |

#### CSS Custom Properties

```css
--modal-menu-backdrop-color: rgba(26, 10, 46, 0.92);
--modal-menu-background: #1a0a2e;
--modal-menu-border-color: #3a2a4e;
--modal-menu-width: min(90vw, 500px);
--modal-menu-item-color: var(--text-primary);
--modal-menu-item-hover: rgba(0, 255, 255, 0.1);
--modal-menu-item-selected: rgba(0, 255, 255, 0.15);
--modal-menu-highlight-color: var(--glitch-magenta);
--modal-menu-selection-accent: var(--glitch-cyan);
```

#### Examples

**Basic usage:**

```html
<modal-menu
  .items=${[
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About', path: '/about' }
  ]}
></modal-menu>
```

**With categories and keywords:**

```html
<modal-menu
  .items=${[
    { id: 'home', label: 'Home', path: '/', category: 'Navigation' },
    { id: 'search', label: 'Search', category: 'Tools', keywords: ['find', 'lookup'] }
  ]}
></modal-menu>
```

**Programmatic control with keyboard shortcut:**

```javascript
const menu = document.querySelector('modal-menu');

// Global keyboard shortcut
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    menu.toggle();
  }
});

// Handle selection
menu.addEventListener('item-select', (e) => {
  const { item } = e.detail;
  if (item.path) {
    window.location.href = item.path;
  }
});
```

---

## Layout Components (Planned)

### page-layout (Planned)

Overall page structure.

### section-container (Planned)

Section wrapper with consistent styling.

---

## Deferred Components

The following components are designed but deferred for future implementation:

| Component        | Description                         | Archive Document                    |
| ---------------- | ----------------------------------- | ----------------------------------- |
| `world-switcher` | Toggle between overworld/underworld | `archive/ADR-DEFERRED-WORLDS.md`    |
| `boundary-guide` | Guide character sprite              | `archive/GUIDE-CHARACTER-DESIGN.md` |

See `docs/archive/` for full documentation on deferred features.

---

## Dithering Strategy

The design system provides two distinct dithering techniques for different use cases.

### Decision Tree

```
Need dithering?
├── Static overlay/background?
│   └── USE CSS TOKENS (patterns.css)
│       ├── Bayer: --dither-warm, --dither-gray, --dither-magenta
│       └── Void: --dither-void-warm, --dither-void-cool
│
├── Dynamic/animated corruption?
│   └── USE bayer.ts RUNTIME
│       └── generateCorruptedBayerSVG()
│
└── Custom color at runtime?
    └── USE bayer.ts RUNTIME
        └── generateBayerSVG() or generateVoidTextureSVG()
```

### Bayer Dithering (Ordered Opacity)

Creates gradients from binary constraints using a 4x4 Bayer matrix. Best for overlays, gradients, and chromatic effects.

```css
/* Use CSS tokens for static patterns */
.overlay {
  background-image: var(--dither-warm);
  background-size: var(--dither-size);
  image-rendering: pixelated;
}
```

**Available Bayer tokens:**

| Token | Color | Use Case |
|-------|-------|----------|
| `--dither-gray` | #404040 | General UI overlays |
| `--dither-gray-dark` | #202020 | Subtle overlays |
| `--dither-warm` | #3a3632 | Warm palette overlays |
| `--dither-rose` | #8a5555 | Analog accent |
| `--dither-teal` | #527878 | Analog complement |
| `--dither-magenta` | #ff00ff | Glitch chromatic |
| `--dither-cyan` | #00ffff | Glitch chromatic |

### Void Texture (Color Noise)

Creates backdrop textures using color variations instead of opacity. Best for backdrops and liminal membrane effects.

```css
/* Warm void for modal backdrops */
.backdrop::before {
  background-image: var(--dither-void-warm);
  background-size: var(--dither-void-size);
  opacity: 0.7;
}
```

**Available void tokens:**

| Token | Base Color | Use Case |
|-------|------------|----------|
| `--dither-void-warm` | #2e2a28 | Warm palette backdrops |
| `--dither-void-cool` | #1a1a1a | Cool/neutral backdrops |
| `--dither-void` | (alias) | Default, same as warm |

### Runtime Generation

For dynamic effects or custom colors, use the TypeScript utilities:

```typescript
import {
  generateBayerSVG,
  generateVoidTextureSVG,
  generateCorruptedBayerSVG
} from '@studio/design-system/utils/bayer';

// Static Bayer pattern
const pattern = generateBayerSVG('#3a3632');

// Void texture with custom variance
const texture = generateVoidTextureSVG('#2e2a28', 0.15);

// Animated corruption
const corrupted = generateCorruptedBayerSVG(
  '#3a3632',    // primary
  '#ff00ff',    // corruption color
  0.5,          // level 0-1
  Date.now()    // seed
);
```

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
glitchText.intensity = 0.8; // ✓ Type-safe
glitchText.startGlitch(); // ✓ Method autocomplete
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
