# 11 — Empty / Loading / Error: seo-brief-builder (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = analyst-plain (02: states what the data shows and what it doesn't) · Arabic is فصحى بيضاء utility register · numerals Western everywhere (ledger row — data surface; never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked: موضوع=topic · كلمة مفتاحية=keyword · عنقود=cluster · نية البحث=search intent · مطابقة النوايا=intent parity · موجز=brief.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 topics first-run | "No topics yet. Bring one bilingual topic and its keyword lists — or open the sample and watch the parity check find a gap." | "لا مواضيع بعد. أحضر موضوعاً ثنائي اللغة مع قائمتي كلماته المفتاحية — أو افتح العيّنة وشاهد فحص المطابقة يكتشف فجوة." | New topic / Open sample topic |
| S1 filtered-empty | "No topics match these filters." | "لا مواضيع تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "These topics belong to another workspace." | "هذه المواضيع تخصّ مساحة عمل أخرى." | Switch workspace |
| S2 keywords first-run (per locale tab) | "No Arabic keywords yet. Paste your keyword list — one per line, volume optional — or connect the SERP-data capability later." | "لا كلمات مفتاحية عربية بعد. الصق قائمة كلماتك — كلمة في كل سطر، والحجم اختياري — أو اربط قدرة بيانات SERP لاحقاً." | Paste keywords / Connect capability |
| S2 returned-empty (all excluded) | "Every keyword in this topic is marked excluded. Excluded keywords stay in the data — unexclude to work them." | "كل الكلمات المفتاحية في هذا الموضوع موسومة بالمستبعدة. الكلمات المستبعدة تبقى في البيانات — ألغِ الاستبعاد للعمل عليها." | Show excluded / Unexclude all |
| S2 filtered-empty | "No keywords match these filters." | "لا كلمات مفتاحية تطابق هذه المرشّحات." | Clear filters |
| S3 clusters first-run | "No clusters yet — keywords first, then one clustering run. Deterministic grouping needs no capability." | "لا عناقيد بعد — الكلمات المفتاحية أولاً، ثم تشغيل تجميع واحد. التجميع الحتمي لا يحتاج أي قدرة." | Run deterministic clustering |
| S3 filtered-empty | "No clusters match this intent or provenance filter." | "لا عناقيد تطابق مرشّح النية أو المصدر هذا." | Clear filters |
| S4 parity never-run | "No parity result yet. Confirm intents on both locales' clusters, then run the check." | "لا نتيجة مطابقة بعد. أكّد النوايا على عناقيد اللغتين، ثم شغّل الفحص." | Run parity check |
| S4 parity single-locale notice | "The Arabic side has keywords; the English side has none. Parity needs both — ingest the second locale to compare." | "الجهة العربية فيها كلمات مفتاحية؛ والإنجليزية خالية. المطابقة تحتاج الاثنتين — استورد اللغة الثانية للمقارنة." | Go to English keywords |
| S6 briefs first-run | "No briefs yet. Clusters with confirmed intents assemble into one." | "لا موجزات بعد. العناقيد ذات النوايا المؤكدة تُجمَّع في موجز واحد." | Open latest topic |
| S6 filtered-empty | "No briefs match these filters." | "لا موجزات تطابق هذه المرشّحات." | Clear filters |
| S7 jobs empty | "Nothing running. Imports, clustering runs, and exports appear here while they work." | "لا مهام قيد التنفيذ. الاستيرادات وتشغيلات التجميع والتصديرات تظهر هنا أثناء عملها." | — |
| S4 gaps none open | "No open gaps. Every intent one locale covers, the other covers — accepted gaps included." | "لا فجوات مفتوحة. كل نية تغطيها لغة، تغطيها الأخرى — والفجوات المقبولة مشمولة." | Re-run check |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 list skeleton | skeleton rows ×8 + "Loading your topics…" (SR) | صفوف هيكلية + "جارٍ تحميل مواضيعك…" |
| Ingest job (determinate) | "Importing 120 of 400 rows — 'متاجر جاهزه' recognized as a spelling variant of 'متاجر إلكترونية جاهزة'." | "استيراد 120 من 400 صف — التُقطت 'متاجر جاهزه' صيغةً كتابية من 'متاجر إلكترونية جاهزة'." |
| SERP-fetch job (milestones) | "Fetching keyword signals — seed term 2 of 4." | "جلب إشارات الكلمات المفتاحية — المصطلح الأساسي 2 من 4." |
| Clustering job (progressive fill) | "Clustering — 5 of 6 clusters built. The canvas fills as they arrive." | "التجميع — بُني 5 من 6 عناقيد. تكتمل اللوحة مع وصولها." |
| Parity compute (large topics) | "Comparing the two locales' intents…" | "مقارنة نوايا اللغتين…" |
| Brief assembling | "Assembling the brief from 13 clusters and the latest parity result." | "تجميع الموجز من 13 عنقوداً ونتيجة المطابقة الأخيرة." |
| Autosave (P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| Export job | "Bundling the brief — writer bundle, parity appendix on." | "تجميع الموجز — حزمة الكاتب مع ملحق المطابقة." |
| S7 job row | determinate: "120 of 400"; indeterminate: "Working — no estimate yet" | "120 من 400" ؛ "قيد العمل — لا تقدير بعد" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (malformed ingest row) | "Row 17 has no keyword text — rows around it imported fine. Fix row 17 and import just it." | "السطر 17 بلا نص كلمة — استُوردت الأسطر من حوله سليمة. صحّح السطر 17 واستورد وحده." |
| VALIDATION (parity gate) | "Parity needs confirmed intents on both locales. 0 confirmed on either — confirm cluster intents first." | "تحتاج المطابقة نوايا مؤكدة في اللغتين. 0 مؤكدة في كليهما — أكّد نوايا العناقيد أولاً." |
| VALIDATION (locale re-config) | "Topic locales changed after clustering — the clusters are for the old setup. Re-run clustering to match the new locales." | "تغيّرت لغات الموضوع بعد التجميع — العناقيد للإعداد القديم. أعد تشغيل التجميع لمطابقة اللغات الجديدة." |
| VALIDATION (keep-manual-edits choice) | "Re-clustering would rebuild memberships. Keep your confirmed intents and manual moves, or discard them? Choose before running." | "إعادة التجميع ستبني العضويات من جديد. إبقاء نواياك المؤكدة ونقلاتك اليدوية أم هدرها؟ اختر قبل التشغيل." |
| NOT_FOUND (stale topic/brief link) | "That topic or brief is gone from this workspace. It may have been deleted while you were away." | "ذلك الموضوع أو الموجز غاب عن مساحة العمل. ربما حُذف أثناء غيابك." → العودة إلى المواضيع |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the brief it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — الموجز الذي صدر عنه لم يتغيّر." |
| PERMISSION (capability unconsented) | "Keyword-signal fetching needs the SERP-data capability granted to this workspace. Grant it — or paste your keyword list instead; pasting always works." | "جلب إشارات الكلمات يتطلب منح قدرة بيانات SERP لمساحة العمل هذه. امنحها — أو الصق قائمة كلماتك؛ اللصق يعمل دائماً." |
| PERMISSION (viewer role) | "Your seat views and exports but doesn't edit here. Ask the workspace owner for an editor seat." | "مقعدك يعرض ويصدّر ولا يحرّر هنا. اطلب من مالك مساحة العمل مقعداً محرّراً." |
| CONFLICT (concurrent cluster edit) | "Reem edited this cluster while you did. Both versions are kept — choose what stays." | "حرّرت ريم هذا العنقود أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (concurrent brief edit) | "Reem saved a change to this section while you edited. Both versions are kept side by side." | "حفظت ريم تغييراً في هذا القسم أثناء تحريرك. النسختان محفوظتان جنباً إلى جنب." |
| RATE_LIMIT (assist quota) | "This month's assist window is used. Deterministic clustering keeps running unlimited — assists resume 1 Nov." | "استُهلكت نافذة المساعدة لهذا الشهر. التجميع الحتمي يعمل بلا حدود — تستأنف المساعدة في 1 نوفمبر." |
| RATE_LIMIT (rung 2 notice) | "Running near the assist limit — suggestions will thin out until 1 Nov." | "اقترب الاستخدام من حدّ المساعدة — ستقلّ الاقتراحات حتى 1 نوفمبر." |
| NETWORK (list fetch) | "The keyword list went stale — reconnecting. Nothing you confirmed is lost." | "تقادمت قائمة الكلمات — تجري إعادة الاتصال. لا شيء ممّا أكّدته ضائع." |
| NETWORK (export partial) | "The bundle delivered 1 of 2 formats — the markdown brief arrived, the appendix didn't. Retry just the appendix." | "سلّمت الحزمة 1 من 2 صيغ — وصل موجز الماركداون ولم يصل الملحق. أعد محاولة الملحق وحده." |
| UNKNOWN | "Something failed on our side (ref sb-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع sb-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Ingest done | "400 rows in, 12 duplicates counted, 2 invalid skipped — every one listed." | "دخل 400 صف، وحُسبت 12 تكراراً، وتُخطي 2 غير صالحة — كلها مدرجة." |
| Clustering done (deterministic) | "6 clusters from 14 keywords — deterministic grouping, no capability used." | "6 عناقيد من 14 كلمة — تجميع حتمي، بلا أي قدرة." |
| Clustering done (assist) | "7 clusters — assist refined 1 boundary. Confirm its suggestion, or override it." | "7 عناقيد — نقّحت المساعدة حدّاً واحداً. أكّد اقتراحها أو تجاوزه." |
| Intent confirmed | "Intent confirmed — 'تكلفة إنشاء متجر إلكتروني' now counts as commercial in parity." | "أُكّدت النية — 'تكلفة إنشاء متجر إلكتروني' تُحتسب تجاريةً في المطابقة." |
| Parity ready | "Parity check ready — 5 matched pairs, 2 open gaps, 1 accepted." | "فحص المطابقة جاهز — 5 أزواج متطابقة، و2 فجوة مفتوحة، و1 مقبولة." |
| Gap resolved | "Gap resolved — the Arabic plan now answers the intent 'الربح من المتجر الإلكتروني'." | "حُلّت الفجوة — خطة العربية تجيب الآن عن نية 'الربح من المتجر الإلكتروني'." |
| Gap accepted | "Gap accepted — parity carries it as accepted, with your reason attached." | "قُبلت الفجوة — تحملها المطابقة مقبولةً مع سببك المرفق." |
| Brief assembled | "Brief assembled — 6 sections from 13 clusters, gaps offered as sections." | "جُمّع الموجز — 6 أقسام من 13 عنقوداً، والفجوات معروضة أقساماً." |
| Brief marked ready | "Marked ready — writers get it from here. Every edit after this re-opens the draft." | "وُسم جاهزاً — يستلمه الكتّاب من هنا. كل تحرير بعده يعيد فتح المسودة." |
| Export ready | "Export ready — writer bundle, parity appendix on, expires in 7 days." | "التصدير جاهز — حزمة الكاتب مع ملحق المطابقة، تنتهي بعد 7 أيام." |
| Undo window (P03, exclusion) | "Keyword excluded — Undo (7s)" | "استُبعدت الكلمة — تراجع (7 ثوانٍ)" |

## E. Assist & parity moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Assist suggestion (P15 draft) | "Suggestion: split 'تصميم متجر إلكتروني' into its own cluster — informational. Confirm or dismiss." | "اقتراح: فصل 'تصميم متجر إلكتروني' في عنقود خاص — نية معلوماتية. أكّد أو ارفض." |
| Suggestion disagreement | "The assist says commercial; you set informational. Yours stands — the disagreement is recorded." | "تقول المساعدة تجارية؛ وحدّدت أنت معلوماتية. قرارك قائم — والاختلاف مسجَّل." |
| Degraded run notice | "The assist is off this run — clusters come from deterministic grouping. Same rules, no capability." | "المساعدة متوقفة في هذا التشغيل — العناقيد من التجميع الحتمي. القواعد ذاتها بلا قدرة." |
| Rung 4 banner (capability off) | "The clustering assist is unavailable right now. Everything else works — deterministic grouping, parity, briefs, exports. We'll say when it returns (est. 2 hours)." | "مساعدة التجميع غير متاحة الآن. كل ما عداها يعمل — التجميع الحتمي والمطابقة والموجزات والتصديرات. سنخبرك عند عودتها (تقديراً ساعتان)." |
| Rung 3 notice | "Assists are template-only this cycle — suggestions come from cue rules and are labeled as such." | "المساعدات قوالبية في هذه الدورة — الاقتراحات من قواعد الإشارات وموسومة بذلك." |
| Quota meter warning (80%) | "Assist window at 17 of 20 — determinism stays free either way." | "نافذة المساعدة عند 17 من 20 — الحتمية تبقى مجانية في الحالين." |
| Normalization disclosure (first reveal) | "'متجر الكتروني' grouped with 'متجر إلكتروني' — the alef rule. See every rule the grouping used." | "جُمعت 'متجر الكتروني' مع 'متجر إلكتروني' — قاعدة الألف. اعرض كل قواعد التجميع المستخدمة." |
| Unconfirmed intents at parity | "2 clusters on the Arabic side carry suggested, unconfirmed intents — confirm to include them in parity." | "عنقودان في الجهة العربية بنوايا مقترحة غير مؤكدة — أكّدهما لإدراجهما في المطابقة." |
| Stale cluster warning (brief section) | "This section's cluster changed since assembly — re-assemble to bind the new evidence, or keep the text as-is." | "تغيّر عنقود هذا القسم منذ التجميع — أعد التجميع لربط الدليل الجديد، أو أبقِ النص كما هو." |
| Sample topic badge | "Sample topic — full pipeline, synthetic volumes. Clear it whenever real work arrives." | "موضوع عيّنة — خط كامل وأحجام تركيبية. امسحه متى وصل العمل الحقيقي." |
| Excluded keyword note | "Excluded keywords never enter clusters — they stay queryable, with the reason you logged." | "الكلمات المستبعدة لا تدخل العناقيد — تبقى قابلة للاستعلام مع السبب الذي سجّلته." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin brand keyword in ar table | "salla — Latin-script brand query inside the Arabic locale. Rendered isolated; sorting follows the normalized Arabic rules." | "salla — استعلام علامة بخط لاتيني داخل الجهة العربية. يُعرض معزولاً؛ والفرز يتبع قواعد العربية المطبَّعة." |
| Arabic keyword in en chrome | "'متاجر جاهزه' renders right-to-left inside the English table — isolated, never force-flipped." | "تُعرض 'متاجر جاهزه' من اليمين إلى اليسار داخل الجدول الإنجليزي — معزولة، ولا تُقلب قسراً أبداً." |
