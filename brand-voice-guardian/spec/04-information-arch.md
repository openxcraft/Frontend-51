# 04 — Information Architecture: brand-voice-guardian

## Navigation model
Left rail: Check · Profiles · History · Reports. Single primary action surface (Check) is the home. ⌘K palette (P05) reaches profiles, history records, actions. Two-level: section → detail (profile editor, record view).

## Screen inventory (8)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Check surface | paste/upload → run pass | runCheck(Job), getJob |
| S2 | Findings review | grouped findings, accept/dismiss | getCheckResult, resolveFinding |
| S3 | Profiles list | profile cards + health | listProfiles |
| S4 | Profile editor | glossary, banned, register, samples | getProfile, updateProfile, importTerms(Job) |
| S5 | History | pass records list | listRecords(query) |
| S6 | Record view | findings + resolutions, export | getRecord, exportReport(Job) |
| S7 | Jobs center | import/calibration/export jobs | listJobs |
| S8 | Settings/members | workspace basics | getSession, member ops |

Mobile (360–767px): S1 (paste+run), S2, S6 read. Profile editing desktop/tablet.

## Per-screen state obligations
Four empties per P01 (first-run profile, no-history, no-access, filtered-empty); skeletons mirror list/finding geometry; error classes per 03 mapping; copy matrix in 11.

## IA decisions and rationale
- **Check is the home**: the product IS the five-minute loop (Salma) — navigation depth is the enemy.
- **Findings review is a working list, not a document**: keyboard-first triage (P18) with accept/dismiss as first-class actions.
- **Records are immutable audit objects**: profile edits never rewrite history (CP-3 edge) — the IA keeps records read-only by construction.
- **Profiles carry version + health**: governance trust requires visible coverage, not vibes.
