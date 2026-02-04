/**
 * Homepage Ambient Audio Controller
 *
 * THEORETICAL GROUNDING:
 * Ambient audio as presence - sound that doesn't demand attention but
 * creates atmosphere. Inspired by Celeste's "First Steps" - C major,
 * gentle piano arpeggios, a hopeful "welcome home" feeling.
 *
 * The audio serves as a threshold marker - entering the space of the
 * homepage is marked by this gentle soundscape, creating intimacy
 * without intrusion.
 *
 * ARCHITECTURE:
 * - Uses Web Audio API directly (no external dependencies)
 * - Three voice types: piano (triangle), bells (sine+overtones), pad (filtered saw)
 * - C major progression: C-Am-F-G at ~60 BPM
 * - State persisted to localStorage for continuity across visits
 */

// ============================================
// CONSTANTS
// ============================================

const STORAGE_KEY = 'homepage-audio-state';
const DEFAULT_VOLUME = 0.3;

/** Note frequencies (Hz) for C major scale */
const NOTES: Record<string, number> = {
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
};

/** Chord progressions for C major "First Steps" vibe */
const PROGRESSION = [
  // Bar 1-4: C major - home, warmth
  { pad: ['C3', 'G3', 'C4'], arp: ['C4', 'E4', 'G4', 'C5'], beats: 4 },
  { pad: ['C3', 'G3', 'C4'], arp: ['E4', 'G4', 'C5', 'E4'], beats: 4 },
  { pad: ['C3', 'G3', 'C4'], arp: ['G4', 'C5', 'E4', 'G4'], beats: 4 },
  { pad: ['C3', 'G3', 'C4'], arp: ['C5', 'G4', 'E4', 'C4'], beats: 4 },

  // Bar 5-8: Am - gentle melancholy
  { pad: ['A3', 'E3', 'A3'], arp: ['A4', 'C4', 'E4', 'A4'], beats: 4 },
  { pad: ['A3', 'E3', 'A3'], arp: ['C4', 'E4', 'A4', 'C4'], beats: 4 },
  { pad: ['A3', 'E3', 'A3'], arp: ['E4', 'A4', 'C4', 'E4'], beats: 4 },
  { pad: ['A3', 'E3', 'A3'], arp: ['A4', 'E4', 'C4', 'A4'], beats: 4 },

  // Bar 9-12: F major - warmth, movement
  { pad: ['F3', 'A3', 'C4'], arp: ['F4', 'A4', 'C5', 'F4'], beats: 4 },
  { pad: ['F3', 'A3', 'C4'], arp: ['A4', 'C5', 'F4', 'A4'], beats: 4 },
  { pad: ['F3', 'A3', 'C4'], arp: ['C5', 'F4', 'A4', 'C5'], beats: 4 },
  { pad: ['F3', 'A3', 'C4'], arp: ['F4', 'C5', 'A4', 'F4'], beats: 4 },

  // Bar 13-16: G major - tension, resolution coming
  { pad: ['G3', 'B3', 'D4'], arp: ['G4', 'B4', 'D4', 'G4'], beats: 4, bell: true },
  { pad: ['G3', 'B3', 'D4'], arp: ['B4', 'D4', 'G4', 'B4'], beats: 4 },
  { pad: ['G3', 'B3', 'D4'], arp: ['D4', 'G4', 'B4', 'D4'], beats: 4 },
  { pad: ['G3', 'B3', 'D4'], arp: ['G4', 'D4', 'B4', 'G4'], beats: 4, bell: true },
];

// ============================================
// TYPES
// ============================================

interface AudioState {
  volume: number;
  wasPlaying: boolean;
}

// ============================================
// HOMEPAGE AUDIO CLASS
// ============================================

export class HomepageAudio {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private _isPlaying = false;
  private _volume = DEFAULT_VOLUME;
  private schedulerInterval: number | null = null;
  private currentBar = 0;
  private nextNoteTime = 0;
  private readonly bpm = 60;

  // ============================================
  // PUBLIC API
  // ============================================

