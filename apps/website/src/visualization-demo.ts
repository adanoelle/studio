/**
 * Visualization Demo
 *
 * This demo simulates Strudel pattern events to showcase the
 * visualization layer without requiring the full Strudel setup.
 * Includes a simple Web Audio synthesizer for audio feedback.
 */

// Import design system components
import '@studio/design-system';

import {
  type Hap,
  type FrequencyBands,
  STRUDEL_EVENTS,
  HydraCanvas,
} from '@studio/design-system';

// ============================================
// SIMPLE SYNTH (Web Audio)
// ============================================

class SimpleSynth {
  private _ctx: AudioContext | null = null;
  private _masterGain: GainNode | null = null;
  private _compressor: DynamicsCompressorNode | null = null;

  /**
   * Initialize audio context (must be called from user gesture)
   */
  init(): AudioContext {
    if (this._ctx) return this._ctx;

    this._ctx = new AudioContext();

    // Master gain
    this._masterGain = this._ctx.createGain();
    this._masterGain.gain.value = 0.3;

    // Compressor to prevent clipping
    this._compressor = this._ctx.createDynamicsCompressor();
    this._compressor.threshold.value = -24;
    this._compressor.knee.value = 30;
    this._compressor.ratio.value = 12;
    this._compressor.attack.value = 0.003;
    this._compressor.release.value = 0.25;

    // Connect: master gain -> compressor -> output
    this._masterGain.connect(this._compressor);
    this._compressor.connect(this._ctx.destination);

    return this._ctx;
  }

  /**
   * Play a note
   */
  playNote(
    note: number,
    gain: number,
    duration: number,
    pan: number = 0
  ): void {
    if (!this._ctx || !this._masterGain) return;

    const now = this._ctx.currentTime;
    const freq = this._midiToFreq(note);

    // Create oscillator
    const osc = this._ctx.createOscillator();
    osc.type = note < 50 ? 'triangle' : 'sine'; // Triangle for bass, sine for higher
    osc.frequency.value = freq;

    // Create gain envelope
    const gainNode = this._ctx.createGain();
    gainNode.gain.value = 0;

    // Attack
    gainNode.gain.linearRampToValueAtTime(gain * 0.5, now + 0.01);
    // Decay to sustain
    gainNode.gain.linearRampToValueAtTime(gain * 0.3, now + 0.05);
    // Release
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    // Panner
    const panner = this._ctx.createStereoPanner();
    panner.pan.value = pan;

    // Connect: osc -> gain -> panner -> master
    osc.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(this._masterGain);

    // Play
    osc.start(now);
    osc.stop(now + duration + 0.1);

    // Cleanup
    osc.onended = () => {
      osc.disconnect();
      gainNode.disconnect();
      panner.disconnect();
    };
  }

