# 11 — Empty / Loading / Error: contract-lifecycle-manager (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN+AR (bilingual-en product: EN-primary chrome, Arabic full citizen — both matrices ship because the workspace flips) · voice = registrar-plain (02) · Arabic is فصحى بيضاء utility register · numerals Western everywhere (ledger row — register data surface; never mixed systems mid-sentence) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked: العقد=contract · الطرف المقابل=counterparty · الالتزام=obligation · التذكير=reminder · نافذة الإخطار=notice window · إشعار عدم التجديد=non-renewal notice · منفَّذ=executed · السجل=register · التصدير=export.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 vault first-run | "The vault starts with one contract. Register the twenty that matter most — or open the sample and watch the reminders compute." | "يبدأ السجل بعقدٍ واحد. سجّل العشرين الأهم — أو افتح العيّنة وشاهد التذكيرات تُحسب." | New contract / Open sample |
| S1 filtered-empty | "No contracts match these filters." | "لا عقود تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "These contracts belong to another workspace." | "هذه العقود تخصّ مساحة عمل أخرى." | Switch workspace |
| S1 archived-excluded view | "Archived contracts stay out of this view and stay in the register — include them in an export on request." | "العقود المؤرشفة خارج هذا العرض وباقية في السجل — أدرجها في التصدير عند الطلب." | Show archived |
| S3 counterparty search empty | "No counterparty by that name yet. Create it with the names exactly as licensed." | "لا طرف مقابل بهذا الاسم بعد. أنشئه بالأسماء كما هي في السجل التجاري." | Create counterparty |
| S4 zone empty — overdue | "No overdue obligations. The earliest due date is 15 Nov 2026." | "لا التزامات متأخرة. أقرب تاريخ استحقاق 15 نوفمبر 2026." | View approaching |
| S4 zone empty — imminent | "Nothing due in the next 7 days." | "لا شيء مستحق في السبعة أيام القادمة." | View approaching |
| S4 all-clean (no open obligations) | "Every obligation on the books is completed or closed. The schedule is quiet." | "كل الالتزامات المسجلة مكتملة أو مقفلة. الجدول هادئ." | View completed |
| S2 obligation ledger empty (active contract) | "No obligations recorded for this contract. Add the ones the parties owe — payments, certificates, notices." | "لا التزامات مسجلة لهذا العقد. أضف ما يدين به الطرفان — مدفوعات وشهدات وإشعارات." | Add obligation |
| S2 obligation ledger dormant (pre-execution) | "Obligations can be recorded now; reminders start when the contract is executed." | "يمكن تسجيل الالتزامات الآن؛ وتبدأ التذكيرات عند تنفيذ العقد." | Add obligation |
| S7 activity empty | "Nothing has happened in this filter yet. Every mutation lands here with actor and timestamp." | "لم يقع شيء في هذا المرشّح بعد. كل تغيير يُدوَّن هنا مع الفاعل والوقت." | Clear filters |
| S8 jobs empty | "Nothing running. Extractions and exports appear here while they work." | "لا مهام قيد التنفيذ. تستخرجاتُ النصوص والتصديرات تظهر هنا أثناء عملها." | — |
| S6 counterparties first-run | "No counterparties yet. They're created with the first contract — or ahead of it." | "لا أطراف مقابلة بعد. تُنشأ مع أول عقد — أو قبله." | Create counterparty |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest progress)

