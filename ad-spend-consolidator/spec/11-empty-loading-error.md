# 11 — Empty / Loading / Error: ad-spend-consolidator (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR (bilingual-en product: EN-first chrome with full AR chrome as a first-class citizen — both directions carry every operator string; moment names are authored bilingually by construction) · voice = operator-desk: **plain, calendar-aware, receipt-honest** (02) — states what was spent, in which currency, at which rate, over which window, and what the human decided; never editorializes about campaign quality; never presents declared policy data as market truth · Arabic is فصحى بيضاء · **numerals Western everywhere per ledger row** (data surface — never mixed systems mid-sentence, copy-voice §1.7) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked (02/07a): اتصال القناة=channel connection · نوع القناة=channel kind · بند الإنفاق=spend line item · دفعة الاستيراد=import batch · سياسة التطبيع=normalization policy · عملة التقارير=reporting currency · سعر الصرف=FX rate · إيصال التحويل=conversion receipt · تشغيل التجميع=consolidation run · لقطة=snapshot · تعارض=overlap finding · تسوية التعارض=overlap resolution · مناسبة موسمية=holiday moment · نافذة التغطية=overlay window · دورة=occurrence · نافذة الضبط=control window · بند الميزانية=budget line · إيقاع الإنفاق=pacing · حزمة التقارير=report pack · الأثر=artifact.

## A. Empty states (P01 — four empties, never conflated)