  /**
   * Convert MIDI note number to frequency
   */
  private _midiToFreq(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number): void {
    if (this._masterGain) {
      this._masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Resume audio context if suspended
   */
  resume(): void {
    if (this._ctx?.state === 'suspended') {
      this._ctx.resume();
    }
  }

  /**
   * Suspend audio context
   */
  suspend(): void {
    if (this._ctx?.state === 'running') {
      this._ctx.suspend();
    }
  }
}

// Global synth instance
const synth = new SimpleSynth();

// ============================================
// PATTERN DEFINITIONS
// ============================================

interface PatternDef {
  name: string;
  bpm: number;
  events: Array<{
    time: number; // 0-1 within cycle
    note: number;
    gain: number;
    pan?: number;
    duration?: number;
  }>;
}

const PATTERNS: Record<string, PatternDef> = {
  minimal: {
    name: 'Minimal',
    bpm: 120,
    events: [
      { time: 0, note: 36, gain: 0.8 },
      { time: 0.5, note: 36, gain: 0.6 },
    ],
  },
  rhythmic: {
    name: 'Rhythmic',
    bpm: 140,
    events: [
      { time: 0, note: 36, gain: 0.9 },
      { time: 0.25, note: 42, gain: 0.5, pan: -0.5 },
      { time: 0.5, note: 38, gain: 0.7 },
      { time: 0.625, note: 42, gain: 0.4, pan: 0.5 },
      { time: 0.75, note: 42, gain: 0.5, pan: 0 },
      { time: 0.875, note: 46, gain: 0.3, pan: 0.3 },
    ],
  },
  melodic: {
    name: 'Melodic',
    bpm: 100,
    events: [
      { time: 0, note: 60, gain: 0.6, duration: 0.2 },
      { time: 0.25, note: 64, gain: 0.5, duration: 0.15, pan: -0.3 },
      { time: 0.5, note: 67, gain: 0.55, duration: 0.2, pan: 0.3 },
      { time: 0.75, note: 72, gain: 0.45, duration: 0.15, pan: 0 },
    ],
  },
  ambient: {
    name: 'Ambient',
    bpm: 60,
    events: [
      { time: 0, note: 48, gain: 0.3, duration: 0.8, pan: -0.5 },
      { time: 0.33, note: 55, gain: 0.25, duration: 0.6, pan: 0.5 },
      { time: 0.66, note: 60, gain: 0.2, duration: 0.5, pan: 0 },
    ],
  },
};

// ============================================
// MOCK AUDIO ANALYSIS
// ============================================

class MockAudioAnalyzer {
  private _pattern: PatternDef;

  constructor(pattern: PatternDef) {
    this._pattern = pattern;
  }

  setPattern(pattern: PatternDef) {
    this._pattern = pattern;
  }

  /**
   * Generate mock frequency bands based on recent events
   */
  generateBands(cyclePosition: number): FrequencyBands {
    // Find nearby events
    const nearbyEvents = this._pattern.events.filter((e) => {
      const dist = Math.abs(e.time - cyclePosition);
      return dist < 0.15 || dist > 0.85; // Within 15% of cycle
    });

    // Calculate band levels based on events
    let bass = 0.1;
    let mid = 0.1;
    let treble = 0.1;

    for (const event of nearbyEvents) {
      const proximity =
        1 - Math.min(Math.abs(event.time - cyclePosition), 0.15) / 0.15;
      const contribution = event.gain * proximity * 0.5;

      if (event.note < 50) {
        bass += contribution;
      } else if (event.note < 70) {
        mid += contribution;
      } else {
        treble += contribution;
      }
    }

    // Add some noise for liveliness
    bass += Math.random() * 0.1;
    mid += Math.random() * 0.1;
    treble += Math.random() * 0.1;

    // Clamp values
    bass = Math.min(1, bass);
    mid = Math.min(1, mid);
    treble = Math.min(1, treble);

    return {
      sub: bass * 0.8,
      bass,
      lowMid: (bass + mid) / 2,
      mid,
      highMid: (mid + treble) / 2,
      treble,
      average: (bass + mid + treble) / 3,
    };
  }
}

// ============================================
// PATTERN SCHEDULER
// ============================================

class MockScheduler {
  private _isPlaying = false;
  private _pattern: PatternDef;
  private _analyzer: MockAudioAnalyzer;
  private _cycleStart = 0;
  private _intervalId: number | null = null;
  private _audioIntervalId: number | null = null;
  private _lastEventIndex = -1;
  private _eventCount = 0;

  constructor() {
    this._pattern = PATTERNS.minimal;
    this._analyzer = new MockAudioAnalyzer(this._pattern);
  }

  get isPlaying() {
    return this._isPlaying;
  }

  get eventCount() {
    return this._eventCount;
  }

  setPattern(name: string) {
    const pattern = PATTERNS[name];
    if (pattern) {
      this._pattern = pattern;
      this._analyzer.setPattern(pattern);
      this._lastEventIndex = -1;
    }
  }

  play() {
    if (this._isPlaying) return;

    this._isPlaying = true;
    this._cycleStart = performance.now();
    this._lastEventIndex = -1;
    this._eventCount = 0;

    // Dispatch playback event
    window.dispatchEvent(
      new CustomEvent(STRUDEL_EVENTS.PLAYBACK, {
        detail: { isPlaying: true, cyclePosition: 0 },
      })
    );

    // Start scheduler loop (50ms like real Strudel)
    this._intervalId = window.setInterval(() => {
      this._tick();
    }, 50);

    // Start audio analysis loop
    this._audioIntervalId = window.setInterval(() => {
      this._sendAudioAnalysis();
    }, 50);
  }

  stop() {
    if (!this._isPlaying) return;

    this._isPlaying = false;

    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }

    if (this._audioIntervalId) {
      clearInterval(this._audioIntervalId);
      this._audioIntervalId = null;
    }

    // Dispatch playback event
    window.dispatchEvent(
      new CustomEvent(STRUDEL_EVENTS.PLAYBACK, {
        detail: { isPlaying: false, cyclePosition: 0 },
      })
    );
  }

  private _tick() {
    const now = performance.now();
    const cycleDuration = (60 / this._pattern.bpm) * 4 * 1000; // 4 beats per cycle
    const elapsed = now - this._cycleStart;
    const cyclePosition = (elapsed % cycleDuration) / cycleDuration;

    // Check for events that should fire
    for (let i = 0; i < this._pattern.events.length; i++) {
      const event = this._pattern.events[i];

      // Did we cross this event's time?
      const lastPosition =
        ((elapsed - 50) % cycleDuration) / cycleDuration;

      if (
        (lastPosition < event.time && cyclePosition >= event.time) ||
        (lastPosition > 0.9 && cyclePosition < 0.1 && event.time < 0.1)
      ) {
        this._fireHap(event, cyclePosition);
      }
    }

    // Reset cycle tracking
    if (cyclePosition < 0.1 && this._lastEventIndex === this._pattern.events.length - 1) {
      this._lastEventIndex = -1;
    }
  }

  private _fireHap(
    event: PatternDef['events'][0],
    cyclePosition: number
  ) {
    this._eventCount++;

    const duration = event.duration ?? 0.1;
    const cycleDuration = (60 / this._pattern.bpm) * 4; // in seconds
    const noteDuration = duration * cycleDuration;

    // Play the note!
    synth.playNote(
      event.note,
      event.gain,
      noteDuration,
      event.pan ?? 0
    );

    const hap: Hap = {
      part: { begin: cyclePosition, end: cyclePosition + duration },
      whole: { begin: cyclePosition, end: cyclePosition + duration },
      value: {
        note: event.note,
        gain: event.gain,
        pan: event.pan ?? 0,
        s: 'synth',
      },
      hasOnset: true,
    };

    window.dispatchEvent(
      new CustomEvent(STRUDEL_EVENTS.HAP, {
        detail: {
          hap,
          deadline: 0,
          duration: noteDuration,
          cyclePosition,
        },
      })
    );
  }

  private _sendAudioAnalysis() {
    const now = performance.now();
    const cycleDuration = (60 / this._pattern.bpm) * 4 * 1000;
    const elapsed = now - this._cycleStart;
    const cyclePosition = (elapsed % cycleDuration) / cycleDuration;

    const bands = this._analyzer.generateBands(cyclePosition);

    // Create mock frequency data
    const frequencyData = new Uint8Array(128);
    for (let i = 0; i < 128; i++) {
      const normalized = i / 128;
      let value: number;

      if (normalized < 0.1) {
        value = bands.sub * 255;
      } else if (normalized < 0.3) {
        value = bands.bass * 255;
      } else if (normalized < 0.5) {
        value = bands.mid * 255;
      } else {
        value = bands.treble * 255;
      }

      frequencyData[i] = Math.floor(value * (0.7 + Math.random() * 0.3));
    }

    window.dispatchEvent(
      new CustomEvent(STRUDEL_EVENTS.AUDIO, {
        detail: {
          analysis: {
            frequencyData,
            timeDomainData: new Uint8Array(128),
            fftSize: 256,
            timestamp: performance.now(),
          },
          bands,
        },
      })
    );
  }
}

// ============================================
// UI SETUP
// ============================================

const scheduler = new MockScheduler();

// Elements
const playBtn = document.getElementById('play-btn') as HTMLButtonElement;
const stopBtn = document.getElementById('stop-btn') as HTMLButtonElement;
const controlsPanel = document.getElementById('controls') as HTMLElement;
const statsSection = document.getElementById('stats-section') as HTMLElement;
const infoSection = document.getElementById('info-section') as HTMLElement;
const patternBtns = document.querySelectorAll('.pattern-btn');

// Stats elements
const statEvents = document.getElementById('stat-events') as HTMLElement;
const statParticles = document.getElementById('stat-particles') as HTMLElement;
const statBass = document.getElementById('stat-bass') as HTMLElement;
const statMid = document.getElementById('stat-mid') as HTMLElement;
const statTreble = document.getElementById('stat-treble') as HTMLElement;

// Get Hydra canvas
const hydraCanvas = document.getElementById('vis') as HydraCanvas;

// Play/Stop handlers
playBtn.addEventListener('click', () => {
  // Initialize audio context (must be from user gesture)
  synth.init();
  synth.resume();

  scheduler.play();
  playBtn.disabled = true;
  stopBtn.disabled = false;
  controlsPanel.classList.add('playing');
  statsSection.classList.add('playing');
  infoSection.classList.add('playing');
});

stopBtn.addEventListener('click', () => {
  scheduler.stop();
  synth.suspend();

  playBtn.disabled = false;
  stopBtn.disabled = true;
  controlsPanel.classList.remove('playing');
  statsSection.classList.remove('playing');
  infoSection.classList.remove('playing');
});

// Pattern selector
patternBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const pattern = (btn as HTMLElement).dataset.pattern;
    if (pattern) {
      scheduler.setPattern(pattern);

      // Update active state
      patternBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    }
  });
});

