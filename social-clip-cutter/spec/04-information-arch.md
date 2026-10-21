# 04 — Information Architecture: social-clip-cutter

## Navigation model

Left rail (mirrored in RTL): **Episodes** · **Exports** · **Jobs** · **Settings**. Two-level: section → item; the clip workbench is an item detail with internal zone focus (transcript pane · clip rail · preview stage), with the burn-in studio as a workbench MODE (same item, spec-focused layout) rather than a separate route — the operator moves between cutting and captioning without losing the episode context. ⌘K command palette (P05, Tier 2 mandate: list surfaces exceed three) with bilingual normalized search (alef/hamza variants, taa marbuta/heh, yaa forms — rtl-rules §4) and recent items. Breadcrumbs: Workspace → Episode source → zone. Mobile (≤767px): board, exports, jobs, settings usable; the workbench stacks to a single column with a zone switcher (transcript / clips / preview); the preview stage degrades to an audio-less storyboard of segment cards.

## Entity overview (07a)

Workspace 1—N EpisodeSource; EpisodeSource 1—(0..1) Transcript; Transcript 1—N TranscriptSegment (ordered by index); EpisodeSource 1—N ClipSelection (each pinning a ClipBoundary over the transcript's segments); ClipSelection 1—1 BurnInSpec (caption style reference + placement + policies); CaptionStyle 1—N BurnInSpec (stock or workspace-scoped, versioned); EpisodeSource 1—N ExportJob (batches of clips); ExportJob 1—N ExportArtifact; Credential 1—N (capability grants: media-source read, notification-channel send); ActivityEntry logs consequential mutations (P17). Clip timecodes are DERIVED from segment anchors + bounded offsets — never authored, never stored as the source of truth (07a obligation).

## Screen inventory (9)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|--------|---------|---------------------|
| S1 | Episodes board | stage-column view of episode sources; quick-add; first-run value checklist (P22) | listEpisodeSources, createEpisodeSource, getEpisodeSource, deleteEpisodeSource, getSession |
| S2 | Clip workbench | the product's spine: transcript pane + clip rail + preview stage (CP-1/2/3) | getEpisodeSource, updateEpisodeSource, importTranscript, getTranscript, listSegments, updateSegment, searchSegments, findHighlights, createClip, listClips, getClip, updateClip, deleteClip, getJob, cancelJob |
| S3 | Highlight review panel | in-workbench reserved region: candidates with scores + rationale, accept/adjust/dismiss (CP-2.2–3) | findHighlights, createClip, listClips |
| S4 | Boundary editor mode | focused clip refinement: handles, offsets, live lint (CP-3) | getClip, updateClip, deleteClip, listClips |
| S5 | Burn-in studio mode | caption style picker + spec composer + dual-direction preview + warnings (CP-4) | listCaptionStyles, setClipBurnInSpec, getClip, saveCaptionStyle |
| S6 | Export composer | batch selection, options, quota context, queue + recipe path (CP-5.1–2) | listClips, getUsage, exportClips, getJob |
| S7 | Jobs center | filterable job list, per-clip progress, cancel/retry, activity link (CP-5.3) | listJobs, getJob, cancelJob, listActivity |
| S8 | Exports / artifacts library | per-clip outputs, sidecar files, manifest, expiry + renewal (CP-5.4) | listJobs, getArtifact, renewArtifact, getUsage |
| S9 | Settings | workspace defaults (duration bands, reading-speed presets, house style), credentials (media source / notification channel), activity log (CP-1.6, CP-5.7) | getSession, getUsage, listCaptionStyles, saveCaptionStyle, listCredentials, saveCredential, verifyCredential, revokeCredential, listActivity |

S3–S6 are workbench surfaces (S2 context) listed separately because each carries distinct state obligations and its own a11y pass; they are not separate routes (S4/S5 are modes; S6 opens as a composer drawer over the workbench).

## Per-screen state obligations

Four empties enumerated per surface (P01): board first-run (value checklist + sample episode), board filtered-empty (stage filter declares itself, reset action), exports first-run, jobs empty — copy in 11 §A. Skeletons mirror final geometry including direction (P02): board columns, workbench zones, artifact rows. Errors per the 03 mapping. Autosave indicator on spec and boundary edits (P10). Bulk action bar on the clip rail and exports library (P07).

## IA decisions and rationale

- **The workbench is the product** (one surface, three zones): the buyer's mental model is "this episode's clips" — zone focus follows the CP order (read/search → select → refine → caption → export) without route changes; route changes are crossfade ≤180ms (motion-language §3).
- **Burn-in studio is a MODE, not a route**: captioning decisions need the transcript and the clip in view (what am I captioning?); a separate "caption screen" would replicate the split-attention the category already suffers.
- **Board columns are derived stages** (Draft · Transcript · Clips · Specced · Exported), computed by the adapter from transcript/clip/spec/export state — no stored status to drift; the board is the pipeline's macro-view, the clip rail is its micro-view.
- **Jobs center is first-class at Tier 2** (async-contract §7): imports and exports are the product's two job classes; per-clip progress and scoped retry live here, linked from every job-emitting flow.
- **Exports is a library, not a toast**: artifacts persist with expiry + renewal; the sidecar files and the manifest make the library the handoff surface for the manual recipe path (LOOP-5).
- **Credentials live in Settings, not the import flow**: credentials are workspace-scoped infrastructure (credential-contract §5); CP-1 links there when the pull path has no active credential, then returns.
