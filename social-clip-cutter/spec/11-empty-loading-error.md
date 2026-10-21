# 11 — Empty / Loading / Error: social-clip-cutter (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim (no templates), voice = clip-desk energetic-exact (02), Arabic = فصحى بيضاء, Western numerals everywhere per ledger (incl. inside Arabic strings; timecodes render LTR-isolated mono — 05). Every empty has exactly one action (P01); every error follows [what]+[why]+[next] (copy-voice §1.4); buttons ≤3 words; errors ≤2 sentences; toasts ≤12 words.

## A. Empty states (four empties per P01 — enumerated per surface)

| Surface & state | English | Arabic | Action |
|---|---|---|---|
| Board first-run (no episode sources) | "Your clip desk is ready. Import one transcript to start cutting — or try it on a sample episode." | "مكتب المقاطع جاهز. استورد تفريغاً واحداً لتبدأ القصّ — أو جرّب حلقة عيّنة." | Import transcript / Try sample episode |
| Board first-run (sample loaded) | "The sample episode is loaded with 912 segments and 7 highlight candidates. Cut your own when ready." | "حُمّلت حلقة العيّنة بـ 912 مقطعاً و7 مرشحين. قصّ خاصتك متى جهزت." | Open sample episode |
| Board filtered-empty (stage/language filter) | "No episodes match this filter. Episodes exist outside it." | "لا حلقات تطابق هذا المرشّح. توجد حلقات خارجه." | Clear filter |
| Board no-access | "This desk belongs to another workspace." | "هذا المكتب يخصّ مساحة عمل أخرى." | Switch workspace |
| Transcript empty (source in Draft) | "No transcript yet. Paste the text — or pull it from your media source." | "لا تفريغ بعد. الصق النص — أو اجلبه من مصدر الوسائط." | Paste transcript |
| Transcript search zero-hits | "No segments match «{query}». Search normalizes alef forms, taa marbouta, and yaa — try the plain spelling." | "لا مقاطع تطابق «{استعلام}». يُطبّع البحث ألف التهميز والتاء المربوطة والياء — جرّب الإملاء المبسّط." | Clear search |
| Highlights empty (zero candidates) | "No candidates above threshold this pass. The rules are strict on purpose — select by hand, the transcript is yours." | "لا مرشحين فوق العتبة في هذه الجولة. القواعد صارمة عمداً — اختر يدوياً، التفريغ ملكك." | Select by hand |
| Highlights panel (before first run) | "Candidates appear here when you run the pass. Each says why it fired — scores, keywords, pauses." | "تظهر المرشحون هنا عند تشغيل الجولة. كلٌّ يقول سببه — تقييمات وكلمات وسكتات." | Run highlight pass |
| Clips empty (source has transcript) | "No clips yet. Search the transcript, or run the highlight pass — then ⌘Enter cuts." | "لا مقاطع كليب بعد. ابحث في التفريغ أو شغّل جولة المرشحين — ثم ⌘Enter للقصّ." | Search transcript |
| Clip rail — no burn-in spec yet | "3 clips have no burn-in spec. Caption them before export — or export with warnings carried." | "3 كليبات بلا مواصفة حرق. عنونها قبل التصدير — أو صدّر مع حمل التحذيرات." | Open burn-in studio |
| Caption styles (workspace empty) | "Stock styles cover the Arabic-safe looks. Duplicate one when a client's identity becomes a style." | "الأنماط الجاهزة تغطي المظاهر العربية الآمنة. استنسخ واحداً حين تصبح هوية العميل نمطاً." | Browse stock styles |
| Jobs empty | "Nothing running. Imports and exports appear here while they work." | "لا مهام قيد التنفيذ. الاستيراد والتصدير يظهران هنا أثناء عملهما." | — |
| Exports library empty | "No exports yet — a batch is queued from selected clips, render or recipe." | "لا تصديرات بعد — تُصفّ الدفعة من الكليبات المحددة، معالجةً أو وصفة." | Open episodes board |
| Credentials empty (Settings) | "No sources or channels yet. Paste and download work by hand — credentials only speed them up." | "لا مصادر ولا قنوات بعد. اللصق والتنزيل يعملان يدوياً — الاعتمادات اختيار للتسريع فقط." | Add credential |
| Palette no-results | "No results for «{query}»." | "لا نتائج لـ«{استعلام}»." | — |

