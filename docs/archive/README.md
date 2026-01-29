# Archive

Deferred features and explorations. Preserved for reference, not part of current
scope.

For active documentation, see `docs/glitch/` and `docs/analog/`.

---

## Contents

**THEORETICAL-FRAMEWORK-WORLDTRAVELING.md** Lugones' worldtraveling as explicit
mode-switching between overworld (professional) and underworld (personal) contexts.

**DESIGN-SYSTEM-WORLDS.md** Two-world styling system with separate token namespaces
(`--ow-*`, `--uw-*`).

**GUIDE-CHARACTER-DESIGN.md** The Digital Druid — a guide character tending the
threshold between worlds. Includes visual design and animation philosophy.

**ADR-DEFERRED-WORLDS.md** Architecture decision for `WorldAware` interface pattern.

---

## Why deferred

Current implementation focuses on a single crafted space rather than explicit
world-switching:

- No "professional mode" — both warm palettes are equally home
- Simpler initial scope — glitch at boundaries, calm content areas
- Guide character adds complexity — can revisit later

---

## Reactivating

If implementing these features:

1. Review archived documents for original rationale
2. Update active docs with the patterns
3. Add `world` property back to component APIs
4. Move relevant content from archive to active docs
