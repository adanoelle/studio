# Unified Visual Synthesis: One Engine, Many Interfaces

## Research Framing

This document explores a joint software + hardware research endeavor: building a
visual synthesis platform that serves radically different performance contexts
through a shared core engine. The question isn't simply "embodied vs code" but rather
**how do different interfaces shape the same underlying visual engine?**

The goal is to bridge communities that rarely overlap—algorave livecoders, club DJs,
guitarists, and modular synth artists—through shared tools that preserve each
community's creative idioms while enabling new collaborations.

**Core insight:** The pattern/transform logic doesn't need to know about the
interface. A `Pattern<Transform>` could be:

- Written in code (livecoder)
- Mapped from MIDI (DJ)
- Controlled by knobs (guitarist)
- Triggered by CV (modular synth artist)

One engine, many interfaces.

---

## The Platform Question

### Primary Question

How can a single visual synthesis engine serve radically different performance
contexts—from livecoding REPLs to guitar pedalboards to Eurorack modules—while
preserving creative expressiveness in each?

### Secondary Questions

1. **Translation fidelity:** When a livecoder's composition becomes a hardware
   preset, what's preserved? What's lost?

2. **Bidirectional authoring:** Can physical gestures be "recorded" as pattern code?
   Can hardware become an input device for livecoding?

3. **Latency profiles:** Livecoding tolerates ~100ms. Hardware demands <10ms. How
   does one engine serve both?

4. **Community bridging:** Algorave and modular synth communities rarely overlap. Can
   shared tools create new collaborations?

---

## Why Rust Enables This

Rust's unique combination of characteristics makes it the right foundation for a
cross-platform visual synthesis engine:

### Memory Safety Without Runtime

The `no_std` subset of Rust runs on bare metal microcontrollers with the same memory
safety guarantees as desktop applications. No garbage collector pauses, no runtime
overhead—just predictable, deterministic execution.

### Cross-Compilation Story

A single codebase compiles to:

- **Native binaries** (Linux, macOS, Windows) via standard cargo
- **WebAssembly** for browser integration (Strudel, web-based tools)
- **ARM Cortex-M** for embedded hardware (Daisy Seed, Teensy)
- **RISC-V** for emerging embedded platforms

The same pattern library, the same transform DSL, running everywhere.

### Zero-Cost Abstractions

High-level constructs like iterators, traits, and generics compile to the same
efficient code you'd write by hand in C. This matters when you have 16ms (or less)
per frame on constrained hardware.

### Ecosystem for AV Work

- **wgpu:** Modern, cross-platform GPU abstraction
- **cpal:** Cross-platform audio I/O
- **embedded-hal:** Hardware abstraction for microcontrollers
- **nom/pest:** Parser combinators for DSL implementation

---

## Architecture: Shared Core, Multiple Interfaces

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Core Engine (no_std Rust)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Patterns   │  │ Transforms  │  │  Render Pipeline    │  │
│  │  (temporal) │  │   (DSL)     │  │  (framebuffer ops)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     Interface Layer                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Livecode │ │   DJ     │ │  Pedal   │ │   Eurorack     │  │
│  │  (REPL)  │ │ (MIDI)   │ │ (knobs)  │ │   (CV/gate)    │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     Output Layer                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │  wgpu    │ │  WebGPU  │ │ SPI LCD  │ │  CV output     │  │
│  │ (native) │ │  (WASM)  │ │(embedded)│ │  (triggers)    │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Interface Abstraction

The key insight is that all interfaces map to the same parameter space:

```rust
// Pattern is a function of time and parameters
// Interface determines HOW params are set, not WHAT they mean
trait Pattern {
    fn sample(&self, time: f32, params: &Parameters) -> Frame;
}

// Events from any source map to the same trigger system
enum Event {
    NoteOn { pitch: u8, velocity: u8 },  // MIDI, livecode
    Gate { high: bool },                   // Eurorack CV
    Footswitch { index: u8 },              // Guitar pedal
    Tap { x: f32, y: f32 },                // Touch interface
}
```

This abstraction means:

