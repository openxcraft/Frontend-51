# 02 — User Research: kpi-alert-watch

SME-B pass · Paraphrased sentiment only (marked). Personas are composites grounded in 01 evidence (the retrieved category posture, the SRE paging/ticket discipline, the alert-fatigue corpus, and the bilingual buyer reality of MENA team-lead work); zero invented verbatims — quotes below are paraphrased persona voice, marked as such.

## Persona 1 — Hessa, Quick-Commerce Ops Lead (primary)

**Role**: operations lead at a Riyadh quick-commerce group (Sidra Market, the 07c seed world); owns average delivery time, order completion rate, and COD rejection rate across three city teams (22 drivers, 5 dark stores). Runs the 9am huddle. Today her monitoring is: two vendor dashboards opened side-by-side, a chat group where drivers report problems, and a spreadsheet she updates herself — and she still learned about the October delivery-time spike from a customer complaint, four days late.
**JTBD**: "When one of my numbers breaks its pattern, I want to know within a day with the baseline and the number in the same sentence, so my huddle fixes causes instead of discovering symptoms."
**Triggers**: the Monday meeting where her manager asks why completion rate dipped and she has no answer better than "we're checking"; a rainy week that spiked delivery times while she was watching a different metric; dashboard fatigue — she checks five surfaces and trusts none of them to tell her anything.
**Objections + responses**: "another dashboard?" → this is the anti-dashboard: no walls, a queue with explanations (00 surface; 12 Q-4 records the posture); "my numbers live in tools you've never heard of" → paste the daily numbers, or bind the metric-source capability when the workspace has one — the manual path is first-class (LOOP-5); "alerts will just become noise I mute" → digest-first default, backtest preview before save, snooze with expiry, dismissal reasons — the fatigue counters are the product, not settings (00).
**Onboarding motive**: paste eight weeks of one real number (delivery time), save one watch, and see the backtest preview plus one explained detection in the first sitting.
**Verbatim (paraphrase, persona voice)**: "I don't need more screens. I need the one screen that tells me what changed, by how much, and what's normal."

## Persona 2 — Tariq, Marketing Lead

**Role**: marketing lead at the same group; owns blended acquisition cost and spend pacing across four channels. Currently has threshold alerts in three different vendor tools — each with its own notification style, each mute-able, all muted within two months. He distrusts vendor anomaly emails because he cannot see what baseline they used, and Ramadan breaks every naive baseline he has ever been offered.
**JTBD**: "When acquisition cost drifts up, I want to know whether it's a real drift or a season I forgot to expect, so I stop crying wolf to my CFO and stop missing real wolves."
**Triggers**: a vendor "anomaly detected" email that turned out to be White Friday; the reverse — a real CPA drift that no tool flagged because he muted everything; the CFO asking why Ramadan acquisition costs looked "abnormal" in his own slide.
**Objections + responses**: "I already have alerts in every tool" → they alert; they don't explain — and they don't know Ramadan (season windows, 03 CP-4); "I don't want to build rules" → threshold watch is two numbers (warning band, critical band) with a backtest preview before commit; "who has time to read digests?" → the daily digest is a 90-second read by design, grouped by feed, page-class items held at top (P21).
**Verbatim (paraphrase)**: "Every tool says 'anomaly'. None of them says 'compared to what'."

## Persona 3 — Amal, Growth Lead (the bilingual bridge)

**Role**: growth lead at a bilingual commerce group; works in English, reports to an Arabic-first general manager. Every Sunday night she hand-writes the Arabic summary of what the week's numbers did — translating her own English analysis into a second language, on her own time, because the GM reads Arabic and the tools read English.
**JTBD**: "When the week's numbers move, I want the explanation to already exist in both languages, so my Sunday-night translation job disappears and my GM reads the same arithmetic I read."
**Triggers**: the Sunday-night ritual itself; a translation slip that made a moderate dip sound catastrophic in Arabic; the GM forwarding her own summary back with a question the English tool had already answered.
**Objections + responses**: "machine translation would be cheaper" → machine translation is banned by design — the Arabic explanation is an authored template with the same numbers, not a rendering of the English sentence (00 exclusions; the pair is the product); "my GM won't use a tool" → he doesn't have to: the digest-reader seat delivers the weekly bilingual digest and nothing else (00 buyer); "templates will sound robotic" → the templates are written for this register (فصحى بيضاء, copy-voice §3) and every number is the real number — robotic is a writing failure, and the strings are pinned in 11.
**Verbatim (paraphrase)**: "I translate my own dashboards every Sunday. I have done it for three years. Nobody asked whether the tool could just say it twice."

