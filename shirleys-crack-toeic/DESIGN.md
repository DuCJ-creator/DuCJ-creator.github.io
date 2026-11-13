---
version: alpha
colors:
  primary: "#002147"
  ink: "#071F3D"
  vellum: "#F1EEE5"
  cambridge: "#A3C1AD"
  antiqueGold: "#C4A35A"
  oxblood: "#7A2333"
typography:
  display:
    fontFamily: "Cormorant Garamond, Noto Serif TC, Georgia, serif"
    lineHeight: "1.05"
  body:
    fontFamily: "Noto Sans TC, system-ui, sans-serif"
    lineHeight: "1.65"
  utility:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    lineHeight: "1.4"
rounded:
  DEFAULT: "14px"
  compact: "8px"
  pill: "999px"
spacing:
  compact: "0.5rem"
  standard: "1rem"
  section: "clamp(3.5rem, 8vw, 7rem)"
components:
  examMatrix:
    backgroundColor: "{colors.cambridge}"
    textColor: "{colors.ink}"
    rounded: "0px"
  studyCard:
    backgroundColor: "{colors.vellum}"
    textColor: "{colors.ink}"
    rounded: "2px"
  focusRing:
    backgroundColor: "{colors.primary}"
    rounded: "2px"
  listeningBadge:
    backgroundColor: "{colors.antiqueGold}"
    textColor: "{colors.ink}"
    rounded: "999px"
  correctionKey:
    backgroundColor: "{colors.vellum}"
    textColor: "{colors.oxblood}"
    rounded: "2px"
---

## Overview

Shirley's Crack TOEIC is an academic coaching desk for Taiwanese learners preparing for the TOEIC Listening & Reading test and university study. Its North Star is an Oxbridge college prospectus crossed with a precise exam answer sheet: scholarly, assured, restrained, and highly legible. This is a visual register only; the product must never imply institutional affiliation.

The language policy is English-first with immediate Traditional Chinese support. Navigation, actions, instructions, feedback, strategies, and explanations expose learners to authentic English while the smaller Chinese layer protects comprehension. English and Chinese are not separate modes; they are read together in one learning surface.

The product register leads. The signature is the interactive 200-cell exam matrix; it is the only visually loud element. Avoid generic purple gradients, glass cards, dashboard KPI tiles without meaning, and motivational copy that does not lead to an action.

## Colors

Oxford blue and vellum establish the institutional structure. Cambridge blue distinguishes Reading, antique gold distinguishes Listening and progress, and oxblood is reserved for correction or urgency. Color never carries meaning alone. Avoid electric blue, saturated gradients, and bright app-like accents.

## Typography

Cormorant Garamond gives English headings a classical publishing voice; Noto Serif TC carries the same authority into Traditional Chinese. Noto Sans TC supports mixed-language body copy. IBM Plex Mono is reserved for time, score, question counts and part labels. Text remains readable at 200% zoom, with no all-caps paragraph copy.

## Layout

Desktop uses a narrow fixed study rail and a fluid reading canvas. Mobile changes to a compact header and horizontally scrollable section navigation. Content width is deliberately limited for sustained reading; the exam matrix can use the wider canvas.

## Elevation & Depth

Depth comes from vellum layers, double rules, Cambridge-blue offset edges and one restrained shadow. Hover motion never shifts essential layout. Sticky controls use an opaque paper surface so focus and text are not obscured.

## Shapes

Cards and primary controls use near-square 2px corners, echoing bound academic publications; utility chips may use full pills. Exam cells and answer choices use compact geometry. Avoid excessive circles, decorative blobs, literal coats of arms, crests or faux heraldry.

## Components

Every interactive card is a real button or contains explicit controls. Search has a visible clear control. Feedback is announced through a shared live-region toast. Quiz answers expose selection and correctness in text and color. Listening practice keeps the punctuated display transcript separate from speech playback, which is segmented by sentence, answer option, or speaker turn to preserve natural pauses. Transcript reveal remains the accessible fallback.

The University curriculum treats all six topics from *Ready for University* as content: personal management, time and stress, efficient listening and reading, note-taking, library research, and essay writing. The Proofreading Lab follows a planted-error model with an explicit bilingual correction key; its content is original and never copied from a reference tool. Its curriculum covers all 22 textbook grammar rules, the additional categories in the Essential Grammar Mind Map, and six integrated reviews: 40 activities and 120 grammar decisions in total.

## Do's and Don'ts

- Do connect every number to the actual TOEIC structure.
- Do keep bilingual labels concise and consistent.
- Do preserve learner input and progress locally.
- Do respect reduced-motion preferences and keyboard navigation.
- Don't reproduce official exam questions or imply ETS endorsement.
- Don't hide essential instructions behind hover states.
