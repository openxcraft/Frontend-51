# 11 — Empty / Loading / Error: expense-claim-flow (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN + AR · voice = pipeline-plain (02: states the number, the rule it came from, and what happens next) · Arabic is فصحى بيضاء · **numerals Western everywhere per ledger row (money surface — Arabic-Indic digits never appear in system strings; they exist only inside verbatim receipt text, 07a)** · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked (02): المطالبة=claim · بند=claim item · إيصال=receipt · البدل اليومي=per-diem · تعويض المسافة=mileage · جدول المعدلات=rate table · حزمة السياسة=policy pack · سلسلة الموافقات=approval chain · ملاحظة السياسة=policy finding · معترض=blocking · اعتماد=approve · رفض=reject · استفسار=query · الصرف=payout · سجل الصرف=payout record · تصدير=export.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 claims first-run (claimant) | "No claims yet. Start one, add a receipt or a mileage leg, and the arithmetic is ours — or open the sample claim and watch the approval gate refuse a missing receipt." | "لا مطالبات بعد. ابدأ واحدة، وأضف إيصالاً أو مسافة مقطوعة، والحساب علينا — أو افتح المطالبة النموذجية وشاهد بوابة الاعتماد ترفض إيصالاً مفقوداً." | New claim / Open sample claim |
| S1 filtered-empty | "No claims match these filters." | "لا مطالبات تطابق هذه المرشّحات." | Clear filters |
| S1 no-access (finance lens, non-admin seat) | "The finance queue belongs to finance seats. Your claims and any approval steps assigned to you stay fully available." | "طابور المالية يخصّ مقاعد المالية. مطالباتك وخطوات الاعتماد المسندة إليك متاحة تماماً." | Switch to my claims |
| S1 approval lens, nothing pending | "Nothing waits on you. Claims appear here the moment a level routes to you." | "لا شيء ينتظرك. تظهر المطالبات هنا لحظة إسناد مستوىٍ إليك." | — |
| S2 composer, no items | "This claim holds nothing yet. Three kinds of items: a receipt you attach, per-diem days a tier computes, or a distance a rate multiplies." | "لا تحمل هذه المطالبة شيئاً بعد. ثلاثة أنواع من البنود: إيصالٌ ترفقه، وأيام بدل يومي يحسبها المستوى، ومسافةٌ يضربها المعدل." | Add first item |
| S2 receipt bin empty | "No receipts captured for this claim yet. Capture one — or leave items without receipts below the policy's threshold." | "لا إيصالات ملتقطة لهذه المطالبة بعد. التقط واحداً — أو اترك البنود دون إيصالات تحت حدّ السياسة." | Capture receipt |
| S3 receipt panel, pre-capture | "Capture the receipt: photograph it, paste it, or upload the file. Typing the fields yourself always works too." | "التقط الإيصال: صوّره، أو الصقه، أو ارفع الملف. وكتابة الحقول بنفسك تعمل دائماً أيضاً." | Photograph / Paste / Upload |
| S3 manual mode (assist off) | "Field entry is on you — same five fields, same order as always. The assist, when granted, only proposes; you confirm." | "إدخال الحقول عليك — الحقول الخمسة ذاتها، بالترتيب المعتاد نفسه. المساعدة، عند منحها، تقترح فقط؛ وأنت تؤكّد." | — |
| S4 findings rail, clean claim | "No findings. The rules ran — receipts, duplicates, window, double-dip, tax — and found nothing to block or warn about." | "لا ملاحظات سياسة. جرت القواعد — الإيصالات والتكرارات والنافذة والازدواج والضريبة — ولم تجد ما يُعترض أو يُنبَّه عليه." | — |
| S4 findings rail, scan never run | "No findings yet — nothing has checked this claim. Submission runs the rules once; every item edit re-runs them." | "لا ملاحظات بعد — لم يفحص شيءٌ هذه المطالبة. التقديم يشغّل القواعد مرة؛ وكل تعديل بندٍ يعيد تشغيلها." | Run policy check |
| S4 filtered-empty | "No findings match this kind, severity, or state." | "لا ملاحظات تطابق هذا النوع أو الخطورة أو الحالة." | Clear filters |
| S5 rate tables first-run | "No rate tables yet. A rate table is your policy's numbers — tiers, daily amounts, kilometers — with an effective date and a source note." | "لا جداول معدلات بعد. جدول المعدلات هو أرقام سياستك — المستويات والمبالغ اليومية والكيلومترات — بتاريخ سريانٍ وملاحظة مصدر." | Create rate table / Use sample table |
| S5 policy packs first-run | "No policy packs yet. A pack binds one rate table to your rules: the receipt threshold, the submission window, and the approval matrix." | "لا حزم سياسة بعد. الحزمة تربط جدول معدلاتٍ واحدٍ بقواعدك: حدّ الإيصال، ونافذة التقديم، ومصفوفة الاعتماد." | Create policy pack / Use sample pack |
| S6 members first-run | "No members yet. Add names in both scripts and a role — the approval matrix points at these people." | "لا أعضاء بعد. أضف الأسماء بالخطّين ودوراً — مصفوفة الاعتماد تشير إلى هؤلاء." | Add member |
| S7 payouts, nothing approved | "Nothing awaits payout. Approved claims queue here, oldest first." | "لا شيء ينتظر الصرف. تصطفّ المطالبات المعتمدة هنا، الأقدم أولاً." | — |
| S7 exports empty | "No exports yet. A claim package carries the ledger, receipts, findings, approvals, and payout records — for the auditor, or for whatever posts the money." | "لا تصديرات بعد. تحمل حزمة المطالبة السجلّ والإيصالات والملاحظات والاعتمادات وسجلات الصرف — للمراجع، أو لما يسجّل المال من أنظمة." | Export claim package |
| No active policy pack | "Claims need an active policy pack — rates, thresholds, and who approves. The sample pack covers first use; replace it with your own before trusting a number." | "تحتاج المطالبات حزمة سياسة فعّالة — معدلات وحدوداً ومن يعتمد. الحزمة النموذجية تغطي البدء؛ استبدلها بخصوصك قبل الوثوق بأي رقم." | Open policy studio |
| Rate row not effective on item date | "No rate is in effect on 2026-06-30 — the nearest table starts 2026-07-01. Move the date, or wait for the table." | "لا معدل سارياً في 2026-06-30 — أقرب جدول يبدأ 2026-07-01. غيّر التاريخ، أو انتظر الجدول." | View rate table |

