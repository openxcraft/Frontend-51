# 10 — Performance: meeting-notes-action-desk

## Route budgets (gzip JS)

S1 desk home ≤ 150KB · meeting-detail shell ≤ 200KB (S2 capture + S3 summary lazy +50KB; S4/S5 lazy +40KB) · S6 loop desk ≤ 120KB · S7 register ≤ 130KB · S9 palette ≤ 30KB incremental. Owner mode (≤767px) loads the S6 subset only, ≤ 110KB.

## Interaction budgets

- Register: keystroke-to-paint in normalized search ≤16ms; row focus highlight <80ms; virtualized window at 1,000+ action rows (P19) — scroll never moves focus.
- **Confirm/respond round-trip: <400ms perceived** — the commitment moment is the product's most-used write; the Settle renders inside the 120ms motion budget after state lands, and the disable-on-submit guard means the user never double-pays attention.
- Loop desk digest recompute after a response lands: ≤150ms (one confirmation must visibly move two queues — the owner's and the lead's).
- Summary job: progressive proposal emission at the Mock cadence (100ms/proposal); the summary region is reserved before arrival (CLS ≤0.02 per stream — ai-native-patterns §2); the surface stays interactive during the run.
- Cue-mode (deterministic) summarization at seed scale: ≤300ms synchronous-feel path for the cue scan of ≤500 segments (displayed as an honest job at larger scales rather than a spinner lie — async-contract threshold).
- Composer autosave debounce 800ms, save round-trip <400ms perceived (P10 calm cycle); pair-field sync warnings (unpaired/far-apart) recompute <50ms per keystroke.
- Capture import: 60ms/segment-chunk cadence, cancel real and fast (async-contract §2).
- Minutes preview render (bilingual, seed scale ≤200 segments + 30 actions): ≤500ms; export artifact generation is a Job with determinate stages.
- LCP ≤ 2.0s both directions; CLS ≤ 0.02 (summary region reserved; zone-chip changes are text-paired and never reflow the register row).

## Perceived-performance strategy

- Import, transcription, summarization, and export are honest Jobs (P12): determinate segment/proposal progress, cancellable, never faked-instant. Long imports show named-segment progress per async-contract §3.
- Zone derivation is server-side at read (07b rule 7) — the register never recomputes zones client-side, so 1,000 rows cost one page render, not 1,000 date comparisons.
- Assist-mode summarization keeps the deterministic result on screen until assist proposals arrive (no blank-waiting on the upgrade path).
- Exports deliver in-context when the surface is visible (async-contract §6 ladder 1); artifact link + expiry announced once.
- Offline (P20): reads work; confirmations, status changes, and composer edits queue with per-item state; jobs reconcile to authoritative state on reconnect — a queued confirm that raced a withdrawal surfaces the CONFLICT honestly on flush.
- No spinner on synchronous reads (asset-register's fast-path honesty): lists below the virtualization threshold render directly.

## Asset strategy

Readex Pro (400/500/600/700 ar+la) + DM Sans (400/500/700 en) subsets ≤ 150KB/direction; line-1.5 icon sprite single file; no font-display late-swap on the register (data-first paint); Arabic subset includes the tashkeel headroom line-box per rtl-rules §3 (no clipping reflow on diacritic-bearing segments).

## Data-path rules

Action pages ≤ 100/cursor (07b typed pagination); capture revisions ≤ 200 segments/page; register and loop desk virtualize >200 rows; summaries cached per id (immutable post-run — free re-reads); job polling only on visible surfaces (S9 / desk badges); every mutation carries an idempotency key (no double-confirm on retry — the commitment record is exactly-once by contract).

## Measurement protocol

1. Cold load S1 + meeting detail, both directions, desktop and owner-mode 360px (LCP/CLS/TBT).
2. Register benchmark: 1,000-row virtualized scroll + normalized bilingual search, p95 keystroke ≤16ms, zero focus loss.
3. Loop benchmark: confirm round-trip p95 <400ms; digest recompute ≤150ms; racing-response conflict path <600ms end-to-end.
4. Summary benchmark: seed-scale cue scan ≤300ms; assist-mode progressive emission with CLS ≤0.02 measured on the reserved region.
5. RTL + reduced-motion variants repeat 1–4 at identical budgets.
6. 400% zoom reflow pass on S2/S5/S6/S7 both directions, worst-case Arabic strings (a11y-baseline §8.3).
