# 11 — Empty / Loading / Error: price-rule-engine (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR (bilingual-en product — both locales carried because the workspace flips, 05 direction model) · voice = pricing-desk (02: numerical, unhurried, derivation-forward — states the arithmetic and its inputs, never editorializes whether a price is "aggressive" or "smart") · Arabic is فصحى بيضاء utility register · **numerals Western everywhere per ledger row** (prices, margins, floors, counts — never mixed systems mid-sentence, copy-voice §1.7; currency codes render Western + SAR/AED, bidi-isolated inside Arabic strings) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked (02): قاعدة التسعير=pricing rule · الكتالوج=catalog · صنف=catalog item · التكلفة المتجلبة=landed cost · الحد الأدنى (أرضية التكلفة)=cost floor · المحاكاة=simulation · معاينة الهامش=margin preview · المقترح السعري=price proposal · الاعتماد=approval · تصدير=export · السوق=market · القناة=channel · هامش الربح=gross margin · الفئة=category · سجل النشاط=activity log · الأولوية=priority · نافذة الصلاحية=validity window. Vocabulary boundary (LOOP-10): the word "repricer" (مُعيد التسعير) never appears in either locale; no competitor vocabulary, no automation promises, no effect-size claims for endings (01 §D honest gap).

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 rules console first-run | "No pricing rules yet. Author one — conditions, actions, priority — or read the seeded sample: one active markdown rule and a simulation that clamped three rows at their floors." | "لا قواعد تسعير بعد. أنشئ واحدة — شروطاً وأفعالاً وأولوية — أو اقرأ العيّنة المهيّأة: قاعدة تخفيض فعّالة، ومحاكاة أمسكت ثلاثة صفوف عند حدودها الدنيا." | Create rule / Open sample simulation |
| S1 filtered-empty | "No rules match these filters." | "لا قواعد تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "This workspace's rules are not visible to your seat." | "قواعد مساحة العمل هذه غير مرئية لمقعدك." | Switch workspace |
| S3 catalog first-run | "No catalog yet. Paste your items — sku, names, category, market, channel, net price, optionally cost and floor — or start from the 12-item sample that ships with costs and one simulation." | "لا كتالوج بعد. الصق أصنافك — الرمز والاسمان والفئة والسوق والقناة والسعر الصافي، والتكلفة والحد اختيارياً — أو ابدأ بعيّنة الـ 12 صنفاً التي تصل بتكاليفها ومحاكاة واحدة." | Import catalog / Open sample catalog |
| S3 filtered-empty | "No items match these filters." | "لا أصناف تطابق هذه المرشّحات." | Clear filters |
| S3 margin column, item without cost | "No landed cost — margin and floor unchecked for this item." | "لا تكلفة متجلبة — الهامش والحد الدنيا غير مفحوصين لهذا الصنف." | Add cost record |
| S4 item with no cost records | "This item has no cost record yet. Margin, floor checks, and simulation need one — effective-dated, with components." | "لا سجل تكلفة لهذا الصنف بعد. الهامش وفحوص الحد والمحاكاة تحتاج واحداً — بتاريخ سريان ومكوّنات." | Record landed cost |
| S4 price history, never edited | "No price changes recorded — this item still carries its imported price." | "لا تغييرات سعر مسجّلة — ما زال هذا الصنف على سعره المستورد." | — |
| S6 simulations history first-run | "No simulations yet. The seeded audit is your price file against your costs — run one before authoring a single rule." | "لا محاكاات بعد. التدقيق المهيّأ هو ملف أسعارك مقابل تكاليفك — شغّل واحدة قبل إنشاء أي قاعدة." | Open seeded simulation / Run simulation |
| S7 proposals first-run | "No price proposals yet. A proposal is a reviewed subset of a simulation — every exclusion carries a reason, and nothing ships without an approval." | "لا مقترحات سعرية بعد. المقترح مجموعة صفوف مراجَعة من محاكاة — كل استبعاد بسبب، ولا شيء يصدر دون اعتماد." | Create proposal |
| S7 filtered-empty | "No proposals match these filters." | "لا مقترحات تطابق هذه المرشّحات." | Clear filters |
| S8 jobs empty | "Nothing running. Imports, simulations, and exports appear here while they work." | "لا مهام قيد التنفيذ. الاستيرادات والمحاكاات والتصديرات تظهر هنا أثناء عملها." | — |
| S9 artifacts empty | "No export files yet. The price-update package carries the approved sheet and its audit ledger." | "لا ملفات تصدير بعد. حزمة تحديث الأسعار تحمل الكشف المعتمد وسجل التدقيق الخاص به." | Export package |
| S10 activity empty | "Nothing recorded yet. Every rule save, cost record, simulation, review action, and approval lands here." | "لا شيء مسجّلاً بعد. كل حفظ قاعدة وسجل تكلفة ومحاكاة وفعل مراجعة واعتماد يصل هنا." | — |
| Simulation over a no-cost scope | "0 items simulated — none of the scoped items carries a cost record at the snapshot. Costs first; the engine never invents one." | "صفر أصناف محاكاةً — لا صنفاً واحداً في النطاق يحمل سجل تكلفة عند لقطة التكلفة. التكاليف أولاً؛ والمحرّك لا يخترع تكلفة أبداً." | Open cost desk |
| Rules exist but none applies (floor-only run) | "No rule applied — the run is the floor-only pass: your current price file against your costs, nothing changed except clamps on underwater rows." | "لا قاعدة طُبّقت — هذه الجولة فحص الحد فقط: ملف أسعارك الحالي مقابل تكاليفك، ولم يتغير شيء سوى الإمساك بالصفوف الغارقة." | View clamped rows |
| Gate, no blockers | "Nothing blocks submission. Unreviewed rows: 0." | "لا شيء يعترض التقديم. صفوف غير مراجَعة: 0." | Submit for approval |

