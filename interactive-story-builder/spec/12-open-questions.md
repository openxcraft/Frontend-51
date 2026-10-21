# 12 — Open Questions: interactive-story-builder

## LOOP register (binding records)

| LOOP | Record | Status | Resolution / recommended default |
|---|---|---|---|
| 3 | Adjacency with **media-asset-hub**: media references vs media library. Boundary: this product attaches media by URL/abstract capability; the hub owns library workflows (bilingual metadata, in-asset search). No library CRUD here (LOOP-10). | OPEN — owner review | Keep boundary; abstract N2 storage (08) may bind to a shared capability later. The sibling spec on disk carries a family-level adjacency record only — orchestrator mirrors the specific flag into media-asset-hub/12 at batch close |
| 3 | Adjacency with **newsletter-kit** / **op-ed-desk**: all bilingual editorial composition surfaces. Boundaries: scroll-story artifacts vs newsletter issues vs submission review. | OPEN — owner review | Distinct artifacts/workflows; shared patterns (P23) only. The authored sibling specs carry their own adjacency records but no interactive-story-builder-specific mirror flags yet — orchestrator mirrors at batch close |
| 4 | Proposed operation declared: `suggestStructure` extends the standard operation vocabulary (AI-flavored streaming Job with `origin` degradation semantics). Contract-only commitment — no backend behavior assumed beyond the typed contract; the deterministic-template path proves the contract sufficient without the capability | OPEN — binding-time | Keep / revise with binding evidence (Q-2 quality gate) |
| 5 | Export/render + media-storage + delivery capabilities abstract; manual alternatives declared (08) | RESOLVED at spec time | Bundle download + external media URLs = full usefulness pre-integration |
| 6 | Direction default `bilingual-ar` | OPEN — owner | Proposed; rationale: buyer geography + Arabic-first personas (02) |
| 9 | ui-ux-pro-max color/typography/motion conflicts | RESOLVED | Ledger wins; adopted/rejected rows recorded (05) |
| 10 | Exclusions honored: no audience analytics, no member management, no site building, no media library CRUD, no chart authoring | RESOLVED | Encoded in 00/04/07b/08 |
| 12 | Roster, pricing posture, tier assignment | OPEN — owner | Proceed as specified (portfolio Q-1…Q-3) |

## Genuine questions with recommended defaults

| # | Question | Recommended default | Why |
|---|---|---|---|
| Q-1 | Pricing posture | Per-seat mid tier with a published-story cap (unlimited drafts; N published artifacts/yr; reviewer seats free) | Segment sits between free-fragment tools and $200+/mo editorial tools (01); reviewer-free matches newsroom economics (Lina) |
| Q-2 | Suggestion capability binding-time quality gate | Fixed bilingual evaluation set (briefs → outlines judged by 2 editors) before enabling `origin:'generated'` | Degradation must beat templates or stay rung 3 (08 risk flag) |
| Q-3 | Sync strictness default | Divergence = warning, never block; "mark reviewed" is the parity act of record | Editorial judgment > mechanical parity (02); audit trail preserved (P17) |
| Q-4 | Export watermark default | On (story credit line), toggleable | Credit discipline for newsrooms/NGOs; no rights-management claim (08) |
| Q-5 | Template catalog depth at v1 | 3 audience arcs as specified (07c seeds) | Covers the three personas' JTBDs; deterministic degradation substrate |
| Q-6 | Step-count guidance per story | Soft note at ~60 steps (performance guidance, 10 budgets) | 48-step fixture passes; virtualization threshold at 40 |
| Q-7 | Should reviewers edit alt text? | No — note-driven; fixes route through editors | Single write path per step revision; small conflict surface |
| Q-8 | Hijri/date display in story chrome | Out of v1 — stories are narratives, not schedules; revisit with P24 if scheduling surfaces appear | Keeps LOOP-10 boundary clean |
