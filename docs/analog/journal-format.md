# Journal Format

A digital magazine in 8 chapters, documenting the parallel study of guitar,
algorithmic music, and music theory.

## Publication Structure

This is not a blog. It is a finite publication with a beginning, middle, and end.

- **8 modules = 8 chapters**
- **14 weeks of content**
- **Each chapter = multiple spreads** (essays, code, visuals, exercises)
- **Epilogue** - Beyond the Curriculum (transition to TidalCycles, production, performance)

Every spread is a considered composition, manually laid out.

## Content Philosophy

### Mini Essays

Short-form writing on a singular topic. Characteristics:

- **Focused** - One concept, one thought, one question
- **Freewritten** - No editing, no self-censorship
- **Vulnerable** - Captures understanding as it exists now, not as you wish it were
- **Ephemeral** - May or may not relate to surrounding code/visuals
- **Variable length** - As long as the thought requires

Topics can be conceptual, technical, personal, or tangential. They need not relate
to the music content on the same page. A thought can exist in proximity without
being in service.

### Retrospectives

Later additions that respond to original essays:

- **Dialogue across time** - Present self in conversation with past self
- **Clarifications** - What you now understand differently
- **Corrections** - Where you were wrong (marked distinctly)
- **The original stands** - Never edited, always preserved as artifact

Retrospectives can be added at any time - end of week, end of module, or whenever
understanding shifts.

### Artifact of Learning

The journal captures process, not polish:

- The confusion
- The partial grasp
- The "I think this is how it works" moment
- The gaps in understanding made visible

This is more honest and more useful than showing only refined knowledge.

## Entry Frontmatter

```yaml
---
date: 2024-01-15
module: 1
week: 3
title: "Intervals on the Fretboard"
concepts:
  - minor thirds
  - major thirds
  - interval shapes
recordings:
  - intervals-practice.mp3
strudel:
  - thirds-pattern.txt
---
```

## Required Fields

| Field    | Type   | Description              |
| -------- | ------ | ------------------------ |
| `date`   | date   | Entry date (YYYY-MM-DD)  |
| `module` | number | Curriculum module (0-7)  |
| `week`   | number | Curriculum week (1-14)   |
| `title`  | string | Descriptive title        |

## Optional Fields

| Field          | Type     | Description                  |
| -------------- | -------- | ---------------------------- |
| `concepts`     | string[] | Theory concepts covered      |
| `recordings`   | string[] | Audio file references        |
| `strudel`      | string[] | Code snippet references      |
| `guitar-focus` | string   | Specific technique practiced |
| `breakthrough` | boolean  | Mark significant insights    |
| `essays`       | string[] | Mini essay references        |

## Content Types

### Mini Essay

```markdown
<mini-essay date="2024-01-15">

What does it mean to "hear" an interval? I can identify a minor third on paper -
three semitones, C to Eb - but when I play it on guitar, I'm not sure I'm hearing
the interval or just recognizing the finger pattern. Is that the same thing?

Maybe the physical and the auditory are more connected than I'm giving credit for.
The shape *is* the sound, at least for now.

</mini-essay>
```

### Retrospective

```markdown
<retrospective date="2024-02-20" references="2024-01-15">

Reading this back after a month with intervals. I was right that "the shape is the
sound" - this is actually how guitarists often think, and it's valid. But I was
underestimating my own hearing. <quote>I'm not sure I'm hearing the interval</quote>
- I was, I just didn't trust it yet.

<correction>The real gap wasn't hearing vs. pattern recognition. It was confidence
in my own perception.</correction>

</retrospective>
```

### Theory Section

What concepts were studied. Keep it concrete:

```markdown
## Theory

Today: minor and major thirds.

- Minor third = 3 semitones (C to Eb)
- Major third = 4 semitones (C to E)
- On guitar: minor third is 3 frets, major third is 4 frets on same string
```

### Guitar Practice

What was physically practiced:

```markdown
## Guitar

Practiced finding thirds from any note on strings 5 and 6.

Starting note → minor third (3 frets up) → major third (4 frets up)

<fretboard-diagram scale="thirds-from-A" position="5"></fretboard-diagram>

Struggled with: quickly identifying whether a third is major or minor by ear.
```

### Algorithmic Exploration

Code experiments:

```markdown
## Strudel

Explored thirds in Strudel:

<strudel-embed>
note("c3 [eb3 e3]").s("piano")
</strudel-embed>

The `[eb3 e3]` plays minor then major third in sequence - makes the color
difference obvious.
```

### Connections

How the three pillars connected today:

```markdown
## Connections

Hearing thirds in Strudel with different timbres helped me recognize them on guitar.
The piano sound makes the "sad/happy" quality of minor/major very clear. Now I can
hear it in my acoustic playing too.

Next: use Strudel to generate random interval quizzes, then identify them on guitar.
```

## Multimedia Elements

### Audio Embeds

```markdown
<audio-player src="./recordings/2024-01-15-thirds.mp3">
  Practice recording: identifying thirds
</audio-player>
```

### Code Snippets

For runnable Strudel:

```markdown
<strudel-embed>
// code here
</strudel-embed>
```

For reference only:

```markdown
<strudel-embed readonly>
// code here
</strudel-embed>
```

### Diagrams

```markdown
<fretboard-diagram
  scale="major"
  root="G"
  position="3"
  highlight="3,5,7">
</fretboard-diagram>
```

## File Organization

```
content/
├── module-00/
│   ├── index.md              # Module cover/intro
│   ├── 2024-01-01-setup.md
│   ├── essays/
│   │   └── first-sounds.md
│   └── recordings/
│       └── open-strings.mp3
├── module-01/
│   ├── index.md
│   ├── week-02/
│   │   ├── 2024-01-08-chords.md
│   │   └── essays/
│   │       └── what-is-a-chord.md
│   └── week-03/
│       └── ...
├── ...
└── epilogue/
    └── beyond-the-curriculum.md
```

Organize by module, then by week where useful. Keep recordings and essays near their
context.
