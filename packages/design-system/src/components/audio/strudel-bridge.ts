/**
 * STRUDEL BRIDGE SERVICE
 *
 * THEORETICAL GROUNDING:
 * This bridge connects the algorithmic patterns of Strudel with our
 * visualization layer. Like Haraway's cyborg, it exists at the boundary
 * between symbolic code (patterns) and embodied experience (sound/visuals).
 *
 * ARCHITECTURE:
 * The bridge receives callbacks from Strudel's scheduler and transforms them
 * into CustomEvents that the visualization layer can consume. It also manages
 * Web Audio analysis for frequency-reactive visuals.
 *
 * ```
 * Strudel Scheduler (50ms intervals)
 *        ↓
 *  StrudelBridge (transforms + caches)
 *        ↓
 *  CustomEvents on window
 *        ↓
 *  VisualizationCanvas
 * ```
 *
 * PERFORMANCE:
 * - Audio analysis is cached at 50ms intervals
 * - Events are dispatched synchronously for low latency
 * - Frequency bands are pre-computed to avoid per-frame FFT processing
 */

import {
  type Hap,
  type AudioAnalysis,
  type FrequencyBands,
  type StrudelBridgeConfig,
  DEFAULT_BRIDGE_CONFIG,
  STRUDEL_EVENTS,
} from './types.js';

/**
 * Bridge between Strudel and the visualization layer
 *
 * @example
 * ```typescript
 * // Create bridge
 * const bridge = new StrudelBridge();
 *
 * // Connect to Strudel's scheduler
 * repl.setOnTrigger((hap, deadline, duration) => {
 *   bridge.onTrigger(hap, deadline, duration);
 * });
 *
 * // Connect to audio context
 * bridge.connectAudio(audioContext, audioContext.destination);
 *
 * // Handle playback state
 * repl.setOnPlay(() => bridge.setPlaying(true));
 * repl.setOnStop(() => bridge.setPlaying(false));
 * ```
 */
export class StrudelBridge {
  // ============================================
  // CONFIGURATION
  // ============================================

  private _config: Required<StrudelBridgeConfig>;

  // ============================================
  // STATE
  // ============================================

  private _isPlaying = false;
  private _currentCycle = 0;

  // ============================================
  // AUDIO ANALYSIS
  // ============================================

  private _audioContext: AudioContext | null = null;
  private _analyser: AnalyserNode | null = null;
  private _frequencyData: Uint8Array | null = null;
  private _timeDomainData: Uint8Array | null = null;
  private _analysisInterval: number | null = null;
  private _lastAnalysis: AudioAnalysis | null = null;
  private _lastBands: FrequencyBands | null = null;

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(config: StrudelBridgeConfig = {}) {
    this._config = { ...DEFAULT_BRIDGE_CONFIG, ...config };
  }

  // ============================================
  // PUBLIC API - STRUDEL CALLBACKS
  // ============================================

  /**
   * Called by Strudel's scheduler when a hap is triggered
   *
   * @param hap - The triggered hap
   * @param deadline - When the hap should sound (relative to audio context time)
   * @param duration - Duration of the hap in seconds
   */
  onTrigger(hap: Hap, deadline: number, duration: number): void {
    // Dispatch event for visualization
    this._dispatchHapEvent(hap, deadline, duration);
  }

  /**
   * Called when a scheduler tick occurs with queried haps
   * Useful for getting all events in a time range
   *
   * @param haps - Array of haps in the current tick
   * @param cyclePosition - Current position in the cycle
   */
  onTick(haps: Hap[], cyclePosition: number): void {
    this._currentCycle = cyclePosition;

    // Dispatch each hap
    for (const hap of haps) {
      const duration = hap.whole
        ? hap.whole.end - hap.whole.begin
        : hap.part.end - hap.part.begin;

      this._dispatchHapEvent(hap, 0, duration);
    }
  }

  // ============================================
  // PUBLIC API - PLAYBACK STATE
  // ============================================

  /**
   * Set playback state
   */
  setPlaying(isPlaying: boolean): void {
    if (this._isPlaying === isPlaying) return;

    this._isPlaying = isPlaying;

    if (isPlaying) {
      this._startAudioAnalysis();
    } else {
      this._stopAudioAnalysis();
    }

    this._dispatchPlaybackEvent(isPlaying);
  }

  /**
   * Get current playback state
   */
  get isPlaying(): boolean {
    return this._isPlaying;
  }

  /**
   * Get current cycle position
   */
  get currentCycle(): number {
    return this._currentCycle;
  }

  // ============================================
  // PUBLIC API - AUDIO CONNECTION
  // ============================================

  /**
   * Connect to Web Audio for frequency analysis
   *
   * @param audioContext - The audio context
   * @param sourceNode - Node to analyze (usually destination or a gain node before it)
   */
  connectAudio(
    audioContext: AudioContext,
    sourceNode: AudioNode
  ): void {
    this._audioContext = audioContext;

    // Create analyser
    this._analyser = audioContext.createAnalyser();
    this._analyser.fftSize = this._config.fftSize;
    this._analyser.smoothingTimeConstant = this._config.smoothingTimeConstant;

    // Connect source → analyser (doesn't affect audio output)
    sourceNode.connect(this._analyser);

    // Create typed arrays for FFT data
    const bufferLength = this._analyser.frequencyBinCount;
    this._frequencyData = new Uint8Array(bufferLength);
    this._timeDomainData = new Uint8Array(bufferLength);

    // Start analysis if already playing
    if (this._isPlaying) {
      this._startAudioAnalysis();
    }
  }

