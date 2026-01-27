# Glitch Feminist Design System

A web component library that embodies feminist theoretical commitments through visual design.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## What Is This?

This is not just a design system—it's a **visual argument** about identity, multiplicity, and resistance, grounded in:

- **Legacy Russell's Glitch Feminism**: The glitch as refusal, error as liberation, multiple simultaneous identities
- **Maria Lugones' Worldtraveling**: Moving between overworld (public/professional) and underworld (personal/authentic) with different identities in each
- **Hiromix's Girl Photo Movement**: Warm, intimate, analog aesthetics
- **Algorave/Live Coding Culture**: Terminal aesthetics, generative patterns, code as performance
- **Pixel Art/Retro Computing**: PC-98, Aseprite, technical precision

## Core Concepts

### Two Worlds

**Overworld** (Professional/Public)
- Cool palette (blues, grays)
- Pixel art precision
- Formal grids
- Technical monospace
- "Expected" presentation

**Underworld** (Personal/Authentic)
- Warm palette (creams, terracottas)
- Film grain texture
- Broken grids
- Organic feel
- Playful, intimate

**The Glitch** (Transition Between)
- Chromatic aberration
- Multiple identities visible
- Border breaking
- Color shifting
- Acts of worldtraveling

### Dithering + Glitch Synthesis

**NEW**: PC-98 dithering meets glitch feminism

**PC-98 Dithering:**
- Technical constraint (16 colors)
- Ordered patterns create gradients
- Working beautifully within limits

**Glitching the Dither:**
- Pattern itself breaks down
- Chromatic separation (magenta/cyan, not RGB)
- Constraint AND refusal visible simultaneously

**Inspired by Hyper Light Drifter:**
- Beautiful corruption aesthetics
- Movement trails with chromatic aberration
- Holographic UI elements
- Corruption as transformation, not damage

### Key Visual Metaphors

1. **Chromatic aberration** = Multiple simultaneous identities
2. **Breaking grids** = Refusing imposed order
3. **Border glitches** = Resisting containment
4. **Color shifting** = Gender fluidity
5. **Grain overlays** = Analog warmth in digital space

## Component Architecture

```
components/
├── core/           # Atomic, single-purpose
│   ├── glitch-text.ts
│   ├── glitch-border.ts
│   └── dithered-glitch-gradient.ts  ← NEW
├── composite/      # Combined functionality
│   ├── world-switcher.ts
│   ├── modal-window.ts
│   ├── holographic-ui.ts            ← NEW (HLD-inspired)
│   ├── dither-corruption.ts         ← NEW
│   └── dash-trail.ts                ← NEW (HLD movement trails)
└── layout/         # Page structure
    └── page-layout.ts
```

## Performance Budgets

- **Desktop**: 60fps, max 10 concurrent animations
- **Mobile**: 30fps, max 3 concurrent animations
- **Bundle**: <100KB JavaScript
- **Assets**: <50KB pixel art

## Accessibility

- Respects `prefers-reduced-motion`
- WCAG AA color contrast
- Keyboard navigation
- Screen reader friendly
- Focus management

## Usage Examples

### Basic Glitch Text

```html
<glitch-text text="Principal Reliability Engineer"></glitch-text>
```

### World-Aware Border

```html
<glitch-border world="overworld" break-pattern="shift">
  <div class="content">Professional work</div>
</glitch-border>

<glitch-border world="underworld" break-pattern="gap">
  <div class="content">Personal projects</div>
</glitch-border>
```

### Complete Page

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/styles/tokens.css">
  <link rel="stylesheet" href="/styles/overworld.css">
  <link rel="stylesheet" href="/styles/underworld.css">
</head>
<body>
  <world-switcher>
    <glitch-border world="overworld">
      <h1>
        <glitch-text text="Ada - Reliability Engineer"></glitch-text>
      </h1>
    </glitch-border>
  </world-switcher>
  
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

## Documentation

- **[ADR-001](docs/ADR-001-architecture.md)**: Architecture decisions
- **[Design System](docs/DESIGN-SYSTEM.md)**: Complete visual language
- **[Theoretical Framework](docs/THEORETICAL-FRAMEWORK.md)**: Feminist theory connections
- **[Component API](docs/COMPONENT-API.md)**: Component reference
- **[HLD + Dithering Aesthetic](docs/HLD-DITHERING-AESTHETIC.md)**: PC-98 dithering meets glitch feminism ← NEW

## For Claude Code Agents

This system is designed to be extended by AI agents. Each component:

- Has extensive inline documentation
- Maps visual choices to theoretical concepts
- Includes performance budgets
- Follows consistent patterns

When adding new components:

1. Read `docs/DESIGN-SYSTEM.md` first
2. Follow patterns in existing components
3. Document theoretical grounding
4. Test in both worlds (overworld/underworld)
5. Respect performance budgets
6. Add accessibility features

## Philosophy

Every visual choice in this system has **theoretical justification**:

- Glitches aren't bugs—they're acts of refusal
- Borders don't contain—they can be broken
- Grids aren't neutral—they impose order that can be resisted
- Colors aren't aesthetic—they encode meaning
- Worlds aren't separate—we travel between them

This design system takes feminist theory seriously as a **design methodology**.

## License

MIT - See LICENSE file

## Credits

Theoretical foundations:
- Legacy Russell, *Glitch Feminism: A Manifesto* (2020)
- Maria Lugones, "Playfulness, 'World'-Travelling, and Loving Perception" (1987)
- Donna Haraway, "A Cyborg Manifesto" (1985)

Technical inspiration:
- Aseprite UI design
- NES.css
- Hydra video synth
- TidalCycles

---

Built with ♥ and theory by Ada
