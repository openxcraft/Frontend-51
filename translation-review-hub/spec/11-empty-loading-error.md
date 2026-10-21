# 11 — Empty / Loading / Error: translation-review-hub (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = reviewer-desk (02: precise, unhurried, evidence-first — states what the rule found and what the human decided) · Arabic is فصحى بيضاء · **numerals Western everywhere per ledger row** (data surface — never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked (02): مهمة مراجعة=review job · مستند=document · مقطع=segment · المصدر/الهدف=source/target · مسرد=glossary · مصطلح=term · مخالفة مصطلحية=term violation · تحذير ملاءمة الطول=length-fit warning · ملاحظة اتساق=consistency finding · قرار المراجعة=review decision · اعتماد نهائي=sign-off · تصدير=export.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 jobs home first-run | "No review jobs yet. Create one, attach a glossary, and paste your first document — or open the sample and watch the gate refuse an unexplained critical finding." | "لا مهام مراجعة بعد. أنشئ واحدة، وأرفق مسرداً، والصق مستندك الأول — أو افتح العيّنة وشاهد البوابة ترفض مخالفة حرجة بلا تفسير." | New review job / Open sample job |
| S1 filtered-empty | "No review jobs match these filters." | "لا مهام مراجعة تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "These review jobs belong to another workspace." | "هذه المهام تخصّ مساحة عمل أخرى." | Switch workspace |
| S2 job with no documents | "This job reviews nothing yet. Paste a bilingual document — source and target, one pair per block." | "لا تراجع هذه المهمة شيئاً بعد. الصق مستنداً ثنائي اللغة — المصدر والهدف، زوج في كل كتلة." | Import document |
| S3 navigator filtered-empty | "No segments match these filters. Every segment stays in the document — clear the filters to see them." | "لا مقاطع تطابق هذه المرشّحات. كل المقاطع باقية في المستند — امسح المرشّحات لرؤيتها." | Clear filters |
| S3 findings rail, clean segment | "No findings on this segment. The rules ran — terminology, length, consistency — and found nothing." | "لا نتائج على هذا المقطع. جرت القواعد — المصطلحات والطول والاتساق — ولم تجد شيئاً." | — |
| S4 findings console, scan never run | "No findings yet — the scan hasn't run on this document. One run computes terminology, length, and consistency for every segment." | "لا نتائج بعد — لم يُشغَّل الفحص على هذا المستند. تشغيل واحد يحسب المصطلحات والطول والاتساق لكل مقطع." | Run QA scan |
| S4 filtered-empty | "No findings match this kind, severity, or state." | "لا نتائج تطابق هذا النوع أو الخطورة أو الحالة." | Clear filters |
| S4 returned-empty, all resolved | "Every finding on this document is resolved — by edit, by override with a reason, or marked false-positive. Each one kept its record." | "كل نتيجة على هذا المستند محلولة — بتحرير، أو بتجاوز مع سبب، أو موسومة إيجابية كاذبة. وكل واحدة احتفظت بسجلها." | View sign-off gate |
| S5 glossaries first-run | "No glossaries yet. A glossary is what the term checks enforce — build one term at a time, or paste a termbase." | "لا مسارد بعد. المسرد هو ما تفرضه فحوص المصطلحات — ابنِ مصطلحاً مصطلحاً، أو الصق قائمة مصطلحات." | Create glossary / Paste termbase |
| S5 filtered-empty | "No glossaries match these filters." | "لا مسارد تطابق هذه المرشّحات." | Clear filters |
| S6 glossary with no entries | "This glossary is empty — the term checks are honestly off until it holds at least one active entry." | "هذا المسرد فارغ — فحوص المصطلحات متوقفة بصراحة حتى يحمل مدخلاً فعّالاً واحداً على الأقل." | Add first term |
| S6 term search, no results | "No terms match this search. The search normalizes alef and hamza forms, taa marbuta, and yaa — the rules it applied are listed beside the field." | "لا مصطلحات تطابق هذا البحث. يطبّع البحث صور الألف والهمزة والتاء المربوطة والياء — والقواعد المطبقة مدرجة بجوار الحقل." | Clear search |
| S8 jobs empty | "Nothing running. Imports, QA scans, and exports appear here while they work." | "لا مهام قيد التنفيذ. الاستيرادات وفحوص الجودة والتصديرات تظهر هنا أثناء عملها." | — |
| No glossary attached to a job | "Term checks are off — this job has no glossary attached. Length and consistency still run." | "فحوص المصطلحات متوقفة — لا مسرداً مرفقاً بهذه المهمة. الطول والاتساق يعملان." | Attach glossary |
| Gate, no blockers | "Nothing blocks sign-off. Unreviewed segments: 0. Open critical findings: 0." | "لا شيء يعترض الاعتماد النهائي. مقاطع غير مراجَعة: 0. نتائج حرجة مفتوحة: 0." | Sign off |