| State | English | Arabic |
|---|---|---|
| S1 register skeleton | skeleton rows ×8 + "Loading your register…" (SR) | صفوف هيكلية ×8 + "جارٍ تحميل سجلك…" |
| S1 digest counting | "Counting renewals and overdues…" | "جارٍ إحصاء التجديدات والمتأخرات…" |
| Extraction job (determinate) | "Reading the agreement — page 14 of 22." | "قراءة الاتفاقية — الصفحة 14 من 22." |
| Extraction suggestions resolving | "Preparing 7 proposals — nothing applies until you accept it." | "تجهيز 7 مقترحات — لا شيء يسري قبل قبولك." |
| Export job | "Exporting the register — contracts scope, obligations appendix on." | "تصدير السجل — نطاق العقود مع ملحق الالتزامات." |
| Schedule recompute | "Updating the reminder schedule…" | "تحديث جدول التذكيرات…" |
| Autosave (P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |
| S8 job row | determinate: "14 of 22 pages"; indeterminate: "Working — no estimate yet" | "14 من 22 صفحة" ؛ "قيد العمل — لا تقدير بعد" |
| Document download | "Preparing the document link…" | "تجهيز رابط المستند…" |

## C. Errors (7 classes; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (metadata rule) | "Auto-renew needs a notice window in days — 60 is the common default. Add one to save." | "التجديد التلقائي يحتاج نافذة إخطار بالأيام — 60 هو الافتراضي الشائع. أضفها للحفظ." |
| VALIDATION (date logic) | "The new term can't end before the current term starts. The current term began 01 Jan 2025." | "لا يمكن أن تنتهي المدة الجديدة قبل بداية المدة الحالية. بدأت المدة الحالية في 1 يناير 2025." |
| VALIDATION (review gate) | "Execution needs an approved review first. Request review, or record it after approval." | "التنفيذ يحتاج مراجعة معتمدة أولاً. اطلب المراجعة، أو سجّله بعد الاعتماد." |
| VALIDATION (upload limit) | "That file is 68MB — the limit is 40MB. Split it or upload the executed copy separately." | "الملف 68 ميغابايت — والحد 40 ميغابايت. قسّمه أو ارفع النسخة المنفَّذة على حدة." |
| NOT_FOUND (stale link) | "That contract is gone from this workspace. It may have been archived while you were away." | "ذلك العقد غاب عن مساحة العمل. ربما أُرشف أثناء غيابك." → العودة إلى السجل |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the register it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — السجل الذي صدر عنه لم يتغيّر." |
| PERMISSION (viewer role) | "Your seat reads the register and completes obligations you own. Ask the workspace owner for an editor seat to change contract records." | "مقعدك يقرأ السجل ويُكمل التزاماتك. اطلب من مالك مساحة العمل مقعداً محرّراً لتغيير سجلات العقود." |
| PERMISSION (capability unconsented) | "Extraction needs the document-reading capability granted to this workspace. Grant it — or fill the metadata by hand; hand entry always works." | "يحتاج الاستخراج منح قدرة قراءة المستندات لمساحة العمل هذه. امنحها — أو أدخل البيانات يدوياً؛ الإدخال اليدوي يعمل دائماً." |
| CONFLICT (concurrent edit) | "Omar saved a change to this record while you did. Both versions are kept — choose what stays." | "حفظ عمر تغييراً في هذا السجل أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| RATE_LIMIT (extraction quota) | "This month's extraction window is used. Manual entry keeps working without limits — extractions resume 01 Dec." | "استُهلكت نافذة الاستخراج لهذا الشهر. الإدخال اليدوي يعمل بلا حدود — ويستأنف الاستخراج في 1 ديسمبر." |
| RATE_LIMIT (rung 2 notice) | "Running near the extraction limit — proposals will thin out until 01 Dec." | "اقترب الاستخدام من حدّ الاستخراج — ستقلّ المقترحات حتى 1 ديسمبر." |
| NETWORK (list fetch) | "The register went stale — reconnecting. Every completed obligation is safe." | "تقادم السجل — تجري إعادة الاتصال. كل التزام مكتمل آمن." |
| NETWORK (export partial) | "The bundle delivered 1 of 2 scopes — contracts arrived, the obligations appendix didn't. Retry just the appendix." | "سلّمت الحزمة 1 من 2 نطاقين — وصلت العقود ولم يصل ملحق الالتزامات. أعد محاولة الملحق وحده." |
| UNKNOWN | "Something failed on our side (ref clm-corr-0007). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع clm-corr-0007). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Contract registered | "Contract registered — bilingual titles, term to 31 Jan 2027, 60-day notice window." | "سُجّل العقد — عنوانان بلغتين، ومدة حتى 31 يناير 2027، ونافذة إخطار 60 يوماً." |
| Obligation added | "Obligation recorded — they owe the certificate, due 15 Oct 2026. First reminder 15 Sep." | "سُجّل الالتزام — عليهم الشهادة، تستحق في 15 أكتوبر 2026. أول تذكير في 15 سبتمبر." |
| Schedule computed | "Reminder schedule ready — first-lead 30 days, final-lead 7 days before every due date." | "جدول التذكيرات جاهز — تذكير أول بعد 30 يوماً وتذكير أخير قبل 7 أيام من كل استحقاق." |
| Obligation completed | "Completed — evidence recorded, 04 Nov 2026, by Nadia. The overdue zone cleared." | "اكتمل — سُجّل الدليل في 4 نوفمبر 2026 بواسطة نادية. انقشعت منطقة التأخير." |
| Execution recorded (the seal moment) | "Executed — 04 Nov 2026, manual channel. 4 obligations scheduled." | "منفَّذ — 4 نوفمبر 2026، عبر القناة اليدوية. 4 التزامات مجدولة." |
| Review approved | "Approved for execution — Layla, 04 Nov 2026." | "اعتُمد للتنفيذ — ليلى، 4 نوفمبر 2026." |
| Renewal term recorded | "Term recorded — now to 31 Jan 2028. Obligations carried forward." | "سُجّلت المدة — حتى 31 يناير 2028. والالتزامات منقولة." |
| Termination recorded | "Terminated — effective 30 Jun 2026. 2 open obligations closed with it, each listed." | "أُنهي — سارٍ من 30 يونيو 2026. قُفل معه التزامان مفتوحان، وكلاهما مدرج." |
| Register exported | "Register exported — contracts scope, obligations appendix, expires in 7 days." | "صُدِّر السجل — نطاق العقود مع ملحق الالتزامات، تنتهي بعد 7 أيام." |
| Counterparty saved | "Counterparty saved — both licensed names recorded." | "حُفظ الطرف المقابل — الاسمان المرخّصان مسجّلان." |
| Undo window (P03, archive) | "Contract archived — Undo (7s)" | "أُرشف العقد — تراجع (7 ثوانٍ)" |

## E. Assist & reminder moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Suggestion presented (P15 draft) | "Proposal: they owe an insurance certificate, due 15 Oct 2026 — confidence 0.86. Accept, edit, or dismiss." | "مقترح: عليهم شهادة تأمين تستحق في 15 أكتوبر 2026 — الثقة 0.86. اقبل أو حرّر أو ارفض." |
| False-positive dismissal (seeded fixture) | "Dismissed — the proposal said 90 days; the agreement says 30. Your reading stands." | "مُرفض — قال المقترح 90 يوماً؛ والاتفاقية تقول 30. قراءتك قائمة." |
| Edit-then-accept provenance | "Accepted with your edits — the record keeps 'assist-proposed, human-edited' forever." | "قُبل بتعديلاتك — يحتفظ السجل بعبارة «مقترح آلياً، محرّر بشرياً» دائماً." |
| Extraction coverage honesty | "Proposals cover pages 1–22. Obligations inside schedules may be missing — the checklist is the backstop." | "تغطي المقترحات الصفحات 1–22. الالتزامات داخل الجداول قد تكون ناقصة — والقائمة المرجعية هي الضمانة." |
| Degraded run (rung 4) | "The extraction capability is off this run. Fill the metadata by hand — the ten-field order below." | "قدرة الاستخراج متوقفة في هذا التشغيل. أدخل البيانات يدوياً — ترتيب الحقول العشرة أدناه." |
| Rung 2 notice | "Extraction is lighter this cycle — 5 proposals instead of 7, high confidence only." | "الاستخراج أخفّ في هذه الدورة — 5 مقترحات بدلاً من 7، بثقة عالية فقط." |
| Quota warning (80%) | "Extraction window at 17 of 20 — manual entry stays unlimited either way." | "نافذة الاستخراج عند 17 من 20 — الإدخال اليدوي يبقى بلا حدود في الحالين." |
| Renewal window opens | "Notice window open — give notice by 02 Dec 2026 or it renews to 31 Jan 2027." | "نافذة الإخطار مفتوحة — أشعِر قبل 2 ديسمبر 2026 أو يتجدد حتى 31 يناير 2027." |
| Renewal window missed (honest, no blame) | "The notice window closed 3 days ago — the term renews on the current terms. Next window opens after renewal." | "أُغلقت نافذة الإخطار قبل 3 أيام — تتجدد المدة بالشروط الحالية. تُفتح النافذة التالية بعد التجديد." |
| Expiry mode (auto-renew off) | "No auto-renewal — this agreement ends 15 Dec 2026. Plan the re-tender or extension." | "لا تجديد تلقائي — تنتهي هذه الاتفاقية في 15 ديسمبر 2026. خطّط لإعادة الطرح أو التمديد." |
| Derived expired state | "Term ended 30 Jun 2026 with the record still active — record the termination or the renewal that happened." | "انتهت المدة في 30 يونيو 2026 والسجل ما يزال نشطاً — سجّل الإنهاء أو التجديد الذي وقع." |
| Dormant obligation | "Scheduled on execution — the workshop obligation starts when the contract is executed." | "مجدول عند التنفيذ — يبدأ التزام الورشة عند تنفيذ العقد." |
| Overdue digest | "3 obligations are overdue — the earliest 20 days (product-liability certificate, Al-Wafa)." | "3 التزامات متأخرة — أقدمها 20 يوماً (شهادة مسؤولية المنتجات، الوفاء)." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Arabic title in EN chrome | "عقد إيجار المكتب — شركة ريم العقارية renders right-to-left inside the English register — isolated, never force-flipped." | "يُعرض «Office Lease — Reem Properties LLC» من اليسار إلى اليمين داخل السجل العربي — معزولاً، ولا يُقلب قسراً أبداً." |
| Registry id in AR chrome | "Registry 7845123 stays Latin-digit in both directions — identifiers never change scripts." | "يبقى السجل 7845123 بأرقام لاتينية في الاتجاهين — المعرّفات لا تغيّر كتابتها." |
| Mixed-script document title | "Bilingual document — both titles recorded, one per field. The panel never merges them." | "مستند ثنائي اللغة — عنوانان مسجّلان، واحد في كل حقل. اللوحة لا تدمجهما أبداً." |
