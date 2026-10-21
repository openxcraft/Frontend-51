# 04 — Information Architecture: podcast-publish-kit

## Navigation model

Left rail (mirrored in RTL): **Episodes** · **Packages** · **Jobs** · **Settings**. The rail is two-level: section → item; the episode workbench is an item detail with internal zone focus (transcript · timeline · notes · checklist drawer), reachable from any board card. ⌘K command palette (P05: list surfaces exceed three — board, packages, jobs, episodes-within-show) with bilingual search normalization (alef/hamza variants, taa marbuta/heh, yaa forms — rtl-rules §4) and recent episodes. Breadcrumbs: Show → Episode → zone. Mobile (≤767px): board, packages, jobs, settings usable; workbench stacks with a zone switcher; playback bar persists.

## Entity overview (07a)

Workspace 1—N Show; Show 1—N Episode; Episode 1—(0..1) Transcript; Transcript 1—N TranscriptSegment; Episode 1—N Chapter (each anchored to a segment range); Episode 1—1 ShowNotes (sections per locale, links shared); Episode 1—N PublicationPackage (versioned); Package 1—N ExportArtifact + 0—N DeliveryReceipt (via ChannelCredential); Episode 1—1 EpisodeChecklist (derived items + stored sign-offs); Job spans import/suggestion/build/delivery; ActivityEntry logs consequential mutations (P17).

## Screen inventory (9)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|--------|---------|---------------------|
| S1 | Episodes board | stage-column view of all episodes per show; quick-add; first-run value checklist (P22) | listShows, listEpisodes, createEpisode, createShow |
| S2 | Episode workbench | the product's spine: transcript pane + chapter timeline + notes composer + checklist drawer + playback bar (CP-1/2/3/4) | getEpisode, importTranscript, getTranscript, listSegments, updateSegment, suggestChapters, listChapters, createChapter, updateChapter, deleteChapter, getShowNotes, saveShowNotes, getEpisodeChecklist, setChecklistSignOff, updateEpisode, getJob, cancelJob, getUsage |
| S3 | Transcript import surface | paste/abstract-source, format detection result, await-input duration path (CP-1.4–5) | importTranscript, getJob |
| S4 | Suggestion review panel | in-workbench reserved region; rationale + confidence; accept/adjust/reject (CP-2.1–2) | suggestChapters, getJob, createChapter |
| S5 | Notes composer zone | bilingual sections, parity indicators, chapter-list block (CP-3) | getShowNotes, saveShowNotes, listChapters |
| S6 | Checklist drawer | derived + sign-off items with fix-links (CP-4.1–2) | getEpisodeChecklist, setChecklistSignOff |
| S7 | Packages library + detail | versions, artifacts, digest view, delivery (CP-4.3–4, CP-5.4) | listPackages, getPackage, buildPublicationPackage, getArtifact, renewArtifact, deliverPackage |
| S8 | Jobs center | filterable job list, cancel/retry, link-to-context (async-contract §7, Tier-3 consolidated surface) | listJobs, getJob, cancelJob |
| S9 | Settings | show defaults (numbering, notes template, active locales), assist preferences, channels/credentials (CP-5.1–3) | getSession, listShows, updateShow, getUsage, listChannelCredentials, saveChannelCredential, verifyChannelCredential, revokeChannelCredential |

S3–S6 are workbench surfaces (S2 context) listed separately because each carries distinct state obligations and its own a11y pass; they are not separate routes.

## Per-screen state obligations

Four empties enumerated per surface (P01): board first-run (value checklist + sample episode), board filtered-empty (stage filter declares itself, reset action), packages first-run, jobs empty — copy in 11 §A. Skeletons mirror final geometry including direction (P02): board columns, workbench zones, package rows. Errors per the 03 mapping. Autosave indicator persistent in the notes composer (P10).

## IA decisions and rationale

- **The workbench is the product** (one surface, four zones): the buyer's mental model is "this episode's publishing layer", not app-switching between chapters and notes tools — zone focus follows the CP order (transcript → timeline → notes → checklist) without route changes (keeps context; route changes are crossfade ≤180ms per motion-language §3).
- **Board columns are derived stages, not stored status**: stage derives from transcript/chapters/notes/package state (07a rule) — no state drift possible; the board IS the checklist macro-view, the drawer is its micro-view.
- **Packages is a first-class library**, not a modal: re-exports, expiry renewal, delivery receipts, and version history are recurring realities (02 Yousef & Mariam's re-export pain).
- **Jobs center consolidated at Tier 3** (async-contract §7): one filterable surface, linked from every job-emitting flow (S2/S7 inline progress + S8 full list).
- **Channels live in Settings, not the package flow**: credentials are workspace-scoped infrastructure (credential-contract §5); the delivery flow links there when no active credential exists, then returns.
