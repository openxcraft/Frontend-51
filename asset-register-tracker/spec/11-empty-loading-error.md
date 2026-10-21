# 11 — Empty / Loading / Error: asset-register-tracker (Copy Matrix)

SME-J pass · Every string WRITTEN verbatim, bilingual EN + AR · voice = registrar-plain (02: the register states what it records and what it does not) · Arabic is فصحى بيضاء utility register · **numerals Western in both locales per ledger row (data surface — Arabic-Indic digits never appear in system strings)** · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked (one concept, one term): الأصل=asset · الفئة=category · الموقع=location · تسمية QR=QR label · دفعة التسميات=label batch · العهدة=custody · سلسلة العهدة=custody chain · حدث العهدة=custody event · الإسناد=assign · الاسترجاع=return · التحويل=transfer · المشاهدة=sighting · التصحيح=correction · التوقيع=signature · سحب من الخدمة=retire · سجل النشاط=activity log.

## A. Empty states

| State | English | Arabic | Action |
|---|---|---|---|
| S1 registry first-run | "No assets yet. Three moves start a register: one category, one asset, one label batch — or open the sample asset and scan its sheet first." | "لا أصول بعد. ثلاث حركات تفتح السجلّ: فئة واحدة، وأصل واحد، ودفعة تسميات — أو افتح الأصل النموذجي وامسح ورقته أولاً." | New asset / Open sample asset |
| S1 filtered-empty | "No assets match these filters." | "لا أصول تطابق هذه المرشّحات." | Clear filters |
| S1 no-access | "This register belongs to another workspace." | "هذا السجلّ يخصّ مساحة عمل أخرى." | Switch workspace |
| S1 retired-filter empty | "No retired assets in this scope. Retired records stay readable — this filter is how you reach them." | "لا أصول مسحوبة من الخدمة في هذا النطاق. سجلات السحب تبقى مقروءة — هذا المرشّح طريقك إليها." | Clear filters |
| S1 draft-only view | "6 assets are registered but not yet labeled. Request a batch to print their labels." | "6 أصول مسجّلة بلا تسميات بعد. اطلب دفعة لطباعة تسمياتها." | Request label batch |
| S2 custody timeline (no events) | "No custody events yet. The first hand-off opens the chain." | "لا أحداث عهدة بعد. أول تسليم يفتح السلسلة." | Record hand-off |
| S3 labels first-run | "No label batches yet. Batches print on standard A4 label stock — no special hardware." | "لا دفعات تسميات بعد. تُطبع الدفعات على ورق تسميات A4 القياسي — بلا عتاد خاص." | Request first batch |
| S3 batch pending-apply | "57 of 60 labels applied. The 3 pending keep their places — confirm them as you stick them on." | "طُبّقت 57 من 60 تسمية. الثلاث المعلقة تحتفظ بأماكنها — أكّدها أثناء لصقها." | Open apply checklist |
| S4 people first-run | "No people yet. Add names as you hand off — the receiver's signature needs a name to sign." | "لا أشخاص بعد. أضف الأسماء أثناء التسليم — توقيع المستلم يحتاج اسماً يوقّع به." | Add person |
| S4 people filtered-empty (holding-only) | "Nobody currently holds anything outside the filter. Open items appear under return-pending." | "لا أحد يحمل حالياً شيئاً خارج المرشّح. العناصر المفتوحة تظهر ضمن الاسترجاع المتأخر." | Clear filters |
| S5 locations first-run | "No locations yet. A two-level tree — building, then rooms — is enough to start." | "لا مواقع بعد. شجرة من مستويين — مبنى ثم غرف — تكفي للبداية." | Add location |
| S5 categories first-run | "No categories yet. Start with what you can count on one hand." | "لا فئات بعد. ابدأ بما يُحصى على كفّ واحدة." | Add category |
| S6 activity first-run | "Nothing recorded yet. Every change you make lands here with your name on it." | "لا شيء مسجّل بعد. كل تغيير تجريه يصل هنا باسمك عليه." | — |
| S7 jobs empty | "Nothing running. Label batches and register exports appear here while they work." | "لا مهام قيد التنفيذ. دفعات التسميات وتصديرات السجلّ تظهر هنا أثناء عملها." | — |
| S9 export empty scope | "This scope matches zero assets — nothing to export. Widen the filter or clear it." | "هذا النطاق يطابق صفر أصل — لا شيء للتصدير. وسّع المرشّح أو امسحه." | Clear scope |
| M1 scan unknown code | "This code isn't in this register (…{last4}). Re-scan, or search by tag on the registry." | "هذا الرمز ليس في هذا السجلّ (…{last4}). أعد المسح، أو ابحث بالوسم في السجلّ." | Re-scan / Search by tag |

