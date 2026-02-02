/**
 * STRUDEL VISUALIZATION TYPES
 *
 * Type definitions for integrating Strudel pattern events
 * with the visualization layer.
 *
 * ARCHITECTURE:
 * These types bridge Strudel's pattern scheduler with our Canvas 2D
 * visualization. The visualization runs at its own frame rate (60fps)
 * while receiving events from Strudel's 50ms scheduler ticks.
 */

// ============================================
// STRUDEL PATTERN TYPES
// ============================================

/**
 * Time value in Strudel's rational time system
 * Strudel uses fractions for precise rhythmic timing
 */
export interface StrudelTime {
  /** Numerator */
  n: number;
  /** Denominator */
  d: number;
}

/**
 * Time span representing a range in pattern time
 */
export interface TimeSpan {
  /** Start of the span */
  begin: number;
  /** End of the span */
  end: number;
}

/**
 * A Hap (happening) is Strudel's fundamental event unit
 *
 * THEORETICAL GROUNDING:
 * Haps represent discrete moments of sonic expression within a pattern.
 * Like glitch moments in identity, they are both predictable (within
 * the pattern structure) and unique (each occurrence is a new event).
 */
export interface Hap<T = HapValue> {
  /**
   * The "whole" time span - when the event conceptually occurs
   * May span multiple cycles or be undefined for continuous events
   */
  whole?: TimeSpan;

  /**
   * The "part" time span - the actual portion being played
   * For events spanning cycle boundaries, part shows what's in this cycle
   */
  part: TimeSpan;

  /**
   * The value of this event (note, controls, etc.)
   */
  value: T;

  /**
   * Whether this event has a definite start (vs. continuation)
   */
  hasOnset?: boolean;
}

/**
 * Common control values in a Hap
 * These are the parameters that affect sound and can drive visualization
 */
export interface HapValue {
  /** Note number (MIDI) or note name */
  note?: number | string;

  /** Frequency in Hz */
  freq?: number;

  /** Amplitude/volume (0-1) */
  gain?: number;

  /** Filter cutoff frequency */
  cutoff?: number;

  /** Resonance/Q */
  resonance?: number;

  /** Pan position (-1 to 1) */
  pan?: number;

  /** Sample or synth name */
  s?: string;

  /** Speed/rate multiplier */
  speed?: number;

  /** Attack time */
  attack?: number;

  /** Release time */
  release?: number;

  /** Sustain level */
  sustain?: number;

  /** Decay time */
  decay?: number;

  /** Delay amount */
  delay?: number;

  /** Room reverb amount */
  room?: number;

  /** Orbit (channel) number */
  orbit?: number;

  /** Any additional custom controls */
  [key: string]: unknown;
}

// ============================================
// AUDIO ANALYSIS TYPES
// ============================================

/**
 * Processed audio analysis data from Web Audio AnalyserNode
 *
 * PERFORMANCE:
 * This data is cached and updated every ~50ms to avoid
 * excessive FFT computation while maintaining responsiveness.
 */
export interface AudioAnalysis {
  /** FFT frequency data (0-255 per bin) */
  frequencyData: Uint8Array;

  /** Time domain waveform data (0-255) */
  timeDomainData: Uint8Array;

  /** Number of FFT bins */
  fftSize: number;

  /** Timestamp of this analysis */
  timestamp: number;
}

/**
 * Simplified frequency bands for visualization
 * Pre-computed from raw FFT data
 */
export interface FrequencyBands {
  /** Sub-bass (20-60 Hz) - normalized 0-1 */
  sub: number;

  /** Bass (60-250 Hz) - normalized 0-1 */
  bass: number;

  /** Low-mid (250-500 Hz) - normalized 0-1 */
  lowMid: number;

  /** Mid (500-2000 Hz) - normalized 0-1 */
  mid: number;

  /** High-mid (2000-4000 Hz) - normalized 0-1 */
  highMid: number;

  /** Treble (4000-20000 Hz) - normalized 0-1 */
  treble: number;

  /** Overall average level - normalized 0-1 */
  average: number;
}

// ============================================
// VISUALIZATION STATE
// ============================================

/**
 * Current state of the visualization layer
 */
export interface VisualizationState {
  /** Whether audio is currently playing */
  isPlaying: boolean;

