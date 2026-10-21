# 11 — Empty / Loading / Error: marketplace-listing-sync (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR (bilingual-en product — both locales carried because the workspace flips; 05 direction model) · voice = trader-plain, evidence-first (02: states what the rule measured, what the mapping did, what the human decided) · Arabic is فصحاء بيضاء utility register · **numerals Western everywhere per ledger row** (ceilings, counts, confidence, prices — never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked (02): القناة=channel · الإدراج=listing · المنتج الرئيسي=master product · الكتالوج=catalog · ربط الحقول=field mapping · الحقل=field · الخاصية=attribute · قاعدة=rule · حزمة القواعد=rule pack · قائمة فحص الامتثال=compliance checklist · المانع=blocker · التحذير=warning · الجاهزية=readiness · النشر=publish · التصدير=export · الاقتراح=suggestion · مستوى المخزون=stock level · متقادم=stale · التحويل=transform · النسخة المحلية=locale variant. Vocabulary boundary (LOOP-10): no repricing vocabulary in either locale (prices are data carried, never rules — price-rule-engine's family), no order/fulfillment vocabulary, no ad vocabulary.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 channels first-run | "No channels yet. Create one from an archetype — its rule pack arrives seeded and every number is yours to edit — or open the sample and watch a blocker refuse a publish." | "لا قنوات بعد. أنشئ واحدة من نموذج جاهز — تصل حزمة قواعدها مهيّأة وكل رقم فيها قابل للتعديل — أو افتح العيّنة وشاهد مانعاً يرفض نشراً." | Create channel / Open sample channel |
| S1 filtered-empty | "No channels match these filters." | "لا قنوات تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "This workspace's channels are not visible to your seat." | "قنوات مساحة العمل هذه غير مرئية لمقعدك." | Switch workspace |
| S3 catalog first-run | "No master products yet. Paste your catalog — one block per product, both titles, both descriptions, images, price, stock — or start from the sample catalog." | "لا منتجات رئيسية بعد. الصق كتالوجك — كتلة لكل منتج، العنوانان، الوصفان، الصور، السعر، المخزون — أو ابدأ بكتالوج العيّنة." | Import catalog / Open sample catalog |
| S3 filtered-empty | "No products match these filters." | "لا منتجات تطابق هذه المرشّحات." | Clear filters |
| S3 unlisted filter, all listed | "Every active product is on at least one channel. This filter shows the ones that are not." | "كل منتج فعّال موجود على قناة واحدة على الأقل. هذا المرشّح يعرض ما ليس كذلك." | Clear filters |
| S5 field map, channel with no rows | "This channel has no mapping yet. Map your first field — or ask the assist for ranked candidates when it is connected." | "لا ربط حقول لهذه القناة بعد. اربط أول حقل — أو اطلب من المساعد مرشّحين مرتّبين متى اتصل." | Map first field / View suggestions |
| S5 suggestion panel, assist unbound | "The mapping assist is not connected. The manual editor is the full product — every mapping on this desk was authored by a person." | "مساعد الربط غير متصل. المحرّر اليدوي هو المنتج كاملاً — كل ربط على هذا المكتب كتبه إنسان." | Map fields manually |
| S5 suggestion panel, no candidates | "No candidates for the unmapped attributes. The assist lists only what it can justify — map these by hand." | "لا مرشّحين للخصائص غير المربوطة. يعرض المساعد ما يستطيع تبريره فقط — اربط هذه يدوياً." | Map fields manually |
| S6 listings board, channel with none | "No listings on this channel yet. List the ready catalog in one action — every product gets a draft listing with the current mapping." | "لا إدراجات على هذه القناة بعد. اعرض الكتالوج الجاهز بفعل واحد — كل منتج يحصل على إدراج مسودة بالربط الحالي." | List catalog on channel |
| S6 filtered-empty | "No listings match these filters." | "لا إدراجات تطابق هذه المرشّحات." | Clear filters |
| S8 readiness console, check never run | "No findings yet — the checklist has not run on this channel. One run evaluates every listing against the rule pack." | "لا نتائج بعد — لم تُشغَّل قائمة الفحص على هذه القناة. تشغيل واحد يقيّم كل إدراج مقابل حزمة القواعد." | Run compliance check |
| S8 returned-empty, all resolved | "Every finding on this channel is resolved — by edit, by rule change, or acknowledged with a reason. Each one kept its record." | "كل نتيجة على هذه القناة محلولة — بتحرير، أو بتغيير قاعدة، أو مقبولة بسبب. وكل واحدة احتفظت بسجلها." | View readiness board |
| S8 filtered-empty | "No findings match this rule, severity, or state." | "لا نتائج تطابق هذه القاعدة أو الخطورة أو الحالة." | Clear filters |
| S7 checklist, clean listing | "No findings on this listing. The rules ran — lengths, required attributes, images, parity, forbidden characters — and found nothing." | "لا نتائج على هذا الإدراج. جرت القواعد — الأطوال والخصائص المطلوبة والصور والتكافؤ والمحارف المحظورة — ولم تجد شيئاً." | — |
| S10 jobs empty | "Nothing running. Imports, checks, publishes, and exports appear here while they work." | "لا مهام قيد التنفيذ. الاستيرادات والفحوص والنشرات والتصديرات تظهر هنا أثناء عملها." | — |
| S9 artifacts empty | "No export files yet. The channel-ready file carries the same verdicts as the publish path — blocked listings stay out, named." | "لا ملفات تصدير بعد. ملف القناة الجاهز يحمل الأحكام ذاتها التي يحملها النشر — الإدراجات المحجوبة تبقى خارجه، مسمّاة." | Export channel file |