## B. Loading (P02/P12 — skeletons mirror geometry per direction; honest unit progress)

| State | English | Arabic |
|---|---|---|
| S1 list skeleton | skeleton rows ×8 + "Loading your register…" (SR) | صفوف هيكلية ×8 + "جارٍ تحميل سجلّك…" |
| Label batch job (determinate) | "Generating labels — 23 of 60." | "توليد التسميات — 23 من 60." |
| Label sheet render | "Preparing the print sheet — 60 labels, 25 mm, A4 65-up." | "تحضير ورقة الطباعة — 60 تسمية، 25 مم، A4 بـ65 خانة." |
| Export job (stages) | "Exporting — 312 assets, custody history included." | "التصدير — 312 أصلاً، مع سلاسل العهدة." |
| Timeline page | event skeletons ×6 + "Opening the custody chain…" | أحداث هيكلية ×6 + "فتح سلسلة العهدة…" |
| Scan decode | "Scanning — hold the code steady." | "المسح جارٍ — ثبّت الرمز." |
| Walk mode progress | "Sighted AST-0107 — 14 of 31 expected." | "شوهد AST-0107 — 14 من 31 المتوقعة." |
| Offline queue (P20) | "1 hand-off waiting to sync — it sends when you're back online." | "تسليم واحد ينتظر المزامنة — يُرسل عند عودة الاتصال." |
| S7 job row | determinate: "23 of 60"; indeterminate: "Working — no estimate yet" | "23 من 60"؛ "قيد العمل — لا تقدير بعد" |

