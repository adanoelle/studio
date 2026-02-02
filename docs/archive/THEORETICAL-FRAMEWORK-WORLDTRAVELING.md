# Deferred: Worldtraveling as Mode-Switching

> **Status**: Deferred - See `docs/THEORETICAL-FRAMEWORK.md` for active theory documentation.

This document preserves the original design for explicit overworld/underworld mode-switching based on Maria Lugones' worldtraveling concept.

---

## Maria Lugones: Worldtraveling (1987)

### Key Concepts

**Overworld vs. Underworld**

- **Overworld**: Dominant culture where certain identities are validated, visible, rewarded
- **Underworld**: Marginalized spaces where different identities can fully exist
- **Worldtraveling**: Moving between these worlds with different presentations

Lugones argues we all "travel" between worlds, presenting different aspects of ourselves depending on context.

### Original Visual Implementation

**Overworld Design** (Professional, Public):

```css
.overworld {
  /* Cool, technical, "serious" */
  --palette: blues, grays, whites;
  --structure: formal grids, pixel precision;
  --typography: technical monospace;
  --mood: professional, expected;
}
```

Content: CV, technical writing, professional work

**Underworld Design** (Personal, Authentic):

```css
.underworld {
  /* Warm, organic, playful */
  --palette: creams, terracottas, warm grays;
  --structure: broken grids, film grain;
  --typography: warmer monospace;
  --mood: intimate, experimental;
}
```

Content: Creative projects, personal interests, experimental work

### The Transition

```typescript
// Worldtraveling is EXPLICIT, not hidden
function switchWorlds() {
  // 1. Glitch phase (making the transition visible)
  this.state = 'glitching';

  // 2. Actual switch
  this.currentWorld = this.currentWorld === 'overworld' ? 'underworld' : 'overworld';

  // 3. Settle into new world
  this.state = 'stable';
}
```

---

## Arrogant vs. Loving Perception

- **Arrogant perception**: Seeing others through your own world's lens, demanding they conform
- **Loving perception**: Attempting to see others as they see themselves in their world

### Visual Implementation

- Let users **choose** which world to see
- Don't hide the underworld (arrogant: "this isn't professional")
- Don't hide the overworld (arrogant: "just be authentic")
- Show **both** and let people travel between them

---

## Playfulness in Worldtraveling

Lugones emphasizes the **playful attitude** in worldtraveling—not taking any one world as absolute.

### Visual Implementation

- Glitches are playful, not aggressive
- World switching is easy, reversible
- Elements can belong to both worlds simultaneously
- Humor in the glitch effects (not everything is serious)

---

## Design Principles (Deferred)

### 1. No Single "Correct" View

**Theory**: Multiple simultaneous identities, worldtraveling

**Practice**:

- Overworld and underworld are **equally valid**
- Neither is hidden or deprecated
- User chooses which to view
- Some content exists in both

### 2. User Has Agency

**Theory**: Loving perception, playfulness

**Practice**:

- Users choose which world to view
- Users trigger glitches (hover/click)
- Users control privacy settings
- No auto-play, no surprise animations

### 3. Context Matters

**Theory**: Different worlds require different presentations

**Practice**:

- Professional content in overworld
- Personal content in underworld
- Some content transitions between
- Respect the context of each world

---

## Anti-Patterns

### Hiding the Underworld

```css
/* BAD: Treating personal content as "less than" */
.personal-content {
  display: none; /* Only shows professional */
}
```

**Why wrong**: This is arrogant perception—deciding the underworld isn't valid.

### Forcing Users into One World

```typescript
// BAD: Deciding for the user
const defaultWorld = 'overworld'; // Professional is "default"
```

**Why wrong**: Privileges one world over another.

**Correct approach**:

```typescript
// Let user choose, remember preference
const preferredWorld = localStorage.get('world') || askUser();
```

---

## Practical Applications (Deferred)

### About Section

**Overworld version**:

```html
<section class="overworld">
  <glitch-border world="overworld">
    <h2>Ada - Principal Reliability Engineer</h2>
    <p>8 years experience in distributed systems...</p>
  </glitch-border>
</section>
```

**Underworld version**:

```html
<section class="underworld">
  <glitch-border world="underworld" break-pattern="gap">
    <h2>Ada - Live Coder & Explorer</h2>
    <p>Making music with TidalCycles, building beautiful spaces...</p>
  </glitch-border>
</section>
```

**Both are true. Both are Ada. User chooses which to see.**

### Navigation

**Overworld**: DOS-style menu

```
╔═══════════════╗
║ > ABOUT       ║
║ > WORK        ║
║ > CV          ║
╚═══════════════╝
```

**Underworld**: Organic list

```
░▒▓ about
░▒▓ creative projects
░▒▓ experiments
```

---

## Why This Was Deferred

The current implementation takes a different approach:

1. **No professional/personal split** - Both "morning" and "evening" palettes are warm and personal
2. **Glitch at the boundary, not throughout** - The frame is the interface with the digital world
3. **Simpler mental model** - Visitors don't need to understand mode-switching

The worldtraveling concept is reframed as **page transitions** (traveling between content areas) rather than explicit mode-switching.

---

## Reactivating This Feature

If implementing world-switching in the future:

1. Add `world` property back to component APIs
2. Implement world-switcher component
3. Update color tokens to include `--ow-*` and `--uw-*` namespaces
4. Add world state management (localStorage preference)
5. Update navigation to show current world
