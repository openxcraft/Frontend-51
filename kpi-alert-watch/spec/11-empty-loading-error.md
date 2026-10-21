# 11 — Empty / Loading / Error: kpi-alert-watch (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR · voice = operator-plain (02: every sentence of consequence carries a number and a comparison; adjectives are banned from detection copy) · Arabic is فصحى بيضاء utility register · numerals Western in BOTH directions (ledger row — never mixed systems; never Arabic-Indic in chrome) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked: مراقبة=watch · تغذية البيانات=metric feed · اكتشاف=detection · نطاق العتبة=threshold band · خط الأساس الموسمي=seasonal baseline · الملخص=digest · نافذة موسمية=season window · إقرار=acknowledge · تجاهل مع سبب=dismiss with reason · كتم مؤقت=snooze · انحراف=deviation (never خطأ — detections are observations, not mistakes).

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 first-run | "No watches yet. Bring one number you own — or open the sample feed and read a detection that explains itself." | "لا مراقبات بعد. أحضر رقماً واحداً تملكه — أو افتح التغذية النموذجية واقرأ اكتشافاً يشرح نفسه." | Create feed / Open sample feed |
| S1 queue empty (watches exist) | "Nothing open. Every watch is quiet — the feed-health strip shows what was last seen." | "لا شيء مفتوح. كل المراقبات هادئة — وشريط سلامة التغذيات يعرض آخر ما رُصد." | View feed health |
| S1 filtered-empty | "No detections match these filters." | "لا اكتشافات تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "These detections belong to another workspace." | "هذه الاكتشافات تخصّ مساحة عمل أخرى." | Switch workspace |
| S2 feed first-run | "No data in this feed yet. Paste your daily numbers — one date and value per line — or bind the metric-source capability later." | "لا بيانات في هذه التغذية بعد. الصق أرقامك اليومية — تاريخ وقيمة في كل سطر — أو اربط قدرة مصدر القياس لاحقاً." | Paste points |
| S2 returned-empty (all invalid) | "Every point in this feed is marked invalid. Invalid rows stay queryable — fix them at the source and re-paste." | "كل النقاط في هذه التغذية موسومة بغير صالحة. الصفوف غير الصالحة تبقى قابلة للاستعلام — صحّحها من المصدر وأعد اللصق." | Show invalid rows |
| S3 watches first-run (on feed) | "No watch on this feed yet. Two numbers make a threshold band; the backtest preview shows how often it would have fired." | "لا مراقبة على هذه التغذية بعد. رقمان يصنعان نطاق عتبة؛ ومعاينة الاختبار الرجعي تعرض كم مرة كان سينطلق." | Create watch |
| S6 digest quiet day | "No deviations today. 6 feeds watched, 89 points checked, 0 detections." | "لا انحرافات اليوم. 6 تغذيات تحت المراقبة، و89 نقطة فُحصت، و0 اكتشافات." | View feed health |
| S6 digest none-yet | "No digest yet — today's assembles on first open once an evaluation has run." | "لا ملخص بعد — ملخص اليوم يتجمّع عند أول فتح بمجرد تشغيل تقييم." | Run evaluation |
| S6 filtered-empty | "No digests match these filters." | "لا ملخصات تطابق هذه المرشّحات." | Clear filters |
| S7 season list empty | "No season windows declared. Ramadan and White Friday break naive baselines — declare them before they arrive." | "لا نوافذ موسمية معلنة. يكسر رمضان والجمعة البيضاء خطوط الأساس الساذجة — أعلنها قبل وصولها." | Add season window |
| S8 jobs empty | "Nothing running. Ingestions, evaluations, and deliveries appear here while they work." | "لا مهام قيد التنفيذ. الاستيرادات والتقييمات والتسليمات تظهر هنا أثناء عملها." | — |
| Feed stale (health strip) | "Last point 5 days old on a daily feed — the baselines are only as fresh as the data." | "آخر نقطة عمرها 5 أيام في تغذية يومية — خطوط الأساس بحدّة حداثة البيانات." | Sync or paste points |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress in units)