## C. Errors (exact 7-class taxonomy; every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (label double-request) | "AST-0107 already carries a live label. Report it damaged or missing first — then request its replacement." | "يحمل AST-0107 تسميةً فعّالة. أبلغ عن تلفها أو فقدانها أولاً — ثم اطلب بديلها." |
| VALIDATION (apply on wrong state) | "That label is already applied — its batch checklist is up to date. Reprints go through the replacement path." | "هذه التسمية مطبّقة أصلاً — قائمة دفعتها محدّثة. إعادات الطباعة تمرّ بمسار البديل." |
| VALIDATION (signature shape) | "The hand-off needs the receiver's signature — a typed name is enough. Add it and record." | "يحتاج التسليم توقيع المستلم — يكفي اسم مطبوع. أضفه وسجّل." |
| VALIDATION (retirement with holder) | "AST-0231 can't retire — Nour Al-Qahtani still holds it, 9 days past due. Take the return or record the write-off path first." | "لا يمكن سحب AST-0231 — ما زالت نورة القحطاني تحمله، متأخراً 9 أيام. استلمه أو سجّل مسار الشطب أولاً." |
| VALIDATION (export empty scope) | "Nothing matches this export scope — zero assets. Widen the filter and retry." | "لا شيء يطابق نطاق التصدير — صفر أصل. وسّع المرشّح وأعد المحاولة." |
| NOT_FOUND (stale asset link) | "That asset is gone from this workspace — it may have been retired while you were away. Retired records stay readable under the retired filter." | "ذلك الأصل غاب عن مساحة العمل — ربما سُحب من الخدمة أثناء غيابك. سجلات السحب تبقى مقروءة تحت مرشّح المسحوب." |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the register it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — السجلّ الذي صدر عنه لم يتغيّر." |
| NOT_FOUND (unknown scan) | "This code isn't in this register (…7F2C). Re-scan, or search by tag on the registry." | "هذا الرمز ليس في هذا السجلّ (…7F2C). أعد المسح، أو ابحث بالوسم في السجلّ." |
| PERMISSION (non-member scan action) | "This register records actions by its members only. Your link reads the asset — contact the register owner to record a hand-off." | "يسجّل هذا السجلّ تصرّفات أعضائه فقط. رابطك يقرأ الأصل — تواصل مع مالك السجلّ لتسليمٍ مسجّل." |
| PERMISSION (viewer role) | "Your seat reads the register but doesn't change it. Ask the workspace owner for an editor seat." | "مقعدك يقرأ السجلّ ولا يغيّره. اطلب من مالك مساحة العمل مقعداً محرّراً." |
| PERMISSION (retired freeze) | "Retired registers are frozen — corrections live on the activity log, not on the asset." | "السجلات المسحوبة مجمّدة — التصحيحات تحيا في سجلّ النشاط لا في الأصل." |
| CONFLICT (concurrent asset edit) | "Reem saved a change to this asset while you did. Both versions are kept — choose what stays." | "حفظت ريم تغييراً في هذا الأصل أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (person creation collision) | "Two names arrived together — both kept. Pick one person and archive the other's record." | "وصل اسمان معاً — حُفظ الاثنان. اختر شخصاً وأرشف سجلّ الآخر." |
| RATE_LIMIT (scan throttling) | "Too many lookups in a short window — the register catches its breath for a moment. Try again in a few seconds." | "استعلامات كثيرة في نافذة قصيرة — يلتقط السجلّ أنفاسه لحظة. أعد المحاولة بعد ثوانٍ." |
| RATE_LIMIT (quota) | "This month's label-and-export window is used. Registering, hand-offs, and timelines keep working — batches and exports resume 1 Nov." | "استُهلكت نافذة التسميات والتصدير لهذا الشهر. التسجيل والتسليم والسلاسل تعمل — تستأنف الدفعات والتصديرات في 1 نوفمبر." |
| NETWORK (list fetch) | "The register went stale — reconnecting. Every recorded hand-off is safe." | "تقادم السجلّ — تجري إعادة الاتصال. كل تسليمٍ مسجّل آمن." |
| NETWORK (export failure) | "The export didn't deliver — the job failed after packing. Retry it; the register is unchanged." | "لم يسلّم التصدير — فشلت المهمة بعد التجميع. أعد المحاولة؛ السجلّ لم يتغيّر." |
| NETWORK (offline, P20) | "You're offline. Hand-offs queue on this phone and sync when you're back." | "أنت غير متصل. تصطف التسليمات على هذا الهاتف وتتزامن عند عودة الاتصال." |
| UNKNOWN | "Something failed on our side (ref ar-corr-0007). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع ar-corr-0007). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips + one line of arithmetic — no confetti)

| Moment | English | Arabic |
|---|---|---|
| Asset registered | "AST-0313 registered — draft until its label goes on." | "سُجّل AST-0313 — مسودة حتى تلتصق تسميته." |
| Label applied | "AST-0107's label is on — the register lists it active." | "تسمية AST-0107 في مكانها — يُدرجه السجلّ فعّالاً." |
| Batch ready | "Batch ready — 60 labels, 25 mm, A4 65-up. Print it, then confirm as you apply." | "الدفعة جاهزة — 60 تسمية، 25 مم، A4 بـ65 خانة. اطبعها، ثم أكّد أثناء اللصق." |
| Hand-off recorded | "Hand-off recorded — AST-0107 to Abdulrahman Al-Shehri, signed by typed name." | "سُجّل التسليم — AST-0107 إلى عبدالرحمن الشهري، توقيعٌ بالاسم المطبوع." |
| Return recorded | "Returned — AST-0199 back in stock at Storeroom 3-B, condition noted: damaged." | "استُرجع — AST-0199 إلى مخزن 3-ب، والحالة مدوّنة: متضرر." |
| Transfer recorded | "Transfer recorded — AST-0107 from Priya Nair to Omar Haddad, drawn signature witnessed by name." | "سُجّل التحويل — AST-0107 من بريا ناير إلى عمر حداد، توقيعٌ مرسوم بشاهدٍ مسمّى." |
| Return-pending view | "27 assets are past their return date — the People view lists who holds each." | "27 أصلاً تجاوزت موعد استرجاعها — عرض الأشخاص يعدّد حامل كلٍّ منها." |
| Retirement recorded | "AST-0301 retired — destroyed, certificate SHRD-2026-0117. The record is frozen, not deleted." | "سُحب AST-0301 من الخدمة — إتلاف، شهادة SHRD-2026-0117. السجلّ مجمّد لا محذوف." |
| Export ready | "Export ready — 312 assets, custody history included, expires in 7 days." | "التصدير جاهز — 312 أصلاً مع سلاسل العهدة، ينتهي بعد 7 أيام." |
| Undo window (P03, inline edit) | "Location updated — Undo (7s)" | "حُدّث الموقع — تراجع (7 ثوانٍ)" |
| Autosave (P10) | "Saving…" → "Saved" (fades) | "جارٍ الحفظ…" → "حُفظ" |

