# Glitch Feminist Design System

A web component library that embodies feminist theoretical commitments through visual design.

## Quick Start

```bash
# Check your environment
just doctor

# Install dependencies
just setup

# Start development
just dev

# Run all checks (CI equivalent)
just check
```

## What Is This?

This is not just a design system—it's a **visual argument** about identity, multiplicity, and resistance, grounded in:

- **Legacy Russell's Glitch Feminism**: The glitch as refusal, error as liberation, multiple simultaneous identities
- **Maria Lugones' Worldtraveling**: Moving between overworld (public/professional) and underworld (personal/authentic) with different identities in each
- **Hiromix's Girl Photo Movement**: Warm, intimate, analog aesthetics
- **Algorave/Live Coding Culture**: Terminal aesthetics, generative patterns, code as performance
- **Pixel Art/Retro Computing**: PC-98, Aseprite, technical precision

## Project Structure

```
glitch/
├── apps/
│   └── website/          # Main website application
├── packages/
│   ├── design-system/    # Web components (Lit)
│   └── tokens/           # Design tokens (CSS custom properties)
├── services/             # Rust Lambda functions
│   ├── shared/glitch-core/   # Shared Rust library
│   └── lambdas/
│       ├── api/          # API Lambda
│       └── media-upload/ # Media upload Lambda
└── docs/                 # Documentation
```

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

PC-98 dithering meets glitch feminism:

**PC-98 Dithering:**
- Technical constraint (16 colors)
- Ordered patterns create gradients
- Working beautifully within limits

**Glitching the Dither:**
- Pattern itself breaks down
- Chromatic separation (magenta/cyan, not RGB)
- Constraint AND refusal visible simultaneously

### Key Visual Metaphors

1. **Chromatic aberration** = Multiple simultaneous identities
2. **Breaking grids** = Refusing imposed order
3. **Border glitches** = Resisting containment
4. **Color shifting** = Gender fluidity
5. **Grain overlays** = Analog warmth in digital space

## Development Commands

All commands use `just` as the unified interface:

| Command | Description |
|---------|-------------|
| `just doctor` | Verify development environment |
| `just setup` | Install all dependencies |
| `just dev` | Start development servers |
| `just build` | Build for production |
| `just check` | Run all quality checks |
| `just test` | Run all tests |
| `just lint` | Lint TypeScript code |
| `just fmt` | Format all code |
| `just ci` | Full CI pipeline locally |

Run `just` without arguments to see all available commands.

## Component Architecture

```
packages/design-system/src/components/
├── core/           # Atomic, single-purpose
│   ├── glitch-text.ts
│   ├── glitch-border.ts
│   └── dithered-glitch-gradient.ts
├── composite/      # Combined functionality
│   ├── holographic-ui.ts
│   ├── dither-corruption.ts
│   └── dash-trail.ts
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

## Documentation

- **[Design Summary](docs/DESIGN-SUMMARY.md)**: Primary source of truth for design direction
- **[Design System](docs/DESIGN-SYSTEM.md)**: Complete visual language specification
- **[Theoretical Framework](docs/THEORETICAL-FRAMEWORK.md)**: Feminist theory connections
- **[Component API](docs/COMPONENT-API.md)**: Component reference
- **[Contributing](CONTRIBUTING.md)**: How to contribute

## For Claude Code Agents

This system is designed to be extended by AI agents. See [CLAUDE.md](CLAUDE.md) for detailed instructions.

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

Built with theory by Ada
