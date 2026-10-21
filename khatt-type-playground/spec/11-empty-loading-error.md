# 11 — Empty / Loading / Error: khatt-type-playground (Copy Matrix)

SME-J pass · Every string verbatim, bilingual EN + AR · Voice: lab-bench (02) — states what a control did and what a font does, never what the user should prefer · Arabic فصحى بيضاء with real terminology (الكشيدة، التطويل، بدائل السياق، الضبط) · AR-indic numerals in Arabic strings per ledger policy · Every error follows [what]+[why]+[next] (copy-voice §1.4) · Every empty has one action (P01).

## A. Empty states

| Entity & state | English | Arabic | Action |
|---|---|---|---|
| Catalog first-run | "The bench is open. Pick an Arabic family and a Latin one — or start from the seeded pairing." | "مِنضدة العمل مفتوحة. اختر عائلة عربية وأخرى لاتينية — أو ابدأ من الاقتران المهيّأ." | Open seeded pairing / Browse fonts |
| Catalog filtered-empty | "No families match these filters. The catalog holds 14 more outside them." | "لا عائلات تطابق هذه المرشّحات. يحتوي الفهرس على ١٤ أخرى خارجها." | Clear filters |
| Catalog no-access | "This catalog view belongs to another seat." | "عرض الفهرس هذا يخصّ مقعداً آخر." | Switch seat |
| Glyph grid filtered-empty (empty block) | "This family ships no glyphs in Arabic Presentation Forms-B. Its coverage lives in other blocks." | "لا محارف لهذه العائلة في مقطع أشكال العرض العربية-ب. تغطيتها في مقاطع أخرى." | Switch block |
| Sessions first-run | "No pairing sessions yet. One session keeps fonts, sizes and kashida settings together — for the day you resume." | "لا جلسات اقتران بعد. تحفظ الجلسة الواحدة الخطوط والأحجام وإعدادات الكشيدة معاً — ليوم تستأنف فيه." | New session |
| Sessions returned-empty (archived) | "Sessions you archived stay out of this view and stay yours." | "الجلسات المؤرشفة تخرج من هذا العرض وتبقى لك." | Clear filter |
| Specimens first-run | "No specimens yet. A session becomes a specimen the moment you compose one — settings printed on it." | "لا نماذج عرض بعد. تصير الجلسة نموذجاً لحظة تأليفه — والإعدادات مطبوعة عليه." | Compose specimen |
| Jobs empty | "Nothing running. Specimen exports appear here while they render." | "لا مهام قيد التنفيذ. تظهر تصديرات النماذج هنا أثناء توليدها." | — |
| Share view no-access | "This specimen link belongs to another seat's sessions." | "رابط هذا النموذج يخصّ جلسات مقعد آخر." | Back to catalog |

## B. Loading states (P02 — skeletons mirror geometry, direction-aware)

| Entity & operation | English | Arabic |
|---|---|---|
| Catalog page | (card skeletons ×12) + "Loading families…" (SR) | (هياكل بطاقات ×١٢) + "جارٍ تحميل العائلات…" |
| Font file (canvas hydration) | "Loading {family} at {weight} — rendering with the matched fallback meanwhile." | "جارٍ تحميل {العائلة} بوزن {الوزن} — يُعرض بالمقابل المطابق مؤقتاً." |
| Glyph grid page | (cell skeletons ×96, mirrored in RTL) | (هياكل خلايا ×٩٦، معكوسة في الاتجاه العربي) |
| Glyph inspector | "Opening glyph {name}…" | "فتح المحرف {الاسم}…" |
| Session resume | "Restoring 'Ramadan campaign pairing' — fonts, scale, kashida at 40%." | "استعادة «اقتران حملة رمضان» — الخطوط والمقياس والكشيدة عند ٤٠٪." |
| Specimen load | (block skeletons matching kinds) + "Composing specimen…" | (هياكل كتل مطابقة الأنواع) + "جارٍ تأليف النموذج…" |
| Export job | "Rendering block {n} of {total}." | "توليد الكتلة {n} من {total}." |
| Export awaiting fonts | "Waiting on {family} at {weight} — the render resumes the moment it arrives." | "بانتظار {العائلة} بوزن {الوزن} — يستأنف التوليد لحظة وصولها." |