  /**
   * Initialize the audio context (requires user gesture)
   */
  async init(): Promise<void> {
    if (this.audioCtx) return;

    this.audioCtx = new AudioContext();

    // Create master gain
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = this._volume;
    this.masterGain.connect(this.audioCtx.destination);

    // Create analyser for visualization
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;
    this.masterGain.connect(this.analyser);

    // Resume if suspended (autoplay policy)
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /**
   * Check if audio context is initialized
   */
  isInitialized(): boolean {
    return this.audioCtx !== null;
  }

  /**
   * Check if audio is currently playing
   */
  isPlaying(): boolean {
    return this._isPlaying;
  }

  /**
   * Start playing the ambient audio
   */
  play(): void {
    if (!this.audioCtx || this._isPlaying) return;

    this._isPlaying = true;
    this.currentBar = 0;
    this.nextNoteTime = this.audioCtx.currentTime;

    // Start scheduler
    this.schedulerInterval = window.setInterval(() => this.scheduler(), 25);
    this.saveState();
  }

  /**
   * Pause audio (keep context alive)
   */
  pause(): void {
    if (!this._isPlaying) return;

    this._isPlaying = false;
    if (this.schedulerInterval !== null) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
    this.saveState();
  }

  /**
   * Stop and reset audio
   */
  stop(): void {
    this.pause();
    this.currentBar = 0;
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this._volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this._volume, this.audioCtx?.currentTime ?? 0, 0.1);
    }
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this._volume;
  }

  /**
   * Get analyser node for visualization
   */
  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  /**
   * Save current state to localStorage
   */
  saveState(): void {
    const state: AudioState = {
      volume: this._volume,
      wasPlaying: this._isPlaying,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage may be unavailable
    }
  }

  /**
   * Load state from localStorage
   */
  loadState(): AudioState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state = JSON.parse(stored) as AudioState;
        this._volume = state.volume ?? DEFAULT_VOLUME;
        return state;
      }
    } catch {
      // localStorage may be unavailable or corrupted
    }
    return { volume: DEFAULT_VOLUME, wasPlaying: false };
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.masterGain = null;
    this.analyser = null;
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  /**
   * Handle page visibility changes - pause when hidden
   */
  private handleVisibilityChange = (): void => {
    if (document.hidden && this._isPlaying) {
      this.pause();
    }
  };

  /**
   * Main scheduler - looks ahead and schedules notes
   */
  private scheduler(): void {
    if (!this.audioCtx || !this._isPlaying) return;

    const lookAhead = 0.1; // seconds to look ahead
    const currentTime = this.audioCtx.currentTime;

    while (this.nextNoteTime < currentTime + lookAhead) {
      this.scheduleBar(this.nextNoteTime);
      this.advanceBar();
    }
  }

  /**
   * Schedule all notes for a bar
   */
  private scheduleBar(time: number): void {
    const bar = PROGRESSION[this.currentBar];
    const beatDuration = 60 / this.bpm;

    // Schedule pad (sustained chord)
    this.schedulePad(bar.pad, time, beatDuration * bar.beats);

    // Schedule arpeggio notes
    bar.arp.forEach((note, i) => {
      const noteTime = time + i * beatDuration;
      this.schedulePiano(note, noteTime, beatDuration * 0.8);
    });

    // Schedule bell accent if present
    if (bar.bell) {
      this.scheduleBell(bar.arp[0], time, beatDuration * 2);
    }
  }

  /**
   * Advance to next bar in progression
   */
  private advanceBar(): void {
    const bar = PROGRESSION[this.currentBar];
    const beatDuration = 60 / this.bpm;
    this.nextNoteTime += beatDuration * bar.beats;
    this.currentBar = (this.currentBar + 1) % PROGRESSION.length;
  }

  /**
   * Schedule a piano note (triangle wave)
   */
  private schedulePiano(note: string, time: number, duration: number): void {
    if (!this.audioCtx || !this.masterGain) return;

    const freq = NOTES[note];
    if (!freq) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    // ADSR envelope - fast attack, medium decay
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.15, time + 0.02); // Attack
    gain.gain.exponentialRampToValueAtTime(0.08, time + 0.1); // Decay
    gain.gain.setValueAtTime(0.08, time + duration - 0.1); // Sustain
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration); // Release

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  /**
   * Schedule a bell note (sine + overtones)
   */
  private scheduleBell(note: string, time: number, duration: number): void {
    if (!this.audioCtx || !this.masterGain) return;

    const freq = NOTES[note];
    if (!freq) return;

    // Fundamental
    const osc1 = this.audioCtx.createOscillator();
    const gain1 = this.audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = freq;

    // Second partial (octave)
    const osc2 = this.audioCtx.createOscillator();
    const gain2 = this.audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;

    // Third partial
    const osc3 = this.audioCtx.createOscillator();
    const gain3 = this.audioCtx.createGain();
    osc3.type = 'sine';
    osc3.frequency.value = freq * 3;

    // Bell envelope - shimmer release
    [gain1, gain2, gain3].forEach((gain, i) => {
      const level = 0.06 / (i + 1);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(level, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    });

    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);
    gain1.connect(this.masterGain);
    gain2.connect(this.masterGain);
    gain3.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc3.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
    osc3.stop(time + duration);
  }

  /**
   * Schedule a pad chord (filtered saw)
   */
  private schedulePad(notes: string[], time: number, duration: number): void {
    if (!this.audioCtx || !this.masterGain) return;

    notes.forEach((note) => {
      const freq = NOTES[note];
      if (!freq) return;

      const osc = this.audioCtx!.createOscillator();
      const filter = this.audioCtx!.createBiquadFilter();
      const gain = this.audioCtx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.value = freq;

      // Low-pass filter for warmth
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      filter.Q.value = 1;

      // Slow attack/release envelope
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.03, time + 0.5); // Slow attack
      gain.gain.setValueAtTime(0.03, time + duration - 0.5);
      gain.gain.linearRampToValueAtTime(0, time + duration); // Slow release

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(time);
      osc.stop(time + duration);
    });
  }
}
