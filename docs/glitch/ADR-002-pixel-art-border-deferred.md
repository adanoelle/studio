# ADR 002: Pixel Art Border Implementation Deferred

## Status

**Deferred** - February 2026

## Context

The design system specifies pixel art borders created in Aseprite using the 9-slice technique for scalable frames. This would provide an authentic retro aesthetic consistent with the PC-98 and Aseprite UI influences.

### What Was Considered

- **9-slice pixel art border** created in Aseprite
- **CSS `border-image`** for scalable frame rendering
- **Multiple visual states**: idle, active, intense/glitching
- **Asset specifications** from DESIGN-SYSTEM.md:
  - Borders: 48×48 (9-slice)
  - Windows: 128×128 (9-slice)
  - Target size: <2-5KB per asset
  - Color palette: warm F&B palette + glitch colors (magenta/cyan)

### Implementation (What It Would Look Like)

#### Aseprite Workflow

1. **Create 48×48 canvas** for border frames
2. **Draw 9-slice grid** with corner, edge, and center regions:

```
┌───┬─────────┬───┐
│ 1 │    2    │ 3 │  Corners (1,3,7,9): Fixed size
├───┼─────────┼───┤  Edges (2,4,6,8): Stretch in one direction
│ 4 │    5    │ 6 │  Center (5): Stretches both directions
├───┼─────────┼───┤
│ 7 │    8    │ 9 │
└───┴─────────┴───┘
```

3. **Export settings**:
   - Format: PNG-8 with indexed color
   - Scale: 1x (preserve pixel crispness)
   - Optimization: pngquant for <2KB files

#### File Naming Convention

```
assets/borders/
├── border-idle.png         # Default state
├── border-active.png       # Hover/focus state
├── border-glitch-1.png     # Glitch animation frame 1
├── border-glitch-2.png     # Glitch animation frame 2
└── border-glitch-3.png     # Glitch animation frame 3
```

#### CSS Integration

```css
.pixel-border {
  border-image-source: url('/assets/borders/border-idle.png');
  border-image-slice: 16 fill; /* 16px corners */
  border-image-width: 16px;
  border-image-repeat: stretch;
  image-rendering: pixelated;
}

.pixel-border:hover {
  border-image-source: url('/assets/borders/border-active.png');
}
```

#### Component Integration

The existing `glitch-border` component would accept an optional `pixelArt` mode:

```typescript
@property({ type: Boolean })
pixelArt = false;

@property({ type: String })
borderAsset = '/assets/borders/border-idle.png';
```

## Decision

Defer pixel art border implementation in favor of the current CSS-based `glitch-border` approach.

## Why Deferred

### 1. Asset Creation Dependency

Requires manual Aseprite work before code can proceed. The design system cannot be code-complete until all assets are created, tested, and optimized.

### 2. Responsive Challenges

Pixel art doesn't scale cleanly between breakpoints:

- **Desktop**: 48×48 source looks crisp at 1x-2x
- **Mobile**: May need separate assets or accept blurriness
- **Retina displays**: `image-rendering: pixelated` behavior varies by browser

### 3. Animation Complexity

Two approaches exist, neither is clearly better:

- **Sprite sheet animation**: Multiple frames, larger file, smoother motion
- **CSS filters on static art**: Single asset, smaller file, less authentic glitch

### 4. Current Solution Works

The CSS-based `glitch-border` achieves the theoretical goal:

- **"Membrane" concept**: Border as living boundary between crafted space and internet
- **Chromatic aberration**: RGB split effect on hover/idle
- **Performance**: No additional asset loading
- **Accessibility**: Works with `prefers-reduced-motion`

## Consequences

### Positive

- Can proceed with other components without blocking on asset creation
- Simpler build pipeline (no image optimization step)
- No asset management or versioning concerns
- Faster initial page load (no border images to fetch)

### Negative

- Less authentic "pixel art" aesthetic
- May feel more generic/CSS-framework-like
- Loses the Aseprite/PC-98 visual connection

### Mitigations

- CSS approach can still incorporate dither patterns via `background-image`
- Chromatic aberration provides strong glitch identity
- Border glow and animation achieve similar visual weight
- Can add pixel art overlay textures without full 9-slice implementation

## Reactivating This Feature

To implement pixel art borders in the future:

1. **Create assets in Aseprite** following DESIGN-SYSTEM.md guidelines:
   - 48×48 for standard borders
   - 128×128 for window frames
   - Indexed color with F&B warm palette + glitch colors
   - Export as optimized PNG-8

2. **Decide on animation approach**:
   - Sprite sheet for frame-by-frame glitch animation, OR
   - Single asset with CSS filter manipulation

3. **Update `glitch-border` component**:
   - Add `pixelArt` boolean property
   - Add `borderAsset` path property
   - Implement `border-image` CSS when pixel art mode enabled
   - Fall back to current CSS approach when disabled

4. **Test responsive behavior**:
   - Verify `image-rendering: pixelated` across browsers
   - Test on mobile devices and retina displays
   - Consider separate mobile assets if needed

5. **Update build pipeline**:
   - Add image optimization step (pngquant)
   - Configure asset copying/hashing
   - Add preload hints for critical border assets

## References

- DESIGN-SYSTEM.md - Pixel art specifications
- ADR-001-architecture.md - Asset strategy decision
- `glitch-border` component - Current CSS implementation

---

**Date**: 2026-02-02
**Author**: Ada
**Status**: Deferred
