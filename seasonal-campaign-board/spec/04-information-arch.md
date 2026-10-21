# 04 — Information Architecture: seasonal-campaign-board

## Navigation model

Left rail (mirrored in RTL): **Moments** (library) · **Board** (campaigns — default landing) · **Team** · **Activity** · **Settings**. Campaign detail, closure, and template editor are drill-down modes from Board and Moments (two-level: section → item → detail). ⌘K palette (P05 — list surfaces exceed three) reaches moments, campaigns, templates, and assignees with bilingual search (Arabic normalization per rtl-rules §4). Breadcrumbs: Board / Campaign / (Checklist · Closure · Template-kind). The moment library is the product's front door on first-run; the Board becomes home once campaigns exist.

## Screen inventory (9)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|--------|---------|---------------------|
| S1 | Moment library | browse moments by season/kind/nearness | listSeasons, listMoments |
| S2 | Moment detail | phases, dual dates + drift, template preview, guidance | getMoment, getChecklistTemplate, listChecklistTemplates |
| S3 | Campaign board | lanes × countdown tiles × readiness meters × dual-calendar strip | listCampaigns, getReadiness, getCalendarFrame, getSession |
| S4 | Campaign detail (checklist) | the daily loop + intervention filters | getCampaign, listChecklistItems, updateChecklistItem, addChecklistItem, removeChecklistItem, bulkUpdateChecklistItems, updateCampaign, listAssignees, createAssignee, updateAssignee, getReadiness |
| S5 | Closure & retro | closure note + waiver discipline + closed lane | closeCampaign, updateClosureNote, getCampaign |
| S6 | Template editor | versioned checklist templates per moment kind | listChecklistTemplates, getChecklistTemplate, saveChecklistTemplate |
| S7 | Jobs & activity | T3-consolidated jobs surface + activity log (async-contract §7) | listJobs, getArtifact, renewArtifact, getUsage, listActivity |
| S8 | Team roster | assignees: create, rename, deactivate | listAssignees, createAssignee, updateAssignee |
| S9 | Settings | locale, calendar method disclosure, numeral policy note, notification tiers (P21) | getSession, getUsage, getCalendarFrame (method verification frame) |

Mobile (<768px): read-only monitoring — S3 (single-column countdown tiles + readiness), S4 (checklist status view, inline status toggle allowed — the one permitted write path for quick floor updates), S7 (view). Template editor, closure authoring, bulk operations, team management: desktop/tablet only.

## Entity overview (detail in 07a)

Season 1—N Moment; Moment 1—N Campaign; ChecklistTemplate 1—N Campaign (instantiated items); Campaign 1—N ChecklistItem; Assignee 1—N ChecklistItem (assignment, non-owning); Campaign 1—1 ClosureNote (at close); Campaign/Moment 1—N ExportJob; everything → ActivityEntry (P17).

## Per-screen state obligations

Four empties per P01 (first-run with sample-campaign offer; returned-empty with cause; no-access "another workspace"; filtered-empty with reset — 11 enumerates per surface). Skeletons mirror lane/tile/checklist geometry, RTL-flipped (P02). Errors per 03 mapping; copy verbatim in 11. Countdown tiles render a reserved-width label before data arrives (no layout shift, 10).

## IA decisions and rationale

- **Moments before campaigns**: the differentiator (00) is the library; it must be a first-class surface, not a settings tab — first-run lands there (P01 first-run discipline).
- **Board = readiness, not scheduling**: lanes carry countdown/readiness, not channel slots — the boundary against bilingual-content-calendar (12 Q-4) is structural, not copy.
- **Closure is a screen, not a modal**: the retro carries season memory (CP-5); its weight deserves a page and a URL.
- **Jobs consolidated with activity** (S7): T3 posture per async-contract §7 — exports are few; accountability is one surface.
- **Team roster is deliberately thin**: assignees are names + roles + active flag — no permissions matrix, no SSO semantics (LOOP-10: no approvals escalation; session roles come from the auth-agnostic adapter, 07b).
