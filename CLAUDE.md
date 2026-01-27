# Guide for Claude Code Agents

This document provides specific instructions for AI agents (particularly Claude Code
agents) working on this design system.

## Quick Start for AI Agents

1. **Read these files first** (in order):
   - `docs/DESIGN-SUMMARY.md` - Primary source of truth for current design direction
   - `docs/THEORETICAL-FRAMEWORK.md` - Learn the feminist theory
   - `docs/DESIGN-SYSTEM.md` - Visual language specification
   - `docs/COMPONENT-API.md` - Component reference

2. **Understand the core principle**:
   - This is NOT just a design system
   - It's a **visual argument** about identity, multiplicity, and resistance
   - Every design choice must map to feminist theory

3. **Follow existing patterns**:
   - Look at `src/components/core/glitch-text.ts` as the reference implementation
   - All components follow the same structure

4. **Know what's deferred**:
   - World-switching (overworld/underworld) is in `docs/archive/`
   - Guide character sprite is in `docs/archive/`
   - Focus on the single warm palette with glitch effects at the boundary

## Creating New Components

### Step-by-Step Process

1. **Identify the theoretical grounding**
   - What concept from Russell/Lugones/Haraway does this embody?
   - How does it visually represent that concept?
   - Document this in code comments

2. **Start from the template**:

```typescript
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

/**
 * COMPONENT-NAME COMPONENT
 *
 * THEORETICAL GROUNDING:
 * [Explain which feminist concept this embodies and how]
 *
 * VISUAL METAPHOR:
 * [Explain the visual design choices]
 */
@customElement("component-name")
export class ComponentName extends LitElement {
  // Properties (public API)
  @property({ type: Number })
  intensity = 0.3;

  @property({ type: Boolean })
  idleGlitch = true;

  // State (internal)
  @state()
  private isActive = false;

  @state()
  private isVisible = false;

  // Configuration
  private config = {
    idleInterval: 45000, // ~30-60s randomized
  };

  // Lifecycle
  connectedCallback() {
    super.connectedCallback();
    this.setupVisibilityObserver();
    if (this.idleGlitch) this.scheduleIdleGlitch();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Cleanup observers, timers, rafs
  }

  // Styles
  static styles = css`
    /* Component styles */

    @media (prefers-reduced-motion: reduce) {
      /* Disable idle glitches, simplify hover */
    }
  `;

  // Render
  render() {
    return html` <!-- Template --> `;
  }
}
```

3. **Design for warm palette**:
   - Use the Farrow & Ball warm tones for base styling
   - Glitch effects (magenta/cyan) at boundary and on interaction
   - Content area stays readable and calm

4. **Implement performance optimizations**:

   ```typescript
   // Always include:
   - Intersection Observer for visibility
   - requestAnimationFrame for animations
   - GPU-accelerated transforms only
   - Mobile-specific simplifications
   - Reduced motion support
   ```

5. **Add accessibility**:

   ```typescript
   // Required:
   - ARIA labels
   - Keyboard navigation
   - Focus management
   - Screen reader support
   - Color contrast (WCAG AA)
   ```

6. **Document thoroughly**:
   ```typescript
   /**
    * THEORETICAL GROUNDING:
    * This component implements [theory concept]...
    *
    * PERFORMANCE:
    * Uses Intersection Observer to only animate when visible
    *
    * ACCESSIBILITY:
    * Respects prefers-reduced-motion
    */
   ```

## File Organization

When creating new files, follow this structure:

```
src/components/
├── core/              # Atomic components
│   └── component.ts   # Single-purpose, highly reusable
├── composite/         # Molecular components
│   └── component.ts   # Combined functionality
└── layout/            # Organism components
    └── component.ts   # Page structure

docs/
├── DESIGN-SUMMARY.md  # Source of truth
├── COMPONENT-API.md   # API reference
├── DESIGN-SYSTEM.md   # Tokens & visual language
├── THEORETICAL-FRAMEWORK.md
└── archive/           # Deferred features (don't read unless needed)
```

## Code Style

### Naming

