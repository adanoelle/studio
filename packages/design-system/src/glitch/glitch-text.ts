import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * GLITCH-TEXT COMPONENT
 *
 * THEORETICAL GROUNDING:
 * Embodies Legacy Russell's concept of the glitch as refusal and error as liberation.
 * Text that refuses stability represents identity that refuses singular categorization.
 *
 * VISUAL METAPHOR:
 * - Scrambled characters = multiplicity of meaning
 * - Chromatic aberration = multiple simultaneous identities
 * - Instability = resistance to fixed categorization
 * - Rare idle glitches = identity's refusal to stay fixed even at rest
 *
 * BEHAVIOR:
 * - Primary trigger: Hover - text scrambles while hovering
 * - Secondary trigger: Rare idle glitch (~30-60s, 200-500ms duration)
 * - Respects prefers-reduced-motion (idle glitches disabled)
 *
 * @example
 * ```html
 * <glitch-text text="Principal Reliability Engineer"></glitch-text>
 * <glitch-text text="Chaos mode" intensity="0.8" idle-glitch="false"></glitch-text>
 * ```
 */
@customElement('glitch-text')
export class GlitchText extends LitElement {
  // ============================================
  // PUBLIC API
  // ============================================

  /** The original text to display and glitch */
  @property({ type: String })
  text = '';

  /**
   * Glitch mode:
   * - 'all': Glitches every character randomly
   * - 'word': Glitches one random word at a time
   * - 'character': Glitches specific character types
   */
  @property({ type: String })
  mode: 'all' | 'word' | 'character' = 'all';

  /**
   * Character types to glitch (only used when mode='character')
   * - 'vowels': a, e, i, o, u
   * - 'consonants': All other letters
   * - 'numbers': 0-9
   * - 'punctuation': .,!?;:'"()- etc.
   */
  @property({ type: String, attribute: 'character-type' })
  characterType?: 'vowels' | 'consonants' | 'numbers' | 'punctuation';

  /**
   * How aggressive the glitch is (0.0 to 1.0)
   * - 0.0 = no glitching
   * - 0.3 = moderate (default)
   * - 1.0 = maximum chaos
   */
  @property({ type: Number })
  intensity = 0.3;

  /**
   * Delay before glitch starts on hover (in ms)
   * Prevents glitching on accidental mouse-overs
   */
  @property({ type: Number, attribute: 'hover-delay' })
  hoverDelay = 100;

  /**
   * Enable rare idle glitches (~30-60 seconds apart)
   * Adds life without becoming annoying
   */
  @property({ type: Boolean, attribute: 'idle-glitch' })
  idleGlitch = true;

  /**
   * Average time between idle glitches (ms)
   * Actual timing randomized ±15s around this value
   */
  @property({ type: Number, attribute: 'idle-interval' })
  idleInterval = 45000;

  // ============================================
  // INTERNAL STATE
  // ============================================

  /** The currently displayed text (may be glitched) */
  @state()
  private displayText = '';

  /** Whether glitch animation is currently running */
  @state()
  private isGlitching = false;

  // ============================================
  // CONFIGURATION
  // ============================================

  private config = {
    updateInterval: 50, // 20fps
    maxIterations: 20,
    currentIteration: 0,
    glitchChance: 0.3,
  };

  private rafId?: number;
  private lastUpdate = 0;
  private hoverTimeout?: number;
  private idleTimer?: number;
  private briefGlitchTimer?: number;
  private intersectionObserver?: IntersectionObserver;
  private isVisible = false;
  private prefersReducedMotion = false;
  private isMobile = false;

  // ============================================
  // CHARACTER SETS
  // ============================================

  /**
   * Glitch character set
   *
   * Combines digital blocks, katakana, math symbols, and organic wave forms
   * to represent multiplicity - both digital precision and organic fluidity
   */
  private readonly glitchCharacters = {
    blocks: '█▓▒░▀▄▌▐',
    symbols: '!@#$%^&*',
    katakana: 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘ',
    math: '∀∂∃∅∆∇∈∞∿≈∼',
    // Combined set for randomization
    all: '█▓▒░ﾊﾐﾋｰｳｼ∀∂∃∅∆∇∈∞∿≈!@#$%',
  };

  /**
   * Character type matchers for mode='character'
   */
  private readonly characterMatchers = {
    vowels: /[aeiouAEIOU]/,
    consonants: /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/,
    numbers: /[0-9]/,
    punctuation: /[.,!?;:'"()-]/,
  };

  // ============================================
  // LIFECYCLE
  // ============================================

  connectedCallback() {
    super.connectedCallback();

    this.displayText = this.text;
    this.detectDeviceCapabilities();
    this.applyDeviceOptimizations();
    this.setupIntersectionObserver();
    this.scheduleIdleGlitch();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.fullCleanup();
    this.intersectionObserver?.disconnect();
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('text')) {
      this.displayText = this.text;
    }
    if (changedProperties.has('intensity')) {
      this.config.glitchChance = this.intensity;
    }
  }

  // ============================================
  // DEVICE DETECTION & OPTIMIZATION
  // ============================================