## B. Loading (P02/P12 — skeletons mirror queue/composer geometry per direction; honest determinate progress)

| State | English | Arabic |
|---|---|---|
| S1 queue skeleton | skeleton rows ×8 + "Loading your claims…" (SR) | صفوف هيكلية ×8 + "جارٍ تحميل مطالباتك…" |
| Composer boot | item-rail skeleton + reserved totals rail (no shimmer over the numbers region) | هيكلية شريط البنود + شريط الإجماليات المحجوز |
| Computation preview | (≤50ms — arithmetic, typically invisible) | (≤50 مللي ثانية — حسابٌ، غير مرئي عادةً) |
| Extraction run | "Reading the receipt — field 3 of 5." | "قراءة الإيصال — الحقل 3 من 5." |
| Extraction partial | "The draft stopped at the tax field — 2 fields kept, marked partial. Retry, or type the rest yourself." | "توقّف المسودة عند حقل الضريبة — حُفظ حقلان موسومان جزئيين. أعد المحاولة، أو اكتب الباقي بنفسك." |
| Submit check | "Checking against Expense Policy v3 — receipts, duplicates, window, routing." | "الفحص مقابل سياسة المصروفات الإصدار 3 — الإيصالات والتكرارات والنافذة والتوجيه." |
| Policy check re-run | "Re-running the rules…" | "إعادة تشغيل القواعد…" |
| Export job | "Exporting 12 of 31 claims — ledger, receipts, findings, approvals, payouts." | "تصدير 12 من 31 مطالبة — السجلّ والإيصالات والملاحظات والاعتمادات والصرف." |
| Rate table save | "Saving the rate table…" | "جارٍ حفظ جدول المعدلات…" |
| Autosave (composer, P10) | "Saving…" → "Saved" (fades after 3s) | "جارٍ الحفظ…" → "حُفظ" |
| Offline queue (P20) | "2 item edits waiting to sync — they send when you're back online." | "تعديلا بندٍ ينتظران المزامنة — يُرسلان عند عودة الاتصال." |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (empty submission) | "This claim holds 0 items — nothing to submit or route. Add at least one item." | "تحمل هذه المطالبة 0 بنود — لا شيء لتقديمه أو توجيهه. أضف بنداً واحداً على الأقل." |
| VALIDATION (malformed amount) | "Enter an amount like 240.00 — digits and a decimal point." | "أدخل مبلغاً مثل 240.00 — أرقامٌ وفاصلة عشرية." |
| VALIDATION (per-diem proration) | "A 4-day per-diem can prorate at most 2 travel days. Turn off the first-day or last-day flag." | "البدل اليومي لأربعة أيام يخصم يومي سفرٍ على الأكثر. أطفئ وسم اليوم الأول أو الأخير." |
| VALIDATION (gate refusal) | "Approval refused — 2 blocking findings stand. First: item 4, receipt required above SAR 75.00 and it has none." | "رُفض الاعتماد — قائمت ملاحظتان معترضتان. الأولى: البند 4، الإيصال مطلوب فوق 75.00 ريالٍ وليس له واحد." |
| VALIDATION (reject without comment) | "A rejection needs a reason — the claimant's fix starts from your words." | "يحتاج الرفض سبباً — تصحيح مقدّم الطلب يبدأ من كلماتك." |
| VALIDATION (matrix integrity) | "Two matrix rows share the threshold SAR 2,500.00 — give one of them a different ceiling." | "يتشارك صفّان في المصفوفة حدّ 2,500.00 ريال — أعطِ أحدهما سقفاً مختلفاً." |
| VALIDATION (amount above matrix authority) | "SAR 12,000.00 exceeds the matrix's highest authority, SAR 10,000.00 — finance must add a top row before this claim can route." | "يتجاوز 12,000.00 ريالٍ أعلى سلطةٍ في المصفوفة، 10,000.00 ريال — على المالية إضافة صفٍّ أعلى قبل أن تتوجه هذه المطالبة." |
| VALIDATION (payout correction without reason) | "A correction needs its reason — both records ship in the export, and the reason is what tells them apart." | "يحتاج التصحيح سببه — يُشحن السجلان في التصدير، والسبب هو ما يميّزهما." |
| VALIDATION (withdraw after first approval) | "Level 1 is already approved by Salem — withdrawal is closed. Ask for a rejection, or let the chain finish." | "اعتُمد المستوى 1 من سالم بالفعل — السحب مغلق. اطلب رفضاً، أو اترك السلسلة تكتمل." |
| NOT_FOUND (stale claim link) | "That claim is gone from this workspace. It may have been paid and archived while you were away." | "غابت تلك المطالبة عن مساحة العمل. ربما صُرفت وأُرشفت أثناء غيابك." |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the claim state it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — حالة المطالبة التي صدر عنها لم تتغيّر." |
| PERMISSION (extraction unbound) | "Receipt reading needs the extraction capability granted to this workspace. Grant it — or type the fields; the form always works." | "تحتاج قراءة الإيصالات منح قدرة الاستخراج لمساحة العمل هذه. امنحها — أو اكتب الحقول؛ النموذج يعمل دائماً." |
| PERMISSION (finance lens on non-finance seat) | "The finance queue belongs to finance seats. Ask the workspace owner for one — your own claims and steps are unaffected." | "طابور المالية يخصّ مقاعد المالية. اطلب واحداً من مالك مساحة العمل — مطالباتك وخطواتك غير متأثرة." |
| PERMISSION (decide outside your step) | "This step routes to Salem. Only the current assignee — or a finance admin — decides or delegates it." | "يُوجَّه هذا المستوى إلى سالم. المكلف الحالي فقط — أو مدير مالية — يعتمده أو يفوّضه." |
| PERMISSION (studio write on non-admin seat) | "Policy is finance-admin territory — rate tables and packs shape every claim in the workspace." | "السياسة منطقة مدير المالية — جداول المعدلات والحزم تصوغ كل مطالبةٍ في مساحة العمل." |
| CONFLICT (concurrent item edit) | "Huda edited this item while you did. Both versions are kept — choose what stays." | "حرّرت هدى هذا البند أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (step already decided) | "Salem approved this level a minute ago — the chain has moved on. The current state is shown." | "اعتمد سالم هذا المستوى قبل دقيقة — تحرّكت السلسلة. الحالة الحالية معروضة." |
| CONFLICT (second payout without correction) | "This claim is already paid — SAR 772.00 by bank transfer on 14 Sep. A change is a correction with a reason, not a second record." | "صُرفت هذه المطالبة بالفعل — 772.00 ريالاً بتحويلٍ بنكي في 14 سبتمبر. التغيير تصحيحٌ بسبب، لا سجلٌّ ثانٍ." |
| RATE_LIMIT (extraction window) | "The receipt-reading window is used for this cycle — it resets on 1 Nov. Typing the fields works now, as it always did." | "استُهلكت نافذة قراءة الإيصالات لهذه الدورة — تُصفَّر في 1 نوفمبر. كتابة الحقول تعمل الآن، كما عملت دائماً." |
| RATE_LIMIT (export window) | "The export window is used for this cycle — the next package frees on 1 Nov. Nothing about any claim changes." | "استُهلكت نافذة التصدير لهذه الدورة — تتحرر الحزمة التالية في 1 نوفمبر. لا شيء في أي مطالبة يتغيّر." |
| NETWORK (queue fetch) | "The claims list went stale — reconnecting. Every decision you made is safe." | "تقادمت قائمة المطالبات — تجري إعادة الاتصال. كل قرارٍ اتخذته آمن." |
| NETWORK (export partial) | "The package delivered 4 of 5 parts — the payout records didn't arrive. Retry just that part." | "سلّمت الحزمة 4 من 5 أجزاء — لم تصل سجلات الصرف. أعد محاولة ذلك الجزء وحده." |
| UNKNOWN | "Something failed on our side (ref ecf-corr-0001). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع ecf-corr-0001). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips + counts, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Item added (computation) | "Mileage added — 142 km at SAR 1.10 per km: SAR 156.20 computed." | "أُضيفت المسافة — 142 كم بمعدل 1.10 ريالٍ للكيلومتر: حُسب 156.20 ريالاً." |
| Per-diem computed | "Per-diem computed — 3 full days at SAR 525.00 plus the first day at 75%: SAR 1,968.75." | "حُسب البدل اليومي — 3 أيام كاملة بمعدل 525.00 ريالاً واليوم الأول بـ75%: 1,968.75 ريالاً." |
| Draft applied | "5 fields confirmed — 2 with your corrections. The item carries your numbers, not the machine's." | "جُمعت 5 حقول — اثنان بتصحيحاتك. يحمل البند أرقامك، لا أرقام الآلة." |
| Draft discarded | "Draft discarded — the receipt stays attached, the form stays yours." | "أُهملت المسودة — يبقى الإيصال مرفقاً، ويبقى النموذج لك." |
| Submitted | "Submitted — Expense Policy v3, route of 2 levels, Salem first. Findings: 0 blocking, 2 advisory." | "قُدّمت — سياسة المصروفات الإصدار 3، مسارٌ من مستويين، سالم أولاً. الملاحظات: 0 معترضة، و2 استشارية." |
| Chain advanced | "Level 1 approved by Salem — now with Faisal, level 2 of 2." | "اعتُمد المستوى 1 من سالم — الآن مع فيصل، المستوى 2 من 2." |
| Finding resolved by edit | "Resolved by edit — the rule re-ran and passed." | "حُلّت بالتحرير — أعادت القاعدة التشغيل ونجحت." |
| Override recorded | "Advisory overridden — your reason is in the ledger and every export, permanently." | "جُاوزت ملاحظة استشارية — سببك في السجلّ وفي كل تصدير، بشكل دائم." |
| False positive recorded | "Marked false-positive — the rule's inputs are attached for the policy owner to review." | "وُسمت إيجابيةً كاذبة — مدخلات القاعدة مرفقة ليراجعها مالك السياسة." |
| Query sent | "Query sent to Huda — she sees the item, the finding, and your question." | "أُرسل استفسار إلى هدى — ترى البند والملاحظة وسؤالك." |
| Query answered | "Huda answered — your decision is next; the thread is history either way." | "أجابت هدى — قرارك هو التالي؛ والسلسلة تاريخٌ في الحالين." |
| Delegated | "Level 2 delegated to Nasser — provenance recorded: from Faisal, at 09:40." | "فُوّض المستوى 2 إلى ناصر — المصدر مسجَّل: من فيصل، الساعة 09:40." |
| Claim rejected | "Rejected at level 1 — Salem's reason is the fix's starting point. Edit and resubmit when ready." | "رُفضت في المستوى 1 — سبب سالم نقطة انطلاق التصحيح. حرّر وأعد التقديم متى جهزت." |
| Resubmitted | "Resubmitted — the earlier rejection and reasons stay in the history, and the pack pins fresh." | "أُعيد التقديم — يبقى الرفض السابق وأسبابه في التاريخ، وتُثبَّت الحزمة من جديد." |
| Withdrawn | "Withdrawn to draft — no approvals had landed, so nothing was disturbed." | "سُحبت إلى المسودة — لم يهبط أي اعتماد، فلم يُزعج شيء." |
| Rate table saved | "Rate table saved at version 3 — claims computed earlier keep version 2; the next computation uses yours." | "حُفظ جدول المعدلات في الإصدار 3 — المطالبات المحسوبة سابقاً تحتفظ بالإصدار 2؛ والحساب التالي يستخدم جدولك." |
| Pack activated | "Expense Policy v3 is active — submitted claims keep their pins; new claims pin this version." | "سياسة المصروفات الإصدار 3 فعّالة — المطالبات المقدَّمة تحتفظ بتثبيتها؛ والمطالبات الجديدة تثبّت هذا الإصدار." |
| Payout recorded | "Paid SAR 772.00 — bank transfer, reference TRF-8841, on 14 Sep." | "صُرف 772.00 ريالاً — تحويلٌ بنكي، مرجع TRF-8841، في 14 سبتمبر." |
| Payout corrected | "Correction appended — the new record supersedes TRF-8841; both ship in the export with your reason." | "أُلحق تصحيح — ينسخ السجل الجديد TRF-8841؛ ويُشحنان معاً في التصدير بسببك." |
| Export ready | "Claim package ready — ledger, receipts, findings, approvals, payouts. Expires in 7 days; regenerable forever." | "حزمة المطالبة جاهزة — السجلّ والإيصالات والملاحظات والاعتمادات والصرف. تنتهي بعد 7 أيام؛ وتُعاد توليدها دائماً." |

