# 11 — Empty / Loading / Error: media-asset-hub (Copy Matrix)

SME-J pass. Voice: archivist-practical (02). Every string verbatim, bilingual EN + AR. Arabic فصحى بيضاء; **Western numerals everywhere including Arabic strings** (ledger row 8). Error formula [what]+[why]+[next] (copy-voice §1.4); no banned phrases (§2).

## A. Empty states (P01 four-empties)

| Surface & state | English | Arabic | Action |
|---|---|---|---|
| Library first-run | "Your library is empty. Ingest your first batch — or load the sample archive to see search work on bilingual files." | "مكتبتك فارغة. أدخل أول دفعة ملفات — أو حمّل الأرشيف النموذجي لترى البحث يعمل على ملفات ثنائية اللغة." | Ingest files / Load sample |
| Library archive view (no-data-after-activity) | "Nothing is archived. Assets you archive leave the default views but keep their metadata and links." | "لا شيء مؤرشف. الأصول التي تؤرشفها تغادر العروض الافتراضية وتحتفظ ببياناتها وروابطها." | Back to library |
| Library no-access | "This library belongs to another workspace. Ask its owner for access." | "هذه المكتبة تخص مساحة عمل أخرى. اطلب من مالكها منحك الوصول." | Switch workspace |
| Library filtered-empty | "No assets match these filters. Clear them to see all 240." | "لا أصول تطابق هذه المرشّحات. امسحها لرؤية الكل، 240." | Clear filters |
| Search no results (variants available) | "No results for «{query}». Try «{variant}» — we matched hamza and taa-marbuta forms, not exact spelling." | "لا نتائج لـ «{query}». جرّب «{variant}» — طابقنا أشكال الهمزة والتاء المربوطة لا الإملاء الحرفي." | Try «{variant}» |
| Search no results (no variants) | "No results for «{query}». Search covers filenames, Arabic and English metadata, tags, and text inside assets." | "لا نتائج لـ «{query}». يغطي البحث أسماء الملفات والبيانات بلغتين والوسوم والنص داخل الأصول." | Clear search |
| Collections first-run | "No collections yet. Gather a campaign set or a client pack — ordered, with bilingual notes." | "لا مجموعات بعد. اجمع مجموعة حملة أو حزمة عميل — مرتبةً ومزوّدةً بملاحظات بلغتين." | Create collection |
| Collection empty | "This collection is empty. Add assets from the library — order is yours to set." | "هذه المجموعة فارغة. أضف أصولاً من المكتبة — الترتيب بيدك." | Add assets |
| Tag picker no match | "No tag matches «{query}». Create it with both names — Arabic and English." | "لا وسم يطابق «{query}». أنشئه بالاسمين — عربي وإنجليزي." | Create tag |
| Rights console no alerts | "No rights alerts. Expiring licenses and unknown-rights assets appear here." | "لا تنبيهات حقوق. التراخيص قريبة الانتهاء والأصول مجهولة الحقوق تظهر هنا." | — |
| Activity empty | "Nothing yet. Ingests, edits, tag reviews, and rights changes appear here with names and times." | "لا شيء بعد. عمليات الإدخال والتعديلات ومراجعات الوسوم وتغييرات الحقوق تظهر هنا بالأسماء والأوقات." | — |
| Ingest console first-run | "Stage a batch: drop up to 50 files. Extraction and tagging run after upload, reviewable before publish." | "جهّز دفعة: أفلت حتى 50 ملفاً. يعمل الاستخراج والوسم بعد الرفع، ويمكن مراجعتهما قبل النشر." | Choose files |

## B. Loading (P02/P12; skeletons mirror geometry, RTL-flipped; no synthetic percentages)

