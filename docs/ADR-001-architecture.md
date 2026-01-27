# ADR 001: Glitch Feminist Design System Architecture

## Status
Proposed - January 27, 2026

> **Update**: The "Two-World Architecture" (Section 2) has been **deferred**.
> The current implementation uses a single warm palette with morning/evening variants.
> See `docs/archive/ADR-DEFERRED-WORLDS.md` for the original world-switching design.

## Context

Building a personal portfolio website that synthesizes:

- **Film photography aesthetics** (Hiromix, girl photo movement)
- **Pixel art/retro computing** (PC-98, Aseprite)
- **Algorave/live coding culture** (TidalCycles, Hydra)
- **Glitch feminism** (Legacy Russell)
- **Feminist epistemology** (Maria Lugones)

### Requirements

The site must:
- Work responsively on mobile and desktop
- Perform well (60fps desktop, 30fps mobile)
- Respect accessibility preferences (WCAG 2.1 AA)
- Express theoretical commitments through visual design
- Support both professional and personal presentation

### Constraints

- No framework dependencies (vanilla web components)
- Bundle size <100KB JavaScript
- Pixel art assets <50KB total
- First paint <1s, interactive <2s

## Decision

### 1. Web Components as Foundation

**Choice**: Use Lit for web component implementation

**Rationale**:
- Encapsulated, reusable components
- Framework-agnostic (can be used anywhere)
- Small bundle size (~5KB)
- TypeScript support
- Progressive enhancement compatible

**Alternatives considered**:
- React: Too heavy, requires framework
- Vue: Same issues as React
- Vanilla: Too verbose for complex state
- Svelte: Compilation step too complex

### 2. Two-World Architecture

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

**Implementation**:
```typescript
type World = 'overworld' | 'underworld';

interface WorldAware {
  world: World;
  transitioning: boolean;
}
```

### 3. Performance-First Animation Strategy

**Choice**: 
- Use `requestAnimationFrame` for all animations
- Intersection Observer for visibility detection
- CSS transforms only (no layout-triggering properties)
- Adaptive frame rates (desktop 60fps, mobile 30fps)

**Rationale**:
Glitch effects could easily cause performance issues. By:
- Only animating visible elements
- Throttling frame rates appropriately
- Using GPU-accelerated transforms
- Batching DOM updates

We achieve smooth performance even with multiple concurrent glitches.

**Performance budgets**:
```javascript
const BUDGETS = {
  desktop: {
    maxConcurrentAnimations: 10,
    targetFrameRate: 60,
    glitchUpdateRate: 20
  },
  mobile: {
    maxConcurrentAnimations: 3,
    targetFrameRate: 30,
    glitchUpdateRate: 10
  }
};
```

### 4. Theoretical Grounding in Code

**Choice**: Every visual element maps to feminist theory

**Rationale**: This isn't decoration—it's argument. Code comments explicitly connect visual choices to theory:

```typescript
/**
 * Chromatic aberration effect
 * 
 * THEORETICAL GROUNDING:
 * Multiple color channels visible simultaneously represent
 * Russell's concept of multiple simultaneous identities.
 * The self is not singular or stable, but multiplicitious.
 */
```

This makes the theory **actionable** for AI agents and future developers.

### 5. Accessibility as Core Feature

**Choice**: Build accessibility in from the start, not as afterthought

**Implementation**:
- Respect `prefers-reduced-motion` (disable auto-glitch, keep interactive)
- WCAG AA contrast ratios minimum
- Keyboard navigation for all interactions
- Screen reader announcements for world transitions
- Focus management in modals

**Rationale**: 
Glitch effects can be triggering for users with vestibular disorders. Accessibility isn't optional—it's part of the ethical commitment of feminist design.

### 6. Mobile-First Responsive Strategy

**Choice**: Adaptive design with simplified effects on mobile

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

