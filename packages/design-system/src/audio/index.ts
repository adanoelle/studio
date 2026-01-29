/**
 * AUDIO VISUALIZATION MODULE
 *
 * Components and services for Strudel-reactive background visualization.
 *
 * @example
 * ```typescript
 * import {
 *   VisualizationCanvas,
 *   StrudelBridge,
 *   createStrudelBridge,
 * } from '@studio/design-system/audio';
 *
 * // Components auto-register as custom elements
 * // <visualization-canvas></visualization-canvas>
 *
 * // Or create bridge manually
 * const bridge = createStrudelBridge();
 * bridge.connectAudio(audioContext, gainNode);
 * ```
 */

// Components
export { VisualizationCanvas } from './visualization-canvas.js';
export { HydraCanvas } from './hydra-canvas.js';

// Services
export { StrudelBridge, createStrudelBridge } from './strudel-bridge.js';

// Types
export type {
  Hap,
  HapValue,
  TimeSpan,
  StrudelTime,
  AudioAnalysis,
  FrequencyBands,
  VisualizationState,
  VisualizationConfig,
  StrudelBridgeConfig,
  StrudelHapEvent,
  StrudelPlaybackEvent,
  StrudelAudioEvent,
} from './types.js';

// Constants
export {
  STRUDEL_EVENTS,
  VISUALIZATION_COLORS,
  DEFAULT_BRIDGE_CONFIG,
  DEFAULT_VISUALIZATION_CONFIG,
  colorWithAlpha,
} from './types.js';
