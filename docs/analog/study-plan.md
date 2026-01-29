# Study Plan

A 14-week curriculum based on Paul David's Learn Practice Play, with Strudel
integration for algorithmic music exploration.

## Philosophy

The three pillars reinforce each other:

- Theory explains what you hear
- Guitar makes theory physical
- Algorithmic music reveals patterns in both

## Weekly Structure

| Day | Focus                                     |
| --- | ----------------------------------------- |
| Mon | Theory study                              |
| Tue | Guitar practice                           |
| Wed | Strudel/TidalCycles                       |
| Thu | Guitar practice                           |
| Fri | Integration (connect the week's concepts) |
| Sat | Free exploration                          |
| Sun | Journal and reflect                       |

## Strudel Voice Progression

Voices are introduced gradually, building complexity over time:

```
Module 0:  [melody]
Module 1:  [melody] + [pulse]
Module 2:  [melody] + [drums]
Module 3:  [melody] + [drums] + [drone]
Module 4:  [melody] + [drums] + [pedal pattern]
Module 5:  [melody] + [drums] + [moving bass]
Module 6:  [melody] + [drums] + [bass] + [chords] + [recording]
Module 7:  [all layers] + [live coding] + [guitar sampling]
```

## 14-Week Curriculum

### Week 1: Module 0 - Foundations

- **Guitar**: Setup, tuning, reading chord diagrams and tabs
- **Strudel**: Environment setup, mini-notation introduction
- **Integration**: Play notes on guitar, hear them in Strudel

#### Strudel Core

- `note("c d e f g")` - basic mini-notation
- `~` - rests
- `.slow()` and `.fast()` - tempo control

#### Strudel Pieces

- **Educational**: Open strings - code `note("e2 a2 d3 g3 b3 e4")`, play each on
  guitar
- **Playful**: A simple pattern with the open string notes, varying speed

---

### Weeks 2-3: Module 1 - First Chords and Melody

- **Guitar**: Em, Asus2, Am, C, G, D; Em Pentatonic scale; magical four notes melody
- **Theory**: The notes on the fretboard
- **Strudel**: Code the pentatonic scale, simple chord progressions
- **Integration**: Play Em pentatonic on guitar, create variations in Strudel

#### Strudel Core

- `chord("em")` - chord notation
- Sequences of notes and chords
- `.rev()` - reverse patterns

#### Strudel Stretch

- `.sometimes()` - preview of generative thinking (what if a note sometimes doesn't
  play?)

#### Voice Layer: Pulse

A soft, musical pulse on the downbeat to play along with:

```js
s("bd").slow(2); // kick on 1 and 3
```

#### Strudel Pieces

- **Educational**: Em pentatonic scale (`note("e3 g3 a3 b3 d4 e4")`), the six chords
- **Playful**: A progression using Em, Am, C, G with pentatonic melody over pulse

---

### Weeks 4-5: Module 2 - Scales and Blues

- **Guitar**: Major scales, Am Pentatonic, 12-bar blues, Mediterranean I melody
- **Strudel**: 12-bar blues structure, scale sequences, pattern transformations
- **Integration**: Learn blues solo on guitar, code backing track in Strudel

#### Strudel Core

- `< >` - alternation over cycles (essential for 12-bar structure)
- `.transpose()` - move patterns up/down
- Drum samples and patterns

#### Strudel Stretch

- `.degrade()` - randomly drop notes (early generative feel)

#### Voice Layer: Drums

Full drum pattern replaces simple pulse:

```js
stack(s("bd*2"), s("~ sd"), s("hh*4"));
```

#### Strudel Pieces

- **Educational**: 12-bar blues chord structure coded with `< >` alternation
- **Playful**: Full blues backing track with drums - something to solo over

---

### Weeks 6-7: Module 3 - Power and Expression

- **Guitar**: Power chords, E minor blues scale, major chord progressions
- **Theory**: Intervals
- **Strudel**: Interval exploration, power chord riffs, wondrous open strings
- **Integration**: Code interval training exercises

#### Strudel Core

- `.add()` - add intervals to notes (building harmony)
- `.gain()` - dynamics and expression

#### Strudel Stretch

- `.choose()` - pick randomly from options
- `.rand()` - random values

#### Voice Layer: Drone

Static bass note underneath moving parts:

```js
note("e2").slow(4); // pedal tone
```

#### Strudel Pieces

- **Educational**: Interval explorer - hear each interval from a root
- **Playful**: Power chord riff with dynamic variation and drone

---

### Weeks 8-9: Module 4 - Expanding Vocabulary

- **Guitar**: Sus2, Sus4, Cadd9, D, G; C major scale (no open strings)
- **Theory**: Chord construction
- **Strudel**: Suspended chord voicings, melodic sequences
- **Integration**: Andantino melody - play and code

#### Strudel Core

- `:sus2`, `:sus4`, `:add9` - chord voicing suffixes
- `.arp()` - arpeggiation
- `.struct()` - apply rhythmic structure

#### Strudel Stretch

- `.sometimesBy()` - control probability of variations

#### Voice Layer: Pedal Pattern

Drone evolves into a rhythmic pedal pattern:

```js
note("e2 ~ e2 ~").slow(2); // pulsing pedal
```

#### Strudel Pieces

- **Educational**: Sus chord comparison - hear sus2 vs sus4 vs major
- **Playful**: Andantino-style piece with suspended harmonies and arpeggiation

---

### Weeks 10-11: Module 5 - Seventh Chords and Rhythm

- **Guitar**: Am7, Fadd9, Em7, Dsus4; ghost strum; blues in E; improvisation
- **Strudel**: Complex chord voicings, rhythmic patterns, generative solos
- **Integration**: Blues improv over Strudel backing

#### Strudel Core

- `:m7`, `:7`, `:9` - seventh and extended chord voicings
- `.euclid()` - euclidean rhythms
- Generative elements now core: `.rand()`, `.choose()` for improv backing

#### Voice Layer: Moving Bass

Bass becomes independent moving voice:

```js
note("<e2 a2 d2 g2>").slow(4); // root movement
```

#### Strudel Pieces

- **Educational**: 7th chord voicings, euclidean rhythm patterns
- **Playful**: Generative blues jam - backing that's slightly different each time

---

### Weeks 12-13: Module 6 - Advanced Harmony

- **Guitar**: Slash chords, walking bass, palm muting, advanced fingerpicking
- **Theory**: Chords in a key
- **Strudel**: Bass lines, arpeggiation, Mediterranean III, audio capture
- **Integration**: Full arrangement - guitar melody over coded accompaniment

#### Strudel Core

- `stack()` - combine multiple independent voices
- Walking bass line patterns
- **Audio capture**: Recording guitar + Strudel together

#### Strudel Stretch

- `.mask()` - complex pattern manipulation

#### Voice Layer: Full Stack

Three or more independent voices:

```js
stack(
  note("...").s("piano"), // melody
  chord("...").s("pad"), // chords
  note("...").s("bass"), // walking bass
  s("bd sd hh"), // drums
);
```

#### Strudel Pieces

- **Educational**: Voice independence - bass + chords + melody
- **Playful**: Mediterranean III style arrangement to record guitar over

---

### Week 14: Module 7 - Integration

- **Guitar**: Barre chords (I-III), advanced licks, dynamic strumming
- **Theory**: Playing along with songs
- **Strudel**: Live coding techniques, guitar sampling, final composition
- **Integration**: Original piece playable on guitar and expressible in code

#### Strudel Core

- Live pattern manipulation
- Transitioning between patterns smoothly
- Sampling recorded guitar back into Strudel

#### Voice Layer: Everything

Full control over all layers, including captured audio:

```js
stack(
  // all previous voices
  s("guitar_sample").loopAt(4), // your recorded guitar
);
```

#### Strudel Pieces

- **Educational**: Live coding practice - changing patterns on the fly
- **Playful**: Original composition that samples your own guitar playing

---

## Milestones

- **Week 1**: Guitar tuned, Strudel running, first notes played in both
- **Week 3**: All Module 1 chords clean, pentatonic coded with pulse
- **Week 5**: 12-bar blues playable, backing track with drums coded
- **Week 7**: Intervals understood physically and algorithmically
- **Week 11**: Can improvise over generative blues backing
- **Week 13**: First guitar + Strudel recording captured
- **Week 14**: Original composition complete

## Strudel Skills Summary

| Module | Core Functions                         | Stretch Goals          | Voices           |
| ------ | -------------------------------------- | ---------------------- | ---------------- |
| 0      | `note()`, `~`, `.slow()`, `.fast()`    | -                      | melody           |
| 1      | `chord()`, `.rev()`                    | `.sometimes()`         | + pulse          |
| 2      | `< >`, `.transpose()`, samples         | `.degrade()`           | + drums          |
| 3      | `.add()`, `.gain()`                    | `.choose()`, `.rand()` | + drone          |
| 4      | `:sus2`/`:sus4`, `.arp()`, `.struct()` | `.sometimesBy()`       | pedal pattern    |
| 5      | `:m7`/`:9`, `.euclid()`, generative    | -                      | + moving bass    |
| 6      | `stack()`, walking bass, recording     | `.mask()`              | full stack       |
| 7      | live coding, sampling                  | -                      | + guitar samples |

## Beyond the Curriculum

After completing the 14-week foundation, the path opens toward live performance and
full production. The pattern thinking and musical vocabulary transfer directly - what
changes is the tooling.

### Phase 1: Transition to TidalCycles

**Why transition**: SuperCollider's audio engine is studio-grade. Better MIDI clock
sync with DAWs. More headroom for complex arrangements. The algorave community
standard.

**What transfers directly**:

- Mini-notation (`note("c d e")`, `< >`, `*`, `/`)
- Pattern functions (`.slow()`, `.fast()`, `.rev()`, `.euclid()`)
- Compositional thinking (voices, layers, generative approaches)

**What's new to learn**:

- Haskell syntax (the wrapping around patterns)
- SuperCollider/SuperDirt (the audio engine)
- Editor setup (VS Code, Pulsar, or vim with Tidal plugins)

**Syntax comparison**:

```js
// Strudel
note("c3 e3 g3").slow(2).gain(0.8)

// TidalCycles
d1 $ note "c3 e3 g3" # s "superpiano" # slow 2 # gain 0.8
```

**Installation**: Requires Haskell (ghcup), SuperCollider, and SuperDirt. More
complex than Strudel but well-documented.

### Phase 2: SuperCollider Deep Dive

SuperCollider is both the audio engine for TidalCycles and a powerful tool in its own
right.

**Key capabilities**:

- Live audio processing (run guitar through effects)
- Custom synthesizers (design your own sounds)
- Real-time sampling and manipulation
- Granular synthesis (Portishead-style texture)

**Learning path**:

1. Use SuperDirt (Tidal's interface) first - don't dive into SC immediately
2. Learn to add custom samples to SuperDirt
3. Explore SC effects processing for live guitar
4. Eventually: build custom SynthDefs for unique sounds

### Phase 3: Hydra for Live Visuals

Hydra is a browser-based live coding visual synthesizer that pairs beautifully with
TidalCycles.

**How it works**:

- Runs in browser (like Strudel)
- TidalCycles sends OSC messages to Hydra
- Visuals react to your musical patterns
- Can also be coded independently

**Example Hydra code**:

```js
osc(10, 0.1, 1.2).color(1, 0.5, 0.8).rotate(0.1).out();
```

**Setup**: TidalCycles → OSC → Hydra. Both can run on same machine or separate
(performer laptop + visuals laptop).

### Phase 4: Live Performance Stack

The full performance rig for guitar + algorave:

```
┌─────────────────────────────────────────────────────────┐
│                    PERFORMANCE SETUP                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Guitar ──→ Audio Interface ──→ SuperCollider            │
│                    │                  │                  │
│                    │                  ▼                  │
│                    │           Effects/Looping           │
│                    │                  │                  │
│                    ▼                  ▼                  │
│              DAW (record) ←── Main Mix ──→ PA            │
│                    ▲                  ▲                  │
│                    │                  │                  │
│  TidalCycles ──────┴──────────────────┘                  │
│       │                                                  │
│       └──→ OSC ──→ Hydra ──→ Projector                   │
│                                                          │
│  MIDI Foot Controller ──→ Tidal (hands-free control)     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Key components**:

- **Audio interface**: Guitar input + main output (Focusrite, MOTU, etc.)
- **MIDI foot controller**: Trigger patterns, control loops while playing guitar
- **Looper**: Hardware (Boss RC-505) or software (Ableton, SuperCollider)
- **Projector/screen**: For Hydra visuals

**Performance modes**:

1. **Guitar over backing**: Tidal plays, you solo
2. **Live looping**: Capture guitar phrases, layer with Tidal
3. **Full live coding**: Guitar down, code live, pick up guitar
4. **Hybrid**: Code with one hand, play with the other (advanced!)

### Phase 5: Production Workflow

For studio recording and Portishead-style sample manipulation:

**Recording chain**:

```
TidalCycles ──→ Audio Interface ──→ DAW (stems)
Guitar ────────→ Audio Interface ──→ DAW (separate track)
```

**Sample workflow** (Portishead approach):

1. Record guitar + Tidal sessions (capture happy accidents)
2. Chop interesting moments into samples
3. Load samples back into TidalCycles/Strudel
4. Manipulate algorithmically (`.chop()`, `.slice()`, `.loopAt()`)
5. Record new arrangements
6. Mix in DAW
7. Master (iZotope Ozone, or dedicated mastering)

**DAW integration options**:

- **Ableton Live**: Strong MIDI sync, good for hybrid workflow
- **Reaper**: Lightweight, flexible routing, affordable
- **Bitwig**: Built-in modular, good for experimental work
- **Logic**: If already in Apple ecosystem

**TidalCycles in DAW**:

- Send MIDI from Tidal to DAW instruments
- Record Tidal audio output as stems
- Use DAW for final arrangement and mixing
- Tidal for generative composition, DAW for polish

### Suggested Timeline (Post-Curriculum)

| Months | Focus                                       |
| ------ | ------------------------------------------- |
| 1-2    | TidalCycles setup, translate Strudel pieces |
| 3-4    | SuperCollider basics, custom samples        |
| 5-6    | Hydra integration, first live performance   |
| 7-9    | Production workflow, first recordings       |
| 10-12  | Refine live set, release music              |

This is flexible - follow your interest. Some weeks you'll want to perform, others
you'll want to produce. The foundation from the 14-week curriculum supports both.

## Resources

- Learn Practice Play: https://learnpracticeplay.com
- Strudel: https://strudel.cc
- Strudel Tutorial: https://strudel.cc/learn
- TidalCycles: https://tidalcycles.org
- TidalCycles Tutorial: https://tidalcycles.org/docs/
- SuperCollider: https://supercollider.github.io
- Hydra: https://hydra.ojack.xyz
- Hydra Book: https://hydra-book.glitch.me
- Algorave: https://algorave.com
