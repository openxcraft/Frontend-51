# 04 — Information Architecture: interactive-story-builder

## Navigation model

Two-level: section → story context. Left rail (mirrors in RTL): Stories · Templates · Jobs & exports · Settings. Inside a story the rail becomes story navigation: outline · sync · preview · QA · review · export — sticky across subsurfaces so sync/QA/review operate on the open story without re-navigation. ⌘K/Ctrl+K palette (P05) reaches stories, chapters, templates, commands (Tier 3 includes it: list surfaces exceed three).

## Entity overview

Workspace → Stories → Chapters (ordered) → Steps (ordered). A Step = shared structure + per-locale `LocaleVariant`s (ar/en) + optional MediaRef + optional per-locale layout override. SyncReport and QaReport are derived; ReviewNote, Job, ExportArtifact, ActivityEntry attach at story level. Contracts: 07a/07b.

## Screen inventory (10)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Story library | list, filter, new, duplicate, delete | listStories, createStory, deleteStory, duplicateStory |
| S2 | Template gallery | arc skeletons with anatomy previews | listTemplates |
| S3 | Outline editor | chapter rail + step board (CP-1); story details (title/theme/direction) edit in place; suggestion panel (CP-4) | getStory, updateStoryDetails, listChapters, listSteps, createChapter, updateChapter, reorderChapters, deleteChapter, createStep, updateStep, reorderSteps, deleteStep, suggestStructure |
| S4 | Step editor | scroll canvas + inspector (CP-1.5) | createStep, updateStep |
| S5 | Sync panel | bilingual alignment grid (CP-2) | getSyncState, listSteps, updateStep |
| S6 | Preview | live render, direction toggle (CP-1.6/CP-3) | story state (client render) |
| S7 | QA report | findings, jump-to-step (CP-3.5) | validateStory |
| S8 | Review surface | notes, approve (CP-5.1–5.3) | addReviewNote, listReviewNotes, resolveReviewNote, setStoryStatus |
| S9 | Jobs & exports | job states, export initiation (CP-5.5), artifacts, renew/cancel | exportStory, listJobs, cancelJob, getExportArtifact, renewExportArtifact |
| S10 | Settings | locale/numeral policy, direction default, usage, activity | getSession, getUsage, listActivity |

Mobile (≤767px): S1, S6 (single direction), S7 read-only; S3/S4/S5 ≥1024px.

## Per-screen state obligations

Four empties per P01 where each applies (library, templates, sync, jobs — copy matrix in 11). Skeletons mirror final geometry per direction (P02). Errors per 03 mapping. Preview never skeletons the story body — only unloaded media gets poster frames.

## IA decisions and rationale

- **The story context is the IA spine**: sync, QA, review, and preview are views of one story — bilingual parity must be reachable without losing authoring context.
- **Templates are a first-class section**, not an onboarding modal: they are the AI-degradation substrate (CP-4 rung 3) and Farida's coursework base.
- **Jobs consolidate exports + suggestions** (async-contract §7 Tier 3 consolidation) with link-to-context per row.
- **No member management surface** (LOOP-10): roles arrive via session; settings shows policy, not people.
