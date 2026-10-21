# 11 — Empty / Loading / Error: store-performance-scorecard (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = floor-manager plain (02: states the delta, the basis, the reason — never editorializes performance) · Arabic is فصحى بيضاء utility register · numerals Western everywhere (ledger row — data surface; never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked: المتجر=store · الوردية=shift · فئة الوردية=shift class · المقارنة المثل بالمثل=like-for-like comparison · مؤهل للمقارنة=comp-eligible · بطاقة الأداء=scorecard · مجموعة الأقران=peer group · نمط التشغيل=operating pattern · التغطية=coverage · نافذة الموسم=season window · حزمة التصدير=export pack.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 chain first-run (no records at all) | "No stores, no records, no scorecard yet. Register your first store and its shifts — or open the sample chain and read a finished scorecard first." | "لا متاجر ولا سجلات ولا بطاقة أداء بعد. سجّل أول متجر مع وردياته — أو افتح السلسلة النموذجية واقرأ بطاقة أداء مكتملة أولاً." | Create store / Open sample chain |
| S1 filtered-empty (runs list) | "No scorecard runs match these filters." | "لا تشغيلات بطاقة أداء تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "This chain belongs to another workspace." | "هذه السلسلة تخصّ مساحة عمل أخرى." | Switch workspace |
| S2 board first-run (records exist, no run yet) | "Records are in — no scorecard run yet. Pick a window and run the like-for-like comparison." | "السجلات موجودة — ولا تشغيل بطاقة أداء بعد. اختر نافذة وشغّل المقارنة المثل بالمثل." | Run scorecard |
| S2 board no comp-eligible stores | "No store qualifies as comp under policy v1 for this window — every store is new, closed, or short of matched weeks. Widen the window or loosen nothing silently: check the eligibility ledger." | "لا متجر مؤهل للمقارنة بموجب السياسة v1 في هذه النافذة — كل المتاجر جديدة أو مغلقة أو بأسابيع مطابقة ناقصة. وسّع النافذة، ولا تخفّض المعايير خلسةً: راجع سجل الأهلية." | Open eligibility ledger / Widen window |
| S2 filtered-empty (stores) | "No stores match these filters." | "لا متاجر تطابق هذه المرشّحات." | Clear filters |
| S4 shift lens — store has no trading in a class | "No trading in this class." (per cell — never a zero, never hidden) | "لا تداول في هذه الفئة." (في الخلية — ليست صفراً ولا تُخفى) | — |
| S4 lens first-run | "No run yet under this basis — run the scorecard first, then the lens reads its classes." | "لا تشغيل بعد بهذا الأساس — شغّل بطاقة الأداء أولاً، ثم تقرأ العدسة فئاتها." | Run scorecard |
| S5 stores returned-empty (all closed) | "Every store in this filter is closed. Closed stores keep their history — reopen the filter to read it." | "كل متجر في هذه المرشّحة مغلق. المتاجر المغلقة تحتفظ بتاريخها — أعد فتح المرشّحة لقراءته." | Show closed stores |
| S6 records first-run (per store) | "No records for this store yet. Paste a week of shift records — date, class, sales, transactions, labor hours." | "لا سجلات لهذا المتجر بعد. الصق أسبوعاً من سجلات الورديات — التاريخ والفئة والمبيعات وعدد العمليات وساعات العمل." | Paste records |
| S6 filtered-empty | "No records match these filters." | "لا سجلات تطابق هذه المرشّحات." | Clear filters |
| S7 patterns first-run (per store) | "No operating pattern for this store. Declare its shift windows first — records can't be bucketed without them." | "لا نمط تشغيل لهذا المتجر. أعلّن نوافذ وردياته أولاً — لا يمكن تصنيف السجلات بدونها." | Author pattern |
| S7 season windows empty | "No season windows in this library. Ramadan and the Eids need names and dates before a comparison can disclose its composition." | "لا نوافذ مواسم في هذه المكتبة. يحتاج رمضان والعيدان أسماء وتواريخ قبل أن تفصح المقارنة عن تركيبها." | Add season window |
| S8 jobs empty | "Nothing running. Imports, channel fetches, and exports appear here while they work." | "لا مهام قيد التنفيذ. الاستيرادات وجلب القناة والتصديرات تظهر هنا أثناء عملها." | — |
| Annotations empty (store) | "No context notes on this store yet. Pin what the numbers can't see — renovations, outages, roadworks." | "لا ملاحظات سياق على هذا المتجر بعد. ثبّت ما لا تراه الأرقام — تجديد أو انقطاع أو أعمال طرق." | Add annotation |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 overview skeleton | skeleton cards ×4 + "Loading your chain…" (SR) | بطاقات هيكلية + "جارٍ تحميل سلسلتك…" |
| S2 board skeleton | ranked-row skeletons ×10, basis band static + "Loading the scorecard run…" | صفوف مرتبة هيكلية + "جارٍ تحميل تشغيل بطاقة الأداء…" |
| Import job (determinate) | "Importing 120 of 400 records — store RYD-07, evening shift, week 2026-W39." | "استيراد 120 من 400 سجل — متجر RYD-07، الوردية المسائية، الأسبوع 2026-W39." |
| Channel-fetch job (milestones) | "Fetching records — store 2 of 12." | "جلب السجلات — المتجر 2 من 12." |
| Run compute (large windows) | "Computing the like-for-like comparison — matching weeks, then classes, then scores." | "حساب المقارنة المثل بالمثل — مطابقة الأسابيع، ثم الفئات، ثم الدرجات." |
| KPI switch (lens) | instant swap ≤150ms; no copy needed beyond the announcement | تبديل فوري ≤150 مللي ثانية؛ إعلان فقط |
| Autosave (pattern/policy editors, P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| Export job | "Building the leadership pack — board, breakdowns, lens grid, definitions appendix." | "بناء حزمة القيادة — اللوحة والتفصيلات وشبكة العدسة وملحق التعريفات." |
| S8 job row | determinate: "120 of 400"; indeterminate: "Working — no estimate yet" | "120 من 400" ؛ "قيد العمل — لا تقدير بعد" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (malformed import row) | "Row 17 has no store code — rows around it imported fine. Fix row 17 and import just it." | "السطر 17 بلا رمز متجر — استُوردت الأسطر من حوله سليمة. صحّح السطر 17 واستورد وحده." |
| VALIDATION (unknown store code) | "Code RYD-99 matches no store. Create it, fix the code, or skip the row — nothing lands silently." | "الرمز RYD-99 لا يطابق أي متجر. أنشئه أو صحّح الرمز أو تجاوز السطر — لا شيء يُدخل خلسةً." |
| VALIDATION (empty comp set) | "No store qualifies as comp for this window under policy v1 — the comparison refuses to rank non-comparable data. Widen the window or review eligibility." | "لا متجر مؤهل للمقارنة في هذه النافذة بموجب السياسة v1 — المقارنة ترفض ترتيب بيانات غير قابلة للمقارنة. وسّع النافذة أو راجع الأهلية." |
| VALIDATION (ungoverned pattern) | "JED-04 has records but no operating pattern for their dates — declare its shift windows and the records bucket themselves." | "لدى JED-04 سجلات بلا نمط تشغيل يغطي تواريخها — أعلّن نوافذ الورديات فتُصنَّف السجلات تلقائياً." |
| VALIDATION (missing prior-year season) | "Season-anchored comparison needs the same season's prior occurrence — no prior window exists for this season. Use week-matched, or author the prior season window." | "المقارنة المرتبطة بالموسم تحتاج تواجد الموسم نفسه في العام السابق — لا نافذة سابقة لهذا الموسم. استخدم مطابقة الأسابيع أو أنشئ نافذة الموسم السابق." |
| NOT_FOUND (stale run/store link) | "That run or store is gone from this workspace. It may have been deleted while you were away." | "هذا التشغيل أو المتجر غاب عن مساحة العمل. ربما حُذف أثناء غيابك." → back to chain overview |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the run it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — التشغيل الذي صدر عنه لم يتغيّر." |
| PERMISSION (channel unconsented) | "Record fetching needs the sales-data capability granted to this chain. Grant it — or paste your records; pasting always works." | "جلب السجلات يتطلب منح قدرة بيانات المبيعات لهذه السلسلة. امنحها — أو الصق سجلاتك؛ اللصق يعمل دائماً." |
| PERMISSION (viewer role) | "Your seat reads and exports but doesn't change data here. Ask the chain owner for an analyst seat." | "مقعدك يقرأ ويصدّر ولا يغيّر البيانات هنا. اطلب من مالك السلسلة مقعداً محلّلاً." |
| CONFLICT (concurrent pattern edit) | "Khalid saved a new version of this pattern while you did. Both versions are kept — choose what stays." | "حفظ خالد نسخة جديدة من هذا النمط أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (concurrent policy edit) | "The comp policy changed under your edit — policy v2 is live. Both edits are shown side by side." | "تغيّرت سياسة الأهلية أثناء تحريرك — السياسة v2 سارية. التعديلان معروضان جنباً إلى جنب." |
| CONFLICT (overlapping effective range) | "This pattern's dates overlap version 3. Split the ranges or supersede — overlapping windows never save silently." | "تواريخ هذا النمط تتقاطع مع النسخة 3. افصل النطاقين أو انسخ فوقه — النوافذ المتقاطعة لا تُحفظ خلسةً." |
| RATE_LIMIT (channel quota) | "This month's channel-fetch window is used. Pasted imports keep working unlimited — fetches resume 1 Nov." | "استُهلكت نافذة جلب القناة لهذا الشهر. الاستيراد الملصوق يعمل بلا حدود — يستأنف الجلب في 1 نوفمبر." |
| RATE_LIMIT (export quota) | "Export limit reached for this cycle. The pack regenerates from the run whenever you're ready — nothing is lost." | "بلغت حدّ التصدير لهذه الدورة. تُعاد توليد الحزمة من التشغيل متى كنت جاهزاً — لا شيء ضائع." |
| NETWORK (list fetch) | "The board went stale — reconnecting. No run in your history is lost." | "تقادمت اللوحة — تجري إعادة الاتصال. لا تشغيل في تاريخك ضائع." |
| NETWORK (partial pack) | "The pack delivered 3 of 4 sections — the lens grid didn't build. Retry just the lens grid." | "سلّمت الحزمة 3 من 4 أقسام — لم تُبنَ شبكة العدسة. أعد محاولة الشبكة وحدها." |
| UNKNOWN | "Something failed on our side (ref sps-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع sps-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Import done | "400 records in, 3 updated in place, 2 invalid skipped — every one listed." | "دخل 400 سجل، وحُدّث 3 موضعاً، وتُخطي 2 غير صالحة — كلها مدرجة." |
| Run complete | "Scorecard ready — 11 stores ranked under policy v1, weights v1. Top: RYD-03. Attention: JED-02." | "بطاقة الأداء جاهزة — رُتِّب 11 متجراً بموجب السياسة v1 والأوزان v1. الأعلى: RYD-03. بحاجة إلى انتباه: JED-02." |
| Re-run (rank changes) | "Re-run complete — 3 stores changed rank; 1 entered the attention band." | "اكتملت إعادة التشغيل — غيّرت 3 متاجر ترتيبها؛ ودخل متجر واحد نطاق الانتباه." |
| Flag found | "Season misalignment: this window is 100% Ramadan; the matched prior weeks were 38% — switch to the season-anchored basis for a fair read." | "اختلال موسمي: هذه النافذة 100% داخل رمضان؛ والأسابيع المطابقة السابقة كانت 38% — بدّل إلى الأساس المرتبط بالموسم لقراءة عادلة." |
| Small-sample caution | "Only 5 matched weeks behind this row — read with the count, not just the rank." | "5 أسابيع مطابقة فقط خلف هذا الصف — اقرأه مع العدد لا مع الترتيب وحده." |
| Coverage exclusion | "JED-04 sits out this ranking — 58% coverage, 2 days missing. The gap list is open." | "يجلس JED-04 خارج هذا الترتيب — تغطية 58% ويومان مفقودان. قائمة الفجوات مفتوحة." |
| Annotation pinned | "Annotation pinned — it travels with the store's card into every pack." | "ثُبّتت الملاحظة — ترافق بطاقة المتجر في كل حزمة." |
| Export ready | "Export ready — leadership pack with definitions appendix, expires in 7 days." | "التصدير جاهز — حزمة قيادة مع ملحق التعريفات، تنتهي بعد 7 أيام." |
| Pattern versioned | "Pattern saved as version 4 — earlier records keep the version they were bucketed under." | "حُفظ النمط نسخةً 4 — السجلات الأقدم تحتفظ بالنسخة التي صُنِّفت بها." |
| Undo window (P03, annotation delete) | "Annotation removed — Undo (7s)" | "أُزيلت الملاحظة — تراجع (7 ثوانٍ)" |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| The shift-lens read | "RYD-07 totals look fine — +3.1% like-for-like. Its evening shift tells another story: sales per labor hour down 18%, bottom decile of the high-street group." | "إجماليات RYD-07 تبدو سليمة — ‎+3.1% مثل بالمثل. لكن ورديتها المسائية تحكي وجهاً آخر: المبيعات لكل ساعة عمل هبطت 18%، في العُشر الأدنى لمجموعة الشوارع الرئيسية." |
| Comp badge reveal | "RYD-12 is out of the comparison — trading since 2026-W10, no prior-year weeks to match. It benchmarks, it doesn't rank." | "RYD-12 خارج المقارنة — يتداول منذ الأسبوع 2026-W10 ولا أسابيع سابقة تُطابقه. يقارن مرجعياً ولا يُرتَّب." |
| Method toggle | "Method 2 keeps the partial periods; Method 1 would drop them. 11 stores stay comp either way — the renovation week reads differently, not silently." | "الطريقة 2 تُبقي الفترات الجزئية؛ والطريقة 1 تهدرها. يبقى 11 متجراً مؤهلاً في الحالين — أسبوع التجديد يُقرأ مختلفاً، لا خلسةً." |
| Definitions reveal | "Every number on this board is this formula, that policy version, those matched weeks. Open any of them." | "كل رقم في هذه اللوحة هو هذه الصيغة، بتلك النسخة من السياسة، وبتلك الأسابيع المطابقة. افتح أيّاً منها." |
| Matched-class honesty | "Night trading exists in 5 of your stores — the lens compares those 5, and says so in text." | "التداول الليلي قائم في 5 من متاجرك — تقارنهم العدسة وحدهم، وتقول ذلك نصاً." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Arabic store name in en chrome | "'زاد الطازج — التخصصي' renders right-to-left inside the English board — isolated, never force-flipped." | "تُعرض 'Zad Fresh — Takhassusi' من اليسار إلى اليمين داخل اللوحة العربية — معزولة ولا تُقلب قسراً." |
| Latin record key in ar chrome | "Record key zch-RYD-07-2026-03-30-evening renders LTR inside the Arabic record table, isolated with marks." | "مفتاح السجل zch-RYD-07-2026-03-30-evening يُعرض بالاتجاه اللاتيني داخل جدول السجلات العربي، معزولاً بعلامات العزل." |
| ISO week codes | "Week labels stay Latin (2026-W40) in both directions — they are record keys, not prose." | "تبقى وسوم الأسابيع لاتينية (2026-W40) في الاتجاهين — فهي مفاتيح سجلات لا نثراً." |