| State | English | Arabic | Action |
|---|---|---|---|
| S1 first-run (no line items, no snapshot) | "No spend here yet. Paste your first channel export — or open the sample workspace and watch an overlap get caught and a Ramadan comparison compute." | "لا إنفاق هنا بعد. الصق أول تصدير قناة — أو افتح مساحة العيّنة وشاهد تعارضاً يُكتشف ومقارنة رمضان تُحسب." | Paste spend lines / Open sample workspace |
| S1 filtered-empty (snapshots/lines) | "No snapshots match these filters." | "لا لقطات تطابق هذه المرشّحات." | Clear filters |
| S1 no-access (viewer on a policy surface) | "This workspace's ledger is readable from your seat; the policy and reconciliation actions need an operator seat." | "سجلّ مساحة العمل هذه مقروء من مقعدك؛ إجراءات السياسة والتسوية تحتاج مقعد مشغّل." | Switch workspace |
| S1 snapshot with zero line items in window | "This snapshot's window holds no line items — the window is honest about being empty, and so is the total." | "لا بنود إنفاق في نافذة هذه اللقطة — النافذة صادقة بفراغها، والإجمالي كذلك." | Change window |
| S2 reconciliation, detector found nothing | "No overlaps in this snapshot. The detector ran across every channel pair and found nothing within the 2 percent epsilon." | "لا تعارضات في هذه اللقطة. جرى الكاشف عبر كل أزواج القنوات ولم يجد شيئاً ضمن هامش الـ2 بالمئة." | Adjust epsilon |
| S2 all findings resolved | "Every overlap in this snapshot is resolved — each with its reason in the ledger and the export." | "كل التعارضات في هذه اللقطة محلولة — كل واحدة بسببها في السجل وفي التصدير." | View reconciliation ledger |
| S2 filtered-empty | "No findings match these states or channels." | "لا نتائج تطابق هذه الحالات أو القنوات." | Clear filters |
| S3 line-item browser filtered-empty | "No line items match these filters. The ledger keeps every row — clear the filters to see them." | "لا بنود إنفاق تطابق هذه المرشّحات. يحتفظ السجل بكل صف — امسح المرشّحات لرؤيتها." | Clear filters |
| S4 snapshots first-run | "No snapshots yet. A consolidation run turns line items into your first versioned number — and versions are how the ledger stays honest." | "لا لقطات بعد. تشغيل تجميع واحد يحوّل بنود الإنفاق إلى رقمك الأول المؤرَّخ — والإصدارات هي كيف يبقى السجل صادقاً." | Run consolidation |
| S4 window with no revisions | "No revisions in this history — upstream figures landed once and never moved." | "لا مراجعات في هذا التاريخ — وصلت أرقام المصدر مرة ولم تتحرك." | — |
| S5 overlay library first-run | "No moments in this library. Ramadan, the Eids, White Friday — moments are the calendar layer your comparisons read." | "لا مناسبات في هذه المكتبة. رمضان والعيدان والجمعة البيضاء — المناسبات هي طبقة التقويم التي تقرأها مقارناتك." | Seed the moment library |
| S5 filtered-empty | "No moments match these filters." | "لا مناسبات تطابق هذه المرشّحات." | Clear filters |
| S6 comparison, no occurrence in window | "No occurrence of this moment inside the snapshot window. Widen the window — or pick an occurrence that exists." | "لا دورة لهذه المناسبة داخل نافذة اللقطة. وسّع النافذة — أو اختر دورة قائمة." | Change occurrence |
| S7 budgets first-run | "No budget lines yet. A budget line is a period, an amount in the reporting currency, and — optionally — the moment it serves." | "لا بنود ميزانية بعد. بند الميزانية فترةٌ ومبلغٌ بعملة التقارير — والمناسبة التي يخدمها إن شئت." | Create budget line |
| S8 connections first-run | "No channels connected. Paste works from the first minute — connections are the enhancement, not the gate." | "لا قنوات متصلة. اللصق يعمل من الدقيقة الأولى — الاتصالات تحسينٌ لا بوابة." | Paste spend lines / Connect a channel |
| S8 connection with no line items | "This connection holds no line items yet. Its first import — paste or pull — starts its ledger." | "لا بنود إنفاق لهذا الاتصال بعد. أول استيراد له — لصقاً أو سحباً — يبدأ سجلّه." | Import for this channel |
| S9 FX table, pair with no rates | "No declared rates for this pair yet — affected line items will carry rate-unavailable receipts and be named in every ratio until a rate is entered." | "لا أسعار صرف معلنة لهذا الزوج بعد — ستحمل البنود المتأثرة إيصالاتِ 'سعر غير متوفر' وتُسمّى في كل نسبة حتى يُدخل سعر." | Enter declared rate |
| S10 jobs empty | "Nothing running. Imports, consolidation runs, and exports appear here while they work." | "لا مهام قيد التنفيذ. الاستيرادات وتشغيلات التجميع والتصديرات تظهر هنا أثناء عملها." | — |
| Snapshot health notice (open overlaps) | "This snapshot carries 1 open overlap — the total counts both sides until it is resolved. The number says so." | "تحمل هذه اللقطة تعارضاً مفتوحاً واحداً — الإجمالي يعدّ الطرفين حتى تتم التسوية. والرقم يقول ذلك." | Open reconciliation |

## B. Loading (P02/P12 — skeletons mirror timeline/table geometry per direction; honest determinate progress)

| State | English | Arabic |
|---|---|---|
| S1 dashboard skeleton | timeline skeleton with reserved band width + breakdown rows ×8 + "Loading the consolidated ledger…" | هيكلية الخط الزمني بعرض نطاقات محجوز + صفوف هيكلية + "جارٍ تحميل السجل المجمَّع…" |
| Snapshot switch | state swap ≤ 120ms, no spinner — the version chip re-labels | تبديل حالة خلال 120 مللي ثانية بلا مؤشر — رقاقة الإصدار تُعاد التسمية |
| Import job (determinate) | "Importing 140 of 180 line items — bad rows are named, revisions supersede, nothing is overwritten." | "استيراد 140 من 180 بند إنفاق — الصفوف المعطوبة تُسمّى، والمراجعات تسبق، ولا يُستبدل شيء." |
| Consolidation run (determinate) | "Normalizing 340 of 780 line items — channels land in the breakdown as they finish." | "تطبيع 340 من 780 بند إنفاق — تصل القنوات إلى جدول التوزيع مع اكتمالها." |
| Consolidation finalizing | "Versioning the snapshot… the total stamps when it locks." | "إصدار اللقطة… يختم الإجمالي عند قفلها." |
| Comparison computing | "Computing the Ramadan 1447 comparison — window, control window, prior occurrence…" (≤150ms, 10) | "حساب مقارنة رمضان 1447 — النافذة ونافذة الضبط والدورة السابقة…" |
| Pacing read | (derived read — updates within 120ms, no spinner) | (قراءة مشتقة — تتحدث خلال 120 مللي ثانية، بلا مؤشر دوران) |
| Autosave (moment/budget/policy editors, P10) | "Saving…" → "Saved" (fades after 3s) | "جارٍ الحفظ…" → "حُفظ" |
| Export job | "Packaging the report — consolidated statement, reconciliation ledger, overlay analysis, raw line items." | "تجميع حزمة التقارير — البيان المجمَّع وسجل التسوية وتحليل التغطية وبنود الإنفاق الخام." |
| FX table load | skeleton rows ×10 with provenance column reserved | صفوف هيكلية بعمود المصدر المحجوز |