  /** Current playback time in cycles */
  currentCycle: number;

  /** Events currently active (started but not ended) */
  activeHaps: Hap[];

  /** Most recent audio analysis */
  audioAnalysis: AudioAnalysis | null;

  /** Computed frequency bands */
  frequencyBands: FrequencyBands | null;

  /** Opacity for fade transitions (0-1) */
  opacity: number;
}

// ============================================
// EVENT TYPES
// ============================================

/**
 * Event fired when Strudel triggers a hap
 */
export interface StrudelHapEvent extends CustomEvent {
  detail: {
    /** The triggered hap */
    hap: Hap;

    /** Deadline relative to audio context time */
    deadline: number;

    /** Duration of this event */
    duration: number;

    /** Current cycle position */
    cyclePosition: number;
  };
}

/**
 * Event fired when playback state changes
 */
export interface StrudelPlaybackEvent extends CustomEvent {
  detail: {
    /** Whether playback is now active */
    isPlaying: boolean;

    /** Cycle position at state change */
    cyclePosition: number;
  };
}

/**
 * Event fired with new audio analysis data
 */
export interface StrudelAudioEvent extends CustomEvent {
  detail: {
    /** Raw analysis data */
    analysis: AudioAnalysis;

    /** Computed frequency bands */
    bands: FrequencyBands;
  };
}

// ============================================
// STRUDEL BRIDGE CONFIG
// ============================================

/**
 * Configuration for the Strudel bridge
 */
export interface StrudelBridgeConfig {
  /** How often to update audio analysis (ms) */
  analysisInterval?: number;

  /** FFT size for frequency analysis (power of 2) */
  fftSize?: number;

  /** Smoothing for FFT (0-1, higher = smoother) */
  smoothingTimeConstant?: number;

  /** Whether to dispatch events on the window */
  useWindowEvents?: boolean;
}

/**
 * Default bridge configuration
 */
export const DEFAULT_BRIDGE_CONFIG: Required<StrudelBridgeConfig> = {
  analysisInterval: 50,
  fftSize: 256,
  smoothingTimeConstant: 0.8,
  useWindowEvents: true,
};

// ============================================
// VISUALIZATION CONFIG
// ============================================

/**
 * Configuration for the visualization canvas
 */
export interface VisualizationConfig {
  /** Target frames per second */
  targetFps?: number;

  /** Fade in duration when playback starts (ms) */
  fadeInDuration?: number;

  /** Fade out duration when playback stops (ms) */
  fadeOutDuration?: number;

  /** Maximum number of visual elements on mobile */
  mobileMaxElements?: number;

  /** Maximum number of visual elements on desktop */
  desktopMaxElements?: number;

  /** Duration for reduced-motion color transitions (ms) */
  reducedMotionTransitionDuration?: number;
}

/**
 * Default visualization configuration
 */
export const DEFAULT_VISUALIZATION_CONFIG: Required<VisualizationConfig> = {
  targetFps: 60,
  fadeInDuration: 400,
  fadeOutDuration: 400,
  mobileMaxElements: 100,
  desktopMaxElements: 500,
  reducedMotionTransitionDuration: 3000,
};

// ============================================
// COLOR PALETTE
// ============================================

/**
 * Muted color palette for visualization
 * Matches the analog music journal aesthetic
 */
export const VISUALIZATION_COLORS = {
  /** Warm rose accent */
  rose: '#8a5555',

  /** Cool teal accent */
  teal: '#527878',

  /** Light gray */
  grayLight: '#9a9a9a',

  /** Medium gray */
  grayMid: '#6a6a6a',

  /** Dark gray */
  grayDark: '#4a4a4a',

  /** Background (semi-transparent) */
  background: 'rgba(58, 54, 50, 0.1)',
} as const;

/**
 * Helper to get color with alpha
 */
export function colorWithAlpha(hex: string, alpha: number): string {
  // Handle rgba format
  if (hex.startsWith('rgba')) {
    return hex.replace(/[\d.]+\)$/, `${alpha})`);
  }

  // Convert hex to rgba
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================
// CUSTOM EVENT NAMES
// ============================================

export const STRUDEL_EVENTS = {
  HAP: 'strudel:hap',
  PLAYBACK: 'strudel:playback',
  AUDIO: 'strudel:audio',
} as const;
