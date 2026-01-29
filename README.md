<table width="100%">
<tr>
<td><h1>Studio</h1></td>
<td align="right"><sub>A design system for creative practice,<br>grounded in feminist theory.</sub></td>
</tr>
</table>

Two aesthetics from one philosophical foundation: glitch and analog. Both explore
refusal, multiplicity, and boundaries as permeable membranes rather than walls.

---

## Foundations

This work draws from:

- Legacy Russell, _Glitch Feminism_ (2020) — error as liberation, refusal of
  categorization
- Maria Lugones, "Worldtraveling" (1987) — moving between contexts, plural identity
- Donna Haraway, "A Cyborg Manifesto" (1985) — hybrid existence, boundary dissolution

Visual language references Hyper Light Drifter's chromatic aberration, PC-98
dithering constraints, and Farrow & Ball's warm material palette.

---

## Structure

```
packages/
  design-system/         Web components (Lit)
    src/glitch/          Glitch text, borders, dithering
    src/audio/           Hydra canvas, Strudel bridge
    src/analog/          Journal components (planned)

  tokens/                CSS custom properties
    src/base.css         Spacing, typography, timing
    src/glitch.css       Warm palette + chromatic aberration
    src/analog.css       Grayscale + rose/teal

apps/
  website/               Personal site — glitch aesthetic
  journal/               Music practice journal — analog aesthetic

services/                Rust Lambda functions

docs/
  glitch/                Theoretical framework, component API
  analog/                Journal format, study plan
```

---

## Commands

This repository uses [just](https://github.com/casey/just) as a unified command
interface. All commands work from the repository root.

```
just doctor     Check your environment has required tools
just setup      Install all dependencies
just dev        Start development servers
just build      Build everything for production
just check      Run all quality checks (typecheck, lint, test)
just ci         Simulate the full CI pipeline locally
```

Every package uses consistent verbs: `dev`, `build`, `test`, `lint`, `typecheck`,
`fmt`, `clean`. Run them from root or within a package directory.

Target specific packages:

```
just dev-website              Start only the website
just dev-design-system        Start only the design system
just apps::journal::dev       Start the journal app
just pkg design-system test   Run tests for design-system
```

---

## Development

```
just setup
just dev
```

Website runs on port 3000, journal on 3001.

---

## Documentation

Start with `docs/glitch/DESIGN-SUMMARY.md` for the current design direction, then
`THEORETICAL-FRAMEWORK.md` for the philosophical grounding.

---

_Built with care by Ada_