```typescript
// Classes: PascalCase
class GlitchText extends LitElement {}

// Properties: camelCase
@property() hoverDelay = 100;

// Private: prefix _
private _rafId?: number;

// Constants: SCREAMING_SNAKE_CASE
const MAX_ITERATIONS = 20;

// CSS classes: kebab-case
.glitch-text {}
```

### Comments

```typescript
/**
 * Public API documentation (JSDoc)
 * Used for autocomplete and docs generation
 */
@property() text = '';

// Private implementation notes
private updateGlitch() {
  // Step-by-step explanation
}

/**
 * THEORETICAL GROUNDING:
 * Explain feminist theory connection
 */
```

## Common Patterns

### Glitch Text with Idle Animation

```typescript
@customElement("glitch-text")
export class GlitchText extends LitElement {
  @property({ type: String }) text = '';
  @property({ type: Number }) intensity = 0.3;
  @property({ type: Boolean }) idleGlitch = true;
  @property({ type: Number }) idleInterval = 45000;

  private idleTimer?: number;
  private isVisible = false;

  connectedCallback() {
    super.connectedCallback();
    this.setupVisibility();
    this.scheduleIdleGlitch();
  }

  private scheduleIdleGlitch() {
    if (!this.idleGlitch) return;
    // Randomize: 30-60 seconds
    const delay = this.idleInterval + (Math.random() - 0.5) * 30000;
    this.idleTimer = window.setTimeout(() => {
      if (this.isVisible) this.triggerBriefGlitch();
      this.scheduleIdleGlitch();
    }, delay);
  }

  private triggerBriefGlitch() {
    // 200-500ms glitch
    this.startGlitch();
    setTimeout(() => this.stopGlitch(), 200 + Math.random() * 300);
  }
}
```

### Performance-Optimized Animation

```typescript
private rafId?: number;
private lastUpdate = 0;
private updateInterval = 50; // 20fps

private animationLoop = (timestamp: number) => {
  // Throttle to target FPS
  if (timestamp - this.lastUpdate < this.updateInterval) {
    this.rafId = requestAnimationFrame(this.animationLoop);
    return;
  }

  this.lastUpdate = timestamp;
  this.doUpdate();
  this.rafId = requestAnimationFrame(this.animationLoop);
}

// Always cleanup
disconnectedCallback() {
  if (this.rafId) {
    cancelAnimationFrame(this.rafId);
  }
}
```

### Intersection Observer for Visibility

```typescript
private observer?: IntersectionObserver;
private isVisible = false;

connectedCallback() {
  super.connectedCallback();

  this.observer = new IntersectionObserver(
    (entries) => {
      this.isVisible = entries[0].isIntersecting;
      if (!this.isVisible) this.stopAnimation();
    },
    { threshold: 0.1 }
  );

  this.observer.observe(this);
}

disconnectedCallback() {
  super.disconnectedCallback();
  this.observer?.disconnect();
}
```

### Accessibility Pattern

```typescript
static styles = css`
  /* Always respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .animated {
      animation: none !important;
    }
  }

  /* Ensure focus is visible */
  :host(:focus) {
    outline: 2px solid var(--glitch-cyan);
    outline-offset: 2px;
  }
`;

render() {
  return html`
    <div
      role="button"
      tabindex="0"
      aria-label="Descriptive label"
      @keydown=${this.handleKeyboard}
    >
      <!-- Content -->
    </div>
  `;
}

private handleKeyboard(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    this.activate();
  }
}
```

## Testing Requirements

Every component must have:

1. **Unit tests**:
   - Renders correctly
   - Props work
   - Methods work
   - Events fire

2. **Accessibility tests**:
   - Keyboard navigation
   - Screen reader compatibility
   - Reduced motion respected
   - Color contrast verified

3. **Performance tests**:
   - Frame rate maintained
   - Memory doesn't leak
   - Visibility detection works

## Anti-Patterns to Avoid

### Don't: Forget theoretical grounding

```typescript
// BAD: No explanation of theory
class MyComponent extends LitElement {
  // Just some code...
}
```