## C. Error states (exact 7-class taxonomy; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (upload attestation) | "Upload needs the license attestation — confirm you hold a license for this family, then retry." | "يتطلب الرفع إقرار الترخيص — أكّد حيازتك ترخيصاً لهذه العائلة ثم أعد المحاولة." |
| VALIDATION (font parse failure) | "This file didn't parse — its table directory is malformed. The catalog stays unchanged." | "لم يُفحص هذا الملف — جدول فهرسه تالف. يبقى الفهرس دون تغيير." |
| VALIDATION (unsupported jalt) | "Tajawal ships tatweel only — justification alternates aren't in this family. Switch to tatweel or pick a jalt-aware family." | "عائلة Tajawal تقدّم التطويل فقط — بدائل الضبط ليست فيها. حوّل إلى التطويل أو اختر عائلة تدعم بدائل الضبط." |
| VALIDATION (impossible settings) | "Leading 1.4 can't apply to Arabic with tashkeel on — the floor is 1.8 so stacked marks never clip. Applied 1.8." | "لا يمكن تطبيق تباعد ١.٤ على العربية مع التشكيل — الحد الأدنى ١.٨ كي لا تُقتطع العلامات المركّبة. طُبّق ١.٨." |
| NOT_FOUND (session/specimen, stale link) | "That session or specimen is gone from this seat — it may be archived or deleted." → Back to sessions | "تلك الجلسة أو النموذج غاب عن هذا المقعد — ربما أُرشف أو حُذف." → العودة إلى الجلسات |
| NOT_FOUND (expired artifact) | "This export expired after 7 days. Renew it — the specimen's state is intact." | "انتهت صلاحية هذا التصدير بعد ٧ أيام. جدّده — حالة النموذج سليمة." |
| PERMISSION (seat scope) | "Your seat can't edit this session — it renders read-only with its settings visible." | "لا يستطيع مقعدك تحرير هذه الجلسة — تُعرض للقراءة مع ظهور إعداداتها." |
| CONFLICT (stale revision) | "This session changed in another tab — version 5 against your version 4. Both are shown; choose what stays." | "تغيّرت هذه الجلسة في تبويب آخر — الإصدار ٥ مقابل إصدارك ٤. يُعرض كلاهما؛ اختر ما يبقى." |
| RATE_LIMIT (export window) | "This month's export window is used — 0 of 20 left. Sessions, the lab and composing keep working; exports resume {date}." | "استُهلكت نافذة التصدير لهذا الشهر — بقي ٠ من ٢٠. الجلسات والملعب والتأليف تعمل؛ يستأنف التصدير في {تاريخ}." |
| NETWORK (catalog/font fetch) | "The catalog went stale — reconnecting. Loaded fonts keep rendering; unsaved settings are kept." | "تقادم الفهرس — تجري إعادة الاتصال. الخطوط المحمّلة تستمر في العرض؛ الإعدادات غير المحفوظة محفوظة." |
| NETWORK (offline, P20) | "You're offline. Setting changes queue locally and sync when you're back." | "أنت غير متصل. تُصفّ تغييرات الإعدادات محلياً وتُزامن عند عودة الاتصال." |
| UNKNOWN | "Something failed on our side (ref {id}). Retry — quote the reference if it repeats." | "حدث خلل لدينا (مرجع {id}). أعد المحاولة — واذكر المرجع إن تكرر." |

## D. Success & status (minimal motion — state ticks, no celebration)

| Moment | English | Arabic |
|---|---|---|
| Session saved (P10 cycle) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| Seeded pairing opened | "Amiri with Source Serif 4 — kashida at 40%, 6 blocks ready. Change anything; it's all yours." | "Amiri مع Source Serif 4 — الكشيدة عند ٤٠٪ و٦ كتل جاهزة. غيّر ما شئت؛ كله لك." |
| Specimen finalized | "Finalized — version 3 is the record. Later edits start version 4." | "اعتُمد — الإصدار ٣ هو السجل. تبدأ التعديلات اللاحقة الإصدار ٤." |
| Export ready | "Specimen sheet ready — 6 blocks, settings panel on, expires in 7 days." | "ورقة النموذج جاهزة — ٦ كتل، لوحة الإعدادات مفعّلة، تنتهي بعد ٧ أيام." |
| Artifact renewed | "Renewed — 7 more days." | "جُدّد — ٧ أيام إضافية." |
| Undo window (P03) | "Scale reset — Undo (7s)" | "أُعيد ضبط المقياس — تراجع (٧ ثوانٍ)" |

## E. Lab-honesty moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Feature disabled with reason | "Scheherazade New ships calt, liga, jalt — no stylistic sets. ss01 stays off, and says why." | "تقدّم Scheherazade New ميزتَي calt وliga وjalt — دون مجموعات أسلوبية. تبقى ss01 مطفأة، وتقول سببها." |
| Kashida joins warning | "Two lines stretched past their joins — flat tatweel breaks word shapes. Lower intensity or switch to justification alternates." | "امتدّ سطران إلى حدّ وصلهما — التطويل المسطّح يكسر أشكال الكلمات. اخفض الكثافة أو حوّل إلى بدائل الضبط." |
| Weight reality note | "Reem Kufi ships 400–700 — 600 re-bound to 700, and it says so on the export." | "تقدّم Reem Kufi وزنَي ٤٠٠–٧٠٠ — أُعيد ربط ٦٠٠ إلى ٧٠٠، ويُقال ذلك في التصدير." |
| Fallback render notice | "Rendering {family} with the matched fallback — the real file is on its way." | "عرض {العائلة} بالمقابل المطابق — الملف الحقيقي في الطريق." |
| Numeral toggle | "Numerals now Arabic-Indic — ٠١٢٣٤٥٦٧٨٩ in chrome; code exports stay Western." | "الأرقام الآن عربية-هندية — ٠١٢٣٤٥٦٧٨٩ في الواجهة؛ تصديرات الشيفرة تبقى غربية." |
| Numeral run block (content) | "0123456789 · ٠١٢٣٤٥٦٧٨٩ — same values, two systems, both legible at 18px." | "0123456789 · ٠١٢٣٤٥٦٧٨٩ — القيم ذاتها بنظامين، وكلاهما مقروء عند ١٨ بكسل." |
| Tracking control explanation | "Tracking is Latin-only here — letter-spacing breaks Arabic's joined letterforms. The control says so instead of hiding." | "التباعد لاتيني فقط هنا — تباعد الأحرف يكسر اتصال الحروف العربية. يقول المتحكّم ذلك بدل أن يختفي." |