## Persona 4 — Shaikha, Regional Director (digest reader, Arabic-first)

**Role**: regional director overseeing three country teams; reads, does not operate. Arabic-first reader with working English; wants one page a week that tells her what moved and why, in Arabic, without opening a console. Today she gets WhatsApp screenshots of dashboards from each team lead, arriving unevenly.
**JTBD**: "When my teams' numbers move, I want one honest weekly page in Arabic that says what happened and how sure anyone is, so I stop extracting meaning from screenshots."
**Triggers**: three teams, three screenshot styles, zero explanations; a quarter-end surprise that "was visible for two weeks in someone's dashboard"; asking for Arabic summaries and receiving them late.
**Objections + responses**: "I don't want another login" → the digest-reader seat's entire surface is the delivered digest (and the in-console digest view at viewer permission — no editing surfaces reachable); "how do I trust it?" → every item's explanation carries its arithmetic — baseline, observed, band — in the same sentence (the trust posture the whole product runs on); "what if it alarms me unnecessarily?" → page-class items are rare by design, and the digest distinguishes them from digest-class items structurally (tier chips + text, never color alone).
**Verbatim (paraphrase)**: "Give me one page that says what broke, how badly, and whether my teams already know."

## JTBD summary

| Persona | Core job | Frequency | Primary objection |
|---|---|---|---|
| Hessa | pattern break → explained detection → huddle action | daily (digest scan) + per-incident | alert noise / dashboard fatigue |
| Tariq | cost drift → real-vs-seasonal verdict | daily digest + weekly CFO framing | tool sprawl + black-box baselines |
| Amal | week's numbers → bilingual explanation pair | weekly (digest authorship disappearing) | translation quality / template register |
| Shaikha | teams' numbers → one honest Arabic page | weekly (digest read) | trust + login burden |

## Objection → response matrix (buyer-level)

| Objection | Response (spec-pinned) |
|---|---|
| "We already pay for a platform with anomaly detection" | Detection is the commodity; explanation and bilingual delivery are the product (01 §2 — no retrieved competitor explains thresholds, none renders Arabic); the console coexists with dashboards — it watches, they display |
| "Alert fatigue killed our last attempt" | Digest-first default (00), backtest preview before save (03 CP-3), season windows (03 CP-4), snooze with expiry + dismissal reasons (03 CP-2) — four structural counters, one settings page, zero magic tuning (07b rule: no auto-rewrites) |
| "Our data isn't in a standard tool" | Paste/import snapshots is the primary path from minute one (LOOP-5); the metric-source capability is optional sugar when the workspace has one |
| "Arabic explanations = machine translation risk" | Banned by exclusion (00); authored template pairs with number slots; the Arabic is not derived from the English — both derive from the same rule state (07a) |
| "What happens when the AI is down?" | Nothing visible breaks: narration degrades to the shipped template default with provenance flipped (conditionally-AI, 08 map; the template is the floor, not the fallback) |

## Voice derivation (SME-J)

Console voice: **operator-plain** — declarative, numeric, zero hype (copy-voice §1). Every sentence of consequence carries a number and a comparison; adjectives are banned from detection copy ("alarming spike" is a defect; "+2.4σ above the Thursday baseline of 29" is the register). State in present tense, outcome in past; errors follow [what]+[why]+[next]. Arabic UI copy is فصحى بيضاء (plain MSA utility register), second-person avoided in system chrome, polite imperatives only in actions. Fixed terminology (one concept, one term, everywhere — the glossary is contract, 11 re-uses it verbatim): مراقبة=watch · تغذية البيانات=metric feed · اكتشاف=detection · نطاق العتبة=threshold band · خط الأساس الموسمي=seasonal baseline · الملخص=digest · فئة الملخص=digest-class · فئة المقاطعة=page-class · نافذة موسمية=season window · إقرار=acknowledge · تجاهل مع سبب=dismiss with reason · كتم مؤقت=snooze. "Digest" is never translated loosely — الملخص everywhere; an anomaly is انحراف (deviation), never "خطأ" (error) — detections are observations, not mistakes (the register decision that keeps the console calm). Numerals Western in both directions (ledger row; data surface per design-language-map §7); Arabic-Indic digits never appear in system chrome.
