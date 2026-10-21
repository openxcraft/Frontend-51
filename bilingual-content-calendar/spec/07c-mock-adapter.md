# 07c — Mock Adapter: bilingual-content-calendar

In-memory, deterministic, zero dependencies. Implements `PlannerAdapterV1` exactly.

## Seeds (fixed)
- **Workspace** `ws-cal`: locale ar, calendarMethod Umm al-Qura (disclosed), 5 channels (feed-ar/en both, stories both, community ar-only single-locale policy, email both; dailyLimit 6 on feed).
- **Horizons** (4): "Ramadan 1447 — Brand" (season; start anchored to a fixed Hijri→Gregorian instant), current month, next month, one exported historical horizon.
- **Moments library** (12 fixed): Ramadan (with iftar/suhoor windows + quiet hours pattern), Eid al-Fitr, Eid al-Adha, White Friday, 2 national days (KSA/UAE fixed dates), back-to-school, 4 custom placeholders. City variants: Makkah/Riyadh/Cairo iftar offsets fixed.
- **Slots** (86 fixed across horizons): parity states seeded across all four values; 3 slots with overrideReason (" promo approved for sensitive date by brand" — Reem's edge); 1 slot on a moment collision; comments seeded open/resolved; one slot pair with divergent variants carrying divergenceNote.
- **Jobs**: one completed applyPattern (34 applied, 2 conflicts listed by slotId), one expired export artifact (drives renewal path).

## Behavior
- `listSlots` filter/sort/cursor deterministic; parityState derived from variants by fixed rule.
- `updateSlot` stale baseUpdatedAt → CONFLICT with both payloads; `moveSlot` records ActivityEntry; undo simulation = hook-level (P03) with adapter confirmation.
- `applyPattern`: queued→running (determinate over channel-days)→succeeded; seeds 2 deterministic conflicts (channel dailyLimit breach on one channel — VALIDATION detail counts; moment collision on the other); retryJob failed-only re-applies those two with success.
- `approveHorizon` on horizon with parityGaps → VALIDATION unless `force` flag absent — no, correct behavior: approval allowed but the review summary must be acknowledged; mock returns awaiting-input job requiring acknowledgment then succeeds (exercises CP-4 edge honestly).
- `exportHorizon`: job → artifact with 7-day expiry; expired artifact returns NOT_FOUND with renewal hint in message; idempotent re-run returns same artifact.
- Errors: all codes injectable per method via MockConfig {latencyMs, errorRate, errorCode}; correlationIds fixed `cal-corr-0001`…

## Test-support (mock-only)
reset() · snapshot() · replay(events). No randomness, no network, no timers beyond declared cadences (pattern job paces at 60ms/channel-day).
