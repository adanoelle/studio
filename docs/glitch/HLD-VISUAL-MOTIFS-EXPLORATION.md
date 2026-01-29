# HLD Visual Motifs: Reframing Decay as Something Else

Exploring how to incorporate Hyper Light Drifter's visual language while reframing
its meaning from decay/loss to something generative.

> **Note**: The "Guide Character" section of this document has been moved to
> `docs/archive/GUIDE-CHARACTER-DESIGN.md` as that feature is deferred.

---

## HLD's Visual Language: What It Communicates

In Hyper Light Drifter, the visual motifs communicate:

| Motif                | HLD Meaning                        |
| -------------------- | ---------------------------------- |
| Chromatic aberration | Instability, reality breaking down |
| Corruption spread    | Disease, entropy, inevitable death |
| Scanlines            | Old technology, failing systems    |
| Dash trails          | Movement through a dying world     |
| Holographic UI       | Ancient tech, barely functioning   |
| Deep purples/voids   | The end, darkness encroaching      |
| Hot pink/magenta     | Corruption, the alien Other        |

**The emotional register**: Melancholy, loss, beauty in endings, elegy for a dying
world.

---

## Reframing: Same Visuals, Different Meaning

What if these visuals meant something else entirely?

### Instead of Decay → Transformation

| Motif                | New Meaning                                            |
| -------------------- | ------------------------------------------------------ |
| Chromatic aberration | **Multiplicity** - multiple selves visible at once     |
| Corruption spread    | **Growth** - not disease, but mycelium, connection     |
| Scanlines            | **Texture of the digital** - not old, just _different_ |
| Dash trails          | **Presence persists** - where you've been matters      |
| Holographic UI       | **Liminality** - between states, potential             |
| Deep purples/voids   | **Depth** - not ending, but interiority                |
| Hot pink/magenta     | **Vitality** - not corruption, but aliveness           |

**The emotional register**: Aliveness, multiplicity, play, the joy of existing in
unstable states.

---

## The Glitch as Vitality (Not Decay)

From Legacy Russell's Glitch Feminism:

> "The glitch is a correction to the machine... It is not damage, but a re-routing."

The glitch isn't something _wrong_ - it's something _else_. It's the system trying to
contain you, and failing. That failure is generative.

### Visual Translation

**Decay reading**:

```
┌─────────────────────────────────────────┐
│▓▓▓▓▓▓░░░ crumbling ░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← Something is breaking
│▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓│
│▓   The border is failing...           ▓│
│▓   Soon it will be gone.              ▓│
│▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░ entropy ░░░▓▓▓▓▓▓▓│
└─────────────────────────────────────────┘
```

**Vitality reading**:

```
┌─────────────────────────────────────────┐
│▓▓▓▓▓▓░░░ breathing ░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← Something is ALIVE
│▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓│
│▓   The border shifts and moves...     ▓│
│▓   It refuses to hold still.          ▓│
│▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░ alive ░░░░▓▓▓▓▓▓▓▓│
└─────────────────────────────────────────┘
```

Same visual, different story.

---

## HLD Motifs in Detail

### 1. Chromatic Aberration

**What it looks like:**

```
Normal:           With aberration:
┌─────────┐       ┌─────────┐
│  TEXT   │       │  TEXT   │ ← cyan layer offset left
│         │       │  TEXT   │ ← magenta layer offset right
│         │       │  TEXT   │ ← base layer center
└─────────┘       └─────────┘
```

**HLD meaning**: Reality is unstable, light is scattering wrong

**Your meaning**: Multiple versions exist simultaneously. You're not one fixed thing.
All your selves are present.

**Implementation for boundary:**

- Idle state: Subtle, 1-2px offset
- Hover on boundary: Offset increases
- Page transition: Full separation (5-10px), then snaps back
- The aberration could "breathe" - slowly shifting offset

### 2. The Corruption/Growth Spread

**What it looks like in HLD:**

```
  ░░░░░░░░░░░░░░░░░░░░░░░
 ░░░░░▓▓▓▓░░░░░░░░░░░░░░░░
░░░░▓▓████▓▓░░░░░░░░░░░░░░░
░░▓▓██████████▓░░░░░░░░░░░░
░░▓████████████▓▓░░░░░░░░░░
░░░▓▓████████████▓░░░░░░░░░
░░░░░▓▓██████████▓▓░░░░░░░░
  ░░░░░▓▓▓▓▓▓▓▓▓░░░░░░░░░
```

Organic, spreading outward from a source. In HLD, it's disease/death.

**Reframed as growth:**

- Not corruption, but **mycelium** - underground connection
- Not spreading disease, but **blooming**
- The "infected" areas aren't dying, they're **transforming**

**Implementation for boundary:**

