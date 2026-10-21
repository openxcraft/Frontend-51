# 08 — Integration Map: caption-lab

## Abstract needs (optional; core refinement value requires none)

| # | Abstract need | Why | Manual alternative |
|---|---------------|-----|--------------------|
| N1 | **Media storage & frame serving** ("store project media and serve preview frames") | Style preview over real frames | Preview disabled with honest copy; grid/exports work fully (07c mock models placeholder refs) — spec sheet + caption files are deliverable without preview |
| N2 | **Preview rendering** ("render style over frame") | Visual confirmation of burn-in | Legibility linter (deterministic checks) + preview stills at export time (still requires N1 at binding); linter carries the craft alone pre-binding |
| N3 | **Speech-to-text alignment** ("generate timecoded transcript from audio") | Teams without transcripts want end-to-end | Import from existing vendors/transcripts (the norm — 01 proves transcripts are already bought); paste path always |
| N4 | **Render execution** ("burn captions into video per spec") | Some clients want rendered files, not specs | Spec sheet + caption files into the client's render pipeline (Mariam's real-world path — reproducibility is the point) |

## Risk flags
- N1/N2 rendering fidelity varies by binding; each assessed at binding time (LOOP-7 posture). The burn-in SPEC (not the render) is the product's contract deliverable — deliberately.
- N3 engine quality on dialect-heavy audio is a known regional hazard (02 Adel); if bound, transcript arrives as PROPOSED cues needing verification (07a state machine already enforces).

## Degradation map
Non-AI product: deterministic core (grid, breaks, timing, policies, presets, spec/exports) never degrades. Degradable: preview (N1/N2-bound) — honest disabled state; future auto-alignment (N3-bound) — falls back to import. LOOP-5 posture: every abstract need above has its manual alternative as the default path.