## B. Loading (P02/P12 — skeletons mirror the summary-header + row-table geometry per direction; honest determinate progress)

| State | English | Arabic |
|---|---|---|
| S1/S3/S7 list skeletons | skeleton rows ×8 + "Loading your rules…" / "Loading the catalog…" (SR) | صفوف هيكلية + "جارٍ تحميل قواعدك…" / "جارٍ تحميل الكتالوج…" |
| Catalog import (determinate) | "Importing 140 of 220 items — invalid rows are named and skipped, valid rows land." | "استيراد 140 من 220 صنفاً — الصفوف غير الصالحة تُسمّى وتُتخطى، والصالحة تُدخل." |
| Cost-sheet import | "Importing the cost sheet — row 17 of 24 lands as an effective-dated record; unmatched SKUs will be named." | "استيراد كشف التكاليف — السطر 17 من 24 يدخل كسجل بتاريخ سريان؛ والرموز غير المطابقة ستُسمّى." |
| Simulation job (determinate) | "Simulating item 140 of 220 — the snapshot lands whole; progress is items, not percentages." | "محاكاة الصنف 140 من 220 — تصل اللقطة كاملة؛ والتقدّم بالأصناف لا بالنسب." |
| Simulation completing (atomic) | "Composing the snapshot — margins, clamps, and VAT figures per market." | "تجميع اللقطة — الهوامش والإمساكات وأرقام الضريبة لكل سوق." |
| Export job | "Packaging the price update — approved sheet and audit ledger." | "تجميع تحديث الأسعار — الكشف المعتمد وسجل التدقيق." |
| Live recompute after cost save | "Recomputing margin and floor for this item…" (≤50ms — usually invisible) | "إعادة حساب الهامش والحد لهذا الصنف…" |
| Rule editor autosave (P10) | "Saving…" → "Saved" (fades after 3s) | "جارٍ الحفظ…" → "حُفظ" |
| FormulaPanel (during field edit) | (reserved-height region updates ≤120ms — no spinner by design) | (منطقة بارتفاع محجوز تتحدث خلال 120 مللي ثانية — بلا مؤشر دوران قصداً) |
| Gate refresh | (derived read — updates within 120ms, no spinner) | (قراءة مشتقة — تتحدث خلال 120 مللي ثانية، بلا مؤشر) |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (import bad row) | "Row 7 is malformed — its net price is not a number. Rows 1–6 imported; fix row 7 and import it alone." | "السطر 7 معطوب — سعره الصافي ليس رقماً. استُوردت الأسطر 1–6؛ صحّح السطر 7 واستورده وحده." |
| VALIDATION (unknown market code) | "Row 12 names market 'EGY' — this workspace has KSA and UAE. Fix the code or add the market in settings first." | "يسمّي السطر 12 السوق 'EGY' — وهذه المساحة فيها KSA وUAE. صحّح الرمز أو أضف السوق في الإعدادات أولاً." |
| VALIDATION (cost sheet unmatched SKU) | "Row 4 names SKU DA-9999 — no such item in the catalog. The other 3 rows landed as effective-dated records." | "يسمّي السطر 4 الرمز DA-9999 — لا صنف بهذا الرمز في الكتالوج. هبطت الأسطر الثلاثة الأخرى كسجلات بتواريخ سريان." |
| VALIDATION (priority collision) | "Priority 10 is taken by 'Kitchen — seasonal markdown 5%'. Priority is a total order — pick another number or pause that rule." | "الأولوية 10 محجوزة لقاعدة 'تخفيض موسمي للمطبخ 5%'. الأولوية ترتيب كامل — اختر رقماً آخر أو أوقف تلك القاعدة." |
| VALIDATION (empty rule conditions) | "A rule needs at least one condition — a rule matching nothing is a mistake, and the engine says so." | "تحتاج القاعدة شرطاً واحداً على الأقل — القاعدة التي لا تطابق شيئاً خطأ، والمحرّك يقول ذلك." |
| VALIDATION (empty simulation scope) | "The scope matches zero items — widen it or check the filters before running." | "النطاق يطابق صفر صنف — وسّعه أو راجع المرشّحات قبل التشغيل." |
| VALIDATION (selected mode without rules) | "Selected mode names no rules — pick at least one, or run the active set." | "النمط المحدد لا يسمّي قواعد — اختر واحدة على الأقل، أو شغّل مجموعة القواعد الفعّالة." |
| VALIDATION (manual price without note) | "A manual price change needs a note — it is the reason the audit trail carries." | "التغيير اليدوي للسعر يحتاج ملاحظة — فهي السبب الذي يحمله سجل التدقيق." |
| VALIDATION (exclusion without reason) | "An exclusion needs a reason — 'floor-clamped, renegotiate supplier first' is the record's voice, not a decoration." | "الاستبعاد يحتاج سبباً — 'ممسوك عند الحد، إعادة التفاوض مع المورّد أولاً' هو صوت السجل لا زخرفة." |
| VALIDATION (submission gate) | "Submission refused — 12 rows are unreviewed. First: DA-7021. Review every row or exclude it with a reason." | "رُفض التقديم — 12 صفاً بلا مراجعة. أولها: DA-7021. راجع كل صف أو استبعده بسبب." |
| VALIDATION (export of unapproved proposal) | "This proposal is still in review — export needs status 'approved'. The gate is the export's source of truth." | "ما زال هذا المقترح قيد المراجعة — التصدير يحتاج الحالة 'معتمد'. البوابة هي مصدر حقيقة التصدير." |
| NOT_FOUND (stale link) | "That item, rule, simulation, or proposal is gone from this workspace. It may have been deleted while you were away." | "ذلك الصنف أو القاعدة أو المحاكاة أو المقترح غاب عن مساحة العمل. ربما حُذف أثناء غيابك." → العودة إلى الكتالوج |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the approved proposal it came from is unchanged, and regeneration is deterministic." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — المقترح المعتمد الذي صدر عنه لم يتغيّر، وإعادة التوليد حتمية." |
| PERMISSION (viewer seat) | "Your seat reads simulations, proposals, and margin previews but doesn't change them. Ask the workspace owner for an editor seat." | "مقعدك يقرأ المحاكاات والمقترحات ومعاينات الهامش ولا يغيّرها. اطلب من مالك مساحة العمل مقعد محرّر." |
| PERMISSION (non-approver approval) | "Approval belongs to an approver seat — yours reviews and curates. The gate keeps its single door." | "الاعتماد لمقعد المعتمِد — ومقعدك يراجع وينتقي. تحافظ البوابة على بابها الواحد." |
| PERMISSION (capability unconsented) | "File intake needs the file-intake capability granted to this workspace. Grant it — or paste the rows; pasting always works." | "استيراد الملفات يتطلب منح قدرة استيعاب الملفات لمساحة العمل هذه. امنحها — أو الصق الصفوف؛ اللصق يعمل دائماً." |
| CONFLICT (concurrent rule edit) | "Noura saved this rule while you edited it. Both versions are kept — choose what stays." | "حفظت نورة هذه القاعدة أثناء تحريرك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (concurrent item edit) | "Another seat saved this item while you edited. Both versions are kept side by side." | "حفظ مقعد آخر هذا الصنف أثناء تحريرك. النسختان محفوظتان جنباً إلى جنب." |
| CONFLICT (workspace config) | "Faisal changed the floor policy while you edited settings. Both payloads are kept — re-apply your change on the new version." | "غيّر فيصل سياسة الحد أثناء تحريرك الإعدادات. الاحتفاظ بالحملتين — أعد تطبيق تغييرك على النسخة الجديدة." |
| CONFLICT (stale approval) | "Faisal already approved this proposal — the record stands. Later workspace edits never mutate it." | "اعتمد فيصل هذا المقترح بالفعل — والسجل قائم. التعديلات اللاحقة لا تغيّره أبداً." |
| RATE_LIMIT (simulation quota) | "This month's simulation window is used. Reading, row inspection, and proposals keep working — runs resume 1 Dec." | "استُهلكت نافذة المحاكاة لهذا الشهر. القراءة وفحص الصفوف والمقترحات تعمل — وتستأنف الجولات في 1 ديسمبر." |
| RATE_LIMIT (export quota) | "The export window is used for this cycle — the next package frees up on 1 Dec. Nothing about your approved proposal changes." | "استُهلكت نافذة التصدير لهذه الدورة — تتحرر الحزمة التالية في 1 ديسمبر. لا شيء في مقترحك المعتمد يتغيّر." |
| NETWORK (list fetch) | "The list went stale — reconnecting. Every simulation and approval you made is safe." | "تقادمت القائمة — تجري إعادة الاتصال. كل محاكاة واعتماد قمت به آمن." |
| NETWORK (job polling) | "Lost the job's progress signal — the job is authoritative; polling resumes on reconnect." | "فُقد إشارة تقدّم المهمة — المهمة هي المرجع؛ ويستأنف الاستطلاع عند إعادة الاتصال." |
| NETWORK (artifact delivery partial) | "The package delivered 1 of 2 parts — the price sheet arrived, the audit ledger didn't. Retry just the ledger." | "سلّمت الحزمة جزءاً واحداً من 2 — وصل كشف الأسعار ولم يصل سجل التدقيق. أعد محاولة السجل وحده." |
| UNKNOWN | "Something failed on our side (ref pre-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع pre-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips + counts, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Import done | "220 items in — 3 without costs kept and flagged, 5 SKUs updated by upsert, 1 invalid row skipped and named." | "دخل 220 صنفاً — 3 بلا تكاليف حُفظت ووُسمت، و5 رموز حُدّثت بالدمج، وسطر غير صالح واحد تُخطي وسُمّي." |
| Cost sheet done | "18 cost records appended — each effective-dated; the margin column recomputed per item." | "أُلحق 18 سجل تكلفة — كل واحد بتاريخ سريان؛ وأُعيد حساب عمود الهامش لكل صنف." |
| Simulation done (the value sentence) | "Simulation complete — blended margin 31.4% → 33.9% catalog-weighted, 3 rows floor-clamped." | "اكتملت المحاكاة — هامش الربح الإجمالي 31.4% ← 33.9% بترجيح الكتالوج، و3 صفوف ممسوكة عند الحد الأدنى." |
| Clamp fired (row-level) | "DA-7024 clamped at floor 96.14 — raw rule price 84.50. The clamp is the last step, and the trace says so." | "أُمسك DA-7024 عند الحد 96.14 — السعر الخام للقاعدة 84.50. الإمساك آخر خطوة، والأثر يقول ذلك." |
| Ending broken by floor | "Ending 96.00 sat below floor 96.14 — the clamp lifted it. Flagged, never hidden." | "جلس التمييز 96.00 دون الحد 96.14 — فرفعه الإمساك. موسوم، ولا يُخفى أبداً." |
| Rule saved | "Rule saved at version 2 — existing simulations keep version 1 pinned; the next run uses the new one." | "حُفظت القاعدة في الإصدار 2 — المحاكاات القائمة تحتفظ بالإصدار 1 مثبّتاً؛ والجولة التالية تستخدم الجديد." |
| Rule deleted | "Rule deleted — 4 simulations keep their pinned versions. History is never rewritten." | "حُذفت القاعدة — 4 محاكاات تحتفظ بإصداراتها المثبّتة. التاريخ لا يُعاد كتابته أبداً." |
| Manual price recorded | "Price recorded 119.00 → 79.00 with your note — the chain keeps the reason and the actor." | "سُجّل السعر 119.00 ← 79.00 بملاحظتك — تحتفظ السلسلة بالسبب وبالفاعل." |
| Proposal submitted | "Submitted for approval — 208 rows included, 12 excluded with reasons, 0 unreviewed." | "قُدّم للاعتماد — 208 صف مدرج، و12 مستبعدة بأسبابها، و0 غير مراجَعة." |
| Proposal approved (the seal) | "Approved by Faisal — 208 rows, 12 reasoned exclusions, 3 floor-clamped included. The record is frozen." | "اعتمده فيصل — 208 صفوف، و12 استبعاداً مسبَّباً، و3 صفوف ممسوكة مدرجة. السجل مجمّد." |
| Proposal withdrawn | "Withdrawn to draft — the withdrawal is recorded; the audit chain keeps both moves." | "سُحب إلى المسودة — الانسحاب مسجّل؛ وسلسلة التدقيق تحتفظ بالحركتين." |
| Export ready | "Price-update package ready — approved sheet and audit ledger. Expires in 7 days; regenerable forever." | "حزمة تحديث الأسعار جاهزة — الكشف المعتمد وسجل التدقيق. تنتهي بعد 7 أيام؛ وتُعاد توليدها دائماً." |
| Artifact regenerated | "Package regenerated — identical to the approved state it came from. That is what deterministic means here." | "أُعيد توليد الحزمة — مطابقة للحالة المعتمدة التي صدرت عنها. هذا معنى الحتمية هنا." |
| Determinism note (re-run) | "Re-ran the simulation — same catalog, same snapshot, same rules in: the same 3 clamps out." | "أُعيدت المحاكاة — الكتالوج ذاته واللقطة ذاتها والقواعد ذاتها دخولاً؛ والإمساكات الثلاثة ذاتها خروجاً." |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| "The Clamp Settles" (T2 signature, 05) | "Row clamped at floor 96.14 — raw rule price 84.50." (the announcement is the moment's text; the strike-through and settle render beside it) | "أُمسك الصف عند الحد 96.14 — السعر الخام للقاعدة 84.50." |
| Gate refusal (assertive) | "Not yet. 12 rows are unreviewed — first DA-7021 — and the gate names them, not a count alone. Review or exclude each one and it opens." | "ليس بعد. 12 صفاً بلا مراجعة — أولها DA-7021 — والبوابة تسمّيها لا تعدّها فحسب. راجع كل صف أو استبعده تُفتح." |
| The margin preview lands (header) | "KSA 31.4% → 33.9% · UAE 28.1% → 29.0% · catalog-weighted — no sales data at v1." | "KSA 31.4% ← 33.9% · UAE 28.1% ← 29.0% · بترجيح الكتالوج — لا بيانات مبيعات في الإصدار الأول." |
| Floor-only honesty | "No rules ran — this is your price file against your costs. The three underwater rows are the finding." | "لم تُشغَّل قواعد — هذا ملف أسعارك مقابل تكاليفك. الصفوف الثلاثة الغارقة هي النتيجة." |
| Derivation-forward trace (drawer) | "landed 89.02 → rule 84.50 → ending 84.00 → floor 96.14 → final 96.14 — every step's number is on the page." | "التكلفة المتجلبة 89.02 ← القاعدة 84.50 ← التمييز 84.00 ← الحد 96.14 ← النهائي 96.14 — رقم كل خطوة على الصفحة." |
| VAT display preview | "Net 99.00 → display 113.85 SAR incl. VAT 15% — the number the shopper sees, previewed beside the one you set." | "الصافي 99.00 ← المعروض 113.85 ريالاً شاملاً ضريبة 15% — الرقم الذي يراه المتسوق، معايناً بجوار الذي حددته." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin brand inside Arabic name | "The name 'مبخرة كهربائية SlimLine' renders with the Latin brand isolated inside the right-to-left Arabic — punctuation stays put." | "يُعرض الاسم 'مبخرة كهربائية SlimLine' والعلامة اللاتينية معزولة داخل العربية من اليمين إلى اليسار — ويبقى الترقيم في مكانه." |
| Arabic name inside English chrome | "The Arabic item name renders right-to-left inside the English workspace — the cell's direction follows its content, never the chrome." | "يُعرض اسم الصنف العربي من اليمين إلى اليسار داخل مساحة عمل إنجليزية — اتجاه الخلية يتبع محتواها، لا الهيكل أبداً." |
| Number order in both directions | "SKUs, prices, floors, and margins keep one physical order in both directions — 96.14 is 96.14 and DA-7024 is DA-7024 in either chrome." | "الرموز والأسعار والحدود والهوامش تحافظ على ترتيب فيزيائي واحد في الاتجاهين — 96.14 هي 96.14 وDA-7024 هي DA-7024 في أي هيكل." |
| Currency code beside Arabic numerals | "The currency code stays a bidi-isolated Latin token beside Western digits inside Arabic strings — 'SAR' never migrates." | "يبقى رمز العملة رمزاً لاتينياً معزولاً بجوار الأرقام الغربية داخل النصوص العربية — 'SAR' لا يهاجر أبداً." |
| Mixed-direction trace | "The derivation trace reads left-to-right in English chrome and right-to-left in Arabic chrome, while every number inside it keeps physical order." | "يُقرأ أثر الاشتقاق من اليسار إلى اليمين في الهيكل الإنجليزي ومن اليمين إلى اليسار في العربي، وكل رقم فيه يحافظ على ترتيبه الفيزيائي." |