- Page transitions: Growth pattern spreads across the frame
- Not from damage, but from _your_ interaction (you touched it, it responds)
- The spread could follow where the cursor has been
- Colors shift to warm (your presence brings warmth to the digital edge)

### 3. Scanlines

**What it looks like:**

```
────────────────────────────────
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
────────────────────────────────
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
────────────────────────────────
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

**HLD meaning**: CRT display, old tech, degraded signal

**Your meaning**: This is a _screen_. A digital space. Not pretending to be paper.
The scanlines say: "you're in a crafted digital environment, and that's intentional."

**Implementation:**

- Subtle scanlines on the boundary frame (not content)
- A moving "scan" line that travels down occasionally
- Could intensify during transitions

### 4. Dash Trails / Afterimages

**What it looks like:**

```
Movement direction →

    ░░░      ░░░      ░░░      ███
    ░░░  →   ░░░  →   ░░░  →   ███
    ░░░      ░░░      ░░░      ███

 oldest              newer    current
 (faded)             (mid)    (solid)
```

**HLD meaning**: Echo of movement, the Drifter's signature ability

**Your meaning**: **Presence persists**. Where you've been leaves a trace. Your
navigation through the site has a visible history. Also: multiplicity - you exist in
multiple moments at once.

**Implementation:**

- During page transitions: Multiple frames visible simultaneously
- The old page ghosts out while the new fades in
- Chromatic separation on the trails (cyan/magenta offsets)
- Could apply to the cursor near the boundary

### 5. Holographic UI

**What it looks like:**

```
┌────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← semi-transparent
│░░  Flickering, not quite solid   ░░│
│░░  Scan line moves through       ░░│
│░░  Edges glow slightly           ░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└────────────────────────────────────┘
    ↑ chromatic edge glow
```

**HLD meaning**: Ancient technology, barely holding together

**Your meaning**: **Liminality**. The interface exists between states. It's not
trying to be solid/permanent. It acknowledges its own constructed nature.

**Implementation:**

- Modal menu could have this treatment
- Subtle flicker (not distracting, just alive)
- Edges have chromatic glow
- Opacity suggests you could see through to something else

### 6. Pixel Displacement

**What it looks like:**

```
Normal grid:        Displaced:
█ █ █ █ █          █ █   █ █ █
█ █ █ █ █          █   █ █   █
█ █ █ █ █            █ █ █ █
█ █ █ █ █          █ █   █ █ █
█ █ █ █ █          █ █ █   █ █
```

**HLD meaning**: Even the smallest units are unstable

**Your meaning**: The grid is a suggestion, not a prison. Even at the pixel level,
things refuse to be perfectly ordered.

**Implementation:**

- Subtle displacement in the dither patterns
- Could be used in the boundary frame corners
- Adds texture without being chaotic

---

## Page Transition Animation: Not Death, But Travel

Instead of the page "dying" and being replaced:

### Concept: "Passing Through"

```
1. Current page           2. Boundary activates      3. New page emerges
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│░░░░░░░░░░░░░░░░░│       │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│       │░░░░░░░░░░░░░░░░░│
│░               ░│       │▓ ░░░░░░░░░░░░░ ▓│       │░               ░│
│░   Page A      ░│  →    │▓ ░  glitch   ░ ▓│  →    │░   Page B      ░│
│░               ░│       │▓ ░░░░░░░░░░░░░ ▓│       │░               ░│
│░░░░░░░░░░░░░░░░░│       │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│       │░░░░░░░░░░░░░░░░░│
└─────────────────┘       └─────────────────┘       └─────────────────┘

The boundary ACTIVATES during transition (not the content dying)
```

### Animation Sequence

1. **Trigger** (click link or menu selection)

   - Boundary chromatic aberration increases
   - Scanline speeds up

2. **Growth phase** (200ms)

   - Glitch "grows" inward from boundary
   - Current content begins to ghost (opacity, not destruction)
   - Chromatic trails of the old content

3. **Peak** (100ms)

   - Maximum glitch intensity
   - Both pages partially visible (multiplicity!)
   - The boundary is most alive here

4. **Resolution** (200ms)
   - New content solidifies from center outward
   - Glitch recedes back to boundary
   - Boundary returns to idle breathing

**Total: ~500ms** - fast enough to feel snappy, slow enough to see

### Color During Transition

```
Idle:       Transition peak:       Resolved:
F&B warm    HLD vivid              F&B warm
interior    everywhere             interior
            (boundary invades      (boundary
            briefly)               retreats)
