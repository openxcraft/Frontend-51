# 04 — Information Architecture: caption-lab

## Navigation model
Left rail: Projects · Presets · Queue (exports/jobs). Project view: caption grid is the workspace; right context panel = cue inspector (line-break workbench, timing, policy flags); top bar = project title, media scrubber, reading-speed audience preset, export action. ⌘K palette reaches cues by timecode/text, projects, presets. Two-level: project → cue (inline inspector, not routed).

## Screen inventory (9)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Projects home | project list, onboarding checklist | listProjects |
| S2 | Import wizard | media + transcript input, alignment job | createProject, alignTranscript(Job) |
| S3 | Caption grid | the refinement workspace (CP-2) | listCues(query), updateCue, bulkApply |
| S4 | Cue inspector | text edit, line-break workbench, timing nudge | getCue, suggestBreaks, updateCue |
| S5 | Style studio | preset editor + live preview + legibility linter | getPresets, savePreset, previewFrame(Job) |
| S6 | Export queue | format jobs, artifacts | exportProject(Job), getArtifact |
| S7 | Jobs center | alignment/preview/export jobs | listJobs |
| S8 | Presets library | shared presets, versions | listPresets |
| S9 | Settings | numeral/tashkeel policies, audience presets | workspace ops |

Mobile/tablet (≤767px): S1, S6, S7 read; grid and studio are desktop/tablet-class surfaces (post-production posture per 00).

## Per-screen state obligations
Four empties (P01); cue-grid skeletons mirror row geometry; error classes per 03 mapping; full copy in 11.

## IA decisions and rationale
- **The grid is the product**: everything (inspector, workbench, meters) docks around the cue grid — a timecode-first working surface.
- **Presets are workspace-shared objects** (not user-private): Huda's desk consistency demand; versioned for reproducibility.
- **Style studio is separate from grid but preview-shared**: craft mode vs refinement mode are different attentions; the scrubber binds them.
- **Queue is a first-class rail item**: delivery (CP-4) is half the product's job.