| State | English | Arabic |
|---|---|---|
| S1 queue skeleton | skeleton rows ×8 + "Loading open detections…" (SR) | صفوف هيكلية + "جارٍ تحميل الاكتشافات المفتوحة…" |
| Ingest job (determinate) | "Importing point 45 of 89 — 2 invalid rows marked, none dropped." | "استيراد النقطة 45 من 89 — وُسم صفان غير صالحين، ولم يُهدر أي صف." |
| Sync job (capability) | "Syncing the metric-source capability — feed 1 of 1, 7 new points." | "مزامنة قدرة مصدر القياس — تغذية 1 من 1، و7 نقاط جديدة." |
| Evaluation job (progressive) | "Evaluating — watch 3 of 5. Detections land as each watch completes." | "التقييم — مراقبة 3 من 5. تصل الاكتشافات مع اكتمال كل مراقبة." |
| Backtest preview | "Backtesting the candidate policy over 60 days…" | "اختبار رجعي للسياسة المرشحة على مدى 60 يوماً…" |
| Digest assembling | "Assembling today's digest from 4 detections across 3 feeds." | "تجميع ملخص اليوم من 4 اكتشافات عبر 3 تغذيات." |
| Delivery job | "Delivering the weekly digest to 2 members." | "تسليم الملخص الأسبوعي إلى عضوين." |
| Narration (assist path) | "Narration in progress — the rule text below is already complete." | "السرد قيد الإعداد — نص القاعدة أدناه مكتمل أصلاً." |
| S8 job row | determinate: "45 of 89"; indeterminate: "Working — no estimate yet" | "45 من 89" ؛ "قيد العمل — لا تقدير بعد" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (malformed ingest row) | "Row 17 has no value — rows around it imported fine. Fix row 17 and import just it." | "السطر 17 بلا قيمة — استُوردت الأسطر من حوله سليمة. صحّح السطر 17 واستورد وحده." |
| VALIDATION (snooze without reason) | "A snooze needs a reason — it is how the journal stays honest. Write one, or acknowledge instead." | "يحتاج الكتم المؤقت سبباً — هكذا يبقى السجل أميناً. اكتب سبباً، أو أقرّ بدلاً منه." |
| VALIDATION (sub-minimum series for anomaly layer) | "This feed holds 9 points — seasonal baselines need 14 (two weekday cycles). Start with a threshold band; the anomaly layer unlocks at 14." | "تحمل هذه التغذية 9 نقاط — تحتاج خطوط الأساس الموسمية إلى 14 (دورتان ليوميا الأسبوع). ابدأ بنطاق عتبة؛ وينفتح طبق الانحراف عند 14." |
| VALIDATION (backtest shorter than window) | "The feed has 30 days of history — the 60-day backtest runs over what exists: 30 days, and the count says so." | "لدى التغذية تاريخ 30 يوماً — يجري الاختبار الرجعي على الموجود: 30 يوماً، والعدّاد يقول ذلك." |
| NOT_FOUND (stale detection link) | "That detection is gone from this workspace. The feed it came from still has its series." | "ذلك الاكتشاف غاب عن مساحة العمل. التغذية التي صدر عنها ما زالت تحمل سلسلتها." → Go to feed |
| NOT_FOUND (old delivered digest) | "This delivered digest expired. The console still has every digest — open it there." | "انتهت صلاحية هذا الملخص المُرسل. تحتفظ الوحدة بكل الملخصات — افتحها هناك." |
| PERMISSION (capability unconsented) | "Syncing needs the metric-source capability granted to this workspace. Grant it — or paste your points; pasting always works." | "تتطلب المزامنة منح قدرة مصدر القياس لمساحة العمل هذه. امنحها — أو الصق نقاطك؛ اللصق يعمل دائماً." |
| PERMISSION (viewer seat mutation) | "Your seat reads digests and doesn't edit here. Ask the workspace owner for an editor seat." | "مقعدك يقرأ الملخصات ولا يحرّر هنا. اطلب من مالك مساحة العمل مقعداً محرّراً." |
| CONFLICT (concurrent watch edit) | "Tariq saved a change to this watch while you edited. Both versions are kept — choose what stays." | "حفظ طارق تغييراً في هذه المراقبة أثناء تحريرك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (concurrent status change) | "Fahad changed this detection's status while you did. Both actions are recorded — the journal shows the order." | "غيّر فهد حالة هذا الاكتشاف أثناء عملك. الفعلان مسجّلان — والسجل يعرض الترتيب." |
| RATE_LIMIT (assist quota) | "This month's narration window is used. The rule text stays complete on every detection — assists resume 1 Nov." | "استُهلكت نافذة السرد لهذا الشهر. نص القاعدة يبقى مكتملاً في كل اكتشاف — ويستأنف السرد في 1 نوفمبر." |
| RATE_LIMIT (rung 2 notice) | "Running near the narration limit — assist paragraphs shorten until 1 Nov." | "اقترب الاستخدام من حدّ السرد — ستقصر فقرات المساعدة حتى 1 نوفمبر." |
| NETWORK (list fetch) | "The detection list went stale — reconnecting. Nothing you acknowledged is lost." | "تقادمت قائمة الاكتشافات — تجري إعادة الاتصال. لا شيء ممّا أقررته ضائع." |
| NETWORK (delivery partial) | "The weekly digest delivered to 1 of 2 members — the channel failed for one. Retry just that member; the digest itself is intact." | "سُلّم الملخص الأسبوعي إلى عضو من اثنين — فشلت القناة لواحد. أعد المحاولة لذلك العضو وحده؛ والملخص نفسه سليم." |
| UNKNOWN | "Something failed on our side (ref kaw-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع kaw-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips, no confetti; numbers stay Western in both)

