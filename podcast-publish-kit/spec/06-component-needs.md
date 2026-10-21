# 06 — Component Needs: podcast-publish-kit

## Shared primitives consumed

Button, Menu, Dialog, Tabs, Tooltip, Toast, Skeleton, EmptyState, FilterChips, JobRow, DiffView (suggestion before/after), QuotaMeter (assist runs, P14), ActionBar (bulk chapter actions), CommandPalette (⌘K — P05), AutosaveIndicator (P10), ConfirmLadder (P04 levels 1–3).

## Invented components (6)

| Component | Purpose | Obligations (behavior · states · a11y) |
|---|---|---|
| **ChapterTimeline** (mandated: transcript-aligned chapter timeline) | horizontal ruler over the episode duration: chapter blocks (olive fill), segment ticks (amplitude texture), clay playback head, boundary handles | Boundaries snap to segment starts ONLY (never free timecodes); drag has keyboard equivalent (boundary selected + ←/→ by segment — WCAG 2.2 §2.5.7); time axis runs inline-start→inline-end and MIRRORS in RTL while playback glyphs (play/pause/seek/volume) do NOT mirror (rtl-rules §2 — decision recorded here per §2 icon-flipping rule); states: empty (no transcript → ruler with guidance), timing-pending (no duration), lint chips (untitled / missing-locale / sub-minute / overlap) rendered icon+text; hover/focus boundary highlight <80ms (10); announced politely: boundary moved → "الفصل 3 يبدأ الآن عند المقطع 217" / "Chapter 3 now starts at segment 217" (mono numerals); waveform texture is decorative — every fact it suggests is also text |
| **TranscriptPane** | virtualized segment list with per-segment direction rendering and inline edit | Virtualize >200 segments (P19; row-count context on region entry for SR); per-segment `dir` auto with bidi-isolated Latin runs; P06 inline edit (escape restores, tab commits+advances, focus never trapped); `needsReview` flag visible as chip + filter; focused segment announces index + timecode + speaker; measure 65–75ch (ux-guidelines row 73); selected-segment ↔ timeline playhead sync (scroll never moves focus — focus moves scroll) |
| **ShowNotesComposer** (mandated: bilingual show-notes editor) | P23 dual-column section editor (summary · takeaways · links · guest · chapter-list · CTA) with parity indicators | Per-side direction rendering; alignment links between corresponding blocks; sync states: in-sync / edited-since / missing-locale / length-far-apart (takeaways count vs prose length heuristics, disclosed); chapter-list block is GENERATED from chapters (re-renders on change, edited-since marker); links are shared objects (one URL, bilingual labels); tashkeel toggle widens line-height with notice (rtl-rules §3); autosave P10 cycle with conflict both-versions view; keyboard: section navigation by ⌘↑/⌘↓, insert-chapter-list ⌘⇧P; single-locale "ship as-is" toggle is explicit and checklist-visible |
| **EpisodeChecklistPanel** (mandated: episode checklist) | derived completeness items + human sign-offs in the workbench drawer | Derived items link directly to their fix surface (the exact chapter/section — navigation, not scolding); sign-off items (final listen-through, guest approval) are toggles with actor+timestamp (P17); states: open / done / blocked (blocked = derived unmet, action-linked); announced on change; sign-offs cannot be toggled while a derived blocker exists (state honesty) |
| **EpisodePlayerBar** | persistent playback bar for the LOCAL audio reference (never uploaded — 07a) | File chosen from disk client-side; if absent, disabled with rationale ("الاستماع يتطلب ملف الصوت على جهازك — لا يُرفع أبداً" / "Listening needs your audio file on your machine — it never uploads"); full keyboard control (space play/pause when bar focused, ←/→ seek ±10s, shift for ±30s) with state announcements (a11y-baseline §6); glyphs unmirrored in RTL; time displays mono Western numerals LTR-isolated; seek to segment via transcript pane focus action; no autoplay, ever |
| **SuggestionReviewPanel** | reserved region for chapter suggestions (P13) | Streams cards with rationale + confidence chip (icon+text — never color-only); accept = explicit promotion (P15) creating a real chapter with `origin:'assist'`; adjust-before-accept; reject with 7s undo; stall >8s declares stalled with retry; partial results retained + marked; quota context before run (P14); region size reserved pre-arrival (CLS ≤0.02) |

## Reused-with-twist

- **DiffView**: suggestion "adjust" mode shows proposed vs adjusted title/boundary (block-level, direction-aware — P16).
- **EmptyState**: board first-run embeds the value checklist (P22) + sample-episode action (interactive empty, not dead text).
- **JobRow**: import/suggestion/build/delivery rows with determinate segment/chapter counts ("تحويل 340 من 912" style — async-contract §3 written-label rule).
- **QuotaMeter**: assist runs in the buyer's work units; warn at 80% (P14); never red-panic below that.

## Layer-3 token additions

`timeline.boundary.handle.*`, `timeline.playhead.*`, `chapter.block.state.*` (untitled/missing-locale/ok), `notes.parity.state.*` (in-sync/edited-since/missing-locale/length-far), `checklist.item.state.*`, `player.timecode.mono.*` — all Layer 2 bindings, no raw values (token-architecture §2.1).

## Icon decisions recorded (rtl-rules §2 obligation)

Flip in RTL: chapter-bracket direction glyphs, next/previous segment arrows, drawer chevrons, external-link arrow. Never flip: playback controls (play/pause/seek/volume), magnifier, refresh, trash. Real-world-metaphor call: the "insert chapter list" glyph uses a list-with-timecode metaphor (reading-order anchored → flips); the waveform glyph is symmetric (never flips).
