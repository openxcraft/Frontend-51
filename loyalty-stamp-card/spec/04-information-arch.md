# 04 — Information Architecture: loyalty-stamp-card

## Navigation model

Left rail (desktop console): **Home** (today at the counter) · **Stamper** · **Members** · **Programs** · **Insights** · **Staff & Audit** · **Settings**. The stamper is the product's core mode and is reachable in one click from every rail section (the counter is never more than one navigation away — Amna's surface discipline). ⌘K/Ctrl+K command palette (P05 — the list surfaces exceed three: members, programs, audit, jobs) searches members, programs, staff, and audit entries with bilingual normalization (alef variants, taa marbuta, yaa forms — rtl-rules §4). Two-level IA: section → item; the member detail is item detail with the timeline as its persistent dimension. Three shells, one IA: the **desktop console** (≥1280px), the **counter tablet view** (768–1024px — stamper + members lookup + today board only), and the **member pass view** (phone-first ≥360px, token-keyed, read-only, outside the staff navigation entirely — its only surface is the card). Desktop-first; ≤767px staff surfaces collapse to stamper + member lookup + today; no native app at v1.

## Entity overview (07a for full shapes)

Workspace (one store) → LoyaltyProgram (versioned: draft/published/archived; ladder or classic; tiers[]) → RewardTier (stampsRequired + nameAr + nameEn + final flag) → applies to Members → each member holds a Card per active program (stamps, redeemedTierIds, cycle) with StampEvents (counter / undo / adjustment sources), Redemptions (tier, actor, stampsAtRedemption), and one stable PassToken (rotatable). StaffMembers (owner/manager/staff, counter PIN) author every mutation, all of which append AuditEntries. Jobs wrap exports; ExportArtifacts carry expiry. State is deterministic: tier reachability, expiry, and caps are computed from recorded events, never stored judgments.

## Screen inventory (11)

| # | Screen | Purpose | Data needs (→ 07b) |
|---|---|---|---|
| S1 | Console home | today at the counter: stamps, redemptions, active cards, flags digest; P22 checklist on first run | getProgramInsights (today window), listAuditEntries (flags digest), getSession |
| S2 | Stamper | the speed surface: lookup → card sheet → stamp / redeem / undo | lookupMember, getMemberCard, issueStamp, undoStamp, redeemReward, enrollMember (walk-in) |
| S3 | Card studio | program authoring: kind, stamp count, bilingual tiers, policies; live dual-direction preview | createProgram, getProgram, updateProgram, setProgramStatus |
| S4 | Programs | list with status/version; archive path; studio entry | listPrograms, getProgram |
| S5 | Members ledger | normalized bilingual search, filters (active/expiring/expired/blocked), pagination | listMembers, lookupMember |
| S6 | Member detail | card state, full timeline (stamps/undos/adjustments/redemptions/renewals), notes, pass panel, block path | getMember, getMemberCard, updateMember, setMemberStatus, createPassToken, adjustStamps |
| S7 | Member pass (customer-facing) | token-keyed, phone-first, read-only: card, stamp dots, tier ladder with distances, member QR | getPassView |
| S8 | Insights | deterministic counters per program with disclosed arithmetic; export actions | getProgramInsights, exportMembers, listJobs |
| S9 | Staff & audit | staff list/roles/PIN lifecycle; the audit ledger with filters; flag board | listStaff, createStaffMember, setStaffStatus, listAuditEntries |
| S10 | Settings | workspace locale, default program policies, retention window, artifact housekeeping | updateWorkspaceSettings, getSession, getArtifact |
| S11 | Command palette (overlay) | bilingual search across members/programs/staff/audit | client-side over S4/S5/S9 data |

## Per-screen state obligations

Four empties per P01: S1 first-run teaches the first stamp (checklist); S5 distinguishes first-run (no members — teach the counter QR) from filtered-empty (declares the filter); S6 has no empty of its own (deep link failure is NOT_FOUND, not "empty"); S7's token failure is NOT_FOUND with a member-side action; S8's draft-program zero-count is a valid honest state with a notice. Skeletons mirror final geometry per direction (P02) — the stamp-card skeleton reserves dot geometry (10-performance CLS). Full copy matrix in 11.

## IA decisions and rationale

- **The stamper sits above the fold of the IA, not inside members**: the counter interaction is a lookup-and-tap, not record management — burying it inside a members CRUD surface would slow the line (02 Amna). Members ledger is the review surface; the stamper is the work surface.
- **The member pass lives outside staff navigation**: S7 is token-keyed and read-only — members are transient participants (02 Noura), and their surface must never acquire staff affordances; the two populations meet only through the QR code.
- **Programs are versioned data, not settings**: the card a member carries is published state; edits create drafts (CP-1) — so programs earn their own list/studio IA rather than a settings tab, exactly like the badge-template studio of the front-desk products (pattern kinship recorded in 12).
- **Audit consolidated with staff (T3 posture)**: async-contract §7 allows Tier 3 consolidation — exports are the only job class, so the jobs console folds into S8 and the audit ledger pairs with staff management in S9 where the flag board lives (the integrity surfaces together).
- **Settings is small and honest**: policy defaults, locale, retention — the store's posture statements, not a graveyard; credential-class states never appear here alone (credential-contract §3 discipline carried by 08).
