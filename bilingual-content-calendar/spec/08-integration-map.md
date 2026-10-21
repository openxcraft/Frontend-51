# 08 — Integration Map: bilingual-content-calendar

## Abstract needs (all optional; core value requires none)

| # | Abstract need | Why | Manual alternative (pre-integration) |
|---|---------------|-----|--------------------------------------|
| N1 | **Structured plan delivery** ("hand the approved plan to an external execution system") | Teams publish through existing suites | Structured export file (CP-4) — the plan of record flows as a file/import; presentation export for client meetings (Yousef) |
| N2 | **Calendar subscription feed** ("let external calendars render the plan's dates") | Stakeholders want the grid in their own calendar app | Dual-date export rows (both calendars rendered in file) |
| N3 | **Team digest messaging** ("notify members of review requests") | Dana wants review pings | In-app review queue + on-login return state (async-contract §6.3) |

## Risk flags
- N1 destination formats are destination-specific; each binding is assessed at binding time (LOOP-7 posture). The export file is deliberately destination-neutral (slots, variants, times, moments) so no destination is assumed.
- No channel connection exists in this product by design (00 exclusions) — channels are abstract labels; no credential surface beyond future N1 delivery credentials (credential-contract would govern them).

## Degradation map (non-AI product)
No AI capability declared → no AI ladder applies (ai-native-patterns §1). Degradation dimensions are: offline (P20 queue, full read), export quota (RATE_LIMIT copy in 11), and job availability (async-contract §6 return states).
