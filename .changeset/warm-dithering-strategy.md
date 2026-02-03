---
"@studio/design-system": minor
"@studio/tokens": minor
---

Add dithering strategy with void texture utilities and modal-menu component

**@studio/tokens:**
- Add `--dither-warm` Bayer pattern token (Paean Black)
- Add `--dither-void-warm` and `--dither-void-cool` void texture tokens
- Add `--dither-void-size` convenience property

**@studio/design-system:**
- Add `generateVoidTextureSVG()` for color noise patterns (distinct from Bayer opacity)
- Add `modal-menu` component: keyboard-first navigation with fuzzy search and glitch aesthetics
- Fix `glitch-text` chromatic aberration positioning with `position: relative`
- Improve `glitch-text` animation scaling using `em` units for consistent visual weight
