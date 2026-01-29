/**
 * GLITCH FEMINIST DESIGN SYSTEM
 *
 * Main entry point for the component library.
 *
 * Usage:
 * import 'glitch-feminist-design-system';
 *
 * Or import specific components:
 * import 'glitch-feminist-design-system/dist/components/core/glitch-text.js';
 */

// Export core components
export { GlitchText } from './components/core/glitch-text.js';
export { GlitchBorder } from './components/core/glitch-border.js';
export { DitheredGlitchGradient } from './components/core/dithered-glitch-gradient.js';

// Export composite components
export { HolographicUI } from './components/composite/holographic-ui.js';
export { DitherCorruption } from './components/composite/dither-corruption.js';
export { DashTrail } from './components/composite/dash-trail.js';

// Export audio/visualization components
export { VisualizationCanvas } from './components/audio/visualization-canvas.js';
export { HydraCanvas } from './components/audio/hydra-canvas.js';
export { StrudelBridge, createStrudelBridge } from './components/audio/strudel-bridge.js';

// Re-export audio types
export type {
  Hap,
  HapValue,
  AudioAnalysis,
  FrequencyBands,
  VisualizationState,
  StrudelBridgeConfig,
  VisualizationConfig,
} from './components/audio/types.js';

export {
  STRUDEL_EVENTS,
  VISUALIZATION_COLORS,
} from './components/audio/types.js';
