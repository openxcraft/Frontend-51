# 09 — Accessibility: brand-voice-guardian

## Keyboard map (critical paths)
- **CP-1**: profile editor standard form order; import via I; calibration via K; conflicts surfaced in a dialog requiring explicit choice.
- **CP-2**: findings triage is keyboard-first (P18): ↑/↓ navigate, A accept, D dismiss (reason dialog), B bulk by class; focus moves with selection; announcement per resolution polite.
- **CP-3**: history list standard; R on record → export; export progress via job row.
- Paste surface: standard textarea; run via ⌘⏎.

## Announcement schedule
| Event | Mode | Copy shape |
|---|---|---|
| Check started/completed | polite | "بدأ التدقيق / اكتمل — ٥ نتائج" + class counts |
| Finding focused | polite (on focus, not on render) | class + excerpt first words |
| Finding resolved | polite | "accepted fix" / "dismissed — reason" |
| Clean pass | polite | "Clean pass — 0 findings against 214 rules" |
| Profile conflict | assertive | both terms + choice required |
| Report ready/expired | polite | artifact + expiry |

## Per-surface checklist
- S2 findings: class signaled icon+text; span highlights ≥3:1 against both themes; dismissed findings retain visible reason (not strikethrough-only).
- S1 paste: content renders with dir=auto + bidi isolation (checked text keeps ITS direction — rtl-rules §2); 400% zoom single column.
- S6 records: read-only semantics correct (no dead controls); export button single clear target.
- S4 profile editor: glossary table P18 grid navigation; conflict dialog focus-trapped with return.
- Overlay: none (no fintech/health/legal data processing beyond Tariq's own compliance usage — his overlay obligations are about export fidelity: timestamps + actors preserved in reports, verified in matrix).

## RTL/LTR verification matrix
Per S1–S8 both directions: paste content direction rendering (dir=auto), finding span highlighting in mixed text (bidi-safe), findings list mirroring, counts/numerals Western, timestamps LTR-embedded in Arabic chrome (isolated), truncation, 400% reflow. Seeded doc-2 (mixed ar/en) is the fixture.