| Surface & state | English | Arabic |
|---|---|---|
| Library grid | tile skeletons ×24 (fixed aspect) + SR: "Loading your library…" | هياكل بلاطات ×24 + "جارٍ تحميل مكتبتك…" |
| Drawer boot | field skeletons per pair + SR: "Opening «{fileName}»" | هياكل الحقول + "فتح «{اسم الملف}»" |
| Search executing | "Searching — metadata, tags, and in-asset text…" | "جارٍ البحث — البيانات والوسوم والنص داخل الأصول…" |
| Ingest: upload | "Uploading file 3 of 12" | "رفع الملف 3 من 12" |
| Ingest: probe | "Reading file 3 of 12" | "قراءة الملف 3 من 12" |
| Ingest: rendition | "Rendering thumbnails — 7 of 12" | "توليد المصغّرات — 7 من 12" |
| Ingest: text-extract | "Extracting text — file 4 of 12 (2 seconds so far)" | "استخراج النص — الملف 4 من 12 (ثانيتان حتى الآن)" |
| Ingest: auto-tag | "Preparing tag suggestions — 9 of 12" | "تحضير اقتراحات الوسوم — 9 من 12" |
| Ingest stalled (>8s/stage) | "Extraction is taking longer than usual. Keep waiting or cancel the batch — finished files stay." | "يستغرق الاستخراج وقتاً أطول من المعتاد. انتظر أو ألغِ الدفعة — الملفات المنتهية تبقى." |
| Rights console | bucket skeletons ×3 | هياكل السلال ×3 |
| Collection | ordered row skeletons | هياكل صفوف مرتبة |

## C. Errors (EXACT 7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (file over cap) | "One file exceeds the 2 GB cap — «{fileName}» is 3.4 GB. Skip it or remove it from the batch." | "ملف واحد يتجاوز حد 2 غيغابايت — «{اسم الملف}» بحجم 3.4 غيغابايت. تجاوزه أو أزله من الدفعة." |
| VALIDATION (past expiry) | "The expiry date is in the past. Enter a future date, or record the license as already expired." | "تاريخ الانتهاء في الماضي. أدخل تاريخاً مستقبلياً، أو سجّل الترخيص منتهياً أصلاً." |
| VALIDATION (tag twin missing) | "A tag needs both names. The Arabic name is empty — we never machine-fill the pair." | "يحتاج الوسم إلى اسمين. الاسم العربي فارغ — لا نعبّئ الزوج آلياً أبداً." |
| VALIDATION (empty export) | "This collection has 0 assets. Add at least one before exporting a manifest." | "تحوي هذه المجموعة 0 أصل. أضف أصلاً واحداً على الأقل قبل تصدير البيان." |
| NOT_FOUND (stale asset link) | "This asset is no longer in the workspace — it may be archived. Search for its filename to find where it lives now." | "هذا الأصل لم يعد في مساحة العمل — ربما أُرشف. ابحث باسم ملفه لتعرف موقعه الآن." |
| NOT_FOUND (expired artifact) | "This export link expired (7-day window). Regenerate it — the collection is unchanged." | "انتهت صلاحية رابط التصدير (نافذة 7 أيام). أعد توليده — المجموعة كما هي." |
| PERMISSION | "Your seat doesn't cover this workspace's library. Request access from the workspace owner." | "مقعدك لا يشمل مكتبة مساحة العمل هذه. اطلب الوصول من مالك مساحة العمل." |
| CONFLICT (metadata) | "Reem edited this asset while you did. Both versions are shown — keep yours, theirs, or merge by hand." | "حرّرت ريم هذا الأصل أثناء عملك. النسختان معروضتان — أبقِ نسختك أو نسختها أو ادمجهما يدوياً." |
| CONFLICT (collection) | "Someone reordered this collection while you did. Both orders are kept — choose one." | "أعاد أحدهم ترتيب هذه المجموعة أثناء عملك. الاحتفاظ بالترتيبين — اختر أحدهما." |
| RATE_LIMIT (extraction) | "This month's extraction window is used (300 of 300). Metadata and manual tagging keep working — extraction resumes {date}." | "استُهلكت نافذة الاستخراج لهذا الشهر (300 من 300). البيانات والوسم اليدوي يعملان — يستأنف الاستخراج في {date}." |
| RATE_LIMIT (auto-tag) | "Auto-tagging is paused for this window (20 of 20 batches). Type tags by hand — suggestions resume {date}." | "الوسم الآلي متوقف لهذه النافذة (20 من 20 دفعة). اكتب الوسوم يدوياً — تستأنف الاقتراحات في {date}." |
| NETWORK (offline) | "You're offline. The library reads from the last cache; edits queue and sync when you're back." | "أنت غير متصل. تُقرأ المكتبة من آخر ذاكرة مؤقتة؛ تُصفّ التعديلات وتتزامن عند عودة الاتصال." |
| NETWORK (job drop) | "The connection dropped mid-batch. Finished files are safe — retry continues from file 8 of 12." | "انقطع الاتصال أثناء الدفعة. الملفات المنتهية آمنة — تستكمل إعادة المحاولة من الملف 8 من 12." |
| UNKNOWN | "Something failed on our side (ref {id}). Retry — if it repeats, quote this reference." | "حدث خلل لدينا (مرجع {id}). أعد المحاولة — وإن تكرر، اذكر هذا المرجع." |