**Rationale**: 
Mobile devices have:
- Less CPU/GPU power
- Smaller screens (detail less visible)
- Touch interaction (hover doesn't work)
- Battery constraints

Rather than degrading the experience, we **adapt** it appropriately.

### 7. Asset Strategy: PNG + CSS

**Choice**: Use PNG images with `image-rendering: pixelated` instead of CSS box-shadow for pixel art

**Rationale**:
- Better performance (1-2ms vs 5-10ms render)
- Easier to create/edit in Aseprite
- Smaller file sizes with proper optimization
- Better browser support

**Asset budget**: <50KB total
```
Modal frames (9-slice):     ~8KB
Icons (sprite sheet):       ~10KB
Borders (sprite sheet):     ~8KB
Textures (grain, etc.):     ~8KB
Backgrounds:                ~5KB
Misc:                       ~5KB
Total:                      ~44KB
```

### 8. Color System: Semantic Tokens

**Choice**: CSS custom properties organized by world and purpose

```css
:root {
  /* Overworld */
  --ow-bg-dark: #0a0e1a;
  --ow-border: #4a9eff;
  
  /* Underworld */
  --uw-bg-warm: #f5f1e8;
  --uw-accent: #c9a88a;
  
  /* Glitch (between worlds) */
  --glitch-magenta: #ff00ff;
  --glitch-cyan: #00ffff;
}
```

**Rationale**:
- Clear semantic meaning
- Easy theming
- Type-safe in TypeScript
- Readable in code

### 9. Component Taxonomy

**Three layers**:

1. **Core** (Atomic): Single-purpose, highly reusable
   - `glitch-text`, `glitch-border`, `film-grain`
   
2. **Composite** (Molecular): Combined functionality
   - `world-switcher`, `modal-window`, `navigation-menu`
   
3. **Layout** (Organisms): Page structure
   - `page-layout`, `section-container`

**Rationale**: 
Atomic design principles, but organized by functionality not strict hierarchy.

## Consequences

### Positive

- **Theoretically grounded**: Every choice defensible via feminist theory
- **Performance optimized**: Built for 60fps from start
- **Accessible**: WCAG compliance from day one
- **Maintainable**: Clear patterns, good documentation
- **Extensible**: AI agents can add components following patterns
- **Framework-agnostic**: Works anywhere web components work

### Negative

- **Higher initial complexity**: More work than standard CSS framework
- **Learning curve**: Requires understanding feminist theory
- **Custom components**: Can't use off-the-shelf libraries
- **Asset creation time**: Pixel art takes more time than CSS

### Risks

- **Theory translation**: Visual metaphors might not be clear to all users
- **Performance on old devices**: Unknown behavior on devices >5 years old
- **Maintenance burden**: Custom system requires ongoing work

### Mitigations

- **Documentation**: Extensive docs explain theory → design connections
- **Progressive enhancement**: Works without JavaScript (static content)
- **Performance monitoring**: Built-in frame rate tracking
- **Graceful degradation**: Fallbacks for older browsers

## Implementation Plan

### Phase 1: Foundation (Week 1)
- [ ] Set up build system (Vite + TypeScript)
- [ ] Create CSS tokens
- [ ] Implement `glitch-text` component
- [ ] Implement `glitch-border` component
- [ ] Create basic demo page

### Phase 2: Core Components (Week 2)
- [ ] `film-grain` overlay
- [ ] `world-switcher` component
- [ ] `scan-lines` effect
- [ ] `pixel-icon` component
- [ ] Asset creation in Aseprite

### Phase 3: Composite Components (Week 3)
- [ ] `modal-window` with pixel chrome
- [ ] `navigation-menu` (DOS style)
- [ ] `privacy-control` component
- [ ] `avatar-construct` component

### Phase 4: Layouts & Content (Week 4)
- [ ] `page-layout` component
- [ ] `section-container` component
- [ ] Populate with actual content
- [ ] Responsive refinement

### Phase 5: Polish (Week 5)
- [ ] Performance audit
- [ ] Accessibility audit
- [ ] Browser testing
- [ ] Documentation completion

## Alternatives Considered

### Alternative 1: Single Aesthetic
**Rejected**: Would lose the worldtraveling concept entirely. The dual worlds are core to Lugones' theory.

### Alternative 2: React/Next.js
**Rejected**: Framework lock-in, larger bundle, harder for AI agents to work with vanilla web components.

### Alternative 3: Pure CSS (No JavaScript)
**Rejected**: Can't implement interactive glitch effects, world switching, or performance optimizations.

### Alternative 4: Canvas/WebGL for Effects
**Rejected**: Overkill for text/border glitches. Would hurt accessibility (screen readers).

## References

### Theory
- Russell, Legacy. *Glitch Feminism: A Manifesto*. Verso, 2020.
- Lugones, Maria. "Playfulness, 'World'-Travelling, and Loving Perception." *Hypatia* 2.2 (1987): 3-19.
- Haraway, Donna. "A Cyborg Manifesto." *Socialist Review* 80 (1985): 65-108.

### Technical
- Web Components v1 Specification
- WCAG 2.1 Guidelines
- Lit Documentation
- CSS Containment Module Level 1

### Aesthetic
- Aseprite UI design patterns
- NES.css implementation
- PC-98 color palette research
- Hiromix photography collections

---

**Date**: 2026-01-27  
**Author**: Ada  
**Reviewers**: [Pending]  
**Status**: Proposed → Accepted pending implementation
