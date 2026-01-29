# Color Palette Exploration: Farrow & Ball + Glitch + Game References

Exploring how to combine Farrow & Ball's sophisticated warm palette with glitch effects, informed by Hyper Light Drifter and Celeste's pixel art color direction.

---

## Reference Palettes

### Hyper Light Drifter

HLD uses color to express corruption, mystery, and liminality.

```
Core Palette:
┌──────────────────────────────────────────────────────────────────┐
│  #1a0a2e   #3a1055   #7209b7   #f72585   #00f5ff   #b4ff9f     │
│  void      purple    magenta   hot pink  cyan      lime        │
│  dark      mid       bright    corrupt   digital   toxic       │
└──────────────────────────────────────────────────────────────────┘

Characteristics:
- Deep purple/blue void as base
- Magenta/pink = corruption, danger, the Other
- Cyan = technology, ghosts, information
- High saturation accents against desaturated darks
- Chromatic aberration everywhere (cyan/magenta offsets)
```

### Celeste

Celeste uses color to express emotional states and safety/danger.

```
Core Palette:
┌──────────────────────────────────────────────────────────────────┐
│  #1a1a2e   #4a4a6a   #9badb7   #f5f5f5   #c84b4b   #7b3f7b     │
│  dark      mid blue  ice       snow      Madeline  Badeline    │
│  night     shadow    cool      safe      warm      other self  │
└──────────────────────────────────────────────────────────────────┘

Characteristics:
- Cool blues/purples for the mountain (challenge, fear)
- Warm reds = Madeline (self, determination, life)
- Purple = Badeline (shadow self, anxiety, suppressed)
- Safe spaces have warmer, softer palettes
- Gradient skies transition between emotional states
- Less saturated than HLD, more painterly
```

### Farrow & Ball (Warm Selection)

Sophisticated, muted, heritage colors with complex undertones.

```
Warm Palette:
┌──────────────────────────────────────────────────────────────────┐
│  #dfc8ba   #c9a88a   #a4656a   #904545   #3a3632   #4a5a4a     │
│  Setting   Jitney/   Sulking   Incarna-  Paean     Studio      │
│  Plaster   Dead Sal  Room Pink dine      Black     Green       │
└──────────────────────────────────────────────────────────────────┘

Characteristics:
- Muted, never garish
- Complex undertones (pink has gray, cream has yellow)
- Historical/heritage feeling
- Warm but sophisticated
- High pigment depth
```

---

## Approach A: Pure Digital Intrusion

