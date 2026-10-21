# 11 — Empty / Loading / Error: sales-cohort-view (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = analyst-plain, numbers-forward (02: every rate names its denominator; every comparison names its composition) · Arabic is فصحى بيضاء utility register · numerals Western everywhere (ledger row — data surface; never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked: الفوج=cohort · شبكة الفوج=cohort grid · نافذة الموسم=season window · تراكب المواسم=season overlay · التوافق مع الموسم=season alignment · تركيبة المواسم=season composition · الاكتساب=acquisition · الشراء المتكرر=repeat purchase · الإيراد=revenue · الفترة=period · السوق=market · العميل=customer · الطلب=order · التغطية=coverage · الانجراف=drift · المرحلة=phase · حزمة الأدلة=evidence pack · المصدر=source.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 first-run (no source, no sample) | "No cohort grid yet. Open the seeded sample world and read a season-anchored grid in two minutes — or paste an orders sample and compute your own." | "لا شبكة فوج بعد. افتح عالما العينة المزرعة واقرأ شبكة مثبتة على الموسم في دقيقتين — أو الصق عينة طلبات واحسب شبكتك." | Open sample world / Paste orders sample |
| S1 sample-data mode | "Working on sample data — coverage 2024-10-01 to 2026-10-15. Every rule applies; bind your commerce source when real data is ready." | "تعمل بيانات العينة — التغطية من 2024-10-01 إلى 2026-10-15. كل القواعد سارية؛ اربط مصدر التجارة متى جهزت بياناتك الحقيقية." | Bind source / Keep sample |
| S1 filtered-empty | "No cohorts match these filters." | "لا أفواج تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "This workspace's grids belong to another team." | "شبكات مساحة العمل هذه تخصّ فريقاً آخر." | Switch workspace |
| S1 coverage-empty (requested range outside coverage) | "The requested range sits outside source coverage (2024-10-01 to 2026-10-15). Move the range or extend coverage first." | "المدى المطلوب خارج تغطية المصدر (من 2024-10-01 إلى 2026-10-15). حرّك المدى أو وسّع التغطية أولاً." | Adjust range |
| S1 season-anchored, no windows for market | "No declared season windows for this market — anchoring needs the calendar first. Curated defaults exist for every kind." | "لا نوافذ مواسم معلنة لهذا السوق — التثبيت يحتاج التقويم أولاً. توجد افتراضيات منتقاة لكل نوع." | Open season calendar / Load curated defaults |
| S4 calendar first-run (market uncovered) | "No windows declared for UAE yet. Load the curated defaults, then edit what your market does differently." | "لا نوافذ معلنة للإمارات بعد. حمّل الافتراضيات المنتقاة ثم حرّر ما يختلف فيه سوقك." | Load curated defaults |
| S4 all-archived | "Every window for this market is archived. Restore one or create anew — archived windows still back their old snapshots." | "كل نوافذ هذا السوق مؤرشفة. استعد واحدة أو أنشئ جديدة — النوافذ المؤرشفة تسند لقطاتها القديمة." | Restore window |
| S5 comparisons never-created | "No comparisons yet. Stage one from the grid — pick two cohorts and align them on the season." | "لا مقارنات بعد. جهّز واحدة من الشبكة — اختر فوجين ووفّقهما على الموسم." | Open grid |
| S6 views first-run | "No saved views. The anchored Ramadan view saves in three clicks from the grid." | "لا عروض محفوظة. عرض رمضان المثبت يُحفظ بثلاث نقرات من الشبكة." | Open grid |
| S6 filtered-empty | "No views match these filters." | "لا عروض تطابق هذه المرشّحات." | Clear filters |
| S9 jobs empty | "Nothing running. Source refreshes, sample imports, and exports appear here while they work." | "لا مهام قيد التنفيذ. تحديثات المصدر واستيرادات العينات والتصديرات تظهر هنا أثناء عملها." | — |
| S9 activity empty | "No recorded actions yet — window edits, view saves, and exports land here with actor and timestamp." | "لا إجراءات مسجّلة بعد — تحريرات النوافذ وحفظ العروض والتصديرات تُرصد هنا بالفاعل والوقت." | — |