| Moment | English | Arabic |
|---|---|---|
| Ingest done | "89 points in, 2 duplicates counted, 2 invalid marked — every one listed." | "دخلت 89 نقطة، وحُسب تكراران، ووُسم اثنان غير صالحين — كلها مدرجة." |
| Evaluation done | "5 watches evaluated — 4 detections, 1 season-adjusted point recorded." | "قُيّمت 5 مراقبات — 4 اكتشافات، ونقطة واحدة موسومة بالتعديل الموسمي." |
| Backtest preview | "This policy would have fired 4 times in 60 days — 1 inside a season window, 1 matching a dismissed reason." | "كانت هذه السياسة ستنطلق 4 مرات في 60 يوماً — مرة داخل نافذة موسمية، ومرة تطابق سبباً مُجاهلاً سابقاً." |
| Watch saved | "Watch saved — threshold 34 to 40 minutes, digest-class, backtest 4 per 60 days." | "حُفظت المراقبة — عتبة من 34 إلى 40 دقيقة، من فئة الملخص، واختبار رجعي 4 لكل 60 يوماً." |
| Detection acknowledged | "Acknowledged — متوسط زمن التوصيل, 15 Oct. The record and its explanation stay in the journal." | "أُقرّ — متوسط زمن التوصيل، 15 أكتوبر. يبقى السجل وشرحه في السجل العام." |
| Detection dismissed | "Dismissed with reason 'known cause' — the journal keeps it, and the next backtest counts it." | "جُهِل مع سبب 'سبب معروف' — يحتفظ به السجل، والاختبار الرجعي القادم يحتسبه." |
| Snooze set | "Snoozed 3 days — resumes 20 Oct. The reason is recorded." | "كتم مؤقت 3 أيام — يستأنف في 20 أكتوبر. السبب مسجَّل." |
| Snooze resumed | "Watching resumed after snooze." | "استؤنف الرصد بعد الكتم المؤقت." |
| Digest assembled | "Today's digest ready — 4 detections across 3 feeds: 3 digest-class, 1 page-class held at top." | "ملخص اليوم جاهز — 4 اكتشافات عبر 3 تغذيات: 3 من فئة الملخص، وواحد من فئة المقاطعة في المقدمة." |
| Digest delivered | "Weekly digest delivered to 2 members." | "سُلّم الملخص الأسبوعي إلى عضوين." |
| Narration (template) | "Narration: template — the rule's own arithmetic, no assist involved." | "السرد: قالبي — حساب القاعدة نفسه، بلا مساعدة." |
| Narration (assist) | "Narration: assist — context paragraph appended below the rule text." | "السرد: بمساعدة — فقرة سياق أُلحقت أسفل نص القاعدة." |
| Undo window (P03, acknowledge) | "Acknowledged — Undo (7s)" | "أُقرّ — تراجع (7 ثوانٍ)" |