// Volume control
const volumeSlider = document.getElementById('volume') as HTMLInputElement;
volumeSlider.addEventListener('input', () => {
  const volume = parseInt(volumeSlider.value, 10) / 100;
  synth.setVolume(volume);
});

// Hydra preset selector
const hydraBtns = document.querySelectorAll('.hydra-btn');
hydraBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const preset = (btn as HTMLElement).dataset.preset;
    if (preset && hydraCanvas) {
      hydraCanvas.setAttribute('preset', preset);

      // Update active state
      hydraBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    }
  });
});

// Stats update loop
let lastBands: FrequencyBands | null = null;

window.addEventListener(STRUDEL_EVENTS.AUDIO, ((event: CustomEvent) => {
  lastBands = event.detail.bands;
}) as EventListener);

setInterval(() => {
  statEvents.textContent = scheduler.eventCount.toString();

  // Get event values from Hydra canvas
  const eventValues = hydraCanvas?.getEventValues?.();
  if (eventValues) {
    statParticles.textContent = eventValues.eventCount.toString();
  }

  if (lastBands) {
    statBass.textContent = `${Math.round(lastBands.bass * 100)}%`;
    statMid.textContent = `${Math.round(lastBands.mid * 100)}%`;
    statTreble.textContent = `${Math.round(lastBands.treble * 100)}%`;
  }
}, 100);

// Log startup
console.log('Visualization demo loaded');
console.log('Available patterns:', Object.keys(PATTERNS).join(', '));
