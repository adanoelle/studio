import { html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { GlitchBase } from '../glitch/glitch-base.js';
import Hydra from 'hydra-synth';
import {
  type FrequencyBands,
  type StrudelHapEvent,
  type StrudelPlaybackEvent,
  type StrudelAudioEvent,
  STRUDEL_EVENTS,
} from './types.js';

/**
 * HYDRA-CANVAS COMPONENT
 *
 * THEORETICAL GROUNDING:
 * Hydra embodies the glitch feminist aesthetic through its live coding paradigm -
 * visuals that are never fixed, always in flux, created through algorithmic
 * composition. The feedback loops and transformations represent the multiplicity
 * of identity and the refusal of static representation.
 *
 * VISUAL METAPHOR:
 * - Oscillators = rhythmic pulse of life
 * - Feedback = memory and echo of past states
 * - Modulation = influence and interconnection
 * - Kaleidoscope = multiplicity and fragmentation
 */
@customElement('hydra-canvas')
export class HydraCanvas extends GlitchBase {
  // ============================================
  // PUBLIC API
  // ============================================

  /** Hydra patch preset to use */
  @property({ type: String })
  preset: HydraPreset = 'reactive';

  /** Whether to listen for global Strudel events */
  @property({ type: Boolean, attribute: 'auto-connect' })
  autoConnect = true;

  /** Global intensity multiplier */
  @property({ type: Number })
  intensity = 1.0;

  // ============================================
  // INTERNAL STATE
  // ============================================

  @state()
  private _isPlaying = false;

  @query('canvas')
  private _canvas!: HTMLCanvasElement;

  private _hydra: Hydra | null = null;
  private _width = 0;
  private _height = 0;

  /** Audio-reactive values exposed to Hydra */
  private _audio = {
    bass: 0,
    mid: 0,
    treble: 0,
    average: 0,
  };

  /** Pattern event tracking */
  private _events = {
    lastNote: 60,
    lastGain: 0.5,
    lastPan: 0,
    beatPulse: 0,
    eventCount: 0,
  };

  /** Time tracking */
  private _time = 0;

  /** Resize observer */
  private _resizeObserver?: ResizeObserver;

  /** Animation frame for audio updates */
  private _updateRafId?: number;

  /** Bound event handlers */
  private _boundHandlers = {
    hap: this._handleHapEvent.bind(this),
    playback: this._handlePlaybackEvent.bind(this),
    audio: this._handleAudioEvent.bind(this),
    resize: this._handleResize.bind(this),
  };

  // ============================================
  // LIFECYCLE
  // ============================================

  connectedCallback() {
    super.connectedCallback();
    this._setupResizeObserver();

    if (this.autoConnect) {
      this._connectToStrudelEvents();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._disconnectFromStrudelEvents();
    this._resizeObserver?.disconnect();

    if (this._updateRafId) {
      cancelAnimationFrame(this._updateRafId);
    }
  }

  firstUpdated() {
    this._initHydra();
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('autoConnect')) {
      if (this.autoConnect) {
        this._connectToStrudelEvents();
      } else {
        this._disconnectFromStrudelEvents();
      }
    }

    if (changedProperties.has('preset') && this._hydra) {
      this._applyPreset(this.preset);
    }
  }

  // ============================================
  // HYDRA SETUP
  // ============================================

  private _initHydra(): void {
    if (!this._canvas) return;

    const rect = this.getBoundingClientRect();
    this._width = rect.width || window.innerWidth;
    this._height = rect.height || window.innerHeight;

    // Set canvas size
    this._canvas.width = this._width;
    this._canvas.height = this._height;

    // Initialize Hydra
    this._hydra = new Hydra({
      canvas: this._canvas,
      detectAudio: false, // We provide our own audio data
      enableStreamCapture: false,
      width: this._width,
      height: this._height,
      autoLoop: true,
    });

    // Expose audio-reactive functions to Hydra's global scope
    this._setupHydraGlobals();

    // Apply initial preset
    this._applyPreset(this.preset);

    // Start the audio update loop
    this._startAudioUpdateLoop();
  }

  private _setupHydraGlobals(): void {
    // Make audio values available as functions Hydra can call
    // These functions return current audio values for use in Hydra patches
    window.bass = () => this._audio.bass * this.intensity;
    window.mid = () => this._audio.mid * this.intensity;
    window.treble = () => this._audio.treble * this.intensity;
    window.average = () => this._audio.average * this.intensity;

    // Pattern event values
    window.note = () => (this._events.lastNote - 40) / 60; // Normalize to ~0-1
    window.gain = () => this._events.lastGain;
    window.pan = () => this._events.lastPan;
    window.beat = () => this._events.beatPulse;
    window.events = () => this._events.eventCount;

    // Time value
    window.t = () => this._time;
  }

  private _startAudioUpdateLoop(): void {
    const update = () => {
      // Decay beat pulse
      this._events.beatPulse *= 0.9;

      // Update time
      this._time += 1 / 60;

      this._updateRafId = requestAnimationFrame(update);
    };
    update();
  }

  // ============================================
  // HYDRA PRESETS
  // ============================================

  private _applyPreset(preset: HydraPreset): void {
    if (!this._hydra) return;

    const code = HYDRA_PRESETS[preset];
    if (code) {
      try {
        // Hydra evaluates code in its global context
        eval(code);
      } catch (e) {
        console.error('Hydra preset error:', e);
      }
    }
  }

  /** Evaluate custom Hydra code */
  evalCode(code: string): void {
    if (!this._hydra) return;
    try {
      eval(code);
    } catch (e) {
      console.error('Hydra eval error:', e);
    }
  }

  // ============================================
  // EVENT HANDLING
  // ============================================

  private _setupResizeObserver(): void {
    this._resizeObserver = new ResizeObserver(this._boundHandlers.resize);
    this._resizeObserver.observe(this);
  }

  private _handleResize(): void {
    if (!this._canvas || !this._hydra) return;

    const rect = this.getBoundingClientRect();
    this._width = rect.width;
    this._height = rect.height;

    this._canvas.width = this._width;
    this._canvas.height = this._height;

    // Hydra handles resize internally with setResolution
    this._hydra.setResolution(this._width, this._height);
  }

  private _connectToStrudelEvents(): void {
    window.addEventListener(STRUDEL_EVENTS.HAP, this._boundHandlers.hap as EventListener);
    window.addEventListener(STRUDEL_EVENTS.PLAYBACK, this._boundHandlers.playback as EventListener);
    window.addEventListener(STRUDEL_EVENTS.AUDIO, this._boundHandlers.audio as EventListener);
  }

  private _disconnectFromStrudelEvents(): void {
    window.removeEventListener(STRUDEL_EVENTS.HAP, this._boundHandlers.hap as EventListener);
    window.removeEventListener(STRUDEL_EVENTS.PLAYBACK, this._boundHandlers.playback as EventListener);
    window.removeEventListener(STRUDEL_EVENTS.AUDIO, this._boundHandlers.audio as EventListener);
  }

  private _handleHapEvent(event: StrudelHapEvent): void {
    const { hap } = event.detail;

    // Update event tracking
    this._events.lastNote = (hap.value.note as number) ?? 60;
    this._events.lastGain = (hap.value.gain as number) ?? 0.5;
    this._events.lastPan = (hap.value.pan as number) ?? 0;
    this._events.beatPulse = 1; // Will decay
    this._events.eventCount++;
  }

  private _handlePlaybackEvent(event: StrudelPlaybackEvent): void {
    this._isPlaying = event.detail.isPlaying;

    if (!this._isPlaying) {
      // Reset values when stopped
      this._events.beatPulse = 0;
      this._events.eventCount = 0;
    }
  }

  private _handleAudioEvent(event: StrudelAudioEvent): void {
    const bands: FrequencyBands = event.detail.bands;

    // Smooth the values a bit
    const smoothing = 0.3;
    this._audio.bass = this._audio.bass * (1 - smoothing) + bands.bass * smoothing;
    this._audio.mid = this._audio.mid * (1 - smoothing) + bands.mid * smoothing;
    this._audio.treble = this._audio.treble * (1 - smoothing) + bands.treble * smoothing;
    this._audio.average = this._audio.average * (1 - smoothing) + bands.average * smoothing;
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /** Get current audio values */
  getAudioValues() {
    return { ...this._audio };
  }

  /** Get current event values */
  getEventValues() {
    return { ...this._events };
  }

  /** Check if playing */
  get isPlaying() {
    return this._isPlaying;
  }

  // ============================================
  // STYLES
  // ============================================

  static styles = css`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      z-index: var(--z-base, 0);
      pointer-events: none;
      overflow: hidden;
      background: #000;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  // ============================================
  // RENDER
  // ============================================

  render() {
    return html`
      <canvas
        aria-hidden="true"
        role="presentation"
      ></canvas>
    `;
  }
}

// ============================================
// TYPES & PRESETS
// ============================================

type HydraPreset = 'reactive' | 'feedback' | 'geometric' | 'noise' | 'minimal' | 'psychedelic';

/**
 * Hydra presets - each is a string of Hydra code
 *
 * Available audio-reactive functions:
 * - bass(), mid(), treble(), average() - frequency bands (0-1)
 * - note() - last MIDI note normalized (0-1)
 * - gain() - last event gain (0-1)
 * - beat() - pulse on each event, decays
 * - t() - time in seconds
 */
const HYDRA_PRESETS: Record<HydraPreset, string> = {
  // Main reactive preset - responds to all audio bands
  reactive: `
    // Oscillator frequencies driven by audio
    osc(10, 0.1, () => bass() * 2)
      .color(1.2, 0.4, 0.8)
      .saturate(() => 1 + mid())
      .rotate(() => t() * 0.1 + beat() * 0.5)
      .kaleid(() => 3 + Math.floor(treble() * 6))
      .modulate(
        noise(3, () => bass() * 0.5),
        () => mid() * 0.3
      )
      .blend(
        osc(20, 0.05, () => treble())
          .color(0.5, 1.2, 0.8)
          .rotate(() => -t() * 0.05)
          .pixelate(
            () => 20 + (1 - bass()) * 100,
            () => 20 + (1 - bass()) * 100
          ),
        () => beat() * 0.3
      )
      .modulate(
        voronoi(() => 5 + treble() * 10, 0.3),
        () => bass() * 0.1
      )
      .brightness(() => -0.2 + beat() * 0.3)
      .contrast(1.3)
      .out()
  `,

  // Feedback loop preset - creates trails and echoes
  feedback: `
    // Source texture
    src(o0)
      .scale(1.01)
      .rotate(() => 0.002 + bass() * 0.01)
      .blend(
        osc(8, 0.1, () => mid())
          .color(1, 0.5, 0.8)
          .rotate(() => t() * 0.1)
          .kaleid(() => 4 + Math.floor(treble() * 4)),
        () => 0.1 + beat() * 0.3
      )
      .modulate(
        noise(2, () => bass() * 0.3),
        () => mid() * 0.05
      )
      .saturate(() => 1.2 + treble() * 0.5)
      .brightness(() => -0.05 + beat() * 0.1)
      .out()
  `,

  // Geometric shapes preset
  geometric: `
    shape(
      () => 3 + Math.floor(bass() * 5),
      () => 0.3 + mid() * 0.3,
      () => 0.01 + treble() * 0.1
    )
      .color(1, 0.5, 0.8)
      .rotate(() => t() * 0.2 + beat() * 0.5)
      .repeat(
        () => 2 + Math.floor(bass() * 4),
        () => 2 + Math.floor(mid() * 4)
      )
      .modulate(
        shape(
          () => 6 - Math.floor(treble() * 3),
          0.4,
          0.01
        )
          .rotate(() => -t() * 0.1)
          .scale(() => 0.5 + bass() * 0.5),
        () => 0.1 + mid() * 0.2
      )
      .kaleid(() => 4 + Math.floor(treble() * 6))
      .blend(
        gradient()
          .color(0.8, 0.4, 1)
          .rotate(() => t() * 0.05),
        0.3
      )
      .brightness(() => beat() * 0.2)
      .out()
  `,

  // Noise-based organic preset
  noise: `
    noise(
      () => 3 + bass() * 10,
      () => 0.1 + mid() * 0.3
    )
      .color(0.8, 0.5, 1)
      .saturate(() => 1.5 + treble())
      .modulate(
        voronoi(
          () => 5 + mid() * 20,
          () => 0.1 + bass() * 0.3
        ),
        () => 0.1 + treble() * 0.2
      )
      .rotate(() => t() * 0.05 + beat() * 0.3)
      .blend(
        noise(5, 0.2)
          .thresh(() => 0.3 + bass() * 0.4)
          .color(1, 0.3, 0.5),
        () => beat() * 0.4
      )
      .kaleid(() => 2 + Math.floor(treble() * 4))
      .contrast(1.2)
      .out()
  `,

  // Minimal subtle preset
  minimal: `
    gradient()
      .color(
        () => 0.5 + bass() * 0.3,
        () => 0.3 + mid() * 0.2,
        () => 0.5 + treble() * 0.3
      )
      .rotate(() => t() * 0.02)
      .modulate(
        noise(1, () => 0.05 + bass() * 0.1),
        () => 0.02 + mid() * 0.05
      )
      .brightness(() => -0.1 + beat() * 0.1)
      .out()
  `,

  // Full psychedelic preset
  psychedelic: `
    osc(15, 0.05, () => bass() * 3)
      .color(1, 0.5, 0.8)
      .mult(
        osc(10, -0.1, () => mid() * 2)
          .color(0.5, 1, 0.8)
          .rotate(() => t() * 0.1)
      )
      .modulate(
        osc(5, 0, () => treble())
          .rotate(() => -t() * 0.05),
        () => 0.2 + bass() * 0.3
      )
      .rotate(() => t() * 0.05 + beat() * 0.5)
      .kaleid(() => 4 + Math.floor(average() * 8))
      .modulate(
        voronoi(() => 10 + bass() * 20, 0.5),
        () => treble() * 0.15
      )
      .add(
        shape(4, 0.1, 0.01)
          .color(1, 0, 0.5)
          .rotate(() => t() * -0.2)
          .scale(() => 0.5 + beat()),
        () => beat() * 0.5
      )
      .saturate(1.5)
      .contrast(1.4)
      .brightness(() => -0.1 + beat() * 0.2)
      .out()
  `,
};

// ============================================
// GLOBAL TYPE DECLARATION
// ============================================

declare global {
  interface Window {
    // Audio-reactive functions for Hydra patches
    bass: () => number;
    mid: () => number;
    treble: () => number;
    average: () => number;
    note: () => number;
    gain: () => number;
    pan: () => number;
    beat: () => number;
    events: () => number;
    t: () => number;
  }

  interface HTMLElementTagNameMap {
    'hydra-canvas': HydraCanvas;
  }
}