## E. Signature moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| The Reimbursement Stamp (T2 signature, on payout) | "The claim is closed: SAR 772.00 out by bank transfer, evidence in one place, nothing posted anywhere else." | "أُغلقت المطالبة: 772.00 ريالاً صُرفت بتحويلٍ بنكي، والدليل في مكانٍ واحد، ولا شيء سُجّل في أي مكانٍ آخر." |
| Gate refusal (assertive) | "Not yet. Item 4 has no receipt above the SAR 75.00 line, and item 5 repeats it. Fix those two and the gate opens." | "ليس بعد. البند 4 بلا إيصالٍ فوق حدّ 75.00 ريالاً، والبند 5 يكرره. أصلح هذين تُفتح البوابة." |
| Computation first render (the parity moment) | "There it is: 142 km × SAR 1.10 = SAR 156.20, rate table cited, date checked. That is the whole argument." | "ها هو: 142 كم × 1.10 ريالاً = 156.20 ريالاً، بجدول معدلاتٍ موثّقٍ وتاريخٍ مفحوص. هذه هي الحجة كلها." |
| Draft confirmation (the trust moment) | "The machine proposed 460.00 — you confirmed 460.00. The item records both, and only yours counts." | "اقترحت الآلة 460.00 — وأكّدتَ 460.00. يسجّل البندان كليهما، ولا يُحتسب إلا رقمك." |
| Cross-claim duplicate surfaced | "This receipt number also appears on CLM-0132 — Nasser's claim, paid 36 days ago. Finance decides what it means." | "يظهر رقم الإيصال هذا أيضاً في CLM-0132 — مطالبة ناصر، المصروفة قبل 36 يوماً. المالية تقرر ما يعنيه." |
| Clean claim | "Zero findings — the rules read every item and wrote down that they found nothing." | "صفر ملاحظات — قرأت القواعد كل بندٍ وكتبت أنها لم تجد شيئاً." |
| Sample claim badge | "Sample claim — one planted missing receipt, one gate that refuses. Clear it whenever real work arrives." | "مطالبة نموذجية — إيصالٌ مفقود مزروع، وبوابةٌ ترفض. امسحها متى وصل العمل الحقيقي." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Arabic receipt inside English chrome | "The Arabic receipt renders right-to-left inside the English workspace — its direction follows the paper, never the chrome." | "يُعرض الإيصال العربي من اليمين إلى اليسار داخل مساحة عملٍ إنجليزية — اتجاهه يتبع الورقة، لا الهيكل أبداً." |
| Arabic-Indic digits on a receipt | "The receipt says ٤٦٠٫٠٠ — the record says 460.00. The raw text is kept as evidence; the system speaks Western, per the ledger." | "يقول الإيصال ٤٦٠٫٠٠ — ويقول السجلّ 460.00. يُحفظ النص الخام دليلاً؛ ويتحدث النظام بالأرقام الغربية، وفق الدفتر." |
| Claim reference in Arabic prose | "CLM-0141 keeps its Latin shape and its left-to-right reading inside Arabic sentences — isolated, never shuffled." | "يحتفظ CLM-0141 بشكلٍ لاتينيٍّ وقراءته من اليسار إلى اليمين داخل الجمل العربية — معزولاً، ولا يُخلط أبداً." |
| Bilingual vendor on one row | "One vendor, two names: مؤسسة النور للتجهيزات المكتبية and its English line — the row renders each at its own direction." | "موردٌ واحد، واسمان: مؤسسة النور للتجهيزات المكتبية وسطره الإنجليزي — يعرض الصف كل اسمٍ باتجاهه." |