## C. Errors (all 7 classes; every error names the next action; ≤2 sentences)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (import bad row) | "Row 17 is malformed — its native amount is missing. Rows 1–16 imported; fix row 17 and import it alone." | "الصف 17 معطوب — مبلغه الأصلي مفقود. استُوردت الصفوف 1–16؛ صحّح الصف 17 واستورده وحده." |
| VALIDATION (resolution without reason) | "A resolution needs a reason — it is the line finance reads when they ask why this spend was counted once." | "التسوية تحتاج سبباً — هذا هو السطر الذي يقرأه المالي حين يسأل لماذا حُسب هذا الإنفاق مرة واحدة." |
| VALIDATION (budget-line currency) | "Budget lines are declared in the workspace reporting currency (SAR) — conversions belong to line items, not to targets." | "تُعلن بنود الميزانية بعملة تقارير مساحة العمل (SAR) — التحويلات شأن البنود لا الأهداف." |
| VALIDATION (same-currency revision) | "A revision must keep its currency — this row arrived in AED against a SAR line. Import it as a new line item instead." | "يجب أن تحافظ المراجعة على عملتها — وصل هذا الصف بالدرهم مقابل سطر بالريال. استورده بنداً جديداً بدلاً من ذلك." |
| VALIDATION (anchor rule broken) | "This movable rule resolves to no Friday in 2026 — check the weekday and ordinal before saving." | "لا تحلّ هذه القاعدة المتحركة إلى جمعة في 2026 — راجع يوم الأسبوع والرتبة قبل الحفظ." |
| VALIDATION (comparison, zero covered days) | "No covered days for this occurrence — there is no honest lift ratio. Widen the snapshot window or pick another occurrence." | "لا أيام مغطاة لهذه الدورة — لا نسبة ارتفاع صادقة. وسّع نافذة اللقطة أو اختر دورة أخرى." |
| VALIDATION (epsilon sanity) | "The epsilon must sit between 0 and 10 percent — 12 rejects real spend as overlaps." | "يجب أن يقع الهامش بين 0 و10 بالمئة — 12 بالمئة يرفض إنفاقاً حقيقياً بوصفه تعارضاً." |
| NOT_FOUND (stale link) | "That snapshot, channel, or moment is gone from this workspace. It may have been retired while you were away." → Back to the dashboard | "تلك اللقطة أو القناة أو المناسبة غابت عن مساحة العمل. ربما أُحيلت للتقاعد أثناء غيابك." → العودة إلى لوحة الإنفاق |
| NOT_FOUND (expired artifact) | "This report pack expired 3 days ago. Regenerate it — the snapshot it came from is unchanged." | "انتهت صلاحية حزمة التقارير قبل 3 أيام. أعد توليدها — اللقطة التي صدرت عنها لم تتغيّر." |
| NOT_FOUND (occurrence label) | "That occurrence isn't in this snapshot's window. The available occurrences are listed beside the field." | "هذه الدورة ليست في نافذة هذه اللقطة. الدورات المتاحة مدرجة بجوار الحقل." |
| PERMISSION (channel pull unconsented) | "Pulling from this channel needs the spend-reporting capability granted to this workspace. Grant it — or paste the export; pasting always works." | "السحب من هذه القناة يتطلب منح قدرة قراءة تقارير الإنفاق لمساحة العمل. امنحها — أو الصق التصدير؛ اللصق يعمل دائماً." |
| PERMISSION (viewer role) | "Your seat reads the ledger, the receipts, and the deltas, and retrieves packs — it doesn't change policy or resolve overlaps. Ask the owner for an analyst seat." | "مقعدك يقرأ السجل والإيصالات والفروق ويسترد الحزم — ولا يغيّر السياسة ولا يسوّي التعارضات. اطلب من المالك مقعد محلّل." |
| CONFLICT (concurrent resolution) | "Turki resolved this overlap while you were deciding. Both attempts are kept — the recorded resolution is shown." | "سوّى تركي هذا التعارض أثناء قرارك. الاحتفاظ بالمحاولتين — التسوية المسجّلة معروضة." |
| CONFLICT (concurrent moment edit) | "Nouf saved a change to this moment while you edited. Both versions are kept side by side." | "حفظت نوف تغييراً في هذه المناسبة أثناء تحريرك. النسختان محفوظتان جنباً إلى جنب." |
| CONFLICT (stale connection edit) | "Lina changed this connection's policy while you edited. Both payloads are kept — choose what stays." | "غيّرت لينا سياسة هذا الاتصال أثناء تحريرك. الاحتفاظ بالحمولتين — اختر ما يبقى." |
| CONFLICT (stale policy edit) | "The normalization policy moved while you edited it. Both versions are kept; the next consolidation uses the newer one only after you re-save." | "تحركت سياسة التطبيع أثناء تحريرك. النسختان محفوظتان؛ والتجميع التالي يستخدم الأحدث فقط بعد إعادة حفظك." |
| RATE_LIMIT (consolidation quota) | "This month's consolidation window is used. Reading the ledger, receipts, comparisons, and pacing keeps working — runs resume 1 November." | "استُهلكت نافذة التجميع لهذا الشهر. قراءة السجل والإيصالات والمقارنات والإيقاع تعمل — تستأنف التشغيلات في 1 نوفمبر." |
| RATE_LIMIT (export quota) | "The export window is used for this cycle — the next pack frees on 1 November. Nothing about your snapshots changes." | "استُهلكت نافذة التصدير لهذه الدورة — تتحرر الحزمة التالية في 1 نوفمبر. لا شيء في لقطاتك يتغيّر." |
| NETWORK (list fetch) | "The line-item list went stale — reconnecting. Every resolution you recorded is safe." | "تقادمت قائمة بنود الإنفاق — تجري إعادة الاتصال. كل تسوية سجّلتها آمنة." |
| NETWORK (export partial) | "The pack delivered 3 of 4 parts — the statement, the ledger, and the overlay analysis arrived; raw line items didn't. Retry just that part." | "سلّمت الحزمة 3 من 4 أجزاء — وصل البيان والسجل وتحليل التغطية، ولم تصل البنود الخام. أعد محاولة ذلك الجزء وحده." |
| UNKNOWN | "Something failed on our side (ref asc-corr-0007). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع asc-corr-0007). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips + counts, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Import done | "180 line items in — 171 appended, 6 superseded as revisions, 3 invalid rows named and skipped." | "دخل 180 بند إنفاق — 171 أُلحقت، و6 سبقتها مراجعات، و3 صفوف غير صالحة سُمّيت وتُخطيت." |
| Consolidation complete (the stamp) | "Consolidation complete — SAR 10.6 million for the window, 5 channels, 1 open overlap. Snapshot version 4." | "اكتمل التجميع — 10.6 مليون ريال للنافذة، 5 قنوات، وتعارض مفتوح واحد. اللقطة إصدار 4." |
| Overlap resolved | "Resolved keep-first — the marketplace connection is the channel of record; your reason is in the ledger and the export." | "سُوّي بالاحتفاظ بالأول — اتصال السوق هو قناة السجل؛ وسببك في السجل وفي التصدير." |
| Overlap resolved (split) | "Split 40/60 as declared — both records carry their portions, and the reason rides with both receipts." | "قُسم 40/60 كما أُعلن — كلا السجلين يحمل حصته، والسبب يرافق الإيصالين." |
| Resolution folded | "The re-run folded your resolution — the overlap is gone from version 5 and the count says so." | "طوى التشغيل المعاد تسويتك — زال التعارض من الإصدار 5 والعدد يقول ذلك." |
| Rate entered | "Declared rate saved — AED to SAR, 1.0183, monthly average for March 2026. It is policy data, printed on every receipt that uses it." | "حُفظ سعر معلن — الدرهم إلى الريال، 1.0183، متوسط مارس 2026. إنه بيانات سياسة، يُطبع على كل إيصال يستخدمه." |
| Rate proposal accepted | "Proposal accepted into the table — provenance 'accepted-proposal' rides the receipts from here." | "قُبل المقترح في الجدول — المصدر 'مقترح مقبول' يرافق الإيصالات من هنا." |
| Moment saved | "Moment saved at version 3 — existing comparisons keep version 2; the next comparison computes on the new anchor." | "حُفظت المناسبة في الإصدار 3 — المقارنات القائمة تحتفظ بالإصدار 2؛ والمقارنة التالية تحسب على المرتكز الجديد." |
| Budget amended | "Amendment recorded — the closed Ramadan line keeps its original numbers; the amendment is history, not a rewrite." | "سُجّل التعديل — بند رمضان المغلق يحتفظ بأرقامه الأصلية؛ والتعديل تاريخ لا إعادة كتابة." |
| Export ready | "Report pack ready — statement, reconciliation ledger, overlay analysis. Expires in 7 days; regenerable identically forever." | "حزمة التقارير جاهزة — البيان وسجل التسوية وتحليل التغطية. تنتهي بعد 7 أيام؛ وتُعاد توليدها بشكل مطابق دائماً." |
| Artifact regenerated | "Pack regenerated — identical to the state it came from. That is what deterministic means here." | "أُعيد توليد الحزمة — مطابقة للحالة التي صدرت عنها. هذا معنى الحتمية هنا." |
| Revision folded | "Revision folded — version 4 differs from version 3 by −SAR 1,560 on one day. September as presented and September as it stands are both in the ledger." | "طُويت المراجعة — الإصدار 4 يختلف عن الإصدار 3 بمقدار −1,560 ريال في يوم واحد. سبتمبر كما عُرض وسبتمبر كما يقوم كلاهما في السجل." |
| Pacing status | "White Friday 2026 is over-pace — 19 percent above the linear line over 16 of 61 days." | "الجمعة البيضاء 2026 فوق الإيقاع — 19 بالمئة فوق الخط الخطي على 16 من 61 يوماً." |
| Comparison read | "Ramadan 1447 lifted 2.05× over its control window; like-for-like against 1446 is +4 percent. 1 excluded day named." | "ارتفع رمضان 1447 بـ2.05 ضعف نافذة ضبطه؛ والمقارنة بـ1446 +4 بالمئة. يوم مستثنى واحد مسمّى." |
| Connection verified | "Connection verified by a real read — the round trip is named in the evidence." | "تم التحقق من الاتصال بقراءة حقيقية — رحلة الذهاب والعودة مسمّاة في الدليل." |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| The Total Stamps (T2 signature) | "The number is stamped — SAR 10.6 million, version 4. This is the artifact you defend later." | "خُتم الرقم — 10.6 مليون ريال، الإصدار 4. هذا الأثر الذي تدافع عنه لاحقاً." |
| The Gregorian-lookalike refusal | "That comparison is a lookalike, not a like-for-like. Ramadan moves — the honest year-over-year is 1447 against 1446, matched by the lunar calendar, and that is the comparison this surface computes." | "تلك المقارنة شبيهة لا مماثلة. رمضان يتحرك — والمقارنة الصادقة عبر السنوات هي 1447 ضد 1446 مقارنةً بالتقويم القمري، وهي ما تحسبه هذه الواجهة." |
| The rate-unavailable honesty | "17 August 2025 has no declared rate — its spend carries a flagged receipt, sits outside the ratios, and is named in the report. A missing rate is a fact, not a zero." | "لا سعراً معلناً ليوم 17 أغسطس 2025 — إنفاقه يحمل إيصالاً موسوماً، ويقبع خارج النسب، ويُسمّى في التقرير. السعر المفقود حقيقة لا صفر." |
| The dual-name weekend | "The same four shopping days are White Friday in Riyadh and Cairo, Yellow Friday in Dubai. Three moments, one weekend, every market answered in its own name." | "الأيام الأربعة نفسها هي الجمعة البيضاء في الرياض والقاهرة، والجمعة الصفراء في دبي. ثلاث مناسبات، عطلة واحدة، وكل سوق يجاب باسمه." |
| The determinism note | "Re-ran the consolidation — same line items, same policy, same number. The 2.05× lift is the same 2.05×." | "أُعيد تشغيل التجميع — البنود نفسها، والسياسة نفسها، والرقم نفسه. ارتفاع 2.05 ضعف هو 2.05 ضعف ذاتها." |
| The revision honesty | "September was presented as SAR 96,412 for that channel; it now stands at SAR 94,852. Both are true, and the ledger keeps both — that is what versioning is for." | "عُرض سبتمبر بمبلغ 96,412 ريالاً لتلك القناة؛ ويقوم الآن عند 94,852. كلاهما صحيح، والسجل يحتفظ بالاثنين — لهذا وجود الإصدارات." |
| The overlap discovery | "Two sources claim the same 30 September days — SAR 101,500 from the agency statement, SAR 101,250 converted from the marketplace console, within the 2 percent epsilon. The ledger refuses to guess; you decide." | "مصدران يطالبان بأيام سبتمبر الثلاثين نفسها — 101,500 ريال من كشف الوكالة، و101,250 ريالاً محوّلة من واجهة السوق، ضمن هامش الـ2 بالمئة. يرفض السجل التخمين؛ القرار لك." |
| Sample workspace badge | "Sample workspace — a planted overlap, a real Ramadan double-occurrence, and one revision that changes September. Clear it when real spend arrives." | "مساحة عيّنة — تعارض مزروع، ودورتا رمضان حقيقيتان، ومراجعة واحدة تغيّر سبتمبر. امسحها متى وصل الإنفاق الحقيقي." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin campaign name in Arabic chrome | "The campaign name `WF26-Prep-MKT` renders left-to-right inside the Arabic chrome — isolated, its punctuation stays put." | "اسم الحملة `WF26-Prep-MKT` يُعرض من اليسار إلى اليمين داخل الهيكل العربي — معزولاً، ويبقى ترقيمه في مكانه." |
| Currency code inside Arabic prose | "The code `SAR` stays Latin inside Arabic sentences — amounts render Western, the code never translates, and the two never reorder." | "يبقى الرمز `SAR` باللاتينية داخل الجمل العربية — المبالغ بالأرقام الغربية، والرمز لا يُترجم، والاثنان لا يتبادلان الترتيب أبداً." |
| External key as the dedupe referent | "The external key `mk-wf26-prep` keeps one physical order in both directions — it is the join the reconciliation reads, and joins cannot mirror." | "يحتفظ المفتاح الخارجي `mk-wf26-prep` بترتيب فيزيائي واحد في الاتجاهين — هو الوصلة التي يقرأها التسوية، والوصلات لا تنعكس." |
| Hijri + Gregorian on one band label | "The band reads Ramadan 1447 in one calendar and 18 February 2026 in the other — both on the label, one disclosure beneath." | "تقرأ النطاقة رمضان 1447 في تقويم و18 فبراير 2026 في الآخر — كلتاهما على الملصق، وإفصاح واحد تحته." |
| Numbers in both directions | "Amounts, rates, and version numbers keep one physical order in both directions — 101,250 is 101,250 in either chrome." | "المبالغ والأسعار وأرقام الإصدارات تحافظ على ترتيب فيزيائي واحد في الاتجاهين — 101,250 هي 101,250 في أي هيكل." |