## B. Loading (P02/P12 — skeletons mirror grid geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 grid skeleton | row-band and column-band skeleton + "Computing the cohort grid…" (SR) | هيكل صفوف وأعمدة + "جارٍ حساب شبكة الفوج…" |
| Grid compute (large scale) | "Computing 104 weekly cohorts over 24 months…" | "حساب 104 فوجاً أسبوعياً على 24 شهراً…" |
| Source refresh job | "Refreshing source coverage — comparing declared window." | "تحديث تغطية المصدر — مقارنة النافذة المعلنة." |
| Sample import job (determinate) | "Importing 120 of 400 rows — 2 duplicates counted so far." | "استيراد 120 من 400 صف — حُسب 2 تكراراً حتى الآن." |
| Export job | "Bundling the evidence pack — grid, comparison, season windows, ruleset." | "تجميع حزمة الأدلة — الشبكة والمقارنة ونوافذ المواسم وقواعد الحساب." |
| Comparison compute | "Aligning the two cohorts on the season…" | "مواءمة الفوجين على الموسم…" |
| Calendar autosave (P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| S9 job row | determinate: "120 of 400"; indeterminate: "Working — no estimate yet" | "120 من 400"؛ "قيد العمل — لا تقدير بعد" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (malformed sample row) | "Row 17 has no customer key — rows around it imported fine. Fix row 17 and import just it." | "السطر 17 بلا مفتاح عميل — استُوردت الأسطر من حوله سليمة. صحّح السطر 17 واستورد وحده." |
| VALIDATION (zero-length season window) | "The window ends before it starts — fix the end date before saving." | "تنتهي النافذة قبل أن تبدأ — صحّح تاريخ النهاية قبل الحفظ." |
| VALIDATION (same-kind overlap without note) | "This window overlaps 'Ramadan 1447' by 9 days. Record why both windows stay, or adjust the dates." | "تتداخل هذه النافذة مع 'رمضان 1447' في 9 أيام. سجّل سبب بقاء النافذتين معاً، أو عدّل التواريخ." |
| VALIDATION (comparison request unresolvable) | "One of the two cohorts no longer resolves in this snapshot — re-open the grid and stage the comparison again." | "أحد الفوجين لم يعد قابلاً للحل في هذه اللقطة — أعد فتح الشبكة وجهّز المقارنة من جديد." |
| NOT_FOUND (stale snapshot link) | "That snapshot is no longer held by this workspace. Re-run the query — the season windows it used are unchanged." | "لم تعد مساحة العمل تحتفظ بتلك اللقطة. أعد تشغيل الاستعلام — نوافذ المواسم التي استخدمتها لم تتغير." |
| NOT_FOUND (expired artifact) | "This evidence pack expired 12 days ago. Regenerate it — the snapshots it came from are immutable, so the pack is identical." | "انتهت صلاحية حزمة الأدلة قبل 12 يوماً. أعد توليدها — اللقطات التي صدرت عنها ثابتة، فالحزمة مطابقة تماماً." |
| NOT_FOUND (archived window referenced) | "The anchoring references 'Eid gifting extended 1447', now archived. Restore it or re-anchor without it." | "يشير التثبيت إلى 'هدايا العيد الممتدة 1447' وهي مؤرشفة الآن. استعدها أو أعد التثبيت بدونها." |
| PERMISSION (viewer role) | "Your seat reads and exports but doesn't edit here. Ask the workspace owner for an editor seat." | "مقعدك يقرأ ويصدّر ولا يحرّر هنا. اطلب من مالك مساحة العمل مقعداً محرّراً." |
| PERMISSION (workspace scoping) | "These grids belong to another workspace. Switch to yours from the account menu." | "هذه الشبكات تخصّ مساحة عمل أخرى. بدّل إلى مساحتك من قائمة الحساب." |
| CONFLICT (concurrent window edit) | "Sami edited this window while you did. Both versions are kept — choose what stays." | "حرّر سامي هذه النافذة أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (superseded-snapshot comparison) | "The source refreshed since this comparison was staged. The old comparison stays readable — re-stage against the fresh snapshot to quote current numbers." | "تحيّن المصدر منذ تجهيز هذه المقارنة. المقارنة القديمة تبقى مقروءة — أعد تجهيزها على اللقطة الحديثة لاقتباس أرقام حالية." |
| RATE_LIMIT (refresh cadence) | "The source refreshes hourly at most — the last refresh was 20 minutes ago. Wait or read the last-known snapshot." | "يتحدّث المصدر ساعةً على الأكثر — كان آخر تحديث قبل 20 دقيقة. انتظر أو اقرأ آخر لقطة معروفة." |
| RATE_LIMIT (export burst) | "That's several exports inside a minute. The pack regenerates byte-identically — pace them out." | "هذه عدة تصديرات خلال دقيقة. تُولَّد الحزمة مطابقةً تماماً — رتّبها على فترات." |
| NETWORK (source unreachable) | "The commerce source is unreachable — showing the last-known snapshot (synced 2026-10-15). Nothing quoted is lost." | "مصدر التجارة لا يمكن الوصول إليه — عرض آخر لقطة معروفة (محدثة 2026-10-15). لا شيء مقتبسٌ ضائع." |
| NETWORK (list fetch) | "The list went stale — reconnecting. Your saved views are server-side and safe." | "تقادمت القائمة — تجري إعادة الاتصال. عروضك المحفوظة على الخادم وآمنة." |
| UNKNOWN | "Something failed on our side (ref scv-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع scv-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Grid ready | "Grid ready — 104 weekly cohorts, 24 months, coverage clamp: none." | "الشبكة جاهزة — 104 فوج أسبوعي، 24 شهراً، بلا اقتصاص تغطية." |
| Grid ready (clamped) | "Grid ready — 104 cohorts. Requested from 2024-09-01; coverage starts 2024-10-01, so the first month is excluded." | "الشبكة جاهزة — 104 فوج. طُلب البدء من 2024-09-01؛ التغطية تبدأ 2024-10-01 فاستُبعد الشهر الأول." |
| Comparison ready | "Comparison ready — Ramadan 1447 peak vs Ramadan 1446 peak, season-aligned, 6 shared complete periods." | "المقارنة جاهزة — ذروة رمضان 1447 مقابل ذروة رمضان 1446، بتوافق الموسم، و6 فترات كاملة مشتركة." |
| Comparison delta (read at P6) | "Repeat purchase at period 6: 11.0% vs 7.0% — plus 4.0 points, denominators 214 and 178." | "الشراء المتكرر في الفترة 6: ‏11.0% مقابل 7.0% — بفارق 4.0 نقاط، والمقامان 214 و178." |
| Season window saved | "Window saved — 'Ramadan 1447' v3. Grids computed under v2 stay as they were." | "حُفظت النافذة — 'رمضان 1447' الإصدار 3. الشبكات المحسوبة بالإصدار 2 تبقى كما كانت." |
| View saved | "View saved — 'White Friday quality check'. It re-runs against current data on every open." | "حُفظ العرض — 'فحص جودة الجمعة البيضاء'. يعاد تشغيله على البيانات الحالية عند كل فتح." |
| Export ready | "Evidence pack ready — grid, comparison, season windows, ruleset. Expires in 7 days." | "حزمة الأدلة جاهزة — الشبكة والمقارنة ونوافذ المواسم وقواعد الحساب. تنتهي بعد 7 أيام." |
| Sample imported | "400 rows in, 2 duplicates counted, 1 invalid skipped and named." | "دخل 400 صف، وحُسب 2 تكراراً، وتُخطي 1 غير صالح وسمّي." |
| Source refreshed | "Source refreshed — coverage 2024-10-01 to 2026-10-15, synced just now." | "تحيّن المصدر — التغطية من 2024-10-01 إلى 2026-10-15، والتحديث الآن." |
| Undo window (P03, view delete) | "View deleted — Undo (7s)" | "حُذف العرض — تراجع (7 ثوانٍ)" |

## E. Honesty & season moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Season overlay ON (the signature settle) | "Season overlay on — 12 windows on the acquisition axis, drift disclosed on lunar windows." | "تراكب المواسم مفعّل — 12 نافذة على محور الاكتساب، مع إفصاح الانجراف في نوافذ التقويم القمري." |
| Composition disclosure (grid header) | "Cohort composition — Ramadan 1447 peak: 100% of window days · non-seasonal: 0%." | "تركيبة الفوج — ذروة رمضان 1447: ‏100% من أيام النافذة · غير موسمي: 0%." |
| Composition disclosure (mixed month) | "Cohort composition — 2025-03: Ramadan peak 73% · Eid al-Fitr 26% · non-seasonal 1%." | "تركيبة الفوج — 2025-03: ذروة رمضان 73% · عيد الفطر 26% · غير موسمي 1%." |
| Suppression honesty (cell) | "Count only — 8 customers. Rates wait for 10 or more." | "العدد فقط — 8 عملاء. تنتظر النسب 10 فأكثر." |
| Small-sample caution (cell) | "Small cohort — 24 customers. Quote with the denominator attached." | "فوج صغير — 24 عميلاً. اقتبس مرفقاً بالمقام." |
| In-progress period (column) | "October 2026 is in progress (15 of 31 days covered) — excluded from means." | "أكتوبر 2026 قيد التدفق (15 من 31 يوماً مغطاة) — مستبعد من المتوسطات." |
| Pre-coverage counter (sources) | "132 customers ordered only before coverage — they join no cohort, and are counted, not hidden." | "132 عميلاً اشتروا قبل التغطية فقط — لا ينضمون لأي فوج، ويُحصَون لا يُخفَون." |
| Drift disclosure (rail/window) | "Lunar window — dates may shift by one day on moon sighting (Umm al-Qura presented)." | "نافذة قمرية — قد تتزحزح التواريخ يوماً واحداً بحسب رؤية الهلال (يعرض أم القرى)." |
| Ramadan drift fact (calendar) | "Ramadan 1446 began 2025-03-01; Ramadan 1447 began 2026-02-18 — eleven days earlier. Compare season to season, not March to March." | "بدأ رمضان 1446 في 2025-03-01؛ وبدأ رمضان 1447 في 2026-02-18 — أحد عشر يوماً أبكر. قارن موسماً بموسم، لا مارس بمارس." |
| Deal-hunter read (comparison) | "White Friday 2025: 438 customers acquired, 15.0% repeating at period 1 — the biggest door, the weakest return." | "الجمعة البيضاء 2025: ‏438 عميلاً مكتسبين، و15.0% يكررون في الفترة 1 — أكبر باب وأضعف عودة." |
| Size-imbalance note (duel) | "Cohort sizes differ 4.1× — read the rates, weigh the story by the denominators." | "تتساوى أحجام الفوجين بفارق 4.1× — اقرأ النسب وزِن القصة بالمقامات." |
| Truncation note (duel) | "The younger cohort has 6 complete periods — the comparison stops where its data stops." | "للفوج الأصغر 6 فترات كاملة — تتوقف المقارنة حيث تتوقف بياناته." |
| Non-AI posture (definitions footer) | "Every number on this surface is deterministic arithmetic — no model, no prediction, no forecast. Observed revenue only." | "كل رقم على هذا السطح حساب حتمي — لا نموذج ولا تنبؤ ولا توقّع. إيرادات مشاهدة فقط." |
| Sample-world badge | "Sample world — Qamar Retail, synthetic orders, real calendar math. Clear it when real data arrives." | "عالما العينة — قمر ريتيل، طلبات تركيبية، وحساب تقويمي حقيقي. امسحه متى وصلت البيانات الحقيقية." |
| Missing customer label (drill) | "This customer arrived without a source label — the key is the identifier." | "وصل هذا العميل بلا وسم من المصدر — المفتاح هو المعرّف." |
| Mean disclosure | "Cross-cohort mean is weighted by cohort size — 214 and 178 count more than 24." | "المتوسط بين الأفواج مرجّح بحجم الفوج — 214 و178 يَزنان أكثر من 24." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Arabic-labeled view in EN chrome | "'شبكات رمضان المثبتة على الموسم' renders right-to-left inside the English views list — isolated, never force-flipped." | "تُعرض 'شبكات رمضان المثبتة على الموسم' من اليمين إلى اليسار داخل قائمة العروض الإنجليزية — معزولة، ولا تُقلب قسراً أبداً." |
| Latin customer key in AR drill | "qmr-c-2214 renders left-to-right inside the Arabic drill table — isolated, sorting follows the Arabic rules." | "يُعرض qmr-c-2214 من اليسار إلى اليمين داخل جدول التنقيب العربي — معزولاً، ويتبع الفرز قواعد العربية." |
| Dual-calendar window line | "Ramadan 1447 — 2026-02-18 to 2026-03-19 · 1–30 Ramadan 1447 — both calendars, one window, drift ±1 day." | "رمضان 1447 — من 2026-02-18 إلى 2026-03-19 · 1–30 رمضان 1447 — تقويمان لنافذة واحدة، وانجراف ±1 يوم." |
| Mixed direction in composition sentence | "Composition lines carry Latin dates inside Arabic prose — each date isolated so the sentence reads cleanly." | "تحمل أسطر التركيبة تواريخ لاتينية داخل نثر عربي — كل تاريخ معزول فتُقرأ الجملة سليمة." |

## G. Freshness chips (state copy, every grid header)

| State | English | Arabic |
|---|---|---|
| bound + fresh | "Source synced 2026-10-15 · coverage to 2026-10-15" | "المصدر محدَّث 2026-10-15 · التغطية حتى 2026-10-15" |
| syncing | "Refreshing source…" | "تحديث المصدر…" |
| stale | "Stale — last sync 2026-09-28. Grids quote that day's truth." | "مُتقادِم — آخر تحديث 2026-09-28. الشبكات تقتبس حقيقة ذلك اليوم." |
| failed | "Source failed — last-known snapshot shown. Refresh or paste a sample." | "فشل المصدر — تُعرض آخر لقطة معروفة. حدّث أو الصق عينة." |
| sample-only | "Sample data — no source bound. Paste-import keeps everything working." | "بيانات عينة — لا مصدر مربوطاً. اللصق والاستيراد يبقيان كل شيء عاملاً." |