## B. Loading (P02/P12 — skeletons mirror table/rail geometry per direction; honest determinate progress)

| State | English | Arabic |
|---|---|---|
| S1 channel cards skeleton | skeleton cards ×4 + "Loading your channels…" (SR) | بطاقات هيكلية + "جارٍ تحميل قنواتك…" |
| S5 studio boot | table + rail skeleton with reserved widths | هيكلية الجدول والشريط بعرضين محجوزين |
| Catalog import (determinate) | "Importing 16 of 24 products — missing locale variants import as-is and the checklist flags them." | "استيراد 16 من 24 منتجاً — النسخ المحلية الناقصة تُستورد كما هي وتوسمها قائمة الفحص." |
| Compliance check (progressive) | "Checking listing 9 of 24 — blockers reach the readiness console as they are found." | "فحص الإدراج 9 من 24 — الموانع تصل إلى لوحة الجاهزية فور العثور عليها." |
| Live recompute after edit | "Re-running the rules on this listing…" (≤80ms — usually invisible) | "إعادة تشغيل القواعد على هذا الإدراج…" |
| Suggestion fetch | "Ranking mapping candidates…" | "ترتيب مرشّحي الربط…" |
| Publish job (determinate) | "Publishing listing 7 of 11 — DN-1012 returned a rejection; the rest continue." | "نشر الإدراج 7 من 11 — أعاد DN-1012 رفضاً؛ والباقي يتابع." |
| Export job | "Building the channel file — 2 listings, verdicts included." | "بناء ملف القناة — إدراجان، والأحكام مضمّنة." |
| Bulk stock update | "Updating the stock field on 6 products…" | "تحديث حقل المخزون على 6 منتجات…" |
| Field map save | "Saving the field map — dependent listings will be marked stale." | "حفظ ربط الحقول — الإدراجات التابعة ستوسم متقادمة." |
| Autosave (master editor, P10) | "Saving…" → "Saved" (fades after 3s) | "جارٍ الحفظ…" → "حُفظ" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (import bad block) | "Block 7 is malformed — its stock field is not a number. Blocks 1–6 imported; fix block 7 and import it alone." | "الكتلة 7 معطوبة — حقل مخزونها ليس رقماً. استُوردت الكتل 1–6؛ صحّح الكتلة 7 واستوردها وحدها." |
| VALIDATION (mapping collision) | "Two rows target item_name — rows 2 and 5. A channel attribute takes one mapping; remove or retarget one." | "صفّان يستهدفان item_name — الصفان 2 و5. الخاصية تقبل ربطاً واحداً؛ احذف أو أعد توجيه أحدهما." |
| VALIDATION (transform misuse) | "A transform can't apply to the stock level — transforms are for text fields. Remove the transform or target a text attribute." | "لا يمكن تطبيق تحويل على مستوى المخزون — التحويلات للحقول النصية. احذف التحويل أو استهدف خاصية نصية." |
| VALIDATION (rule-pack params) | "The title ceiling can't be zero — the rule needs a maximum of at least 1 character." | "لا يمكن أن يكون سقف العنوان صفراً — تحتاج القاعدة حداً أعلى بحرف واحد على الأقل." |
| VALIDATION (publish gate) | "Publish refused — 4 listings are blocked. First blocker: DN-1003, title 90 characters against a 75 ceiling." | "رُفض النشر — 4 إدراجات محجوبة. أول مانع: DN-1003، بعنوان من 90 حرفاً مقابل سقف 75." |
| VALIDATION (acknowledge on blocker) | "A blocker can't be acknowledged — it resolves by editing the data or changing the rule. Acknowledgment is for warnings." | "لا يمكن قبول مانع — يُحلّ بتحرير البيانات أو تغيير القاعدة. القبول للتحذيرات." |
| NOT_FOUND (stale link) | "That channel, listing, or product is gone from this workspace. It may have been deleted while you were away." | "تلك القناة أو الإدراج أو المنتج غاب عن مساحة العمل. ربما حُذف أثناء غيابك." → العودة إلى القنوات |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the listings it came from are unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — الإدراجات التي صدر عنها لم تتغيّر." |
| PERMISSION (publish capability unbound) | "This channel has no publish connection. Export the channel-ready file and upload it in the channel's own seller surface — the file carries the same verdicts." | "لا اتصال نشر لهذه القناة. صدّر ملف القناة الجاهز وارفعه في لوحة البائع الخاصة بالقناة — الملف يحمل الأحكام ذاتها." |
| PERMISSION (assist unbound) | "The mapping assist is not connected for this workspace. Map the fields manually — the editor is the complete path." | "مساعد الربط غير متصل لمساحة العمل هذه. اربط الحقول يدوياً — المحرّر هو المسار الكامل." |
| PERMISSION (viewer role) | "Your seat reads boards, findings, and exports but doesn't change listings. Ask the workspace owner for a manager seat." | "مقعدك يقرأ اللوحات والنتائج والتصديرات ولا يغيّر الإدراجات. اطلب من مالك مساحة العمل مقعد مدير." |
| CONFLICT (concurrent master edit) | "Amira saved this product while you edited it. Both versions are kept — choose what stays." | "حفظت أميرة هذا المنتج أثناء تحريرك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (field map edit) | "Salem saved this channel's mapping while you edited. Both versions are kept side by side." | "حفظ سالم ربط هذه القناة أثناء تحريرك. النسختان محفوظتان جنباً إلى جنب." |
| CONFLICT (finding already resolved) | "This finding was already resolved by another seat — the current resolution is shown." | "حُلّت هذه النتيجة بالفعل من مقعد آخر — الحل الحالي معروض." |
| CONFLICT (bulk count drift) | "The set changed since you counted it — it is 23 products now, not 24. Recount and confirm." | "تغيّرت المجموعة منذ عدّها — إنها 23 منتجاً الآن، لا 24. أعد العد وأكّد." |
| RATE_LIMIT (check quota) | "This month's check window is used. Reading, editing, and mapping keep working — checks resume 1 Dec." | "استُهلكت نافذة الفحص لهذا الشهر. القراءة والتحرير والربط يعملان — تستأنف الفحوص في 1 ديسمبر." |
| RATE_LIMIT (publish quota) | "The publish window is used for this cycle — the next batch frees up on 1 Dec. Nothing about your listings changes." | "استُهلكت نافذة النشر لهذه الدورة — تتحرر الدفعة التالية في 1 ديسمبر. لا شيء في إدراجاتك يتغيّر." |
| RATE_LIMIT (assist quota) | "The assist window is used — 20 suggestions this month. The manual editor keeps working without it." | "استُهلكت نافذة المساعد — 20 اقتراحاً هذا الشهر. المحرّر اليدوي يعمل بدونها." |
| NETWORK (list fetch) | "The listings board went stale — reconnecting. Every publish and resolution is safe." | "تقادمت لوحة الإدراجات — تجري إعادة الاتصال. كل نشر وحلّ آمنان." |
| NETWORK (publish before first write) | "The channel connection dropped before anything was sent — all 5 listings stayed ready. Retry the batch." | "سقط اتصال القناة قبل إرسال أي شيء — الإدراجات الخمسة بقيت جاهزة. أعد محاولة الدفعة." |
| UNKNOWN (unmappable channel code) | "The channel returned a code we don't map: ERR-8512 — 'brand field contains unsupported characters' (verbatim). Fix the brand field on DN-1012 and retry this listing." | "أعادت القناة رمزاً لا نطبّقه: ERR-8512 — 'brand field contains unsupported characters' (حرفياً). صحّح حقل العلامة على DN-1012 وأعد محاولة هذا الإدراج." |
| UNKNOWN (typed retry) | "Something failed on our side (ref mls-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع mls-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips + counts, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Import done | "24 products in — 1 missing Arabic description kept and flagged, 3 SKUs updated by merge, 0 invalid blocks." | "دخل 24 منتجاً — وصف عربي ناقص واحد حُفظ ووُسم، و3 رموز SKU حُدّثت بالدمج، و0 كتل غير صالحة." |
| Check done | "Check complete — 4 blockers on 4 listings, 1 warning, 21 resolved rows, 1 stale listing flagged." | "اكتمل الفحص — 4 موانع على 4 إدراجات، وتحذير واحد، و21 نتيجة محلولة، وإدراج متقادم واحد موسوم." |
| Blocker resolved by edit | "Title check passed — 71 of 75 characters. The listing is ready." | "نجح فحص العنوان — 71 من 75 حرفاً. الإدراج جاهز." |
| Warning acknowledged | "Warning acknowledged — 'lifestyle shoot scheduled' stays with this finding at publish and in the export." | "قُبل التحذير — 'جلسة تصوير لايف ستايل مجدولة' تبقى مع هذه النتيجة عند النشر وفي التصدير." |
| Mapping saved | "Field map saved at version 4 — 14 listings are stale and need a re-check before publish." | "حُفظ ربط الحقول في الإصدار 4 — 14 إدراجاً متقادمة وتحتاج فحصاً قبل النشر." |
| Suggestion accepted | "Suggestion accepted — product_name_ar maps from title, Arabic variant. Save the field map to apply it." | "قُبل الاقتراح — تربط product_name_ar من العنوان، النسخة العربية. احفظ ربط الحقول لتطبيقه." |
| Suggestion rejected | "Suggestion rejected — the brand stays out of category. Rejected candidates don't return." | "رُفض الاقتراح — تبقى العلامة خارج الفئة. المرشّحون المرفوضون لا يعودون." |
| Listings created | "24 listings created on the channel — every active product, one draft each, the current mapping applied." | "أُنشئ 24 إدراجاً على القناة — كل منتج فعّال، بمسودة واحدة لكل منها، مع تطبيق الربط الحالي." |
| Publish done | "10 published, 1 rejected, 0 skipped — pins: master v2, map v3, rule pack v2." | "نُشر 10، ورُفض 1، وتُخطي 0 — المراسي: المنتج v2، والربط v3، وحزمة القواعد v2." |
| Channel rejection surfaced | "The channel rejected DN-1012 — ERR-8512, verbatim: 'brand field contains unsupported characters'. Retry this listing after fixing the brand." | "رفضت القناة DN-1012 — ERR-8512، حرفياً: 'brand field contains unsupported characters'. أعد محاولة هذا الإدراج بعد إصلاح العلامة." |
| Export ready | "Channel file ready — 2 listings, verdicts included, 1 blocked listing excluded and named. Expires in 7 days; regenerable." | "ملف القناة جاهز — إدراجان، والأحكام مضمّنة، وإدراج محجوب واحد مستبعد ومسمّى. تنتهي صلاحيته بعد 7 أيام؛ ويُعاد توليده." |
| Bulk stock update done | "Stock updated on 6 products — 4 listings went stale (the other 2 channels don't map stock)." | "حُدّث المخزون على 6 منتجات — تقادم 4 إدراجات (القناتان الأخريان لا تربطان المخزون)." |
| Override saved | "Override saved — the channel title for this listing differs from the master, and it says so, permanently." | "حُفظ التجاوز — عنوان هذه القناة لهذا الإدراج يختلف عن الرئيسي، ويقول ذلك بشكل دائم." |
| Stale surfaced | "DN-1011 is stale — the master moved to version 3 after its last publish. Re-check, then re-publish." | "DN-1011 متقادم — انتقل المنتج الرئيسي إلى الإصدار 3 بعد آخر نشر. أعد الفحص ثم أعد النشر." |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| The Checklist Closes (T2 signature) | "The checklist closes — 14 rules passed, 2 warnings acknowledged. This listing is ready for its channel." | "تُقفل قائمة الفحص — 14 قاعدة ناجحة، وتحذيران مقبولان. هذا الإدراج جاهز لقناته." |
| Publish refusal (assertive) | "Not yet. DN-1003's title runs 90 characters against a 75 ceiling, DN-1004 has no Arabic description, DN-1005 has no images, DN-1006's title carries a forbidden character. Fix these and the gate opens." | "ليس بعد. عنوان DN-1003 بـ 90 حرفاً مقابل سقف 75، وDN-1004 بلا وصف عربي، وDN-1005 بلا صور، وعنوان DN-1006 يحمل محرفاً محظوراً. أصلح هذه يُفتح الباب." |
| Channel truth taught us | "The channel refused what our rules passed — the brand's ampersand. Your rule pack is demonstration data; the channel's word is the channel's word. Add the rule or fix the brand." | "رفضت القناة ما أجازته قواعدنا — علامة & في اسم العلامة. حزمة قواعدك بيانات عرض؛ وكلمة القناة هي كلمة القناة. أضف القاعدة أو أصلح العلامة." |
| Determinism note (check re-run) | "Re-ran the check — same state in, same findings out. The 4 blockers are the same 4." | "أُعيد تشغيل الفحص — الحالة ذاتها دخولاً، والنتائج ذاتها خروجاً. الموانع الأربعة هي الأربعة ذاتها." |
| Pair mapped deliberately | "item_name takes the Arabic title; item_name_en takes the English, truncated at word boundary if it runs past 75. The pair is deliberate — not a copy." | "تأخذ item_name العنوان العربي؛ وتأخذ item_name_en الإنجليزي، مقصوصاً عند حدّ الكلمة إن تجاوز 75. الزوج مقصود — لا نسخ." |
| Suggestion honesty | "0.78 confidence — token overlap plus a constraint match, the formula beside it. Accept it, edit it, or reject it; nothing lands on its own." | "ثقة 0.78 — تداخل رموز مع تطابق قيد، والصيغة بجانبها. اقبله أو حرّره أو ارفضه؛ لا شيء يهبط من تلقاء نفسه." |
| Sample channel badge | "Sample channel — a planted blocker, a seeded rule pack, and a publish that refuses. Clear it whenever real channels arrive." | "قناة عيّنة — مانع مزروع، وحزمة قواعد مهيّأة، ونشر يرفض. امسحها متى وصلت القنوات الحقيقية." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin brand inside Arabic title | "The Latin brand 'Nayif Ateeq' renders left-to-right inside the right-to-left Arabic title — isolated, punctuation stays put." | "تُعرض العلامة اللاتينية 'Nayif Ateeq' من اليسار إلى اليمين داخل العنوان العربي — معزولة، ويبقى الترقيم في مكانه." |
| English chrome, Arabic value | "The Arabic field value renders right-to-left inside the English workspace — the content's direction follows its locale, never the chrome." | "تُعرض قيمة الحقل العربي من اليمين إلى اليسار داخل مساحة عمل إنجليزية — اتجاه المحتوى يتبع لغته، لا الهيكل أبداً." |
| Number order in both directions | "Ceilings, counts, and SKUs keep one physical order in both directions — 75 is 75 and DN-1003 is DN-1003 in either chrome." | "السقوف والعدّ ورموز SKU تحافظ على ترتيب فيزيائي واحد في الاتجاهين — 75 هي 75 وDN-1003 هي DN-1003 في أي هيكل." |
| Truncated Arabic at boundary | "The Arabic title truncates at a word boundary — joined words never split mid-letter, and the transform says where it cut." | "يُقصّ العنوان العربي عند حدّ كلمة — الكلمات المتصلة لا تنشطر في منتصف حرف، والتحويل يقول أين قصّ." |