## B. Loading (P02/P12 — skeletons mirror the three-region layout per direction; honest determinate progress)

| State | English | Arabic |
|---|---|---|
| S1 list skeleton | skeleton rows ×8 + "Loading your review jobs…" (SR) | صفوف هيكلية + "جارٍ تحميل مهام المراجعة…" |
| Pair view boot | two-pane skeleton with reserved rail width | هيكلية ذو لوحين مع عرض محجوز للشريط |
| Import job (determinate) | "Importing 120 of 220 segment pairs — empty targets are kept and flagged at the scan." | "استيراد 120 من 220 زوج مقاطع — الأهداف الفارغة تُحفظ وتُوسم عند الفحص." |
| Termbase import | "Importing terms — row 17 of 24 has no target term and will be named when the import lands." | "استيراد المصطلحات — السطر 17 من 24 بلا مصطلح هدف وسيُسمّى عند اكتمال الاستيراد." |
| QA scan (progressive) | "Scanning segment 140 of 220 — critical findings reach the gate as they are found." | "فحص المقطع 140 من 220 — النتائج الحرجة تصل إلى البوابة فور العثور عليها." |
| Live recompute after edit | "Re-running the rules on this segment…" (≤50ms — usually invisible) | "إعادة تشغيل القواعد على هذا المقطع…" |
| Glossary list | skeleton rows ×6 | صفوف هيكلية |
| Term save | "Saving the term entry…" | "حارٍ حفظ مدخل المصطلح…" |
| Autosave (glossary editor, P10) | "Saving…" → "Saved" (fades after 3s) | "جارٍ الحفظ…" → "حُفظ" |
| Export job | "Packaging the review — bilingual table, QA report, termbase." | "تجميع حزمة المراجعة — الجدول ثنائي اللغة وتقرير الجودة والمسرد." |
| Gate refresh | (derived read — updates within 120ms, no spinner) | (قراءة مشتقة — تتحدث خلال 120 مللي ثانية، بلا مؤشر دوران) |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (import bad block) | "Block 17 is malformed — its source line has no target line. Blocks 1–16 imported; fix block 17 and import it alone." | "الكتلة 17 معطوبة — سطر مصدرها بلا سطر هدف. استُوردت الكتل 1–16؛ صحّح الكتلة 17 واستوردها وحدها." |
| VALIDATION (reject without comment) | "A rejection needs a comment — say what was wrong; the translator's next pass starts from it." | "الرفض يحتاج تعليقاً — قل ما الخطأ؛ جولة المترجم التالية تبدأ منه." |
| VALIDATION (term entry fields) | "A mandated term needs at least one target rendering — this entry mandates 'shopping cart' with none." | "المصطلح المفروض يحتاج صياغة هدف واحدة على الأقل — هذا المدخل يفرض 'shopping cart' بلا أي صياغة." |
| VALIDATION (length policy sanity) | "The proportional band's minimum (1.4) can't exceed its maximum (1.2) — fix the band before saving." | "لا يمكن أن يتجاوز حدّ النطاق التناسبي الأدنى (1.4) حده الأعلى (1.2) — صحّح النطاق قبل الحفظ." |
| VALIDATION (glossary direction mismatch) | "This glossary runs en→ar; the job reviews ar→en. Attach a glossary that matches the job's direction." | "هذا المسرد يعمل من الإنجليزية إلى العربية؛ والمهمة تراجع من العربية إلى الإنجليزية. أرفق مسرداً يطابق اتجاه المهمة." |
| VALIDATION (sign-off gate) | "Sign-off refused — 3 critical findings and 1 unreviewed segment block it. First blocker: segment 47, forbidden term 'عربة التسوق'." | "رُفض الاعتماد النهائي — 3 نتائج حرجة ومقطع غير مراجَع تعترضه. أول معترض: المقطع 47، المصطلح المحظور 'عربة التسوق'." |
| VALIDATION (bulk count drift) | "The set changed since you counted it — it is 84 segments now, not 85. Recount and confirm." | "تغيّرت المجموعة منذ عدّها — إنها 84 مقطعاً الآن، لا 85. أعد العد وأكّد." |
| NOT_FOUND (stale link) | "That review job, document, or segment is gone from this workspace. It may have been deleted while you were away." | "تلك المهمة أو المستند أو المقطع غاب عن مساحة العمل. ربما حُذف أثناء غيابك." → العودة إلى مهام المراجعة |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the review state it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — حالة المراجعة التي صدر عنها لم تتغيّر." |
| PERMISSION (intake capability unconsented) | "Capability intake needs the content-intake capability granted to this workspace. Grant it — or paste the document; pasting always works." | "الاستيراد بالقدرة يتطلب منح قدرة استيعاب المحتوى لمساحة العمل هذه. امنحها — أو الصق المستند؛ اللصق يعمل دائماً." |
| PERMISSION (viewer role) | "Your seat reads and answers queries but doesn't edit here. Ask the workspace owner for a reviewer seat." | "مقعدك يقرأ ويجيب الاستفسارات ولا يحرّر هنا. اطلب من مالك مساحة العمل مقعد مراجع." |
| CONFLICT (concurrent target edit) | "Omar edited this segment's target while you did. Both versions are kept — choose what stays." | "حرّر عمر هدف هذا المقطع أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (term entry edit) | "Rana saved a change to this term while you edited. Both versions are kept side by side." | "حفظت رنا تغييراً في هذا المصطلح أثناء تحريرك. النسختان محفوظتان جنباً إلى جنب." |
| CONFLICT (finding already resolved) | "This finding was already resolved by another seat — the current resolution is shown." | "حُلّت هذه النتيجة بالفعل من مقعد آخر — الحل الحالي معروض." |
| RATE_LIMIT (scan quota) | "This month's QA scan window is used. Reading, editing, and decisions keep working — scans resume 1 Nov." | "استُهلكت نافذة فحوص الجودة لهذا الشهر. القراءة والتحرير والقرارات تعمل — تستأنف الفحوص في 1 نوفمبر." |
| RATE_LIMIT (export quota) | "The export window is used for this cycle — the next package frees up on 1 Nov. Nothing about your review state changes." | "استُهلكت نافذة التصدير لهذه الدورة — تتحرر الحزمة التالية في 1 نوفمبر. لا شيء في حالة مراجعتك يتغيّر." |
| NETWORK (list fetch) | "The segment list went stale — reconnecting. Every decision you made is safe." | "تقادمت قائمة المقاطع — تجري إعادة الاتصال. كل قرار اتخذته آمن." |
| NETWORK (export partial) | "The package delivered 2 of 3 parts — the bilingual table and QA report arrived, the termbase didn't. Retry just the termbase." | "سلّمت الحزمة 2 من 3 أجزاء — وصل الجدول ثنائي اللغة وتقرير الجودة، ولم يصل المسرد. أعد محاولة المسرد وحده." |
| UNKNOWN | "Something failed on our side (ref trh-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع trh-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips + counts, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Import done | "220 segment pairs in — 3 empty targets kept and flagged, 2 duplicates counted, 1 invalid block skipped and named." | "دخل 220 زوج مقاطع — 3 أهداف فارغة حُفظت ووُسمت، وحُسبت تكرارات 2، وتُخطيت كتلة غير صالحة واحدة وسُمّيت." |
| Scan done | "Scan complete — 6 critical and 4 advisory term violations, 9 length warnings, 2 consistency notes, 1 missing translation." | "اكتمل الفحص — 6 مخالفات مصطلحية حرجة و4 استشارية، و9 تحذيرات طول، وملاحظتا اتساق، وترجمة مفقودة واحدة." |
| Violation resolved by edit | "Term check passed — 'السلة' now carries the segment." | "نجح فحص المصطلح — 'السلة' تحمل المقطع الآن." |
| Override recorded | "Critical violation overridden — your reason is in the ledger and the export, permanently." | "تجاوزٌ للمخالفة الحرجة مسجَّل — سببك في السجل وفي التصدير، بشكل دائم." |
| False positive recorded | "Marked false-positive — the matcher's normalization note is attached for the glossary owner to review." | "وُسمت إيجابية كاذبة — ملاحظة التطبيع الخاصة بالمطابق مرفقة ليراجعها مالك المسرد." |
| Overflow acknowledged | "Overflow acknowledged — 'two-line label approved by design' stays with this warning at sign-off." | "قُبل تجاوز الطول — 'تسمية سطرين أقرّها التصميم' تبقى مع هذا التحذير عند الاعتماد." |
| Segment approved | "Segment 47 approved — 121 of 220 reviewed." | "اعتُمد المقطع 47 — روجع 121 من 220." |
| Segment rejected | "Segment 51 rejected — your comment is the translator's next starting point." | "رُفض المقطع 51 — تعليقك نقطة انطلاق المترجم التالية." |
| Query sent | "Query sent to Sarah on segment 88 — she sees the pair and your question, nothing else." | "أُرسل استفسار إلى سارة على المقطع 88 — ترى الزوج وسؤالك، لا غير." |
| Query answered | "Sarah answered the query on segment 88 — your decision stands, the answer is appended history." | "أجابت سارة عن استفسار المقطع 88 — قرارك قائم، والإجابة تاريخٌ مُلحق." |
| Bulk approved | "84 segments approved — every one was unreviewed with zero open findings, exactly as counted." | "اعتُمد 84 مقطعاً — كلها غير مراجَعة وبلا نتائج مفتوحة، كما عُدّت تماماً." |
| Term saved | "Term saved at version 3 — existing findings keep version 2; the next scan enforces the new one." | "حُفظ المصطلح في الإصدار 3 — النتائج القائمة تحتفظ بالإصدار 2؛ والفحص التالي يفرض الجديد." |
| Term deprecated | "Term deprecated — checks stop, history stays. Reactivate any time." | "أُهمل المصطلح — تتوقف الفحوص ويبقى التاريخ. أعد تفعيله متى شئت." |
| Signed off | "Signed off — 220 segments reviewed, 6 overrides with reasons, 1 acknowledged overflow, 0 open critical findings." | "اعتُمد نهائياً — روجعت 220 مقطعاً، و6 تجاوزات مع أسبابها، وتجاوز طول مقبول واحد، و0 نتائج حرجة مفتوحة." |
| Post-sign-off edit | "This job is reopened-pending — your edit created a new pending state. The signature on version 7 stands." | "المهمة مفتوحة مجدداً في وضع الانتظار — تعديلك خلق حالة انتظار جديدة. والتوقيع على الإصدار 7 قائم." |
| Export ready | "Review package ready — bilingual table, QA report, termbase. Expires in 7 days; regenerable forever." | "حزمة المراجعة جاهزة — الجدول ثنائي اللغة وتقرير الجودة والمسرد. تنتهي بعد 7 أيام؛ وتُعاد توليدها دائماً." |
| Artifact regenerated | "Package regenerated — identical to the state it came from. That is what deterministic means here." | "أُعيد توليد الحزمة — مطابقة للحالة التي صدرت عنها. هذا معنى الحتمية هنا." |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Gate refusal (assertive) | "Not yet. Segment 47 carries a forbidden term, segment 88's target is empty, and 84 segments are still unreviewed. Clear these and the gate opens." | "ليس بعد. المقطع 47 يحمل مصطلحاً محظوراً، وهدف المقطع 88 فارغ، و84 مقطعاً ما زالت بلا مراجعة. صفِّ هذه تُفتح البوابة." |
| The gate clears (T2 signature) | "The gate is clear — 220 decisions, 6 reasoned overrides, one seal. This is the artifact you defend later." | "البوابة صافية — 220 قراراً، و6 تجاوزات مسبَّبة، وختم واحد. هذا الأثر الذي تدافع عنه لاحقاً." |
| Clean scan | "Zero critical findings on this document — the rules found nothing to block, and they say so in writing." | "صفر نتائج حرجة على هذا المستند — لم تجد القواعد ما يعترض، وتقول ذلك كتابةً." |
| Term chip dissolve | "'عربة التسوق' is gone; 'السلة' carries the segment now — the rule re-ran and passed." | "زالت 'عربة التسوق'؛ و'السلة' تحمل المقطع الآن — أعادت القاعدة التشغيل ونجحت." |
| Determinism note (scan re-run) | "Re-ran the scan — same state in, same findings out. The 6 critical violations are the same 6." | "أُعيد تشغيل الفحص — الحالة ذاتها دخولاً، والنتائج ذاتها خروجاً. المخالفات الحرجة الست هي الست ذاتها." |
| Sample job badge | "Sample job — a planted violation, a planted unreviewed segment, and a gate that refuses. Clear it whenever real work arrives." | "مهمة عيّنة — مخالفة مزروعة، ومقطع غير مراجَع مزروع، وبوابة ترفض. امسحها متى وصل العمل الحقيقي." |
| Mixed-script satisfaction | "'Marafi Pay' stays in Latin inside the Arabic target, as the glossary mandates — rendered isolated, never transliterated." | "يبقى 'Marafi Pay' باللاتينية داخل الهدف العربي كما يفرض المسرد — يُعرض معزولاً، ولا يُنقل صوتياً أبداً." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin term inside Arabic target | "The Latin term renders left-to-right inside the right-to-left target pane — isolated, punctuation stays put." | "يُعرض المصطلح اللاتيني من اليسار إلى اليمين داخل لوح الهدف الذي يجري من اليمين إلى اليسار — معزولاً، ويبقى الترقيم في مكانه." |
| Arabic segment in en-primary chrome | "The Arabic target renders right-to-left inside the English workspace — the pane's direction follows its content, never the chrome." | "يُعرض الهدف العربي من اليمين إلى اليسار داخل مساحة عمل إنجليزية — اتجاه اللوح يتبع محتواه، لا الهيكل أبداً." |
| Number order in both directions | "Character counts and segment numbers keep one physical order in both directions — 47 is 47 in either chrome." | "أحرف العدّ وأرقام المقاطع تحافظ على ترتيب فيزيائي واحد في الاتجاهين — 47 هي 47 في أي هيكل." |
