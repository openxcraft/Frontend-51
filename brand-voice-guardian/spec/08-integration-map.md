# 08 — Integration Map: brand-voice-guardian

## Abstract needs (optional; core value requires none)

| # | Abstract need | Why | Manual alternative |
|---|---------------|-----|--------------------|
| N1 | **File ingestion** ("parse uploaded documents for checking") | Teams check .doc/.pdf-class deliverables | Paste (always available, always the fallback) — CP-2 |
| N2 | **Report delivery** ("send audit report to an external destination") | Tariq files evidence to compliance desks | Report artifact download + paste into evidence systems |
| N3 | **Register-drift analysis capability** ("evaluate Arabic register against declaration") | The AI-class operation in 07a | Deterministic checks + human judgment on flagged lines; mock serves development; binding-time decision recorded in 12 |

## Risk flags
- N1 parsing fidelity varies by format; each binding assessed at binding time (LOOP-7 posture) — paste path is the guaranteed floor.
- N3 capability choice impacts false-positive rate (Salma's trust objection); a fixed evaluation set gates any binding (12 Q-6).

## Degradation map
| Surface | Full | AI unavailable |
|---|---|---|
| Terminology/banned/consistency checks | deterministic — unchanged | unchanged (deterministic core) |
| Register drift | AI-graded findings | heuristic warnings, explicitly labeled |
| Reports/records | unchanged | unchanged |
Per ai-native-patterns §1/§8: AI usage is declared (07b runCheck semantics); the product's core loop survives its absence.
