# 09 — Accessibility: caption-lab

## Keyboard map (critical paths)
- **CP-1**: import wizard standard forms; alignment job progress announced politely.
- **CP-2 (the craft loop)**: ↑/↓ cue navigation; Enter opens inspector; Tab cycles break options; Enter applies break; [ ] nudge timing by frame; S splits cue (confirmation); B opens bulk bar; G jumps to next over-gate cue (the QC accelerator — Huda's key).
- **CP-3**: scrubber arrows frame-step (with shift ×10); preset fields standard; linter findings as focusable list.
- **CP-4**: export via ⌘E; queue standard list.

## Announcement schedule
| Event | Mode | Copy shape |
|---|---|---|
| Alignment done | polite | cue count + proposed count |
| Cue navigation | polite (sparse — every 5th or on flag) | "cue 214 of 612 — over gate, 23 words per minute" |
| Break applied | polite | option note |
| Speed gate cleared | polite | "under the gate — 17 words per minute" |
| Overlap detected | assertive | adjacent cue ids |
| Export ready | polite | formats + expiry |

## Per-surface checklist
- S3 grid: flags icon+text+number (never color-alone); virtualization keeps focus stable (P19); row targets ≥24px.
- Cue text rendering: per-cue direction (bidi isolation); tashkeel line-height growth does not clip in inspector (rtl-rules §3); timecodes LTR-embedded mono.
- S5 preview: when unavailable, the disabled state explains why and what still works (08 N1) — a11y honest-state discipline.
- S6 queue: per-format results as text; partial failures carry per-format retry actions.
- 400% zoom: grid degrades to single-cue cards; inspector full-width; scrubber operable at 400%.

## RTL/LTR verification matrix
Per S1–S9 both directions: cue text direction per cue; timecode embedding LTR in Arabic chrome; break-workbench mirroring (line order integrity — the product's core promise); punctuation mirroring in previews; mixed cues (seeded fixtures); grid column order; scrubber direction convention (playback controls do NOT mirror — rtl-rules §2); truncation; 400% reflow.
