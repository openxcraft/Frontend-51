# 11 — Empty / Loading / Error: legal-case-tracker (Copy Matrix)

SME-J pass · every string verbatim, bilingual EN+AR · voice = the courtroom registrar (02: plain, unhurried, names actors and facts, never dramatizes; no blame in errors — copy-voice §1.6) · Arabic is فصحى بيضاء, unvocalized · **numerals Western everywhere per ledger row** (docket data surface — day-counts, case numbers, seq, dates never mix systems mid-sentence, copy-voice §1.7) · every empty carries one action (P01) · every error follows [what]+[why]+[next] (copy-voice §1.4) · terminology locked (02): القضية=matter · الجلسة=hearing · الموعد النهائي=deadline · التسلسل الزمني=timeline · المستند=document · إصدار المستند=document version · سلسلة العهدة=custody chain · نتيجة الجلسة=hearing outcome · إقفال القضية=closure · قاعدة المواعيد=deadline rule · لوحة الجلسات=hearing board · تسجيل خروج=check-out · تسجيل دخول=check-in · تقديم في الجلسة=presented · استرجاع=returned · ختم=seal · تحقق=verify · تصدير=export · سجل النشاط=activity log. Seed-string consistency: fixture names reuse 07c verbatim (Mizan Advocates, rule names, courts, judges).

## A. Empty states (P01 — four empties kept distinct)

| State | English | Arabic | Action |
|---|---|---|---|
| S1 first-run (no matters) | "No matters yet. Create the first one with its client and court — or open the sample and watch the gavel settle on an adjourned hearing." | "لا قضايا بعد. أنشئ الأولى مع عميلها ومحكمتها — أو افتح العيّنة وشاهد المطرقة تقرّ على جلسة مؤجلة." | Create matter / Open sample matter |
| S1 filtered-empty | "No hearings or matters match these filters." | "لا جلسات ولا قضايا تطابق هذه المرشّحات." | Clear filters |
| S1 no-access (viewer, no attached matters) | "No matters are shared with your seat yet. When the firm attaches you to a case, its timeline appears here." | "لا قضايا مشتركة مع مقعدك بعد. حين تربطك المكتبة بقضية، يظهر تسلسلها الزمني هنا." | Contact the firm |
| S1 board, nothing in horizon | "Nothing scheduled in the next 30 days. Overdue hearings would appear here first — none stand." | "لا شيء مجدول في الثلاثين يوماً القادمة. الجلسات المتأخرة تظهر هنا أولاً — لا شيء منها قائم." | Extend horizon |
| S2 chronicle, matter with no events yet | "This matter's chronicle is empty. Add the first hearing, filing, or note — deadlines generate from what you record." | "تسلسل هذه القضية فارغ. أضف أول جلسة أو مذكرة قضائية أو ملاحظة — المواعيد تتولد مما تسجّله." | Add event |
| S2 filtered-empty (timeline) | "No events match these filters. Every event stays in the chronicle — clear the filters to see them." | "لا أحداث تطابق هذه المرشّحات. كل الأحداث باقية في التسلسل — امسح المرشّحات لرؤيتها." | Clear filters |
| S2 outcome-due present (not an empty — a red state) | "1 hearing passed without a recorded outcome." | "جلسة واحدة مرّت بلا نتيجة مسجّلة." | Open the hearing |
| S4 documents first document | "No documents on this matter yet. Register the first one — an original seeds its custody chain with received, then registered." | "لا مستندات على هذه القضية بعد. سجّل الأول — الأصل يبثّ سلسلة عهدته بـ«استلام» ثم «تسجيل»." | Register document |
| S4 filtered-empty (unreturned originals only, all returned) | "Every original on this matter is returned. Nothing blocks closure from this side." | "كل الأصول على هذه القضية مسترجعة. لا شيء يعترض الإقفال من هذه الجهة." | View all documents |
| S5 chain, verification never run | "This chain has not been verified yet. Verification recomputes every entry's fingerprint and records the result." | "لم يُتحقق من هذه السلسلة بعد. التحقق يعيد حساب بصمة كل إدخال ويسجّل النتيجة." | Verify chain |
| S6 clients first-run | "No clients yet. A client holds the matters — create the firm or the person, in both languages." | "لا عملاء بعد. العميل يحمل القضايا — أنشئ الشركة أو الشخص، باللغتين." | Create client |
| S6 client search, no results | "No clients match this search. The search normalizes alef and hamza forms, taa marbuta, and yaa — the rules it applied are listed beside the field." | "لا عملاء يطابقون هذا البحث. يطبّع البحث صور الألف والهمزة والتاء المربوطة والياء — والقواعد المطبقة مدرجة بجوار الحقل." | Clear search |
| S7 rules, firm has only stock rules | "Only the stock rules run this workspace. Firm rules are where your practice's own discipline lives — author one." | "القواعد النمطية وحدها تعمل في مساحة العمل هذه. قواعد المكتب هي حيث تسكن معرفتك المهنية — أنشئ واحدة." | Author a rule |
| S8 gate, no blockers | "Nothing blocks closure. Future hearings: 0. Hearings awaiting an outcome: 0. Open deadlines: 0. Unreturned originals: 0." | "لا شيء يعترض الإقفال. جلسات قادمة: 0. جلسات بانتظار نتيجة: 0. مواعيد مفتوحة: 0. أصول غير مسترجعة: 0." | Close the matter |
| S9 jobs empty | "Nothing running. Exports appear here while they work — and stay listed after they finish." | "لا مهام قيد التنفيذ. تظهر التصديرات هنا أثناء عملها — وتبقى مدرجة بعد اكتمالها." | — |
| S10 activity first entry | "Nothing has happened in this workspace yet. Every consequential action you take lands here, with its actor and timestamp." | "لم يحدث شيء في مساحة العمل هذه بعد. كل فعل جوهري تقوم به يصل إلى هنا، مع فاعله ووقته." | — |