Keep glitch colors fully saturated (#ff00ff, #00ffff) against F&B base.

### Rationale
The glitch is explicitly *digital* - an intrusion from screen-space into the warm, analog F&B world. The clash is intentional: the boundary between your crafted space and the internet.

### Palette

```
┌─────────────────────────────────────────────────────────────────┐
│  BASE (F&B)                    │  GLITCH (Pure Digital)        │
├────────────────────────────────┼────────────────────────────────┤
│  Background: #dfc8ba (cream)   │  Primary:   #ff00ff (magenta) │
│  Text:       #3a3632 (dark)    │  Secondary: #00ffff (cyan)    │
│  Accent:     #a4656a (pink)    │  Tertiary:  #ff6b9d (hot pink)│
│  Border:     #c9a88a (tan)     │  Highlight: #b4ff9f (lime)    │
└────────────────────────────────┴────────────────────────────────┘
```

### Visual Example

```
                    Normal State
┌─────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← F&B tan border
│░                                           ░│
│░    Warm cream background                  ░│
│░    Dark text, muted pink accents          ░│
│░                                           ░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────────────┘

                    Glitch State
┌─────────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓░░ CYAN    ░░░░░░░░░░░░░░░░░░░MAGENTA ░░░▓│  ← Chromatic split
│▓                                           ▓│
│▓    Content unchanged, frame glitching     ▓│
│▓                                           ▓│
│▓░░MAGENTA░░░░░░░░░░░░░░░░░░░░░░░CYAN░░░░░░▓│
└─────────────────────────────────────────────┘
```

### Pros
- Maximum contrast = maximum impact
- Maintains theoretical integrity (digital intrusion)
- Connects to HLD's chromatic aberration language
- Glitch is clearly *other* - not absorbed into the aesthetic

### Cons
- Potentially jarring/tiring
- Might feel "generic glitch" rather than personal
- F&B sophistication could be overwhelmed

---

## Approach B: Derived Glitch Colors

Generate glitch colors by pushing F&B colors to saturated extremes.

### Rationale
The glitch emerges *from* the palette, as if the sophisticated colors are being corrupted from within. Like Celeste's Badeline - the Other that comes from the self.

### Derivation Method

```
Original F&B          →  Push Saturation  →  Glitch Version
┌──────────────┐         ┌──────────────┐    ┌──────────────┐
│ Sulking Room │    →    │ saturate     │ →  │ #ff4d6a      │
│ Pink #a4656a │         │ + brighten   │    │ "hot pink"   │
└──────────────┘         └──────────────┘    └──────────────┘

┌──────────────┐         ┌──────────────┐    ┌──────────────┐
│ Incarnadine  │    →    │ saturate     │ →  │ #ff3333      │
│ #904545      │         │ + shift hue  │    │ "blood red"  │
└──────────────┘         └──────────────┘    └──────────────┘

┌──────────────┐         ┌──────────────┐    ┌──────────────┐
│ Jitney       │    →    │ saturate     │ →  │ #ffaa44      │
│ #c9a88a      │         │ + warm       │    │ "toxic amber"│
└──────────────┘         └──────────────┘    └──────────────┘

┌──────────────┐         ┌──────────────┐    ┌──────────────┐
│ Studio Green │    →    │ saturate     │ →  │ #44ff66      │
│ #4a5a4a      │         │ + neon       │    │ "acid green" │
└──────────────┘         └──────────────┘    └──────────────┘
```

### Palette

```
┌─────────────────────────────────────────────────────────────────┐
│  BASE (F&B)                    │  GLITCH (Derived)              │
├────────────────────────────────┼────────────────────────────────┤
│  Background: #dfc8ba (cream)   │  Primary:   #ff4d6a (hot pink) │
│  Text:       #3a3632 (dark)    │  Secondary: #ffaa44 (amber)    │
│  Accent:     #a4656a (pink)    │  Tertiary:  #ff3333 (blood)    │
│  Border:     #c9a88a (tan)     │  Highlight: #44ff66 (acid)     │
└────────────────────────────────┴────────────────────────────────┘
```

### Visual Example

```
                    Glitch State (Derived)
┌─────────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓░░ AMBER   ░░░░░░░░░░░░░░░░░░░HOT PINK░░░▓│
│▓                                           ▓│
│▓    Feels like the palette "overheating"   ▓│
│▓    Same family, pushed to extremes        ▓│
│▓                                           ▓│
│▓░░HOT PINK░░░░░░░░░░░░░░░░░░░░░AMBER░░░░░░▓│
└─────────────────────────────────────────────┘
```

### Pros
- Glitch feels *personal* to your palette
- More Celeste-like (shadow self emerges from self)
- Sophisticated corruption rather than digital invasion
- Warmer overall feeling

### Cons
- Loses the digital signifier (magenta/cyan)
- Less connected to HLD's specific aesthetic
- Might feel too harmonious (where's the refusal?)

---

## Approach C: Muted/Harmonized Glitch

Desaturate glitch colors to feel cohesive with F&B sophistication.

### Rationale
The glitch is absorbed into the F&B world - still present, but whispered rather than shouted. Like a memory of digital intrusion rather than active disruption.

### Palette

```
┌─────────────────────────────────────────────────────────────────┐
│  BASE (F&B)                    │  GLITCH (Muted)                │
├────────────────────────────────┼────────────────────────────────┤
│  Background: #dfc8ba (cream)   │  Primary:   #c77d9e (dusty mag)│
│  Text:       #3a3632 (dark)    │  Secondary: #7dbdc7 (dusty cya)│
│  Accent:     #a4656a (pink)    │  Tertiary:  #c7a0a8 (faded pnk)│
│  Border:     #c9a88a (tan)     │  Highlight: #a8c7a0 (sage)     │
└────────────────────────────────┴────────────────────────────────┘
```

### Visual Example

```
                    Glitch State (Muted)
┌─────────────────────────────────────────────┐
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│▒░░ dusty   ░░░░░░░░░░░░░░░░░░dusty    ░░░▒│
│▒░░ cyan    ░░░░░░░░░░░░░░░░░░magenta  ░░░▒│
│▒                                           ▒│
│▒    Feels like faded photography           ▒│
│▒    Glitch as memory, not intrusion        ▒│
│▒                                           ▒│
└─────────────────────────────────────────────┘
```

### Pros
- Maximum sophistication
- Everything feels of-a-piece
- Could feel like light leaks on film photography
- Gentle, not aggressive

### Cons
- Loses the *refusal* - glitch becomes decoration
- Might be too subtle to notice
- Doesn't connect to HLD/game aesthetic

---

## Approach D: Contextual Hybrid

Different glitch intensity/color based on context.

### Rationale
The glitch adapts to what's being shown:
- **Boundary frame**: Pure digital (always the membrane to internet)
- **Content hover**: Derived colors (emerges from self)
- **Page transitions**: Full intensity (moment of instability)
- **Archive items**: Muted (doesn't distract from content)

### Palette Mapping

```
Context              │ Glitch Style        │ Colors
─────────────────────┼─────────────────────┼────────────────────
Outer boundary       │ Pure digital        │ #ff00ff, #00ffff
Modal menu           │ Derived             │ #ff4d6a, #ffaa44
Page transition      │ Pure + Derived mix  │ All colors burst
Archive hover        │ Muted               │ #c77d9e, #7dbdc7
Item detail          │ Minimal/none        │ Content is primary
```

### Pros
- Best of all worlds
- Glitch meaning varies by context
- Content stays primary when needed
- Boundary stays bold

### Cons
- More complex to implement
- Could feel inconsistent
- Need to design multiple glitch palettes

---

## HLD + Celeste Synthesis

Taking specific inspiration from both games:

### From Hyper Light Drifter
- Chromatic aberration as signature effect
- Magenta/cyan offset on the boundary
- Deep void purples in dark mode
- "Corruption" as beautiful, not ugly
- Scanlines and holographic effects

### From Celeste
- Color tells emotional story
- Safe spaces feel warmer
- The shadow self (Badeline) as purple
- Gradient transitions between states
- Softer, more painterly than HLD

### Proposed Synthesis

```
┌─────────────────────────────────────────────────────────────────┐
│  BOUNDARY        │  CONTENT AREA      │  GLITCH                 │
├──────────────────┼────────────────────┼─────────────────────────┤
│  Dark, HLD-like  │  Warm, F&B-like    │  Contextual hybrid      │
│  #1a0a2e void    │  #dfc8ba cream     │  Pure @ boundary        │
│  Frame is liminal│  Content is home   │  Derived @ content      │
│  Digital edge    │  Analog interior   │  Muted @ archive        │
└──────────────────┴────────────────────┴─────────────────────────┘

The boundary IS the HLD aesthetic (digital, purple, glitchy)
The interior IS the F&B aesthetic (warm, sophisticated, yours)
The glitch happens at the MEETING POINT
```

This reframes the architecture:
- **Boundary**: Always dark/HLD-like (it's the edge to the internet)
- **Content**: Always warm/F&B (it's your home)
- **Glitch**: Happens where they meet, in both color languages

---

## Two Warm Palettes (Day/Night)

If you want variation without cold/professional modes:

### Palette A: "Morning" (lighter, soft)

```
Background: #dfc8ba (Setting Plaster - warm cream)
Text:       #3a3632 (Paean Black)
Accent:     #a4656a (Sulking Room Pink)
Border:     #c9a88a (Jitney)
Links:      #904545 (Incarnadine)

Boundary:   #4a3a5c (muted purple - softer HLD)
Glitch:     Derived warm (#ff4d6a, #ffaa44)
```

### Palette B: "Evening" (darker, rich)

```
Background: #3a3632 (Paean Black - warm dark)
Text:       #dfc8ba (Setting Plaster)
Accent:     #c9a88a (Jitney/Dead Salmon)
Border:     #5a4a4a (dark muted)
Links:      #a4656a (Sulking Room Pink)

Boundary:   #1a0a2e (deep void - full HLD)
Glitch:     Pure digital (#ff00ff, #00ffff)
```

Both are home. Morning is soft and awake. Evening is deep and focused. Neither is "professional mode."

---

## Next Steps

1. **Create test swatches** in Aseprite/Figma showing each approach
2. **Test boundary frame** with each glitch color scheme
3. **See them in context** - which feels right when viewing actual content?

---

## Open Questions

1. Which specific F&B colors resonate most? (I listed suggestions, but you should verify against actual F&B swatches)

2. For the boundary: Should it always be dark/HLD-like, or also warm?

3. Is the glitch *always* chromatic aberration, or should it include:
   - Dither corruption (PC-98 style)?
   - Scanlines (HLD)?
   - Pattern displacement?
   - All of the above, contextually?