```

The HLD colors (magenta, cyan) briefly flood the space, then pull back to the
boundary. The warm F&B interior reasserts itself. The transition is a moment of
_contact_ between your space and the digital edge.

---

## The Guide Character: The Digital Druid

### Concept

A humanoid woman who lives at the threshold. She's inspired by Celeste's Madeline - a
trans character whose journey of integration and self-acceptance resonates deeply - but
she's her own person with her own meaning.

She's a **digital druid**: a keeper of the threshold, someone who tends the space between
the crafted interior and the wider internet. She's been here a while. She understands
both the warmth of the interior and the digital edge of the boundary.

**Critical design principle**: She is HUMAN, not AI, not a digital creature. Embodiment
matters. The glitch happens in her CLOTHES (the external, the chosen, the interface with
the world), never in her body. Her humanity is not up for debate.

```
                                    ┌──────────────────────────┐
                                    │  "The threshold          │
     Boundary frame                 │   remembers those        │
┌────────────────────────────────┐  │   who pass through."     │
│                                │  └────────────┬─────────────┘
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐  │               │
│  │                          │  │              ╱
│  │                          │  │         ▄▄███▄▄
│  │      Content area        │  │        █░░░░░░░█
│  │                          │  │        █ ·  · █  ← she looks at you
│  │                          │  │         █ ▽▽ █
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘  │          ████
│                                │        ░▐████▌░  ← glitch in clothes only
└────────────────────────────────┘         █░░░░█     (subtle shimmer)
                                            █  █
                                            ▀  ▀
```

### Who She Is

**Integrated, Whole**: She's not split. She's not battling a shadow self. She contains
multitudes - all her selves are unified. The chromatic aura around her (when present) is
a spectrum, not a separation. Magenta and cyan blend at her edges, showing multiplicity
as harmony, not conflict.

**The Journey is Behind Her**: Like Madeline after the mountain, she's arrived. She
speaks from a place of integration. When visitors struggle, she understands - she
remembers - but she's no longer in that place herself.

**A Guide, Not a Controller**: She offers wisdom without forcing paths. She respects
visitor agency. She's there if you need her, fades back if you don't.

### Visual Design

**Inspired by Madeline, but distinct:**

```
         ▄▄███▄▄           ← Hair: NOT red (different color, TBD)
        █░░░░░░░█             Warm tone, distinctive, alive
        █ ·  · █           ← Face: Simple, expressive, human
         █ ▽▽ █               Eyes are dots, not glowing
          ████                Slight smile - calm, knowing
       ░░▐████▌░░          ← Clothes: Simple, practical, druid-like
         █░░░░█               The glitch happens HERE only
          █  █                Subtle shimmer, not chaos
          ▀  ▀             ← Body: Solid, grounded, embodied
