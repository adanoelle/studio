# @studio/tokens

## 0.5.0

## 0.4.0

## 0.3.0

### Minor Changes

- [`5fd276a`](https://github.com/adanoelle/studio/commit/5fd276aa06de84ed4ffb67b1f405487e9cc2e2ec) Thanks [@adanoelle](https://github.com/adanoelle)! - Add dithering strategy with void texture utilities and modal-menu component

  **@studio/tokens:**
  - Add `--dither-warm` Bayer pattern token (Paean Black)
  - Add `--dither-void-warm` and `--dither-void-cool` void texture tokens
  - Add `--dither-void-size` convenience property

  **@studio/design-system:**
  - Add `generateVoidTextureSVG()` for color noise patterns (distinct from Bayer opacity)
  - Add `modal-menu` component: keyboard-first navigation with fuzzy search and glitch aesthetics
  - Fix `glitch-text` chromatic aberration positioning with `position: relative`
  - Improve `glitch-text` animation scaling using `em` units for consistent visual weight

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

## 0.1.1

## 0.1.0

Initial release of Studio design tokens.

### Features

- **base.css**: Core design tokens (colors, spacing, typography, timing)
- **glitch.css**: Glitch aesthetic tokens (chromatic aberration colors, animation timing)
- **analog.css**: Analog aesthetic tokens (grayscale palette, rose/teal accents)

### Token Categories

- Colors: Farrow & Ball inspired warm palette
- Spacing: Consistent spacing scale
- Typography: Font families and sizes
- Timing: Animation durations and easing functions
- Effects: Glitch-specific effect values
