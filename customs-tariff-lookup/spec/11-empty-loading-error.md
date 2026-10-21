# 11 — Empty / Loading / Error: customs-tariff-lookup (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR (bilingual-en product; Arabic is a full citizen on every surface) · voice = clerk-precise (02: states the code, the edition, and what is not known, in that order) · Arabic is فصحى بيضاء, schedule-prose register · numerals Western everywhere per ledger row (rtl-rules §3; never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked: النظام المنسق=HS · القسم=section · الفصل=chapter · البند=heading/tariff line · الرسم الجمركي=customs duty · الرسم القيمي=ad valorem · الرسم النوعي=specific duty · القرار التصنيفي=classification ruling · جدول التعريفات= tarif schedule (جدول التعريفات الجمركية) · الإصدار=edition · قائمة الرموز المحفوظة=saved classification list · حزمة الأدلة=evidence pack · مساعد البحث=search assist · التطبيع=normalization · بند تركيبي=fixture line (rendered only inside Mock Adapter data).

## A. Empty states (P01 four-empties per surface)

| State | English | Arabic | Action |
|---|---|---|---|
| S1 first-run (no search yet) | "The 2026 edition is loaded. Search in Arabic or English — or walk the tree from any section." | "الإصدار 2026 محمّل. ابحث بالعربية أو الإنجليزية — أو تجوّل في الشجرة من أي قسم." | Search examples / Open the tree |
| S1 sample-list prompt (first run) | "New here? Open the sample list — 3 settled classifications with linked rulings to see how the desk works." | "جديد هنا؟ افتح قائمة العيّنة — 3 تصنيفات محسومة بقرارات مرتبطة لترى كيف يعمل المكتب." | Open sample list |
| S4 zero results | "No line matches this term in the 2026 edition. Try the tree — Chapter 2 covers meat." | "لا بند يطابق هذا المصطلح في إصدار 2026. جرّب الشجرة — الفصل 2 يغطي اللحوم." | Browse sections / Run assist |
| S4 filtered-empty | "No results under these chapter filters." | "لا نتائج تحت مرشّحات الفصل هذه." | Clear filters |
| S4 no-access | "This workspace's nomenclature data is not available to your seat." | "بيانات النظام المنسق لهذه المساحة غير متاحة لمقعدك." | Switch workspace |
| S5 notes filtered-empty | "No rulings match these filters — try a wider date range or clear the authority filter." | "لا قرارات تطابق هذه المرشّحات — جرّب نطاق تواريخ أوسع أو امسح مرشّح الجهة." | Clear filters |
| S5 notes zero-hit search | "No ruling mentions this term. Notes search covers goods descriptions and summaries in both languages." | "لا قرار يذكر هذا المصطلح. بحث القرارات يشمل أوصاف السلع والملخصات باللغتين." | Clear search |
| S6 lists first-run | "No lists yet. Save your first tariff line from the reading pane — or start from the sample." | "لا قوائم بعد. احفظ أول بند جمركي من صفحة القراءة — أو ابدأ من العيّنة." | Create list / Open sample |
| S6 list empty (created, nothing saved) | "This list is empty. Codes you save from the reading pane land here." | "هذه القائمة فارغة. الرموز التي تحفظها من صفحة القراءة تظهر هنا." | Open nomenclature |
| S6 filtered-empty | "No saved codes match these filters." | "لا رموز محفوظة تطابق هذه المرشّحات." | Clear filters |
| S6 no-access (viewer role) | "Your seat views and exports but doesn't edit lists. Ask the workspace owner for an editor seat." | "مقعدك يعرض ويصدّر ولا يحرّر القوائم. اطلب من مالك المساحة مقعداً محرّراً." | Switch workspace |
| S7 no edition pair selected | "Pick two editions to see what changed between them." | "اختر إصدارين لرؤية ما تغيّر بينهما." | Select editions |
| S7 diff empty | "Nothing changed between these editions under this filter." | "لا شيء تغيّر بين هذين الإصدارين تحت هذا المرشّح." | Clear filters |
| S8 activity empty | "Nothing yet. Every save, status change, and export lands here with who did it." | "لا شيء بعد. كل حفظ وتغيير حالة وتصدير يظهر هنا مع من قام به." | — |
| S8 jobs empty | "Nothing running. Assists and exports appear here while they work." | "لا مهام قيد التنفيذ. المساعدات والتصديرات تظهر هنا أثناء عملها." | — |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1/S4 search skeleton | input-row skeleton + 8 result-row skeletons | صفوف هيكلية للإدخال و8 صفوف نتائج |
| S2 tree level skeleton | section-grid skeleton / chapter-row skeletons ×6 | هيكلية شبكة الأقسام / 6 صفوف فصول هيكلية |
| S3 reading-pane skeleton | code-line skeleton + two description-line skeletons + duty-block skeleton | سطر رمز هيكلي وسطرا وصف هيكليان وكتلة رسم هيكلية |
| Assist running (determinate) | "Assist — term 2 of 4. Deterministic results are already on screen." | "المساعد — المصطلح 2 من 4. النتائج الحتمية معروضة بالفعل." |
| Edition check running | "Checking 7 saved codes against the 2026 edition…" | "فحص 7 رموز محفوظة مقابل إصدار 2026…" |
| Export job (determinate) | "Evidence pack — codes 3 of 3 done, notes 2 of 5." | "حزمة الأدلة — الرموز 3 من 3 منجزة، القرارات 2 من 5." |
| Notes search | "Searching rulings…" | "جارٍ البحث في القرارات…" |
| Autosave (P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| S8 job row | determinate: "2 of 5"; indeterminate: "Working — no estimate yet" | "2 من 5"؛ "قيد العمل — لا تقدير بعد" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (empty-after-normalization query) | "That query has no searchable text once normalization runs — check for stray marks. Meanwhile the tree is one click away." | "لا نص قابل للبحث في هذا الاستعلام بعد تشغيل التطبيع — تحقق من علامات زائدة. الشجرة على بُعد نقرة في الأثناء." |
| VALIDATION (duplicate save) | "0207.14.00.20 is already saved in 'Q1 snack imports'. Open the existing entry instead of saving a second." | "الرمز 0207.14.00.20 محفوظ في 'واردات الوجبات الخفيفة — الربع الأول'. افتح الإدخال القائم بدل حفظ ثانٍ." |
| VALIDATION (non-comparable edition pair) | "These two editions have no published change record between them. Compare 2025 → 2026 instead." | "لا سجل تغييرات منشور بين هذين الإصدارين. قارن 2025 ← 2026 بدلاً منهما." |
| VALIDATION (assist without description) | "The assist needs a goods description to work from — a few words about the product." | "يحتاج المساعد وصف سلعة ليعمل — بضع كلمات عن المنتج." |
| NOT_FOUND (stale code link) | "That tariff line is gone from the 2026 edition — it was retired. The change record names its successor." | "ذلك البند الجمركي غاب عن إصدار 2026 — أُحيل للتقاعد. سجل التغيير يسمّي البديل." |
| NOT_FOUND (stale note link) | "That ruling note moved — it was superseded. The banner on the next screen names the current note." | "ذلك القرار التصنيفي انتقل — فقد حلّ محله قرار أحدث. اللافتة في الشاشة التالية تسمّي القرار الحالي." |
| NOT_FOUND (expired artifact) | "This evidence pack expired 3 days ago. Regenerate it — the lists it came from are unchanged." | "انتهت صلاحية حزمة الأدلة هذه قبل 3 أيام. أعد توليدها — القوائم التي صدرت عنها لم تتغيّر." |
| PERMISSION (assist unconsented) | "The search assist needs its capability granted to this workspace. Grant it — or keep going: search and browse never need it." | "يحتاج مساعد البحث منح قدرته لهذه المساحة. امنحها — أو واصل: البحث والتجوّل لا يحتاجانها أبداً." |
| PERMISSION (viewer mutation) | "Your seat views and exports but doesn't save or edit. Ask the workspace owner for an editor seat." | "مقعدك يعرض ويصدّر ولا يحفظ أو يحرّر. اطلب من مالك المساحة مقعداً محرّراً." |
| CONFLICT (concurrent saved-code edit) | "Reem edited this saved code while you did. Both versions are kept — choose what stays." | "حرّرت ريم هذا الرمز المحفوظ أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| RATE_LIMIT (assist quota) | "This month's assist window is used. Search, browse, notes, and edition checks keep running — assists resume 1 Mar." | "استُهلكت نافذة المساعدة لهذا الشهر. البحث والتجوّل والقرارات وفحوص الإصدارات تعمل — تستأنف المساعدة في 1 مارس." |
| RATE_LIMIT (rung 2 notice) | "Running near the assist limit — candidates will thin out until 1 Mar." | "اقترب الاستخدام من حدّ المساعدة — ستقلّ المرشّحات حتى 1 مارس." |
| NETWORK (list/tree fetch) | "The nomenclature fetch went stale — reconnecting. Your saved lists are safe." | "تقادم جلب النظام المنسق — تجري إعادة الاتصال. قوائمك المحفوظة آمنة." |
| NETWORK (export partial) | "The pack delivered 1 of 2 sections — codes arrived, notes didn't. Retry just the notes." | "سلّمت الحزمة 1 من قسمين — وصلت الرموز ولم تصل القرارات. أعد محاولة القرارات وحدها." |
| UNKNOWN | "Something failed on our side (ref ctl-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع ctl-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips; no confetti — motion-language §1 minimal)

| Moment | English | Arabic |
|---|---|---|
| Search results ready | "12 results — top: 0207.14, subheading, 5% fixture reference." | "12 نتيجة — الأعلى: 0207.14، بند فرعي، مرجع 5% تركيبي." |
| Code settled (reading pane) | "0207.14.00.20 — frozen fowl, cut in pieces (fixture line). 2026 edition." | "0207.14.00.20 — دجاج مجمد مقطع (بند تركيبي). إصدار 2026." |
| Duty reference (visible block) | "Customs duty: 5% ad valorem — published reference, 2026 edition. The customs authority's assessment is its own." | "الرسم الجمركي: 5% قيمي — مرجع منشور، إصدار 2026. تقدير سلطة الجمارك شأنها الخاص." |
| Specific duty reference | "Customs duty: 0.20 per liter — published reference, 2026 edition." | "الرسم الجمركي: 0.20 لكل لتر — مرجع منشور، إصدار 2026." |
| Rate compare done | "KSA 2026: 15% · UAE 2026: 5% — published references, two national schedules of the same 6-digit core." | "السعودية 2026: 15% · الإمارات 2026: 5% — مرجعان منشوران، جدولان وطنيان للنواة ذاتها بـ6 أرقام." |
| Code saved | "0406.10.00.00 saved to 'Q1 snack imports' as candidate — you verify it when ready." | "حُفظ 0406.10.00.00 في 'واردات الوجبات الخفيفة' مرشّحاً — تتحقق منه متى جهزت." |
| Status set (desk-verified) | "Marked desk-verified by you — the signature on this classification is the desk's." | "وُسم محققاً من المكتب بتوقيعك — التوقيع على هذا التصنيف من المكتب." |
| Note linked | "Ruling KSA-CLR-2024-1187 linked as rationale to 0207.14.00.20." | "رُبط القرار KSA-CLR-2024-1187 مسوّغاً للرمز 0207.14.00.20." |
| Edition check done | "Checked 7 saved codes against 2026 — 2 affected. Review them now or leave them flagged." | "فُحصت 7 رموز محفوظة مقابل 2026 — 2 متأثرة. راجعها الآن أو اتركها موسومة." |
| Reconciliation resolved | "1006.30 re-pinned to the 2026 edition after your review — description change recorded." | "أُعيد تثبيت 1006.30 على إصدار 2026 بعد مراجعتك — تغيّر الوصف مسجّل." |
| Undo window (P03, removal) | "Saved code removed — Undo (7s)" | "أُزيل الرمز المحفوظ — تراجع (7 ثوانٍ)" |
| Export ready | "Evidence pack ready — markdown, notes included, expires in 7 days." | "حزمة الأدلة جاهزة — ماركداون مع القرارات، تنتهي بعد 7 أيام." |
| Sample list badge | "Sample list — fixture rates and fixture rulings. Clear it when real work arrives." | "قائمة عيّنة — رسوم تركيبية وقرارات تركيبية. امسحها متى وصل العمل الحقيقي." |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Assist suggestion (P15 draft) | "Suggestion: 0207.14 'Frozen' (0.94) — matched 'frozen chicken' / 'دجاج مجمد'. A draft: nothing is saved until you act." | "اقتراح: 0207.14 'مجمدة' (0.94) — طابق 'frozen chicken' / 'دجاج مجمد'. مسودة: لا شيء يُحفظ حتى تتحرك." |
| Assist degraded notice | "The assist is off this run — candidates come from deterministic keyword matching. Same index, no capability." | "المساعد متوقف في هذا التشغيل — المرشّحات من المطابقة الحتمية للكلمات. الفهرس ذاته بلا قدرة." |
| Rung 4 banner (capability off) | "The search assist is unavailable right now. Everything else works — browse, bilingual search, notes, lists, edition checks, exports. We'll say when it returns (est. 2 hours)." | "مساعد البحث غير متاح الآن. كل ما عداها يعمل — التجوّل والبحث الثنائي والقرارات والقوائم وفحوص الإصدارات والتصديرات. سنخبرك عند عودته (تقديراً ساعتان)." |
| Quota meter warning (80%) | "Assist window at 16 of 20 — deterministic search stays unlimited either way." | "نافذة المساعدة عند 16 من 20 — البحث الحتمي يبقى بلا حدود في الحالين." |
| Normalization disclosure (first reveal) | "'شاشه' matched 'شاشة' — the taa-marbouta rule. See every rule the search applied." | "طابقت 'شاشه' كلمة 'شاشة' — قاعدة التاء المربوطة. اعرض كل قواعد البحث المطبَّقة." |
| Arabic rendering gap mark | "No Arabic national rendering published for this line — the English text is the international text. We never machine-fill the Arabic side." | "لا صياغة عربية وطنية منشورة لهذا البند — النص الإنجليزي هو النص الدولي. لا نملأ الجهة العربية آلياً أبداً." |
| Note source gap (EN-only note) | "This ruling was published without an Arabic side — committee texts issue in English and French." | "صدر هذا القرار بلا جهة عربية — نصوص اللجنة تصدر بالإنجليزية والفرنسية." |
| Note source gap (AR-only goods) | "Goods description carried in Arabic only — the source published no English side." | "وصف السلع محمول بالعربية وحدها — المصدر لم ينشر جهة إنجليزية." |
| Superseded note banner | "Superseded by WCO-HSC-2022-72 — read the current ruling." | "حلّ محله WCO-HSC-2022-72 — اقرأ القرار الحالي." |
| Excise flag | "Flagged under a separate excise regime — outside the customs duty scope of this schedule. No amount is shown." | "موسوم بنظام رسم انتقائي منفصل — خارج نطاق الرسم الجمركي لهذا الجدول. لا يُعرض أي مبلغ." |
| No-guarantee sentence (every duty surface) | "Published reference — the customs authority's assessment is its own." | "مرجع منشور — تقدير سلطة الجمارك شأنها الخاص." |
| Retired-code tombstone | "Retired in the 2026 edition. Successor: 8524 — flat panel display modules." | "أُحيل للتقاعد في إصدار 2026. البديل: 8524 — وحدات العرض ذات الشاشات المسطحة." |
| Edition change row (rate) | "3926.90.00.20: 5% → 10% — rate changed between the 2025 and 2026 editions." | "3926.90.00.20: من 5% إلى 10% — تغيّر الرسم بين إصداري 2025 و2026." |
| Edition change row (added) | "8806 added in the 2026 edition — unmanned aircraft; previously classified with other aircraft." | "أُضيف 8806 في إصدار 2026 — الطائرات بدون طيار؛ كانت تُصنّف مع الطائرات الأخرى." |
| First-run fixture banner (Mock Adapter) | "Mock Adapter: fixture data — real heading roots, synthetic national lines, rates, and rulings. Nothing here is asserted as law." | "المحوّل التجريبي: بيانات تركيبية — جذور بنود حقيقية وامتدادات وطنية ورسوم وقرارات تركيبية. لا شيء هنا يُدّعى أنه قانون." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Code inside Arabic prose | "The line 0207.14.00.20 renders left-to-right inside this Arabic sentence — isolated, digits unflipped." | "يُعرض البند 0207.14.00.20 من اليسار إلى اليمين داخل هذه الجملة العربية — معزولاً وأرقامه غير معكوسة." |
| Latin brand term in Arabic query | "USB-C stays Latin inside the Arabic query — matched against the English description field." | "يبقى USB-C لاتينياً داخل الاستعلام العربي — ويطابق حقل الوصف الإنجليزي." |
| Arabic description in EN chrome | "'دجاج مجمد كامل (بند تركيبي)' renders right-to-left inside the English results table — isolated, never force-flipped." | "تُعرض 'دجاج مجمد كامل (بند تركيبي)' من اليمين إلى اليسار داخل جدول النتائج الإنجليزي — معزولة ولا تُقلب قسراً أبداً." |
| Mixed product description (desk's own) | "Mixed descriptions store verbatim and render at their own direction per line — the desk writes 'شاحن سريع 20W' once and both sides read it correctly." | "الأوصاف المختلطة تُخزَّن كما كُتبت وتُعرض باتجاهها في كل سطر — يكتب المكتب 'شاحن سريع 20W' مرة واحدة فيقرؤها الطرفان صحيحة." |

## Announcement pairing (a11y-baseline §4 — matrix strings above are the visible carriers)

Every loading, success, and signature string above is announced politely as written; VALIDATION/PERMISSION/CONFLICT error strings announce assertively; the duty-reference block never auto-announces (read deliberately on focus — 09 schedule). No string exists only as an announcement — every live-region message pairs with its visible surface.
