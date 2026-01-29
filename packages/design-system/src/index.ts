/**
 * STUDIO DESIGN SYSTEM
 *
 * Main entry point for the component library.
 * Unified design system for creative practice - glitch + analog aesthetics.
 *
 * Usage:
 * import '@studio/design-system';
 *
 * Or import from specific submodules:
 * import { GlitchText } from '@studio/design-system/glitch';
 * import { HydraCanvas } from '@studio/design-system/audio';
 */

// Re-export all glitch components
export {
  GlitchText,
  GlitchBorder,
  DitheredGlitchGradient,
  HolographicUI,
  DitherCorruption,
  DashTrail,
  GlitchBase,
} from './glitch/index.js';

// Re-export all audio/visualization components
export {
  VisualizationCanvas,
  HydraCanvas,
  StrudelBridge,
  createStrudelBridge,
} from './audio/index.js';

// Re-export audio types
export type {
  Hap,
  HapValue,
  AudioAnalysis,
  FrequencyBands,
  VisualizationState,
  StrudelBridgeConfig,
  VisualizationConfig,
} from './audio/types.js';

export {
  STRUDEL_EVENTS,
  VISUALIZATION_COLORS,
} from './audio/types.js';

// Analog components will be added as they're built
// export { FretboardDiagram } from './analog/index.js';