- A livecoder writes `pattern.intensity = sine(time * 0.5)`
- A guitarist turns a knob that sets `pattern.intensity`
- A modular patch sends CV that modulates `pattern.intensity`
- The engine doesn't care which—it just renders.

---

## Interface Profiles

### The Livecoder

**Context:** Algorave, laptop performance, Strudel/TidalCycles integration

**Interface:**

- REPL with live code evaluation
- Text editor with hot reload
- OSC messages from audio tools (SuperCollider, Sonic Pi)

**Latency tolerance:** ~100ms acceptable

- Code evaluation is inherently bursty
- Visual changes can lag audio slightly

**Expressiveness:** Full DSL access

- Infinite parameter space
- Arbitrary computation
- Generative algorithms
- Time-based patterns with full temporal control

**Feedback:**

- Visual output (projected, streamed)
- Code state (current definitions, errors)
- Pattern visualization (structure, timing)

**Workflow considerations:**

- Iterative refinement during performance
- Copy/paste, version control friendly
- Shareable as text

### The DJ

**Context:** Club, festival, AV performance

**Interface:**

- MIDI controllers (Akai, Novation, Native Instruments)
- CDJ integration
- Ableton Live with visual plugins
- Hardware mixer with MIDI out

**Latency tolerance:** ~20ms for tight sync

- Must feel "locked" to the beat
- Fader movements should be immediate

**Expressiveness:** Mapped parameters

- 8-16 knobs/faders typically
- Scenes and presets
- Smooth transitions (crossfader)
- Beat-synced effects

**Feedback:**

- Visual output (LED walls, projectors)
- Controller LEDs/displays
- Ableton clip colors

**Workflow considerations:**

- Preparation before performance (preset building)
- Real-time scene switching
- BPM sync essential

### The Guitarist

**Context:** Live band performance, solo shows

**Interface:**

- Pedal enclosure (knobs, footswitches)
- Expression pedal (continuous control)
- Audio input (for reactivity)

**Latency tolerance:** <10ms for feel

- Must feel like part of the instrument
- Footswitch response must be instant

**Expressiveness:** Limited but intentional

- 4-6 knobs maximum
- 2-4 footswitches
- 1-2 expression inputs
- Audio envelope following

**Feedback:**

- Small OLED (preset name, parameter values)
- LED indicators (on/off, mode)
- Projected output (if available)

**Workflow considerations:**

- Preset-based (stored on device)
- Hands occupied—feet control flow
- Dark stage conditions

### The Modular Artist

**Context:** Eurorack/modular synth setup, generative installations

**Interface:**

- CV inputs (0-10V, -5V to +5V)
- Gate/trigger inputs
- Clock input (external sync)
- Patch cables as interface

**Latency tolerance:** <1ms for tight sync

- Must track audio-rate modulation
- Clock jitter must be minimal

**Expressiveness:** Voltage-controlled everything

- Continuous modulation of all parameters
- Clock division/multiplication
- Envelope following
- Random/chaotic sources

**Feedback:**

- Visual output synced to patch
- LEDs showing activity
- Visual becomes part of the patch (not separate)

**Workflow considerations:**

- Patching is the composition
- Generative/evolving over time
- Integration with audio modular

---

## Hardware Landscape

| Platform                | Context             | Interface        | Rust Support     | Notes                         |
| ----------------------- | ------------------- | ---------------- | ---------------- | ----------------------------- |
| Desktop (Linux/Mac/Win) | Livecoding          | REPL + OSC       | Native wgpu      | Primary development platform  |
| Browser                 | Strudel integration | WebSocket        | WASM + WebGPU    | Reach + accessibility         |
| Daisy Seed              | Pedal, Eurorack     | ADC, GPIO, audio | embassy-rs       | 480MHz Cortex-M7, audio codec |
| Teensy 4.1              | Pedal, MIDI host    | USB MIDI, ADC    | Community crates | 600MHz, USB host capable      |
| Raspberry Pi Pico       | Low-cost pedal      | ADC, GPIO        | embassy-rs       | $4, dual-core, PIO            |
| Bela                    | Ultra-low-latency   | Audio + GPIO     | C FFI            | <1ms audio latency            |
| ESP32-S3                | WiFi-enabled pedal  | ADC, WiFi, BLE   | esp-rs           | Remote control capable        |

