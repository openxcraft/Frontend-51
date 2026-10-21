# 04 — Information Architecture: khatt-type-playground

## Navigation model

Left rail (mirrors in RTL): Catalog · Sessions · Specimens · Exports. The canvas is the persistent hero — sections swap rails/panels around it, never full-page navigations (font-loaded state survives moves). Two-level max: section → item; item views own the canvas. ⌘K palette (P05 — four list surfaces) with Arabic-normalized search (alef/hamza variants, taa marbuta, yaa forms, tashkeel strip — rtl-rules §4).

## Entity overview

FontProfile (catalog + uploaded; capability model: features, weights, kashida class) · Glyph (within a font) · CuratedPairingNote (human-authored, source-labeled) · PairingSession (fonts + typography + kashida/alternates; revisioned) · Specimen (block document, session-pinned, versioned) · ExportArtifact (typed, expiring) · Job (render-export) · ActivityEntry (P17). Session N—2 fonts (role-bound); Specimen N—1 session (pinned revision); Job 1—N artifacts.

## Screen inventory (8)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Catalog | browsing, filters, upload entry | listFontProfiles, uploadFontFile |
| S2 | Font detail + glyph grid | capability model, glyphs, notes, preview | getFontProfile, listGlyphs, getGlyph, listPairingNotes, getFontFile |
| S3 | Session bench (canvas) | pairing workbench: blocks + controls column | createPairingSession, getPairingSession, updatePairingSession, getFontFile |
| S4 | Kashida & alternates lab | panel mode on S3's justified block | setKashidaSettings, setAlternateSelection, getFontProfile |
| S5 | Specimen composer | block editing, numeral proof, versions | createSpecimen, updateSpecimen, getSpecimen |
| S6 | Specimens library + share view | list + read-only committee view | listSpecimens, getSpecimen |
| S7 | Exports (jobs) | job states, artifacts, renewal, usage | exportSpecimen, listJobs, cancelJob, getArtifact, renewArtifact, getUsage |
| S8 | Settings | locale, numeral default, defaults, usage | getSession, getUsage |

Mobile (<768px): S6 share view + S7 status, read-only. The lab (S3/S4) and composer (S5) are desktop/tablet — a large-canvas tool by definition (00).

## Per-screen state obligations

Four empties per P01 where each applies (S1 first-run vs filtered; S3 no sessions; S6 no specimens; S7 no jobs); skeletons mirror geometry incl. direction (P02); errors typed per 03; all strings in 11. Sessions/specimens carry autosave + conflict states (P10); exports carry the job ladder (P12).

## IA decisions and rationale

- **The canvas never navigates away**: swapping rails around a persistent canvas is the tool's promise (play, don't page) and keeps loaded fonts alive across section moves.
- **The lab is a mode of the session bench (S4 ⊂ S3)**: kashida/alternates are controls on real blocks — a separate destination would fake feature-tour gravity a T3 product doesn't need.
- **Settings provenance rides on artifacts** (S6/S7): reviewers (Dana/Mariam) consume documents with settings printed on them — provenance is export content, not a metadata drawer.
