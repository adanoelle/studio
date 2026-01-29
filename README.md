# Studio

**Collection**: Design systems · Creative practice · Music journal<br>
**Format**: Web components (Lit) · Design tokens · Rust Lambda<br>
**Foundations**: Russell (2020) · Lugones (1987) · Haraway (1985)

---

A unified design system for creative practice. Two aesthetics—glitch + analog—from the same philosophical foundation: refusal, multiplicity, boundaries as permeable.

Visual language draws from Hyper Light Drifter's chromatic aberration, PC-98 dithering, and Farrow & Ball's warm palette.

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Components ─────────────────── packages/design-system/            │
│    └── glitch/                 Glitch text, borders, dithering     │
│    └── audio/                  Hydra/Strudel visualization         │
│    └── analog/                 Fretboard, practice entries         │
│                                                                    │
│  Tokens ─────────────────────── packages/tokens/                   │
│    └── base.css                Spacing, typography, animation      │
│    └── glitch.css              Warm F&B + chromatic aberration     │
│    └── analog.css              Grayscale + rose/teal               │
│                                                                    │
│  Apps ───────────────────────── apps/                              │
│    └── website/                Personal site (glitch aesthetic)    │
│    └── journal/                Music journal (analog aesthetic)    │
│                                                                    │
│  Docs ───────────────────────── docs/                              │
│    └── glitch/                 Theoretical framework, component API│
│    └── analog/                 Journal format, study plan          │
│                                                                    │
│  Services ───────────────────── services/                          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

```
just setup && just dev
```

*Built with theory by Ada*