### Hardware Selection Criteria

For embedded platforms, key considerations:

1. **Processing power:** Can it render at target frame rate?
2. **Display interface:** SPI (slow), parallel (fast), HDMI (complex)
3. **Input capabilities:** ADC resolution, input count
4. **Audio integration:** Built-in codec? External DAC?
5. **Rust ecosystem:** Mature HAL? Active community?

---

## Cross-Interface Scenarios

### Scenario 1: Studio to Stage

A livecoder develops visual compositions on their laptop during studio sessions. The
code evolves over weeks—generative patterns, carefully tuned parameters, complex
temporal structures.

For a live show, they collaborate with a guitarist who doesn't code. The livecoder
"compiles" their composition to pedal presets:

- Complex patterns become curated parameter ranges
- Time-based variations become expression pedal mappings
- Generative elements become constrained randomness

The guitarist performs with physical controls, but the livecoder can override
parameters via OSC from a tablet. The collaboration bridges both workflows.

**What's preserved:** Visual aesthetic, core patterns, overall feel **What's lost:**
Infinite parameter space, arbitrary computation, live code changes

### Scenario 2: Modular Driving Visuals

A modular synth patch generates the visual composition:

- **Clock** from the sequencer sets the visual tempo
- **Gates** from the rhythm section trigger scene changes
- **CV** from oscillators and envelopes modulates visual parameters
- **Audio** feeds back into the visual via envelope following

The visuals become part of the patch—not a separate system being "driven" but an
integrated voice. Patching a cable changes both sound and image simultaneously.

**Key insight:** The visual engine must speak voltage. It must be patchable in the
same way audio modules are patchable.

### Scenario 3: DJ + VJ Unified

A DJ uses Ableton Live with a Novation Launch Control. Currently, audio effects and
visuals are separate—different software, different mappings, different workflows.

With unified tools:

- Fader 1 controls both filter cutoff AND visual blur
- Knob 3 controls both reverb size AND pattern scale
- Scene buttons trigger both audio clip changes AND visual presets

The AV performance becomes a single instrument. This is already possible with
extensive MIDI routing, but having audio-reactive visuals and shared parameter spaces
built in changes the creative possibilities.

### Scenario 4: Bidirectional Authoring

During soundcheck, a guitarist experiments with the expression pedal, finding a
particular gesture that works well with a visual pattern. This gesture—the sweep, the
hesitation, the return—is recorded as automation data.

Later, this automation exports as pattern code:

```rust
// Recorded from expression pedal, 2024-01-15 soundcheck
fn soundcheck_gesture(t: f32) -> f32 {
    // Captured timing and values
    interpolate(&[
        (0.0, 0.2), (0.3, 0.8), (0.5, 0.75),
        (0.8, 0.9), (1.2, 0.3), (1.5, 0.2)
    ], t)
}
```

A livecoder can now refine this gesture—add variations, generative elements, temporal
transformations. The refined version loads back to the pedal as a more complex preset
that "remembers" the original gesture while extending it.

**Key insight:** Hardware can be an input device for code, not just a playback
device.

---

## Research Methodology

### Practice-Based Research

1. **Build prototypes** for each interface type

   - Desktop REPL (first, for iteration speed)
   - MIDI controller mapping (validates interface abstraction)
   - Hardware pedal (tests embedded constraints)
   - Eurorack module (tests CV/timing requirements)

2. **Use in personal practice** across contexts

   - Livecoding sessions (algorave style)
   - Band rehearsals (guitar pedal)
   - Studio sessions (modular integration)
   - DJ sets (MIDI controller)

3. **Document how interface shapes creative choices**

   - What patterns emerge with knobs vs code?
   - How does latency affect compositional decisions?
   - What's easy/intuitive in each context?

4. **Iterate based on embodied experience** in each context
   - Theory informs design
   - Practice reveals gaps
   - Gaps refine theory

### Comparative Analysis

Take a single visual composition and control it via each interface:

