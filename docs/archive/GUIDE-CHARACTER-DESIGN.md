# Deferred: Guide Character (The Digital Druid)

> **Status**: Deferred - Guide character sprite to be implemented in a future phase.

This document preserves the complete design for the guide character who would inhabit the boundary frame.

---

## Concept

A humanoid woman who lives at the threshold. She's inspired by Celeste's Madeline—a trans character whose journey of integration and self-acceptance resonates deeply—but she's her own person with her own meaning.

She's a **digital druid**: a keeper of the threshold, someone who tends the space between the crafted interior and the wider internet. She's been here a while. She understands both the warmth of the interior and the digital edge of the boundary.

**Critical design principle**: She is HUMAN, not AI, not a digital creature. Embodiment matters. The glitch happens in her CLOTHES (the external, the chosen, the interface with the world), never in her body. Her humanity is not up for debate.

---

## Who She Is

**Integrated, Whole**: She's not split. She's not battling a shadow self. She contains multitudes—all her selves are unified. The chromatic aura around her (when present) is a spectrum, not a separation. Magenta and cyan blend at her edges, showing multiplicity as harmony, not conflict.

**The Journey is Behind Her**: Like Madeline after the mountain, she's arrived. She speaks from a place of integration. When visitors struggle, she understands—she remembers—but she's no longer in that place herself.

**A Guide, Not a Controller**: She offers wisdom without forcing paths. She respects visitor agency. She's there if you need her, fades back if you don't.

---

## Visual Design

### ASCII Reference

```
         ▄▄███▄▄           ← Hair: White/silver (wisdom, liminality)
        █░░░░░░░█             Warm tone, distinctive, alive
        █ ·  · █           ← Face: Simple, expressive, human
         █ ▽▽ █               Eyes are dots, not glowing
          ████                Slight smile - calm, knowing
       ░░▐████▌░░          ← Clothes: Simple, practical, druid-like
         █░░░░█               The glitch happens HERE only
          █  █                Subtle shimmer, not chaos
          ▀  ▀             ← Body: Solid, grounded, embodied
```

### Color Palette

```
Hair:        White/silver (#e8e8e8 → #c0c0c0)
             - Wisdom, liminality, threshold-keeper
             - Immediately distinctive from Madeline
             - Between colors, at the threshold

Skin:        #dfc8ba (F&B Setting Plaster - warm, human, embodied)

Eyes:        Simple dark dots (NOT glowing, NOT cyan/magenta)

Clothes:     Deep purple/void base (#1a0a2e → #3a1055)
             Style: climbing/tech gear OR streetwear
             - Climbing gear: practical, active, "she's done the work"
             - Streetwear: contemporary, approachable, lived-in
             Either way: subtle glitch shimmer in fabric only
```

### What Glitches (Subtly)

- The edges of her clothes/robes
- Occasional pixel displacement in fabric folds
- A slight chromatic shimmer at her outline
- NOT constant—occasional, like breathing

### What NEVER Glitches

- Her face
- Her body
- Her hair
- Her eyes

The glitch is the SPACE responding to her presence, or it's in what she WEARS (external, chosen). Her core self is solid.

---

## Animation Philosophy

### Human Animations (Her Body)

- **Breathing**: Chest/shoulders rise and fall gently
- **Blinking**: Natural rhythm, not mechanical
- **Weight shifting**: She has mass, she's grounded
- **Hair movement**: Responds to her motion, wind
- **Looking around**: Curiosity, awareness, presence

### Glitch Animations (Her Clothes Only)

- Subtle edge shimmer (chromatic, breathing rhythm)
- Occasional pixel displacement in fabric
- The shimmer intensifies slightly when she speaks

### The Distinction is Critical

```
HER BODY:        Moves like a person (organic, weighted, human)
HER CLOTHES:     Shimmer subtly (she wears the threshold)
THE SPACE:       Glitches around her (the boundary responds)
```

---

## Behavior

### Idle

