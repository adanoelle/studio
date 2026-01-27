# Archived Design Documents

These documents contain **deferred features** and explorations that may be implemented in future phases. They are preserved here for reference but are not part of the current implementation scope.

**For active documentation, see the parent `docs/` directory.**

---

## Contents

### THEORETICAL-FRAMEWORK-WORLDTRAVELING.md
Lugones' worldtraveling concept applied as explicit mode-switching between overworld (professional) and underworld (personal) presentations. Includes anti-patterns and user agency considerations.

### DESIGN-SYSTEM-WORLDS.md
Complete overworld/underworld styling system with separate token namespaces (`--ow-*`, `--uw-*`), world-specific typography, and `.overworld`/`.underworld` class definitions.

### GUIDE-CHARACTER-DESIGN.md
The Digital Druid - a humanoid guide character who tends the threshold. Includes visual design, animation philosophy, message types, and theoretical grounding (Madeline/Celeste inspiration).

### ADR-DEFERRED-WORLDS.md
Original architecture decision for two-world system with `WorldAware` interface pattern and explicit world transition implementation.

---

## Why Deferred?

The current implementation focuses on a **single crafted space** rather than explicit world-switching. Key reasons:

1. **No "professional mode"** - Both warm palettes (morning/evening) are equally "home"
2. **Simpler initial scope** - Glitch effects at the boundary, content-primary interior
3. **Guide character complexity** - Sprite animation adds scope; can be added later

These features may be revisited once the core site is functional.

---

## Reactivating Deferred Features

If implementing these features in the future:

1. Review the archived documents for original design rationale
2. Update active docs to incorporate the patterns
3. Add `world` property back to component APIs
4. Move relevant content from archive back to active docs
