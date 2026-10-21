# 09 — Accessibility: social-clip-cutter

SME-F pass · WCAG 2.2 AA floor (a11y-baseline.md), both directions, 200%/400% zoom, 1280px + 360px viewports. Modified-key shortcuts only (Arabic-layout conflict class — a11y-baseline §3); every shortcut has a visible button/menu equivalent.

## Keyboard map (critical paths)

**Global**: ⌘K palette (bilingual normalized search — P05) · skip-to-content link (ux-guidelines row 45) · focus-visible at 2.4.13 strength (≥2px ring, #8048B6 at 5.47:1 on paper) · escape closes the topmost overlay and returns focus to its trigger (trap-free guarantee).

**CP-1 (board/import)**: board cards are arrow-navigable grid cells (P18: ←/→ physical mapping stable — inline-end arrow = next item in BOTH directions, rtl-rules §4); Enter opens the workbench; quick-add via its button, not a raw key. Import dialog: format select → paste textarea → import (submit disabled while parsing; loading state per ux-guidelines rows 32/61); the untimed `awaiting-input` path is a radio group + confirm, focus-trapped, escape restores.

**CP-2 (search & selection) — the a11y-critical surface**:
- Transcript pane: ↑/↓ move segment focus (focus moves scroll, never the reverse — P19); Home/End first/last page; focus announces "المقطع 218، الدقيقة 14، المتحدث 2" / "Segment 218, minute 14, speaker 2".
- Search: ⌘F focuses the search box (the palette is ⌘K; the pane search is distinct); results announce count politely; Enter jumps hit-to-hit; the normalization disclosure is a persistently readable line, not a tooltip.
- **⇧+↑/↓ extends the selection range** from the focused segment; the selection's derived duration announces on change ("المدة 42 ثانية" / "42 seconds"); **⌘Enter creates the clip** (single-chord, layout-safe).
- Highlight panel: cards are a focusable list (↑/↓); A accepts (the human promotion — explicit keypress, never auto); ⌘⇧A adjusts (opens the boundary stepper); D dismisses with 7s undo; rationale text is real content, read in order.

**CP-3 (boundaries)**: boundary handles are focusable stops: ←/→ move by one segment (⇧ ×5); the offset stepper responds to ↑/↓ (±250ms) and accepts direct numeric entry (validated against the anchor's duration — errors reference the field via described association); snap-to-pause is a button on the focused handle; Delete removes the clip with undo. Drag has the handle keyboard equivalent throughout (WCAG 2.2 §2.5.7).

**CP-4 (burn-in studio)**: the direction toggle is a two-option radio group (RTL / LTR) — the preview re-renders on change and announces the active direction ("المعاينة من اليمين إلى اليسار" / "Preview right-to-left"); placement nudges via arrow keys (1% height steps, bounded ±10%); warnings are a focusable list; each warning Enter-jumps to its fix control (fixTarget linkage from 07a); style picker is a listbox with on-clip preview announced by style name + family.

**CP-5 (export)**: bulk selection via space on clip rows (P07 action bar); the export composer is a dialog with the quota meter announced before submit; the recipe path is a co-equal button in tab order BEFORE the render button in RTL reading order is NOT manipulated — both are equal-order peers, never a nested "more options" disclosure; job rows: Enter opens detail, C cancels, R retries the failed scope.

**Preview stage**: Space toggles play ONLY while the stage holds focus (no global capture — no autoplay, a11y-baseline §6); ←/→ seek ±5s, ⇧ ±15s; state announced; glyphs unmirrored in RTL (rtl-rules §2 — recorded in 06).

## Announcement schedule (live regions; every announcement pairs with a visible surface — a11y-baseline §4)

| Event | Mode | Copy shape |
|---|---|---|
| Import progress | polite | "تحويل 340 من 912 مقطعاً" / "Converting 340 of 912 segments" (written labels — async-contract §3) |
| Import done | polite | segment count + detected format + language |
| Untimed awaiting-input | assertive | duration needed now — action stated |
| Search results | polite | count + range ("3 نتائج من 912 مقطعاً") |
| Selection range change | polite | derived duration |
| Highlight pass done | polite | candidate count + top score ("7 مرشحين، أعلى تقييم 0.86") — never per-card |
| Clip created (signature moment) | polite | title + duration + "حدّد مواصفة الحرق" next step |
| Boundary moved | polite | boundary + segment index + offset (mono numerals) |
| Spec lint change | polite | warning count delta, up OR down |
| Autosave cycle | polite | "جارٍ الحفظ…" → "حُفظ" (fades) |
| Conflict | assertive | both versions kept, choice required |
| **Export queued** | polite | batch size + mode ("6 مقاطع، مع الحرق") |
| **Export progress** | polite | per-clip written label ("تصدير الكليب 3 من 6") — announced on clip change, not per tick |
| **Export partial failure** | assertive | succeeded count + failed clip named + scoped retry offered |
| **Export ready** | polite | artifact count + expiry ("5 ملفات، تنتهي بعد 7 أيام") |
| Artifact expired | assertive | renewal action stated |
| Credential state change | polite | kind + state (never any secret — credential-contract §7) |
| Rate-limit window | assertive once | reset time + recipe path affirmatively stated |

Decorative texture (preview safe-zone frame grid, playhead) is never announced; validation errors reference their field via described association (a11y-baseline §5).

## Per-surface WCAG 2.2 AA checklist

- **S1 board**: cards ≥24×24 targets; stage chips icon+text; filtered-empty declares itself (P01/P08).
- **S2 workbench**: zones are landmark regions with programmatic names; boundary handles ≥24px hit areas (dense-surface spot-audit target — a11y-baseline §8.5); focus never obscured by the sticky export bar (2.4.11 — scroll-margin token obligation); 400% reflow: zones stack, no two-dimensional scroll; transcript measure 65–75ch.
- **S2 transcript**: bidi isolation on mixed-script segments (`dir="auto"`); truncation at word boundaries with expand (ux-guidelines row 84) — worst-case Arabic tested ("مستشارو التدقيق والحوكمة" class, rtl-rules §5); `needsReview` chips perceivable without color.
- **S3 highlights**: reserved region sized pre-arrival; scores carry their labels, not just bar lengths; zero-candidate empty is honest text.
- **S4 boundaries**: offset numeric entry has a persistent label (ghost text is never the label — a11y-baseline §5); range validation announces the legal bounds.
- **S5 burn-in studio**: **the caption preview passes contrast in BOTH directions** — the caption style's text-vs-frame contrast is computed and reported (05); warnings icon+text; the direction toggle's state is programmatic (radio group), not visual-only; tashkeel toggle announces line-height widening.
- **S6 export composer**: quota meter announced before submit; recipe/render buttons equal-order peers; submit feedback per rows 32/61.
- **S7 jobs**: per-clip progress is text+bar (never bar-only); cancel/retry are distinct buttons; partial-failure rows name the failed clip.
- **S8 artifacts**: expiry timers announced with the action; download/renew distinct buttons, never auto-redirect; file kinds icon+text.
- **S9 settings/credentials**: secrets masked by construction; the creation-time single display is copyable with the copy action announced; no secret in any URL/log/announcement (credential-contract §7).
- **Overlays**: focus-trapped modals with return-to-trigger; destructive confirms name count + consequence (P04 — episode-source delete is level 3 type-to-confirm).

## RTL/LTR verification matrix (per surface, both directions — rtl-rules §5)

For S1–S9 in ar and en: pure-Arabic render · pure-English render · mixed strings (Latin product names inside Arabic transcript segments and CAPTION lines — bidi isolation verified in the transcript pane AND the burn-in preview) · numeral rendering (Western everywhere incl. Arabic strings; timecodes LTR-isolated mono inside RTL prose) · embedded Latin/numeric tokens · board grid column order mirrored, alignment held · forms: labels/inputs and error placement on the correct inline edge · truncation at 320px container with worst-case Arabic · 400% zoom reflow (stacked zones, no horizontal scroll) · ⌘K normalization (alef/hamza, taa marbuta/heh, yaa/alif maqsura, tashkeel stripping) · **the burn-in preview direction pair: identical spec data renders RTL and LTR with the mixed-run fixture intact in both (the CP-4 core check; ES-2 seed is the fixture)** · caption sidecar files carry per-line direction policy. Fixtures: ES-1 (Arabic + Latin runs, 912 segments — virtualization + isolation), ES-2 (mixed-direction caption line — bidi lint proof), ES-3 (English — LTR citizen), ES-5 (untimed — awaiting-input path) from 07c.

## Reduced-motion contract (motion-language §5)

Energetic set collapses: the clip-ready pop → state chip ("أُنشئ الكليب" appears, no movement); boundary snaps → instant + announcement; highlight cards → paragraph-chunk settles; page transitions → hard cuts; the playhead continues (it rides the media clock — content, not chrome motion). A reduced-motion pass of CP-1…CP-5 is a release-gate item (a11y-baseline §8.6).
