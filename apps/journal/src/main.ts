/**
 * Journal Entry Demo
 *
 * A sample music journal entry page with Strudel pattern,
 * essay content, reflections, and Hydra visuals.
 */

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

  init(): AudioContext {
    if (this._ctx) return this._ctx;

    this._ctx = new AudioContext();

    this._masterGain = this._ctx.createGain();
    this._masterGain.gain.value = 0.3;

    this._compressor = this._ctx.createDynamicsCompressor();
    this._compressor.threshold.value = -24;
    this._compressor.knee.value = 30;
    this._compressor.ratio.value = 12;
    this._compressor.attack.value = 0.003;
    this._compressor.release.value = 0.25;

    this._masterGain.connect(this._compressor);
    this._compressor.connect(this._ctx.destination);

    return this._ctx;
  }

  playNote(note: number, gain: number, duration: number, pan: number = 0): void {
    if (!this._ctx || !this._masterGain) return;

    const now = this._ctx.currentTime;
    const freq = this._midiToFreq(note);

    const osc = this._ctx.createOscillator();
    osc.type = note < 50 ? 'triangle' : 'sine';
    osc.frequency.value = freq;

    const gainNode = this._ctx.createGain();
    gainNode.gain.value = 0;
    gainNode.gain.linearRampToValueAtTime(gain * 0.5, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(gain * 0.3, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    const panner = this._ctx.createStereoPanner();
    panner.pan.value = pan;

    osc.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(this._masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);

    osc.onended = () => {
      osc.disconnect();
      gainNode.disconnect();
      panner.disconnect();
    };
  }

  // Play a drum sound
  playDrum(type: 'kick' | 'snare' | 'hat', gain: number): void {
    if (!this._ctx || !this._masterGain) return;

    const now = this._ctx.currentTime;

    if (type === 'kick') {
      // Kick drum: sine with pitch envelope
      const osc = this._ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

      const gainNode = this._ctx.createGain();
      gainNode.gain.setValueAtTime(gain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gainNode);
      gainNode.connect(this._masterGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'snare') {
      // Snare: noise burst + tone
      const bufferSize = this._ctx.sampleRate * 0.15;
      const buffer = this._ctx.createBuffer(1, bufferSize, this._ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this._ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this._ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1500;

      const noiseGain = this._ctx.createGain();
      noiseGain.gain.setValueAtTime(gain * 0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this._masterGain);

      // Tone component
      const osc = this._ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = 200;

      const toneGain = this._ctx.createGain();
      toneGain.gain.setValueAtTime(gain * 0.3, now);
      toneGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(toneGain);
      toneGain.connect(this._masterGain);

      noise.start(now);
      osc.start(now);
      osc.stop(now + 0.15);
    } else {
      // Hi-hat: filtered noise
      const bufferSize = this._ctx.sampleRate * 0.05;
      const buffer = this._ctx.createBuffer(1, bufferSize, this._ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this._ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this._ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 8000;

      const gainNode = this._ctx.createGain();
      gainNode.gain.setValueAtTime(gain * 0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this._masterGain);

      noise.start(now);
      noise.stop(now + 0.05);
    }
  }

  private _midiToFreq(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  setVolume(volume: number): void {
    if (this._masterGain) {
      this._masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  resume(): void {
    if (this._ctx?.state === 'suspended') {
      this._ctx.resume();
    }
  }

  suspend(): void {
    if (this._ctx?.state === 'running') {
      this._ctx.suspend();
    }
  }
}

const synth = new SimpleSynth();

// ============================================
// PATTERN FROM THE JOURNAL ENTRY
// A minor blues with shuffle feel
// ============================================

interface PatternEvent {
  time: number;
  type: 'kick' | 'snare' | 'hat' | 'note';
  note?: number;
  gain: number;
  pan?: number;
  duration?: number;
}

// A minor blues - 8 bar pattern
// Bars 1-4: Am | Bars 5-6: Dm | Bar 7: E7 | Bar 8: Am
// Each bar = 0.125 of the total cycle (8 bars total)
const JOURNAL_PATTERN: PatternEvent[] = [
  // ========== DRUMS - Shuffle groove ==========
  // Kick: beats 1 and 3, plus shuffle hits
  // Bar 1
  { time: 0, type: 'kick', gain: 0.85 },
  { time: 0.0625, type: 'kick', gain: 0.5 },  // shuffle "and"
  // Bar 2
  { time: 0.125, type: 'kick', gain: 0.8 },
  { time: 0.1875, type: 'kick', gain: 0.45 },
  // Bar 3
  { time: 0.25, type: 'kick', gain: 0.85 },
  { time: 0.3125, type: 'kick', gain: 0.5 },
  // Bar 4
  { time: 0.375, type: 'kick', gain: 0.8 },
  { time: 0.4375, type: 'kick', gain: 0.45 },
  // Bar 5 (Dm)
  { time: 0.5, type: 'kick', gain: 0.85 },
  { time: 0.5625, type: 'kick', gain: 0.5 },
  // Bar 6
  { time: 0.625, type: 'kick', gain: 0.8 },
  { time: 0.6875, type: 'kick', gain: 0.45 },
  // Bar 7 (E7)
  { time: 0.75, type: 'kick', gain: 0.9 },
  { time: 0.8125, type: 'kick', gain: 0.5 },
  // Bar 8 (Am)
  { time: 0.875, type: 'kick', gain: 0.85 },
  { time: 0.9375, type: 'kick', gain: 0.45 },

  // Snare: beats 2 and 4 of each bar
  { time: 0.03125, type: 'snare', gain: 0.7 },   // Bar 1 beat 2
  { time: 0.09375, type: 'snare', gain: 0.7 },   // Bar 1 beat 4
  { time: 0.15625, type: 'snare', gain: 0.7 },   // Bar 2 beat 2
  { time: 0.21875, type: 'snare', gain: 0.7 },   // Bar 2 beat 4
  { time: 0.28125, type: 'snare', gain: 0.7 },   // Bar 3 beat 2
  { time: 0.34375, type: 'snare', gain: 0.7 },   // Bar 3 beat 4
  { time: 0.40625, type: 'snare', gain: 0.7 },   // Bar 4 beat 2
  { time: 0.46875, type: 'snare', gain: 0.7 },   // Bar 4 beat 4
  { time: 0.53125, type: 'snare', gain: 0.7 },   // Bar 5 beat 2
  { time: 0.59375, type: 'snare', gain: 0.7 },   // Bar 5 beat 4
  { time: 0.65625, type: 'snare', gain: 0.7 },   // Bar 6 beat 2
  { time: 0.71875, type: 'snare', gain: 0.7 },   // Bar 6 beat 4
  { time: 0.78125, type: 'snare', gain: 0.75 },  // Bar 7 beat 2 (E7 - tension)
  { time: 0.84375, type: 'snare', gain: 0.75 },  // Bar 7 beat 4
  { time: 0.90625, type: 'snare', gain: 0.7 },   // Bar 8 beat 2
  { time: 0.96875, type: 'snare', gain: 0.7 },   // Bar 8 beat 4

  // Hi-hats: shuffle pattern (triplet feel approximated)
  // 2 hats per beat, swung
  ...Array.from({ length: 32 }, (_, i) => ({
    time: i * 0.03125 + (i % 2 === 1 ? 0.005 : 0), // slight swing on offbeats
    type: 'hat' as const,
    gain: i % 2 === 0 ? 0.4 : 0.25, // downbeats louder
    pan: 0.3,
  })),

  // ========== ARPEGGIOS - Chord tones ==========
  // Am: A2(45), C3(48), E3(52)
  // Dm: D3(50), F3(53), A3(57)
  // E7: E2(40), G#2(44), B2(47), D3(50)

  // Bars 1-4: Am arpeggios (sparse - leave room for guitar)
  { time: 0, type: 'note', note: 45, gain: 0.4, duration: 0.4 },      // A2
  { time: 0.02, type: 'note', note: 52, gain: 0.3, duration: 0.3 },   // E3
  { time: 0.125, type: 'note', note: 48, gain: 0.35, duration: 0.35 }, // C3
  { time: 0.25, type: 'note', note: 45, gain: 0.4, duration: 0.4 },   // A2
  { time: 0.27, type: 'note', note: 52, gain: 0.3, duration: 0.3 },   // E3
  { time: 0.375, type: 'note', note: 48, gain: 0.35, duration: 0.35 }, // C3

  // Bars 5-6: Dm arpeggios
  { time: 0.5, type: 'note', note: 50, gain: 0.4, duration: 0.4 },    // D3
  { time: 0.52, type: 'note', note: 57, gain: 0.3, duration: 0.3 },   // A3
  { time: 0.625, type: 'note', note: 53, gain: 0.35, duration: 0.35 }, // F3

  // Bar 7: E7 (the tension - dominant chord)
  { time: 0.75, type: 'note', note: 40, gain: 0.45, duration: 0.4 },  // E2 (root)
  { time: 0.77, type: 'note', note: 44, gain: 0.35, duration: 0.3 },  // G#2 (major 3rd - the blue note tension)
  { time: 0.79, type: 'note', note: 47, gain: 0.3, duration: 0.25 },  // B2 (5th)
  { time: 0.81, type: 'note', note: 50, gain: 0.25, duration: 0.2 },  // D3 (b7)

  // Bar 8: Am resolution
  { time: 0.875, type: 'note', note: 45, gain: 0.45, duration: 0.5 }, // A2
  { time: 0.895, type: 'note', note: 52, gain: 0.35, duration: 0.4 }, // E3
];

// ============================================
// PATTERN SCHEDULER
// ============================================

class PatternScheduler {
  private _isPlaying = false;
  private _cycleStart = 0;
  private _intervalId: number | null = null;
  private _audioIntervalId: number | null = null;
  private _bpm = 90; // Slower for the meditative feel
  private _lastPositions: Map<number, number> = new Map();

  get isPlaying() {
    return this._isPlaying;
  }

  play() {
    if (this._isPlaying) return;

    this._isPlaying = true;
    this._cycleStart = performance.now();
    this._lastPositions.clear();

    window.dispatchEvent(
      new CustomEvent(STRUDEL_EVENTS.PLAYBACK, {
        detail: { isPlaying: true, cyclePosition: 0 },
      })
    );

    this._intervalId = window.setInterval(() => {
      this._tick();
    }, 25); // Faster tick for more precise timing

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

    window.dispatchEvent(
      new CustomEvent(STRUDEL_EVENTS.PLAYBACK, {
        detail: { isPlaying: false, cyclePosition: 0 },
      })
    );
  }

  private _tick() {
    const now = performance.now();
    // Pattern is slowed by 2, so 8 beats = 2 cycles worth of time
    const cycleDuration = (60 / this._bpm) * 8 * 1000;
    const elapsed = now - this._cycleStart;
    const cyclePosition = (elapsed % cycleDuration) / cycleDuration;

    for (let i = 0; i < JOURNAL_PATTERN.length; i++) {
      const event = JOURNAL_PATTERN[i];
      const lastPos = this._lastPositions.get(i) ?? -1;

      // Check if we crossed this event's time
      if (
        (lastPos < event.time && cyclePosition >= event.time) ||
        (lastPos > 0.9 && cyclePosition < 0.1 && event.time < 0.1)
      ) {
        this._fireEvent(event, cyclePosition);
      }
    }

    // Update last positions
    for (let i = 0; i < JOURNAL_PATTERN.length; i++) {
      this._lastPositions.set(i, cyclePosition);
    }
  }

  private _fireEvent(event: PatternEvent, cyclePosition: number) {
    if (event.type === 'kick') {
      synth.playDrum('kick', event.gain);
    } else if (event.type === 'snare') {
      synth.playDrum('snare', event.gain);
    } else if (event.type === 'hat') {
      synth.playDrum('hat', event.gain);
    } else if (event.type === 'note' && event.note) {
      synth.playNote(event.note, event.gain, event.duration ?? 0.2, event.pan ?? 0);
    }

    // Dispatch hap event for visualization
    const hap: Hap = {
      part: { begin: cyclePosition, end: cyclePosition + 0.1 },
      whole: { begin: cyclePosition, end: cyclePosition + 0.1 },
      value: {
        note: event.note ?? (event.type === 'kick' ? 36 : 42),
        gain: event.gain,
        pan: event.pan ?? 0,
        s: event.type,
      },
      hasOnset: true,
    };

    window.dispatchEvent(
      new CustomEvent(STRUDEL_EVENTS.HAP, {
        detail: {
          hap,
          deadline: 0,
          duration: event.duration ?? 0.1,
          cyclePosition,
        },
      })
    );
  }

  private _sendAudioAnalysis() {
    const now = performance.now();
    const cycleDuration = (60 / this._bpm) * 8 * 1000;
    const elapsed = now - this._cycleStart;
    const cyclePosition = (elapsed % cycleDuration) / cycleDuration;

    // Generate mock frequency bands based on pattern
    const bands = this._generateBands(cyclePosition);

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

  private _generateBands(cyclePosition: number): FrequencyBands {
    // Find nearby events
    let bass = 0.15;
    let mid = 0.15;
    let treble = 0.15;

    for (const event of JOURNAL_PATTERN) {
      const dist = Math.min(
        Math.abs(event.time - cyclePosition),
        Math.abs(event.time - cyclePosition + 1),
        Math.abs(event.time - cyclePosition - 1)
      );

      if (dist < 0.1) {
        const proximity = 1 - dist / 0.1;
        const contribution = event.gain * proximity * 0.5;

        if (event.type === 'kick') {
          bass += contribution;
        } else if (event.type === 'snare') {
          mid += contribution * 0.6;
          treble += contribution * 0.4;
        } else if (event.type === 'hat') {
          treble += contribution * 0.7;
        } else {
          mid += contribution;
        }
      }
    }

    // Add subtle variation
    bass = Math.min(1, bass + Math.random() * 0.05);
    mid = Math.min(1, mid + Math.random() * 0.05);
    treble = Math.min(1, treble + Math.random() * 0.05);

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

const scheduler = new PatternScheduler();

// ============================================
// UI SETUP
// ============================================

// Playback controls
const globalPlay = document.getElementById('global-play') as HTMLButtonElement;
const globalStop = document.getElementById('global-stop') as HTMLButtonElement;
const patternPlay = document.getElementById('play-pattern') as HTMLButtonElement;
const patternStop = document.getElementById('stop-pattern') as HTMLButtonElement;
const volumeSlider = document.getElementById('volume') as HTMLInputElement;
const presetSelector = document.getElementById('hydra-preset') as HTMLSelectElement;
const hydraCanvas = document.getElementById('hydra') as HydraCanvas;

function startPlayback() {
  synth.init();
  synth.resume();
  scheduler.play();

  // Toggle playing state on body for CSS
  document.body.classList.add('playing');

  globalPlay.disabled = true;
  globalPlay.classList.add('active');
  globalStop.disabled = false;
  patternPlay.disabled = true;
  patternPlay.classList.add('playing');
  patternStop.disabled = false;

  // Switch to reactive preset when playing
  if (presetSelector.value === 'minimal') {
    presetSelector.value = 'reactive';
    hydraCanvas.setAttribute('preset', 'reactive');
  }
}

function stopPlayback() {
  scheduler.stop();
  synth.suspend();

  // Remove playing state from body
  document.body.classList.remove('playing');

  globalPlay.disabled = false;
  globalPlay.classList.remove('active');
  globalStop.disabled = true;
  patternPlay.disabled = false;
  patternPlay.classList.remove('playing');
  patternStop.disabled = true;
}

// Event listeners
globalPlay.addEventListener('click', startPlayback);
globalStop.addEventListener('click', stopPlayback);
patternPlay.addEventListener('click', startPlayback);
patternStop.addEventListener('click', stopPlayback);

volumeSlider.addEventListener('input', () => {
  const volume = parseInt(volumeSlider.value, 10) / 100;
  synth.setVolume(volume);
});

presetSelector.addEventListener('change', () => {
  hydraCanvas.setAttribute('preset', presetSelector.value);
});

// Footnote smooth scroll
document.querySelectorAll('.footnote-ref').forEach((ref) => {
  ref.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = (ref as HTMLAnchorElement).getAttribute('href');
    if (targetId) {
      const target = document.querySelector(targetId);
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

// Log startup
console.log('Journal entry demo loaded');
console.log('Pattern: A minor blues with shuffle groove (Am-Dm-E7-Am)');
