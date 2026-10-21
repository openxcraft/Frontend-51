# 11 — Empty / Loading / Error: halal-certification-tracker (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR (bilingual-ar product — full matrix) · voice = registrar-precise, فصحى وسطى (trust register, 02) · numerals Western everywhere (ledger row; never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked (02 glossary): مقدم الطلب=applicant · طلب الشهادة=application · المكوّن=ingredient · التركيبة=formulation · شهادة المورّد=supplier certificate · الشهادة=certificate · السجل=register · التجديد=renewal · سلّم التجديد=renewal ladder · درجة السلّم=rung · تحليل الأثر=impact analysis · محضر التدقيق=audit record · قرار اللجنة=decision.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 register first-run | "No certificates in the register yet. Open the sample body data — three certificates across three schemes — and read a renewal ladder and one impact analysis before importing anything." | "لا شهادات في السجل بعد. افتح بيانات العيّنة — ثلاث شهادات عبر ثلاثة أنظمة — واقرأ سلّم تجديد وتحليل أثر واحداً قبل أي استيراد." | Open sample / New applicant |
| S1 filtered-empty | "No certificates match these filters." | "لا شهادات تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "This register belongs to a different certification body." | "هذا السجل يخصّ جهة منح شهادات أخرى." | Switch workspace |
| S1 zone-empty (steady/due digest) | "No certificates in this zone. Steady certificates appear here when their ladders begin." | "لا شهادات في هذه المنطقة. الشهادات المستقرة تظهر هنا عندما تبدأ سلالمها." | — |
| S2 applicants first-run | "No applicants yet. Register the first applying company with its legal name in both languages." | "لا مقدّمي طلبات بعد. سجّل أول شركة متقدّمة باسمها القانوني باللغتين." | Register applicant |
| S2 filtered-empty | "No applicants match these filters." | "لا مقدّمي طلبات يطابقون هذه المرشّحات." | Clear filters |
| S3 formulation first-run (new case) | "No formulation yet. Paste the ingredient list into the directory, then build the product's lines here." | "لا تركيبة بعد. الصق قائمة المكوّنات في الدليل، ثم ابنِ سطور المنتج هنا." | Import ingredients |
| S3 formulation all-resolved | "Every line resolved — the formulation is ready for the issuance gate." | "كل السطور محلولة — التركيبة جاهزة لبوابة الإصدار." | Advance to decision |
| S4 ingredients first-run | "Empty directory. Paste an ingredient list — both languages, one row per ingredient — and the directory grows with every case." | "الدليل فارغ. الصق قائمة مكوّنات — باللغتين، مكوّن في كل سطر — وسينمو الدليل مع كل طلب." | Paste ingredient list |
| S4 search-empty (normalized) | "No ingredient matches 'جيلاتين' under the search rules. One rule in use: alef, taa marbuta, and yaa variants fold together — see every rule." | "لا مكوّناً يطابق 'جيلاتين' وفق قواعد البحث. قاعدة قيد الاستخدام: تُطوى أوجه الألف والتاء المربوطة والياء معاً — اعرض كل القواعد." | Clear search / See rules |
| S5 vault first-run | "No supplier certificates recorded. Evidence starts with a number, an issuer, and two dates — files can come later." | "لا شهادات مورّدين مسجّلة. يبدأ الدليل برقم وجهة إصدار وتاريخين — والملفات يمكن أن تأتي لاحقاً." | Record supplier certificate |
| S5 no-data-after-activity (all expired) | "Every recorded certificate has expired. Expired evidence stays in the vault as history — open the history filter to read it, or record the successor." | "كل الشهادات المسجّلة منتهية الصلاحية. الأدلة المنتهية تبقى في الخزانة تاريخاً — افتح مرشّح التاريخ لقراءتها، أو سجّل الشهادة الخلَف." | Show history / Record successor |
| S7 digest nothing due | "Nothing due this month. 14 certificates steady, 1 due soon, 2 overdue — the zones carry the rest." | "لا شيء مستحق هذا الشهر. 14 شهادة مستقرة، و1 قريبة الاستحقاق، و2 متأخرة — المناطق تحمل البقية." | Open overdue zone |
| S7 lapsed zone-empty | "No lapsed certificates. The one that got away is the one this surface exists to prevent." | "لا شهادات ساقطة. الشهادة التي تفلت هي التي وُجد هذا السطح لمنعها." | — |
| S9 activity first-run | "No entries yet. Every consequential act — issuance, suspension, a classification change — lands here with its actor and timestamp." | "لا قيود بعد. كل فعل جوهري — إصدار أو إيقاف أو تغيير تصنيف — يُدوَّن هنا بفاعله ووقته." | — |
| S10 jobs empty | "Nothing running. Ingredient imports and document exports appear here while they work." | "لا مهام قيد التنفيذ. استيرادات المكوّنات وتصديرات المستندات تظهر هنا أثناء عملها." | — |
| Impact honest-empty (haram, unused) | "No issued certificate carries this ingredient. Its classification is blocking for future formulations — the emptiness is the fact." | "لا شهادة صادرة تحمل هذا المكوّن. تصنيفه حاجب للتركيبات المستقبلية — والخلوّ ذاته هو الحقيقة." | View classification |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 register skeleton | skeleton rows ×8 + "Loading the register…" (SR) | صفوف هيكلية + "جارٍ تحميل السجل…" |
| S3 formulation loading | "Loading the formulation — 5 lines with their resolutions." | "جارٍ تحميل التركيبة — 5 سطور مع حالات حلّها." |
| Impact computing (reserved region) | "Walking the graph — ingredient to formulations to certificates…" | "جارٍ سير الرسم — من المكوّن إلى التركيبات إلى الشهادات…" |
| Ingredient import job (determinate) | "Importing row 9 of 14 — 'جيلاتين' recognized as a spelling variant of an existing ingredient." | "استيراد السطر 9 من 14 — التُقطت 'جيلاتين' صيغةً كتابية لمكوّن قائم." |
| Register export job (milestones) | "Exporting the register — document 2 of 3, ladders appendix on." | "تصدير السجل — مستند 2 من 3، مع ملحق السلالم." |
| Certificate export job | "Rendering the bilingual certificate document." | "جارٍ إعداد مستند الشهادة ثنائي اللغة." |
| Ladder recompute (large registers) | "Recomputing renewal ladders…" | "إعادة احتساب سلالم التجديد…" |
| Dossier loading | "Assembling the committee dossier — formulation, evidence, audit record." | "تجميع ملف اللجنة — التركيبة والأدلة ومحضر التدقيق." |
| Autosave (P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| S10 job row | determinate: "9 of 14"; indeterminate: "Working — no estimate yet" | "9 من 14" ؛ "قيد العمل — لا تقدير بعد" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (one-script legal name) | "The applicant's legal name needs both languages — the register is bilingual by construction. Add the missing side and save." | "الاسم القانوني لمقدّم الطلب يحتاج اللغتين — السجل ثنائي اللغة بالبنية. أضف الجهة الناقصة واحفظ." |
| VALIDATION (malformed import row) | "Row 17 has no Arabic name — rows around it imported fine. Fix row 17 and import just it." | "السطر 17 بلا اسم عربي — استُوردت الأسطر من حوله سليمة. صحّح السطر 17 واستورد وحده." |
| VALIDATION (issuance gate) | "Issuance refused: 2 lines unresolved — 'أحادي وثنائي الجليسريدات' (مشبوه بلا قرار) and 'أصفر الشفق' (قيد المراجعة). Resolve both, or record the committee's acceptance." | "رُفض الإصدار: سطران غير محلولين — 'أحادي وثنائي الجليسريدات' (مشبوه بلا قرار) و'أصفر الشفق' (قيد المراجعة). حلَّهما، أو دوّن قبول اللجنة." |
| VALIDATION (stage order) | "The case cannot jump from 'documents' to 'decision' — the ladder walks forward one stage at a time, or back with a reason." | "لا يمكن للطلب القفز من 'المستندات' إلى 'القرار' — السلّم يتقدم درجةً درجة، أو يرجع بسبب." |
| VALIDATION (ladder offsets) | "Rung offsets must step down: 'issue at 30 days' cannot come before 'submit at 45 days'. Fix the order before saving." | "يجب أن تتنازل إزاحات الدرجات: 'الإصدار عند 30 يوماً' لا يمكن أن يسبق 'التقديم عند 45 يوماً'. صحّح الترتيب قبل الحفظ." |
| VALIDATION (renewal on suspended) | "This certificate is suspended — its problem is not time. Resolve the suspension before opening a renewal." | "هذه الشهادة موقوفة — مشكلتها ليست الوقت. عالج الإيقاف قبل فتح تجديد." |
| NOT_FOUND (stale link) | "That certificate or applicant is gone from this register. It may have been withdrawn while you were away." | "تلك الشهادة أو ذلك المقدّم غاب عن هذا السجل. ربما سُحب أثناء غيابك." → العودة إلى السجل |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the register it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — السجل الذي صدر عنه لم يتغيّر." |
| PERMISSION (viewer seat) | "Your seat views the register and exports, but does not change it. Ask the body's owner for an assessor seat." | "مقعدك يعرض السجل ويصدّر ولا يغيّره. اطلب من مالك الجهة مقعداً فاحصاً." |
| PERMISSION (policy is owner-only) | "Ladder policy belongs to the owner's seat — your assessor seat works cases, not schemes. Copy the offsets and ask the owner to apply them." | "سياسة السلالم تخصّ مقعد المالك — مقعدك الفاحص يعمل على الطلبات لا الأنظمة. انسخ الإزاحات واطلب من المالك تطبيقها." |
| PERMISSION (decision is committee-only) | "Decisions are the committee's act. Your seat prepares the dossier — the committee records the ruling." | "القرارات فعل اللجنة. مقعدك يُعدّ الملف — واللجنة تدوّن الحكم." |
| CONFLICT (concurrent formulation edit) | "خالد saved this formulation while you did. Both versions are kept — choose what stays." | "حفظ خالد هذه التركيبة أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (renewal on renewed) | "A renewal case already exists for this certificate — opened 12 Nov by مريم. Continue that case instead." | "يوجد طلب تجديد قائم لهذه الشهادة — فتحته مريم في 12 نوفمبر. تابع ذلك الطلب بدلاً منه." |
| CONFLICT (certificate number reuse) | "Number HCT-2026-0118 is already in the register. The body's numbering must stay unique — take the next number." | "الرقم HCT-2026-0118 موجود في السجل سلفاً. يجب أن يبقى ترقيم الجهة فريداً — خذ الرقم التالي." |
| RATE_LIMIT (import window) | "This month's import window is used — 20 of 20 lists. Exports resume 1 Apr; the register itself never pauses." | "استُهلكت نافذة الاستيراد لهذا الشهر — 20 من 20 قائمة. تستأنف الاستيرادات في 1 أبريل؛ والسجل نفسه لا يتوقف." |
| RATE_LIMIT (export window) | "The export window is at its limit — 30 of 30 documents. The next window opens 1 Apr; nothing is lost." | "نافذة التصدير عند حدّها — 30 من 30 مستنداً. تُفتح النافذة التالية في 1 أبريل؛ ولا شيء ضائع." |
| NETWORK (register stale) | "The register went stale — reconnecting. Nothing you recorded is lost." | "تقادم السجل — تجري إعادة الاتصال. لا شيء ممّا دوّنته ضائع." |
| NETWORK (export partial) | "The bundle delivered 1 of 2 parts — the register document arrived, the ladders appendix didn't. Retry just the appendix." | "سلّمت الحزمة 1 من 2 — وصل مستند السجل ولم يصل ملحق السلالم. أعد محاولة الملحق وحده." |
| UNKNOWN | "Something failed on our side (ref hct-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع hct-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips, no confetti — a register records, it does not celebrate)

| Moment | English | Arabic |
|---|---|---|
| Import done | "14 rows in, 2 spelling variants merged, 0 invalid — every row accounted for." | "دخل 14 سطراً، ودُمجت صيغتا كتابة، و0 غير صالحة — كل سطر محسوب." |
| Formulation saved | "Formulation v3 saved — 5 lines, 4 resolved, 1 needs attention." | "حُفظت التركيبة v3 — 5 سطور، 4 محلولة، و1 تستوجب انتباهاً." |
| Resolution recorded | "Resolution recorded — 'أحادي وثنائي الجليسريدات' carries the committee's basis from today." | "دُوّن الحل — يحمل 'أحادي وثنائي الجليسريدات' أساس اللجنة من اليوم." |
| Supplier certificate recorded | "Certificate SG-88214 recorded — valid until 5 Apr 2027, 2 formulations evidence it." | "سُجّلت الشهادة SG-88214 — صالحة حتى 5 أبريل 2027، وترتكز عليها تركيبتان." |
| Supplier certificate replaced | "Successor recorded — SG-88214's expired predecessor stays in history." | "سُجّل الخلَف — يبقى سلف SG-88214 المنتهي في التاريخ." |
| Audit outcome recorded | "Audit recorded — 20 Feb, no non-conformities. The case's audit stage is complete." | "دُوّن محضر التدقيق — 20 فبراير، بلا مخالفات. اكتملت درجة التدقيق في الطلب." |
| Decision recorded | "Decision recorded — grant, by د. أحمد فتحي, 1 Mar. The issuance gate is armed." | "دُوّن القرار — منح، من د. أحمد فتحي، في 1 مارس. بوابة الإصدار جاهزة." |
| Certificate issued | "Certificate HCT-2027-0003 issued — 1 product, expires 5 Apr 2028, ladder pinned v2." | "صدرت الشهادة HCT-2027-0003 — منتج واحد، تنتهي في 5 أبريل 2028، والسلّم مثبّت v2." |
| Certificate suspended | "Suspended — HCT-2026-0101, reason recorded, applicant notified manually." | "أُوقفت — HCT-2026-0101، السبب مدوّن، وأُشعر المقدّم يدوياً." |
| Renewal case opened | "Renewal opened — applicant, products, and unchanged ingredients carried over. Nothing re-entered." | "فُتح التجديد — نُقل المقدّم والمنتجات والمكوّنات غير المتغيّرة. لا شيء أُعيد إدخاله." |
| Rung cleared | "Rung cleared — submission, 3 weeks before its date. The ladder climbs." | "خُطيت الدرجة — التقديم، قبل موعدها بثلاثة أسابيع. السلّم يرتقي." |
| Export ready | "Export ready — bilingual register, ladders appendix on, expires in 7 days." | "التصدير جاهز — سجل ثنائي اللغة مع ملحق السلالم، ينتهي بعد 7 أيام." |
| Undo window (P03, line removal) | "Line removed — Undo (7s)" | "أُزيل السطر — تراجع (7 ثوانٍ)" |

## E. Signature moments (product-defining copy — the gate, the graph, the ladder)

| Moment | English | Arabic |
|---|---|---|
| Impact result header (counts first) | "3 certificates affected — 2 applicants, ranked by days to expiry. The nearest: HCT-2026-0118, 21 days." | "3 شهادات متأثرة — مقدّما طلبين، مرتّبة بأيام الانتهاء. الأقرب: HCT-2026-0118، 21 يوماً." |
| Impact severity — evidence | "Severity: evidence — the gelatin supplier's certificate expires 5 Apr 2027. Two lines ride on it." | "الخطورة: دليل — شهادة مورد الجيلاتين تنتهي في 5 أبريل 2027. يستند عليها سطران." |
| Impact severity — blocking | "Severity: blocking — 'قرمز' is classified haram. No issued certificate carries it; every future formulation will be refused." | "الخطورة: حاجب — 'قرمز' مصنّف حراماً. لا شهادة صادرة تحمله؛ وكل تركيبة مستقبلية سترفض." |
| Impact determinism note | "Same register, same answer — this result is arithmetic over linked data, recomputable at any time." | "السجل نفسه، الجواب نفسه — هذه النتيجة حساب على بيانات مترابطة، تُعاد حسباً متى شئت." |
| Gate refusal (the typed refusal) | "Issuance refused — the gate is arithmetic, not judgment: 1 line unresolved, 1 record missing. Both are named below." | "رُفض الإصدار — البوابة حساب لا اجتهاد: سطر واحد غير محلول، وسجل واحد ناقص. كلاهما مسمّى أدناه." |
| Gate passed | "The gate passes — every line resolved, audit closed, decision recorded. Issue when ready." | "تجتاز البوابة — كل السطور محلولة، والتدقيق مغلق، والقرار مدوّن. أصدر متى شئت." |
| Ladder first read (S6) | "Renewal ladder — 5 rungs from notify (180 days out) to issue (30 days out). Today sits between 'submit' and 'issue'." | "سلّم التجديد — 5 درجات من التنبيه (قبل 180 يوماً) إلى الإصدار (قبل 30 يوماً). اليوم بين 'التقديم' و'الإصدار'." |
| Missed rung (honest) | "Missed — submission was due 5 Jan 2027. The certificate expires in 21 days; open the renewal now." | "فائتة — كان التقديم مستحقاً في 5 يناير 2027. الشهادة تنتهي بعد 21 يوماً؛ افتح التجديد الآن." |
| Lapse recorded | "Lapsed 15 days ago — the renewal case stays open; the gap will be recorded on the chain, not hidden." | "سقطت قبل 15 يوماً — يبقى طلب التجديد مفتوحاً؛ وسيُدوَّن الفراغ في السلسلة لا يُخفى." |
| Pinned ladder note | "This certificate's ladder is pinned to policy v2 — later policy edits change future certificates, never this one." | "سلّم هذه الشهادة مثبّت على السياسة v2 — تعديلات السياسة اللاحقة تغيّر الشهادات المستقبلية، لا هذه." |
| Sample-data badge | "Sample body data — three schemes, six certificates, one open case. Clear it when the real register arrives." | "بيانات جهة عيّنة — ثلاثة أنظمة، ست شهادات، وطلب واحد مفتوح. امسحها متى وصل السجل الحقيقي." |
| Metadata-mode document note | "Recorded without a file — number, issuer, and dates are the evidence; attach the document when the storage capability is bound." | "سُجل بلا ملف — الرقم وجهة الإصدار والتواريخ هي الدليل؛ أرفق المستند عند ربط قدرة التخزين." |
| History kept | "Expired evidence never disappears — the vault keeps it, filters mark it, the successor references it." | "الأدلة المنتهية لا تختفي — تحتفظ بها الخزانة، وتميّزها المرشّحات، ويشير إليها الخلَف." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin certificate number in Arabic row | "HCT-2026-0118 — a Latin-script register number inside the Arabic register. Rendered isolated; the row's direction is untouched." | "HCT-2026-0118 — رقم سجل بخط لاتيني داخل السجل العربي. يُعرض معزولاً؛ واتجاه السطر باقٍ كما هو." |
| E-code in Arabic prose | "E441 inside an Arabic sentence renders isolated — the code never reorders its neighbors." | "يُعرض E441 داخل جملة عربية معزولاً — الرمز لا يعيد ترتيب جيرانه أبداً." |
| Arabic ingredient name in English chrome | "'أحادي وثنائي الجليسريدات' renders right-to-left inside the English dossier — isolated, never force-flipped." | "تُعرض 'أحادي وثنائي الجليسريدات' من اليمين إلى اليسار داخل الملف الإنجليزي — معزولة، ولا تُقلب قسراً أبداً." |
| Mixed auditor name field | "Auditor names are typed as given — 'سعيد العمري' and 'Saeed Al-Omari' may both appear; each renders at its own direction." | "أسماء المدقّقين تُكتب كما أُعطيت — قد يظهر 'سعيد العمري' و'Saeed Al-Omari' معاً؛ كلٌّ يُعرض باتجاهه." |
