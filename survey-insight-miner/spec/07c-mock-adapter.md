# 07c — Mock Adapter: survey-insight-miner

In-memory, deterministic, zero external dependencies. Implements `SurveyInsightAdapterV1` (07b) over the entities of 07a. No randomness, no network, no timers beyond the declared cadences; identical call sequences produce identical states (the determinism contract is the mock's own test oracle). The model-proposal stream is **simulated deterministically** — the mock holds a fixed proposal table (below), so the conditionally-AI path is testable with zero external capability: "bound + consented + quota" is a `MockConfig` state, not a service.

## Seed dataset (fixed, named)

**Workspace** — "Naseej Insights" (defaultLocale `ar`) — a Riyadh research pod. **Members**: Mariam (owner, insights lead) · Khalid (researcher, senior analyst) · Dana (researcher, bilingual associate) · Faisal (viewer, product director — read + slice only).

### Project 1 — `prj-001` "Q3 CSAT — تطبيق التوصيل" (the workhorse, 300 responses)

Metadata columns: `city` (enum: الرياض / جدة / الدمام / أخرى), `channel` (enum: التطبيق / الموقع / الهاتف), `plan` (enum: أساسي / مميز), `satisfaction` (number 1–5). One question:

**`q-001`** prompt {ar: "ما الذي يمكن أن نتحسّنه في تجربة التوصيل؟", en: "What can we improve in the delivery experience?"} — **300 responses** built from fixed strata (the population is defined by construction; every seeded count below is reproducible from it by the rules in §2):

| Stratum | N | Contains (normalized, word-boundary) | Representative fixtures (verbatim, real Arabic) |
|---|---|---|---|
| SHIP | 93 | ≥2 of {الشحن, التوصيل, تأخير, متأخر, السائق} | `resp-00104` "الشحن يتأخر دائماً والتغليف سيئ جداً" (negative tone: متأخر, سيئ; MSA) · `resp-00021` "التوصيل وصل بعد الوقت المحدد بساعتين" (متأخر? no — بعد الوقت؛ negative via context not lexicon → neutral) · `resp-00217` "السائق اللي جاني كان بس يبي يخلّص بسرعة" (dialect-leaning: markers اللي، بس، يبي) |
| PRICE | 67 | ≥2 of {السعر, غالي, التخفيضات, العروض} | `resp-00058` "الأسعار غالية مقارنة بالمطاعم الأخرى" (negative: غالي) |
| PAY | 39 | ≥2 of {الدفع, البطاقة, المحفظة} | `resp-00113` "الدفع عند الاستلام هو الخيار الأفضل عندي" (positive: أفضل? — not in lexicon → neutral; honest fixture: lexicons miss) |
| APP | 33 | ≥2 of {التطبيق, التقييم, المزايدة} | `resp-00007` "التطبيق سهل الاستخدام والتوصيل سريع" (positive: سهل, سريع) |
| DRIVER | 28 | ≥2 of {السائق, التقييم, السلوك} | `resp-00142` "بعض السائقين محترمون وبعضهم مستعجلون" (mixed: no lexicon hits… محترمين not in table → neutral) |
| PACK | 24 | ≥2 of {التغليف, العلبة, الحافظة} | `resp-00189` "استلمت الطلب عبر Shippo والتغليف كان ممتاز" (mixed-script: Latin token Shippo; positive: ممتاز) |
| SUPPORT | 21 | ≥2 of {الدعم, خدمة العملاء, الرد} | `resp-00093` "الدعم يرد ببطء شديد" (negative: بطيء? — بطء vs بطيء: lexicon term is بطيء; "ببطء" normalized? NO — lexicon match is word-boundary on normalized text; ببطء ≠ بطيء → neutral. Honest miss fixture) |
| ORDERS | 18 | ≥2 من {الطلبات, الطلب, سجل} | `resp-00160` "سجل الطلبات يعرض أسعاراً مختلفة عن الفاتورة" (neutral) |
| OVERLAP | 17 | (sub-population: responses engineered into exactly 2 strata above — the overlap fixture; 12 SHIP∩PRICE + 5 PAY∩APP) | `resp-00034` "الشحن سريع لكن السعر غالي على الطلبات الصغيرة" (SHIP∩PRICE) |
| UNASSIGNED | 41 | no top-12 keyword; includes short/idiosyncratic texts | `resp-00250` "لا شيء" (neutral) · `resp-00261` "طيب بس أبغى خصم" (dialect-leaning: بس، أبغى; unassigned — honest tail) |
| EMPTY | 20 | empty text | `resp-00299` "" (counted in coverage, excluded from clustering) |

Stratum sizes are keyword-document frequencies by construction: **الشحن 93 · التوصيل 88 (93 SHIP minus 5 with صياغة مختلفة, plus strata spillover — fixed table, not derived arithmetic) · السعر 67 · تأخير 54 · غالي 45 · متأخر 41 · الدفع 39 · التطبيق 33 · السائق 28 · التغليف 24 · الدعم 21 · الطلبات 18 · التخفيضات 14 (below the top-12 cut — keyword-table-only fixture) · العروض 12 · الخيار 9 · البطاقة 8 · المحفظة 6 · العلبة 6 (below minGroupSize when isolated — unthemed fixture)**. The top-12 table (§2 rule 4, tie-break alphabetical) is exactly: الشحن، التوصيل، السعر، تأخير، غالي، متأخر، الدفع، التطبيق، السائق، التغليف، الدعم، الطلبات.

**Seeded themes on `q-001`** (post-curation state — 13 total):

| id | label (ar / en) | provenance / state | members | keywords | notes |
|---|---|---|---|---|---|
| `thm-001` | "الشحن وتأخير التوصيل" / "Shipping and delivery delays" | human-confirmed (by Khalid) | 93 | الشحن، التوصيل، تأخير، متأخر، السائق | definition seeded bilingual; **3 rule quotes + 1 pinned** (`resp-00217`, pinned by Dana — the dialect verbatim that outranks its rule rank) |
| `thm-002` | "السعر" / "السعر" (pending naming) | keyword-grouping | 67 | السعر، غالي | **merge fixture A** — overlaps `thm-007` by 31 responses |
| `thm-003` | "الدفع" / "الدفع" | keyword-grouping | 39 | الدفع، البطاقة، المحفظة | |
| `thm-004` | "خيارات التغليف" / "Packaging preferences" | **model-proposed, confidence medium, state proposed** | 24 | التغليف، العلبة، الحافظة | **the gate fixture** — pending `confirmTheme`; overlaps floor `thm-009` |
| `thm-005` | "التطبيق" / "التطبيق" | keyword-grouping | 33 | التطبيق، المزايدة | |
| `thm-006` | "متأخر" / "متأخر" | keyword-grouping | 41 | متأخر | |
| `thm-007` | "غالي" / "غالي" | keyword-grouping | 45 | غالي، التخفيضات | **merge fixture B** |
| `thm-008` | "السائق" / "السائق" | keyword-grouping | 28 | السائق، السلوك | |
| `thm-009` | "التغليف" / "التغليف" | keyword-grouping | 24 | التغليف | floor twin of `thm-004` (same 24 responses) — the analyst's choice fixture (confirm `thm-004`, then merge or delete `thm-009`) |
| `thm-010` | "الدعم" / "الدعم" | keyword-grouping | 21 | الدعم، الرد | |
| `thm-011` | "الطلبات" / "الطلبات" | keyword-grouping | 18 | الطلبات، سجل | |
| `thm-012` | "تأخير" / "تأخير" | keyword-grouping | 54 | تأخير | |
| — | (no 13th; 12 floor + 1 proposed = 13) | | | | |

**Coverage fixture on `q-001`**: responses 300 · empty 20 · assigned 239 · unassigned 41 · inMultipleThemes 17 — `sharesMayExceedTotal: true` rendered in-surface. **Language mix**: msa 214 · dialect-leaning 47 · mixed-script 19 · empty 20. **Tone mix**: positive 38 · negative 96 · neutral 141 · mixed 5. **Language override fixture**: `resp-00212` "المندوب كان لبقاً لكن بصبر الحين وصل، بس التأخير التأخير" — detected dialect-leaning (markers: الحين، بس); overridden to `msa` by Dana with reason "جملتان فصحيان وعبارتان عاميتان — التصنيف العامي مضلل للتقرير" (paraphrase-marked seed reason); override renders beside the markers, never replacing them.

### Project 2 — `prj-002` "Exit survey — المشتركون الملغون" (early-stage, 120 responses)

`q-002` {ar: "لماذا ألغيت اشتراكك؟", en: "Why did you cancel your subscription?"} — 120 responses, one seeded confirmed theme ("المحتوى لا يكفي" / "Not enough content", 24 members, human-confirmed by Mariam), one floor run executed, the rest of the top-K table visible and unthemed (the mid-workwave fixture: coverage 46 assigned / 74 unassigned — an honest tail larger than the assigned set, stated in-surface).

### Project 3 — `prj-003` "Sample — شاهد البوابة تعتمد" (sample: true, clearable, 40 responses)

`q-003` {ar: "ما أكثر شيء أزعجك هذا الشهر؟", en: "What frustrated you most this month?"} — 40 responses: 30 containing ≥2 of {الفواتير, الفاتورة, الخدمة}, 1 **model-proposed theme pending its gate** ("الفواتير المتأخرة" / "Late bills", confidence high, 30 members), a merge pair (floor "الفواتير" 22 + floor "الخدمة" 14, overlap 6), and a planted **unassigned tail of 9** (incl. 2 empty) — the P22 value journey: open sample → read the proposal → pass the gate → merge the pair → see coverage say 31 assigned / 9 unassigned.

**Jobs history**: one succeeded import (`job-001`, 300 rows, determinate pacing fixture), one succeeded floor-only run (`job-002`, keywordTable exactly the top-12 above, mode `deterministic-floor`), one succeeded model-assisted run (`job-003`, mode `model-assisted-proposals`, proposals = thm-004 only), one **failed import** (`job-004`: invalid row 17 — VALIDATION fixture with named row, rows 1–16 retained as partial), one export (`job-005`) with artifact `art-001` (formats both; expiresAt = seed time + 7 days; regenerable; themeSetVersion 7). **Activity entries**: ~40 seeded covering every action kind in 07a (incl. thm-001's confirm by Khalid, the resp-00212 override by Dana, the resp-00217 pin by Dana, one proposal rejection with reason on a deleted fixture, and consent-change for the clustering capability).

## Deterministic computation rules (the whole engine — specified exactly)

1. **Normalization pipeline (a VIEW — `Response.text` is never mutated)**: strip tashkeel (U+064B–U+065F, U+0670) and tatweel (U+0640); unify alef variants (أ إ آ ٱ → ا); taa marbuta (ة → ه); alif maqsura (ى → ي); for Latin: case-fold, trim, collapse internal whitespace. The applied ruleset is disclosed in-product (EngineDisclosurePanel) per ai-native-patterns §7.4. Dialect morphology is **never** normalized — اللي stays اللي, أبغى stays أبغى (detection is disclosed, verbatim is preserved).
2. **Language detection (marker rule, fixed tables, precedence-ordered)**: tokenize the raw text on whitespace/punctuation; `langClass` = 'empty' (zero tokens) → 'mixed-script' (≥1 Latin alphabetic token AND ≥1 Arabic-script token) → 'dialect-leaning' (≥2 DISTINCT markers from the fixed dialect table: {اللي، مو، وش، هذي، كذا، عشان، بس، أبغى، يبي، الحين، دلوقت، شوية} — normalized-matched, word-boundary) → 'msa'. `markers` lists every dialect marker found (normalized form), even when classification lands above it (mixed-script with markers lists both facts). `ruleVersion` pins the table. Human overrides record {langClass, reason?, actor, at} and render BESIDE the rule's evidence — never replacing it.
3. **Tone signal (disclosed lexicon heuristic, fixed tables)**: positive lexicon {ممتاز، رائع، جيد، سريع، سهل، أحب، شكراً، مريح، مفيد، نظيف} · negative lexicon {سيئ، بطيء، صعب، متأخر، غالي، مزعج، مشكلة، تعبت، للأسف، غلط} — normalized-matched, word-boundary (derivational misses like ببطء vs بطيء are honest misses, fixture above). `tone` = 'mixed' (both sides hit) → 'positive' (pos>0) → 'negative' (neg>0) → 'neutral'; `lexiconHits` records verbatim matched terms; `heuristic: true` is rendered everywhere the tone appears. `ruleVersion` pins the tables.
4. **Keyword-frequency grouping (the floor)**: over the question's non-empty responses — tokenize normalized text; drop tokens in the fixed default stopword list (Arabic: في، من، على، إلى، عن، مع، هذا، هذه، ذلك، التي، الذي، أن، كان، كانت، قد، لا، ما، هو، هي، هم، أنا، نحن، أنت، كل، بعض، جداً، لكن، أو، ثم، بين، عند، حيث، أيضاً، غير، بعد، قبل، هو، عند؛ Latin: the, a, an, is, are, was, and, but, i, we, you, it, they, of, to, in, on, at, for, with, very, my, our); drop tokens shorter than 2 characters. **Document frequency** = number of responses containing the token (word-boundary, normalized). `topK` (default 12) keywords by (document frequency desc, then normalized form alphabetical — deterministic tie-break) each form a floor theme: members = every response whose normalized text contains the keyword; label = {ar: keyword, en: keyword} (the pending-naming treatment — humans name themes, floors propose grids); keywords = the anchor keyword plus same-stratum co-occurring table entries per the seed construction. Groups with document frequency < `minGroupSize` (default 5) stay in the published `keywordTable` and do NOT become themes (disclosed in the run result).
5. **Re-run semantics**: theme entities persist. A re-run recomputes each floor theme's keyword-derived membership (manual memberships — evidence kind 'manual' — always survive, attached to their theme); a floor theme whose keyword left the top-K renders at its preserved members (manual-only) or zero members with the "keyword left the top-12" state — it never silently vanishes (03 CP-2 edge). Confirmed and merged-away themes are never mutated by a run. Model proposals regenerate as fresh proposal ids (dismissed ids stay dead).
6. **Quote selection (the formula)**: for theme T with keywords K_T and member set M — score every member r: primary = |{k ∈ K_T : k present in normalized r}| (distinct keyword coverage, desc); tie-break 1 = token count of r (asc — concise carries reports); tie-break 2 = respondentRef (asc — stability). Select the top 3 as rule quotes; `rationale` = "ranked {rank} of 3 — {coverage} theme keywords, {tokens} words". Merges re-run the formula over the union with the survivor's keywords. Pinned quotes sit above rule quotes; unpinning restores the rule list exactly.
7. **Coverage arithmetic**: `responses` = all; `emptyResponses` = empty texts (excluded from the clustering universe); `assigned` = non-empty responses with ≥1 membership in included themes (confirmed always; proposed iff `includeProposed`); `unassigned` = non-empty responses with zero memberships; `inMultipleThemes` = responses with ≥2 memberships; `shareOfAssigned` (per theme) = memberCount / assigned. Shares may sum past 1.0 — `sharesMayExceedTotal: true` is a contract literal (07a) and renders in-surface.
8. **Crosstab arithmetic**: cell count = members of the theme with `metadata[columnKey] = value` (blanks → 'unspecified'); `shareWithinColumn` = count / ALL responses of the question with that column value (the denominator answers "what share of Riyadh's responses"); distinct values > 20 → top 19 by count (desc, then value alphabetical) + 'other' aggregate, `collapsedToTopValues: true`; overlap footnote literal on every crosstab (a response in 2 themes counts in both rows).
9. **Job pacing (fixed cadences, no jitter)**: import 40ms per 10 rows; clustering 30ms per 10 responses; export 50ms per format. Progress is determinate units only. The seeded clock starts at 2026-10-17T09:00:00+03:00 and advances only on declared actions; no `Date.now` anywhere in computation (timestamps derive from the seeded clock).

## Model-proposal simulation (the conditionally-AI path, deterministic)

The mock holds a **fixed proposal table**: for `q-001`, exactly one proposal (`thm-004` — "خيارات التغليف" / "Packaging preferences", confidence medium, 24 members, evidence per member as model confidence bands); for `q-003`, exactly one (the sample gate fixture). `MockConfig.capability = 'bound-consented' | 'unbound'` (default **unbound** — the tested default state, 00 success signals): unbound → `runClustering(requestModelProposals: true)` completes floor-only (`engine: 'keyword-floor'`, mode `deterministic-floor`) with a PERMISSION-free honest result — proposals simply do not exist; bound-consented → proposals land as `proposed` themes from the fixed table; `failProposalStreamAt: n` → after n proposals the stream fails and the run completes floor-only with the typed error on the job (partial-result policy). Quota: `quotaExhausted: true` → model-assisted runs return RATE_LIMIT; floor runs never touch quota (07b rule 3).

## Behavior (per operation class)

- `importResponses` (paste) — row format: `respondent-ref | response text | metadata values (city | channel | plan | satisfaction — positionally keyed to the project's columns)`; blank line optional between rows. Rows with fewer than 2 pipes → named invalid; empty response text imports (empty is a fact); respondent-ref collisions suffix `-2`, `-3` (disclosed in `refCollisions`); mixed-script rows import verbatim; detection + tone run at import (rules 2–3). `source: 'intake-capability'` without granted consent → PERMISSION (capability language). Idempotency: same content hash + key returns the original job.
- `runClustering` — implements rules 4–5; result carries `keywordTable`, `groups`, `proposals?`, `coverage`, `engine`, `mode`; re-running produces identical floor state from identical inputs (the test oracle).
- `getConfirmGate` — re-evaluates membership live; members below the evidence floor (model evidence with band 'low') render in `membersExcluded` with the reason.
- `confirmTheme` — confirm → state 'confirmed', provenance 'human-confirmed', actor + timestamp, activity entry, "The Ink Sets" is the UI-side signature (05) — the mock's state change is the instant flip the motion decorates; reject → proposal dismissed (reason optional, recorded), fresh ids on next run.
- `mergeThemes` — verifies live union count vs `confirm.unionMembers` (drift → CONFLICT with the recounted set); moves memberships (manual evidence preserved, keyword evidence recomputed over the union), re-runs quote selection (rule 6), carries pinned quotes marked, sets source theme `merged-away` + `mergedIntoThemeId`, records both counts in the activity detail.
- `saveTheme` — label collision within the question (same normalized ar OR en label) → VALIDATION naming the collision; stale `baseVersion` → CONFLICT both kept; save bumps `version`; floor themes renamed through this op become 'human-confirmed' (naming is a confirm-class act — recorded).
- `setResponseTheme` — assign writes evidence kind 'manual' with actor; unassign removes the membership (reversible both ways); assigning to a merged-away theme → VALIDATION naming the survivor.
- `bulkSetResponseTheme` — `confirmCount` mismatch against the live filtered set → CONFLICT with the recounted set; members already in the theme are skipped and named (`already-member`), never double-counted.
- `setQuotePin` — pin records actor + timestamp; unpin restores the rule list; pinning a non-member → VALIDATION (assign first — the quote must be evidence).
- `setResponseLanguageOverride` — writes the override beside the rule's markers (never replacing); 'empty' not overridable → VALIDATION.
- `getCoverageReport` / `getCrosstab` — rules 7–8; crosstab before any run → VALIDATION offering the run; column key not in the project → VALIDATION naming the project's columns.
- `exportAnalysis` — zero confirmed themes in scope and `includeProposed: false` → VALIDATION ("nothing confirmed to report"); artifacts expire at creation + 7 days; `regenerable: true` always; `themeSetVersion` pinned; later analysis changes flag `newerPending: true` on the artifact row; per-format partial failure injectable; idempotent re-submit returns the original job.
- `getUsage` — fixed window with seeded model-run + export counts; `quotaExhausted` injectable (RATE_LIMIT ladder copy in 11); floor runs never metered.
- `listActivity` — filterable by actor/action/project; append-only; survives everything.

## Failure injection

`MockConfig { latencyMs (default 90), errorRate (default 0), errorCode?, failImportAtRow?, failProposalStreamAt?, failExportFormat?, quotaExhausted?, capability ('unbound' | 'bound-consented', default 'unbound') }` — per-method injection; fixed correlationIds `sim-corr-0001`…; failure responses follow the 7-token taxonomy of 07b exactly. No random jitter: latency and failure points are configuration, not chance.

## Test-support

`reset()` → seed state; `snapshot()` → named state capture; `replay(events)` → deterministic re-derivation; state hashes stable across runs (determinism oracle — the 00 success signal replays the evidence journey twice and compares byte-identical state). Zero external deps; no `Date.now` in any computation (the seeded clock advances only on declared actions).