```typescript
// GOOD: Clear theoretical connection
/**
 * THEORETICAL GROUNDING:
 * This component embodies Russell's concept of glitch as refusal
 * by making text unstable on interaction, refusing fixed meaning
 */
class MyComponent extends LitElement {}
```

### Don't: Use layout-triggering properties

```typescript
// BAD: Triggers layout recalculation
.animated {
  left: 10px;  /* Forces layout */
  top: 10px;   /* Forces layout */
}
```

```typescript
// GOOD: GPU-accelerated
.animated {
  transform: translate(10px, 10px);  /* Compositor only */
  will-change: transform;
}
```

### Don't: Ignore accessibility

```typescript
// BAD: No keyboard support
<div @click=${this.handle}>Click me</div>
```

```typescript
// GOOD: Full accessibility
<button
  @click=${this.handle}
  @keydown=${this.handleKey}
  aria-label="Descriptive label"
>
  Click me
</button>
```

### Don't: Animate everything always

```typescript
// BAD: Runs even when off-screen
connectedCallback() {
  this.startAnimation(); // Wastes CPU
}
```

```typescript
// GOOD: Only animates when visible
connectedCallback() {
  this.setupIntersectionObserver();
  // Animation starts when visible
}
```

### Don't: Make glitches aggressive

```typescript
// BAD: Constant intense glitching
setInterval(() => this.glitch(), 100);
```

```typescript
// GOOD: Hover + rare idle glitches
// Primary: user-triggered on hover
// Secondary: ~30-60 second random interval, brief duration
```

## Debugging Tips

### Performance Issues

```typescript
// Add performance monitoring
if (import.meta.env.DEV) {
  const start = performance.now();
  this.expensiveOperation();
  const duration = performance.now() - start;

  if (duration > 16.67) {
    // Exceeds 60fps budget
    console.warn("Performance issue:", duration, "ms");
  }
}
```

### Visual Debugging

```typescript
// Add debug mode
@property({ type: Boolean })
debug = false;

render() {
  return html`
    ${this.debug ? html`
      <div class="debug-info">
        State: ${this.currentState}
        Visible: ${this.isVisible}
        Glitching: ${this.isGlitching}
      </div>
    ` : ''}
    <!-- Regular content -->
  `;
}
```

## Deployment Checklist

Before committing new components:

- [ ] Theoretical grounding documented
- [ ] Warm palette styling implemented
- [ ] Glitch effects on interaction (hover + rare idle)
- [ ] Performance optimized
  - [ ] Intersection Observer
  - [ ] requestAnimationFrame
  - [ ] GPU transforms only
  - [ ] Mobile simplified
- [ ] Accessibility complete
  - [ ] Keyboard navigation
  - [ ] ARIA labels
  - [ ] Reduced motion (idle glitches disabled)
  - [ ] Color contrast
- [ ] Tests written
- [ ] API documented
- [ ] Examples created

## Resources

### Code References

- `glitch-text.ts` - Reference implementation
- `glitch-border.ts` - Border patterns
- `tokens.css` - Design tokens

### Documentation

- `docs/DESIGN-SUMMARY.md` - Current design direction
- `docs/COMPONENT-API.md` - Component APIs
- `docs/archive/` - Deferred features (world-switching, guide character)

### Theory References

- Russell, Legacy. _Glitch Feminism_ (2020)
- Lugones, Maria. "Worldtraveling" (1987)
- Haraway, Donna. "Cyborg Manifesto" (1985)

### Technical References

- Lit Documentation: https://lit.dev
- Web Components: https://developer.mozilla.org/en-US/docs/Web/API/Web_components
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/

## Getting Help

When stuck:

1. Check existing components for patterns
2. Read `docs/DESIGN-SUMMARY.md` for current direction
3. Review the theoretical framework docs
4. Verify accessibility
5. Check performance

## Final Reminder

**This is not decoration - it's argument made visible.**

Every visual choice must be defensible through feminist theory. The glitch isn't
error - it's vitality. The boundary isn't a wall - it's a living membrane.

If you can't explain how a design decision embodies the theory, rethink it.
