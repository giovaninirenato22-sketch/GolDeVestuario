---
version: alpha
name: Gol de Vestuario
description: Dark, gold-accented design system for an Argentine football-culture apparel and streetwear brand built around the locker-room (vestuario) as sacred ground.

colors:
  bg: "#0A0A0A"
  surface: "#141414"
  surface-alt: "#1A1A1A"
  border: "#2A2A2A"
  border-strong: "#3A3A3A"
  primary: "#0A0A0A"
  on-primary: "#F2EFE6"
  accent: "#C9A227"
  accent-light: "#E0B84B"
  on-accent: "#1A1A1A"
  text-primary: "#F2EFE6"
  text-secondary: "#C8C8C8"
  text-muted: "#8A8A8A"
  success: "#3FA34D"
  warning: "#E0B84B"
  error: "#C0392B"
  info: "#6FA8C9"

typography:
  display:
    fontFamily: "Anton"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.5px"
    fontFeature: uppercase
  h1:
    fontFamily: "Anton"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0.5px"
    fontFeature: uppercase
  h2:
    fontFamily: "Anton"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.3px"
    fontFeature: uppercase
  stat-label:
    fontFamily: "Bebas Neue"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "1px"
    fontFeature: uppercase
  eyebrow:
    fontFamily: "Oswald"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "3px"
    fontFeature: uppercase
  body:
    fontFamily: "Oswald"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  body-small:
    fontFamily: "Oswald"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Oswald"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  nav:
    fontFamily: "Oswald"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.3px"
  button:
    fontFamily: "Oswald"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.3px"

rounded:
  none: "0px"
  sm: "4px"
  md: "6px"
  lg: "12px"
  full: "999px"

spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  14: "56px"

components:
  navbar:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.nav}"
    padding: "16px 24px"
  navbar-brand:
    textColor: "{colors.text-primary}"
    typography: "{typography.h2}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "{colors.accent-light}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.text-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.text-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
  button-disabled:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.text-muted}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
  hero:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.text-primary}"
    typography: "{typography.display}"
    padding: "56px 24px"
  stat-card:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.accent-light}"
    typography: "{typography.stat-label}"
    padding: "24px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "24px"
  badge:
    backgroundColor: transparent
    textColor: "{colors.accent}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  input:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-small}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
---

# Gol de Vestuario Design System

## Overview
Gol de Vestuario is an Argentine football-culture apparel and content brand built around the vestuario — the locker room — as the place where the game is really won: preparation, ritual, brotherhood. The site and product experience should feel like stepping into that room: dark, focused, a little reverent, with a single flash of gold marking what matters (the crest, the CTA, the score). It should never feel like generic sportswear e-commerce — no rainbow of brand colors, no playful rounded-everything softness, no stock-photo gloss.

## Colors
The palette is almost monochrome by design: near-black (`bg` #0A0A0A) as the dominant surface, a warm off-white (`text-primary` #F2EFE6) for primary text, and exactly one accent, gold (`accent` #C9A227, with a lighter `accent-light` #E0B84B for hover/highlight states) standing in for the badge's metallic trim. `surface` and `surface-alt` give just enough separation from `bg` for cards and inputs without introducing a second brand color. `border` (#2A2A2A) is a hairline, not a shadow — this is a flat, contrast-driven system, not an elevation-driven one. Semantic colors (`success`, `warning`, `error`, `info`) are muted, desaturated tones so they read as system feedback, never competing with the gold accent. Gold text on black (`accent` on `bg`) and off-white on black (`text-primary` on `bg`) both clear WCAG AA; gold buttons use `on-accent` (#1A1A1A, near-black) rather than white, since black-on-gold is the higher-contrast, more premium pairing.

## Typography
Anton (`display`, `h1`, `h2`) is the voice of the brand — bold, condensed, always uppercase, used sparingly for headlines and section titles so it keeps its punch. Bebas Neue (`stat-label`) is a second condensed display face reserved specifically for short punchy labels (stat callouts, feature tags) — it must never be used for headlines or body copy, or the hierarchy collapses. Oswald carries everything functional: navigation, body copy, buttons, captions, form labels, at weights 400/500/700. The `eyebrow` style (Oswald, wide letter-spacing, gold) is the standard way to introduce a section above an Anton headline. Nothing in the system uses a serif or a rounded/humanist sans — those would break the disciplined, athletic character.

## Layout
Spacing follows a near-linear 4px-based scale (4/8/12/16/20/24/32/40/56) rather than an aggressive exponential one, because the layouts are simple stacked sections (nav, hero, stat row) that need consistent breathing room more than dramatic jumps. Density is comfortable-to-generous: hero padding is 56px vertical, section content padding is 24px, card/button padding stays in the 12–28px range. Content is center-aligned in the hero and evenly split into 3-column grids for feature/stat rows, mirroring the mockup's stat section.

## Elevation & Depth
No shadows. Depth comes entirely from contrast and 0.5–1px hairline borders (`border`, `border-strong`) separating sections (nav bottom border, stat-card column dividers). This keeps the surface feeling flat and disciplined, like a matte locker-room wall, rather than a glossy consumer app. If a component ever needs to visually "lift" (e.g. a modal), prefer a stronger `surface` contrast step over adding a shadow.

## Shapes
Radius is restrained: `sm` (4px) and `md` (6px) cover almost everything — buttons, inputs, small badges — signaling precision and control rather than softness. `lg` (12px) is reserved for containers/cards that need to feel like a distinct panel (matches the mockup's outer container radius). `full` is reserved for pill-shaped badges/tags only. Nothing should default to 16px+ radii; that reads as consumer-app-soft, not locker-room-disciplined.

## Components
`navbar` sits flush against `bg` with only a bottom hairline `border` for separation — no background change, no shadow. `button-primary` is solid `accent` with near-black `on-accent` text, brightening to `accent-light` on hover; it's the only filled, high-contrast surface in the system, reserved for the single most important action per screen. `button-secondary` is transparent with a `text-secondary`-toned border, promoted to a filled `surface-alt` background on hover — it should never use the gold accent, so primary CTAs stay unambiguous. `hero` and `stat-card` both sit directly on `bg` with no card background, relying on typography and spacing for structure, matching the mockup exactly. `card` is the one component that steps up to `surface` with an `lg` radius, for content that needs to visually separate from the page (product tiles, testimonials). `input` uses `surface-alt` to stay readable against `bg` without competing with card surfaces.

## Do's and Don'ts
**Do:**
- Keep gold (`accent`/`accent-light`) reserved for the single primary action or highlight per view — its power comes from scarcity.
- Set all Anton and Bebas Neue text in uppercase; both faces were drawn for caps and look unbalanced in mixed case.
- Use hairline `border` tokens, not shadows, for every separation need.
- Keep button and input radii in the `sm`–`md` range; reserve `lg` for container-level cards only.
- Pair gold buttons with `on-accent` (near-black) text, never white, for maximum contrast and a premium finish.

**Don't:**
- Don't introduce a second brand color — every new accent need should be solved with `accent`, `accent-light`, or a neutral, not a new hue.
- Don't add drop shadows or glassmorphism — depth is contrast and borders only.
- Don't set body copy or navigation in Anton or Bebas Neue — those are display-only; Oswald carries all functional text.
- Don't use radii above 12px anywhere; large rounded corners read as generic consumer-app, not locker-room/athletic.
- Don't let secondary buttons use the gold accent — that ambiguity dilutes the primary CTA.
- Don't lighten `bg` into a mid-gray "dark mode" gray; the near-black (#0A0A0A) is core to the mood, not a placeholder.