## E. Season, cadence, and assist moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Season note (digest) | "Season window: Saudi National Day active — seasonal watching paused for 3 feeds. Threshold rules remain live." | "نافذة موسمية: اليوم الوطني السعودي نشطة — الرصد الموسمي معلّق لـ3 من التغذيات. قواعد العتبة تبقى نافذة." |
| Season-adjusted point (detection chip) | "Point inside season window: Saudi National Day — seasonal watching suspended." | "نقطة داخل نافذة موسمية: اليوم الوطني السعودي — الرصد الموسمي معلّق." |
| Post-window baseline re-arm | "Season window closed — seasonal watching re-armed; the first post-window baseline note says so." | "أُغلقت النافذة الموسمية — أُعيد تسليح الرصد الموسمي؛ وملاحظة خط الأساس الأولى بعد النافذة تقول ذلك." |
| Page-class opt-in (editor) | "Page-class interrupts immediately. Reserve it for the band whose breach cannot wait until 8:00." | "فئة المقاطعة تُقاطع فوراً. خصّصها للنطاق الذي لا يحتمل خرقه انتظار الثامنة." |
| Tier change consequence | "Digest-class waits for the 8:00 digest; page-class interrupts immediately." | "فئة الملخص تنتظر ملخص الثامنة؛ وفئة المقاطعة تُقاطع فوراً." |
| Baseline disclosure (first reveal) | "Baselines are same-weekday means over the trailing 8 weeks, excluding season-window points; the deviation is measured in same-weekday standard deviations." | "خطوط الأساس هي متوسطات أيام الأسبوع المطابقة خلال آخر 8 أسابيع، باستثناء نقاط النوافذ الموسمية؛ ويقاس الانحراف بانحرافات معيارية على الأساس نفسه." |
| Quiet-day honesty | "No deviations today. 6 feeds watched, 89 points checked, 0 detections." | "لا انحرافات اليوم. 6 تغذيات تحت المراقبة، و89 نقطة فُحصت، و0 اكتشافات." |
| Rung 4 banner (assist capability off) | "The narration assist is unavailable right now. Every detection keeps its complete bilingual rule text — only the context paragraphs pause. We'll say when it returns (est. 2 hours)." | "مساعدة السرد غير متاحة الآن. كل اكتشاف يحتفظ بنص قاعدته ثنائي اللغة كاملاً — فقط فقرات السياق تتوقف. سنخبرك عند عودتها (تقديراً ساعتان)." |
| Quota meter (P14, 80%) | "Narration window at 16 of 20 — the rule text stays complete either way." | "نافذة السرد عند 16 من 20 — نص القاعدة يبقى مكتملاً في الحالين." |
| Explanation card header | "Why this fired" | "لماذا انطلق هذا" |
| Explanation card language labels | "English" / "العربية" | "English" / "العربية" |
| Watch paused (season) | "Watch paused for the season — resumes 21 Oct with the window." | "أُوقفت المراقبة للموسم — تستأنف في 21 أكتوبر مع النافذة." |
| Catch-up evaluation note | "Missed 2 evaluation intervals while the workspace was closed — detections below carry their true dates." | "فُقدت فترتا تقييم أثناء إغلاق مساحة العمل — الاكتشافات أدناه تحمل تواريخها الحقيقية." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin unit inside Arabic explanation | "Minutes and SAR render as isolated Latin tokens inside the Arabic sentence — never force-flipped." | "تُعرض الوحدتان minutes وSAR رمزاً لاتينياً معزولاً داخل الجملة العربية — ولا تُقلب قسراً أبداً." |
| Arabic feed name inside English chrome | "'متوسط زمن التوصيل' renders right-to-left inside the English queue row — isolated, truncating at word boundaries." | "تُعرض 'متوسط زمن التوصيل' من اليمين إلى اليسار داخل صف الوحدة الإنجليزية — معزولة، وتُقتطع عند حدود الكلمات." |
| Dismissal note authored across locales | "A dismissal note written in English by an Arabic-locale member renders LTR inside the Arabic digest journal — isolated both ways." | "ملاحظة تجاهل كُتبت بالإنجليزية من عضو بواجهة عربية تُعرض من اليسار إلى اليمين داخل سجل الملخص العربي — معزولة في الاتجاهين." |
| Western numerals in Arabic sentences | "Numbers stay Western in both languages: 37.2 minutes is 37.2 minutes in both sentences — one arithmetic, two renderings." | "تبقى الأرقام غربية في اللغتين: 37.2 دقيقة هي 37.2 دقيقة في الجملتين — حساب واحد وعرضان." |
