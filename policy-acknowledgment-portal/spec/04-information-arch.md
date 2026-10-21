# 04 — Information Architecture: policy-acknowledgment-portal

## Navigation model

Two shells over one IA. **Admin console** (left rail): **Policies** (home — the register) · **Campaigns** (coverage console + composer) · **Ledger** · **People** · **Jobs** · **Settings**. Policy detail is item detail with a version timeline as the persistent dimension. **Acknowledger portal** (the employee face, mobile-first): **My policies** (inbox + history) and the reader surface as its detail mode — reached by session link, never through the admin rail. ⌘K command palette (P05 — the register, campaigns, people, and ledger exceed three list surfaces) with bilingual search normalization (alef variants, taa marbuta, yaa forms — rtl-rules §4). Desktop-first admin (≥1280px); acknowledger portal responsive 360px-up. Two-level IA: section → item; no third level (version detail lives inside policy detail; acknowledgment detail lives inside campaign/person drill-downs).

## Entity overview (07a for full shapes)

Workspace → Policy → PolicyVersion (immutable, supersedes chain, bilingual bodies) → Campaign (targets a version, snapshots segment membership into Assignments) → Assignment per Person → Acknowledgment (pinned to version + attestation text + locales read). LedgerEntry is the append-only spine across all of it. Job wraps import/dispatch/export. ExportArtifact carries evidence packs with expiry.

## Screen inventory (11)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Policies register | the authoritative list: title (bilingual), category, current version, effective date, coverage state, governing locale | listPolicies, createPolicy, getPolicy, getSession |
| S2 | Policy detail | bilingual metadata panel, version timeline with supersedes chain, campaign history, body previews per locale | getPolicy, listPolicyVersions, getPolicyVersion, updatePolicyMetadata |
| S3 | Version publish | document-control form (label, effective date, change summary, supersedes) + per-locale body upload/paste + reader preview | publishPolicyVersion, getPolicyVersion, withdrawPolicyVersion |
| S4 | Campaign composer | version target, segment pickers with live membership read-out, due window, reminder cadence, attestation text pair, required-locale rule | getPolicyVersion, listSegments, createCampaign, getUsage |
| S5 | Coverage console | per-campaign arithmetic + derived-zone rosters + drill-downs; reminder/extend actions | getCampaign, listCampaigns, listAcknowledgments, getAcknowledgment, updateCampaign, cancelCampaign |
| S6 | Person history | every version a person acknowledged (when, which locale), pending items, inactive marker | listPeople, listAcknowledgments, getAcknowledgment |
| S7 | Ledger | append-only register of every consequential event; filterable, keyboard-navigable, exportable (a11y-baseline §7) | listLedger |
| S8 | Evidence pack | scope picker (campaign / version), pack contents preview, artifact list with expiry | exportEvidencePack, getArtifact, listJobs |
| S9 | People & segments | roster with bilingual names, import wizard, segment editors with future-only-membership rule | listPeople, createPerson, importPeople, updatePerson, listSegments, createSegment, updateSegment |
| E1 | My policies (acknowledger portal) | pending acknowledgments with due dates + locale badges; completed history | getSession, listMyAssignments |
| E2 | Reader + attestation gate | bilingual body at own direction, locale toggle with governing mark, read tracking, typed-name attestation, decline path | getPolicyVersionForReader, recordView, submitAcknowledgment, submitDecline |

Settings (S10-class, folded into the rail as a small surface): locale default, governing-locale hint per jurisdiction, channel consent state, attestation-text library — data needs getSession (+ workspace reads). Jobs console is S11: listJobs. Counting named surfaces: S1–S9 + E1/E2 = 11 primary screens; Settings and Jobs are rail sections with their own state obligations but no independent entity model.

## Per-screen state obligations

Four empties per P01 wherever lists live: S1 first-run offers the seeded sample policy (interactive — CP non-happy path, P22); S1 filtered-empty resets filters; S5 no-access is PERMISSION-surfaced, never "empty"; E1 first-run (a brand-new joiner with no assignments yet) teaches the attestation shape without faking urgency. Skeletons mirror final geometry per direction (P02) — the coverage console skeleton shows the arithmetic row shape, not a shimmer wall. Errors per 03 mapping; full copy matrix in 11. The reader surface (E2) has no empty state — it either has a body or a typed error (evidence surfaces never render blank).

## IA decisions and rationale

- **Policies is the home, not campaigns**: the register is the system of record; campaigns are events against it. An admin's mental model is "the policy changed, now make people attest" — register-first matches the trigger order (03 CP-1 → CP-2).
- **Version timeline inside policy detail, never a separate screen**: the supersedes chain IS the policy's history — separating versions from their policy would orphan the evidence narrative Omar exports (CP-5).
- **Coverage console belongs to Campaigns, person history to People**: two drills into the same acknowledgment data by two different questions ("who is missing in this campaign?" vs "what has this person attested?") — the IA mirrors the two admin questions rather than forcing one hierarchy.
- **The acknowledger portal is a second shell, not a tab**: the reader's context (phone, no rail, no admin affordances, session link) shares nothing with console navigation — mirroring the two-shell posture the portfolio applies to worker-facing products (shift-swap-marketplace precedent). It is NOT a "lite mode": it is the surface where the product's namesake act happens.
- **Ledger is a first-class rail section, not a settings tab**: the attestation audit trail is a headline feature (00) and a §7 legal/audit overlay obligation (a11y-baseline) — burying it in settings would misrepresent the product's own evidence claim.
- **Jobs consolidated (T3 posture)**: one console for import/dispatch/export classes with link-to-context (async-contract §7 permits Tier-3 consolidation).
- **Settings stays small and honest**: channel consent surfaces where dispatch happens (S4/S5) AND in settings — state at point-of-use, detail in settings (credential-contract §3).
