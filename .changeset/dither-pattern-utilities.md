---
'@studio/tokens': minor
'@studio/design-system': minor
---

Add shared Bayer dither pattern utilities

- New `patterns.css` with pre-generated CSS custom properties for dither patterns
- New `bayer.ts` utility with matrix definitions and SVG generation functions
- Export `--dither-gray`, `--dither-rose`, `--dither-teal`, `--dither-magenta`, `--dither-cyan`, and `--dither-white`
- 4x4 Bayer matrix provides 75% size reduction vs 8x8 with equivalent visual quality
