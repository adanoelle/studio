# Deferred: Two-World Architecture Decision

> **Status**: Deferred - See `docs/ADR-001-architecture.md` for active architecture decisions.

This document preserves the original architecture decision for explicit overworld/underworld separation.

---

## Original Decision

**Choice**: Explicit overworld/underworld separation with transition states

**Rationale**:
Directly implements Lugones' worldtraveling concept:

- **Overworld**: Public, professional, "expected" presentation
  - Cool palette (blues, grays, whites)
  - Pixel art precision, geometric
  - Formal grids, technical typography

- **Underworld**: Personal, authentic, playful
  - Warm palette (creams, terracottas, warm grays)
  - Film grain, organic textures
  - Broken grids, intimate feel

- **Glitch State**: The act of traveling between worlds
  - Chromatic aberration (RGB splitting)
  - Border breaking
  - Color shifting
  - Multiple identities visible simultaneously

---

## Implementation

### Type Definitions

```typescript
type World = 'overworld' | 'underworld';

interface WorldAware {
  world: World;
  transitioning: boolean;
}
```

### WorldAware Component Pattern

```typescript
@customElement("my-component")
export class MyComponent extends LitElement {
  @property({ type: String })
  world: "overworld" | "underworld" = "overworld";

  // Use world to determine behavior/style
  render() {
    const palette =
      this.world === "overworld" ? this.overworldColors : this.underworldColors;

    return html`...`;
  }
}
```

### World Transition

```typescript
// Worldtraveling is EXPLICIT, not hidden
function switchWorlds() {
  // 1. Glitch phase (making the transition visible)
  this.state = 'glitching';

  // 2. Actual switch
  this.currentWorld = this.currentWorld === 'overworld'
    ? 'underworld'
    : 'overworld';

  // 3. Settle into new world
  this.state = 'stable';
}
```

### Event System

```typescript
// Custom events for world changes
this.dispatchEvent(new CustomEvent('world-changed', {
  detail: {
    from: 'overworld',
    to: 'underworld'
  }
}));
```

---

## Responsive Strategy (Original)

**Desktop** (≥1024px):
- Full dual-world interface
- All glitch effects
- Chromatic aberration
- Multiple concurrent animations

**Mobile** (<768px):
- Single world at a time
- Simplified glitches (reduced animation)
- Explicit world switching (tap/click)
- Fewer concurrent effects

---

## Alternatives Considered

### Alternative 1: Single Aesthetic
**Rejected at the time**: Would lose the worldtraveling concept entirely. The dual worlds are core to Lugones' theory.

### Alternative 2: Implicit World Detection
**Rejected**: Removes user agency. Users should explicitly choose their world.

### Alternative 3: Three+ Worlds
**Rejected**: Adds complexity without theoretical justification. Two worlds maps cleanly to Lugones.

---

## Why This Was Deferred

The current implementation takes a different approach:

1. **Single crafted space** - No mode-switching required
2. **Both palettes are warm** - No cold/clinical "professional" mode
3. **Glitch at boundary only** - Not throughout the content area
4. **Simpler mental model** - Visitors don't need to learn world-switching

### Reframing Worldtraveling

The worldtraveling concept is now expressed through:
- **Page transitions** (traveling between content areas)
- **Morning/evening palette variants** (same home, different lighting)
- **Boundary glitch effects** (the membrane between crafted space and internet)

---

## Consequences of Deferral

### Positive

- Simpler initial implementation
- Reduced cognitive load for visitors
- Faster time to working site
- No world state management needed

### Negative

- Loses explicit worldtraveling metaphor
- Less theoretical purity
- Single presentation rather than multiple

### Mitigations

- Worldtraveling reframed as page navigation
- Theory still expressed through glitch effects
- Can be added later without major refactoring

---

## Reactivating This Feature

If implementing world-switching in the future:

1. Add `World` type and `WorldAware` interface
2. Add `world` property to all components
3. Implement `world-switcher` component
4. Add world state management (context/store)
5. Implement world transition animations
6. Update responsive strategy for mobile world-switching
7. Add `world-changed` events to components