## B. Loading (P02/P12 — skeletons mirror the board, the chronicle, and the chain per direction)

| State | English | Arabic |
|---|---|---|
| S1 board skeleton | zone-grouped skeleton rows (overdue group first) + "Loading the hearing board…" (SR) | صفوف هيكلية مجموعّة بالمناطق (المتأخرة أولاً) + "جارٍ تحميل لوحة الجلسات…" |
| S2 chronicle skeleton | date-grouped card skeletons in the bed geometry + "Loading the chronicle…" | هياكل بطاقات مجمّعة بالتواريخ في هيكل السجل + "جارٍ تحميل التسلسل الزمني…" |
| S5 chain skeleton | strip-node skeletons in seq order | هياكل عُقد السلسلة بترتيب التسلسل |
| Outcome submit | "Recording the outcome…" (double-submit guard on the button) | "جارٍ تسجيل النتيجة…" |
| Reschedule submit | "Moving the hearing and regenerating what depends on it…" | "جارٍ نقل الجلسة وإعادة توليد ما يعتمد عليها…" |
| Deadline completion | "Recording the completion…" | "جارٍ تسجيل الإنجاز…" |
| Custody entry submit | "Appending to the chain…" | "جارٍ الإلحاق بالسلسلة…" |
| Chain verification | "Recomputing entry fingerprints — 40 of 52 entries…" | "إعادة حساب بصمات الإدخالات — 40 من 52 إدخالاً…" |
| Rule save | "Saving the rule…" → autosave states (P10) | "جارٍ حفظ القاعدة…" |
| Export job (determinate) | "Packaging the matter — format 2 of 3: the custody ledger." | "تجميع ملف القضية — التنسيق 2 من 3: سجل العهدة." |
| Gate re-evaluation | (derived read — updates within 120ms, no spinner) | (قراءة مشتقة — تتحدث خلال 120 مللي ثانية، بلا مؤشر دوران) |
| Board re-derivation on clock tick | (derived read — instant, no skeleton below 300ms) | (قراءة مشتقة — فورية، بلا هيكل تحت 300 مللي ثانية) |

