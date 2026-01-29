import { html, css, PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { GlitchBase } from '../base/glitch-base.js';
import {
  type Hap,
  type AudioAnalysis,
  type FrequencyBands,
  type VisualizationState,
  type StrudelHapEvent,
  type StrudelPlaybackEvent,
  type StrudelAudioEvent,
  STRUDEL_EVENTS,
  DEFAULT_VISUALIZATION_CONFIG,
} from './types.js';

/**
 * VISUALIZATION-CANVAS COMPONENT
 *
 * THEORETICAL GROUNDING:
 * This component creates a living, breathing backdrop that responds to
 * musical patterns. Like Russell's concept of the glitch as vitality,
 * the visualization embodies the idea that digital space can be alive,
 * reactive, and expressive.
 *
 * VISUAL METAPHOR:
 * - Exploding particles = energy release of each note
 * - Geometric shapes = mathematical structure of music
 * - Frequency spectrum = the voice of the pattern made visible
 * - Chromatic colors = the glitch aesthetic bleeding through
 *
 * PERFORMANCE:
 * - Canvas 2D for rendering
 * - RAF loop at 60fps
 * - Visibility tracking via IntersectionObserver (inherited from GlitchBase)
 */
@customElement('visualization-canvas')
export class VisualizationCanvas extends GlitchBase {
  // ============================================
  // PUBLIC API
  // ============================================

  /** Target frames per second */
  @property({ type: Number, attribute: 'target-fps' })
  targetFps = DEFAULT_VISUALIZATION_CONFIG.targetFps;

  /** Fade duration when playback starts (ms) */
  @property({ type: Number, attribute: 'fade-in-duration' })
  fadeInDuration = DEFAULT_VISUALIZATION_CONFIG.fadeInDuration;

  /** Fade duration when playback stops (ms) */
  @property({ type: Number, attribute: 'fade-out-duration' })
  fadeOutDuration = DEFAULT_VISUALIZATION_CONFIG.fadeOutDuration;

  /** Intensity level (0-1, affects particle count, brightness, etc) */
  @property({ type: Number })
  intensity = 1.0;

  /** Whether to listen for global Strudel events */
  @property({ type: Boolean, attribute: 'auto-connect' })
  autoConnect = true;

  // ============================================
  // INTERNAL STATE
  // ============================================

  @state()
  private _isPlaying = false;

  @state()
  private _opacity = 0;

  @query('canvas')
  private _canvas!: HTMLCanvasElement;

  private _ctx: CanvasRenderingContext2D | null = null;
  private _width = 0;
  private _height = 0;
  private _dpr = 1;

  /** Active haps being visualized */
  private _activeHaps: Hap[] = [];

  /** Recent haps (for trail effects) */
  private _recentHaps: Array<{ hap: Hap; timestamp: number }> = [];

  /** Current audio analysis */
  private _audioAnalysis: AudioAnalysis | null = null;

  /** Computed frequency bands */
  private _frequencyBands: FrequencyBands | null = null;

  /** Fade animation state */
  private _fadeStart = 0;
  private _fadeFrom = 0;
  private _fadeTo = 0;
  private _isFading = false;

  /** Visual elements */
  private _particles: Particle[] = [];
  private _rings: Ring[] = [];
  private _lines: Line[] = [];
  private _trees: FractalTree[] = [];
  private _spirals: Spiral[] = [];

  /** Animation state */
  private _time = 0;
  private _lastTimestamp = 0;
  private _beatPhase = 0;
  private _kaleidoscopeSegments = 6;

  /** Fractal zoom state */
  private _fractalZoom = 1;
  private _fractalRotation = 0;
  private _fractalHue = 0;

  /** Resize observer for canvas sizing */
  private _resizeObserver?: ResizeObserver;

  /** Bound event handlers */
  private _boundHandlers = {
    hap: this._handleHapEvent.bind(this),
    playback: this._handlePlaybackEvent.bind(this),
    audio: this._handleAudioEvent.bind(this),
    resize: this._handleResize.bind(this),
  };

  // ============================================
  // COLOR PALETTE - More intense!
  // ============================================

  private readonly _colors = {
    // Glitch colors (bright, digital)
    magenta: '#ff00ff',
    cyan: '#00ffff',
    hotPink: '#ff6b9d',
    lime: '#b4ff9f',
    violet: '#9d00ff',
    // Warm accent
    rose: '#ff5555',
    orange: '#ff8844',
    gold: '#ffcc00',
    // Cool accent
    teal: '#00ffaa',
    blue: '#4488ff',
  };

  private readonly _colorArray = [
    '#ff00ff', '#00ffff', '#ff6b9d', '#b4ff9f', '#9d00ff',
    '#ff5555', '#ff8844', '#ffcc00', '#00ffaa', '#4488ff',
  ];

  // ============================================
  // LIFECYCLE
  // ============================================

  connectedCallback() {
    super.connectedCallback();
    this._dpr = window.devicePixelRatio || 1;
    this._setupResizeObserver();

    if (this.autoConnect) {
      this._connectToStrudelEvents();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._disconnectFromStrudelEvents();
    this._resizeObserver?.disconnect();
  }

  firstUpdated() {
    this._initCanvas();
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
  }

  protected override onVisibilityChange(visible: boolean): void {
    if (visible && this._isPlaying) {
      this._startRenderLoop();
    } else if (!visible) {
      this.stopAnimationLoop();
    }
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  setPlaybackState(isPlaying: boolean): void {
    if (this._isPlaying === isPlaying) return;

    this._isPlaying = isPlaying;
    this._fadeFrom = this._opacity;
    this._fadeTo = isPlaying ? 1 : 0;
    this._fadeStart = performance.now();
    this._isFading = true;

    if (isPlaying && this.isVisible) {
      this._startRenderLoop();
    }

    this.dispatchEvent(
      new CustomEvent('visualization-state-change', {
        detail: { isPlaying },
        bubbles: true,
        composed: true,
      })
    );
  }

  addHap(hap: Hap, _deadline: number, duration: number): void {
    this._activeHaps.push(hap);
    this._recentHaps.push({ hap, timestamp: performance.now() });

    // INTENSE: Spawn lots of particles!
    this._spawnParticlesForHap(hap);

    // Spawn expanding ring
    this._spawnRing(hap);

    // Spawn connecting lines
    this._spawnLines(hap);

    // Spawn fractal tree
    this._spawnFractalTree(hap);

    // Spawn spiral
    this._spawnSpiral(hap);

    // Beat pulse
    this._beatPhase = 1;

    // Cleanup old haps
    const cutoff = performance.now() - 3000;
    this._recentHaps = this._recentHaps.filter((h) => h.timestamp > cutoff);

    setTimeout(() => {
      const idx = this._activeHaps.indexOf(hap);
      if (idx > -1) this._activeHaps.splice(idx, 1);
    }, duration * 1000);
  }

  updateAudio(analysis: AudioAnalysis, bands: FrequencyBands): void {
    this._audioAnalysis = analysis;
    this._frequencyBands = bands;
  }

  getState(): VisualizationState {
    return {
      isPlaying: this._isPlaying,
      currentCycle: 0,
      activeHaps: [...this._activeHaps],
      audioAnalysis: this._audioAnalysis,
      frequencyBands: this._frequencyBands,
      opacity: this._opacity,
    };
  }

  // ============================================
  // CANVAS SETUP
  // ============================================

  private _initCanvas(): void {
    if (!this._canvas) return;

    this._ctx = this._canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    });

    this._updateCanvasSize();
  }

  private _setupResizeObserver(): void {
    this._resizeObserver = new ResizeObserver(this._boundHandlers.resize);
    this._resizeObserver.observe(this);
  }

  private _handleResize(): void {
    this._updateCanvasSize();
  }

  private _updateCanvasSize(): void {
    if (!this._canvas) return;

    const rect = this.getBoundingClientRect();
    this._width = rect.width;
    this._height = rect.height;

    this._canvas.width = this._width * this._dpr;
    this._canvas.height = this._height * this._dpr;

    if (this._ctx) {
      this._ctx.scale(this._dpr, this._dpr);
    }
  }

  // ============================================
  // STRUDEL EVENT CONNECTION
  // ============================================

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
    const { hap, deadline, duration } = event.detail;
    this.addHap(hap, deadline, duration);
  }

  private _handlePlaybackEvent(event: StrudelPlaybackEvent): void {
    this.setPlaybackState(event.detail.isPlaying);
  }

  private _handleAudioEvent(event: StrudelAudioEvent): void {
    this.updateAudio(event.detail.analysis, event.detail.bands);
  }

  // ============================================
  // RENDER LOOP
  // ============================================

  private _startRenderLoop(): void {
    if (this.rafId !== undefined) return;

    this._lastTimestamp = performance.now();

    this.startAnimationLoop((timestamp) => {
      const dt = (timestamp - this._lastTimestamp) / 1000;
      this._lastTimestamp = timestamp;
      this._time += dt;

      this._render(timestamp, dt);

      return this._isPlaying || this._isFading || this._opacity > 0;
    }, this.targetFps);
  }

  private _render(timestamp: number, dt: number): void {
    if (!this._ctx || !this._canvas) return;

    this._updateFade(timestamp);
    if (this._opacity <= 0) return;

    const ctx = this._ctx;

    // Dark background with trail effect
    ctx.fillStyle = `rgba(0, 0, 0, ${0.1 + (1 - this.intensity) * 0.2})`;
    ctx.fillRect(0, 0, this._width, this._height);

    ctx.globalAlpha = this._opacity;

    if (this.prefersReducedMotion) {
      this._renderReducedMotion(ctx);
    } else {
      this._renderFull(ctx, timestamp, dt);
    }

    ctx.globalAlpha = 1;
  }

  private _updateFade(timestamp: number): void {
    if (!this._isFading) return;

    const fadeDuration = this._fadeTo > this._fadeFrom ? this.fadeInDuration : this.fadeOutDuration;
    const elapsed = timestamp - this._fadeStart;
    const progress = Math.min(elapsed / fadeDuration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    this._opacity = this._fadeFrom + (this._fadeTo - this._fadeFrom) * eased;

    if (progress >= 1) {
      this._isFading = false;
      this._opacity = this._fadeTo;
      if (this._opacity <= 0) {
        this.stopAnimationLoop();
      }
    }
  }

  // ============================================
  // FULL RENDERING - THE INTENSE STUFF
  // ============================================

  private _renderFull(ctx: CanvasRenderingContext2D, _timestamp: number, dt: number): void {
    const bands = this._frequencyBands;

    // Decay beat phase
    this._beatPhase *= 0.92;

    // 0. FRACTAL ZOOM - renders first as background layer
    this._updateFractalZoom(dt, bands);
    this._drawFractalZoom(ctx, bands);

    // 1. Frequency spectrum bars
    if (this._audioAnalysis) {
      this._drawSpectrum(ctx, this._audioAnalysis.frequencyData);
    }

    // 2. Rotating geometry
    this._drawGeometry(ctx, bands, this._time);

    // 3. Waveform circle
    if (this._audioAnalysis) {
      this._drawWaveformCircle(ctx, this._audioAnalysis.frequencyData);
    }

    // 4. Update and draw lines
    this._updateLines(dt);
    this._drawLines(ctx);

    // 5. Update and draw rings
    this._updateRings(dt);
    this._drawRings(ctx);

    // 6. Update and draw particles
    this._updateParticles(dt, bands);
    this._drawParticles(ctx);

    // 7. Update and draw fractal trees
    this._updateTrees(dt);
    this._drawTrees(ctx);

    // 8. Update and draw spirals
    this._updateSpirals(dt, bands);
    this._drawSpirals(ctx, bands);

    // 9. Kaleidoscope overlay
    this._drawKaleidoscope(ctx, bands);

    // 10. Center flash on beat
    if (this._beatPhase > 0.1) {
      this._drawBeatFlash(ctx);
    }

    // 11. Vignette overlay
    this._drawVignette(ctx, bands);
  }

  private _renderReducedMotion(ctx: CanvasRenderingContext2D): void {
    if (!this._frequencyBands) return;

    const avg = this._frequencyBands.average;
    const gradient = ctx.createRadialGradient(
      this._width / 2, this._height / 2, 0,
      this._width / 2, this._height / 2, Math.max(this._width, this._height) / 2
    );

    gradient.addColorStop(0, `rgba(255, 0, 255, ${avg * 0.1})`);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this._width, this._height);
  }

  // ============================================
  // SPECTRUM VISUALIZATION
  // ============================================

  private _drawSpectrum(ctx: CanvasRenderingContext2D, frequencyData: Uint8Array): void {
    const barCount = 64;
    const barWidth = this._width / barCount;
    const centerY = this._height;

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * frequencyData.length);
      const value = frequencyData[dataIndex] / 255;
      const barHeight = value * this._height * 0.6 * this.intensity;

      // Color based on frequency
      const hue = (i / barCount) * 300; // Magenta to cyan range
      ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${0.3 + value * 0.5})`;

      // Draw from bottom
      ctx.fillRect(
        i * barWidth,
        centerY - barHeight,
        barWidth - 1,
        barHeight
      );

      // Mirror from top (subtle)
      ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${0.1 + value * 0.2})`;
      ctx.fillRect(
        i * barWidth,
        0,
        barWidth - 1,
        barHeight * 0.3
      );
    }
  }

  // ============================================
  // GEOMETRIC SHAPES
  // ============================================

  private _drawGeometry(ctx: CanvasRenderingContext2D, bands: FrequencyBands | null, _timestamp: number): void {
    const cx = this._width / 2;
    const cy = this._height / 2;
    const bass = bands?.bass ?? 0.5;
    const mid = bands?.mid ?? 0.5;
    const treble = bands?.treble ?? 0.5;

    // Rotating hexagon
    const hexRadius = 100 + bass * 150 * this.intensity;
    const rotation = this._time * 0.5;

    ctx.strokeStyle = this._colors.cyan;
    ctx.lineWidth = 2 + bass * 4;
    ctx.globalAlpha = 0.5 + bass * 0.5;
    this._drawPolygon(ctx, cx, cy, hexRadius, 6, rotation);

    // Inner triangle
    const triRadius = 60 + mid * 80 * this.intensity;
    ctx.strokeStyle = this._colors.magenta;
    ctx.lineWidth = 2 + mid * 3;
    ctx.globalAlpha = 0.4 + mid * 0.4;
    this._drawPolygon(ctx, cx, cy, triRadius, 3, -rotation * 1.5);

    // Outer octagon
    const octRadius = 150 + treble * 100 * this.intensity;
    ctx.strokeStyle = this._colors.hotPink;
    ctx.lineWidth = 1 + treble * 2;
    ctx.globalAlpha = 0.3 + treble * 0.3;
    this._drawPolygon(ctx, cx, cy, octRadius, 8, rotation * 0.7);

    ctx.globalAlpha = 1;
  }

  private _drawPolygon(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, sides: number, rotation: number): void {
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2 + rotation;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  // ============================================
  // WAVEFORM CIRCLE
  // ============================================

  private _drawWaveformCircle(ctx: CanvasRenderingContext2D, frequencyData: Uint8Array): void {
    const cx = this._width / 2;
    const cy = this._height / 2;
    const baseRadius = 80;
    const points = 128;

    ctx.beginPath();
    ctx.strokeStyle = this._colors.lime;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const dataIndex = Math.floor((i / points) * frequencyData.length);
      const value = frequencyData[dataIndex] / 255;
      const radius = baseRadius + value * 60 * this.intensity;

      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ============================================
  // PARTICLES - MORE INTENSE
  // ============================================

  private _spawnParticlesForHap(hap: Hap): void {
    const gain = (hap.value.gain as number) ?? 0.5;
    const note = (hap.value.note as number) ?? 60;
    const pan = (hap.value.pan as number) ?? 0;

    // INTENSE: More particles!
    const spawnCount = Math.floor((10 + gain * 30) * this.intensity);

    const baseX = this._width * (0.5 + pan * 0.4);
    const baseY = this._height * 0.5;

    // Pick vibrant color based on note
    const colorIndex = note % this._colorArray.length;
    const color = this._colorArray[colorIndex];

    for (let i = 0; i < spawnCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8 * gain;

      this._particles.push({
        x: baseX + (Math.random() - 0.5) * 50,
        y: baseY + (Math.random() - 0.5) * 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 8 * gain,
        color,
        alpha: 0.8 + Math.random() * 0.2,
        life: 1,
        decay: 0.008 + Math.random() * 0.015,
        trail: [],
      });
    }

    // Limit total particles
    const maxParticles = this.isMobile ? 300 : 1000;
    if (this._particles.length > maxParticles) {
      this._particles.splice(0, this._particles.length - maxParticles);
    }
  }

  private _updateParticles(dt: number, bands: FrequencyBands | null): void {
    const gravity = 50;
    const bass = bands?.bass ?? 0;

    for (let i = this._particles.length - 1; i >= 0; i--) {
      const p = this._particles[i];

      // Store trail position
      if (p.trail.length === 0 ||
          Math.abs(p.x - p.trail[p.trail.length - 1].x) > 2 ||
          Math.abs(p.y - p.trail[p.trail.length - 1].y) > 2) {
        p.trail.push({ x: p.x, y: p.y, alpha: p.alpha * p.life });
      }

      // Limit trail length
      if (p.trail.length > 15) {
        p.trail.shift();
      }

      // Physics
      p.vy += gravity * dt;
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Audio reactivity
      if (bands) {
        p.vx += (bands.mid - 0.5) * 2;
        p.vy -= bass * 3;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > this._width) {
        p.vx *= -0.7;
        p.x = Math.max(0, Math.min(this._width, p.x));
      }
      if (p.y > this._height) {
        p.vy *= -0.7;
        p.y = this._height;
      }

      // Decay
      p.life -= p.decay;

      if (p.life <= 0) {
        this._particles.splice(i, 1);
      }
    }
  }

  private _drawParticles(ctx: CanvasRenderingContext2D): void {
    for (const p of this._particles) {
      // Draw trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * p.life * 0.5;
        ctx.globalAlpha = p.alpha * p.life * 0.3;
        ctx.stroke();
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * p.life;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life * 2, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * p.life * 0.2;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  // ============================================
  // RINGS
  // ============================================

  private _spawnRing(hap: Hap): void {
    const pan = (hap.value.pan as number) ?? 0;
    const gain = (hap.value.gain as number) ?? 0.5;
    const note = (hap.value.note as number) ?? 60;

    const colorIndex = (note + 3) % this._colorArray.length;

    this._rings.push({
      x: this._width * (0.5 + pan * 0.4),
      y: this._height * 0.5,
      radius: 10,
      maxRadius: 150 + gain * 200,
      color: this._colorArray[colorIndex],
      alpha: 0.8,
      growth: 200 + gain * 300,
      lineWidth: 3 + gain * 5,
    });

    // Limit rings
    if (this._rings.length > 20) {
      this._rings.shift();
    }
  }

  private _updateRings(dt: number): void {
    for (let i = this._rings.length - 1; i >= 0; i--) {
      const r = this._rings[i];
      r.radius += r.growth * dt;
      r.alpha = 1 - (r.radius / r.maxRadius);
      r.lineWidth *= 0.98;

      if (r.radius >= r.maxRadius || r.alpha <= 0) {
        this._rings.splice(i, 1);
      }
    }
  }

  private _drawRings(ctx: CanvasRenderingContext2D): void {
    for (const r of this._rings) {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = r.lineWidth;
      ctx.globalAlpha = r.alpha * 0.7;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ============================================
  // CONNECTING LINES
  // ============================================

  private _spawnLines(hap: Hap): void {
    const pan = (hap.value.pan as number) ?? 0;
    const note = (hap.value.note as number) ?? 60;

    const x = this._width * (0.5 + pan * 0.4);
    const y = this._height * 0.5;
    const colorIndex = (note + 6) % this._colorArray.length;

    // Spawn lines to random points
    const lineCount = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < lineCount; i++) {
      this._lines.push({
        x1: x,
        y1: y,
        x2: Math.random() * this._width,
        y2: Math.random() * this._height,
        color: this._colorArray[colorIndex],
        alpha: 0.6,
        decay: 0.02 + Math.random() * 0.02,
      });
    }

    // Limit lines
    if (this._lines.length > 50) {
      this._lines.splice(0, this._lines.length - 50);
    }
  }

  private _updateLines(_dt: number): void {
    for (let i = this._lines.length - 1; i >= 0; i--) {
      const l = this._lines[i];
      l.alpha -= l.decay;

      if (l.alpha <= 0) {
        this._lines.splice(i, 1);
      }
    }
  }

  private _drawLines(ctx: CanvasRenderingContext2D): void {
    for (const l of this._lines) {
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.strokeStyle = l.color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = l.alpha * 0.5;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ============================================
  // BEAT FLASH
  // ============================================

  private _drawBeatFlash(ctx: CanvasRenderingContext2D): void {
    const cx = this._width / 2;
    const cy = this._height / 2;
    const radius = this._beatPhase * Math.max(this._width, this._height);

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${this._beatPhase * 0.3})`);
    gradient.addColorStop(0.5, `rgba(255, 0, 255, ${this._beatPhase * 0.1})`);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this._width, this._height);
  }

  // ============================================
  // VIGNETTE
  // ============================================

  private _drawVignette(ctx: CanvasRenderingContext2D, bands: FrequencyBands | null): void {
    const bass = bands?.bass ?? 0;
    const cx = this._width / 2;
    const cy = this._height / 2;
    const radius = Math.max(this._width, this._height) * 0.7;

    // Pulsing vignette based on bass
    const vignetteStrength = 0.3 + bass * 0.2;

    const gradient = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.7, 'transparent');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${vignetteStrength})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this._width, this._height);
  }

  // ============================================
  // INFINITE FRACTAL ZOOM - The hypnotic background
  // ============================================

  private _updateFractalZoom(dt: number, bands: FrequencyBands | null): void {
    const bass = bands?.bass ?? 0.3;
    const mid = bands?.mid ?? 0.3;

    // Continuous zoom - speed affected by bass
    const zoomSpeed = 0.3 + bass * 0.5;
    this._fractalZoom *= 1 + zoomSpeed * dt;

    // Reset zoom when it gets too deep (creates seamless loop)
    if (this._fractalZoom > 3) {
      this._fractalZoom = 1;
    }

    // Slow rotation affected by mid frequencies
    this._fractalRotation += (0.1 + mid * 0.3) * dt;

    // Color cycling
    this._fractalHue += 20 * dt;
    if (this._fractalHue > 360) {
      this._fractalHue -= 360;
    }
  }

  private _drawFractalZoom(ctx: CanvasRenderingContext2D, bands: FrequencyBands | null): void {
    const cx = this._width / 2;
    const cy = this._height / 2;
    const bass = bands?.bass ?? 0.3;
    const treble = bands?.treble ?? 0.3;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this._fractalRotation);

    // Draw multiple layers of the fractal at different zoom levels
    // This creates the infinite zoom illusion
    const layers = 8;

    for (let layer = 0; layer < layers; layer++) {
      // Each layer is at a different zoom level
      const layerZoom = this._fractalZoom * Math.pow(1.5, layer);
      const normalizedZoom = ((layerZoom - 1) % 2) + 1; // Keep between 1-3

      // Fade based on zoom level (middle layers most visible)
      const zoomFade = 1 - Math.abs(normalizedZoom - 2) / 1.5;
      const layerAlpha = zoomFade * 0.4 * this.intensity;

      if (layerAlpha < 0.02) continue;

      ctx.globalAlpha = layerAlpha;

      // Calculate size for this layer
      const baseSize = Math.min(this._width, this._height) * 0.4;
      const size = baseSize * normalizedZoom;

      // Color shifts per layer
      const hue = (this._fractalHue + layer * 45) % 360;
      const saturation = 80 + treble * 20;
      const lightness = 50 + bass * 20;

      // Draw the Sierpinski-like fractal
      this._drawSierpinskiLayer(ctx, 0, 0, size, 5, hue, saturation, lightness, layer);
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  private _drawSierpinskiLayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    depth: number,
    hue: number,
    saturation: number,
    lightness: number,
    layerOffset: number
  ): void {
    if (depth <= 0 || size < 4) return;

    // Draw triangular fractal pattern
    const h = size * Math.sqrt(3) / 2;

    // Rotate the whole pattern slightly per layer for variety
    ctx.save();
    ctx.rotate(layerOffset * 0.1);

    // Main triangle outline
    ctx.beginPath();
    ctx.moveTo(x, y - h * 0.67);
    ctx.lineTo(x - size / 2, y + h * 0.33);
    ctx.lineTo(x + size / 2, y + h * 0.33);
    ctx.closePath();

    // Style varies by depth
    const depthHue = (hue + depth * 30) % 360;
    ctx.strokeStyle = `hsla(${depthHue}, ${saturation}%, ${lightness}%, 0.8)`;
    ctx.lineWidth = Math.max(1, depth * 0.5);
    ctx.stroke();

    // Inner glow
    if (depth > 2) {
      ctx.strokeStyle = `hsla(${depthHue}, ${saturation}%, ${lightness + 20}%, 0.3)`;
      ctx.lineWidth = depth * 2;
      ctx.stroke();
    }

    // Recurse into three smaller triangles (Sierpinski pattern)
    const newSize = size / 2;
    const newH = h / 2;

    // Top triangle
    this._drawSierpinskiLayer(
      ctx, x, y - newH * 0.67,
      newSize, depth - 1, hue, saturation, lightness, layerOffset
    );

    // Bottom-left triangle
    this._drawSierpinskiLayer(
      ctx, x - newSize / 2, y + newH * 0.33,
      newSize, depth - 1, hue, saturation, lightness, layerOffset
    );

    // Bottom-right triangle
    this._drawSierpinskiLayer(
      ctx, x + newSize / 2, y + newH * 0.33,
      newSize, depth - 1, hue, saturation, lightness, layerOffset
    );

    // Add hexagonal elements for more complexity
    if (depth > 3) {
      this._drawHexagonalAccent(ctx, x, y, size * 0.3, depthHue, saturation, lightness);
    }

    ctx.restore();
  }

  private _drawHexagonalAccent(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    hue: number,
    saturation: number,
    lightness: number
  ): void {
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = `hsla(${(hue + 180) % 360}, ${saturation}%, ${lightness}%, 0.5)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // ============================================
  // FRACTAL TREES
  // ============================================

  private _spawnFractalTree(hap: Hap): void {
    const pan = (hap.value.pan as number) ?? 0;
    const gain = (hap.value.gain as number) ?? 0.5;
    const note = (hap.value.note as number) ?? 60;

    const colorIndex = (note + 2) % this._colorArray.length;

    // Spawn tree from bottom, growing upward
    const baseX = this._width * (0.3 + Math.random() * 0.4 + pan * 0.2);
    const baseY = this._height * (0.7 + Math.random() * 0.2);

    this._trees.push({
      x: baseX,
      y: baseY,
      angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.3, // Mostly upward
      length: 40 + gain * 60,
      depth: 0,
      maxDepth: 4 + Math.floor(gain * 3),
      color: this._colorArray[colorIndex],
      alpha: 0.8,
      life: 1,
      decay: 0.008 + Math.random() * 0.005,
      branchAngle: 0.4 + Math.random() * 0.3,
      lengthRatio: 0.65 + Math.random() * 0.15,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 1 + Math.random() * 2,
    });

    // Limit trees
    if (this._trees.length > 8) {
      this._trees.shift();
    }
  }

  private _updateTrees(dt: number): void {
    for (let i = this._trees.length - 1; i >= 0; i--) {
      const tree = this._trees[i];
      tree.life -= tree.decay;
      tree.swayPhase += tree.swaySpeed * dt;

      if (tree.life <= 0) {
        this._trees.splice(i, 1);
      }
    }
  }

  private _drawTrees(ctx: CanvasRenderingContext2D): void {
    for (const tree of this._trees) {
      ctx.globalAlpha = tree.alpha * tree.life;
      this._drawBranch(
        ctx,
        tree.x,
        tree.y,
        tree.angle,
        tree.length,
        0,
        tree.maxDepth,
        tree.color,
        tree.branchAngle,
        tree.lengthRatio,
        tree.swayPhase,
        tree.life
      );
    }
    ctx.globalAlpha = 1;
  }

  private _drawBranch(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    length: number,
    depth: number,
    maxDepth: number,
    color: string,
    branchAngle: number,
    lengthRatio: number,
    swayPhase: number,
    life: number
  ): void {
    if (depth > maxDepth || length < 2) return;

    // Add sway based on depth
    const sway = Math.sin(swayPhase + depth * 0.5) * 0.1 * (depth / maxDepth);
    const adjustedAngle = angle + sway;

    // Calculate end point
    const endX = x + Math.cos(adjustedAngle) * length;
    const endY = y + Math.sin(adjustedAngle) * length;

    // Draw the branch
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, (maxDepth - depth + 1) * 1.5 * life);
    ctx.globalAlpha = life * (1 - depth / (maxDepth + 2));
    ctx.stroke();

    // Glow effect for main branches
    if (depth < 2) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color;
      ctx.lineWidth = (maxDepth - depth + 1) * 4 * life;
      ctx.globalAlpha = life * 0.1;
      ctx.stroke();
    }

    // Recurse for child branches
    const newLength = length * lengthRatio;

    // Left branch
    this._drawBranch(
      ctx, endX, endY,
      adjustedAngle - branchAngle,
      newLength, depth + 1, maxDepth,
      color, branchAngle, lengthRatio, swayPhase, life
    );

    // Right branch
    this._drawBranch(
      ctx, endX, endY,
      adjustedAngle + branchAngle,
      newLength, depth + 1, maxDepth,
      color, branchAngle, lengthRatio, swayPhase, life
    );

    // Sometimes add a middle branch for more organic look
    if (depth < maxDepth - 1 && Math.random() > 0.5) {
      this._drawBranch(
        ctx, endX, endY,
        adjustedAngle + (Math.random() - 0.5) * branchAngle * 0.5,
        newLength * 0.8, depth + 1, maxDepth,
        color, branchAngle, lengthRatio, swayPhase, life
      );
    }
  }

  // ============================================
  // SPIRALS
  // ============================================

  private _spawnSpiral(hap: Hap): void {
    const pan = (hap.value.pan as number) ?? 0;
    const gain = (hap.value.gain as number) ?? 0.5;
    const note = (hap.value.note as number) ?? 60;

    const colorIndex = (note + 5) % this._colorArray.length;

    this._spirals.push({
      x: this._width * (0.5 + pan * 0.3),
      y: this._height * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (2 + Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1),
      arms: 3 + Math.floor(Math.random() * 4),
      color: this._colorArray[colorIndex],
      alpha: 0.6,
      life: 1,
      decay: 0.01 + Math.random() * 0.01,
      size: 30 + gain * 80,
      growthRate: 50 + gain * 100,
    });

    // Limit spirals
    if (this._spirals.length > 6) {
      this._spirals.shift();
    }
  }

  private _updateSpirals(dt: number, _bands: FrequencyBands | null): void {
    for (let i = this._spirals.length - 1; i >= 0; i--) {
      const spiral = this._spirals[i];
      spiral.life -= spiral.decay;
      spiral.rotation += spiral.rotationSpeed * dt;
      spiral.size += spiral.growthRate * dt;

      if (spiral.life <= 0) {
        this._spirals.splice(i, 1);
      }
    }
  }

  private _drawSpirals(ctx: CanvasRenderingContext2D, bands: FrequencyBands | null): void {
    const mid = bands?.mid ?? 0.5;

    for (const spiral of this._spirals) {
      ctx.globalAlpha = spiral.alpha * spiral.life;

      // Draw each arm of the spiral
      for (let arm = 0; arm < spiral.arms; arm++) {
        const armAngle = (arm / spiral.arms) * Math.PI * 2 + spiral.rotation;

        ctx.beginPath();

        // Draw spiral arm using many small segments
        const points = 60;
        for (let i = 0; i <= points; i++) {
          const t = i / points;
          const spiralAngle = armAngle + t * Math.PI * 3; // 1.5 full rotations
          const radius = t * spiral.size * (1 + mid * 0.3);

          const px = spiral.x + Math.cos(spiralAngle) * radius;
          const py = spiral.y + Math.sin(spiralAngle) * radius;

          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        ctx.strokeStyle = spiral.color;
        ctx.lineWidth = 2 + mid * 2;
        ctx.stroke();
      }

      // Draw center dot
      ctx.beginPath();
      ctx.arc(spiral.x, spiral.y, 5 * spiral.life, 0, Math.PI * 2);
      ctx.fillStyle = spiral.color;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  // ============================================
  // KALEIDOSCOPE EFFECT
  // ============================================

  private _drawKaleidoscope(ctx: CanvasRenderingContext2D, bands: FrequencyBands | null): void {
    const treble = bands?.treble ?? 0.3;

    // Only draw when there's treble activity
    if (treble < 0.3) return;

    const cx = this._width / 2;
    const cy = this._height / 2;
    const segments = this._kaleidoscopeSegments;
    const radius = Math.min(this._width, this._height) * 0.35;

    ctx.save();
    ctx.translate(cx, cy);

    const segmentAngle = (Math.PI * 2) / segments;

    for (let i = 0; i < segments; i++) {
      ctx.save();
      ctx.rotate(segmentAngle * i);

      // Create clipping path for this segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius, 0);
      ctx.arc(0, 0, radius, 0, segmentAngle);
      ctx.closePath();
      ctx.clip();

      // Draw kaleidoscope pattern within segment
      const patternOffset = this._time * 0.5 + i * 0.1;

      // Concentric arcs with varying colors
      for (let j = 3; j >= 0; j--) {
        const arcRadius = radius * (j + 1) / 4;
        const colorIndex = (Math.floor(patternOffset) + j + i) % this._colorArray.length;

        ctx.beginPath();
        ctx.arc(0, 0, arcRadius, 0, segmentAngle);
        ctx.lineTo(0, 0);
        ctx.closePath();

        ctx.fillStyle = this._colorArray[colorIndex];
        ctx.globalAlpha = treble * 0.15 * (1 - j / 4);
        ctx.fill();
      }

      // Radial lines
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius, 0);
      ctx.strokeStyle = this._colorArray[i % this._colorArray.length];
      ctx.lineWidth = 1;
      ctx.globalAlpha = treble * 0.3;
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
    ctx.globalAlpha = 1;
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

    canvas[aria-hidden='true'] {
      speak: never;
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
// TYPES
// ============================================

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  decay: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

interface Ring {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  growth: number;
  lineWidth: number;
}

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  alpha: number;
  decay: number;
}

interface FractalTree {
  x: number;
  y: number;
  angle: number;
  length: number;
  depth: number;
  maxDepth: number;
  color: string;
  alpha: number;
  life: number;
  decay: number;
  branchAngle: number;
  lengthRatio: number;
  swayPhase: number;
  swaySpeed: number;
}

interface Spiral {
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  arms: number;
  color: string;
  alpha: number;
  life: number;
  decay: number;
  size: number;
  growthRate: number;
}

// ============================================
// GLOBAL TYPE DECLARATION
// ============================================

declare global {
  interface HTMLElementTagNameMap {
    'visualization-canvas': VisualizationCanvas;
  }
}
