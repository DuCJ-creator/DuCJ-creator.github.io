---
version: alpha
colors:
  ink: "#17324d"
  inkSoft: "#456176"
  paper: "#f6f8f7"
  surface: "#ffffff"
  line: "#d8e0df"
  primary: "#087e73"
  primaryDark: "#05645c"
  primaryPale: "#e4f4f0"
  accent: "#d78b2d"
typography:
  display:
    fontFamily: 'Charter, "Iowan Old Style", "Palatino Linotype", Georgia, serif'
    lineHeight: "1"
  body:
    fontFamily: 'Inter, Aptos, "Segoe UI", system-ui, sans-serif'
    lineHeight: "1.55"
rounded:
  card: "18px"
  control: "10px"
  pill: "999px"
spacing:
  base: "8px"
components:
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.base}"
  button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    height: "44px"
  selectedTab:
    backgroundColor: "{colors.primaryPale}"
    textColor: "{colors.primaryDark}"
    rounded: "{rounded.pill}"
  example:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.inkSoft}"
    rounded: "{rounded.control}"
---

## Overview

AWL Study Desk is a focused academic workbench for secondary and tertiary learners in New Zealand. Its visual reference is a well-kept university reading room translated into a contemporary digital tool: deep ink, pale study surfaces, precise rules, generous margins, and a restrained teal indexing system. It is a product interface, not a marketing page.

The memorable signature is the numbered ten-part sublist rail. Frequency is structure, so the numbering is functional rather than decorative. The interface must never resemble a gamified children's app, a generic analytics dashboard, or a dense dictionary scan.

## Colors

Ink provides the primary reading colour. Teal indicates selection, progress, and safe action. Amber appears only beside academic examples, recalling a physical margin marker. Pale blue and teal organise content without reducing contrast. Runtime values are owned by the CSS custom properties in `styles.css`, which map one-to-one to this file.

## Typography

Charter or the nearest system old-style serif carries words, examples, and major headings. A system sans serif carries controls and metadata. This pairing separates reading from operating. Body copy stays at 16px or above; controls never rely on italics.

## Layout

The desktop learning surface uses a bounded two-column workbench: a scroll-owning word index and a naturally sized detail page. The mobile layout becomes one column and keeps all actions in document flow. Spacing follows an 8px rhythm, with larger editorial intervals around the opening statement.

## Elevation & Depth

Only primary work surfaces receive a soft navy-tinted shadow. Navigation, sublist controls, and detail sections remain flat and are separated by rules.

## Shapes

Cards use an 18px radius; operating controls use 10–12px; modes and progress controls may use pills. The asymmetric brand tile is the only deliberately irregular shape.

## Components

Every action uses a native button with hover, active, disabled, and visible focus states. Search owns an explicit clear control. The word list owns its scrollbar; the detail surface and practice page retain natural document scrolling. Feedback remains inline and announced through live regions.

## Do's and Don'ts

- Do make frequency, progress, and current location visible.
- Do use complete, calm academic English and British spelling.
- Do reserve teal for interaction and status.
- Don't add decorative gradients, mascots, floating glass panels, or reward confetti.
- Don't hide essential information behind hover or motion.
- Don't replace the serif reading voice with a generic geometric display font.
