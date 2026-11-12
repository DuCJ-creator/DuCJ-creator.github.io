---
version: alpha
colors:
  primary: "#8AB9A7"
  abyss: "#031416"
  deep: "#06292D"
  lagoon: "#0B4548"
  foam: "#E4EEE9"
  koi: "#C94F3F"
  quiet: "#8AB9A7"
  warning: "#D0AA70"
  danger: "#D56B59"
typography:
  display:
    fontFamily: '"Songti TC", "Noto Serif TC", serif'
  interface:
    fontFamily: '"Avenir Next", "PingFang TC", "Noto Sans TC", system-ui, sans-serif'
  measurement:
    fontFamily: 'ui-monospace, "SFMono-Regular", monospace'
rounded:
  interface: "7px"
---

# Shirley’s 海底世界 Design Context

## Overview

Shirley’s 海底世界 is a full-screen classroom sound instrument disguised as a nocturnal public-aquarium observation window. Its single job is to make quiet time visible without turning the room into a scoreboard.

The signature is biological cause and effect: each completed minute of effective quiet welcomes an individually numbered koi, shrimp, crab, seahorse, cuttlefish, sea cucumber or sea urchin, while one shark changes posture, pace, eye, jaw and intent as sound rises. Noisy interruptions do not count toward that minute. Each resident has its own locomotion rhythm and all 1–50 numbers stay unique among active residents. The interface must stay secondary to that ecology.

The visual anti-references are mobile-game aquariums, glossy 3D mascots, neon cyber dashboards, generic glassmorphism and symmetrical vector animals. Nothing underwater should look airbrushed, inflated or lit by a studio softbox.

## Colors

Runtime UI tokens are owned by `styles.css`; this document mirrors their accepted values.

- Abyss `#031416`: application and edge darkness.
- Deep `#06292D`: deep-water structural tone.
- Lagoon `#0B4548`: upper-water environmental tone.
- Foam `#E4EEE9`: primary readable text.
- Koi `#C94F3F`: the only saturated biological accent.
- Quiet jade `#8AB9A7`: safe status and listening activity.
- Warning sand `#D0AA70`: wake and caution state.
- Danger clay `#D56B59`: imminent attack state.

Canvas water, animals and sediment use nearby natural pigments rather than copying UI colors literally. Any palette change must update both `styles.css` and the corresponding Canvas values in `app.js`.

## Typography

- Display: `"Songti TC", "Noto Serif TC", serif`; restrained, light and widely tracked, used only for the title and biological state.
- Interface: `"Avenir Next", "PingFang TC", "Noto Sans TC", system-ui, sans-serif`.
- Measurements: `ui-monospace, "SFMono-Regular", monospace`; used for dB and timer values.

Typography should feel like a small museum label on glass, never like a game HUD. Labels remain short and factual.

## Layout

The aquarium always owns the full viewport. Information sits near the glass perimeter so the centre remains available for animal movement.

- Upper left: the single identity mark, “Shirley’s 海底世界”.
- Mid-left: a compact live dB reading and one horizontal sound bar; no explanatory state copy.
- Lower right: three compact icon controls and an optional quiet-progress label.
- Settings remain a temporary instrument panel, never a permanent dashboard.
- Mobile retains the same hierarchy with reduced type and fewer decorative details.

## Elevation & Depth

Depth comes from ecological occlusion, haze, focus, sediment and movement speed—not card shadows.

- UI surfaces use one thin mineral-coloured border, low-opacity dark fill and at most a small blur.
- No luminous progress tracks, large drop shadows or glossy inset highlights.
- Water uses layered haze, irregular caustic lines and sparse suspended matter.
- Foreground plants and sediment may cross animal silhouettes to reinforce depth.

## Shapes

- Interface radius is `7px`; capsules are reserved for the live listening action only when its geometry requires it.
- Animal silhouettes must be asymmetric and anatomically directional.
- The shark uses a long spindle body, narrow caudal peduncle, heterocercal tail, integrated fins and a tapered snout.
- Koi keep irregular scale highlights, translucent fin edges and independent tail motion.
- Shrimp dart backward, crabs move sideways, seahorses bob upright, cuttlefish pulse their mantle, sea cucumbers contract, and sea-urchin spines breathe with the current.
- Species remain recognizable through silhouette and motion rather than emoji-like styling.

## Components

- Sound readout: a restrained numeric dB value and a thin reactive bar.
- Quiet progress: optional perimeter label with a hide/restore control.
- Settings panel: opaque enough for legibility, visually flat, and subordinate to the aquarium.
- Toast: compact rectangular glass label; status acknowledgement only.
- Buttons: native semantic buttons with visible hover, active and focus-visible states.

## Do's and Don'ts

Do:

- Use countershading, denticle/scales, soft tonal variation and moving caustics on animals.
- Give every species a different motion rhythm.
- Keep number badges separate from animal bodies and share one 1–50 pool across species.
- Keep the shark moving even when calm; quiet changes intent, not whether it is alive.
- Preserve a clear path from sound level to shark behaviour.

Don't:

- Add smooth oval shadows beneath animals in open water.
- Use radial white gloss, uniform gradients or large triangular teeth.
- Stack translucent cards over the scene.
- Add coral, neon outlines, plastic foliage or decorative UI with no function.
- Turn new residents into flat stickers or reuse one swimming motion for every species.