## E. Custody & label moments (product-signature copy)

| Moment | English | Arabic |
|---|---|---|
| Correction recorded | "Correction appended — event 4 of AST-0107 stays on the chain, marked corrected. The register never rewrites history." | "أُلحق تصحيح — يبقى الحدث 4 من AST-0107 على السلسلة موسوماً بالمصحّح. السجلّ لا يعيد كتابة التاريخ أبداً." |
| Sighting recorded | "Sighted — AST-0044 at Service vehicle 1, condition good. Location updated to where you found it." | "شوهد — AST-0044 في مركبة الخدمة 1، الحالة جيدة. حُدّث الموقع إلى حيث وجدته." |
| Walk reconciliation | "Walk done at Storeroom 3-B — 31 expected, 28 sighted. 3 unscanned listed, 1 scanned not listed." | "اكتمل الجول في مخزن 3-ب — 31 متوقعاً، 28 مشاهدة. 3 غير ممسوحة مدرجة، و1 ممسوح بلا سجلّ." |
| Label reported damaged | "AST-0251's label reported damaged — its history stays. Request the replacement when ready." | "أُبلغ عن تلف تسمية AST-0251 — يبقى تاريخها. اطلب البديل عند الاستعداد." |
| Signature declined | "No signature, no event — the hand-off wasn't recorded. Nothing changed." | "لا توقيع، لا حدث — لم يُسجّل التسليم. لم يتغيّر شيء." |
| Offline queue committed | "Synced — 3 queued hand-offs recorded with their original times." | "تمت المزامنة — سُجّلت 3 تسليمات مصطفة بأوقاتها الأصلية." |
| Inactive person in history | "Sara Mahfouz left the firm — her name stays on every event she signed." | "تركت سارة محفوظ المؤسسة — يبقى اسمها على كل حدثٍ وقّعته." |
| Sample asset badge | "Sample asset — full lifecycle, synthetic history. Clear it when real work arrives." | "أصل نموذجي — دورة كاملة وتاريخٌ تركيبي. امسحه متى وصل العمل الحقيقي." |
| Non-AI plainness note (settings) | "The register records what happened — nothing else. No AI, no scoring, no suggestions." | "يسجّل السجلّ ما حدث — ولا شيء غيره. لا ذكاءً اصطناعياً، ولا تقييماً، ولا اقتراحات." |

## F. Bidi/mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin name in ar chrome | "Daniel Whitfield — Latin-script name inside the Arabic register. Rendered isolated; search follows Arabic normalization on the Arabic side." | "Daniel Whitfield — اسمٌ بخط لاتيني داخل السجلّ العربي. يُعرض معزولاً؛ ويتبع البحث تطبيع العربية في الجهة العربية." |
| Arabic name in en chrome | "'عبدالرحمن الشهري' renders right-to-left inside the English register — isolated, never force-flipped." | "يُعرض 'عبدالرحمن الشهري' من اليمين إلى اليسار داخل السجلّ الإنجليزي — معزولاً، ولا يُقلب قسراً أبداً." |
| Tag inside Arabic sentence | "AST-0107 is a Latin-digit token — it keeps its order inside Arabic sentences, isolated end to end." | "AST-0107 رمزٌ بأرقام لاتينية — يحافظ على ترتيبه داخل الجمل العربية، معزولاً من الطرفين." |
| Dual-script label cell | "Every label carries both scripts: the tag in Latin digits, the name in Arabic and English — one label, two readers." | "تحمل كل تسمية الخطين: الوسم بأرقام لاتينية، والاسم بالعربية والإنجليزية — تسميةٌ واحدة لقارئَين." |
