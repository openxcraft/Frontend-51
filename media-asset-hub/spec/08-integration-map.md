# 08 — Integration Map: media-asset-hub

SME-H pass. All needs are ABSTRACT capabilities — no providers (hard rule 1). Every need has a manual alternative (LOOP-5) so the product is fully useful pre-integration. Consent semantics per credential-contract.md.

## Abstract needs

| # | Abstract need | Capability language shown to users | Consent semantics | Manual alternative (LOOP-5) |
|---|---------------|-------------------------------------|-------------------|------------------------------|
| N1 | **Object storage capability** | "Stores team asset files and their renditions" | Workspace-level grant ("File storage credential"); health surfaced where assets render (grid degrades to kind glyphs) | **Link-catalog mode**: register metadata + external link (existing drive path/URL); metadata search, collections, rights fully functional; no renditions |
| N2 | **Text-extraction capability** | "Reads text inside uploaded images and documents to make it searchable" | Per-workspace opt-in; per-batch toggle at ingest; disclosure names exactly what is read; results confidence-gated, never silently authoritative | **Paste transcription**: `updateExtractedText` — type/paste the Arabic or Latin text seen in the asset; indexes identically, provenance human-pasted |
| N3 | **Auto-tagging capability** (conditionally-AI) | "Proposes bilingual tags from asset content and metadata" | Per-workspace opt-in; metered (P14: batches/window, 80% pre-warning); proposes only — never applies, never overwrites human tags | **Manual bilingual tagging**: same review surface, empty chips, keyboard-driven; `createTag` + `applyTags` cover the path |
| N4 | **Notification channel** | "Delivers job-completion and rights digests outside the app" | User-controlled per class (P21); permission asked at first use, not signup | **Return-state surfaces**: Activity on re-entry + rights console; app complete without any outbound channel |

## Consent display (credential-contract §4)

Grants are per-operation-class and re-asked on extension: N2 initially covers images+documents; extending to video title-frames asks again. Credential lifecycle states surface where the capability is used — ingest console (N2/N3), grid (N1) — never only in settings. All events log to the activity ledger (P17).

## Risk flags

- N2 quality is the honest risk: general Arabic OCR benchmarks 65–75% on documents (01 [23][24]) — binding-time evaluation set required (12 Q-5); confidence < 0.7 routes to review; copy never claims omniscience (11).
- N3 suggestion quality decides whether review is a checkpoint or a chore; the manual path must stay genuinely fast so AI is an accelerant, not a dependency (12 Q-6).
- N1 is the only need whose absence reshapes the product (no thumbnails); link-catalog mode is the designed answer, tested as a first-class mock state (07c).

## AI degradation map (ai-native-patterns §8 — required)

| Surface | Capabilities available | Unavailable / quota exhausted |
|---|---|---|
| Browse + search over metadata/tags | full | **full** (never AI-dependent) |
| In-asset search | full (extraction at ingest) | pasted transcriptions still searchable; new ingests lack the layer (honest per-asset mark) |
| Ingest pipeline | 6 stages incl. extract + auto-tag | 3 stages (upload → probe → rendition); publish, bilingual metadata, manual tagging unchanged |
| Tag review surface | suggestions with confidence + accept/edit/reject | identical surface, empty suggestions, manual entry (rung-4 path) |
| Collections, rights, activity, exports | full | **full** |

Quota ladder (rungs 2–3) applies only to N2/N3: reduced extraction batch sizes and suggestion counts with explicit notices; rung 4 = clean unavailability with reset time (§5). Core workflows — cataloging, browsing, searching metadata, collecting, rights — never require N2/N3.