## C. Errors (all 7 classes, every error names the next action)

| Class & trigger | English | Arabic |
|---|---|---|
| VALIDATION (bilingual field empty) | "The Arabic title is empty — this field is authored in both languages, never machine-filled. Write the Arabic side and save." | "العنوان العربي فارغ — هذا الحقل يُكتب باللغتين ولا يُملأ آلياً أبداً. اكتب الجهة العربية واحفظ." |
| VALIDATION (reschedule without reason) | "A reschedule needs its reason — adjourned dates are facts with history. Say why the hearing moved." | "نقل الجلسة يحتاج سببه — المواعيد المؤجلة وقائع لها تاريخ. قل لماذا انتقلت الجلسة." |
| VALIDATION (rule sanity: hearing-created with offset ≥ 0) | "A pre-hearing rule's offset must be negative — preparation happens before the hearing, not after it." | "إزاحة قاعدة ما قبل الجلسة يجب أن تكون سالبة — التجهيز يسبق الجلسة ولا يليها." |
| VALIDATION (minLeadDays negative) | "The minimum lead can't be negative — it is the floor a generated deadline never falls below." | "لا يمكن أن تكون المهلة الدنيا سالبة — فهي الأرضية التي لا يهبط دونها موعد متولد." |
| VALIDATION (presented without hearing link) | "Presenting a document requires its hearing — 'shown at which session' is the fact this entry exists to record." | "تقديم المستند يتطلب جلسته — «عُرض في أي جلسة» هي الواقعة التي وُجد هذا الإدخال لتسجيلها." |
| VALIDATION (returned on a copy) | "Only originals return to their originator — this document is a copy, and copies stay in the file." | "الأصول وحدها تُسترجع إلى مصدرها — هذا المستند نسخة، والنسخ تبقى في الملف." |
| VALIDATION (stage patch to closed) | "Closure goes through the gate, not the status field — open Closure and clear what blocks it." | "الإقفال يمر عبر البوابة لا عبر حقل الحالة — افتح صفحة الإقفال وصفِّ ما يعترضه." |
| VALIDATION (closure gate) | "Closure refused — 2 unreturned originals and 1 open deadline block it. First blocker: power of attorney, original, registered 3 Sep." | "رُفض الإقفال — أصلان غير مسترجعين وموعد مفتوح واحد يعترضونه. أول معترض: وكالة، أصل، سُجلت في 3 سبتمبر." |
| VALIDATION (rule delete count drift) | "The open-deadline count changed since you loaded this rule — it is 4 now, not 3. Recount and confirm." | "تغيّر عدد المواعيد المفتوحة منذ تحميلك هذه القاعدة — إنه 4 الآن لا 3. أعد العد وأكّد." |
| NOT_FOUND (stale link) | "That matter, event, or document is gone from this workspace. It may have been removed while you were away." | "تلك القضية أو الحدث أو المستند غاب عن مساحة العمل. ربما أُزيل أثناء غيابك." → العودة إلى لوحة الجلسات |
| NOT_FOUND (expired artifact) | "This export expired 3 days ago. Regenerate it — the matter state it came from is unchanged." | "انتهت صلاحية هذا التصدير قبل 3 أيام. أعد توليده — حالة القضية التي صدر عنها لم تتغيّر." |
| PERMISSION (viewer mutation) | "Your seat reads the timeline and hearing dates, nothing else. Mutation is not part of this seat — ask the firm for a working seat." | "مقعدك يقرأ التسلسل الزمني ومواعيد الجلسات، لا غير. التغيير ليس من نصيب هذا المقعد — اطلب من المكتب مقعداً عاملاً." |
| PERMISSION (paralegal on closure) | "Closing a matter is an attorney or owner act — your seat runs matters, events, documents, and custody to the last entry." | "إقفال القضية فعل محامٍ أو مالك — مقعدك يدير القضايا والأحداث والمستندات والعهدة حتى آخر إدخال." |
| PERMISSION (rule save, non-owner) | "Deadline rules are the managing partner's discipline — your seat reads them everywhere and authors them nowhere." | "قواعد المواعيد معرفة الشريك المدير — مقعدك يقرؤها في كل مكان ولا يؤلفها في أي مكان." |
| CONFLICT (concurrent event edit) | "Layla moved this hearing while you did. Both versions are kept — choose what stays." | "نقلت ليلى هذه الجلسة أثناء عملك. الاحتفاظ بالنسختين — اختر ما يبقى." |
| CONFLICT (standing outcome exists) | "This hearing already has a standing outcome. Record a correction — it appends and supersedes, it never rewrites." | "لهذه الجلسة نتيجة قائمة بالفعل. سجّل تصحيحاً — يُلحق ويُستبدل، ولا يعيد الكتابة أبداً." |
| CONFLICT (sealing a sealed version) | "This version is already sealed — sealed content never changes. Add a new version for the new content." | "هذا الإصدار مختوم بالفعل — المحتوى المختوم لا يتغيّر. أضف إصداراً جديداً للمحتوى الجديد." |
| CONFLICT (completing a completed deadline) | "This deadline is already completed — by Faisal, on 21 Oct. Facts are not silently re-facted." | "هذا الموعد منجز بالفعل — بواسطة فيصل، في 21 أكتوبر. الوقائع لا تُعاد وقائع بصمت." |
| RATE_LIMIT (export window) | "The export window is used for this cycle — the next package frees up on 1 Nov. Nothing about your matters changes." | "استُهلكت نافذة التصدير لهذه الدورة — تتحرر الحزمة التالية في 1 نوفمبر. لا شيء في قضاياك يتغيّر." |
| NETWORK (list fetch) | "The hearing board went stale — reconnecting. Every outcome you recorded is safe." | "تقادمت لوحة الجلسات — تجري إعادة الاتصال. كل نتيجة سجّلتها آمنة." |
| NETWORK (export partial) | "The package delivered 2 of 3 formats — the timeline and deadline report arrived; the custody ledger didn't. Retry just the ledger." | "سلّمت الحزمة تنسيقين من 3 — وصل التسلسل الزمني وتقرير المواعيد، ولم يصل سجل العهدة. أعد محاولة السجل وحده." |
| UNKNOWN | "Something failed on our side (ref lct-corr-0007). Retry — if it repeats, quote the reference." | "حدث خلل لدينا (مرجع lct-corr-0007). أعد المحاولة — وإن تكرر، اذكر المرجع." |

