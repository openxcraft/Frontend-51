# 13 — Reference Mockups: arabic-copy-studio

SME-D + SME-I + SME-K pass · Tier 1 obligations met: 5 curated references (with URLs) + 3 original proposals (with motion, a11y, and reduced-motion implications). Reference selection date: 2026-10-16.

## A. Curated references (what we take, and what we deliberately do not)

1. **iA Writer** — https://ia.net/writer
   Take: typographic first-person writing environment; typography as the interface; focus-mode discipline; the proof that a writing tool can have an *identity* instead of a chrome. Not taken: its single-font mono-culture (we are bilingual serif/sans hybrid per 05).

2. **Linear** — https://linear.app
   Take: keyboard-first craft, command palette execution quality, list-density with calm, motion restraint (their transitions are the crisp-personality benchmark). Not taken: the cold blue-neutral identity — our buyer needs warmth and manuscript authority, not ops chrome.

3. **Notion AI (inline AI interactions)** — https://www.notion.com
   Take: inline selection-driven AI affordances (the interaction precedent for DiffBrush); AI appearing where the text is, not in a distant chat. Not taken: generic sans identity, sparkle iconography, chat-first posture.

4. **Cursor (AI-native diff/apply patterns)** — https://cursor.com
   Take: accept/reject diff ergonomics at keyboard speed; the discipline of "AI proposes, human disposes, version trail records". Not taken: IDE density and dark-terminal aesthetic (reserved for funnel-drop-off-explorer's family identity).

5. **Stripe Docs (writing quality bar)** — https://stripe.com/docs
   Take: the editorial bar for our onboarding copy and error explanations — precise, honest, zero filler; the reference for how our 11 matrix copy should read to a professional.

6. *(Stretch reference)* **Amiri type specimens** — https://amirifont.github.io and Source Serif 4 — https://adobe-fonts.github.io/source-serif/ — taken for the typographic voice itself: what Naskh at reading sizes looks like on screen, and how pairing discipline is demonstrated.

## B. Original proposals (3 — none exist in current SaaS products; SME-K)

### B1 — The Ink Desk (layout proposal)
The editor composes like a manuscript desk: the document is a paper sheet with generous margins; the AI panel is a *margin tool* — annotations, suggestions, and glossary chips live in the margin gutter beside the text they concern (like illumination notes), never overlaying the writing surface. Transforms open the second sheet beside the first (Parity Weave as two sheets on one desk).
*Motion:* sheets settle with Ink Settle (05); margin notes ink-in at 120ms. *A11y:* margin annotations are DOM-adjacent to their passage (aria-describedby), keyboard reachable in reading order — the margin is a visual metaphor, never a focus-order trap. *Reduced motion:* notes fade in place, no settle.

### B2 — Register Dial (interaction proposal)
Register selection as a two-stop dial (بيضاء ↔ وسطى) with a live specimen line that re-renders in the target register as the dial moves — the writer *sees* the register before committing, like testing a nib. Dialect-tolerant is a third latch position that dims the drift-flag system visibly (state change is perceivable without color alone — icon + text).
*Motion:* specimen cross-fades per 90ms step. *A11y:* implemented as a radio group (09); dial is visual only — never a required drag (2.5.7). *Reduced motion:* specimen swaps instantly.

### B3 — Parity Weave (bilingual transform visualization)
Bilingual review as a woven structure: source and transform blocks are aligned rows; the *thread* between paired blocks thickens where fidelity is high and frays (visually, plus a text label) where length policy is violated or a glossary term is unmatched — the eye finds the problem rows before reading them. Term chips repeat in both columns so terminology parity is checkable without memory.
*Motion:* threads draw at 160ms (crisp, not playful). *A11y:* thread state is duplicated as text ("مطابق / فروق طول / مصطلح ناقص") — the weave is never the only signal; rows are a standard list to screen readers. *Reduced motion:* threads render at final state instantly.

## C. Mood anchors (verbal, for the implementation's art direction)

Manuscript paper under lamp light · ink density over screen glow · saffron used like a scribe's rubrication (rare, meaningful) · cut edges, not rounded plastic · the quiet of a study, not the hum of a dashboard.