## B. Loading (P02/P12; skeletons mirror geometry, RTL-mirrored; written labels per async-contract §3)

| Surface & state | English | Arabic |
|---|---|---|
| Board boot | (skeleton columns ×5) + "Loading your episodes…" (SR) | (أعمدة هيكلية ×5) + "جارٍ تحميل حلقاتك…" |
| Workbench boot (staged) | shell → zones → segments; SR: "Opening «{title}»" | الهيكل ثم المناطق ثم المقاطع؛ "فتح «{عنوان}»" |
| Transcript import (determinate) | "Converting 340 of 912 segments…" | "تحويل 340 من 912 مقطعاً…" |
| Import awaiting-input (untimed) | "This transcript has no timestamps. Declare the episode duration, or link your media file." | "التفريغ بلا طوابع زمنية. أعلن مدة الحلقة، أو اربط ملف الوسائط." |
| Transcript search | "Searching 912 segments…" (≤400ms — brief by design) | "البحث في 912 مقطعاً…" |
| Export queued | "Waiting to render — position 2 of 3 jobs." | "بانتظار المعالجة — الموقع 2 من 3 مهام." |
| Export running (per clip) | "Exporting clip 3 of 6…" | "تصدير الكليب 3 من 6…" |
| Recipe assembly | "Assembling the recipe — caption files, timecodes, spec sheet…" | "تجميع الوصفة — ملفات التسميات والطوابع الزمنية وورقة المواصفة…" |
| Artifact download | "Preparing «{artifact}»…" | "جارٍ تجهيز «{ملف}»…" |
| Credential verify | "Verifying the source with a real round-trip…" | "جارٍ التحقق من المصدر بجولة فعلية…" |
| Job row | determinate: "{done} of {total}"; indeterminate: "Working — no estimate yet" | "{done} من {total}" ؛ "قيد العمل — لا تقدير بعد" |
| Spec/boundary autosave | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |

## C. Errors (7 classes; every string names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (unparseable transcript) | "Couldn't parse the transcript — line 41 has an incomplete timestamp. Fix it and paste again." | "تعذّر تحليل التفريغ — السطر 41 يحمل طابعاً زمنياً غير مكتمل. صحّحه والصق من جديد." |
| VALIDATION (clip segment range) | "A clip can't start after its end — start 417, end 402. Move a boundary first." | "لا يبدأ الكليب بعد نهايته — البداية 417 والنهاية 402. حرّك أحد الحدّين أولاً." |
| VALIDATION (offset beyond anchor) | "That offset leaves its segment — the legal range is 0 to 3.5 seconds. Pick a value inside it." | "هذا الإزاحة تخرج من مقطعها — النطاق القانوني من 0 إلى 3.5 ثانية. اختر قيمة داخله." |
| VALIDATION (malformed burn-in spec) | "The spec needs a style and a placement preset — placement is missing. Set it and save again." | "تحتاج المواصفة نمطاً وموضعاً معيارياً — الموضع ناقص. حدّده واحفظ من جديد." |
| VALIDATION (style weight not shipped) | "Almarai ships 300/400/700/800 — weight 900 doesn't exist. Pick a real weight; synthetic bold is never applied to Arabic." | "عائلة Almarai توفر 300/400/700/800 — الوزن 900 غير موجود. اختر وزناً حقيقياً؛ الوزن الاصطناعي لا يُطبّق على العربية أبداً." |
| VALIDATION (credential input) | "The source needs a name and both identifier and secret. Fill the three, then save." | "يحتاج المصدر اسماً ومعرّفاً وسِرّاً. أكمل الثلاثة ثم احفظ." |
| NOT_FOUND (source/clip gone) | "That episode or clip is gone from this workspace — it may have been deleted or moved." | "تلك الحلقة أو الكليب غاب عن مساحة العمل — ربما حُذف أو نُقل." |
| NOT_FOUND (expired artifact) | "This file expired — created 12 October with a 7-day window. Renew it in one action; the batch itself is safe." | "انتهت صلاحية هذا الملف — أُنشئ في 12 أكتوبر بنافذة 7 أيام. جدّده بضغطة واحدة؛ الدفعة نفسها محفوظة." |
| PERMISSION (workspace scoping) | "This desk belongs to another workspace." | "هذا المكتب يخصّ مساحة عمل أخرى." |
| PERMISSION (credential grant class) | "This source's grant doesn't cover transcript pulls — it was granted notifications only. Extend the grant, or paste instead." | "منحة هذا المصدر لا تغطي جلب التفريغات — مُنحت للإشعارات فقط. وسّع المنحة، أو الصق النص بدلاً منها." |
| CONFLICT (clip edited elsewhere) | "Another seat edited this clip while you did. Both versions are kept side by side — choose what stays." | "حرّر مقعدٌ آخر هذا الكليب أثناء عملك. النسختان محفوظتان جنباً إلى جنب — اختر ما يبقى." |
| CONFLICT (spec edited elsewhere) | "The burn-in spec was edited from another seat. Both versions are kept — choose, or merge by hand." | "حُرّرت مواصفة الحرق من مقعدٍ آخر. كلا الإصدارين محفوظ — اختر، أو ادمج يدوياً." |
| RATE_LIMIT (render window used) | "This month's render window is used. Selection, specs, and the recipe path keep working — rendering resumes 1 November." | "استُهلكت نافذة المعالجة لهذا الشهر. الاختيار والمواصفات ووصفة التصدير تعمل — تستأنف المعالجة في 1 نوفمبر." |
| RATE_LIMIT (80% warning, P14) | "4 of 5 render minutes left this month." | "تبقّى 4 من 5 دقائق معالجة هذا الشهر." |
| NETWORK (import dropped) | "The connection dropped mid-import. What parsed is kept and marked partial — retry continues from where it stopped." | "انقطع الاتصال أثناء الاستيراد. ما دُمج محفوظ وموسوم بالجزئية — تستكمل إعادة المحاولة من حيث توقفت." |
| NETWORK (offline banner, P20) | "You're offline. Boundary and spec edits queue locally and sync when you're back." | "أنت غير متصل. تعديلات الحدود والمواصفات تُصفّ محلياً وتُزامن عند عودة الاتصال." |
| NETWORK (export job dropped) | "The connection dropped mid-export. The job reconciles on reconnect — 4 clips finished, 2 pending." | "انقطع الاتصال أثناء التصدير. تُسوّى المهمة عند إعادة الاتصال — 4 كليبات اكتملت و2 معلّقة." |
| UNKNOWN | "Something failed on our side (ref scc-corr-0007). Retry — quote the reference if it repeats." | "حدث خلل لدينا (مرجع scc-corr-0007). أعد المحاولة — واذكر المرجع إن تكرر." |

## D. Success & status (calm; the single signature moment is clip-created — 05)