## D. Success & status (calm; state chips + counts, no confetti)

| Moment | English | Arabic |
|---|---|---|
| Matter created | "Matter 2041/45 opened — Riyadh Commercial Court, commercial. 3 deadlines generated by the stock rules." | "فُتحت القضية 2041/45 — المحكمة التجارية بالرياض، تجارية. تولّدت 3 مواعيد من القواعد النمطية." |
| Hearing rescheduled | "Hearing moved to 12 Nov 2026 — reason recorded. 3 future deadlines regenerated; completed ones stayed history." | "نُقلت الجلسة إلى 12 نوفمبر 2026 — السبب مسجّل. أعيد توليد 3 مواعيد قادمة؛ والمنجزة بقيت تاريخاً." |
| Deadline completed | "Pre-hearing preparation completed — by Layla, today at 14:05." | "أُنجز تجهيز ما قبل الجلسة — بواسطة ليلى، اليوم في 14:05." |
| Deadline generated (with clamp disclosed) | "Defense translation delivery set for 7 Nov — 5 days before the hearing, as the rule requires." | "حُدد تسليم ترجمة الدفوع في 7 نوفمبر — قبل الجلسة بـ5 أيام، كما تقتضي القاعدة." |
| Clamped deadline | "Pre-hearing preparation clamped to tomorrow — the hearing is 2 days out and the rule's minimum lead is 1." | "قُيّد تجهيز ما قبل الجلسة إلى الغد — الجلسة بعد يومين، والمهلة الدنيا للقاعدة يوم واحد." |
| Outcome recorded | "Hearing 4 of case 2041/45 adjourned to 12 Nov 2026 — next hearing in 21 days. Outcome recorded by Layla." | "الجلسة 4 في القضية 2041/45 مؤجلة إلى 12 نوفمبر 2026 — الجلسة التالية بعد 21 يوماً. سجّلت ليلى النتيجة." |
| Outcome corrected | "Correction appended — the original outcome stays in history, marked superseded. The standing outcome is the correction." | "أُلحق التصحيح — النتيجة الأصلية تبقى في التاريخ، موسومة مستبدلة. النتيجة القائمة هي التصحيح." |
| Document registered | "Power of attorney registered — original, 1 version, chain seeded: received, registered." | "سُجلت الوكالة — أصل، إصدار واحد، بُثّت السلسلة: استلام ثم تسجيل." |
| Version added | "Version 2 appended — 'as filed'. The lineage grew; version 1 is untouched." | "أُلحق الإصدار 2 — «كما قُدمت». امتد النسل؛ والإصدار 1 لم يُمسّ." |
| Version sealed | "Version 2 sealed — its fingerprint is anchored. New content now requires a new version." | "خُتم الإصدار 2 — بصمته مثبتة. المحتوى الجديد يتطلب الآن إصداراً جديداً." |
| Custody entry appended | "Checked out — to 'with counsel Layla'. Entry 5 in the chain." | "سُجل خروج — إلى «مع المحامية ليلى». الإدخال 5 في السلسلة." |
| Original returned | "Original returned to Marafi Trading Co. — the closure gate's original check clears for this document." | "استُرجع الأصل إلى شركة المراعي التجارية — تحقق بوابة الإقفال للأصول ينجلي عن هذا المستند." |
| Chain verified | "Chain intact — 52 entries verified in order, fingerprints recomputed." | "السلسلة سليمة — تحقق من 52 إدخالاً بالترتيب، وأعيد حساب البصمات." |
| Chain broken | "Chain broken at entry 17 — the fingerprint there does not match its version. The chain itself was not altered." | "انكسرت السلسلة عند الإدخال 17 — البصمة هناك لا تطابق إصدارها. السلسلة ذاتها لم تُغيَّر." |
| Rule saved | "Rule saved at version 3 — 3 future generated deadlines moved with it, and are named in the preview." | "حُفظت القاعدة في الإصدار 3 — انتقلت معها 3 مواعيد متولدة قادمة، وهي مسمّاة في المعاينة." |
| Rule deleted | "Rule deleted. Its 4 open generated deadlines stay, pinned to its name — they close only by completion." | "حُذفت القاعدة. مواعيدها المتولدة المفتوحة الأربعة تبقى، مثبتة باسمها — لا تُغلق إلا بالإنجاز." |
| Matter closed | "Abdullah closed matter 2041/45 on 22 Oct 2026, 09:41 — 6 hearing outcomes, 9 deadlines completed, 5 documents, 2 originals returned." | "أقفل عبد الله القضية 2041/45 في 22 أكتوبر 2026، 09:41 — 6 نتائج جلسات، 9 مواعيد منجزة، 5 مستندات، أصلان مسترجعان." |
| Closed matter re-opened | "A new note re-opened this matter — it is active with a pending-activity flag. The closure record of 22 Oct stands untouched." | "ملاحظة جديدة أعادت فتح هذه القضية — نشطة بعلامة نشاط لاحق. وسجل الإقفال بتاريخ 22 أكتوبر قائم لم يُمسّ." |
| Export ready | "Matter package ready — timeline, custody ledger, deadline report. Expires in 7 days; regenerable from state, forever." | "حزمة القضية جاهزة — التسلسل الزمني وسجل العهدة وتقرير المواعيد. تنتهي بعد 7 أيام؛ وتُعاد توليدها من الحالة، دائماً." |
| Artifact regenerated | "Package regenerated — identical to the state it came from. That is what deterministic means here." | "أُعيد توليد الحزمة — مطابقة للحالة التي صدرت عنها. هذا معنى الحتمية هنا." |
| Sample cleared | "Sample cleared — one action, and it never returns. Your first real matter is one field away." | "مُسحت العيّنة — فعل واحد، ولا تعود أبداً. قضيتك الأولى الحقيقية على بعد حقل واحد." |