  /**
   * Disconnect audio analysis
   */
  disconnectAudio(): void {
    this._stopAudioAnalysis();

    if (this._analyser) {
      this._analyser.disconnect();
      this._analyser = null;
    }

    this._audioContext = null;
    this._frequencyData = null;
    this._timeDomainData = null;
  }

  /**
   * Get current audio analysis (cached)
   */
  getAudioAnalysis(): { analysis: AudioAnalysis; bands: FrequencyBands } | null {
    if (!this._lastAnalysis || !this._lastBands) return null;

    return {
      analysis: this._lastAnalysis,
      bands: this._lastBands,
    };
  }

  // ============================================
  // PUBLIC API - CLEANUP
  // ============================================

  /**
   * Clean up all resources
   */
  dispose(): void {
    this.disconnectAudio();
    this._isPlaying = false;
    this._currentCycle = 0;
  }

  // ============================================
  // PRIVATE - AUDIO ANALYSIS
  // ============================================

  private _startAudioAnalysis(): void {
    if (this._analysisInterval !== null) return;
    if (!this._analyser || !this._frequencyData || !this._timeDomainData) return;

    this._analysisInterval = window.setInterval(() => {
      this._performAnalysis();
    }, this._config.analysisInterval);

    // Perform initial analysis
    this._performAnalysis();
  }

  private _stopAudioAnalysis(): void {
    if (this._analysisInterval !== null) {
      clearInterval(this._analysisInterval);
      this._analysisInterval = null;
    }
  }

  private _performAnalysis(): void {
    if (!this._analyser || !this._frequencyData || !this._timeDomainData) return;

    // Get frequency and time domain data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this._analyser as any).getByteFrequencyData(this._frequencyData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this._analyser as any).getByteTimeDomainData(this._timeDomainData);

    // Create analysis object
    this._lastAnalysis = {
      frequencyData: new Uint8Array(this._frequencyData),
      timeDomainData: new Uint8Array(this._timeDomainData),
      fftSize: this._analyser.fftSize,
      timestamp: performance.now(),
    };

    // Compute frequency bands
    this._lastBands = this._computeFrequencyBands(this._frequencyData);

    // Dispatch audio event
    this._dispatchAudioEvent(this._lastAnalysis, this._lastBands);
  }

  /**
   * Compute simplified frequency bands from FFT data
   */
  private _computeFrequencyBands(frequencyData: Uint8Array): FrequencyBands {
    const binCount = frequencyData.length;
    const sampleRate = this._audioContext?.sampleRate ?? 44100;
    const binWidth = sampleRate / 2 / binCount;

    // Helper to get average in frequency range
    const getRange = (lowHz: number, highHz: number): number => {
      const lowBin = Math.floor(lowHz / binWidth);
      const highBin = Math.min(Math.ceil(highHz / binWidth), binCount - 1);

      if (lowBin >= highBin) return 0;

      let sum = 0;
      for (let i = lowBin; i <= highBin; i++) {
        sum += frequencyData[i];
      }

      return (sum / (highBin - lowBin + 1)) / 255;
    };

    // Compute bands
    const sub = getRange(20, 60);
    const bass = getRange(60, 250);
    const lowMid = getRange(250, 500);
    const mid = getRange(500, 2000);
    const highMid = getRange(2000, 4000);
    const treble = getRange(4000, 20000);

    // Overall average
    let total = 0;
    for (let i = 0; i < binCount; i++) {
      total += frequencyData[i];
    }
    const average = (total / binCount) / 255;

    return { sub, bass, lowMid, mid, highMid, treble, average };
  }

  // ============================================
  // PRIVATE - EVENT DISPATCH
  // ============================================

  private _dispatchHapEvent(hap: Hap, deadline: number, duration: number): void {
    const event = new CustomEvent(STRUDEL_EVENTS.HAP, {
      detail: {
        hap,
        deadline,
        duration,
        cyclePosition: this._currentCycle,
      },
      bubbles: false,
    });

    if (this._config.useWindowEvents) {
      window.dispatchEvent(event);
    }
  }

  private _dispatchPlaybackEvent(isPlaying: boolean): void {
    const event = new CustomEvent(STRUDEL_EVENTS.PLAYBACK, {
      detail: {
        isPlaying,
        cyclePosition: this._currentCycle,
      },
      bubbles: false,
    });

    if (this._config.useWindowEvents) {
      window.dispatchEvent(event);
    }
  }

  private _dispatchAudioEvent(
    analysis: AudioAnalysis,
    bands: FrequencyBands
  ): void {
    const event = new CustomEvent(STRUDEL_EVENTS.AUDIO, {
      detail: { analysis, bands },
      bubbles: false,
    });

    if (this._config.useWindowEvents) {
      window.dispatchEvent(event);
    }
  }
}

/**
 * Create a pre-configured bridge instance
 */
export function createStrudelBridge(
  config?: StrudelBridgeConfig
): StrudelBridge {
  return new StrudelBridge(config);
}
