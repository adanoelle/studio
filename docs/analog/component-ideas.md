# Component Ideas

Interactive web components to build for the journal.

## `<strudel-embed>`

Interactive Strudel code editor for embedding patterns in journal entries.

### Features

- Syntax highlighting for Strudel/Tidal mini-notation
- Play/stop button
- Volume control
- Editable by default, `readonly` attribute for examples
- Copy code button
- Link to open in full Strudel REPL

### API

```html
<strudel-embed readonly autoplay bpm="120">
  note("c3 e3 g3 c4").s("piano")
</strudel-embed>
```

### Implementation Notes

- Embed Strudel's web audio engine
- Use CodeMirror or Monaco for editing
- Lazy-load audio engine (it's heavy)

---

## `<audio-player>`

Custom audio player with practice-focused features.

### Features

- Waveform visualization (canvas or SVG)
- Click waveform to seek
- Loop selection (drag to set A/B points)
- Playback speed (0.5x to 2x)
- Visual beat markers (if BPM known)

### API

```html
<audio-player src="./practice.mp3" bpm="90" loop-start="12.5" loop-end="24.3">
  Description for accessibility
</audio-player>
```

### Implementation Notes

- Web Audio API for speed changes without pitch shift
- Could use wavesurfer.js as foundation
- Generate waveform data server-side (Rust) for faster loading

---

## `<fretboard-diagram>`

SVG guitar fretboard for visualizing scales, chords, and intervals.

### Features

- Show any scale or chord shape
- Color-code by interval (root, third, fifth, seventh)
- Multiple display modes:
  - Note names
  - Interval names (R, 3, 5, etc.)
  - Scale degrees (1, 2, 3, etc.)
  - Blank (just dots)
- Click notes to hear them (optional)
- Show multiple positions/CAGED shapes

### API

```html
<fretboard-diagram
  root="G"
  scale="major-pentatonic"
  position="3"
  frets="5"
  display="intervals"
  highlight="1,3,5"
>
</fretboard-diagram>
```

### Implementation Notes

- Pure SVG generation
- Responsive (works on mobile)
- Print-friendly styles
- Consider: vertical orientation option for chord diagrams

---

## `<practice-entry>`

Structured container for journal entries.

### Features

- Consistent header with date, week, title
- Concept tags
- Section headings (Theory, Guitar, Strudel, Connections)
- Related entries links
- Progress indicator (which week of 12)

### API

```html
<practice-entry
  date="2024-01-15"
  week="3"
  title="Intervals on the Fretboard"
  concepts="minor-thirds,major-thirds"
>
  <section slot="theory">...</section>
  <section slot="guitar">...</section>
  <section slot="strudel">...</section>
  <section slot="connections">...</section>
</practice-entry>
```

### Implementation Notes

- Uses slots for flexible content
- Could auto-generate table of contents
- Navigation to prev/next entry

---

## `<interval-trainer>`

Interactive ear training component.

### Features

- Play random interval
- Multiple choice or fretboard click to answer
- Track accuracy over time
- Focus on specific intervals

### API

```html
<interval-trainer intervals="m3,M3,P4,P5" instrument="piano"> </interval-trainer>
```

---

## `<chord-progression>`

Visualize and play chord progressions.

### Features

- Show progression in Roman numerals and chord names
- Play with Strudel
- Show each chord's voicing on fretboard
- Common progressions library

### API

```html
<chord-progression key="G" progression="I,V,vi,IV" voicings="open">
</chord-progression>
```

---

## Priority Order

1. `<strudel-embed>` - Core to the algorithmic music pillar
2. `<fretboard-diagram>` - Core to the guitar pillar
3. `<audio-player>` - Needed for practice recordings
4. `<practice-entry>` - Structure for entries
5. `<interval-trainer>` - Nice to have
6. `<chord-progression>` - Nice to have
