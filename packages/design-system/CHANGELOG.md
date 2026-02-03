# @studio/design-system

## 0.2.0

### Minor Changes

- 5f161f4: Add shared Bayer dither pattern utilities
  - New `patterns.css` with pre-generated CSS custom properties for dither patterns
  - New `bayer.ts` utility with matrix definitions and SVG generation functions
  - Export `--dither-gray`, `--dither-rose`, `--dither-teal`, `--dither-magenta`, `--dither-cyan`, and `--dither-white`
  - 4x4 Bayer matrix provides 75% size reduction vs 8x8 with equivalent visual quality

  Fix collage-canvas child notification
  - Defer child notification with requestAnimationFrame to ensure children are connected
  - Dispatch events directly to each collage-item instead of bubbling from parent

### Patch Changes

- Updated dependencies [5f161f4]
  - @studio/tokens@0.2.0

## 0.1.1

### Patch Changes

- [`f8f9d59`](https://github.com/adanoelle/studio/commit/f8f9d5934bcdaf3a6496cbfaa917ae03f5899dcb) Thanks [@adanoelle](https://github.com/adanoelle)! - Fix isConnected guard in glitch-border setupIntersectionObserver to prevent observing disconnected elements

- Updated dependencies []:
  - @studio/tokens@0.1.1

## 0.1.0

Initial release of the Studio design system.

### Features

- **glitch-text**: Text component with chromatic aberration glitch effects
- **glitch-border**: Border component that refuses containment through glitch effects
- **holographic-ui**: Holographic UI container with refraction effects
- **dithered-glitch-gradient**: Dithered gradient backgrounds with glitch transitions
- **dither-corruption**: Corruption effect using dithering patterns
- **dash-trail**: Animated dash trail component
- **hydra-canvas**: Hydra live-coding integration (requires hydra-synth peer dependency)
- **visualization-canvas**: Audio visualization canvas component

### Technical Highlights

- Built with Lit 3 for performant web components
- Intersection Observer for visibility-based animations
- prefers-reduced-motion support throughout
- GPU-accelerated animations using transforms
- Mobile-optimized with simplified effects

### Theoretical Foundation

Components are grounded in feminist theory:

- Russell's Glitch Feminism: error as vitality
- Lugones' World-Traveling: identity fluidity
- Haraway's Cyborg Manifesto: boundary dissolution
