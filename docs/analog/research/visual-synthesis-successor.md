# Toward a Unified Visual-Audio Livecoding Environment

## Research Framing

This document outlines a research direction exploring how programming language design
shapes creative expression in live audiovisual performance. The artifact of this
research is a new visual synthesis tool; the contribution is insight into the
relationship between language, liveness, and artistic practice.

---

## Research Questions

### Primary Question

**How do the design choices of a livecoding language shape the creative possibilities
available to performers?**

Livecoding—the practice of writing code as live performance—sits at an unusual
intersection: it is simultaneously programming, improvisation, and composition. The
languages used for livecoding (TidalCycles, Hydra, Sonic Pi, Strudel) are not neutral
tools; their syntax, semantics, and affordances actively shape what performers
create.

### Secondary Questions

1. **Temporal Semantics Across Modalities**

   - TidalCycles represents time through pattern combinators (`fast`, `slow`, `rev`,
     `every`)
   - Hydra represents time implicitly through continuous functions
   - What happens when visual synthesis adopts pattern-based temporal semantics?
   - Can a unified temporal model enable new forms of audiovisual composition?

2. **Type Systems as Creative Constraints**

   - Hydra's JavaScript is dynamically typed; anything chains to anything
   - What if transform types (source → coordinate → color → combine) were enforced?
   - Do type errors become creative friction, or do they guide toward valid
     compositions?

3. **Liveness and Feedback Loops**

   - Hot reload enables "conversational" programming with the machine
   - How fast must feedback be to feel like improvisation vs. editing?
   - What is lost when compilation takes seconds instead of milliseconds?

4. **Embodied Performance and Tooling**
   - How do performers develop muscle memory for visual patterns?
   - What role does the REPL play in live performance vs. studio practice?
   - How do visual and audio performers collaborate when their tools differ?

---

## Context: The Livecoding Landscape

### Current Tools

| Tool          | Domain | Language    | Key Innovation                   |
| ------------- | ------ | ----------- | -------------------------------- |
| TidalCycles   | Audio  | Haskell DSL | Pattern combinators for time     |
| Strudel       | Audio  | JavaScript  | TidalCycles in the browser       |
| Hydra         | Visual | JavaScript  | Modular synth metaphor for video |
| Sonic Pi      | Audio  | Ruby        | Education-focused, accessible    |
| SuperCollider | Audio  | sclang      | Foundation of TidalCycles        |

### The Gap

Hydra is the dominant visual livecoding tool, but it exists in a different conceptual
universe than TidalCycles:

- **Hydra**: Continuous, functional, fragment-shader-based
- **TidalCycles**: Discrete, pattern-based, event-driven

When performers use both together (common in algorave), they are mentally switching
between two incompatible models of time and composition. The tools communicate via
OSC but don't share semantics.

### The Opportunity

A visual synthesis tool built with awareness of TidalCycles' pattern model could:

- Share temporal combinators (`fast`, `slow`, `every` applied to visual transforms)
- React to pattern events, not just audio amplitude
- Enable compositions that are conceptually unified across modalities

---

## Proposed Artifact: A Rust Visual Synthesizer

### Why Rust?

The choice of implementation language is itself a research decision:

1. **Performance enables new forms**

   - WebGL limits Hydra to simple fragment shaders
   - Compute shaders enable particle systems, fluid dynamics, cellular automata
   - Native performance allows installation-scale work (multi-projector,
     high-resolution)

2. **Type system as design material**

   - Rust's type system can encode transform composition rules
   - Invalid chains become compile errors, not runtime glitches
   - The type system becomes part of the creative language

3. **Cross-platform from one codebase**

   - Native application for performance (TidalCycles integration)
   - WASM for browser (Strudel integration)
   - Same semantics in both contexts

4. **Systems programming meets creative coding**
   - Livecoding tools are usually built in dynamic languages
   - What does a livecoding tool look like when built with systems-level control?

