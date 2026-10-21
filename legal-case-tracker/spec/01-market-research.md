# 01 — Market Research: legal-case-tracker

SME-B pass · Sources are the research files q1–q12 (digest in research/batch9/legal-case-tracker-research.md; retrieval method recorded there — web_search was rate-limited 429 this batch, sources fetched directly). Citations [qN] refer to those files. US-market figures are anchors, not regional claims; every unverified figure is marked.

## Category

Legal practice management software (LPMS) for small law firms — the Clio/MyCase class — with a thin litigation-specific sub-category (chronology/tracker tools) beside it, and a separate rules-based deadline-calendaring category (docketing) that proves deadliness is a standalone product surface. Regional context: Gulf court systems have digitized the court side (Najiz serves licensed lawyers, hearing attendance, verification — [q8]), while the firm-side bilingual matter workspace is unserved by any retrieved product with public pricing.

## Direct competitors

| # | Product | URL | What it is | Differentiation (vs this product) |
|---|---------|-----|-----------|-----------------------------------|
| D1 | **Clio Manage** | https://www.clio.com | category-leading cloud LPMS; from **$39/user/month** ([q4], Lawyerist 2026 review; 4.7/5 on 21 ratings [q3]) | billing-led suite (trust accounting, time, bills front and center — its own testimonial leads with billing [q4]); calendaring is an integration promise, not a derived countdown surface; English-first, locale-as-setting, no bilingual ar/en schema; no custody chain; no closure gate — "closed" is a status, not a gate |
| D2 | **MyCase** | https://www.mycase.com | small-firm LPMS; **$50–$130/user/month** tier band (Basic/Pro/Advanced annual billing; [q1]) | markets calendaring as "Never miss a case deadline or meeting" via external calendar integration [q12] — a notification posture, not zones-with-consequences; document management is centralized storage + e-signature, not an append-only custody ledger with verification; suite includes billing/intake/CRM we exclude wholesale (LOOP-10); no bilingual schema |
| D3 | **PracticePanther** | https://www.practicepanther.com | small-firm LPMS; from **$49/user/month** ([q5], Lawyerist 2026; 4.7/5 on 22 ratings [q3]) | Lawyerist cons name "simple document management" [q5] — the opposite of a fingerprint-verified custody chain; strength is intake + eSignature + customizability (billing adjacency); no hearing countdown zones, no outcome grammar (adjourned-with-next-hearing as a structural side-effect), no closure gate |
| D4 | **Smokeball** | https://www.smokeball.com | small-firm LPMS, quote-gated pricing (Bill/Boost/Grow/Prosper+; "GET PRICING" on every plan — [q2]) | bundles document automation ("court & document templates", "MS-Word based legal documents" class features — [q2]) which we exclude (LOOP-10); eFiling "Fees apply" and e-signature bundled — we abstract the channel and refuse the money path; no bilingual schema; marketing-scale claim "34,000+ legal professionals" unverified [q2] |
| D5 | **Rocket Matter** | https://www.rocketmatter.com | small-firm LPMS (billing + matter management; sibling of the same suite class) | site bot-blocked this research pass — no public pricing retrieved (honest gap G4); differentiation rests on its published positioning as a billing-and-matter suite: same suite shape as D1–D4 (billing-led, English-first, no custody chain, no derived countdown); pricing **unverified estimate: sales-gated** |
| D6 | **CaseFleet** | https://casefleet.com (review: [q6]) | the closest shape: litigation-specific tracking with case chronology; **$30/user/month** Starter annual, **$75/user/month** Standard (annual) ([q6]) | Lawyerist: "hard-to-find litigation specific features" [q6] — the chronology instinct is validated and shared; but it is English-first, witness/fact-review oriented, no hearing countdown zones, no deadline-rule engine (no generated deadlines from events), no document custody chain, no closure gate, no Arabic anything; priced below the suites — the affordability band this product also targets |

**Direct count: 6** (≥5 met). Suite class D1–D5 converges on: billing-led value story, calendar-as-integration, documents-as-storage, closed-as-status. None treats the bilingual matter identity, the countdown, the custody chain, or the gate as first-class data.

## Indirect competitors