## D. Success & status (calm; opacity settle + state chip only)

| Moment | English | Arabic |
|---|---|---|
| Batch published | "12 files published — 38 tag suggestions await review." | "نُشر 12 ملفاً — 38 اقتراح وسم بانتظار المراجعة." |
| Tag accepted | "Tag «مقابلة / interview» applied to 12 assets." | "وُسم الوسم «مقابلة / interview» على 12 أصلاً." |
| Autosave cycle | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| Archive + undo | "3 assets archived — Undo (7 seconds)" | "أُرشف 3 أصول — تراجع (7 ثوانٍ)" |
| Collection created | "Collection created — 18 assets, ordered." | "أُنشئت المجموعة — 18 أصلاً، مرتبة." |
| Export ready | "Manifest ready — 14 assets, expires in 7 days." | "البيان جاهز — 14 أصلاً، ينتهي بعد 7 أيام." |
| Rights updated | "License extended to {date} — 6 assets leave the expiring list." | "مُدّد الترخيص حتى {date} — 6 أصول تغادر قائمة الاقتراب من الانتهاء." |
| Transcription indexed | "Your transcription is indexed — «مؤتمر» now finds this asset." | "فُهرس النقل الذي أدخلته — «مؤتمر» يجد هذا الأصل الآن." |

## E. AI degradation ladder (ai-native-patterns §5; surfaces per 08)

| Rung | English | Arabic |
|---|---|---|
| 2 — reduced (80%) | "Extraction window nears its limit — batches will shorten after 240 of 300." | "تقترب نافذة الاستخراج من حدّها — ستُختصر الدفعات بعد 240 من 300." |
| 3 — templates | "Auto-tagging is off this cycle. Your tag history suggests these — labeled, not generated." | "الوسم الآلي متوقف في هذه الدورة. يقترح سجل وسومك ما يلي — مقترح لا مُولَّد." |
| 4 — unavailable | "Text extraction is unavailable right now (est. {time}). Paste a transcription meanwhile — it indexes the same way." | "استخراج النص غير متاح الآن (تقديراً {time}). الصق نقلاً يدوياً في الأثناء — يُفهرس بالطريقة نفسها." |

## F. Product-signature moments (bilingual trust copy)

| Moment | English | Arabic |
|---|---|---|
| Normalization disclosed | "Matched with hamza and taa-marbuta variants normalized — 6 of 38 results." | "طابقت النتائج مع تطبيع أشكال الهمزة والتاء المربوطة — 6 من 38." |
| In-asset hit badge | "Found inside the asset — extracted text, 92% confidence." | "وُجد داخل الأصل — نص مستخرج، ثقة 92%." |
| Low-confidence extraction | "Extraction is 54% confident on this file. Read it and paste the correct text — we mark yours as human-sourced." | "ثقة الاستخراج 54% في هذا الملف. اقرأه والصق النص الصحيح — نوسم مدخلك بأنه بشري المصدر." |
| Provenance shown | "In-asset text: human-pasted by Dina, 3 March." | "النص داخل الأصل: نقلته دينا يدوياً، 3 مارس." |
| Suggestion expiry | "23 suggestions expire in 2 days — unreviewed suggestions never become tags." | "تنتهي 23 اقتراحاً بعد يومين — الاقتراحات غير المراجَعة لا تصير وسوماً أبداً." |
| Rights expired badge | "License expired — usage paused. Renew it to restore exports." | "انتهى الترخيص — الاستخدام موقوف. جدّده لاستعادة التصدير." |
| Alt-text gap | "Alt text missing in Arabic — screen readers get nothing for this asset." | "النص البديل ناقص بالعربية — قارئات الشاشة لا تصل لشيء في هذا الأصل." |

## Voice check (Critic pass)

No banned phrases (copy-voice §2); buttons ≤3 words; toasts ≤12 words; errors ≤2 sentences; empties ≤3 sentences + 1 action; one term per concept (أصل/نسخة/وسم/مجموعة/الحقوق — 02 glossary) across all rows; Western numerals verified in both scripts; Arabic budgeted ~125% of English (10).