| Aspect             | Livecode   | MIDI        | Pedal      | CV         |
| ------------------ | ---------- | ----------- | ---------- | ---------- |
| Parameter access   | All        | Mapped 8-16 | 4-6        | Patched    |
| Temporal precision | Code loops | Quantized   | Gesture    | Continuous |
| Exploration style  | Variation  | Preset      | Knob sweep | Patch      |
| Learning curve     | High       | Medium      | Low        | Medium     |

### Community Engagement

**Algorave (TOPLAP, Strudel Discord)**

- Share WASM builds for Strudel integration
- Collaborate on DSL design
- Present at algorave events

**Modular (ModWiggler, Lines)**

- Discuss CV integration approaches
- Share Eurorack module designs
- Engage with hardware DIY community

**Guitar Pedals (Hologram, DIY builders)**

- Discuss pedal ergonomics
- Share embedded Rust approaches
- Engage with DIY pedal forums

**Cross-Community**

- Facilitate collaborations (livecoder + guitarist)
- Document bridging workflows
- Create tutorials for each community

---

## Timeline

### Phase 1: Core Engine

- [ ] `no_std` pattern/transform library
  - Temporal patterns (LFO, envelope, sequence)
  - Spatial transforms (translate, rotate, scale)
  - Composable operations
- [ ] Desktop renderer (wgpu)
  - Basic framebuffer operations
  - Shader pipeline
  - Window management
- [ ] Basic livecoding REPL
  - Hot reload
  - Error handling
  - State inspection

### Phase 2: Interface Diversity

- [ ] WASM build for browser/Strudel
  - WebGPU rendering
  - WebSocket for OSC-style messages
  - Integration examples
- [ ] MIDI input handling
  - Controller mapping
  - Learn mode
  - Preset management
- [ ] Embedded build (Daisy Seed)
  - `no_std` validation
  - Display driver (SPI LCD)
  - ADC reading
- [ ] Basic pedal prototype
  - Enclosure design
  - Knob/switch layout
  - Expression pedal input

### Phase 3: Cross-Interface

- [ ] Preset format that works across interfaces
  - Serialization
  - Parameter mapping metadata
  - Version compatibility
- [ ] Parameter mapping abstraction
  - Range scaling
  - Curve types
  - MIDI learn
- [ ] Bidirectional authoring experiments
  - Gesture recording
  - Code export
  - Refinement workflow

### Phase 4: Community & Research

- [ ] Open source release
  - Documentation
  - Examples for each interface
  - Contribution guidelines
- [ ] Cross-community workshops
  - "Livecoding for guitarists"
  - "Modular visuals"
  - Collaboration facilitation
- [ ] Paper/presentation
  - Document findings
  - Interface-agnostic synthesis thesis
  - Future directions

---

## References

### Creative Coding & Livecoding

- TOPLAP Manifesto (https://toplap.org/wiki/ManifestoDraft)
- Strudel documentation (https://strudel.cc)
- TidalCycles documentation
- Collins, N. et al. "Live Coding in Laptop Performance" (2003)

### Hardware & Protocols

- Ableton Link protocol specification
- Eurorack voltage standards (+/-12V, 1V/oct, gate thresholds)
- MIDI 2.0 specification
- CV/Gate conventions in modular synthesis

### Rust Ecosystem

- wgpu documentation (https://wgpu.rs)
- embassy-rs for embedded async (https://embassy.dev)
- esp-rs for ESP32 (https://esp-rs.github.io/book/)

### Related Projects

- Hydra (https://hydra.ojack.xyz) - browser-based visual synth
- Lumen (video synth with livecoding)
- Critter & Guitari video synths
- Hypno by Sleepy Circuits (Eurorack video synth)

### Academic

- Magnusson, T. (2019). _Sonic Writing_. Bloomsbury Academic.
- Jordà, S. (2005). "Digital Lutherie" — Designing digital musical instruments
- NIME Conference proceedings — New Interfaces for Musical Expression
- McLean, A. (2014). "Making Programming Languages to Dance to"

### Theoretical

- Russell, Legacy. _Glitch Feminism: A Manifesto_ (2020)
- Lugones, Maria. "Playfulness, 'World'-Travelling, and Loving Perception" (1987)
- Haraway, Donna. "A Cyborg Manifesto" (1985)