| Moment | English | Arabic |
|---|---|---|
| Transcript landed | "Transcript landed — 912 segments, srt format, 58:14 long." | "وصل التفريغ — 912 مقطعاً، بصيغة srt، ومدته 58:14." |
| **Clip created (signature pop)** | "Clip cut — 42 seconds at segment 118. Next: its burn-in spec." | "قُصّ الكليب — 42 ثانية عند المقطع 118. التالي: مواصفة الحرق." |
| Boundary moved | "Start boundary now at segment 118 + 0.25s." | "حدّ البداية الآن عند المقطع 118 + 0.25 ث." |
| Spec saved, warnings resolved | "Spec saved — 0 warnings. The clip is export-ready." | "حُفظت المواصفة — 0 تحذيرات. الكليب جاهز للتصدير." |
| Spec saved, warnings remain | "Spec saved — 2 warnings carried. They travel with the export, visibly." | "حُفظت المواصفة — تحذيران محمولان. يسافران مع التصدير، بشكل مرئي." |
| House style saved | "Style saved at version 2 — this client's clips keep the same look." | "حُفظ النمط في الإصدار 2 — كليبات هذا العميل تحافظ على المظهر ذاته." |
| Export ready (render) | "Batch ready — 6 clips, 5 files each, burn-in on, expires in 7 days." | "الدفعة جاهزة — 6 كليبات، 5 ملفات لكلٍّ منها، الحرق مفعّل، تنتهي بعد 7 أيام." |
| Export ready (recipe) | "Recipe ready — caption files, timecodes, spec sheet. Apply them in any editor." | "الوصفة جاهزة — ملفات تسميات وطوابع زمنية وورقة مواصفة. طبّقها في أي محرر." |
| Partial failure recovered | "Clip 3 rendered on retry — the batch is complete." | "اكتمل الكليب 3 بعد إعادة المحاولة — الدفعة مكتملة." |
| Artifact renewed | "File renewed — fresh 7-day window." | "جُدّد الملف — نافذة جديدة مدتها 7 أيام." |
| Episode specced | "Every clip is specced and clean — the episode is export-ready." | "كل الكليبات موصّفة وسليمة — الحلقة جاهزة للتصدير." |
| Source verified | "Source verified — it fetched a real transcript round-trip." | "تم التحقق من المصدر — أجرى جولة جلب تفريغ فعلية." |

## E. Guardrail moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| **Bidi warning cleared (the signature check)** | "Mixed run isolated — «RiseUp» keeps its order inside the Arabic line, in both directions." | "عُزل المقطع المختلط — «RiseUp» يحافظ على ترتيبه داخل السطر العربي، في الاتجاهين." |
| Safe-zone warning | "Captions sit in the overlay band — TikTok-class keeps the lower 35% clear. Nudge up." | "تقع التسميات في نطاق الواجهة — فئة TikTok تُبقي الـ 35% السفلى خالية. حرّكها للأعلى." |
| Reading-speed gate | "This line runs 17 chars in 0.9s — the Arabic gate is 14. Shorten the line or split the caption." | "يجري هذا السطر 17 حرفاً في 0.9 ث — بوابة العربية 14. قصّر السطر أو قسّم التسمية." |
| Recipe offered (quota rung 4) | "Rendering is paused this month — the recipe path is unlimited: caption files, timecodes, spec sheet." | "المعالجة متوقفة هذا الشهر — ووصفة التصدير بلا حدود: ملفات تسميات وطوابع زمنية وورقة مواصفة." |
| Notification fallback (credential expired) | "Job notifications are off — the notification channel expired 12 October. Jobs surface here on return either way." | "إشعارات المهام متوقفة — قناة الإشعار انتهت في 12 أكتوبر. تظهر المهام هنا عند العودة في كل الأحوال." |
| Secret shown once | "The source secret shows once only — copy it and keep it." | "يُعرض سِرّ المصدر مرة واحدة فقط — انسخه واحتفظ به." |
| Credential failed (degraded pull) | "Transcript pulls are paused — the media source failed verification on 12 October. Renew it, or paste by hand." | "جلب التفريغات متوقف — مصدر الوسائط فشل في التحقق بتاريخ 12 أكتوبر. جدّده، أو الصق يدوياً." |
| Highlight rationale disclosure | "Why this candidate: keyword density 0.86, edges on two pauses, question opener. The rules show their work." | "سبب هذا المرشّح: كثافة الكلمات 0.86، وحافتاه على سكتتين، وافتتاحية استفهامية. القواعد تُظهر عملها." |
| Warnings travel with export | "2 warnings ride the export manifest — nothing ships silently." | "تحذيران يسافران مع بيان التصدير — لا شيء يُشحن بصمت." |