### Architecture Sketch

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│         REPL │ Editor Integration │ MIDI Control         │
├─────────────────────────────────────────────────────────┤
│                    Pattern Layer                         │
│     TidalCycles-inspired temporal combinators            │
│     fast() slow() every() rev() applied to visuals       │
├─────────────────────────────────────────────────────────┤
│                   Transform DSL                          │
│     osc() noise() shape() → rotate() kaleid() →          │
│     → color() saturate() → blend() layer() → out()       │
├─────────────────────────────────────────────────────────┤
│                  Shader Compiler                         │
│     DSL chains → WGSL compute/fragment shaders           │
├─────────────────────────────────────────────────────────┤
│                  Render Engine                           │
│     wgpu │ Framebuffers │ Audio FFT │ Pattern Events     │
├─────────────────────────────────────────────────────────┤
│                   Integration                            │
│     OSC (TidalCycles) │ WebSocket (Strudel) │ MIDI       │
└─────────────────────────────────────────────────────────┘
```

### Novel Contributions

1. **Pattern-Based Visual Transforms**

   ```
   // Hypothetical syntax
   osc(40).every(4, |v| v.rotate(0.25)).out()

   // Every 4 cycles, the rotation applies
   // Visual patterns share TidalCycles' temporal model
   ```

2. **Type-Safe Transform Chains**

   ```rust
   // Source → Coord → Color → Combine → Output
   // The type system guides valid compositions

   osc(10)           // Source<Vec4>
     .rotate(0.1)    // Source<Vec4> (coord transform)
     .saturate(1.2)  // Source<Vec4> (color transform)
     .out()          // Output

   // This would be a compile error:
   // saturate(1.2).rotate(0.1) — color before coord
   ```

3. **Unified Temporal Events**

   ```
   // Visual responds to TidalCycles pattern events
   // Not just audio amplitude, but pattern structure

   on_event("bd", |e| osc(e.freq * 10).flash(e.gain))
   ```

---

## Research Methodology

### Practice-Based Research

This project follows practice-based research methodology common in creative
technology:

1. **Build** - Create the tool iteratively, with working prototypes
2. **Use** - Perform with the tool, document the experience
3. **Reflect** - Analyze how the tool shapes creative choices
4. **Revise** - Let insights from practice inform tool design

### Evaluation Approaches

1. **Autoethnography**

   - Document personal creative practice with the tool
   - Compare to practice with existing tools (Hydra, Processing)
   - Identify moments where language design enabled/constrained expression

2. **Community Engagement**

   - Release tool as open source
   - Gather feedback from algorave performers
   - Document adoption patterns and unexpected uses

3. **Comparative Analysis**

   - Create equivalent compositions in Hydra and the new tool
   - Analyze differences in process, not just output
   - Identify what each language makes easy/hard

4. **Performance Studies**
   - Record live performances
   - Analyze code evolution during performance
   - Study how performers develop fluency

---

## Related Work

### Academic

- **McLean, A.** (2014). "Making Programming Languages to Dance to: Live Coding with
  Tidal." — Foundational work on TidalCycles and pattern semantics.

- **Magnusson, T.** (2019). _Sonic Writing: Technologies of Material, Symbolic, and
  Signal Inscriptions._ — Theoretical framework for understanding livecoding
  instruments.

- **Blackwell, A. & Collins, N.** (2005). "The Programming Language as a Musical
  Instrument." — Early articulation of livecoding as performance practice.

- **Rohrhuber, J. et al.** (2018). "Algorithmic Music and the Philosophy of Time." —
  Temporal semantics in livecoding languages.

### Artistic

- **Olivia Jack** — Creator of Hydra; work on networked visual performance
- **Alex McLean** — Creator of TidalCycles; research on pattern languages
- **Zach Lieberman** — Creative coding tools and embodied interfaces
- **TOPLAP** — Livecoding community and manifesto

### Technical

- **hydra-synth** — Browser-based visual synthesis
- **TidalCycles** — Pattern-based audio livecoding
- **Strudel** — JavaScript port of TidalCycles
- **nannou** — Rust creative coding framework
- **wgpu** — Rust WebGPU implementation

---

## Timeline and Milestones

### Phase 1: Foundation (3 months)

- [ ] Core render engine with framebuffer ping-pong
- [ ] Basic transform DSL (osc, noise, rotate, kaleid)
- [ ] Hot reload with graceful error recovery
- [ ] TidalCycles OSC integration

### Phase 2: Language Design (3 months)

- [ ] Pattern combinators for visual transforms
- [ ] Type-safe transform chains
- [ ] WASM build for browser/Strudel
- [ ] Initial performance and documentation

### Phase 3: Research and Iteration (6 months)

- [ ] Extended use in personal practice
- [ ] Community release and feedback
- [ ] Comparative studies with Hydra
- [ ] Paper: language design findings

### Phase 4: Synthesis (3 months)

- [ ] Revised tool based on research insights
- [ ] Documentation of design rationale
- [ ] Final paper/thesis chapter

---

## Why This Matters

Livecoding is a small field, but it asks big questions:

- What is the relationship between code and creativity?
- How do tools shape artistic practice?
- What does it mean to improvise with a programming language?

A new visual synthesis tool is not just engineering—it's a research probe into these
questions. The goal is not to replace Hydra but to explore what becomes possible when
we make different design choices.

The livecoding community is uniquely positioned to study programming-as-expression
because performers are also tool-makers. The feedback loop between using a tool and
building it is unusually tight. This project contributes to that tradition.

---

## Fit with Future Sketches

This project aligns with Future Sketches' interests in:

1. **Toolmaking as research** — Building instruments for creative expression
2. **Performance and liveness** — Tools for improvisation, not just production
3. **Language and notation** — How we represent creative ideas in code
4. **Community and openness** — Tools that enable others

The project is technical enough to demonstrate engineering capability, conceptual
enough to support research writing, and practical enough to be used by real
performers.

---

## Related Research Directions

### Embodied Visual Interfaces

The research questions in this document focus on _language design_—how syntax,
semantics, and type systems shape creative expression. A companion research direction
explores _interface design_: what happens when visual synthesis moves from the laptop
screen to physical hardware?

Rust's systems-level capabilities enable a unique research opportunity. The same core
engine that runs on desktop (via wgpu) and in browsers (via WASM) can cross-compile
to embedded platforms like the Daisy Seed or Teensy. This means:

- A guitarist could control visual synthesis through their pedalboard
- Expression pedals could modulate glitch intensity
- Footswitches could trigger pattern changes
- Audio input could drive visual reactivity

This raises distinct research questions: How do physical constraints (knobs,
switches, small displays) shape creative possibilities? What "visual vocabulary"
emerges from embodied control versus code-based control? How does the feedback loop
of physical gesture → visual response compare to livecoding's conversational
programming?

See: [Unified Visual Synthesis](./unified-visual-synthesis.md)

---

## References

- Blackwell, A., & Collins, N. (2005). The programming language as a musical
  instrument. _PPIG_.
- Collins, N., McLean, A., Rohrhuber, J., & Ward, A. (2003). Live coding in laptop
  performance. _Organised Sound_, 8(3).
- Magnusson, T. (2019). _Sonic Writing_. Bloomsbury Academic.
- McLean, A. (2014). Making programming languages to dance to. _FARM_.
- Rohrhuber, J., de Campo, A., & Wieser, R. (2018). Algorithmic music and the
  philosophy of time. _Oxford Handbook of Algorithmic Music_.
- Russell, L. (2020). _Glitch Feminism: A Manifesto_. Verso.
