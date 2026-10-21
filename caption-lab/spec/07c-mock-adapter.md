# 07c — Mock Adapter: caption-lab

In-memory, deterministic, zero deps. Implements `CaptionLabAdapterV1`.

## Seeds (fixed)
- **Projects** (3): "Lecture — Fiqh series ep.4" (42 min, 612 cues, 18 still-proposed cues, 7 over-gate, 2 bidi-complex with Latin terms), "Course module — Onboarding" (12 min, 184 cues, clean), "News clip batch" (4 short projects, broadcast preset).
- **Cues**: fixed texts including the RTL-break stress strings (long joined words, punctuation-mirroring cases, mid-word-break hazards), tashkeel-loaded lines, mixed ar/en lines with isolated Latin runs, numeral-policy cases (Western vs Arabic-Indic candidates).
- **Presets** (4 shared): "Broadcast Arabic Burn-in" (Noto Kufi Arabic 500, stroke 2px, bottom-safe), "E-learning Large" (18 CPM gate config), "Lecture Standard", and one versioned preset at v3 with a client-imported variant carrying 2 spec conflicts.
- **Jobs history**: one completed alignment (proposed 18), one bulk-apply (applied 594, skipped 18 = proposed), one export bundle (4 formats; one expired artifact).

## Behavior
- `createProject`: alignment Job paces deterministically (per-cue progress, 60ms/cue capped for demo at 300 cues); plain-text input produces ALL cues as proposed (honest); timecoded formats produce verified cues except seeded ambiguities.
- `suggestBreaks`: returns 1–2 options per seeded cue from fixed break tables; conflict cases (rule clash) return both options with ruleNote.
- `updateCue`/`nudgeTiming`: revisioned; overlap flags recompute deterministically; stale revision → CONFLICT.
- `bulkApply`: per-cue skip list (proposed cues skipped by policy); failed-only retry semantics via job retry.
- `exportProject`: per-format artifacts; proposed-cue watermark flag baked when applicable; burnin-spec artifact renders the preset's render-instruction document; idempotent re-run returns same artifact ids.
- `requestPreview`: returns fixed still refs; project without mediaRef → NOT_FOUND with honest copy hook (no fake stills).
- Error injection per method via MockConfig {latencyMs, errorRate, errorCode}; fixed correlationIds `cl-corr-0001`…

## Test-support
reset/snapshot/replay. No randomness, no network; preview "frames" are deterministic placeholder refs (spec honesty: preview rendering is an abstract capability — 08 N2).