  private detectDeviceCapabilities() {
    // Use feature detection instead of user-agent sniffing
    const hasHover = window.matchMedia('(hover: hover)').matches;
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    this.isMobile = !hasHover || hasCoarsePointer || window.innerWidth < 768;

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private applyDeviceOptimizations() {
    if (this.prefersReducedMotion) {
      this.config.updateInterval = Infinity;
      this.config.maxIterations = 5;
    } else if (this.isMobile) {
      this.config.updateInterval = 100;
      this.config.maxIterations = 15;
      this.config.glitchChance = Math.min(0.2, this.intensity);
    } else {
      this.config.updateInterval = 50;
      this.config.maxIterations = 20;
      this.config.glitchChance = this.intensity;
    }
  }

  // ============================================
  // INTERSECTION OBSERVER
  // ============================================

  private setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (!this.isVisible && this.isGlitching) {
            this.stopGlitch();
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Guard against component being disconnected before updateComplete resolves
    this.updateComplete.then(() => {
      if (this.isConnected) {
        this.intersectionObserver?.observe(this);
      }
    });
  }

  // ============================================
  // GLITCH LOGIC
  // ============================================

  /**
   * Main animation loop using requestAnimationFrame
   * Throttled to target frame rate for performance
   */
  private glitchLoop = (timestamp: number) => {
    if (timestamp - this.lastUpdate < this.config.updateInterval) {
      this.rafId = requestAnimationFrame(this.glitchLoop);
      return;
    }

    this.lastUpdate = timestamp;
    this.updateGlitch();
    this.config.currentIteration++;

    if (this.config.currentIteration >= this.config.maxIterations) {
      this.stopGlitch();
      return;
    }

    this.rafId = requestAnimationFrame(this.glitchLoop);
  };

  /**
   * Update the glitched text based on mode
   */
  private updateGlitch() {
    switch (this.mode) {
      case 'all':
        this.glitchAll();
        break;
      case 'word':
        this.glitchWord();
        break;
      case 'character':
        this.glitchCharacterType();
        break;
    }
  }

  /**
   * Glitch all characters randomly
   */
  private glitchAll() {
    this.displayText = this.text
      .split('')
      .map((char) => {
        if (char === ' ') return ' ';
        if (Math.random() < this.config.glitchChance) {
          return this.randomGlitchChar();
        }
        return char;
      })
      .join('');
  }

  /**
   * Glitch one random word at a time
   */
  private glitchWord() {
    const words = this.text.split(' ');
    const targetWordIndex = Math.floor(Math.random() * words.length);

    this.displayText = words
      .map((word, index) => {
        if (index === targetWordIndex) {
          return word
            .split('')
            .map(() => this.randomGlitchChar())
            .join('');
        }
        return word;
      })
      .join(' ');
  }

  /**
   * Glitch specific character types
   */
  private glitchCharacterType() {
    if (!this.characterType) {
      this.glitchAll();
      return;
    }

    const matcher = this.characterMatchers[this.characterType];

    this.displayText = this.text
      .split('')
      .map((char) => {
        if (matcher.test(char) && Math.random() < this.config.glitchChance) {
          return this.randomGlitchChar();
        }
        return char;
      })
      .join('');
  }

  /**
   * Get a random glitch character from the combined set
   */
  private randomGlitchChar(): string {
    const charSet = this.glitchCharacters.all;
    return charSet[Math.floor(Math.random() * charSet.length)];
  }

  // ============================================
  // PUBLIC METHODS
  // ============================================

  /** Start glitching (can be called programmatically) */
  startGlitch() {
    if (this.rafId) return;
    if (!this.isVisible) return;
    if (this.prefersReducedMotion && this.config.updateInterval === Infinity) return;

    this.config.currentIteration = 0;
    this.isGlitching = true;
    this.rafId = requestAnimationFrame(this.glitchLoop);
  }

  /** Stop glitching (can be called programmatically) */
  stopGlitch() {
    this.cleanup();
    this.displayText = this.text;
  }

  // ============================================
  // IDLE GLITCH
  // ============================================

  /**
   * Schedule the next idle glitch
   *
   * THEORETICAL GROUNDING:
   * Rare idle glitches add "life" to the text - the occasional unexpected
   * glitch represents identity's refusal to stay fixed even at rest.
   * This creates surprise without becoming a pattern users consciously notice.
   */
  private scheduleIdleGlitch() {
    // Don't schedule if disabled or user prefers reduced motion
    if (!this.idleGlitch || this.prefersReducedMotion) return;

    // Clear any existing timer
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }

    // Randomize: ±15 seconds around idleInterval (30-60s default)
    const delay = this.idleInterval + (Math.random() - 0.5) * 30000;

    this.idleTimer = window.setTimeout(() => {
      // Only glitch if visible and not already glitching
      if (this.isVisible && !this.isGlitching) {
        this.triggerBriefGlitch();
      }
      // Reschedule for next idle glitch
      this.scheduleIdleGlitch();
    }, delay);
  }

