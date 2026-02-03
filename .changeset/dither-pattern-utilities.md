---
'@studio/tokens': minor
'@studio/design-system': minor
---

Add shared Bayer dither pattern utilities

- New `patterns.css` with pre-generated CSS custom properties for dither patterns
- New `bayer.ts` utility with matrix definitions and SVG generation functions
- Export `--dither-gray`, `--dither-rose`, `--dither-teal`, `--dither-magenta`, `--dither-cyan`, and `--dither-white`
- 4x4 Bayer matrix provides 75% size reduction vs 8x8 with equivalent visual quality

Fix collage-canvas child notification

- Defer child notification with requestAnimationFrame to ensure children are connected
- Dispatch events directly to each collage-item instead of bubbling from parent
