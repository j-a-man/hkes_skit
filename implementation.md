# Death Note — "How to Use It" UI Implementation

## Visual Design Analysis

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#000000` | Full page background |
| `text-primary` | `#FFFFFF` | All text, borders, decorations |
| `border-color` | `#FFFFFF` | Page border & ornament strokes |

### Typography
| Role | Google Font | Style |
|------|-------------|-------|
| Title "DEATH NOTE" | `Pirata One` or `MedievalSharp` | 900 weight, letter-spacing wide, uppercase |
| Subtitle "How to use it" | `Uncial Antiqua` or `Special Elite` | italic, normal weight |
| Roman numeral "I" | Same as subtitle | centered |
| Rule text (English) | `Special Elite` | italic, ~1.1rem |
| Japanese text | `Noto Sans JP` | normal weight, ~0.65rem |

> **Note:** The closest free approximation to the original Death Note anime font for rules is `Special Elite` (Google Fonts). For the title, `Pirata One` closely matches the jagged gothic letterforms.

---

## Page Structure

```
<page>                          ← black bg, full viewport
  <skull-medallion>             ← top-center, overlaps border
  <border-frame>                ← white decorative border
    <corner-ornament x4>        ← baroque scroll SVGs in each corner
    <header>
      <title>DEATH NOTE</title>
      <subtitle>How to use it</subtitle>
      <section-number>I</section-number>
    </header>
    <rules-list>
      <rule x5>
        <bullet>◦</bullet>
        <english-text>...</english-text>
        <japanese-text>...</japanese-text>
      </rule>
    </rules-list>
  </border-frame>
</page>
```

---

## Component Breakdown

### 1. Skull Medallion (top-center)
- Circular container, ~80–100px diameter
- White skull SVG icon inside dark circle
- Surrounding **sunburst / radiating spikes** — use SVG `<line>` or CSS conic/radial gradient with clip-path
- Positioned absolutely at top-center, `translateY(-50%)` so it straddles the border
- Slight outer glow: `box-shadow: 0 0 12px rgba(255,255,255,0.4)`

### 2. Decorative Border Frame
- White `2px solid` border, `rounded-none` (sharp corners)
- Inner `1px solid` white border offset by ~6px (double-border effect)
- `padding: 40px 36px 32px`
- **Corner ornaments**: SVG baroque scrollwork placed at each corner using `absolute` positioning
  - Top-left, top-right (mirrored), bottom-left, bottom-right
  - ~60×60px each

### 3. Title Block (centered)
- **"DEATH NOTE"**: `font-size: clamp(2.8rem, 8vw, 5rem)`, `letter-spacing: 0.08em`, `font-weight: 900`
  - The `A` in "DEATH" has a cross/dagger through it — render as SVG text or use a custom glyph
  - The `O` in "NOTE" has a cross through it — same treatment
- **"How to use it"**: `font-size: 1.4rem`, italic, slight left tilt via `transform: rotate(-1deg)`
- **"I"**: `font-size: 1.2rem`, centered, `margin-top: 4px`

### 4. Rules List
- `margin-top: 24px`, no list-style
- Each rule item: `margin-bottom: 20px`
- **Bullet**: `◦` character (white circle), `font-size: 1.1rem`, positioned before English text
- **English text**: `font-family: 'Special Elite'`, italic, ~18px/1.5rem, `line-height: 1.4`
- **Japanese text**: `font-family: 'Noto Sans JP'`, ~11px, `line-height: 1.6`, `margin-top: 6px`, `padding-left: 16px`
  - Includes `<ruby>` tags for furigana where needed

---

## Next.js + Tailwind + Framer Motion Implementation

### Tech Stack
- **Next.js 14** (App Router)
- **Tailwind CSS v3** with custom config
- **Framer Motion v11** for entrance animations
- **Google Fonts** via `next/font/google`

### Tailwind Config Additions (`tailwind.config.ts`)
```ts
theme: {
  extend: {
    fontFamily: {
      pirata: ['Pirata One', 'cursive'],
      special: ['Special Elite', 'cursive'],
      noto: ['Noto Sans JP', 'sans-serif'],
      uncial: ['Uncial Antiqua', 'cursive'],
    },
    colors: {
      'dn-black': '#000000',
      'dn-white': '#FFFFFF',
    },
    boxShadow: {
      skull: '0 0 20px rgba(255,255,255,0.35)',
      'text-glow': '0 0 8px rgba(255,255,255,0.2)',
    },
  },
}
```

### Framer Motion Animations

| Element | Animation | Config |
|---------|-----------|--------|
| Page wrapper | Fade in from opacity 0 | `duration: 1.2s, ease: 'easeIn'` |
| Skull medallion | Scale from 0.6 → 1 + fade | `delay: 0.2s, duration: 0.8s` |
| Border frame | Clip-path wipe from center | `delay: 0.5s, duration: 1s` |
| Title "DEATH NOTE" | Letter stagger slide-up | `staggerChildren: 0.04s` |
| Each rule | Staggered fade-in + slide-up 20px | `staggerChildren: 0.15s, delay: 1.2s` |
| Japanese text | Fade in after English | `delay: +0.2s per rule` |

#### Skull Pulse Loop (ambient)
```ts
animate={{ scale: [1, 1.04, 1] }}
transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
```

---

## File Structure

```
src/
├── app/
│   ├── page.tsx              ← Main DeathNote page
│   ├── layout.tsx            ← Font loading, black bg
│   └── globals.css           ← Base styles, font imports
├── components/
│   ├── SkullMedallion.tsx    ← SVG skull + sunburst
│   ├── CornerOrnament.tsx    ← Reusable baroque SVG corner
│   ├── DeathNoteTitle.tsx    ← Animated title block
│   ├── RuleItem.tsx          ← Single rule (EN + JP)
│   └── RulesList.tsx         ← Animated stagger container
├── data/
│   └── design-spec.json      ← Full UI spec (see below)
└── lib/
    └── fonts.ts              ← next/font/google config
```

---

## SVG Assets Needed

1. **Skull medallion** — circular skull SVG (can use Heroicons or custom)
2. **Sunburst spikes** — 24 short lines radiating from center circle
3. **Corner ornament** — baroque/rococo scroll SVG (4 rotations of same SVG)
4. **Cross-through letters** — for the A in DEATH and O in NOTE (SVG overlay)

All SVG assets should be `fill="white"` / `stroke="white"` on transparent backgrounds.

---

## Key Implementation Notes

1. **Fonts**: Load via `next/font/google` in `layout.tsx` for zero layout shift
2. **Border effect**: Use a `div` with `outline: 1px solid white; outline-offset: -12px` inside a `border border-white` container for the double-border look
3. **Japanese furigana**: Use HTML `<ruby>/<rt>` tags inside dangerouslySetInnerHTML or build a `RubyText` component
4. **Responsive**: The page should be centered, max-width ~700px, with padding scaling via `clamp()`
5. **No images**: All decorations are CSS/SVG — no external image dependencies
6. **Dark cursor**: Consider a custom cursor (skull/crosshair) for extra flair
