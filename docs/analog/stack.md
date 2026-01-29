# Tech Stack

Architecture for the analog learning journal.

## Overview

```
┌─────────────────────────────────────┐
│           Lit Components            │
│  (strudel-embed, fretboard, etc.)   │
├─────────────────────────────────────┤
│            Rust Backend             │
│     (API, audio processing?)        │
├─────────────────────────────────────┤
│               AWS                   │
│    (S3, CloudFront, Lambda?)        │
└─────────────────────────────────────┘
```

## Frontend: Lit Web Components

Using Lit for its lightweight footprint and native web component output.

**Why Lit**:

- Small bundle size
- Standards-based (works anywhere)
- Good TypeScript support
- Simple reactive properties

**Build tooling**: Vite

## Backend: Rust

Rust for any server-side needs.

**Potential uses**:

- API for saving/loading journal entries
- Audio file processing (waveform generation, format conversion)
- Static site generation

May start with pure static site and add Rust services as needed.

## Hosting: AWS

**Static assets**: S3 + CloudFront **API (if needed)**: Lambda + API Gateway **Audio
files**: S3 with appropriate caching

## Key Components to Build

### `<strudel-embed>`

Interactive Strudel code editor embedded in journal entries. Needs to:

- Syntax highlight Strudel/Tidal patterns
- Execute code and produce audio
- Allow editing (read-only option for examples)

### `<audio-player>`

Custom audio player for practice recordings. Features:

- Waveform visualization
- Loop selection
- Playback speed control
- A/B comparison

### `<fretboard-diagram>`

SVG-based guitar fretboard visualization:

- Show scales and chord shapes
- Highlight intervals with colors
- Interactive (click to hear notes?)
- Multiple positions/CAGED shapes

### `<practice-entry>`

Structured journal entry component:

- Date and metadata display
- Sections for theory/guitar/algorithmic
- Embedded audio and code
- Links between related entries

## Relationship to Personal Site

This is a separate repository from my personal site. They may share:

- Design tokens (colors, typography)
- Some utility components
- Deployment patterns

But analog is its own thing with its own purpose.
