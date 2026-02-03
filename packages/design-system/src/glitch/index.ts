/**
 * GLITCH COMPONENTS
 *
 * Web components grounded in feminist theory - glitch effects, dithering,
 * and visual disruption embodying concepts from Legacy Russell and Maria Lugones.
 *
 * @example
 * ```typescript
 * import { GlitchText, GlitchBorder } from '@studio/design-system/glitch';
 * ```
 */

// Core components
export { GlitchText } from './glitch-text.js';
export { GlitchBorder } from './glitch-border.js';
export { GlitchWaveform } from './glitch-waveform.js';
export { DitheredGlitchGradient } from './dithered-glitch-gradient.js';

// Composite components
export { HolographicUI } from './holographic-ui.js';
export { DitherCorruption } from './dither-corruption.js';
export { DashTrail } from './dash-trail.js';
export { ModalMenu } from './modal-menu.js';
export type { MenuItem } from './modal-menu.js';

// Archive components
export { ArchiveCard } from './archive-card.js';
export { ArchiveGrid } from './archive-grid.js';
export { TagFilter } from './tag-filter.js';
export type {
  ArchiveItem,
  ImageItem,
  WritingItem,
  SoundItem,
  CodeItem,
} from './archive-types.js';

// Base class for extending
export { GlitchBase } from './glitch-base.js';