- Breathing, blinking, occasionally looking around
- Clothes shimmer subtly (like light catching fabric)
- She's present, calm, watchful

### On Hover

- Turns to face you, acknowledges your presence
- Speech bubble appears with HLD holographic styling
- Message chosen based on context

### On Interaction

- Could remember you've been here before
- Messages deepen over time
- "You've returned. The boundary remembers."

---

## Message Types

### Functional (Helpful)

```
"Press ⌘K to open the paths."
"The archive holds what was made with care."
"Scroll deeper. There's more below."
```

### Poetic (Thematic)

```
"The threshold remembers those who pass through."
"You carry all your selves with you here."
"This space refuses to hold still. So do you."
"What grows at the boundary isn't corruption. It's connection."
```

### Playful (Witty)

```
"Lost? That's just another word for exploring."
"I've been watching the boundary for a while. It watches back."
"You've hovered here three times now. Curious?"
"The glitches aren't errors. They're the space laughing."
```

### Contextual

```
[First visit]    "Welcome to the threshold. I'll be here if you need."
[Return visit]   "You've returned. The boundary remembers."
[Archive page]   "Everything here was made. Making is sacred."
[About page]     "Identities are always plural."
[Deep in site]   "You've wandered far. Good."
[Long idle]      "Still here? Take your time. The space isn't going anywhere."
```

---

## Position Options

### Option A: Fixed Corner (Recommended for Simplicity)

```
Lower-right corner of the boundary frame
Always visible, always accessible
Speech bubble appears above her
```

### Option B: Wanders the Boundary Edge

```
Slowly patrols the frame over time
Stops occasionally, looks inward
More alive, but more complex to implement
```

---

## Theoretical Grounding

### Why This Design Honors Madeline's Meaning

- She's human, embodied, present (not erased into pure digital)
- She's integrated, whole (the journey was to acceptance, not "fixing")
- The glitch is in her CLOTHES, not her BODY (trans bodies aren't errors)
- She's a guide who remembers (she's been through it, she understands)

### From Russell's Glitch Feminism

> "The glitch is a correction to the machine... bodies that resist, that refuse."

She's not a glitch. She's a person who lives in a glitchy space. The glitch is the system's failure to contain her, not her failure to be contained.

### What She Represents

- Embodiment that persists even in digital space
- Humanity that doesn't need to be "fixed"
- Multiplicity as wholeness, not fragmentation
- The threshold as a place you can LIVE, not just pass through
- Trans existence as presence, not absence or error

---

## Implementation Considerations

- **Web component**: `<boundary-guide>`
- **Sprite sheet**: idle, hover, blinking, looking (4-8 frames each)
- **Position**: Fixed to boundary frame (CSS position: fixed)
- **Messages**: Array with context tags, chosen based on page/state
- **Accessibility**: Should be toggleable for users who prefer less motion
- **Performance**: Sprite animation at low FPS (10-15fps), not demanding

---

## Open Design Questions

1. **Hair color**: White/silver was proposed but could be:
   - Warm brown/auburn (still warm, but distinct)
   - Purple/violet (connects to HLD palette)
   - White/silver (wisdom, liminality)

2. **Clothing style**:
   - Druid robes?
   - Practical climbing gear (Madeline-like)?
   - Streetwear?
   - A hybrid?

3. **Sprite size**:
   - Small (16×24): Unobtrusive, fits in boundary easily
   - Medium (24×32): More detail, more readable expressions
   - Large (32×48): Maximum expression, but takes more space

---

## Why This Was Deferred

1. **Scope reduction** - Sprite animation adds significant complexity
2. **Asset creation time** - Pixel art sprites require Aseprite work
3. **Core site first** - Focus on boundary, navigation, archive before character

---

## Reactivating This Feature

If implementing the guide character in the future:

1. Create sprite sheet in Aseprite (idle, hover, blink, look frames)
2. Implement `<boundary-guide>` web component
3. Add message system with context awareness
4. Position within boundary frame
5. Add toggle for accessibility (hide character option)
6. Connect to page/navigation state for contextual messages