```

**What glitches (subtly):**

- The edges of her clothes/robes
- Occasional pixel displacement in fabric folds
- A slight chromatic shimmer at her outline
- NOT constant - occasional, like breathing

**What NEVER glitches:**

- Her face
- Her body
- Her hair
- Her eyes

The glitch is the SPACE responding to her presence, or it's in what she WEARS (external,
chosen). Her core self is solid.

**Color palette:**

```
Hair:        White/silver (#e8e8e8 → #c0c0c0)
             - Wisdom, liminality, threshold-keeper
             - Immediately distinctive from Madeline
             - Between colors, at the threshold

Skin:        #dfc8ba (F&B Setting Plaster - warm, human, embodied)

Eyes:        Simple dark dots (NOT glowing, NOT cyan/magenta)

Clothes:     Deep purple/void base (#1a0a2e → #3a1055)
             Style: climbing/tech gear OR streetwear (TBD in Aseprite)
             - Climbing gear: practical, active, "she's done the work"
             - Streetwear: contemporary, approachable, lived-in
             Either way: subtle glitch shimmer in fabric only
```

### Animation Philosophy

**Human animations (her body):**

- Breathing: chest/shoulders rise and fall gently
- Blinking: natural rhythm, not mechanical
- Weight shifting: she has mass, she's grounded
- Hair movement: responds to her motion, wind
- Looking around: curiosity, awareness, presence

**Glitch animations (her clothes only):**

- Subtle edge shimmer (chromatic, breathing rhythm)
- Occasional pixel displacement in fabric
- The shimmer intensifies slightly when she speaks

**The distinction is critical:**

```
HER BODY:        Moves like a person (organic, weighted, human)
HER CLOTHES:     Shimmer subtly (she wears the threshold)
THE SPACE:       Glitches around her (the boundary responds)
```

### Behavior

**Idle:**

- Breathing, blinking, occasionally looking around
- Clothes shimmer subtly (like light catching fabric)
- She's present, calm, watchful

**On hover:**

- Turns to face you, acknowledges your presence
- Speech bubble appears with HLD holographic styling
- Message chosen based on context

**On interaction:**

- Could remember you've been here before
- Messages deepen over time
- "You've returned. The boundary remembers."

### Message Types (Mix of All)

**Functional (helpful):**

```
"Press ⌘K to open the paths."
"The archive holds what was made with care."
"Scroll deeper. There's more below."
```

**Poetic (thematic):**

```
"The threshold remembers those who pass through."
"You carry all your selves with you here."
"This space refuses to hold still. So do you."
"What grows at the boundary isn't corruption. It's connection."
```

**Playful (witty):**

```
"Lost? That's just another word for exploring."
"I've been watching the boundary for a while. It watches back."
"You've hovered here three times now. Curious?"
"The glitches aren't errors. They're the space laughing."
```

**Contextual:**

```
[First visit]    "Welcome to the threshold. I'll be here if you need."
[Return visit]   "You've returned. The boundary remembers."
[Archive page]   "Everything here was made. Making is sacred."
[About page]     "Identities are always plural."
[Deep in site]   "You've wandered far. Good."
[Long idle]      "Still here? Take your time. The space isn't going anywhere."
```

### Theoretical Grounding

**Why this design honors Madeline's meaning:**

- She's human, embodied, present (not erased into pure digital)
- She's integrated, whole (the journey was to acceptance, not "fixing")
- The glitch is in her CLOTHES, not her BODY (trans bodies aren't errors)
- She's a guide who remembers (she's been through it, she understands)

**From Russell's Glitch Feminism:**

> "The glitch is a correction to the machine... bodies that resist, that refuse."

She's not a glitch. She's a person who lives in a glitchy space. The glitch is the
system's failure to contain her, not her failure to be contained.

**What she represents:**

- Embodiment that persists even in digital space
- Humanity that doesn't need to be "fixed"
- Multiplicity as wholeness, not fragmentation
- The threshold as a place you can LIVE, not just pass through
- Trans existence as presence, not absence or error

### Position Options

**Option A: Fixed corner (recommended for simplicity)**

```
Lower-right corner of the boundary frame
Always visible, always accessible
Speech bubble appears above her
```

**Option B: Wanders the boundary edge**

```
Slowly patrols the frame over time
Stops occasionally, looks inward
More alive, but more complex to implement
```

### Implementation Considerations

- Web component: `<boundary-guide>`
- Sprite sheet: idle, hover, blinking, looking (4-8 frames each)
- Position: Fixed to boundary frame (CSS position: fixed)
- Messages: Array with context tags, chosen based on page/state
- Accessibility: Should be toggleable for users who prefer less motion
- Performance: Sprite animation at low FPS (10-15fps), not demanding

### Open Design Questions

1. **Hair color**: What color instead of Madeline's red? Options:
   - A warm brown/auburn (still warm, but distinct)
   - A purple/violet (connects to HLD palette, still warm)
   - White/silver (wisdom, liminality, threshold)
   - Something else entirely

2. **Clothing style**: Druid robes? Practical climbing gear (Madeline-like)? A hybrid?

3. **Sprite size**: How large should she be?
   - Small (16×24): Unobtrusive, fits in boundary easily
   - Medium (24×32): More detail, more readable expressions
   - Large (32×48): Maximum expression, but takes more space

---

## Putting It Together: The Living Boundary

The boundary isn't a static frame - it's alive:

```
┌──────────────────────────────────────────────────────────────────┐
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒│
│▒░ ┌──────────────────────────────────────────────────────────┐ ░▒│
│▒░ │                                                          │ ░▒│
│▒░ │                                                          │ ░▒│
│▒░ │                  Warm F&B interior                       │ ░▒│
│▒░ │                  Content lives here                      │ ░▒│
│▒░ │                  Minimal, calm                           │ ░▒│
│▒░ │                                                          │ ░▒│
│▒░ │                                                          │ ░▒│
│▒░ └──────────────────────────────────────────────────────────┘ ░▒│
│▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒│
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▄▀▀▄│
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  █ ░█│
└──────────────────────────────────────────────────────────────▒▒▀▄▄▀┘
                                                                 ↑
The boundary:                                              Guide character
- HLD colors (purple, void)
- Chromatic aberration (breathing)
- Scanlines (subtle)
- Pixel displacement (texture)
- Responds to interaction (grows, intensifies)
- Guide character lives here
```

### The Meaning

This isn't decay. This is:

- **The membrane** between your crafted space and the wider internet
- **Alive** - it moves, breathes, responds
- **Protective** - not a wall, but a threshold that marks "you're in a different
  place now"
- **Playful** - the guide, the glitches, the colors are joyful
- **Multiplicitous** - chromatic aberration shows multiple states at once

The HLD aesthetic is repurposed from elegy to celebration. Same visual language,
inverted emotional register.

---

## Open Questions

1. **Character design**: What should the guide look like? Abstract? Humanoid?
   Creature? Your avatar?

2. **Character position**: Fixed corner? Wanders the boundary? Multiple characters?

3. **Message tone**: Helpful/functional? Poetic/thematic? Cryptic/mysterious? Mix?

4. **Transition intensity**: How dramatic should page transitions be? Subtle or bold?

5. **User preference**: Should there be a way to reduce motion / hide the guide for
   accessibility?
