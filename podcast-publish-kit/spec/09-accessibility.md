# 09 — Accessibility: podcast-publish-kit

SME-F pass · WCAG 2.2 AA floor (a11y-baseline.md), both directions, 200%/400% zoom, 1280px + 360px viewports. Modified-key shortcuts only (Arabic-layout conflict class — a11y-baseline §3); every shortcut has a visible button/menu equivalent.

## Keyboard map (critical paths)

**Global**: ⌘K palette (bilingual normalized search — P05) · skip-to-content link (ux-guidelines row 45) · focus-visible at 2.4.13 strength (≥2px, ≥3:1 change-contrast, focus ring #726400 at 5.4:1 on paper) · escape closes the topmost overlay and returns focus to its trigger (trap-free guarantee).

**CP-1 (board/import)**: board cards are arrow-navigable grid cells (P18: ←/→ physical mapping stable — inline-end arrow = next item in BOTH directions, per rtl-rules §4); Enter opens the workbench; quick-add via its button, not a raw key. Import dialog: format select → paste textarea → import (submit disabled while parsing, loading state per ux-guidelines rows 32/61); untimed awaiting-input path is a radio group + confirm, focus-trapped, escape restores.

**CP-2 (timeline & marking)** — the a11y-critical surface:
- Transcript pane: ↑/↓ move segment focus (focus moves scroll, never the reverse — P19); Home/End first/last page; focus announces "المقطع 218، الدقيقة 14، المتحدث 2" / "Segment 218, minute 14, speaker 2".
- **⌘Enter marks a chapter boundary at the focused segment** (single-chord, layout-safe); boundary handles are focusable stops on the timeline: ←/→ move by one segment, ⇧←/→ by five; Enter opens the rename editor (P06 inline: escape restores, tab commits+advances); Delete removes with 7s undo (P03).
- Suggestions panel: cards are a focusable list (↑/↓); A accepts (the P15 promotion — explicit keypress, never auto), ⌘⇧A adjusts, R rejects; rationale text is real content, read in order.
- Timeline drag has the boundary-handle keyboard equivalent throughout (WCAG 2.2 §2.5.7).
- Playback bar: Space toggles play ONLY while the bar holds focus (no global capture); ←/→ seek ±10s, ⇧ versions ±30s; state announced.

**CP-3 (notes)**: ⌘↑/⌘↓ move between sections; the two locale columns are one logical form (reading order: section → ar field → en field, matching visual order in both directions); ⌘⇧P inserts the chapter list; parity indicators are text+icon (never color-only — ux-guidelines row 37).

**CP-4/CP-5 (checklist/package/delivery)**: checklist items are checkboxes with fix-links (Enter follows); sign-off toggles disabled while derived blockers exist (announced why); package digest table is a real table (column headers, scoped); delivery confirm names package version + channel (P04 level 2).

## Announcement schedule (live regions; every announcement pairs with a visible surface — a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Import progress | polite | "تحويل 340 من 912 مقطعاً" / "Converting 340 of 912 segments" (written labels, not bare percentages — async-contract §3) |
| Import done | polite | segment count + detected format + language |
| Untimed awaiting-input | assertive | duration needed now — action stated |
| Suggestion stream start/end | polite | start announced once; end = count + confidence summary (never per-card — P13) |
| Suggestion stalled >8s | polite | stall declared, retry offered |
| Chapter boundary moved | polite | chapter n + segment index |
| Chapter deleted → undo window | polite | what was deleted + undo availability |
| Autosave cycle | polite | "جارٍ الحفظ…" → "حُفظ" (fades) |
| Conflict | assertive | both versions kept, choice required |
| Package built | polite | version + artifact count + expiry |
| Delivery receipt | polite | channel + receipt reference |
| Assist unavailable (rung 4) | assertive once | manual marking continues — full function stated |

Streaming text tokens are never announced per-token (P13); decorative waveform texture is never announced; validation errors reference their field via described association (a11y-baseline §5).

## Per-surface WCAG 2.2 AA checklist

- **S1 board**: cards ≥24×24 targets; stage chips icon+text; filtered-empty declares itself (P01/P08).
- **S2 workbench**: three zones + drawer are landmark regions with programmatic names; boundary handles ≥24px wide hit areas (dense timeline spot-audit target — a11y-baseline §8.5); focus never obscured by the sticky playback bar (2.4.11 — scroll-margin token obligation); 400% reflow: zones stack (no two-dimensional scroll); transcript measure 65–75ch.
- **S2 transcript**: bidi isolation on mixed-script segments (`dir="auto"` per segment); truncation breaks at word boundaries with expand (ux-guidelines row 84) — Arabic worst-case strings tested ("مستشارو التدقيق والحوكمة" class, rtl-rules §5).
- **S2 timeline**: all state (untitled/missing-locale/overlap lint) is text+icon; time axis direction mirrors per rtl-rules §2 while playback glyphs do not (decision recorded in 06).
- **S4 suggestions**: reserved region sized pre-arrival (no CLS on stream — ai-native-patterns §2); confidence chips carry the word, not just hue.
- **S5 notes**: labels persist beside fields (never ghost-text-only); error summary on save failure focuses the first error; tashkeel toggle announces line-height widening.
- **S6 checklist**: sign-off state changes perceivable without color; fix-links keyboard-reachable in list order.
- **S7 packages**: digest table readable linearly; expiry timers announced with the action; download/renew are distinct buttons (never auto-redirect).
- **S9 credentials**: secrets masked by construction; the creation-time single display is copyable with the copy action announced; credential state changes announced; no secret in any URL/log/announcement (credential-contract §7).
- **Overlays**: focus-trapped modals with return-to-trigger; destructive confirms name count + consequence (P04).

## RTL/LTR verification matrix (per surface, both directions — rtl-rules §5)

For S1–S9 in ar and en: pure-Arabic render · pure-English render · mixed strings (Latin product names inside Arabic transcripts/notes — bidi isolation verified) · numeral rendering (Western everywhere incl. Arabic strings; timecodes LTR-isolated mono inside RTL prose) · embedded Latin/numeric tokens · board grid column order mirrored, alignment held · timeline axis mirrored (0:00 at inline-start) with unmirrored playback glyphs · forms: labels/inputs and error placement on the correct inline edge · truncation at 320px container with worst-case Arabic · 400% zoom reflow (stacked zones, no horizontal scroll) · ⌘K normalization (alef/hamza, taa marbuta/heh, yaa/alif maqsura, tashkeel stripping) · chapter-list block rendering inside per-locale notes columns · dual-calendar display (P24) with active system explicit. Fixtures: Ep 47 (mixed-script), Ep 49 (parity), Ep S2E3 (untimed) from 07c.

## Reduced-motion contract (motion-language §5)

Energetic set collapses: package-sealed overshoot → state chip; boundary snaps → instant + announcement; suggestion cards → paragraph-chunk settles; page transitions → hard cuts. A reduced-motion pass of CP-1…CP-5 is a release-gate item (a11y-baseline §8.6).