## E. Signature moments (the product's few loud lines)

| Moment | English | Arabic |
|---|---|---|
| The Gavel Settles (05 T2 signature; polite announcement, identical under reduced motion) | "The hearing settles — ring drained, the card is history, and the next hearing is already running its own countdown." | "تقرّ الجلسة — فرُغ الحلقة، وصارت البطاقة تاريخاً، والجلسة التالية تعدّ تنازليها بالفعل." |
| Outcome-due surfaced (assertive, once per session) | "What did the court decide? Hearing 1 of case 982/1445 passed 9 days ago with no recorded outcome." | "ماذا قرّرت المحكمة؟ مرّت الجلسة 1 في القضية 982/1445 قبل 9 أيام بلا نتيجة مسجّلة." |
| Gate refusal (assertive) | "Not yet. 2 unreturned originals and 1 open deadline stand in the way. Each is listed — clear them and closure opens." | "ليس بعد. أصلان غير مسترجعين وموعد مفتوح واحد يقفان في الطريق. كلٌّ منها مدرج — صفِّها يُفتح الإقفال." |
| The gate clears | "The gate is clear — every hearing decided, every deadline done, every original home. This closure you can defend." | "البوابة صافية — كل جلسة مقرّرة، وكل موعد منجز، وكل أصل في مكانه. هذا إقفال يمكنك الدفاع عنه." |
| Determinism note (board re-derivation) | "Re-read the board — same state, same zones. The overdue hearing is still the overdue hearing." | "أُعيدت قراءة اللوحة — الحالة ذاتها، والمناطق ذاتها. الجلسة المتأخرة ما زالت الجلسة المتأخرة." |

## F. Bidi / mixed-script moments (rtl-rules §2 — copy authored for isolation)

| Moment | English | Arabic |
|---|---|---|
| Latin case number inside Arabic chrome | "The case number 2041/45 keeps one physical order inside the Arabic sentence — isolated, digits never reorder." | "رقم القضية 2041/45 يحافظ على ترتيب فيزيائي واحد داخل الجملة العربية — معزولاً، والأرقام لا تُعاد ترتيبها أبداً." |
| Arabic court name inside English chrome | "The Arabic court name renders right-to-left inside the English workspace — the field's direction follows its content, never the chrome." | "اسم المحكمة العربي يُعرض من اليمين إلى اليسار داخل مساحة عمل إنجليزية — اتجاه الحقل يتبع محتواه، لا الهيكل أبداً." |
| Day-counts and seq on the strip | "Day-counts, case numbers, and chain sequence numbers are Western in both directions — 21 is 21, entry 17 is entry 17, whichever way the chrome runs." | "العد التنازلي وأرقام القضايا وأرقام تسلسل السلسلة غربية في الاتجاهين — 21 هي 21، والإدخال 17 هو الإدخال 17، أيّاً كان اتجاه الهيكل." |