  /**
   * Trigger a brief glitch (200-500ms) then return to stable
   */
  private triggerBriefGlitch() {
    this.startGlitch();

    // Clear any existing brief glitch timer
    if (this.briefGlitchTimer) {
      clearTimeout(this.briefGlitchTimer);
    }

    // Brief duration: 200-500ms randomized
    const duration = 200 + Math.random() * 300;
    this.briefGlitchTimer = window.setTimeout(() => {
      this.stopGlitch();
      this.briefGlitchTimer = undefined;
    }, duration);
  }

  // ============================================
  // CLEANUP
  // ============================================

  private cleanup() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = undefined;
    }
    // Note: We don't clear idleTimer here - it should persist across glitch cycles
    this.isGlitching = false;
  }

  /**
   * Full cleanup including idle timer (called on disconnect)
   */
  private fullCleanup() {
    this.cleanup();
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = undefined;
    }
    if (this.briefGlitchTimer) {
      clearTimeout(this.briefGlitchTimer);
      this.briefGlitchTimer = undefined;
    }
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  private handleMouseEnter() {
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);

    this.hoverTimeout = window.setTimeout(() => {
      this.startGlitch();
    }, this.hoverDelay);
  }

  private handleMouseLeave() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = undefined;
    }
    this.stopGlitch();
  }

  private handleTouchStart() {
    this.startGlitch();
  }

  private handleTouchEnd() {
    this.stopGlitch();
  }

  private handleFocus() {
    this.startGlitch();
  }

  private handleBlur() {
    this.stopGlitch();
  }

  private handleKeyDown(e: KeyboardEvent) {
    // Trigger glitch on Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.startGlitch();
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    // Stop glitch when key released
    if (e.key === 'Enter' || e.key === ' ') {
      this.stopGlitch();
    }
  }

  // ============================================
  // STYLES
  // ============================================

  static styles = css`
    :host {
      display: inline;
    }

    .glitch-text {
      cursor: pointer;
      transition: color var(--duration-normal, 0.2s) ease;
      user-select: none;
      -webkit-user-select: none;
      outline: none;
      border-radius: 2px;
    }

    /**
     * ACCESSIBILITY: Focus indicator for keyboard navigation
     */
    .glitch-text:focus-visible {
      outline: 2px solid var(--glitch-cyan, #00ffff);
      outline-offset: 2px;
    }

    /**
     * ACTIVE GLITCH STATE
     * Uses GPU-accelerated transform for performance
     */
    .glitch-text.active {
      color: var(--glitch-magenta, #ff00ff);
      animation: glitch-shake var(--duration-fast, 0.1s) infinite;
      will-change: transform;
    }

    /**
     * SHAKE ANIMATION
     * IMPORTANT: Uses translate() not left/top for GPU acceleration
     */
    @keyframes glitch-shake {
      0%,
      100% {
        transform: translate(0, 0);
      }
      25% {
        transform: translate(-1px, 1px);
      }
      50% {
        transform: translate(1px, -1px);
      }
      75% {
        transform: translate(-1px, -1px);
      }
    }

    /**
     * CHROMATIC ABERRATION
     * 
     * THEORETICAL GROUNDING:
     * Multiple color channels visible simultaneously represent
     * Russell's concept of multiple simultaneous identities.
     */
    .glitch-text.active::before,
    .glitch-text.active::after {
      content: attr(data-text);
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0.7;
      mix-blend-mode: screen;
    }

    .glitch-text.active::before {
      color: var(--glitch-cyan, #00ffff);
      animation: glitch-offset-1 0.3s infinite;
    }

    .glitch-text.active::after {
      color: var(--glitch-magenta, #ff00ff);
      animation: glitch-offset-2 0.4s infinite;
    }

    @keyframes glitch-offset-1 {
      0%,
      100% {
        transform: translate(0, 0);
      }
      33% {
        transform: translate(-2px, 0);
      }
      66% {
        transform: translate(2px, 0);
      }
    }

    @keyframes glitch-offset-2 {
      0%,
      100% {
        transform: translate(0, 0);
      }
      33% {
        transform: translate(2px, 0);
      }
      66% {
        transform: translate(-2px, 0);
      }
    }

    /**
     * ACCESSIBILITY: Reduced Motion
     * Disable animations for users who prefer reduced motion
     */
    @media (prefers-reduced-motion: reduce) {
      .glitch-text.active {
        animation: none;
      }

      .glitch-text.active::before,
      .glitch-text.active::after {
        animation: none;
        transform: none;
      }
    }

    /**
     * MOBILE OPTIMIZATION
     * Disable chromatic aberration on mobile for performance
     */
    @media (max-width: 767px) {
      .glitch-text.active::before,
      .glitch-text.active::after {
        display: none;
      }
    }
  `;

  // ============================================
  // RENDER
  // ============================================

  render() {
    return html`
      <span
        class="glitch-text ${this.isGlitching ? 'active' : ''}"
        data-text=${this.text}
        tabindex="0"
        role="text"
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
        @touchstart=${this.handleTouchStart}
        @touchend=${this.handleTouchEnd}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
        @keydown=${this.handleKeyDown}
        @keyup=${this.handleKeyUp}
        aria-label=${this.text}
      >
        ${this.displayText}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'glitch-text': GlitchText;
  }
}