| # | Alternative | URL / evidence | What it is | Differentiation |
|---|-------------|----------------|-----------|-----------------|
| I1 | **CalendarRules** (rules-based calendaring / docketing) | https://www.calendarrules.com [q11] | court-rules deadline calculation as an entire standalone product ("More than 2600 firms calculating millions of deadlines per year" — marketing claim, unverified; also states "1600+ firms" elsewhere on the same page — both recorded) | proves deadline generation is a paid category [q11]; but it is US court-rules content (1,500+ rule sets) sold to firms that already run an LPMS — no matter timeline, no documents, no bilingual anything; our rules are *firm-authored parameters* (trigger + offset + lead) over the firm's own events, not a jurisdiction rule-set subscription — 12 Q-6 records the boundary and the future-loop |
| I2 | **Najiz** (court-side e-justice platform) | https://www.najiz.sa [q8] | the Saudi Ministry of Justice portal: licensed-lawyer login lane, business-entity lane, hearing attendance by app, verification services, trusted-data requests [q8] | the court's system, not the firm's: it digitizes what happens *inside* the court, while this product governs what happens *around* it — the firm's countdowns, its custody of originals, its closure discipline, its client read-seat. Adjacent, not competing (the 00 LOOP-10 exclusion: no e-filing, no court integration); its accessibility toolbar (sign-language support, vision controls [q8]) is a regional reference for 09 |
| I3 | **The staffed status quo** (spreadsheet + shared drive + a bilingual paralegal's memory) | evidence shape: regional practice runs bilingual by staffing — Al Tamimi & Co, "The Leading Corporate Law Firm In MENA," bilingual site [q10]; category's own marketing admits the fear ("ensuring nothing ever slips through the cracks" [q12]) | the real incumbent at a 2–10 lawyer firm: matters in a spreadsheet, documents in folders, hearing dates in the managing partner's head and the court SMS | free, familiar, and silent: no zones (a missed outcome is invisible), no chain (an original's location is a question, not a record), no gate (closure is vibes), no audit (memory is not an activity log); this product's whole value case is making that silence expensive to keep — 02 Abdullah's spreadsheet, 02 Faisal's register |

**Indirect count: 3** (≥3 met).

## Demand evidence (cited, no invented statistics)

1. **Deadline failure is the category's headline fear.** MyCase markets calendaring as "Never miss a case deadline or meeting" [q12]; CalendarRules builds an entire business on deadline calculation ("critical dates/deadlines", thousands of firms — unverified marketing figures [q11]). No statistical malpractice claim is made (research gap G3: ABA malpractice-claims sources were bot-blocked; nothing asserted).
2. **Litigation-specific tracking is a recognized, underserved niche.** Lawyerist's 2026 index singles out CaseFleet as "hard-to-find litigation specific features" [q3][q6] — buyers ask for it; the suites do not specialize in it.
3. **The court side is already digital; the firm side is the gap.** Najiz gives licensed lawyers hearing attendance and verification services [q8] — regional firms are *more* ready for a firm-side matter workspace, not less: they already work beside a digital court.
4. **Bilingual practice is the regional norm, and it is staffed, not tooled.** Al Tamimi & Co runs a fully bilingual MENA practice [q10]; the category offers locale settings, not bilingual schema (D1–D6 all English-first).
5. **Custody is an authentication convention, not a filing habit.** Chain of custody is the chronological documentation of custody, control, transfer, and disposition required for evidence to be shown in court — "often a tedious process" [q7] — tedious paper processes are exactly what a structured append-only ledger replaces.
6. **Small-firm affordability band is real and narrow.** $30–$130/user/month spans the entire retrieved direct set (CaseFleet Starter to MyCase Advanced) [q1][q4][q5][q6] — a litigation tracker below the suites and above free is a credible price position (12 Q-3).

## Pricing landscape (all anchors US-market; unverified for MENA — gap G1/G2)

- Per-seat LPMS: Clio from $39 [q4] · PracticePanther from $49 [q5] · MyCase $50/$100/$130 [q1] · CaseFleet $30/$75 [q6] — all per user/month, annual billing discounts standard.
- Quote-gated: Smokeball (all tiers) [q2]; Rocket Matter (site unreachable, **unverified estimate — likely in the $40–$90/user/month suite band; no public figure retrieved**) .
- Regional Arabic-legal pricing: sales-gated or absent everywhere (G2). No MENA anchor is cited because none was retrievable — 12 Q-3 records the recommended posture (per-seat firm seats, free viewer seat, flat matter-count band) as a proposal, not a market-derived fact.

## Positioning statement

For small litigation firms in MENA whose cases live in two scripts and whose calendar is the court's weapon, **legal-case-tracker** is the bilingual matter chronicle: a hearing countdown that derives consequence from time (zones that gate closure and drive the morning board), a document chain of custody that makes the paper trail verifiable (append-only, fingerprint-checked), and a closure the firm earns through a named-blocker gate — at a per-seat price below the billing-led suites, which solve a different problem (money) and leave the docket clock to memory. Unlike Clio-class suites (billing-led, English-first, closed-as-status) and CaseFleet (litigation chronology, monolingual, no custody), the product is non-AI by declaration and deterministic by design: same state, same zones, same deadlines, every time — the property an audit-facing artifact requires.

## Honest gaps (carried to 12)

- G1: no auditable MENA LPMS market-size figure (nothing cited; no claim made).
- G2: no Arabic-language firm-side litigation tracker with public pricing retrieved — positioning claims scoped to "no retrieved competitor."
- G3: missed-deadline malpractice statistics unretrievable this pass (bot-blocked sources); the demand case rests on category marketing and the docketing category's existence, not on a statistic.
- G4: Rocket Matter pricing not retrieved (site bot-blocked); marked unverified.
- G5: regional court-structure data is jurisdiction-specific and changes; the product treats court names as firm-maintained data (07a), never asserts jurisdiction structure (q9 context only).
